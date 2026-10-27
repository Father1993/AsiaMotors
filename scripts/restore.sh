#!/bin/sh
# Restore only into an empty, separately provisioned database and uploads volume.
set -eu
cd "$(dirname "$0")/.."
restore_dir="${1:?Pass the backup directory}"
(cd "$restore_dir" && sha256sum -c SHA256SUMS)
# Never silently overwrite a populated database.
if [ "$(docker compose exec -T db psql -U postgres -d asiamotors -Atc "SELECT count(*) FROM pg_tables WHERE schemaname='public'")" != 0 ]; then
  printf 'Restore refused: destination database is not empty.\n' >&2
  exit 1
fi
docker compose exec -T db pg_restore --exit-on-error --clean --if-exists -U postgres -d asiamotors < "$restore_dir/database.dump"
docker compose run --rm --no-deps -T --entrypoint tar mail-worker -C /app/uploads -xzf - < "$restore_dir/uploads.tar.gz"
printf 'Database and uploads restored; validate before starting web and mail-worker.\n'
