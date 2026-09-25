# Members & Projects — web feature

**Owner:** unassigned — see [`.github/CODEOWNERS`](../../../../../.github/CODEOWNERS)

## Screens to build

| Route                | Screen                                           |
| -------------------- | ------------------------------------------------ |
| `/admin/members`     | Congregation list + member form                  |
| `/division/members`  | Members scoped to the leader's division          |
| `/division/projects` | Project list + form, `ProjectStatus` transitions |

All three are already linked from the sidebar and currently 404.

## Conventions

- Shared UI comes from `@/components/shared/` — `DataTable`, `FormShell`, `Pagination`, `PageHeader`. Do not fork them; if one needs a new prop, change it there and say so in your PR.
- Components only this domain uses go in `./components/`.
- API calls go in `./api.ts`, data hooks in `./queries.ts`.
