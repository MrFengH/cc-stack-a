# Generates the narration, one phrase per file, with Edge TTS (es-PA-MargaritaNeural) into public/audio/vo/.
# One file per phrase so each can be placed on the 100 BPM grid in the timeline.
$ErrorActionPreference = "Stop"
$tts = "$PSScriptRoot\..\.venv\Scripts\edge-tts.exe"
$out = "$PSScriptRoot\..\public\audio\vo"
Remove-Item "$out\*.mp3" -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $out | Out-Null
$lines = [ordered]@{
  "tres-notas" = "Todo perfume se cuenta en tres notas."
  "salida"     = "La salida: descubrir."
  "familia"    = "Por familia."
  "marca"      = "Por marca."
  "nota"       = "O por una sola nota."
  "corazon"    = "El corazón: elegir bien."
  "piramide"   = "Su pirámide."
  "precio"     = "Su precio real."
  "cupon"      = "Tu cupón."
  "yappy"      = "Y pagas con Yappy."
  "fondo"      = "Y el fondo: lo que queda."
  "pedido"     = "Cada pedido, en camino."
  "venta"      = "Cada venta, a la vista."
  "cierre"     = "Nota Alta. Perfumería online en Panamá."
}
foreach ($k in $lines.Keys) {
  & $tts --voice es-PA-MargaritaNeural --rate=-6% --text $lines[$k] --write-media "$out\$k.mp3"
}

