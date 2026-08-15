# Contributing

## Prerequisites

- Node 22 (`nvm use` reads `.nvmrc`)
- pnpm 9 (`corepack enable`)
- PostgreSQL 16 running locally

## Branches

```
main   ← deployable. Only ever receives merges from dev.
 ↑
dev    ← integration. All feature work lands here.
 ↑
feat/<domain>-<thing>   ← your branch. Short-lived; aim to merge within 3 days.
```

Branch names: `feat/finance-budget-crud`, `fix/booking-overlap`, `chore/eslint-config`.

- Feature branches are **squash-merged** into `dev`.
- `dev` is merged into `main` with a **merge commit** at sprint end.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), with the domain as the scope:

```
feat(finance): add budget CRUD endpoints
fix(bookings): reject overlapping room reservations
chore(lint): enforce feature import boundaries
```

## Before you open a PR

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

CI runs exactly these four, in this order, plus `prisma generate` first. If they pass locally they will pass in CI.

## Where things go

| You are adding                             | It goes in                                             |
| ------------------------------------------ | ------------------------------------------------------ |
| An API endpoint                            | `apps/api/src/modules/<domain>/<domain>.controller.ts` |
| Business logic                             | `apps/api/src/modules/<domain>/<domain>.service.ts`    |
| A request/response shape used by both apps | `packages/shared/src/<domain>/`                        |
| A screen                                   | `apps/web/src/features/<domain>/`                      |
| An API call from the web app               | `apps/web/src/features/<domain>/api.ts`                |
| A data hook                                | `apps/web/src/features/<domain>/queries.ts`            |
| A component only your domain uses          | `apps/web/src/features/<domain>/components/`           |
| A component every domain could use         | `apps/web/src/components/shared/`                      |

## Rules the linter enforces

These fail CI, so you will find out immediately:

- Controllers may not import `PrismaService` or `@prisma/client`. Data access belongs in the service.
- `packages/shared` may not import NestJS, React, axios, express, or Prisma. Both apps depend on it, so it stays framework-free.

(Cross-feature import boundaries and the api.ts-only-import-apiClient rule are coming in a follow-up structural refactor — the current folder layout doesn't support enforcing them yet.)

## Tests

Service-layer unit tests are expected for new API logic. Construct the service directly rather than through Nest's testing module:

```ts
const prisma = { member: { findMany: vi.fn() } };
const service = new MembersService(prisma as unknown as PrismaService);
```

This keeps Vitest working without extra tooling — esbuild does not emit the decorator metadata that Nest's DI needs. If a service is awkward to construct with `new`, it has too many dependencies.

Test files use the `.spec.ts` or `.test.ts` suffix — both are recognized by Vitest and excluded from the production build.

## The design spec

`docs/superpowers/specs/2026-08-15-team-dev-foundation-design.md` explains why the structure is the way it is. Read it before proposing a change to it.
