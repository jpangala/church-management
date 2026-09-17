# Shared UI kit — cross-cutting

**Owner:** repo lead. Every domain depends on these.

**Full reference with props and examples: [`docs/UI_KIT.md`](../../../../../docs/UI_KIT.md).**
This file only covers ownership; that one covers how to use each component.

22 components used across all four domain modules: `DataTable`, `Pagination`, `FormShell`,
`FormSection`, `FormActionBar`, `Field`, `Panel`, `StatCard`, `PageHeader`, `Toolbar`,
`BulkActionBar`, `EmptyState`, `RadioCardGroup`, `Sidebar`, `TopBar`, `DashboardLayout`,
`AmbientBackdrop`, `RevealOnView`, `IslandButton`, `Eyebrow`, plus `icons` and `inputs`.

## Rules

- **Don't fork a component into your feature folder.** If you need different behaviour, add a
  prop here and call it out in your PR — four divergent copies of `DataTable` is the failure
  mode this folder exists to prevent.
- Changes here are reviewed by the lead, because they can break all four domains at once.
- A component only one domain uses belongs in that feature's `components/`, not here.
