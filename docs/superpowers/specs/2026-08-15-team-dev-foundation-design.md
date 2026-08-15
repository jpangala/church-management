# Team Development Foundation — Design

**Date:** 2026-08-15
**Status:** Approved (pending implementation plan)
**Author:** Jeremia Joseph Pangala
**Scope:** Prepare the Church Management monorepo for four developers working in parallel — repository structure, service layer conventions, shared contract, CI, and team workflow.

---

## 1. Problem

The repository is a working single-developer prototype. Four people are about to start on it. In its current state:

- **It is not a git repository.** No `.git`, no remote, no history.
- `pnpm lint` is wired into both apps but **no ESLint or Prettier config exists**, so the script fails.
- **There is no test framework** — no Jest, no Vitest, nothing for CI to gate on.
- Only one API module exists (`auth`). Eight or nine more are implied by the Prisma schema, with no convention established for how they are laid out.
- The shared React UI kit lives at `apps/web/src/features/dashboard/components/` — shared code sitting at a feature-owned address.
- `packages/shared` is types-only and already being bypassed: `apps/web/src/features/auth/auth.types.ts` re-declares the role union that `packages/shared/src/roles.ts` already exports.
- `docker-compose.yml` assumes Docker, which is not installed on the lead's machine; the real local flow is Postgres via Homebrew.
- No pinned Node version (`README` says 20+, the lead's machine runs v26).

Without conventions in place, four people writing nine modules will produce nine different layouts, and the frontend and backend will disagree about data shapes without anything catching it.

## 2. Goals

1. Four developers can work simultaneously with minimal merge conflicts.
2. Every domain has an obvious, identical structure and one named owner.
3. Business logic lives in a layer that is unit-testable without HTTP or a database.
4. API and web cannot silently disagree about request/response shapes.
5. Reusable UI components have one home that everyone imports from.
6. CI blocks broken code from reaching shared branches.

## 3. Non-goals (deliberately deferred)

Recorded so nobody assumes they are in scope:

- Deployment automation of any kind (CI only, no CD)
- End-to-end / integration tests, and any Postgres service container in CI
- Zod or any runtime-derived shared validation
- A `packages/ui` workspace package
- OpenAPI generation or a generated API client
- Docker for local development
- Dependabot, release automation, changelogs

## 4. Decisions

| #   | Decision              | Chosen                                                                                 | Rejected alternatives                                                    |
| --- | --------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| D1  | Team split            | Domain-owned, full-stack — each person owns a slice end to end                         | By layer (2 BE / 2 FE); free-for-all tickets; lead + 3 devs              |
| D2  | Pipeline scope        | CI only for now                                                                        | CI + staging deploy; CI + staging + prod                                 |
| D3  | CI gates              | Lint + typecheck + build + Vitest unit tests                                           | Lint/typecheck/build only; e2e required                                  |
| D4  | E2E tests             | Not scaffolded at all                                                                  | Advisory job on `main`, promoted later                                   |
| D5  | Branching             | `main` (deployable) + `dev` (integration) + `feat/*`                                   | Trunk with short-lived branches only; direct push                        |
| D6  | Backend layering      | Controller → Service → Prisma                                                          | Adding a repository layer; logic in controllers                          |
| D7  | API/web contract      | Single-declared TypeScript types in `packages/shared`, linked to DTOs via `implements` | Shared Zod schemas; OpenAPI codegen; no shared contract                  |
| D8  | UI kit location       | Promote to `apps/web/src/components/shared/`                                           | Leave in `features/dashboard/`; extract `packages/ui` now                |
| D9  | Node version          | Pin 22 LTS via `.nvmrc` + `engines`                                                    | Leave unpinned; match the lead's v26                                     |
| D10 | Repository visibility | **Public**                                                                             | Private on Free plan (no enforced protection); private on Team (~$16/mo) |

### Accepted risks

- **D4 (no e2e).** Booking-overlap prevention and role guards will have no automated coverage. Mitigation: booking overlap is enforced by a **database-level constraint** rather than by application code alone, so correctness does not depend on test discipline. Role guards rest on review.
- **D10 (public repository).** Branch protection and Actions minutes become free, which removes the plan dependency entirely. What it costs:
  - A leaked secret is scraped by bots within minutes and is permanent. Deleting the file is not a remedy — the secret must be rotated. `apps/api/.env` holds real JWT secrets on disk today, so the pre-push verification in §7.1 is a hard gate, not a reminder.
  - The seeded default credentials in `prisma/seed.ts` (`admin@church.local` / `ChangeMe123!`) become published. Mitigated by §7.1 step 3: the seed reads `SEED_ADMIN_PASSWORD` from the environment and otherwise generates a random password, printed once.
  - The auth implementation is readable by anyone. Accepted — the JWT flow is standard and its security does not rest on obscurity.
  - **No congregation data is exposed.** Member, finance, and booking records live only in the database. The repository contains schema and code, never records.

- **D7 (no shared validation rules).** Rules like `@MinLength(8)` live only on the server. A web form may accept input the API rejects, producing a 400 instead of inline feedback. This is a UX papercut, not a security hole — the server rule is the one that protects anything. The folder layout is identical to the Zod version, so Zod can be adopted per-domain later without restructuring (`zod` and `@hookform/resolvers` are already `apps/web` dependencies).

## 5. Domain ownership map

Fourteen Prisma models grouped into four slices with minimal table overlap:

| Slice              | Prisma models                                      | API modules                           | Web features                                            |
| ------------------ | -------------------------------------------------- | ------------------------------------- | ------------------------------------------------------- |
| Identity & Access  | User, Division, AuditLog                           | `auth`, `users`, `divisions`, `audit` | `auth`, `admin/users`, `admin/divisions`, `admin/audit` |
| Members & Projects | Member, Project                                    | `members`, `projects`                 | `members`, `projects`                                   |
| Bookings & Assets  | Room, Item, Booking, BookingRoom, BookingItem      | `rooms`, `items`, `bookings`          | `bookings`, `assets`                                    |
| Finance            | FinanceCategory, IncomeEntry, ExpenseEntry, Budget | `finance`                             | `finance`                                               |

`LandingContent` is low-traffic and assigned to the Identity & Access owner.

Real GitHub usernames are assigned in `CODEOWNERS` at implementation time.

## 6. Architecture

### 6.1 What each unit is

|               | `packages/shared`                               | `apps/api`           | `apps/web`             |
| ------------- | ----------------------------------------------- | -------------------- | ---------------------- |
| Framework     | none — plain TypeScript                         | NestJS               | React                  |
| Runtime       | never runs; source only                         | Node.js server       | browser                |
| Built by      | nothing (consumed as source via tsconfig paths) | `nest build` → `tsc` | Vite → Rollup          |
| Module format | ESM                                             | CommonJS             | ESM                    |
| Output        | —                                               | `dist/main.js` (PM2) | static `dist/` (nginx) |

Vite is the build tool and dev server for `apps/web`, not a framework. Only `index.html`, `vite.config.ts`, `postcss.config.js` + `tailwind.config.ts`, and `import.meta.env.VITE_*` are Vite's concern. Everything in `apps/web/src/` is React.

### 6.2 API structure (NestJS)

```
apps/api/src/
├── main.ts                       # Nest bootstrap
├── app.module.ts                 # root module — registers every domain module
├── prisma/                       # PrismaService (@Global provider) — unchanged
├── common/                       # cross-cutting, no single owner
│   ├── guards/                   # ← MOVED from auth/guards (jwt-auth, roles)
│   ├── decorators/               # ← MOVED from auth/decorators (current-user, roles)
│   ├── filters/                  # NEW — global exception filter, one error shape
│   ├── interceptors/             # NEW — audit-log interceptor
│   └── pipes/                    # NEW — only if a custom pipe is needed (e.g. ParseDatePipe).
│                                 #   Body validation uses Nest's built-in ValidationPipe,
│                                 #   registered globally in main.ts against class-validator DTOs.
└── modules/
    └── <domain>/                 # one owner per folder
        ├── <domain>.module.ts
        ├── <domain>.controller.ts
        ├── <domain>.service.ts
        ├── <domain>.service.spec.ts
        └── dto/
```

**Layer responsibilities**

- **Controller** — URL, HTTP verb, guards, DTO binding. Calls one service method and returns the result. No business rules, no Prisma.
- **Service** — all business logic. Injects `PrismaService`. Knows nothing about HTTP: no request, no response, no status codes.
- **DTO** — shape and runtime validation of an incoming body, via `class-validator`. Implements the matching `packages/shared` interface.
- **Module** — wiring only.

**Enforced rule:** `PrismaService` and `@prisma/client` may be imported only in `*.service.ts`. Enforced by ESLint (§8.2), not by convention.

**Changes to existing code:** `src/auth/` moves to `src/modules/auth/`; its `guards/` and `decorators/` are promoted to `src/common/`, because all remaining modules need `RolesGuard` and `@CurrentUser`, and leaving them inside `auth/` makes one person's folder a dependency of everyone's work.

### 6.3 Web structure (React)

```
apps/web/src/
├── main.tsx                      # React root + QueryClientProvider + BrowserRouter
├── App.tsx                       # composes per-feature route fragments
├── styles/ · locales/            # Tailwind entry, i18next JSON
├── lib/                          # non-React helpers: api-client, i18n, utils
├── layouts/                      # ← MOVED from features/dashboard/components
│                                 #   DashboardLayout, Sidebar, TopBar
├── components/
│   ├── ui/                       # shadcn primitives
│   └── shared/                   # ← MOVED reusable kit + barrel index.ts
│                                 #   DataTable, FormShell, Panel, StatCard, EmptyState, …
└── features/
    └── <domain>/                 # one owner per folder
        ├── api.ts                # axios calls — the ONLY file touching apiClient
        ├── queries.ts            # TanStack Query hooks
        ├── routes.tsx            # this domain's route fragment
        ├── components/           # domain-only components
        └── <Domain>*Page.tsx
```

**Layer responsibilities**

- **`api.ts`** — one function per endpoint, returns a Promise. No React.
- **`queries.ts`** — TanStack Query hooks wrapping those functions (caching, loading/error state, invalidation).
- **Pages and components** — call hooks. Never call `api.ts` or `apiClient` directly.

This mirrors `controller → service` on the API: the page is the controller, `queries.ts` + `api.ts` are the service.

**Component tiers**

| Tier | Location                        | Rule                                                                                |
| ---- | ------------------------------- | ----------------------------------------------------------------------------------- |
| 1    | `components/ui/`                | shadcn primitives; no domain knowledge                                              |
| 2    | `components/shared/`            | reusable kit, imported by all four people; no domain knowledge; changes need review |
| 3    | `features/<domain>/components/` | knows one domain; owned by one person; never imported by another feature            |

Test for tier 2: _could a different domain use it unmodified?_ `DataTable` yes; `BookingSlotPicker` no.

### 6.4 Shared contract (`packages/shared`)

```
packages/shared/src/
└── <domain>/
    ├── types.ts     # request/response interfaces + enums
    └── index.ts
```

Request and response shapes are declared **once**, here, and imported by both apps. The compiler enforces agreement via `implements`:

```ts
// packages/shared/src/auth/types.ts
export interface LoginRequest {
  email: string;
  password: string;
}
```

```ts
// apps/api/src/modules/auth/dto/login.dto.ts
export class LoginDto implements LoginRequest {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
}
```

```ts
// apps/web/src/features/auth/api.ts
export const login = (body: LoginRequest) =>
  apiClient.post<LoginResponse>("/auth/login", body);
```

Adding a field to `LoginRequest` breaks compilation on both sides until both are updated, and `pnpm typecheck` catches it in CI before merge.

`packages/shared` has **no runtime dependencies** — no NestJS, no React, no axios, no `@prisma/client`. Enforced by ESLint (§8.2). It is consumed as source through tsconfig path mappings, so it needs no build step.

**Cleanup this implies:**

1. `apps/web/src/features/auth/auth.types.ts` currently re-declares `UserRole`, `LoginResponse`, and `RefreshResponse`. These move to `packages/shared/src/auth/`, and `UserRole` is reconciled with the existing `Role` in `packages/shared/src/roles.ts` (one name, one declaration).
2. The existing flat files — `roles.ts`, `booking.types.ts`, `project.types.ts`, `finance.types.ts`, `locale.types.ts` — are reorganised into the per-domain folders above. `locale.types.ts` is not domain-specific and moves to `packages/shared/src/common/`. `roles.ts` moves to `packages/shared/src/auth/`. Note that `finance.types.ts` currently also holds `AuditAction`, which belongs with the Identity & Access slice, not Finance.
3. `packages/shared/src/index.ts` becomes a barrel of per-domain re-exports, with subpath exports declared in `packages/shared/package.json` so `@church/shared/members` resolves. Both apps' tsconfig `paths` already map `@church/shared/*`.

### 6.5 Merge-conflict hotspots and mitigations

| File                               | Why it conflicts                                                 | Mitigation                                                         |
| ---------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/web/src/App.tsx`             | holds every route inline; already ~80 lines with one domain done | each feature exports `routes.tsx`; `App.tsx` composes four imports |
| `apps/web/src/layouts/Sidebar.tsx` | every domain adds a nav item                                     | drive from a config array, one entry per domain                    |
| `apps/api/prisma/schema.prisma`    | shared by all four                                               | schema changes go in their own small PR, lead-reviewed             |
| `packages/shared/src/index.ts`     | barrel                                                           | per-domain subpath exports so people edit different lines          |
| `apps/api/src/app.module.ts`       | one import + array entry per module                              | accepted — append-only, trivial conflicts                          |

## 7. CI and workflow

### 7.1 Git bootstrap

Ordered, because nothing else works until it is done:

1. Fix `.gitignore`: add `apps/web/vite.config.js` and `apps/web/vite.config.d.ts` (compiled output currently untracked-but-present).
2. **Hard gate — verify no secrets are staged.** `apps/api/.env` and `apps/web/.env` contain real values and `.gitignore` covers `.env`, but this is confirmed against `git status` before the first commit. On a public repository a leaked secret is permanent and must be rotated, not deleted. The `.env.example` files were checked and contain placeholders only.
3. Harden `prisma/seed.ts` before publishing: read the admin password from `SEED_ADMIN_PASSWORD`, and when unset generate a random one and print it once instead of hardcoding `ChangeMe123!`.
4. `git init`, initial commit of current state — including this spec.
5. Create a **public** GitHub repository, push `main`, branch `dev` from it.
6. Add the three collaborators with **Write** access (not Admin) when they are ready to join.

### 7.2 Branch model

```
main   ← deployable; only receives merges from dev
 ↑
dev    ← integration; all feature work lands here
 ↑
feat/<domain>-<thing>   ← one person, short-lived (target: under 3 days)
```

- Branch names: `feat/finance-budget-crud`, `fix/booking-overlap`, `chore/eslint-config`
- **Squash merge** into `dev`; **merge commit** for `dev` → `main` at sprint end
- Commit messages: Conventional Commits with the domain as scope — `feat(finance): add budget CRUD endpoints`. This **replaces** the `S1: scaffold monorepo` convention recorded in `docs/PROGRESS.md`, which must be updated.

### 7.3 Workflow file

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main, dev]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    env:
      DATABASE_URL: postgresql://ci:ci@localhost:5432/placeholder
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter api prisma:generate
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

Rationale:

- **`prisma generate` before typecheck** — `@prisma/client` types do not exist until generated; typecheck fails without it. `DATABASE_URL` is a placeholder: `prisma generate` reads the datasource block but never connects.
- **One job, not four** — four parallel jobs each pay ~60s of install and cache restore. At this repo size a single sequential job finishes sooner and uses roughly a quarter of the Actions minutes.
- **Cheapest step first** — a lint error fails in ~90s instead of after a ~4 minute build.
- **`concurrency` with `cancel-in-progress`** — only the latest push per branch runs, the largest single saving on a private-repo minute budget.

Expected runtime: ~3–4 minutes per PR.

### 7.4 Branch protection

The repository is public (D10), so branch protection, required status checks, required Code Owner review, and Actions minutes are all available at no cost. Rules to configure on both branches:

**`main`**

- Require a pull request before merging, with **1 approval**
- Require status check `verify` to pass
- Require review from Code Owners
- Dismiss stale approvals when new commits are pushed
- Block force pushes and branch deletion

**`dev`**

- Require a pull request before merging, with **1 approval**
- Require status check `verify` to pass
- Block force pushes

Repository settings: disable Wiki and Projects (unused), leave Issues enabled for the team's own tracking. Since the repository is public, anyone may open issues and pull requests; neither can be merged without passing the rules above.

## 8. Tooling to be created

### 8.1 Files

| File                                                     | Purpose                                                                |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| `.nvmrc` (`22`)                                          | pins Node for CI and all four machines                                 |
| `engines` in root `package.json` (`>=22 <23`)            | fails at install on a mismatched Node instead of mysteriously at build |
| `eslint.config.js` (root, flat config)                   | one config, per-path overrides, including boundary rules               |
| `.prettierrc`, `.prettierignore`                         | removes formatting noise from reviews                                  |
| `.editorconfig`                                          | same, at editor level                                                  |
| `apps/api/vitest.config.ts`, `apps/web/vitest.config.ts` | test runner                                                            |
| Root scripts `test`, `format`, `format:check`            | one command per CI gate                                                |
| `.github/CODEOWNERS`                                     | auto-requests the right reviewer; gates shared paths                   |
| `.github/pull_request_template.md`                       | what changed · how tested · touches shared code? · screenshot if UI    |

### 8.2 Boundary rules as lint rules

The §6 boundaries are enforced by `no-restricted-imports` in the flat config, so violations fail CI rather than depending on reviewer memory:

- `apps/api/src/**/*.controller.ts` — may not import `**/prisma/prisma.service` or `@prisma/client`
- `apps/web/src/features/*/**` — may not import `../*` or `../*/**` (no cross-feature imports), may not import `**/lib/api-client`
- `apps/web/src/features/*/api.ts` — override re-allowing `lib/api-client`
- `packages/shared/**` — may not import `@nestjs/*`, `react`, `react-*`, `axios`, `@prisma/client`

The relative-path patterns are approximate and will be tuned against real violations during implementation. If they prove imprecise, `import/no-restricted-paths` from `eslint-plugin-import` expresses zone rules more exactly; the zero-dependency form is the starting point.

### 8.3 Testing convention

Vitest in both apps. NestJS dependency injection relies on `emitDecoratorMetadata`, which esbuild — Vitest's transformer — does not emit. This is avoided by convention rather than by tooling:

```ts
// members.service.spec.ts — construct directly, no Nest DI
const prisma = { member: { findMany: vi.fn(), create: vi.fn() } };
const service = new MembersService(prisma as unknown as PrismaService);
```

Because `Test.createTestingModule()` is never called, no decorator metadata is required and plain Vitest works in both apps with no additional plugin. This also constrains the design usefully: a service that is awkward to construct with `new` has too many dependencies.

If full DI integration tests are needed later, `unplugin-swc` is added to `apps/api/vitest.config.ts` — a change contained to one file.

Day-one coverage target: service-layer unit tests for each new domain module. Existing untested code is not retrofitted as part of this work.

## 9. Documentation updates

- `README.md` — replace the Docker-based getting-started steps with the Homebrew Postgres flow, add Node 22 and the branch/commit conventions. Also correct the web dev URL: `vite.config.ts` sets `server.port` to **5175**, while the README says 5173.
- `docs/PROGRESS.md` — record the commit-message convention change and the decisions in §4.
- `CONTRIBUTING.md` (new) — branch naming, commit format, PR checklist, where a new domain's files go.

## 10. Open items

1. ~~**GitHub plan**~~ — resolved by D10: the repository is public, so branch protection and Actions are free and §7.4 applies in full.
2. **GitHub usernames** — the three collaborators join later. Until then `CODEOWNERS` assigns every path to the lead, and the per-domain lines from §5 are added in a follow-up PR as each person is onboarded. "Require review from Code Owners" therefore means lead review for all PRs at the start, which is the correct default for a repository with one active developer.
3. **Booking overlap constraint** — the database-level constraint backing §4 is specified when the Bookings domain is implemented; it is out of scope for this foundation work but is the mitigation that makes skipping e2e acceptable.
4. **Solo-start caveat** — with only the lead active, "require 1 approval" cannot be satisfied by the lead's own PR. Until a second collaborator joins, either the approval requirement stays off on `dev` (status check still required), or the lead uses the admin bypass. The status check is the gate that matters; the approval rule is switched on when the second person arrives.
