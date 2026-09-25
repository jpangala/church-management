# Practice Drill: Build "Pengumuman" End to End

A hands-on exercise for new contributors. You'll build a small **Announcements (Pengumuman)**
feature from an empty folder to an open pull request, and along the way:

- use **every component** in the shared UI kit
- register a screen the way every module does, with `nav.tsx` and `routes.tsx`
- write pure logic and **unit tests** for it
- go through the whole Git loop: branch, commit, push, pull request
- watch **CI** check your work, then **break it on purpose** four different ways, so a red
  check never scares you again

**Time:** 2–3 hours. **Backend:** none. The data lives in memory, so you can focus on the
frontend and the workflow.

> **This is practice. Never merge it.** You'll open your pull request as a **draft** and close it
> at the end. Everyone on the team does the drill separately, on their own branch.

Reference docs, keep these open: [`UI_KIT.md`](UI_KIT.md) for component props,
[`GIT_REFERENCE.md`](GIT_REFERENCE.md) for any Git word or command you don't know,
[`CI_GUIDE.md`](CI_GUIDE.md) for CI details.

---

## Contents

0. [Before you start](#0-before-you-start)
1. [How CI works, in two minutes](#1-how-ci-works-in-two-minutes)
2. [Make your branch](#2-make-your-branch)
3. [The logic, test first](#3-the-logic-test-first)
4. [The store](#4-the-store)
5. [Put it in the sidebar](#5-put-it-in-the-sidebar)
6. [The list page](#6-the-list-page)
7. [The form page](#7-the-form-page)
8. [Check it on a phone-sized screen](#8-check-it-on-a-phone-sized-screen)
9. [Push it and watch CI](#9-push-it-and-watch-ci)
10. [Break CI on purpose](#10-break-ci-on-purpose)
11. [Clean up](#11-clean-up)
12. [Checklist](#12-checklist)

Each step says **what to build**, then gives a **check** to prove it works. Solutions are folded
away under **Solution**. Try the step yourself first, and only open the solution when you're
stuck or to compare afterwards.

---

## 0. Before you start

You should already have the project running from [`ONBOARDING.md`](ONBOARDING.md):

```bash
git checkout dev && git pull
```

```bash
pnpm dev
```

Open <http://localhost:5175> and log in with the **admin** account. Ask the lead for the dev
password; it's never written in the repo, because the repo is public.

---

## 1. How CI works, in two minutes

**CI** ("continuous integration") is a robot that checks every pull request. Ours is one GitHub
Actions job called **`verify`**, defined in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).
It runs on **every pull request**, and on every push to `main` and `dev`.

It runs these steps **in order**:

| #   | Step            | Fails when…                                                            | Run it yourself                     |
| --- | --------------- | ---------------------------------------------------------------------- | ----------------------------------- |
| 1   | Install         | `pnpm-lock.yaml` doesn't match `package.json`                          | `pnpm install --frozen-lockfile`    |
| 2   | Prisma generate | the database schema has an error                                       | `pnpm --filter api prisma:generate` |
| 3   | **Lint**        | code breaks a rule (unused import, misused React hook, boundary rules) | `pnpm lint`                         |
| 4   | **Typecheck**   | TypeScript finds a type error                                          | `pnpm typecheck`                    |
| 5   | **Test**        | a unit test fails                                                      | `pnpm test`                         |
| 6   | **Build**       | the production build fails                                             | `pnpm build`                        |

Three things to remember:

1. **It stops at the first failure.** If lint fails, typecheck, test and build don't run at
   all; GitHub shows them as skipped. So the **first red step is the one that matters**.
2. **Cheapest first.** Lint takes seconds, build takes longest, so you hear about cheap mistakes
   quickly.
3. **A red check blocks merging into `dev` and `main`.** Branch protection requires `verify` to
   pass. There's no way around it, and that's the point.

Everything CI runs, you can run first on your laptop. This one line is the whole of CI's checking:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

If it passes on your machine, it passes in CI. The whole job takes about **35 seconds** on GitHub.

---

## 2. Make your branch

Start from the latest `dev`, then branch. Use your own name:

```bash
git checkout dev && git pull
```

```bash
git checkout -b drill/<yourname>-pengumuman
```

Everything you build goes in one new folder:

```
apps/web/src/features/practice/
  announcements.ts        ← types, sample data, pure logic
  announcements.spec.ts   ← unit tests for that logic
  store.ts                ← keeps the list in memory
  nav.tsx                 ← the sidebar link
  routes.tsx              ← the two pages
  AnnouncementsPage.tsx   ← the list
  AnnouncementFormPage.tsx← the form
```

---

## 3. The logic, test first

**Build** `announcements.ts` and `announcements.spec.ts`. No React in either file.

The logic file needs:

- **Types.** An `Announcement` has `id`, `title`, `body`, `audience` (`"ALL" | "LEADERS" |
"DIVISION"`), `division`, `pinned`, `status` (`"DRAFT" | "PUBLISHED"`) and `createdAt`.
- **`SEED`**: about six sample announcements, a mix of drafts and published, with one pinned.
- **`filterAnnouncements(items, search, status)`**: searches title and body (ignoring case),
  filters by status (`"all"` means no filter), and sorts pinned first, then newest first.
- **`summarize(items)`**: returns `{ total, published, drafts }`.
- **`publish(items, ids)`**: returns a **new** list with those ids published. It must never
  change the list you pass in.
- **`validate(draft)`**: returns one message per invalid field. The title and body are
  required, the title is at most 80 characters, and a division is required when the audience is
  `"DIVISION"`. An empty object means valid.

Why keep this separate from the pages? Logic without React can be tested in milliseconds,
without rendering anything. It's the same reason the API keeps logic in services, not controllers.

**Check.** Run just your tests, in watch mode, so they re-run every time you save:

```bash
pnpm --filter web exec vitest src/features/practice
```

Aim for 8 passing tests that cover each function. Press `q` to quit watch mode.

> **Gotcha you'll likely hit:** this repo has `noUncheckedIndexedAccess` switched on.
> `list[0].pinned` is a **type error**, because `list[0]` might not exist. Write
> `list[0]?.pinned`. The drill's author hit exactly this while building it.

<details>
<summary><b>Solution:</b> <code>features/practice/announcements.ts</code></summary>

```ts
// Pure data and logic for the practice feature. No React in this file, so
// every function here can be unit tested without rendering anything.

export type Audience = "ALL" | "LEADERS" | "DIVISION";
export type AnnouncementStatus = "DRAFT" | "PUBLISHED";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: Audience;
  division: string; // only used when audience is "DIVISION"
  pinned: boolean;
  status: AnnouncementStatus;
  createdAt: string; // ISO date, e.g. "2026-09-20"
}

export type AnnouncementDraft = Omit<Announcement, "id" | "createdAt">;
export type StatusFilter = "all" | AnnouncementStatus;

export const AUDIENCE_LABEL: Record<Audience, string> = {
  ALL: "Semua jemaat",
  LEADERS: "Pengurus",
  DIVISION: "Satu divisi",
};

export const DIVISIONS = [
  { value: "musik", label: "Musik & Worship" },
  { value: "pemuda", label: "Pemuda & Remaja" },
  { value: "diakonia", label: "Pelayanan Diakonia" },
];

export const SEED: Announcement[] = [
  {
    id: "a1",
    title: "Ibadah Natal bersama",
    body: "Ibadah Natal gabungan tanggal 24 Desember pukul 18.00 di Aula Utama.",
    audience: "ALL",
    division: "",
    pinned: true,
    status: "PUBLISHED",
    createdAt: "2026-09-20",
  },
  {
    id: "a2",
    title: "Rapat pengurus bulanan",
    body: "Rapat evaluasi program kuartal tiga, Sabtu pukul 10.00.",
    audience: "LEADERS",
    division: "",
    pinned: false,
    status: "PUBLISHED",
    createdAt: "2026-09-18",
  },
  {
    id: "a3",
    title: "Latihan paduan suara",
    body: "Latihan tambahan untuk persiapan Natal setiap Kamis malam.",
    audience: "DIVISION",
    division: "musik",
    pinned: false,
    status: "PUBLISHED",
    createdAt: "2026-09-17",
  },
  {
    id: "a4",
    title: "Retret pemuda",
    body: "Pendaftaran retret pemuda dibuka sampai akhir bulan.",
    audience: "DIVISION",
    division: "pemuda",
    pinned: false,
    status: "DRAFT",
    createdAt: "2026-09-15",
  },
  {
    id: "a5",
    title: "Bakti sosial",
    body: "Pengumpulan sembako untuk bakti sosial di Banten.",
    audience: "ALL",
    division: "",
    pinned: false,
    status: "DRAFT",
    createdAt: "2026-09-12",
  },
  {
    id: "a6",
    title: "Jadwal kebersihan gedung",
    body: "Pembagian jadwal kebersihan gedung untuk bulan Oktober.",
    audience: "LEADERS",
    division: "",
    pinned: false,
    status: "PUBLISHED",
    createdAt: "2026-09-10",
  },
];

/** Search title and body, filter by status, pinned first, then newest first. */
export function filterAnnouncements(
  items: Announcement[],
  search: string,
  status: StatusFilter,
): Announcement[] {
  const q = search.trim().toLowerCase();
  return items
    .filter((a) => status === "all" || a.status === status)
    .filter(
      (a) =>
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q),
    )
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        b.createdAt.localeCompare(a.createdAt),
    );
}

export function summarize(items: Announcement[]) {
  return {
    total: items.length,
    published: items.filter((a) => a.status === "PUBLISHED").length,
    drafts: items.filter((a) => a.status === "DRAFT").length,
  };
}

/** Returns a new list with the selected announcements published. Never mutates. */
export function publish(
  items: Announcement[],
  ids: Set<string | number>,
): Announcement[] {
  return items.map((a) => (ids.has(a.id) ? { ...a, status: "PUBLISHED" } : a));
}

/** One message per invalid field. An empty object means the draft is valid. */
export function validate(
  draft: AnnouncementDraft,
): Partial<Record<keyof AnnouncementDraft, string>> {
  const errors: Partial<Record<keyof AnnouncementDraft, string>> = {};
  if (!draft.title.trim()) errors.title = "Judul wajib diisi.";
  else if (draft.title.length > 80)
    errors.title = "Judul maksimal 80 karakter.";
  if (!draft.body.trim()) errors.body = "Isi pengumuman wajib diisi.";
  if (draft.audience === "DIVISION" && !draft.division)
    errors.division = "Pilih divisi tujuan.";
  return errors;
}
```

</details>

<details>
<summary><b>Solution:</b> <code>features/practice/announcements.spec.ts</code></summary>

```ts
import { describe, expect, it } from "vitest";
import {
  SEED,
  filterAnnouncements,
  publish,
  summarize,
  validate,
  type AnnouncementDraft,
} from "./announcements";

const valid: AnnouncementDraft = {
  title: "Ibadah pagi",
  body: "Mulai pukul 07.00.",
  audience: "ALL",
  division: "",
  pinned: false,
  status: "DRAFT",
};

describe("filterAnnouncements", () => {
  it("puts pinned announcements first", () => {
    expect(filterAnnouncements(SEED, "", "all")[0]?.pinned).toBe(true);
  });

  it("filters by status", () => {
    const drafts = filterAnnouncements(SEED, "", "DRAFT");
    expect(drafts.length).toBeGreaterThan(0);
    expect(drafts.every((a) => a.status === "DRAFT")).toBe(true);
  });

  it("searches title and body, ignoring case", () => {
    expect(
      filterAnnouncements(SEED, "SEMBAKO", "all").map((a) => a.id),
    ).toEqual(["a5"]);
  });
});

describe("summarize", () => {
  it("counts published and drafts", () => {
    const s = summarize(SEED);
    expect(s.published + s.drafts).toBe(s.total);
  });
});

describe("publish", () => {
  it("publishes only the selected ids, without mutating the input", () => {
    const next = publish(SEED, new Set(["a4"]));
    expect(next.find((a) => a.id === "a4")?.status).toBe("PUBLISHED");
    expect(next.find((a) => a.id === "a5")?.status).toBe("DRAFT");
    expect(SEED.find((a) => a.id === "a4")?.status).toBe("DRAFT");
  });
});

describe("validate", () => {
  it("accepts a complete draft", () => {
    expect(validate(valid)).toEqual({});
  });

  it("requires a title and a body", () => {
    const errors = validate({ ...valid, title: " ", body: "" });
    expect(errors.title).toBeDefined();
    expect(errors.body).toBeDefined();
  });

  it("requires a division when the audience is one division", () => {
    expect(validate({ ...valid, audience: "DIVISION" }).division).toBeDefined();
    expect(
      validate({ ...valid, audience: "DIVISION", division: "musik" }),
    ).toEqual({});
  });
});
```

</details>

---

## 4. The store

The two pages need to share the list: when you create an announcement on the form, it should
appear on the list. With no backend yet, a tiny in-memory store does that. It's plumbing, so
copy this one as-is:

```ts
import { useSyncExternalStore } from "react";
import { SEED, type Announcement } from "./announcements";

// In-memory store so the drill needs no backend. Everything resets on reload.
// In a real module this is where the API calls in ./api.ts would go instead.
let items: Announcement[] = SEED;
const listeners = new Set<() => void>();

function set(next: Announcement[]) {
  items = next;
  listeners.forEach((listener) => listener());
}

export const announcementStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getAll: () => items,
  add: (a: Announcement) => set([a, ...items]),
  replaceAll: (next: Announcement[]) => set(next),
};

export function useAnnouncements() {
  return useSyncExternalStore(
    announcementStore.subscribe,
    announcementStore.getAll,
  );
}
```

Every component that calls `useAnnouncements()` re-renders when the list changes. In a real
module, this is where the calls to your API (`./api.ts`) would go instead.

---

## 5. Put it in the sidebar

Every module declares its own sidebar links in `nav.tsx` and its pages in `routes.tsx`.
[`UI_KIT.md`](UI_KIT.md#sidebar) explains why.

**Build** `nav.tsx` with one ADMIN link in the **`Manage`** section, pointing to
`/admin/practice/announcements`. Then build `routes.tsx` with two ADMIN routes:
`/admin/practice/announcements` (the list) and `/admin/practice/announcements/new` (the form).

Start with placeholder pages, just `<DashboardLayout role="ADMIN"><TopBar eyebrow="Latihan"
title="Pengumuman" /></DashboardLayout>`, so you can see the route working before building
the real page.

Then register your module in the two lead-owned files:

- `apps/web/src/app/navigation.ts`: import `practiceNav` and add `...practiceNav` to
  `ALL_NAV_ENTRIES`
- `apps/web/src/app/routes.ts`: import `practiceRoutes` and add `...practiceRoutes` to
  `MODULE_ROUTES`

> **In your real module you skip this step.** The four domain modules are already registered.
> You'll only ever edit your own `nav.tsx` and `routes.tsx`.

**Check.** Reload the app. **"Pengumuman (Latihan)"** appears in the sidebar under _Manage_, and
clicking it shows your placeholder.

<details>
<summary><b>Solution:</b> <code>features/practice/nav.tsx</code></summary>

```tsx
import type { NavEntry } from "@/app/types";
import { Bell } from "@/components/shared/icons";

export const practiceNav: NavEntry[] = [
  {
    role: "ADMIN",
    section: "Manage",
    to: "/admin/practice/announcements",
    label: "Pengumuman (Latihan)",
    icon: <Bell />,
  },
];
```

</details>

<details>
<summary><b>Solution:</b> <code>features/practice/routes.tsx</code></summary>

```tsx
import type { ModuleRoute } from "@/app/types";
import AnnouncementsPage from "./AnnouncementsPage";
import AnnouncementFormPage from "./AnnouncementFormPage";

export const practiceRoutes: ModuleRoute[] = [
  {
    path: "/admin/practice/announcements",
    roles: ["ADMIN"],
    element: <AnnouncementsPage />,
  },
  {
    path: "/admin/practice/announcements/new",
    roles: ["ADMIN"],
    element: <AnnouncementFormPage />,
  },
];
```

</details>

---

## 6. The list page

**Build** `AnnouncementsPage.tsx`. Add one piece at a time and look at the browser after each:

| Piece             | Components                   | Tips                                                                            |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------- |
| Frame             | `DashboardLayout`, `TopBar`  | `TopBar`'s `trailing` holds a "Buat Pengumuman" `IslandButton`                  |
| Header            | `RevealOnView`, `PageHeader` | `actions` takes the same button                                                 |
| Numbers           | `StatCard` ×3                | total, published and drafts from `summarize()`. Make one `accent`               |
| Pinned            | `Panel`, `Eyebrow`           | show the first pinned announcement, `tone="champagne"`                          |
| Search and filter | `Toolbar`                    | chips for _Semua / Terbit / Draf_ with counts. Reset to page 1 when they change |
| Table             | `DataTable`                  | `selectable`. Columns: title (with the body underneath), audience, status       |
| Nothing found     | `EmptyState`                 | as `DataTable`'s `emptyState`, with a "Reset Filter" action                     |
| Pages             | `Pagination`                 | 5 per page. `total` is the **filtered** count                                   |
| Bulk action       | `BulkActionBar`              | appears when rows are ticked. A **Terbitkan** button publishes them             |
| Icons             | `icons.tsx`                  | `Bell`, `Check`, `Document`, `Plus`                                             |

**Check:**

- Search for `sembako`: one row is left.
- Click the **Draf** chip: only drafts show.
- Search for `zzz`: the empty state appears, and **Reset Filter** brings everything back.
- Tick a draft and click **Terbitkan**: its status becomes _Terbit_, and the numbers update.

> **Gotcha:** `StatCard`'s `value` is a **string**. Pass `String(summary.total)`, not the number.
> You'll deliberately break exactly this in [step 10](#10-break-ci-on-purpose).

<details>
<summary><b>Solution:</b> <code>features/practice/AnnouncementsPage.tsx</code></summary>

```tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/shared/DashboardLayout";
import TopBar from "@/components/shared/TopBar";
import PageHeader from "@/components/shared/PageHeader";
import RevealOnView from "@/components/shared/RevealOnView";
import StatCard from "@/components/shared/StatCard";
import Panel from "@/components/shared/Panel";
import Eyebrow from "@/components/shared/Eyebrow";
import Toolbar from "@/components/shared/Toolbar";
import DataTable, { type Column } from "@/components/shared/DataTable";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import BulkActionBar from "@/components/shared/BulkActionBar";
import IslandButton from "@/components/shared/IslandButton";
import { Bell, Check, Document, Plus } from "@/components/shared/icons";
import {
  AUDIENCE_LABEL,
  filterAnnouncements,
  publish,
  summarize,
  type Announcement,
  type StatusFilter,
} from "./announcements";
import { announcementStore, useAnnouncements } from "./store";

const PAGE_SIZE = 5;

export default function AnnouncementsPage() {
  const navigate = useNavigate();
  const items = useAnnouncements();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const filtered = useMemo(
    () => filterAnnouncements(items, search, status),
    [items, search, status],
  );
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const summary = summarize(items);
  const pinned = items.find((a) => a.pinned);

  const columns: Column<Announcement>[] = [
    {
      key: "title",
      header: "Judul",
      sortable: true,
      accessor: (a) => a.title,
      render: (a) => (
        <div className="min-w-0">
          <p className="break-words font-medium text-foreground">{a.title}</p>
          <p className="break-words text-[12px] text-muted-foreground">
            {a.body}
          </p>
        </div>
      ),
    },
    {
      key: "audience",
      header: "Untuk",
      render: (a) => AUDIENCE_LABEL[a.audience],
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      accessor: (a) => a.status,
      render: (a) => (a.status === "PUBLISHED" ? "Terbit" : "Draf"),
    },
  ];

  function publishSelected() {
    announcementStore.replaceAll(publish(items, selected));
    setSelected(new Set());
  }

  const newButton = (
    <IslandButton
      size="sm"
      trailingIcon={<Plus width={12} height={12} />}
      onClick={() => navigate("/admin/practice/announcements/new")}
    >
      Buat Pengumuman
    </IslandButton>
  );

  return (
    <DashboardLayout role="ADMIN">
      <TopBar
        eyebrow="Latihan"
        title="Pengumuman"
        caption={`${summary.total} pengumuman · ${summary.drafts} draf`}
        trailing={newButton}
      />

      <RevealOnView>
        <PageHeader
          eyebrow="Latihan"
          title="Pengumuman"
          description="Fitur latihan: semua komponen UI kit dalam satu layar. Data hanya di memori dan hilang saat halaman dimuat ulang."
          actions={newButton}
        />
      </RevealOnView>

      <RevealOnView delay={80} className="mt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total"
            value={String(summary.total)}
            icon={<Document width={16} height={16} />}
          />
          <StatCard
            label="Terbit"
            value={String(summary.published)}
            icon={<Check width={16} height={16} />}
          />
          <StatCard
            label="Draf"
            value={String(summary.drafts)}
            sub="Belum terlihat oleh jemaat"
            accent
          />
        </div>
      </RevealOnView>

      {pinned && (
        <RevealOnView delay={120} className="mt-6">
          <Panel tone="champagne" inset="p-6">
            <Eyebrow tone="accent">Disematkan</Eyebrow>
            <p className="mt-3 break-words font-editorial text-2xl">
              {pinned.title}
            </p>
            <p className="mt-2 break-words text-sm text-muted-foreground">
              {pinned.body}
            </p>
          </Panel>
        </RevealOnView>
      )}

      <RevealOnView delay={160} className="mt-6">
        <Toolbar
          searchValue={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Cari judul atau isi…"
          activeFilter={status}
          onFilterChange={(k) => {
            setStatus(k as StatusFilter);
            setPage(1);
          }}
          filters={[
            { key: "all", label: "Semua", count: summary.total },
            { key: "PUBLISHED", label: "Terbit", count: summary.published },
            { key: "DRAFT", label: "Draf", count: summary.drafts },
          ]}
        />
      </RevealOnView>

      <RevealOnView delay={200}>
        <DataTable
          columns={columns}
          rows={paged}
          selectable
          selectedIds={selected}
          onSelectionChange={setSelected}
          emptyState={
            <EmptyState
              icon={<Bell width={22} height={22} />}
              title="Tidak ada pengumuman yang cocok"
              description="Ubah kata kunci atau pilih filter lain."
              action={
                <IslandButton
                  variant="soft"
                  size="sm"
                  trailingIcon={null}
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                  }}
                >
                  Reset Filter
                </IslandButton>
              }
            />
          }
        />
        {filtered.length > 0 && (
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onPageChange={setPage}
          />
        )}
      </RevealOnView>

      <BulkActionBar
        count={selected.size}
        onClear={() => setSelected(new Set())}
      >
        <button
          type="button"
          onClick={publishSelected}
          className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1.5 text-[12px] font-medium ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.12]"
        >
          <Check width={12} height={12} /> Terbitkan
        </button>
      </BulkActionBar>
    </DashboardLayout>
  );
}
```

</details>

---

## 7. The form page

**Build** `AnnouncementFormPage.tsx`:

| Piece      | Components                                                   | Tips                                                                                                       |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Header     | `PageHeader`                                                 | `backTo` links to the list                                                                                 |
| Card       | `FormShell`                                                  | wraps both sections                                                                                        |
| Section 1  | `FormSection`, `Field`, `TextInput`, `Textarea`              | title and body                                                                                             |
| Section 2  | `FormSection`, `RadioCardGroup`, `Field`, `Select`, `Switch` | audience cards; a division `Select` **only** when the audience is _Satu divisi_; a "pin to top" `Switch`   |
| Bottom bar | `FormActionBar`, `IslandButton` ×2                           | **Simpan Draf** saves as draft, **Terbitkan** publishes. The status text shows how many fields need fixing |

Use your `validate()` from step 3. Don't write the rules again in the page.

> **Gotchas:** `Field`'s child is a **function**, `{(id) => <TextInput id={id} … />}`.
> `Select` takes an `options` array, not `<option>` children. `Switch.onChange` gives you a
> **boolean**, not an event. `RadioCardGroup.onChange` gives a plain `string`, so cast it with
> `v as Audience`. And a button that shouldn't submit the form needs `type="button"`.

**Check:**

- Click **Terbitkan** with the form empty: _Judul_ and _Isi_ show errors, and the bottom bar says
  "2 kolom perlu diperbaiki."
- Choose **Satu divisi**: a division dropdown appears, and saving without picking one is refused.
- Fill it in and click **Terbitkan**: you land back on the list, with your announcement in it.

<details>
<summary><b>Solution:</b> <code>features/practice/AnnouncementFormPage.tsx</code></summary>

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/shared/DashboardLayout";
import TopBar from "@/components/shared/TopBar";
import PageHeader from "@/components/shared/PageHeader";
import RevealOnView from "@/components/shared/RevealOnView";
import FormShell from "@/components/shared/FormShell";
import FormSection from "@/components/shared/FormSection";
import Field from "@/components/shared/Field";
import FormActionBar from "@/components/shared/FormActionBar";
import RadioCardGroup from "@/components/shared/RadioCardGroup";
import IslandButton from "@/components/shared/IslandButton";
import {
  Select,
  Switch,
  TextInput,
  Textarea,
} from "@/components/shared/inputs";
import { Layers, User, Users } from "@/components/shared/icons";
import {
  DIVISIONS,
  validate,
  type AnnouncementDraft,
  type AnnouncementStatus,
  type Audience,
} from "./announcements";
import { announcementStore } from "./store";

const EMPTY: AnnouncementDraft = {
  title: "",
  body: "",
  audience: "ALL",
  division: "",
  pinned: false,
  status: "DRAFT",
};

export default function AnnouncementFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<AnnouncementDraft>(EMPTY);
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});

  const set = <K extends keyof AnnouncementDraft>(
    key: K,
    value: AnnouncementDraft[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function save(status: AnnouncementStatus) {
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    announcementStore.add({
      ...form,
      status,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().slice(0, 10),
    });
    navigate("/admin/practice/announcements");
  }

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <DashboardLayout role="ADMIN">
      <TopBar eyebrow="Latihan · Pengumuman" title="Buat baru" />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save("PUBLISHED");
        }}
      >
        <RevealOnView>
          <PageHeader
            title="Pengumuman baru"
            description="Isi judul dan isi, lalu pilih siapa yang melihatnya."
            backTo={{
              to: "/admin/practice/announcements",
              label: "Kembali ke daftar",
            }}
          />
        </RevealOnView>

        <RevealOnView delay={80}>
          <FormShell>
            <FormSection
              eyebrow="Langkah 1"
              title="Isi pengumuman"
              description="Judul muncul di daftar. Isi muncul saat dibuka."
            >
              <Field label="Judul" required error={errors.title}>
                {(id) => (
                  <TextInput
                    id={id}
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    invalid={Boolean(errors.title)}
                    placeholder="Contoh: Ibadah Natal bersama"
                  />
                )}
              </Field>

              <Field label="Isi" required error={errors.body}>
                {(id) => (
                  <Textarea
                    id={id}
                    rows={4}
                    value={form.body}
                    onChange={(e) => set("body", e.target.value)}
                    invalid={Boolean(errors.body)}
                  />
                )}
              </Field>
            </FormSection>

            <FormSection
              eyebrow="Langkah 2"
              title="Penayangan"
              description="Siapa yang melihat, dan apakah disematkan di atas."
            >
              <RadioCardGroup
                name="audience"
                value={form.audience}
                onChange={(v) => set("audience", v as Audience)}
                columns={3}
                options={[
                  {
                    value: "ALL",
                    label: "Semua jemaat",
                    description: "Terlihat oleh semua.",
                    icon: <Users width={16} height={16} />,
                  },
                  {
                    value: "LEADERS",
                    label: "Pengurus",
                    description: "Hanya ketua dan pengurus.",
                    icon: <User width={16} height={16} />,
                  },
                  {
                    value: "DIVISION",
                    label: "Satu divisi",
                    description: "Hanya anggota satu divisi.",
                    icon: <Layers width={16} height={16} />,
                  },
                ]}
              />

              {form.audience === "DIVISION" && (
                <Field label="Divisi" required error={errors.division}>
                  {(id) => (
                    <Select
                      id={id}
                      value={form.division}
                      onChange={(e) => set("division", e.target.value)}
                      invalid={Boolean(errors.division)}
                      options={[
                        { value: "", label: "Pilih divisi…" },
                        ...DIVISIONS,
                      ]}
                    />
                  )}
                </Field>
              )}

              <Switch
                checked={form.pinned}
                onChange={(v) => set("pinned", v)}
                label="Sematkan di atas"
                description="Pengumuman yang disematkan tampil paling atas."
              />
            </FormSection>
          </FormShell>
        </RevealOnView>

        <FormActionBar
          status={
            errorCount > 0
              ? `${errorCount} kolom perlu diperbaiki.`
              : "Terbitkan sekarang, atau simpan sebagai draf."
          }
        >
          <IslandButton
            type="button"
            variant="ghost"
            size="sm"
            trailingIcon={null}
            onClick={() => save("DRAFT")}
          >
            Simpan Draf
          </IslandButton>
          <IslandButton type="submit" size="sm">
            Terbitkan
          </IslandButton>
        </FormActionBar>
      </form>
    </DashboardLayout>
  );
}
```

</details>

---

## 8. Check it on a phone-sized screen

In Chrome, open DevTools (`Cmd+Option+I`), turn on the device toolbar (`Cmd+Shift+M`), and pick
a width of **375**. Check both pages:

- Nothing spills out of its card, and nothing is cut off.
- The page never scrolls sideways. The table and filter chips may scroll **inside their own
  card**, and that's intended.
- The ☰ button in the top bar opens the sidebar.

If something doesn't fit, one of the five rules in
[`UI_KIT.md` › Keeping layouts responsive](UI_KIT.md#keeping-layouts-responsive) will be the fix.
The most common one: `grid lg:grid-cols-3` needs to be `grid grid-cols-1 lg:grid-cols-3`.

---

## 9. Push it and watch CI

**1. Run everything CI will run:**

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

**2. Commit.** Look at what you're committing first:

```bash
git status
```

```bash
git add apps/web/src/features/practice apps/web/src/app/navigation.ts apps/web/src/app/routes.ts
```

```bash
git commit -m "feat(practice): pengumuman drill"
```

**3. Push, and open a draft pull request into `dev`:**

```bash
git push -u origin drill/<yourname>-pengumuman
```

```bash
gh pr create --draft --base dev --fill
```

(No `gh`? Open the link `git push` prints, and choose **Create draft pull request** from the
dropdown on the green button.)

**4. Watch CI.** On your pull request page:

- Near the bottom, a yellow dot means `verify` is running, and it turns into a green ✓ or red ✗.
- Click **Details** next to `verify` (or open the **Checks** tab) to see the six steps.
- Click any step to expand its log.

From the terminal:

```bash
gh pr checks --watch
```

Notice that **no reviewer is requested**. GitHub doesn't send review requests for draft pull
requests. On a real, non-draft PR it would automatically ask the lead to review, because
[`CODEOWNERS`](../.github/CODEOWNERS) marks `app/navigation.ts` and `app/routes.ts` as
lead-owned.

---

## 10. Break CI on purpose

This is the part that makes CI make sense. For each one: make the change, commit, push, watch the
check turn red, find the failing step, read the error, fix it, push again, and watch it go green.

> Normally you'd catch all of these with the local command **before** pushing. Here you push
> them on purpose, to see what the robot shows you.

### Break 1: Lint

Add an icon to your import that you never use, for example `Trash` in `AnnouncementsPage.tsx`:

```tsx
import { Bell, Check, Document, Plus, Trash } from "@/components/shared/icons";
```

**What you'll see:** the **Lint** step fails. Typecheck, Test and Build are **skipped**, because CI
stops at the first failure. Your line and column numbers will differ:

```
apps/web/src/features/practice/AnnouncementsPage.tsx
  16:39  error  'Trash' is defined but never used  @typescript-eslint/no-unused-vars
✖ 1 problem (1 error, 0 warnings)
```

**Fix:** remove `Trash`. Unused code is the most common lint failure you'll ever see.

### Break 2: Typecheck

Pass a number where `StatCard` expects a string:

```tsx
<StatCard label="Total" value={summary.total} />
```

**What you'll see:** Lint passes, and the **Typecheck** step fails. Your line number will differ:

```
src/features/practice/AnnouncementsPage.tsx(111,13): error TS2322: Type 'number' is not assignable to type 'string'.
```

**Fix:** `value={String(summary.total)}`. The format is `file(line,column)`, which takes you
straight to the problem.

### Break 3: Test

Delete a business rule from `validate()`: the two lines that require a division when the audience
is `"DIVISION"`.

**What you'll see:** Lint and Typecheck pass, and the **Test** step fails:

```
× validate > requires a division when the audience is one division
  → expected undefined to be defined
Tests  1 failed | 19 passed (20)
```

Notice what just happened. The code is perfectly _valid_, so lint and TypeScript are happy, but
the _behaviour_ is wrong, and only a test can catch that. It's why your tests describe rules
("requires a division when…") rather than code.

**Fix:** put the rule back.

### Break 4: The navigation guard

In `nav.tsx`, change `section: "Manage"` to `section: "Kelola"`. That section doesn't exist in the
ADMIN sidebar.

**What you'll see:** the **Test** step fails, but in a test you didn't write:
`app/navigation.spec.ts`, which guards the sidebar for the whole team:

```
× module navigation > every nav entry uses a section its role declares
- Array []
+ Array [
+   "ADMIN · Kelola · /admin/practice/announcements",
+ ]
```

The diff names the exact entry at fault: role, section and link. Without this guard, your link
would simply **vanish** from the sidebar, with no error anywhere.

**Fix:** set it back to `"Manage"`.

### What you just learned

| You saw…                | It means…                                           | Reproduce it locally with |
| ----------------------- | --------------------------------------------------- | ------------------------- |
| **Lint** red            | a code rule was broken                              | `pnpm lint`               |
| **Typecheck** red       | a type doesn't match                                | `pnpm typecheck`          |
| **Test** red            | behaviour is wrong, in your test or a team guard    | `pnpm test`               |
| later steps **skipped** | CI stopped at the first failure; fix that one first | —                         |

---

## 11. Clean up

When CI is green again and you're happy:

1. **Close** the pull request. **Don't merge it.** The **Close pull request** button is at the
   bottom of the conversation.
2. Click **Delete branch** on the page that appears.
3. On your laptop:

```bash
git checkout dev && git pull
```

```bash
git branch -D drill/<yourname>-pengumuman
```

`-D` (capital) because the branch was never merged, so Git would otherwise refuse to delete it.

---

## 12. Checklist

You've finished the drill when you have used every component in the UI kit:

| Component                                                       | Where                                 |
| --------------------------------------------------------------- | ------------------------------------- |
| `DashboardLayout` (with `Sidebar` and `AmbientBackdrop` inside) | both pages                            |
| `TopBar`                                                        | both pages                            |
| `PageHeader`                                                    | both pages; with `backTo` on the form |
| `RevealOnView`                                                  | both pages                            |
| `StatCard`                                                      | list: 3 tiles                         |
| `Panel`, `Eyebrow`                                              | list: pinned announcement             |
| `Toolbar`                                                       | list: search and filter chips         |
| `DataTable`                                                     | list                                  |
| `EmptyState`                                                    | list: search for `zzz`                |
| `Pagination`                                                    | list                                  |
| `BulkActionBar`                                                 | list: tick a row                      |
| `IslandButton`                                                  | both pages                            |
| `FormShell`, `FormSection`, `Field`                             | form                                  |
| `TextInput`, `Textarea`, `Select`, `Switch`                     | form                                  |
| `RadioCardGroup`                                                | form: audience                        |
| `FormActionBar`                                                 | form                                  |
| `icons`                                                         | both pages                            |

And you can answer these:

1. CI's **Lint** step failed. Which steps ran after it?
2. Your code compiles and lint is clean, but a rule is wrong. Which step catches that, and only if
   what exists?
3. Why does `announcements.ts` contain no React?
4. You added a sidebar link and it doesn't appear. What does `pnpm test` tell you?
5. Which one command runs everything CI runs, before you push?

<details>
<summary>Answers</summary>

1. None. CI stops at the first failure; typecheck, test and build are skipped.
2. **Test**, and only if a test describes that rule. That's why tests describe behaviour.
3. So it can be unit tested in milliseconds without rendering, and so the rules live in one
   place that both pages share.
4. `app/navigation.spec.ts` fails and names the entry, most likely a section name its role
   doesn't have.
5. `pnpm lint && pnpm typecheck && pnpm test && pnpm build`

</details>
