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

The finance **dashboard** at `/finance` is not here — role dashboards live in `../dashboards/`.

## Conventions

- IDR formatting only. `formatIDR` already exists in `@/lib/utils` and is unit tested.
- Shared UI comes from `@/components/shared/`.
