param(
  [Parameter(Mandatory = $true)]
  [string]$UserId,

  [string]$WorkspaceRoot = (Split-Path -Parent $PSScriptRoot),

  [switch]$Force
)

$ErrorActionPreference = 'Stop'

function Get-TemplateValue {
  param([string]$InfoPath)

  $lines = Get-Content -Path $InfoPath -Encoding UTF8
  $inTemplate = $false

  foreach ($line in $lines) {
    $normalizedLine = $line.Trim() -replace '^[\uFEFF]+', ''

    if ($normalizedLine -match '^##\s+template\s*$') {
      $inTemplate = $true
      continue
    }

    if ($inTemplate -and $normalizedLine -match '^##\s+') {
      break
    }

    if ($inTemplate) {
      $value = $normalizedLine
      if ($value) {
        return $value
      }
    }
  }

  throw "template section was not found in $InfoPath"
}

function Resolve-TemplateDownloadUrl {
  param([string]$TemplateValue)

  $value = $TemplateValue.Trim()

  if ($value -match '^https?://') {
    if ($value -match '/download/?$') {
      return $value.TrimEnd('/')
    }

    return ($value.TrimEnd('/') + '/download')
  }

  if ($value -match '^(?:https?://)?html5up\.net/([a-z0-9-]+)/?$') {
    return "https://html5up.net/$($Matches[1])/download"
  }

  throw "unsupported template provider: $TemplateValue"
}

function Get-TemplateSlug {
  param([string]$TemplateValue)

  $value = $TemplateValue.Trim().ToLowerInvariant().TrimEnd('/')
  return ($value -replace '^https?://', '') -replace '[^a-z0-9/-]', '-'
}

$infoPath = Join-Path $WorkspaceRoot "users/$UserId/info.md"
if (-not (Test-Path $infoPath)) {
  throw "info.md not found: $infoPath"
}

$templateValue = Get-TemplateValue -InfoPath $infoPath
$downloadUrl = Resolve-TemplateDownloadUrl -TemplateValue $templateValue
$templateSlug = Get-TemplateSlug -TemplateValue $templateValue

$cacheRoot = Join-Path $WorkspaceRoot ".cache/templates"
$zipFileName = (($templateSlug -replace '/', '_') + '.zip')
$zipPath = Join-Path $cacheRoot $zipFileName
$tempExtractRoot = Join-Path $env:TEMP ("webgen-template-" + [guid]::NewGuid().ToString('N'))
$targetRoot = Join-Path $WorkspaceRoot "sites/$UserId"
$backupRoot = Join-Path $WorkspaceRoot "sites/$UserId.pre-template-backup"

New-Item -ItemType Directory -Path $cacheRoot -Force | Out-Null
New-Item -ItemType Directory -Path $tempExtractRoot -Force | Out-Null

Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
Expand-Archive -Path $zipPath -DestinationPath $tempExtractRoot -Force

$extractedItems = Get-ChildItem -Path $tempExtractRoot
if ($extractedItems.Count -eq 1 -and $extractedItems[0].PSIsContainer) {
  $sourceRoot = $extractedItems[0].FullName
} else {
  $sourceRoot = $tempExtractRoot
}

if ((Test-Path $targetRoot) -and -not $Force) {
  $existingChildren = Get-ChildItem -Path $targetRoot -Force -ErrorAction SilentlyContinue
  if ($existingChildren.Count -gt 0) {
    throw "target already contains files: $targetRoot . Re-run with -Force to replace it."
  }
}

if ((Test-Path $targetRoot) -and $Force) {
  if (Test-Path $backupRoot) {
    Remove-Item -Path $backupRoot -Recurse -Force
  }

  Move-Item -Path $targetRoot -Destination $backupRoot
}

New-Item -ItemType Directory -Path $targetRoot -Force | Out-Null
Copy-Item -Path (Join-Path $sourceRoot '*') -Destination $targetRoot -Recurse -Force

$assetsSource = Join-Path $WorkspaceRoot "users/$UserId/assets"
if (Test-Path $assetsSource) {
  $siteAssetsTarget = Join-Path $targetRoot 'user-assets'
  New-Item -ItemType Directory -Path $siteAssetsTarget -Force | Out-Null
  Copy-Item -Path (Join-Path $assetsSource '*') -Destination $siteAssetsTarget -Recurse -Force
}

$reportPath = Join-Path $targetRoot 'generation-report.md'
@"
# Generation Report - $UserId

## Template
- requested: $templateValue
- download: $downloadUrl
- cache: $zipPath

## Inputs
- info: users/$UserId/info.md
- assets: users/$UserId/assets/

## Bootstrap Result
- target: sites/$UserId/
- backup: $(if (Test-Path $backupRoot) { $backupRoot } else { 'none' })
- asset copy target: sites/$UserId/user-assets/

## Notes
- Template files were extracted before content customization.
- Next step is to replace template placeholder copy with content derived from info.md.
"@ | Set-Content -Path $reportPath -Encoding UTF8

Write-Output "Template bootstrap completed for $UserId"
Write-Output "Template: $templateValue"
Write-Output "Download: $downloadUrl"
Write-Output "Target: $targetRoot"
