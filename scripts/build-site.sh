#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

cd "${REPO_ROOT}"

if ! command -v quarto >/dev/null 2>&1; then
  printf 'ERROR: quarto was not found on PATH.\n' >&2
  printf 'Install Quarto, then rerun this script.\n' >&2
  exit 127
fi

if ! command -v python >/dev/null 2>&1; then
  printf 'ERROR: python was not found on PATH.\n' >&2
  exit 127
fi

printf 'Validating and rendering Therapy Skill Kit...\n'
quarto render site

if [[ ! -f site/_site/index.html ]]; then
  printf 'ERROR: render completed without site/_site/index.html.\n' >&2
  exit 1
fi

printf 'Build complete: %s\n' "${REPO_ROOT}/site/_site/index.html"
