interface Props {
  children: React.ReactNode;
  status?: React.ReactNode;
}

/**
 * Sticky bottom action bar — same scrim recipe as the TopBar but mirrored.
 * Solid bg-background at the very bottom, fades up. Keeps Save/Cancel
 * always in reach during long forms.
 */
export default function FormActionBar({ children, status }: Props) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-6 px-4 pb-6 pt-4 md:-mx-2 md:px-2">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full bg-gradient-to-t from-background via-background/85 to-background/0 backdrop-blur-xl [mask-image:linear-gradient(to_top,black_55%,transparent_100%)]"
      />
      <div className="rounded-[1.75rem] bg-foreground/[0.035] p-[5px] ring-1 ring-inset ring-foreground/[0.06] shadow-soft-lift backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[calc(1.75rem-5px)] bg-surface/90 px-4 py-3 shadow-inner-hairline">
          <div className="min-w-0 flex-1 text-[12px] text-muted-foreground">
            {status}
          </div>
          <div className="flex items-center gap-2">{children}</div>
        </div>
      </div>
    </div>
  );
}
