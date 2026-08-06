#!/bin/zsh
# Run the site locally.
#
# `npm run dev` cannot run from the Google Drive path at all: Turbopack walks up
# to the CloudStorage mount and gets "Operation not permitted (os error 1)".
# So mirror the project onto local disk and run it from there.
#
#   ./scripts/preview.sh          mirror + dev server on http://localhost:3000
#   ./scripts/preview.sh sync     mirror only, for a dev server already running
#
# The Drive copy stays the source of truth: this only ever copies one way.

set -e

SRC="${0:A:h:h}"
DST="${TMPDIR:-/tmp}/julian-portfolio-preview"

mkdir -p "$DST"
rsync -a --delete \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude projects_res --exclude res --exclude 'tsconfig.tsbuildinfo' \
  "$SRC/" "$DST/"

if [[ "$1" == "sync" ]]; then
  echo "mirrored to $DST"
  exit 0
fi

cd "$DST"
[[ -d node_modules ]] || npm install

# Turbopack will happily serve a stale CSS chunk after a mirror, and the symptom
# is new CSS rules computing to nothing. Starting from a clean .next avoids it.
rm -rf .next
npm run dev
