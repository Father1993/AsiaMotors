# AsiaMotors: own PostgreSQL, media and SMTP

The application uses Next.js API routes and PostgreSQL 17. No hosted database or
browser email service is used. The existing four country categories are seeded;
the catalog starts empty. No old database data can be recovered from this repo. Car URLs include the UUID,
so cars with the same brand/model/year have distinct links. Default filters do
not hide newly entered years or expensive cars.

## Configuration

- `.env`: NEXTAUTH_URL, NEXTAUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD. Mode 600.
- `.secrets/db_admin_password`: independent random database administrator password.
- `.secrets/db_app_password`: independent random restricted application password.
- `.secrets/smtp_password`: Yandex application password for asia-social@ya.ru.

The secrets directory must have mode 700. Secret files have mode 444 because
Compose bind mounts preserve host permissions and PostgreSQL uses its own UID.
The private directory prevents access by other host users. Never commit these
files, print them in logs, or copy them into an image. Neither image build needs
production configuration, a running database or SMTP credentials.

Configure Yandex mail-client access and generate an application password for
**Mail**, belonging to **asia-social@ya.ru**. SMTP: smtp.yandex.ru, TLS port 465.
The SMTP login is asia-social (personal Yandex account); the worker sends
from/to asia-social@ya.ru. Existing forwarding to
asiamotors27@mail.ru is configured in the Yandex mailbox, outside this repo.

To replace the password on the VPS without shell-history exposure (Bash):

```sh
cd /home/ops/asiamotors
chmod 600 .secrets/smtp_password
read -rsp 'Yandex application password: ' smtp_app_password; printf '\n'
printf '%s\n' "$smtp_app_password" > .secrets/smtp_password
unset smtp_app_password
chmod 444 .secrets/smtp_password
sudo docker compose run --rm --no-deps mail-worker node scripts/mail-worker.mjs --verify
sudo sh scripts/deploy.sh --with-mail
```

Verification authenticates only; it does not send a message. SMTP 535 means the
account, application password or mail-client access needs correction. The
currently supplied password was rejected during verification; real delivery is
not proven until working credentials are supplied and a test is received.

## Deployment

```sh
sudo sh scripts/deploy.sh --without-mail
```

By default (or with --without-mail), deployment starts the database, website and
housekeeping worker without contacting SMTP. Requests and pending mail jobs are
saved; no email attempts are made. The switch is persisted as
MAIL_DELIVERY_ENABLED=false in the private .env. Automatic container restarts do
not turn mail on.

After setting up Yandex, explicitly run `sudo sh scripts/deploy.sh --with-mail`.
This builds the images, verifies SMTP authentication, then enables delivery.
Previously queued requests will also be sent, subject to the retention policy.
The script builds web/worker/migration images, then starts the stack. PostgreSQL has no published port. The web port remains bound
to 127.0.0.1:3000 behind the existing Nginx HTTPS site. Migrations are transactional,
checksummed and serialized with an advisory lock. Only migrations use a database
administrator; the app/worker can modify application tables but cannot create
roles or tables. Init scripts create the app role only on a fresh database.
Never delete database/upload volumes to apply an update.

Health: `/api/health`. Administration: `/admin` and `/admin/requests`. The latter
shows saved requests, handling status and SMTP delivery state; exhausted jobs
can be retried and requests can be deleted. All admin APIs check server sessions;
mutations require an explicitly allowed Origin (NEXTAUTH_URL plus the two
production domain aliases in APP_ALLOWED_ORIGINS). Auth attempts and public
requests have database-backed limits. Nginx must overwrite X-Real-IP (the current
site config does so); do not expose the web port directly to untrusted clients.

## Requests and mail

A form success means the request and mail job were committed to PostgreSQL. SMTP
is processed by a separate worker with bounded timeouts and exponential retries
(up to 12 attempts). An SMTP acceptance is not proof of final mailbox receipt or
forwarding. Delivery is at least once: an ambiguous SMTP/network/database failure
can produce a duplicate, with the same Message-ID. Do not use this as a payment
or exactly-once delivery system.

Only expected fields/form types are accepted. Consent evidence stores timestamp
and version 2026-10-27; the displayed legal text/operator details still require
owner/legal review. Requests in the live database are removed after 90 days,
configurable through LEAD_RETENTION_DAYS. Define the business retention policy
before accepting personal data; backup copies have their own retention period.
No names, phone numbers, form bodies or SMTP passwords are intentionally logged.

Uploaded images are decoded, size/pixel limited, stripped of metadata and
re-encoded to WebP. Files live in a named volume, not the container layer. Editing
an image list does not delete live files before saving. The worker deletes
unreferenced files older than 24 hours. A canceled form may leave temporary
uploads until this cleanup. External image URLs and SVG are not accepted.

## Backups and recovery

```sh
sudo sh scripts/backup.sh
```

The backup briefly stops web and worker to create a consistent database/media
pair, then restarts them even if backup fails. It writes a custom pg_dump archive,
uploads archive, SHA256SUMS, runtime configuration/secrets and source commit under
`backups/<UTC timestamp>` (private). Treat the whole backup as sensitive.

Use `scripts/restore.sh <backup-directory>` only with an empty isolated database
and upload volume, and provision the matching application role/secrets first.
The restore refuses to overwrite a populated public schema. Verify checksums,
row counts, media availability and application access before production use.
Keep the original stack/volumes until acceptance. Backups must also be copied to
a separately protected location in Russia; a backup on the same VPS does not
protect against losing that VPS. An external backup destination and automated
retention schedule are not configured by this change.

## Local integration checks

```sh
docker compose -p asiamotors-test -f compose.yaml -f compose.test.yaml up -d --build --wait
python3 tests/selfhost-integration.py
```

Use only this separate test project. It publishes web on 127.0.0.1:3110 and a test
DB on 127.0.0.1:35432. Test SMTP captures all mail locally and never forwards it.
The test creates synthetic cars/requests; do not point it at production. Tests
cover authenticated CRUD, uploads, request deduplication, validation, access
control, SMTP dispatch and throttling. Also verify a restart and backup restore.

Nodemailer is pinned to 10.2.1, including NextAuth's optional mail peer override.
NextAuth uses Credentials, not its email provider; credentials/session behavior
is included in integration checks. Production dependency audit is separate from
functional verification and does not prove legal compliance or absence of all
security defects.
