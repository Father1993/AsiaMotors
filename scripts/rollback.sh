#!/bin/sh
# Do not run a pre-scheduling editor while pending publications can still fire.
set -eu
cd "$(dirname "$0")/.."
[ "$#" -eq 1 ] && [ -f "$1" ] || {
  printf 'Usage: %s backups/release-.../rollback.compose.json\n' "$0" >&2
  exit 2
}
rollback_config=$1
activated=false
recover() {
  if [ "$activated" = false ]; then docker compose start web >/dev/null; fi
}
trap recover EXIT HUP INT TERM
# Stop article writers before checking, so no new schedule can race the check.
docker compose stop web
has_schedule=$(docker compose exec -T db psql -U postgres -d asiamotors -Atc "SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='posts' AND column_name='scheduled_at')")
if [ "$has_schedule" = t ]; then
  pending=$(docker compose exec -T db psql -U postgres -d asiamotors -Atc 'SELECT count(*) FROM posts WHERE scheduled_at IS NOT NULL')
  if [ "$pending" != 0 ]; then
    printf 'Rollback refused: cancel pending article publications in the current editor first. The current web will be restarted; no data was changed.\n' >&2
    exit 1
  fi
fi
docker compose -f "$rollback_config" up -d --no-build --no-deps --wait --wait-timeout 180 web mail-worker
activated=true
