[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z0-9._-]+$')]
    [string]$User,

    [switch]$AsJson
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$RepositoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$SiteDirectory = Join-Path $RepositoryRoot (Join-Path 'sites' $User)
$Issues = New-Object System.Collections.Generic.List[object]

function Get-RelativeRepositoryPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    $FullPath = [System.IO.Path]::GetFullPath($Path)
    $RootPath = [System.IO.Path]::GetFullPath($RepositoryRoot)
    if ($FullPath.StartsWith($RootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
        return (($FullPath.Substring($RootPath.Length) -replace '^[\\/]+', '') -replace '\\', '/')
    }

    return ($FullPath -replace '\\', '/')
}

function Add-Issue {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Severity,

        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$Message
    )

    $Issues.Add([PSCustomObject]@{
        severity = $Severity
        path = Get-RelativeRepositoryPath -Path $Path
        message = $Message
    }) | Out-Null
}

function Test-LocalReference {
    param(
        [Parameter(Mandatory = $true)]
        [string]$SourceFile,

        [Parameter(Mandatory = $true)]
        [string]$Reference
    )

    $TrimmedReference = $Reference.Trim()
    if ([string]::IsNullOrWhiteSpace($TrimmedReference)) {
        return
    }
    if ($TrimmedReference -match '^(#|mailto:|tel:|javascript:|data:|https?://|//)') {
        return
    }

    $CleanReference = ($TrimmedReference -split '[?#]')[0]
    if ([string]::IsNullOrWhiteSpace($CleanReference)) {
        return
    }

    if ($CleanReference.StartsWith('/')) {
        $TargetPath = Join-Path $SiteDirectory $CleanReference.TrimStart('/')
    }
    else {
        $TargetPath = Join-Path (Split-Path -Parent $SourceFile) $CleanReference
    }

    if (-not (Test-Path -LiteralPath $TargetPath)) {
        Add-Issue -Severity 'エラー' -Path $SourceFile -Message "参照先が存在しません: $Reference"
    }
}

if (-not (Test-Path -LiteralPath $SiteDirectory -PathType Container)) {
    Add-Issue -Severity 'エラー' -Path $SiteDirectory -Message '生成サイトのディレクトリが存在しません。'
}
else {
    $IndexPath = Join-Path $SiteDirectory 'index.html'
    if (-not (Test-Path -LiteralPath $IndexPath -PathType Leaf)) {
        Add-Issue -Severity 'エラー' -Path $SiteDirectory -Message 'index.html が存在しません。'
    }

    $HtmlFiles = Get-ChildItem -LiteralPath $SiteDirectory -Recurse -File | Where-Object { $_.Extension -ieq '.html' }
    if ($HtmlFiles.Count -eq 0) {
        Add-Issue -Severity 'エラー' -Path $SiteDirectory -Message 'HTMLファイルが存在しません。'
    }

    foreach ($HtmlFile in $HtmlFiles) {
        $Content = Get-Content -LiteralPath $HtmlFile.FullName -Raw -Encoding UTF8
        if ($Content -match '\{\{[^}]+\}\}') {
            Add-Issue -Severity 'エラー' -Path $HtmlFile.FullName -Message '未置換のプレースホルダー {{...}} が残っています。'
        }
        if ($Content -match 'users[\\/]') {
            Add-Issue -Severity '警告' -Path $HtmlFile.FullName -Message 'users配下を直接参照している可能性があります。'
        }

        $ReferenceMatches = [regex]::Matches($Content, "(?i)\b(?:href|src)=[""'](?<value>[^""']+)[""']")
        foreach ($ReferenceMatch in $ReferenceMatches) {
            Test-LocalReference -SourceFile $HtmlFile.FullName -Reference $ReferenceMatch.Groups['value'].Value
        }
    }

    $CssFiles = Get-ChildItem -LiteralPath $SiteDirectory -Recurse -File | Where-Object { $_.Extension -ieq '.css' }
    foreach ($CssFile in $CssFiles) {
        $Content = Get-Content -LiteralPath $CssFile.FullName -Raw -Encoding UTF8
        if ($Content -match '\{\{[^}]+\}\}') {
            Add-Issue -Severity 'エラー' -Path $CssFile.FullName -Message '未置換のプレースホルダー {{...}} が残っています。'
        }

        $UrlMatches = [regex]::Matches($Content, '(?i)url\((?<value>[^\)]+)\)')
        foreach ($UrlMatch in $UrlMatches) {
            $Reference = $UrlMatch.Groups['value'].Value.Trim().Trim('"').Trim("'")
            Test-LocalReference -SourceFile $CssFile.FullName -Reference $Reference
        }
    }
}

if ($AsJson) {
    [PSCustomObject]@{
        user = $User
        siteDirectory = $SiteDirectory
        issueCount = $Issues.Count
        issues = @($Issues)
    } | ConvertTo-Json -Depth 6
}
else {
    if ($Issues.Count -eq 0) {
        Write-Host "検証結果: 正常 ($SiteDirectory)"
    }
    else {
        Write-Host "検証結果: 問題あり ($($Issues.Count)件)"
        foreach ($Issue in $Issues) {
            Write-Host "[$($Issue.severity)] $($Issue.path) - $($Issue.message)"
        }
    }
}

$ErrorIssues = @($Issues | Where-Object { $_.severity -eq 'エラー' })
if ($ErrorIssues.Count -gt 0) {
    exit 1
}

exit 0
