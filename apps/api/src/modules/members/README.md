# Members & Projects — API module

**Owns:** `Member`, `Project`
**Owner:** unassigned — see [`.github/CODEOWNERS`](../../../../../.github/CODEOWNERS)

## To build

- `members.controller.ts` / `members.service.ts` — congregation records, backs `/admin/members` and `/division/members`
- `projects.controller.ts` / `projects.service.ts` — division projects with `ProjectStatus`, backs `/division/projects`

Register both in a single `members.module.ts`. Controllers must not touch Prisma directly — the linter enforces it.
