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
docker compose up -d --wait --wait-timeout 180
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
