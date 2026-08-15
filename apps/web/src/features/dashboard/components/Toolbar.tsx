import { Search, Filter, X } from "./icons";

export interface FilterChip {
  key: string;
  label: string;
  count?: number;
}

interface Props {
  searchValue: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  filters?: FilterChip[];
  activeFilter?: string;
  onFilterChange?: (key: string) => void;
  trailing?: React.ReactNode;
}

/**
 * Search + chip filter row used above tables. Hairline glass card.
 */
export default function Toolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari…",
  filters,
  activeFilter,
  onFilterChange,
  trailing,
}: Props) {
  return (
    <div className="mt-6 rounded-[1.5rem] bg-foreground/[0.035] p-[5px] ring-1 ring-inset ring-foreground/[0.06] shadow-soft-lift">
      <div className="flex flex-col gap-3 rounded-[calc(1.5rem-5px)] bg-surface/85 p-3 shadow-inner-hairline sm:flex-row sm:items-center">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-full bg-foreground/[0.04] px-3.5 py-2 ring-1 ring-inset ring-foreground/[0.06] sm:min-w-[280px] sm:flex-1">
          <Search width={14} height={14} className="shrink-0 text-foreground/60" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/60 transition-colors hover:bg-foreground/[0.1] hover:text-foreground"
            >
              <X width={10} height={10} />
            </button>
          )}
        </div>

        {/* Filter chips */}
        {filters && filters.length > 0 && (
          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="hidden shrink-0 items-center gap-1.5 px-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:inline-flex">
              <Filter width={11} height={11} />
              Filter
            </span>
            {filters.map((f) => {
              const isActive = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => onFilterChange?.(f.key)}
                  className={`group inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-500 ease-spring-out ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-soft-glow ring-1 ring-inset ring-white/10"
                      : "bg-foreground/[0.04] text-foreground/75 ring-1 ring-inset ring-foreground/[0.06] hover:bg-foreground/[0.07]"
                  }`}
                >
                  {f.label}
                  {f.count !== undefined && (
                    <span
                      className={`inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-foreground/[0.06] text-muted-foreground"
                      }`}
                    >
                      {f.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {trailing && <div className="ml-auto flex items-center gap-2">{trailing}</div>}
      </div>
    </div>
  );
}
