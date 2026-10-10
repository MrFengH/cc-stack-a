# Final audio master: loudness to -15 LUFS integrated, true peak <= -1.5 dBTP (loudnorm's limiter).
# The video stream is copied untouched. Usage: scripts\master.ps1 out\nota-alta-opus-raw.mp4 out\nota-alta-opus.mp4
param([string]$in, [string]$out)
$ErrorActionPreference = "Stop"
$ff = "$PSScriptRoot\..\node_modules\@remotion\compositor-win32-x64-msvc\ffmpeg.exe"
& $ff -y -loglevel error -i $in -c:v copy -af "loudnorm=I=-15:TP=-1.5:LRA=11,aresample=48000" -c:a aac -b:a 320k -movflags +faststart $out
$ErrorActionPreference = "Continue" # ffmpeg reports on stderr
& $ff -hide_banner -i $out -vn -af loudnorm=print_format=summary -f wav -y "$PSScriptRoot\..\scratch\master-check.wav" 2>&1 | ForEach-Object { "$_" } | Select-String 'Input Integrated|Input True Peak|Input LRA'
