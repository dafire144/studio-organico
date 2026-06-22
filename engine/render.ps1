<#
  studio-organico — render (Windows). HTML -> PNG 1080x1350 via Chrome headless.
  Renderiza todos os out/html/*.html para out/png/.
  Uso:  .\render.ps1 [-OutDir .\out]
#>
param([string]$OutDir = ".\out")
$OutDir = (Resolve-Path $OutDir).Path
$htmlDir = Join-Path $OutDir "html"
$pngDir  = Join-Path $OutDir "png"
New-Item -ItemType Directory -Force $pngDir | Out-Null

$cand = @(
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)
$chrome = $cand | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $chrome) { Write-Error "Chrome/Edge não encontrado"; exit 1 }

$i = 0
Get-ChildItem $htmlDir -Filter *.html | ForEach-Object {
  $i++
  $out = Join-Path $pngDir ($_.BaseName + ".png")
  $cud = Join-Path $env:TEMP "studio-cud-$i"
  $a = @("--headless=new","--disable-gpu","--no-sandbox","--hide-scrollbars",
    "--force-device-scale-factor=1","--allow-file-access-from-files",
    "--user-data-dir=$cud","--window-size=1080,1350","--virtual-time-budget=16000",
    "--screenshot=$out", $_.FullName)
  Start-Process -FilePath $chrome -ArgumentList $a -Wait -NoNewWindow | Out-Null
  "OK $($_.BaseName).png"
}
"Pronto em: $pngDir"
