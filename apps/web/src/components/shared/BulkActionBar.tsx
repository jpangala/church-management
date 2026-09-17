import { X } from "./icons";

interface Props {
  count: number;
  onClear: () => void;
  children: React.ReactNode;
}

/**
 * Floating bottom bar that appears when rows are selected.
 * Sits above the page content with a soft lift shadow.
 */
export default function BulkActionBar({ count, onClear, children }: Props) {
  if (count === 0) return null;
  return (
    <div className="pointer-events-none sticky bottom-6 z-20 mt-4 flex justify-center">
      <div className="pointer-events-auto rounded-full bg-[hsl(213,30%,14%)] p-[5px] ring-1 ring-inset ring-white/10 shadow-soft-lift backdrop-blur-md animate-fade-rise">
        <div className="flex items-center gap-3 rounded-full px-2 py-1 text-white">
          <span className="flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1.5 text-[12px] font-medium ring-1 ring-inset ring-white/10">
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent text-[10px] font-semibold tabular-nums text-foreground">
              {count}
            </span>
            terpilih
          </span>
          {children}
          <button
            type="button"
            onClick={onClear}
            aria-label="Batalkan pilihan"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors duration-300 hover:bg-white/10 hover:text-white"
          >
            <X width={12} height={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
