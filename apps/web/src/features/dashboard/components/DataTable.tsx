import { useState } from "react";
import { SortAsc, Dots } from "./icons";

export type SortDir = "asc" | "desc";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  width?: string;
  render: (row: T) => React.ReactNode;
  accessor?: (row: T) => string | number;
}

interface Props<T extends { id: string | number }> {
  columns: Column<T>[];
  rows: T[];
  selectable?: boolean;
  selectedIds?: Set<string | number>;
  onSelectionChange?: (ids: Set<string | number>) => void;
  rowAction?: (row: T) => void;
  emptyState?: React.ReactNode;
  caption?: string;
}

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

/**
 * Editorial data table — hairline row dividers, no vertical lines,
 * generous py-4, hover row tint, sortable columns, optional selection.
 */
export default function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  selectable = false,
  selectedIds = new Set(),
  onSelectionChange,
  rowAction,
  emptyState,
  caption,
}: Props<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = (() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.accessor) return rows;
    const acc = col.accessor;
    return [...rows].sort((a, b) => {
      const av = acc(a);
      const bv = acc(b);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  })();

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const allSelected =
    sorted.length > 0 && sorted.every((r) => selectedIds.has(r.id));
  const someSelected =
    sorted.some((r) => selectedIds.has(r.id)) && !allSelected;

  function toggleAll() {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(sorted.map((r) => r.id)));
    }
  }

  function toggleOne(id: string | number) {
    if (!onSelectionChange) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  }

  if (rows.length === 0) {
    return (
      <div className="mt-4 rounded-[2rem] bg-foreground/[0.035] p-[6px] ring-1 ring-inset ring-foreground/[0.06] shadow-soft-lift">
        <div className="rounded-[calc(2rem-6px)] bg-surface px-6 py-20 shadow-inner-hairline">
          {emptyState}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-[2rem] bg-foreground/[0.035] p-[6px] ring-1 ring-inset ring-foreground/[0.06] shadow-soft-lift">
      <div className="overflow-hidden rounded-[calc(2rem-6px)] bg-surface shadow-inner-hairline">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] text-foreground/85">
                {selectable && (
                  <th className="w-12 border-b border-foreground/[0.08] bg-foreground/[0.02] px-4 py-4 text-left">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={toggleAll}
                      label="Pilih semua"
                    />
                  </th>
                )}
                {columns.map((c) => (
                  <th
                    key={c.key}
                    style={{ width: c.width }}
                    className={`border-b border-foreground/[0.08] bg-foreground/[0.02] px-4 py-4 font-semibold ${alignClass[c.align ?? "left"]}`}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(c.key)}
                        className={`group inline-flex items-center gap-1.5 transition-colors duration-300 ${
                          sortKey === c.key
                            ? "text-foreground"
                            : "hover:text-foreground"
                        }`}
                      >
                        {c.header}
                        <span
                          className={`transition-all duration-500 ease-spring-out ${
                            sortKey === c.key
                              ? "opacity-100"
                              : "opacity-30 group-hover:opacity-70"
                          } ${sortKey === c.key && sortDir === "desc" ? "rotate-180" : ""}`}
                        >
                          <SortAsc width={12} height={12} />
                        </span>
                      </button>
                    ) : (
                      <span>{c.header}</span>
                    )}
                  </th>
                ))}
                {rowAction && (
                  <th className="w-12 border-b border-foreground/[0.08] bg-foreground/[0.02] px-4 py-4" />
                )}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr
                    key={row.id}
                    className={`group/row transition-colors duration-200 ${
                      isSelected
                        ? "bg-primary/[0.04]"
                        : "hover:bg-foreground/[0.02]"
                    }`}
                  >
                    {selectable && (
                      <td className="relative border-b border-foreground/[0.05] px-4 py-4">
                        {isSelected && (
                          <span
                            aria-hidden
                            className="absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-primary"
                          />
                        )}
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleOne(row.id)}
                          label="Pilih baris"
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td
                        key={c.key}
                        className={`border-b border-foreground/[0.05] px-4 py-4 ${alignClass[c.align ?? "left"]}`}
                      >
                        {c.render(row)}
                      </td>
                    ))}
                    {rowAction && (
                      <td className="border-b border-foreground/[0.05] px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => rowAction(row)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground/[0.04] text-foreground/70 opacity-0 ring-1 ring-inset ring-foreground/[0.06] transition-all duration-300 hover:bg-foreground/[0.08] hover:text-foreground group-hover/row:opacity-100"
                          aria-label="Aksi baris"
                        >
                          <Dots width={13} height={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Checkbox sub-component (visual only — controlled) ---
function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
        aria-label={label}
      />
      <span
        className={`relative inline-flex h-4 w-4 items-center justify-center rounded-[5px] ring-1 ring-inset transition-all duration-300 ease-spring-out ${
          checked || indeterminate
            ? "bg-primary ring-primary/40 shadow-soft-glow"
            : "bg-surface ring-foreground/15 hover:ring-foreground/30"
        }`}
      >
        {indeterminate && !checked && (
          <span className="h-[2px] w-2 rounded-full bg-white" />
        )}
        {checked && (
          <svg
            viewBox="0 0 16 16"
            className="h-2.5 w-2.5"
            fill="none"
            stroke="white"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m3 8 3.5 3.5L13 5" />
          </svg>
        )}
      </span>
    </label>
  );
}
