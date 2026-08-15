import { forwardRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  inset?: string;
  tone?: "surface" | "espresso" | "champagne";
  as?: "div" | "section" | "article";
}

/**
 * Double-Bezel container (Doppelrand). Outer shell sits in a hairline tray,
 * inner core has its own surface, inner highlight, and a concentric radius.
 * Use for every primary card / panel / chart in the dashboard.
 */
const Panel = forwardRef<HTMLDivElement, Props>(function Panel(
  { children, className = "", inset = "p-7 sm:p-8", tone = "surface", as = "section" },
  ref,
) {
  const Tag = as as keyof JSX.IntrinsicElements;

  const inner =
    tone === "espresso"
      ? "bg-[hsl(213,30%,14%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      : tone === "champagne"
        ? "bg-[hsl(41,52%,92%)]/70 text-foreground shadow-inner-hairline"
        : "bg-surface text-foreground shadow-inner-hairline";

  return (
    <div
      ref={ref}
      className={`group/panel rounded-[2rem] bg-foreground/[0.035] p-[6px] ring-1 ring-inset ring-foreground/[0.06] shadow-soft-lift transition-transform duration-700 ease-spring-soft ${className}`}
    >
      <Tag
        className={`relative overflow-hidden rounded-[calc(2rem-6px)] ${inner} ${inset}`}
      >
        {children}
      </Tag>
    </div>
  );
});

export default Panel;
