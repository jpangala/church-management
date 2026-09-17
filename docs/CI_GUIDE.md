# CI & Team Workflow Guide

A practical manual for working with this repo's CI and branch protection. For branch
naming, commit style, and where files go, see [`CONTRIBUTING.md`](../CONTRIBUTING.md) —
this doc doesn't repeat that, it covers the CI/PR mechanics around it.

## What CI actually does

Every push and PR to `main` or `dev` triggers the `verify` job
([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)), in this order:

| Step            | Fails when...                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Install         | Lockfile out of sync (`pnpm install --frozen-lockfile`) — you added/changed a dep without committing the updated `pnpm-lock.yaml` |
| Prisma generate | `apps/api/prisma/schema.prisma` has a syntax error                                                                                |
| Lint            | ESLint errors, incl. the boundary rules (controllers importing Prisma, `packages/shared` importing framework code)                |
| Typecheck       | TS errors anywhere in the workspace                                                                                               |
| Test            | A Vitest spec fails                                                                                                               |
| Build           | Compiles fine in dev but not in production mode (usually a missed import or env var)                                              |

Steps run cheapest-first so a broken build doesn't waste 10 minutes before you learn lint
also failed. Run the same four locally before opening a PR:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

If that passes locally, it passes in CI — there's no CI-only config drift to worry about.

## The PR gate

Both `main` and `dev` are protected. To merge, a PR needs:

| Branch | Required status check  | Code owner review required    | Approvals required                                               |
| ------ | ---------------------- | ----------------------------- | ---------------------------------------------------------------- |
| `dev`  | `verify` must be green | No                            | 0 _(bump to 1 once a second active collaborator is on the repo)_ |
| `main` | `verify` must be green | Yes — routed via `CODEOWNERS` | 0 _(same — see below)_                                           |

The `0` is deliberate, not an oversight: GitHub can't satisfy "1 approval" on a solo
developer's own PR. It's a placeholder that gets flipped the moment a second person can
actually review. **If you're reading this because a new teammate just joined, that
moment is now** — see the onboarding checklist below.

## Day-to-day loop

1. `git checkout dev && git pull`
2. `git checkout -b feat/<domain>-<thing>` (or `fix/...`, `chore/...`)
3. Do the work, following the folder map and lint boundary rules in `CONTRIBUTING.md`
4. `pnpm lint && pnpm typecheck && pnpm test && pnpm build` — fix anything red
5. Commit with [Conventional Commits](https://www.conventionalcommits.org/): `feat(finance): add budget CRUD endpoints`
6. Push, open a PR into `dev`, fill in the PR template honestly (the "how I tested it" field — "CI is green" doesn't count)
7. Wait for `verify` to pass and, once required, for the code owner to approve
8. Squash-merge into `dev`

`dev → main` promotion happens at sprint end via a merge commit (not squashed), so `main`'s
history shows what shipped in each sprint. This is normally done by the repo lead.

## When CI fails on your PR

- Click the failed check → open the `verify` job → the first red step is the one that
  matters; later steps didn't run.
- Reproduce locally with the single matching command (`pnpm lint`, `pnpm typecheck`, etc.)
  rather than re-running everything.
- Lockfile errors: run `pnpm install` locally (not `--frozen-lockfile`) to update the
  lockfile, then commit it.
- If lint fails on an import-boundary rule (controller importing `PrismaService`, or
  `packages/shared` importing NestJS/React/axios/express/Prisma), that's the linter
  enforcing the architecture — move the code, don't suppress the rule.
- Flaky test (passes on rerun with no code change): re-run the job once via the GitHub UI,
  then flag it — don't just keep rerunning.

## Onboarding a new collaborator (the "other team" checklist)

Do this once, per person, when someone new is ready to open their first PR:

1. **Add them to the repo** — GitHub → repo → Settings → Collaborators and teams → add
   their GitHub username with **Write** access (not Admin, unless they're also leading).
2. **Give them a CODEOWNERS slice** — edit [`.github/CODEOWNERS`](../.github/CODEOWNERS)
   and uncomment their domain (Identity, Members & Projects, Bookings & Assets, or
   Finance), replacing the placeholder handle (`@dev-identity`, etc.) with their real
   GitHub username. Leave the catch-all (`* @jpangala`) and the cross-cutting section as
   they are — those stay lead-owned regardless of who else joins.
3. **Point them at setup docs** — [`README.md`](../README.md) (local Postgres + env +
   `pnpm dev`) and [`CONTRIBUTING.md`](../CONTRIBUTING.md) (branches, commits, folder
   map). This file covers the CI/PR mechanics once they're up and running.
4. **Bump the approval requirement** — once at least one collaborator is actually able to
   review (not just added, but oriented enough to approve a real PR), raise
   `required_approving_review_count` from `0` to `1`:

   ```bash
   gh api -X PATCH repos/jpangala/church-management/branches/main/protection/required_pull_request_reviews \
     -f required_approving_review_count=1

   # Optional: require the same on dev once the team is big enough that unreviewed
   # integration-branch merges become a real risk.
   gh api -X PATCH repos/jpangala/church-management/branches/dev/protection/required_pull_request_reviews \
     -f required_approving_review_count=1
   ```

   Do this deliberately, not automatically on invite — bumping it before anyone else can
   actually approve locks you out of merging your own PRs.

5. **Update `docs/PROGRESS.md`** — tick off the collaborator and note the date, so the
   "temporarily 0" note there stops being stale.

## Quick reference

```bash
# Before opening any PR
pnpm lint && pnpm typecheck && pnpm test && pnpm build

# Update lockfile after adding/changing a dependency
pnpm install

# See why a PR is blocked from merging
gh pr checks <number>
gh pr view <number> --json reviewDecision,mergeStateStatus
```
