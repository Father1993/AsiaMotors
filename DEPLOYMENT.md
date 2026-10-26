# AsiaMotors VPS deployment

Node.js 22 or newer is required locally; the container uses Node.js 24.
Use npm and the committed package-lock.json for reproducible installs.

## Configuration

Create `.env` using `.env.example` as a reference and set `chmod 600 .env`.
The production environment is never committed or copied into the Docker build
context. Compose passes it as a temporary BuildKit secret for compilation and
loads it at runtime. Next.js copies env files into standalone output during
compilation, so the Dockerfile deletes those copies in the same build step. `NEXT_PUBLIC_*` variables become public browser assets;
rebuild the image whenever their values change.

## Validate and run

```sh
npm ci
npm run typecheck
npm run lint
npm run build
```

The new React Compiler lint diagnostics are warnings during this migration;
Rules of Hooks and other lint errors remain enforced.

From the checkout on the VPS, an administrator can run:

```sh
sudo docker compose build
sudo docker compose up -d
sudo docker compose ps
curl -I http://127.0.0.1:3000/
```

The app listens only on the VPS loopback interface. Configure Nginx, domain
routing and HTTPS separately before directing public traffic to this VPS.
Do not publish port 3000 on all interfaces. Container logs rotate automatically.

## Current server access

The SSH account is `ops`. `/srv/asiamotors` belongs to `deploy`; `ops` needs
interactive sudo for changes there and for Docker. A preparation checkout may
be kept in `/home/ops/asiamotors` until an administrator sets up deployment
ownership and permissions. Do not grant broad passwordless sudo for this task.
