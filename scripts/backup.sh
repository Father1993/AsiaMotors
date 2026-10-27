#!/bin/sh
# Run as root from the production checkout. Never use compose down -v.
set -eu
cd "$(dirname "$0")/.."
umask 077
backup_dir="backups/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$backup_dir"
# Stop writers while taking the database + media pair.
restart_services() { docker compose start web mail-worker >/dev/null; }
trap restart_services EXIT HUP INT TERM
docker compose stop web mail-worker
docker compose exec -T db pg_dump -U postgres -d asiamotors -Fc > "$backup_dir/database.dump"
docker compose run --rm --no-deps -T --entrypoint tar mail-worker -C /app/uploads -czf - . > "$backup_dir/uploads.tar.gz"
cp .env "$backup_dir/web.env"
cp -R .secrets "$backup_dir/secrets"
find "$backup_dir/secrets" -type f -exec chmod 600 {} \;
cp compose.yaml "$backup_dir/compose.yaml"
git rev-parse HEAD > "$backup_dir/commit.txt"
(cd "$backup_dir" && sha256sum database.dump uploads.tar.gz > SHA256SUMS)
printf 'Backup created: %s\n' "$backup_dir"
