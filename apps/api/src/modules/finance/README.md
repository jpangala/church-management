# Finance — API module

**Owns:** `FinanceCategory`, `IncomeEntry`, `ExpenseEntry`, `Budget`
**Owner:** unassigned — see [`.github/CODEOWNERS`](../../../../../.github/CODEOWNERS)

## To build

- `finance.controller.ts` / `finance.service.ts` — or split per entity, registered in one `finance.module.ts`
- Backs `/finance/income`, `/finance/expenses`, `/finance/categories`, `/finance/budgets`
- `/finance/reports` — PDF export with the church header

## Rules that live here

- IDR only. No multi-currency.
- Money is never a float. Follow whatever `schema.prisma` declares.
