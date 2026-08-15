import { ChevronLeft, ChevronRight } from "./icons";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build a compact page list: 1 … 4 5 [6] 7 8 … 12
  const pages: (number | "…")[] = [];
  const window = 1; // pages around current
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - window && i <= page + window)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-full bg-foreground/[0.025] px-4 py-2 ring-1 ring-inset ring-foreground/[0.05]"
    >
      <p className="text-[12px] tabular-nums text-muted-foreground">
        Menampilkan{" "}
        <span className="font-medium text-foreground">
          {total === 0 ? 0 : from}–{to}
        </span>{" "}
        dari <span className="font-medium text-foreground">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-label="Previous page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-foreground/70 ring-1 ring-inset ring-foreground/[0.08] transition-all duration-500 ease-spring-out hover:bg-foreground/[0.05] disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft width={13} height={13} />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              className="px-1 text-[12px] text-muted-foreground"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full px-2 text-[12px] font-medium tabular-nums transition-all duration-500 ease-spring-out ${
                p === page
                  ? "bg-primary text-primary-foreground shadow-soft-glow ring-1 ring-inset ring-white/10"
                  : "text-foreground/75 hover:bg-foreground/[0.05]"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-foreground/70 ring-1 ring-inset ring-foreground/[0.08] transition-all duration-500 ease-spring-out hover:bg-foreground/[0.05] disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight width={13} height={13} />
        </button>
      </div>
    </nav>
  );
}
