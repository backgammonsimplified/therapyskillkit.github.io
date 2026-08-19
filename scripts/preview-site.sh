#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
PORT="${1:-8765}"

if ! [[ "${PORT}" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then
  printf 'ERROR: port must be an integer from 1 to 65535.\n' >&2
  exit 2
fi

if ! command -v quarto >/dev/null 2>&1; then
  printf 'ERROR: quarto was not found on PATH.\n' >&2
  exit 127
fi

cd "${REPO_ROOT}"
printf 'Preview: http://127.0.0.1:%s/\n' "${PORT}"
quarto preview site --host 127.0.0.1 --port "${PORT}" --no-browser
