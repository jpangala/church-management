# Finance — web feature

**Owner:** unassigned — see [`.github/CODEOWNERS`](../../../../../.github/CODEOWNERS)

## Screens to build

| Route                 | Screen                    |
| --------------------- | ------------------------- |
| `/finance/income`     | Income ledger             |
| `/finance/expenses`   | Expense ledger            |
| `/finance/categories` | Category management       |
| `/finance/budgets`    | Budget planning vs actual |
| `/finance/reports`    | PDF export, church header |

All five are already linked from the sidebar (see `./nav.tsx`). Register each page in
`./routes.tsx` as you build it.

The finance **dashboard** at `/finance` is not here — role dashboards live in `../dashboards/`.

## Conventions

- IDR formatting only. `formatIDR` already exists in `@/lib/utils` and is unit tested.
- Shared UI comes from `@/components/shared/`.
