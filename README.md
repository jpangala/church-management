# Church Management System

Web platform for managing a church: public landing page + role-based dashboards (Admin, Finance, Division Leader).

## Stack

- **Backend:** NestJS (TypeScript) + Prisma + PostgreSQL
- **Frontend:** React + Vite + TypeScript + Tailwind + shadcn/ui
- **Repo:** pnpm monorepo
- **Deployment:** VPS (nginx + PM2)

## Structure

```
.
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React frontend (Vite)
├── packages/
│   └── shared/       # Shared TS types
├── docs/             # Progress notes, design decisions
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

## Getting started

Prerequisites: Node 20+, pnpm 9+, Docker.

```bash
# 1. Install deps
pnpm install

# 2. Start Postgres
pnpm db:up

# 3. Copy env templates
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 4. Run migrations and seed
pnpm db:migrate
pnpm db:seed

# 5. Start dev servers
pnpm dev
```

- API: <http://localhost:3000>
- Web: <http://localhost:5173>

## Scripts

| Command                  | What it does             |
| ------------------------ | ------------------------ |
| `pnpm dev`               | Run API + Web together   |
| `pnpm dev:api`           | API only                 |
| `pnpm dev:web`           | Web only                 |
| `pnpm build`             | Build all packages       |
| `pnpm typecheck`         | TS check across the repo |
| `pnpm db:up` / `db:down` | Postgres container       |
| `pnpm db:migrate`        | Apply Prisma migrations  |
| `pnpm db:seed`           | Seed initial admin       |
| `pnpm db:reset`          | Drop + re-migrate + seed |

## Docs

See `docs/PROGRESS.md` for current status and resume checklist.
Source of truth for design and PM artifacts: Notion workspace **Church Management System Project**.
