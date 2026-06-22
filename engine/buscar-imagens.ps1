<#
  studio-organico — motor de imagens (Windows). Busca no Pinterest imagens que se
  RELACIONAM com a copy (ver REGRA-MÃE no SKILL.md). Baixa via gallery-dl, organiza
  por "slot" e lista as melhores candidatas verticais.
  Requer: py -m pip install --user gallery-dl   (e rembg p/ recorte, opcional)

  Uso:
    .\buscar-imagens.ps1 -Termos @("capa::steve jobs portrait dark","prova::data center server dark") -Qtd 14
  Baixa em .\acervo\<slot>\
#>
param(
  [Parameter(Mandatory=$true)][string[]]$Termos,  # "slot::termo de busca"
  [int]$Qtd = 12,
  [double]$RatioMin = 1.0,
  [string]$Dest = ".\acervo"
)
foreach($t in $Termos){
  $p = $t -split "::",2; if($p.Count -lt 2){ Write-Host "ignorado (sem ::): $t"; continue }
  $slot=$p[0].Trim(); $q=$p[1].Trim(); $d=Join-Path $Dest $slot
  New-Item -ItemType Directory -Force $d | Out-Null
  Write-Host "== [$slot] '$q' =="
  py -m gallery_dl --range "1-$Qtd" --filter "extension in ('jpg','jpeg','png','webp')" -D $d "https://www.pinterest.com/search/pins/?q=$([uri]::EscapeDataString($q))"
}
Write-Host "`n== melhores candidatas (vertical) =="
Add-Type -AssemblyName System.Drawing
foreach($sd in (Get-ChildItem $Dest -Directory | Sort-Object Name)){
  Write-Host "`n### $($sd.Name)"
  Get-ChildItem $sd.FullName -File | ForEach-Object {
    try{ $im=[System.Drawing.Image]::FromFile($_.FullName); [PSCustomObject]@{File=$_.Name;W=$im.Width;H=$im.Height;Ratio=[math]::Round($im.Height/$im.Width,2)}; $im.Dispose() }catch{}
  } | Where-Object{ $_.Ratio -ge $RatioMin } | Sort-Object {$_.W*$_.H} -Descending | Select-Object -First 6 | Format-Table -AutoSize
}
Write-Host "Acervo: $Dest  — recorte de fundo (opcional): py + 'from rembg import remove'"
