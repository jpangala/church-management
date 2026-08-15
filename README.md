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

Prerequisites: Node 22 (`nvm use`), pnpm 9, PostgreSQL 16 running locally.

```bash
# 1. Install deps
pnpm install

# 2. Start Postgres (macOS, Homebrew)
brew services start postgresql@16
pg_isready

# 3. Create the role and database (first time only)
psql postgres -c "CREATE USER church WITH PASSWORD 'churchdev' CREATEDB;"
psql postgres -c "CREATE DATABASE church_management OWNER church;"

# 4. Copy env templates
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 5. Run migrations and seed the admin user
pnpm db:migrate
pnpm db:seed        # prints a generated admin password ONCE — save it

# 6. Start dev servers
pnpm dev
```

- API: <http://localhost:3000>
- Web: <http://localhost:5175>

`docker-compose.yml` is kept for anyone who prefers containers, but the supported local
path is Homebrew Postgres.

See `CONTRIBUTING.md` for branches, commits, and where new files go.

## Scripts

| Command                  | What it does                             |
| ------------------------ | ---------------------------------------- |
| `pnpm dev`               | Run API + Web together                   |
| `pnpm dev:api`           | API only                                 |
| `pnpm dev:web`           | Web only                                 |
| `pnpm build`             | Build all packages                       |
| `pnpm typecheck`         | TS check across the repo                 |
| `pnpm lint`              | ESLint across the whole repo             |
| `pnpm test`              | Vitest in every package                  |
| `pnpm format`            | Prettier write                           |
| `pnpm format:check`      | Prettier check (what CI runs indirectly) |
| `pnpm db:up` / `db:down` | Postgres container                       |
| `pnpm db:migrate`        | Apply Prisma migrations                  |
| `pnpm db:seed`           | Seed initial admin                       |
| `pnpm db:reset`          | Drop + re-migrate + seed                 |

## Docs

See `docs/PROGRESS.md` for current status and resume checklist.
Source of truth for design and PM artifacts: Notion workspace **Church Management System Project**.
