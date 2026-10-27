#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
# A fresh database starts empty except for the four country categories.
docker compose config --quiet
docker compose build web mail-worker migrate
# Verify SMTP authentication before switching the running web container.
docker compose run --rm --no-deps mail-worker node scripts/mail-worker.mjs --verify
docker compose up -d --wait --wait-timeout 180
docker compose ps
curl --fail --silent --show-error http://127.0.0.1:3000/api/health
printf '\n'
