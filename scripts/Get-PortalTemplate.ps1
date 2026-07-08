[CmdletBinding()]
param(
    [ValidatePattern('^[A-Za-z0-9._-]+$')]
    [string]$User = '',

    [string]$Template = '',

    [string]$OutputDirectory = '',

    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepositoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$CacheRoot = Join-Path $RepositoryRoot (Join-Path '.cache' 'templates')

function ConvertTo-SafeName {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    return ($Name.Trim().TrimEnd('/') -replace '[^A-Za-z0-9._-]+', '-')
}

function Get-TemplateFromInfo {
    param(
        [Parameter(Mandatory = $true)]
        [string]$InfoPath
    )

    $Lines = Get-Content -LiteralPath $InfoPath -Encoding UTF8
    $InTemplateBlock = $false
    foreach ($Line in $Lines) {
        if ($Line -match '^\s*##\s+template\s*$') {
            $InTemplateBlock = $true
            continue
        }

        if ($InTemplateBlock -and $Line -match '^\s*##\s+') {
            break
        }

        if ($InTemplateBlock) {
            $TrimmedLine = $Line.Trim()
            if ($TrimmedLine.Length -gt 0 -and -not $TrimmedLine.StartsWith('<!--')) {
                return $TrimmedLine
            }
        }
    }

    return ''
}

function Resolve-TemplateSpec {
    param(
        [Parameter(Mandatory = $true)]
        [string]$TemplateSpec
    )

    $Normalized = $TemplateSpec.Trim().TrimEnd('/')
    if ($Normalized -match '^(https?://)?(www\.)?html5up\.net/(?<slug>[^/]+)$' -or $Normalized -match '^html5up/(?<slug>[^/]+)$') {
        return [PSCustomObject]@{
            source = 'html5up'
            slug = $Matches['slug']
            downloadUri = "https://html5up.net/$($Matches['slug'])/download"
            mode = 'zip'
        }
    }

    if ($Normalized -match '^(https?://)?(www\.)?startbootstrap\.com/(theme/)?(?<slug>[^/]+)$' -or $Normalized -match '^startbootstrap/(?<slug>[^/]+)$') {
        return [PSCustomObject]@{
            source = 'startbootstrap'
            slug = $Matches['slug']
            downloadUri = "https://github.com/startbootstrap/startbootstrap-$($Matches['slug'])/archive/gh-pages.zip"
            mode = 'zip'
        }
    }

    if ($Normalized -match '^(https?://)?(www\.)?themewagon\.com/(themes/)?(?<slug>[^/]+)$' -or $Normalized -match '^themewagon/(?<slug>[^/]+)$' -or $Normalized -match '^(https?://)?themewagon\.github\.io/(?<slug>[^/]+)$') {
        return [PSCustomObject]@{
            source = 'themewagon'
            slug = $Matches['slug']
            downloadUri = "https://themewagon.github.io/$($Matches['slug'])/"
            mode = 'mirror'
        }
    }

    throw "未対応のテンプレート指定です: $TemplateSpec"
}

function Invoke-DownloadFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Uri,

        [Parameter(Mandatory = $true)]
        [string]$Destination
    )

    $DestinationDirectory = Split-Path -Parent $Destination
    New-Item -ItemType Directory -Path $DestinationDirectory -Force | Out-Null
    Invoke-WebRequest -Uri $Uri -OutFile $Destination -UseBasicParsing
}

function Save-ThemeWagonMirror {
    param(
        [Parameter(Mandatory = $true)]
        [string]$BaseUri,

        [Parameter(Mandatory = $true)]
        [string]$DestinationDirectory
    )

    New-Item -ItemType Directory -Path $DestinationDirectory -Force | Out-Null
    $Response = Invoke-WebRequest -Uri $BaseUri -UseBasicParsing
    $Html = $Response.Content
    Set-Content -LiteralPath (Join-Path $DestinationDirectory 'index.html') -Value $Html -Encoding UTF8

    $AssetMatches = [regex]::Matches($Html, "(?i)(?:href|src)=[""'](?<path>[^""']+)[""']")
    foreach ($AssetMatch in $AssetMatches) {
        $AssetPath = $AssetMatch.Groups['path'].Value.Trim()
        if ([string]::IsNullOrWhiteSpace($AssetPath)) {
            continue
        }
        if ($AssetPath -match '^(#|mailto:|tel:|javascript:|data:|https?://|//)') {
            continue
        }

        $CleanAssetPath = ($AssetPath -split '[?#]')[0]
        if ([string]::IsNullOrWhiteSpace($CleanAssetPath) -or $CleanAssetPath.EndsWith('/')) {
            continue
        }

        $AssetUri = [System.Uri]::new([System.Uri]$BaseUri, $AssetPath)
        $LocalRelativePath = $CleanAssetPath.TrimStart('/') -replace '/', [System.IO.Path]::DirectorySeparatorChar
        $LocalPath = Join-Path $DestinationDirectory $LocalRelativePath
        $LocalDirectory = Split-Path -Parent $LocalPath
        New-Item -ItemType Directory -Path $LocalDirectory -Force | Out-Null

        try {
            Invoke-WebRequest -Uri $AssetUri.AbsoluteUri -OutFile $LocalPath -UseBasicParsing
        }
        catch {
            Write-Warning "素材の取得に失敗しました: $($AssetUri.AbsoluteUri)"
        }
    }
}

if ([string]::IsNullOrWhiteSpace($Template)) {
    if ([string]::IsNullOrWhiteSpace($User)) {
        throw 'テンプレートを直接指定するか、-User で対象ユーザーを指定してください。'
    }

    $InfoPath = Join-Path $RepositoryRoot (Join-Path (Join-Path 'users' $User) 'info.md')
    if (-not (Test-Path -LiteralPath $InfoPath -PathType Leaf)) {
        throw "入力ファイルが存在しません: $InfoPath"
    }

    $Template = Get-TemplateFromInfo -InfoPath $InfoPath
}

if ([string]::IsNullOrWhiteSpace($Template)) {
    throw 'テンプレート指定が空です。'
}

$Spec = Resolve-TemplateSpec -TemplateSpec $Template
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $OutputDirectory = Join-Path $CacheRoot (ConvertTo-SafeName -Name $Template)
}

if ((Test-Path -LiteralPath $OutputDirectory -PathType Container) -and $Force) {
    Remove-Item -LiteralPath $OutputDirectory -Recurse -Force
}

New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null

if ($Spec.mode -eq 'zip') {
    $ZipPath = Join-Path $CacheRoot ("$($Spec.source)-$($Spec.slug).zip")
    Invoke-DownloadFile -Uri $Spec.downloadUri -Destination $ZipPath
    Expand-Archive -LiteralPath $ZipPath -DestinationPath $OutputDirectory -Force
}
elseif ($Spec.mode -eq 'mirror') {
    Save-ThemeWagonMirror -BaseUri $Spec.downloadUri -DestinationDirectory $OutputDirectory
}
else {
    throw "未対応の取得方式です: $($Spec.mode)"
}

$Result = [PSCustomObject]@{
    template = $Template
    source = $Spec.source
    slug = $Spec.slug
    downloadUri = $Spec.downloadUri
    outputDirectory = $OutputDirectory
    status = '取得完了'
}

$Result | ConvertTo-Json -Depth 5
