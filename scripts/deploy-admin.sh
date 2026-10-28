#!/bin/sh
# One-time catalog workspace rollout. Keep PostgreSQL and upload volumes intact.
set -eu
cd "$(dirname "$0")/.."
[ "${1:-}" = --without-mail ] && [ "$#" -eq 1 ] || {
  printf 'Usage: %s --without-mail\n' "$0" >&2
  exit 2
}
umask 077
repo_dir=$(pwd -P)
# sudo runs as root while the checkout belongs to ops. Trust only this checkout.
git() { command git -c safe.directory="$repo_dir" "$@"; }
require_clean() {
  if ! git diff --quiet || ! git diff --cached --quiet; then
    printf 'Tracked source changes found. Commit or remove them before deployment.\n' >&2
    exit 1
  fi
}
require_clean
command -v flock >/dev/null 2>&1 || {
  printf 'Install the standard Linux flock utility before deployment.\n' >&2
  exit 1
}
exec 9>"$(git rev-parse --git-path admin-deploy.lock)"
flock -n 9 || { printf 'Another administration deployment is already running.\n' >&2; exit 1; }
export MAIL_DELIVERY_ENABLED=false
compat_commit=6b7a3a9
release="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short HEAD)-$$"
release_dir="$(pwd)/backups/admin-$release"
work_dir=$(mktemp -d "${TMPDIR:-/tmp}/asiamotors-admin.XXXXXX")
chmod 700 "$work_dir"
writers_stopped=false
compat_ready=false
finished=false

original() { docker compose -f "$work_dir/original.json" "$@"; }
compat() { docker compose -f "$work_dir/compat.json" "$@"; }
main() { docker compose -f "$work_dir/main.json" "$@"; }
cleanup() {
  result=$?
  trap - EXIT HUP INT TERM
  if [ "$finished" = false ] && [ "$writers_stopped" = true ]; then
    printf '\nDeployment interrupted; restoring application images without restoring the database.\n' >&2
    if [ "$compat_ready" = true ]; then
      if ! compat up -d --no-build --no-deps --wait --wait-timeout 180 web mail-worker; then
        printf 'Automatic compatibility rollback failed. Use the saved compatibility configuration in %s.\n' "$release_dir" >&2
      fi
    elif ! original up -d --no-build --no-deps --wait --wait-timeout 180 web mail-worker; then
      printf 'Original application restart failed; inspect Docker Compose before retrying.\n' >&2
    fi
  fi
  rm -rf "$work_dir"
  exit "$result"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' HUP TERM

git rev-parse --verify "$compat_commit^{commit}" >/dev/null
mkdir "$work_dir/source"
git archive "$compat_commit" | tar -xf - -C "$work_dir/source"
# tar obeys umask 077; COPY keeps modes, so non-root image users need readable source.
# The parent directory remains 0700 and the archive contains no runtime secrets.
chmod -R a+rX "$work_dir/source"
# Compose renders secrets as host paths; credentials never enter the build context.
docker compose config --format json > "$work_dir/original.json"
python3 - "$work_dir" "$release" <<'PY'
import copy, json, subprocess, sys
from pathlib import Path
work, release = Path(sys.argv[1]), sys.argv[2]
base = json.loads((work / 'original.json').read_text())
base['services']['mail-worker']['environment']['MAIL_DELIVERY_ENABLED'] = 'false'
# A retry may start from a previous named release, rather than Compose's default tags.
# Pin the actual running images before any build can replace tags.
for service in ('web', 'mail-worker'):
    container = subprocess.check_output(['docker', 'compose', 'ps', '-q', service], text=True).strip()
    if not container or '\n' in container:
        raise SystemExit(f'Expected one running {service} container before deployment')
    image = subprocess.check_output(['docker', 'inspect', '--format', '{{.Image}}', container], text=True).strip()
    base['services'][service]['image'] = image
(work / 'original.json').write_text(json.dumps(base))
for phase in ('compat', 'main'):
    config = copy.deepcopy(base)
    for service, target in (('web', 'runner'), ('mail-worker', 'worker'), ('migrate', 'worker')):
        item = config['services'][service]
        item['image'] = f'asiamotors-admin-{phase}-{service}:{release}'
        item['build'] = {'context': str(work / 'source') if phase == 'compat' else str(Path.cwd()), 'target': target}
    (work / f'{phase}.json').write_text(json.dumps(config))
PY
compat config --quiet
main config --quiet
printf 'Building compatibility release %s before stopping the current site.\n' "$compat_commit"
compat build web mail-worker migrate
# Persist the requested mode before any service is restarted.
python3 - <<'PY'
from pathlib import Path
p = Path('.env')
lines = [line for line in p.read_text().splitlines() if not line.startswith('MAIL_DELIVERY_ENABLED=')]
p.write_text('\n'.join(lines) + '\nMAIL_DELIVERY_ENABLED=false\n')
p.chmod(0o600)
PY
mkdir -p "$release_dir"
cp "$work_dir/compat.json" "$release_dir/compat.compose.json"
cp "$work_dir/main.json" "$release_dir/main.compose.json"
cp "$work_dir/original.json" "$release_dir/original.compose.json"
# Stop all writers once; unlike backup.sh, do not restart them before migration002.
writers_stopped=true
original stop web mail-worker
original exec -T db pg_dump -U postgres -d asiamotors -Fc > "$release_dir/database.dump"
compat run --rm --no-deps -T --entrypoint tar mail-worker -C /app/uploads -czf - . > "$release_dir/uploads.tar.gz"
cp .env "$release_dir/web.env"
cp -R .secrets "$release_dir/secrets"
find "$release_dir/secrets" -type f -exec chmod 600 {} \;
git rev-parse HEAD > "$release_dir/commit.txt"
cp compose.yaml "$release_dir/compose.yaml"
(cd "$release_dir" && sha256sum database.dump uploads.tar.gz > SHA256SUMS)
printf 'Consistent database/media backup: %s\n' "$release_dir"

compat run --rm -T migrate
compat_ready=true
compat up -d --no-build --no-deps --wait --wait-timeout 180 web mail-worker
# A failing main build leaves a healthy compatible application on the server.
printf 'Compatibility release healthy. Building the new administration application.\n'
require_clean
main build web mail-worker migrate
main stop web mail-worker
main run --rm -T migrate
main up -d --no-build --no-deps --wait --wait-timeout 180 web mail-worker
main exec -T web node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>{if(!r.ok)process.exit(1);return r.text()}).then(console.log).catch(()=>process.exit(1))"
main ps
finished=true
printf '\nAdministration release active. Mail delivery enabled: false\n'
printf 'Compatibility rollback (keeps database and media):\n  docker compose -f %s/compat.compose.json up -d --no-build --no-deps --wait web mail-worker\n' "$release_dir"
