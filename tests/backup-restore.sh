#!/bin/sh
# Isolated test only: snapshot + restore into a temporary database, never production.
set -eu
cd "$(dirname "$0")/.."
compose() { docker compose -p asiamotors-test -f compose.yaml -f compose.test.yaml "$@"; }
umask 077
scratch=$(mktemp -d)
restore_db="restore_test_$(date +%s)_$$"
cleanup() {
  compose exec -T db dropdb -U postgres --if-exists "$restore_db" >/dev/null
  compose start web mail-worker >/dev/null
  rm -rf "$scratch"
}
trap cleanup EXIT HUP INT TERM
compose stop web mail-worker >/dev/null
compose exec -T db pg_dump -U postgres -d asiamotors -Fc > "$scratch/database.dump"
tar -C .test-uploads -czf "$scratch/uploads.tar.gz" .
compose exec -T db createdb -U postgres "$restore_db"
compose exec -T db pg_restore --exit-on-error -U postgres -d "$restore_db" < "$scratch/database.dump"
# Compare every application's table, including schema checksums and saved draft JSON.
for table in countries cars media leads mail_outbox request_limits schema_migrations; do
  sql="SELECT md5(coalesce(string_agg(row_to_json(t)::text, '' ORDER BY row_to_json(t)::text), '')) FROM $table t"
  original=$(compose exec -T db psql -U postgres -d asiamotors -Atc "$sql")
  restored=$(compose exec -T db psql -U postgres -d "$restore_db" -Atc "$sql")
  test "$original" = "$restored"
done
mkdir "$scratch/uploads"
tar -C "$scratch/uploads" -xzf "$scratch/uploads.tar.gz"
diff -qr .test-uploads "$scratch/uploads"
printf 'PASS: database dump restores all rows and migration checksums; media archive restores identical files\n'
