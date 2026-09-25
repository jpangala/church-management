# Shared UI Kit

The 22 components in `apps/web/src/components/shared/` that every domain module builds on.
This file documents what each one takes and how to use it.

**The one rule:** don't copy a component into your feature folder to change it. If you need
different behaviour, add a prop here and say so in your PR. Four divergent copies of
`DataTable` is the failure mode this folder exists to prevent. The folder is lead-owned
(see [`.github/CODEOWNERS`](../.github/CODEOWNERS)) precisely because a change here can break
all four modules at once.

Import everything through the `@/` alias:

```tsx
import DataTable, { type Column } from "@/components/shared/DataTable";
import { TextInput, Select } from "@/components/shared/inputs";
```

Jump to: [How a page fits together](#how-a-page-fits-together) · [Page chrome](#page-chrome) ·
[Page structure](#page-structure) · [Data display](#data-display) · [Forms](#forms) ·
[Primitives](#primitives) · [Worked examples](#worked-examples) · [Gotchas](#gotchas)

---

## How a page fits together

Every authenticated screen nests the same way:

```
DashboardLayout            ← chrome: sidebar + ambient backdrop + scrolling main
  └── TopBar               ← the greeting strip at the top of the content column
  └── PageHeader           ← title, description, actions, optional back link
  └── RevealOnView         ← scroll-in animation wrapper (optional, used liberally)
        └── Panel          ← the card surface most content sits on
              └── your content
```

Forms swap `Panel` for `FormShell` → `FormSection` → `Field`.

`DashboardLayout` already renders `AmbientBackdrop` and `Sidebar` for you — you never mount
those yourself. You give it a `role` and your page body.

---

## Page chrome

### `DashboardLayout`

The outermost wrapper for every authenticated screen. Renders the sidebar, the ambient
background, and a scrolling main column.

| Prop       | Type        |                                                            |
| ---------- | ----------- | ---------------------------------------------------------- |
| `role`     | `Role`      | from `@church/shared`; decides which nav the sidebar shows |
| `children` | `ReactNode` | your page                                                  |

```tsx
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useAuth } from "@/features/identity/auth.context";

export default function MembersListPage() {
  const { user } = useAuth();
  return <DashboardLayout role={user.role}>{/* page body */}</DashboardLayout>;
}
```

### `Sidebar`

Rendered by `DashboardLayout`; you should not mount it directly.

| Prop   | Type   |
| ------ | ------ |
| `role` | `Role` |

**Read this before adding a route.** The navigation is a hardcoded
`Record<Role, { section, items }[]>` inside `Sidebar.tsx`. Adding a screen to the nav means
editing a lead-owned file, so it needs a review from the lead rather than being something you
can land inside your own module. Flag it early — it is the most likely place four people's
work collides.

### `TopBar`

The strip at the top of the content column.

| Prop       | Type         |                                               |
| ---------- | ------------ | --------------------------------------------- |
| `eyebrow`  | `string`     | small label above the title                   |
| `title`    | `string`     |                                               |
| `caption`  | `string?`    |                                               |
| `trailing` | `ReactNode?` | right-aligned slot, usually buttons or a bell |

### `AmbientBackdrop`

Decorative background gradient. No props. Rendered by `DashboardLayout`.

---

## Page structure

### `PageHeader`

| Prop          | Type                             |                                        |
| ------------- | -------------------------------- | -------------------------------------- |
| `title`       | `string`                         | required                               |
| `eyebrow`     | `string?`                        |                                        |
| `description` | `string?`                        |                                        |
| `actions`     | `ReactNode?`                     | right-aligned, usually `IslandButton`s |
| `backTo`      | `{ to: string; label: string }?` | renders a back link                    |
| `meta`        | `ReactNode?`                     | extra content under the description    |

```tsx
<PageHeader
  eyebrow="Members"
  title="Congregation"
  description="Every registered member, across all divisions."
  actions={
    <IslandButton onClick={() => navigate("new")}>Add member</IslandButton>
  }
/>
```

### `Panel`

The card surface most content sits on. Forwards a ref.

| Prop        | Type                                     | Default          |
| ----------- | ---------------------------------------- | ---------------- |
| `children`  | `ReactNode`                              |                  |
| `tone`      | `"surface" \| "espresso" \| "champagne"` | `"surface"`      |
| `as`        | `"div" \| "section" \| "article"`        | `"div"`          |
| `inset`     | `string?`                                | padding override |
| `className` | `string?`                                |                  |

### `Eyebrow`

Small uppercase label.

| Prop        | Type                                 | Default     |
| ----------- | ------------------------------------ | ----------- |
| `children`  | `ReactNode`                          |             |
| `tone`      | `"default" \| "accent" \| "primary"` | `"default"` |
| `className` | `string?`                            |             |

### `RevealOnView`

Fades and lifts its children in as they scroll into view. Used heavily on the dashboards.

| Prop        | Type                         | Default |                                   |
| ----------- | ---------------------------- | ------- | --------------------------------- |
| `children`  | `ReactNode`                  |         |                                   |
| `delay`     | `number?`                    | `0`     | ms, for staggering sibling blocks |
| `as`        | `"div" \| "section" \| "li"` | `"div"` |                                   |
| `className` | `string?`                    |         |                                   |

```tsx
<RevealOnView delay={120} className="mt-6">
  <Panel>…</Panel>
</RevealOnView>
```

### `useReveal(delayMs?)`

The hook behind `RevealOnView`, for when you need the ref on your own element. Returns a ref;
wires an `IntersectionObserver` that sets `data-reveal="in"` once. The fade itself lives in
`styles/globals.css`.

```tsx
const ref = useReveal<HTMLDivElement>(200);
return <div ref={ref}>…</div>;
```

---

## Data display

### `DataTable<T>`

The workhorse. Generic over your row type, which **must have an `id`**.

| Prop                | Type                                   |                               |
| ------------------- | -------------------------------------- | ----------------------------- |
| `columns`           | `Column<T>[]`                          |                               |
| `rows`              | `T[]`                                  |                               |
| `selectable`        | `boolean?`                             | renders checkboxes            |
| `selectedIds`       | `Set<string \| number>?`               |                               |
| `onSelectionChange` | `(ids: Set<string \| number>) => void` |                               |
| `rowAction`         | `(row: T) => void`                     | click handler for a whole row |
| `emptyState`        | `ReactNode?`                           | usually an `<EmptyState />`   |
| `caption`           | `string?`                              | screen-reader caption         |

`Column<T>`:

| Field      | Type                            |                                                  |
| ---------- | ------------------------------- | ------------------------------------------------ |
| `key`      | `string`                        | unique per column                                |
| `header`   | `string`                        |                                                  |
| `render`   | `(row: T) => ReactNode`         | required — you control every cell                |
| `sortable` | `boolean?`                      |                                                  |
| `accessor` | `(row: T) => string \| number`  | **required if `sortable`** — the value sorted on |
| `align`    | `"left" \| "right" \| "center"` |                                                  |
| `width`    | `string?`                       | CSS width                                        |

```tsx
const columns: Column<Member>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    accessor: (r) => r.name,
    render: (r) => <span className="font-medium">{r.name}</span>,
  },
  { key: "division", header: "Division", render: (r) => r.division ?? "—" },
];

<DataTable
  columns={columns}
  rows={paged}
  selectable
  selectedIds={selected}
  onSelectionChange={setSelected}
  rowAction={(r) => navigate(`/admin/members/${r.id}`)}
  emptyState={<EmptyState title="No members yet" />}
/>;
```

`SortDir` (`"asc" | "desc"`) is exported too, if you sort server-side.

### `Toolbar`

Search box plus filter chips, above a table.

| Prop                | Type                    |                          |
| ------------------- | ----------------------- | ------------------------ |
| `searchValue`       | `string`                |                          |
| `onSearchChange`    | `(v: string) => void`   |                          |
| `searchPlaceholder` | `string?`               |                          |
| `filters`           | `FilterChip[]?`         | `{ key, label, count? }` |
| `activeFilter`      | `string?`               |                          |
| `onFilterChange`    | `(key: string) => void` |                          |
| `trailing`          | `ReactNode?`            |                          |

Reset the page to 1 whenever search or filter changes, or users land on an empty page:

```tsx
<Toolbar
  searchValue={search}
  onSearchChange={(v) => {
    setSearch(v);
    setPage(1);
  }}
  searchPlaceholder="Search name or email…"
  activeFilter={filter}
  onFilterChange={(k) => {
    setFilter(k);
    setPage(1);
  }}
  filters={[
    { key: "all", label: "All", count: rows.length },
    { key: "active", label: "Active", count: activeCount },
  ]}
/>
```

### `Pagination`

| Prop           | Type                                        |
| -------------- | ------------------------------------------- |
| `page`         | `number` (1-based)                          |
| `pageSize`     | `number`                                    |
| `total`        | `number` (full count, not the current page) |
| `onPageChange` | `(page: number) => void`                    |

### `BulkActionBar`

Appears when rows are selected.

| Prop       | Type         |                       |
| ---------- | ------------ | --------------------- |
| `count`    | `number`     | how many are selected |
| `onClear`  | `() => void` |                       |
| `children` | `ReactNode`  | the action buttons    |

### `StatCard`

The KPI tiles across the top of each dashboard.

| Prop     | Type                                                  |                                                                  |
| -------- | ----------------------------------------------------- | ---------------------------------------------------------------- |
| `label`  | `string`                                              |                                                                  |
| `value`  | `string`                                              | already formatted — use `formatIDR` from `@/lib/utils` for money |
| `delta`  | `{ value: string; trend: "up" \| "down" \| "flat" }?` |                                                                  |
| `sub`    | `string?`                                             |                                                                  |
| `icon`   | `ReactNode?`                                          |                                                                  |
| `accent` | `boolean?`                                            | highlights the card                                              |

### `EmptyState`

| Prop          | Type         |
| ------------- | ------------ |
| `title`       | `string`     |
| `description` | `string?`    |
| `icon`        | `ReactNode?` |
| `action`      | `ReactNode?` |

---

## Forms

The nesting is `FormShell` → `FormSection` → `Field` → an input, with `FormActionBar` at the
bottom.

### `FormShell`

The outer card. Takes only `children`.

### `FormSection`

A titled group of fields.

| Prop          | Type         |                           |
| ------------- | ------------ | ------------------------- |
| `title`       | `string`     | required                  |
| `eyebrow`     | `string?`    |                           |
| `description` | `string?`    |                           |
| `aside`       | `ReactNode?` | right-hand column content |
| `children`    | `ReactNode`  | the fields                |

### `Field`

Label, description, error text and layout for one input.

**`children` is a render prop, not a node.** `Field` generates the input's `id`, wires
`htmlFor` to it, and hands it to you. Always spread it onto your input — that's what makes
clicking the label focus the field.

| Prop            | Type                        |                              |
| --------------- | --------------------------- | ---------------------------- |
| `label`         | `string`                    | required                     |
| `children`      | `(id: string) => ReactNode` | **render prop**              |
| `error`         | `string?`                   | renders the error state      |
| `description`   | `string?`                   | helper text                  |
| `required`      | `boolean?`                  |                              |
| `optionalLabel` | `string?`                   | text shown when not required |
| `htmlFor`       | `string?`                   | override the generated id    |
| `trailing`      | `ReactNode?`                |                              |
| `className`     | `string?`                   |                              |

```tsx
<Field
  label="Full name"
  required
  error={errors.name}
  description="Shown on the audit log and public pages."
>
  {(id) => (
    <TextInput
      id={id}
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      invalid={Boolean(errors.name)}
    />
  )}
</Field>
```

### `FormActionBar`

The sticky save/cancel row.

| Prop       | Type         |                                               |
| ---------- | ------------ | --------------------------------------------- |
| `children` | `ReactNode`  | the buttons                                   |
| `status`   | `ReactNode?` | left-aligned status text, e.g. "Saved 2m ago" |

### Inputs — `inputs.tsx`

Four named exports. `TextInput`, `Textarea` and `Select` extend their native React props, so
`value`, `onChange`, `placeholder`, `disabled`, `required` and the rest all work as normal.

**`TextInput`** — native `input` props, plus:

| Prop      | Type         |                           |
| --------- | ------------ | ------------------------- |
| `invalid` | `boolean?`   | error styling             |
| `leading` | `ReactNode?` | icon inside the left edge |

**`Textarea`** — native `textarea` props, plus `invalid`.

**`Select`** — native `select` props, plus `invalid` and:

| Prop      | Type                                 |                                                   |
| --------- | ------------------------------------ | ------------------------------------------------- |
| `options` | `{ value: string; label: string }[]` | **required** — pass data, not `<option>` children |

**`Switch`** — a controlled toggle. Not a native input wrapper.

| Prop          | Type                   |                                    |
| ------------- | ---------------------- | ---------------------------------- |
| `checked`     | `boolean`              |                                    |
| `onChange`    | `(v: boolean) => void` | receives the boolean, not an event |
| `label`       | `string?`              |                                    |
| `description` | `string?`              |                                    |
| `disabled`    | `boolean?`             |                                    |
| `id`          | `string?`              |                                    |

### `RadioCardGroup`

Large clickable cards instead of radio buttons. Used for role selection on the user form.

| Prop       | Type                                      | Default |
| ---------- | ----------------------------------------- | ------- |
| `name`     | `string`                                  |         |
| `value`    | `string`                                  |         |
| `onChange` | `(v: string) => void`                     |         |
| `options`  | `{ value, label, description?, icon? }[]` |         |
| `columns`  | `1 \| 2 \| 3`                             |         |

---

## Primitives

### `IslandButton`

The standard button. Extends every native `<button>` prop and forwards a ref.

| Prop           | Type                             | Default     |
| -------------- | -------------------------------- | ----------- |
| `variant`      | `"primary" \| "ghost" \| "soft"` | `"primary"` |
| `size`         | `"md" \| "sm"`                   | `"md"`      |
| `trailingIcon` | `ReactNode \| null`              |             |

```tsx
<IslandButton variant="ghost" size="sm" onClick={onCancel}>
  Cancel
</IslandButton>
```

Inside a form, remember `type="button"` on anything that shouldn't submit.

### `icons.tsx`

36 inline SVGs, each taking standard `SVGProps<SVGSVGElement>`. Check here before adding one —
the set is broader than it looks:

|                   |                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------- |
| **Navigation**    | `ArrowUp` `ArrowDown` `ArrowLeft` `ArrowUpRight` `ChevronDown` `ChevronLeft` `ChevronRight` |
| **Actions**       | `Plus` `Pencil` `Trash` `Check` `X` `Upload` `Filter` `SortAsc` `Search` `Dots`             |
| **Objects**       | `Grid` `Users` `User` `Layers` `Document` `Clipboard` `Folder` `Tag` `Calendar` `ChartLine` |
| **Status & misc** | `Bell` `Lock` `Logout` `Eye` `Globe` `Mail` `Phone` `Sparkles` `Gear`                       |

```tsx
import { Users } from "@/components/shared/icons";
<Users className="h-4 w-4" />;
```

Need one that isn't here? Add it to `icons.tsx` in the same style rather than inlining an SVG
in your feature — but that file is lead-owned, so raise it in your PR.

---

## Worked examples

### A list page

```tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/shared/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import Panel from "@/components/shared/Panel";
import Toolbar from "@/components/shared/Toolbar";
import DataTable, { type Column } from "@/components/shared/DataTable";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import IslandButton from "@/components/shared/IslandButton";
import { useAuth } from "@/features/identity/auth.context";

const PAGE_SIZE = 8;

export default function MembersListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<Member>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      accessor: (r) => r.name,
      render: (r) => r.name,
    },
    { key: "division", header: "Division", render: (r) => r.division ?? "—" },
  ];

  return (
    <DashboardLayout role={user.role}>
      <PageHeader
        eyebrow="Members"
        title="Congregation"
        actions={
          <IslandButton onClick={() => navigate("new")}>
            Add member
          </IslandButton>
        }
      />
      <Panel>
        <Toolbar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Search members…"
        />
        <DataTable
          columns={columns}
          rows={paged}
          rowAction={(r) => navigate(`${r.id}`)}
          emptyState={
            <EmptyState
              title="No members found"
              description="Try a different search."
            />
          }
        />
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      </Panel>
    </DashboardLayout>
  );
}
```

### A form page

```tsx
<DashboardLayout role={user.role}>
  <PageHeader
    title="New member"
    backTo={{ to: "/admin/members", label: "Back to members" }}
  />
  <FormShell>
    <FormSection title="Identity" description="Basic contact details.">
      <Field label="Full name" required error={errors.name}>
        {(id) => (
          <TextInput
            id={id}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            invalid={Boolean(errors.name)}
          />
        )}
      </Field>

      <Field label="Division" description="Leave blank if unassigned.">
        {(id) => (
          <Select
            id={id}
            value={form.divisionId}
            onChange={(e) => setForm({ ...form, divisionId: e.target.value })}
            options={divisions.map((d) => ({ value: d.id, label: d.name }))}
          />
        )}
      </Field>

      <Switch
        checked={form.active}
        onChange={(v) => setForm({ ...form, active: v })}
        label="Active"
        description="Inactive members stay in the records but are hidden from lists."
      />
    </FormSection>

    <FormActionBar status={dirty ? "Unsaved changes" : undefined}>
      <IslandButton type="button" variant="ghost" onClick={() => navigate(-1)}>
        Cancel
      </IslandButton>
      <IslandButton type="submit">Save member</IslandButton>
    </FormActionBar>
  </FormShell>
</DashboardLayout>
```

---

## Gotchas

The things that will cost you twenty minutes if you don't know them:

- **`Field`'s `children` is a function**, `(id) => ReactNode`. Pass the `id` to your input or
  the label stops focusing it.
- **`Select` takes an `options` array**, not `<option>` children.
- **`Switch.onChange` receives a boolean**, not an event — unlike the other three inputs.
- **`DataTable` rows must have an `id`** (`string | number`). It's in the generic constraint.
- **A `sortable` column needs an `accessor`.** `render` returns JSX, which can't be sorted.
- **`Pagination.total` is the full filtered count**, not the length of the current page.
- **`DashboardLayout` already renders `Sidebar` and `AmbientBackdrop`.** Don't mount them again.
- **Adding a nav entry means editing `Sidebar.tsx`**, which is lead-owned. Plan for a review.
- **`IslandButton` defaults to a submit button inside a form.** Set `type="button"` on Cancel.
- **Money is formatted with `formatIDR`** from `@/lib/utils`, which is unit tested. `StatCard`
  and table cells take an already-formatted string.

## Adding to this folder

A component belongs here when **more than one domain module** would use it. One that only your
module needs goes in `features/<module>/components/`.

Either way, changing something here is a lead-reviewed PR, because it can break all four
modules at once. Say in the PR which modules you checked.
