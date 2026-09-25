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

The codebase is organised into four **domain modules**, one per owner, mirrored on the API and
web sides. [`.github/CODEOWNERS`](.github/CODEOWNERS) maps each folder to the person responsible
for it, so the path you are editing tells you whose review you will need.

| Module     | Models                                                     |
| ---------- | ---------------------------------------------------------- |
| `identity` | `User`, `Division`, `AuditLog`                             |
| `members`  | `Member`, `Project`                                        |
| `bookings` | `Booking`, `BookingRoom`, `BookingItem`, `Room`, `Item`    |
| `finance`  | `FinanceCategory`, `IncomeEntry`, `ExpenseEntry`, `Budget` |

| You are adding                             | It goes in                                             |
| ------------------------------------------ | ------------------------------------------------------ |
| An API endpoint                            | `apps/api/src/modules/<module>/<entity>.controller.ts` |
| Business logic                             | `apps/api/src/modules/<module>/<entity>.service.ts`    |
| Cross-cutting API infrastructure           | `apps/api/src/common/`                                 |
| A request/response shape used by both apps | `packages/shared/src/<module>/`                        |
| A screen                                   | `apps/web/src/features/<module>/`                      |
| An API call from the web app               | `apps/web/src/features/<module>/api.ts`                |
| A data hook                                | `apps/web/src/features/<module>/queries.ts`            |
| A component only your module uses          | `apps/web/src/features/<module>/components/`           |
| A component every module could use         | `apps/web/src/components/shared/`                      |

Two folders are cross-cutting and lead-owned: `apps/web/src/components/shared/` (the 22-component
UI kit every module depends on) and `apps/web/src/features/dashboards/` (the three role landing
pages, which aggregate data from every module). Each has a README explaining how to contribute to
one without owning it. `apps/web/src/features/landing/` is unassigned for now.

The shared UI kit is documented component by component, with props and worked examples, in
[`docs/UI_KIT.md`](docs/UI_KIT.md). Read it before building a screen — most of what you need
already exists.

Every module folder has a README listing the models it owns and the screens or endpoints still to
build. Read yours before starting.

## Rules the linter enforces

These fail CI, so you will find out immediately:

- Controllers may not import `PrismaService` or `@prisma/client`. Data access belongs in the service.
- `packages/shared` may not import NestJS, React, axios, express, or Prisma. Both apps depend on it, so it stays framework-free.

(Cross-module import boundaries and the `api.ts`-only-imports-`apiClient` rule are not switched on yet. The folder layout now supports them — see the deferred blocks in `eslint.config.mjs`.)

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
