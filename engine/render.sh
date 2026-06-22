#!/usr/bin/env bash
# studio-organico — render (macOS/Linux). HTML -> PNG 1080x1350 via Chrome headless.
# Uso:  bash render.sh [outDir]   (default ./out)
set -e
OUT="${1:-./out}"
HTML="$OUT/html"; PNG="$OUT/png"
mkdir -p "$PNG"

# acha o Chrome
for c in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "$(command -v google-chrome || true)" \
  "$(command -v chromium || true)" \
  "$(command -v chromium-browser || true)"; do
  if [ -n "$c" ] && [ -x "$c" ]; then CHROME="$c"; break; fi
done
[ -z "${CHROME:-}" ] && { echo "Chrome não encontrado"; exit 1; }

i=0
for f in "$HTML"/*.html; do
  i=$((i+1))
  base="$(basename "$f" .html)"
  "$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --force-device-scale-factor=1 --allow-file-access-from-files \
    --user-data-dir="/tmp/studio-cud-$i" --window-size=1080,1350 \
    --virtual-time-budget=16000 --screenshot="$PNG/$base.png" "$f" >/dev/null 2>&1
  echo "OK $base.png"
done
echo "Pronto em: $PNG"
