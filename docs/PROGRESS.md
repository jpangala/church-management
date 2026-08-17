# Church Management System — Progress

**Last updated:** 2026-08-15
**Owner:** Jeremia Joseph Pangala (`j.pangala7@gmail.com`)
**Roles worn:** Project Manager · Design Architect · Developer

---

## Where we are

**Phase 0 — Foundation:** ✅ Complete (spec, proposal, interview script, permissions matrix, data model)
**Phase 1 — Design:** ✅ Complete (brand kit, IA, lo-fi wireframes, component plan, sprint plan)
**Phase 2 — Infrastructure & Local Prototype:** 🚧 Started (this commit)

## Phase 0/1 Artifacts (Notion)

Workspace: **Church Management System Project**

- Project Spec — Requirements
- Proposal Proyek (Bahasa Indonesia)
- Stakeholder Interview Script
- Permissions Matrix
- Data Model — ERD Draft
- Full Roadmap (Phases 0–6)
- Brand Kit — Reverent Classic
- Information Architecture
- Wireframes (Lo-Fi) — 7 screens
- Component Plan — shadcn/ui Mapping
- Sprint Plan — Phase 2–6

Shared with colleagues (separate workspace):

- Church Management — Shared with Colleagues (duplicates of Spec, Permissions, Data Model)

## Locked Decisions

| Topic               | Decision                                                  |
| ------------------- | --------------------------------------------------------- |
| Backend             | NestJS (TypeScript)                                       |
| Frontend            | React + Vite + TypeScript                                 |
| Database            | PostgreSQL                                                |
| ORM                 | Prisma                                                    |
| UI                  | Tailwind + shadcn/ui                                      |
| Hosting             | VPS (nginx + PM2)                                         |
| Repo                | pnpm monorepo (`apps/api`, `apps/web`, `packages/shared`) |
| Brand               | Reverent Classic (navy + warm gold + cream)               |
| Currency            | IDR only                                                  |
| Booking time        | Hourly slots (`startAt`/`endAt`, minute = 00)             |
| Leader per division | Exactly 1 (unique FK `Division.leaderUserId`)             |
| Report export       | PDF only (with church header)                             |
| UI language         | Indonesian + English, switchable (default Indonesian)     |
| Audit log           | Required, Admin-only access                               |

## Open Item — Figma Wireframes (PENDING)

> Status: **Blocked — pending Figma plan upgrade.**

We tried to convert the lo-fi ASCII wireframes to Figma via the Figma MCP.
The connected Figma account has a **View-only seat** on the Starter plan, which blocks create/edit operations via the API.

### Resolution options when we resume

1. **Upgrade to Editor seat** (Figma Professional ~$15/mo). Then re-run wireframing via MCP — landing page first (most design-heavy), CRUD/dashboards/booking via spec or kit afterward.
2. **Create a Figma file manually** in drafts, share edit link, retry MCP write inside that file. (May or may not bypass seat restriction.)
3. **Switch tool:** use **Excalidraw** (free, web-based, ideal for lo-fi) or **Penpot** (open-source Figma alternative).
4. **Skip visual mockups** entirely — the ASCII wireframes in Notion are enough for stakeholder approval; build in code directly.

### Recommendation

Don't gate Phase 2 on this. Continue with the local prototype now; revisit Figma when the church confirms whether a polished visual deliverable is needed for the majelis presentation.

## Next Up

**Phase 2 — Infrastructure & Local Prototype**

- [x] Scaffold root monorepo (`pnpm-workspace`, configs)
- [x] Scaffold `packages/shared` (TS types)
- [x] Scaffold `apps/api` (NestJS + Prisma schema)
- [x] Scaffold `apps/web` (Vite + React + Tailwind + i18n)
- [x] Run `pnpm install`
- [ ] `pnpm db:up` (Postgres via docker-compose)
- [ ] `pnpm db:migrate` + seed admin user
- [x] Implement Auth module (JWT + refresh + guards)
- [x] Implement Login page + auth context
- [x] Build App Shell + Sidebar + RoleGate
- [x] First role-aware dashboard placeholder (now well beyond placeholder — Admin, Finance, and Division dashboards are built, including a full Users CRUD)

## Conventions

- Path separators: forward slashes in all docs (cross-platform safe).
- Dates in docs: ISO `YYYY-MM-DD`.
- Commits: Conventional Commits with the domain as scope, e.g. `feat(finance): add budget CRUD`.
  (This replaces the earlier `S1: scaffold monorepo` sprint-prefix convention.)
- Branches: `feat/<domain>-<thing>`, merged into `dev`, then `dev` → `main` at sprint end.
- Notion is the source of truth for design/PM artifacts; this repo is source of truth for code; `/docs` here is the bridge.
- Repository is **public**. Never commit real secrets; `.env` is gitignored and `.env.example` holds placeholders only.

## Phase 2.5 — Team Foundation (2026-08-15)

Design spec: `docs/superpowers/specs/2026-08-15-team-dev-foundation-design.md`

- [x] Git repository — public GitHub remote: https://github.com/jpangala/church-management
- [x] Node 22 pinned, ESLint + Prettier, boundary lint rules
- [x] Vitest in both apps
- [x] CI (`verify`): lint → typecheck → test → build
- [x] CODEOWNERS, PR template, CONTRIBUTING.md
- [x] Branch protection: `main` requires `verify` + 1 code-owner approval; `dev` requires `verify`. Approval requirement on `dev` switches on when a second collaborator joins.
- [ ] Structural refactor — see `docs/superpowers/plans/2026-08-15-structural-refactor.md`

## Quick Resume Checklist

When picking this up later:

1. Read this file.
2. Open Notion → **Church Management System Project** → **Sprint Plan** → see current sprint.
3. `pnpm install` if dependencies haven't been installed.
4. `docker-compose up -d` to start Postgres.
5. `pnpm dev` to run both apps.
6. Continue from "Next Up" above.
