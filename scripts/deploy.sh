#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
case "${1:---without-mail}" in
  --without-mail) mail_setting=false ;;
  --with-mail) mail_setting=true ;;
  *) printf 'Usage: %s [--without-mail|--with-mail]\n' "$0" >&2; exit 2 ;;
esac
# A fresh database starts empty except for the four country categories.
docker compose config --quiet
# Keep the running web image address before builds replace mutable tags.
previous_web_image=""
previous_web_container=$(docker compose ps -q web)
if [ -n "$previous_web_container" ]; then
  previous_web_image=$(docker inspect --format '{{.Image}}' "$previous_web_container")
fi
docker compose build web mail-worker migrate
if [ "$mail_setting" = true ]; then
  # Verify SMTP before persisting permission to send or replacing services.
  docker compose run --rm --no-deps mail-worker node scripts/mail-worker.mjs --verify
fi
python3 - "$mail_setting" <<'PY'
from pathlib import Path
import sys
p=Path('.env')
lines=[s for s in p.read_text().splitlines() if not s.startswith('MAIL_DELIVERY_ENABLED=')]
p.write_text('\n'.join(lines)+'\nMAIL_DELIVERY_ENABLED='+sys.argv[1]+'\n')
p.chmod(0o600)
PY
# Migrate while the old web remains available. Start the media-aware worker before
# enabling article writes in the new web; the old worker only protects car photos.
docker compose up -d --wait --wait-timeout 180 db
docker compose run --rm -T migrate
docker compose up -d --no-deps --wait --wait-timeout 180 mail-worker
# Roll back only the web, keeping the new worker that protects article media.
if [ -n "$previous_web_image" ]; then
  umask 077
  release_name="$(date -u +%Y%m%dT%H%M%SZ)-$$"
  release_dir="backups/release-$release_name"
  mkdir -p "$release_dir"
  docker compose config --format json > "$release_dir/rollback.compose.json"
  worker_container=$(docker compose ps -q mail-worker)
  worker_image=$(docker inspect --format '{{.Image}}' "$worker_container")
  docker image tag "$previous_web_image" "asiamotors-web-rollback:$release_name"
  docker image tag "$worker_image" "asiamotors-worker-rollback:$release_name"
  python3 - "$release_dir/rollback.compose.json" "asiamotors-web-rollback:$release_name" "asiamotors-worker-rollback:$release_name" <<'PYROLLBACK'
import json, sys
from pathlib import Path
p = Path(sys.argv[1])
config = json.loads(p.read_text())
for service, image in [('web', sys.argv[2]), ('mail-worker', sys.argv[3])]:
    config['services'][service]['image'] = image
    config['services'][service].pop('build', None)
p.write_text(json.dumps(config))
p.chmod(0o600)
PYROLLBACK
  printf 'Application rollback (keeps article-aware worker): docker compose -f %s/rollback.compose.json up -d --no-build --no-deps --wait web mail-worker\n' "$release_dir"
fi
docker compose up -d --no-deps --wait --wait-timeout 180 web
docker compose ps
curl --fail --silent --show-error http://127.0.0.1:3000/api/health
# Database health alone does not prove that the upload handler was shipped.
docker compose exec -T web node -e '
fetch("http://127.0.0.1:3000/api/uploads", {
  method: "POST",
  headers: {Origin: new URL(process.env.NEXTAUTH_URL).origin, "Content-Type": "multipart/form-data; boundary=probe"},
  body: "--probe--\r\n"
}).then(r => {
  if (r.status !== 401) throw Error("Upload route check failed: HTTP " + r.status);
  console.log("Upload route and authentication: OK");
}).catch(e => {console.error(e.message); process.exit(1)});
'
printf '\nMail delivery enabled: %s\n' "$mail_setting"
