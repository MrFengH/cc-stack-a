# Voice audition v2 — Edge TTS candidates. Same three phrases for every engine (opening / middle / close).
# Output: public/audio/voice-tests-v2/<candidate>__<phrase>.mp3
$ErrorActionPreference = "Stop"
$tts = "$PSScriptRoot\..\.venv\Scripts\edge-tts.exe"
$out = "$PSScriptRoot\..\public\audio\voice-tests-v2"
New-Item -ItemType Directory -Force $out | Out-Null
$phrases = [ordered]@{
  "1-apertura" = "Todo perfume se cuenta en tres notas."
  "2-centro"   = "El corazón: elegir bien."
  "3-cierre"   = "Nota Alta. Perfumería online en Panamá."
}
# Edge exposes only rate / pitch / volume (no style or emotion control): direction = slower, slightly lower.
$candidates = @(
  @{ id = "edge-margarita-baseline"; voice = "es-PA-MargaritaNeural"; rate = "-6%";  pitch = "+0Hz" },
  @{ id = "edge-dalia-directed";     voice = "es-MX-DaliaNeural";     rate = "-12%"; pitch = "-4Hz" },
  @{ id = "edge-salome-directed";    voice = "es-CO-SalomeNeural";    rate = "-12%"; pitch = "-3Hz" }
)
foreach ($c in $candidates) {
  foreach ($k in $phrases.Keys) {
    & $tts --voice $c.voice "--rate=$($c.rate)" "--pitch=$($c.pitch)" --text $phrases[$k] --write-media "$out\$($c.id)__$k.mp3"
  }
}
Get-ChildItem $out | Select-Object Name
