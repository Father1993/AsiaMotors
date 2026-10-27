#!/bin/sh
set -eu
export APP_PASSWORD="$(cat /run/secrets/db_app_password)"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<'SQL'
\getenv app_password APP_PASSWORD
CREATE ROLE asiamotors LOGIN PASSWORD :'app_password';
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
SQL
