import Panel from "./Panel";
import { ArrowUp, ArrowDown } from "./icons";

interface Props {
  label: string;
  value: string;
  delta?: { value: string; trend: "up" | "down" | "flat" };
  sub?: string;
  icon?: React.ReactNode;
  accent?: boolean;
}

export default function StatCard({
  label,
  value,
  delta,
  sub,
  icon,
  accent,
}: Props) {
  return (
    <Panel
      tone={accent ? "espresso" : "surface"}
      inset="p-6 sm:p-7"
      className="h-full"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`text-[10px] uppercase tracking-[0.24em] ${
            accent ? "text-white/55" : "text-muted-foreground"
          }`}
        >
          {label}
        </span>
        {icon && (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-inset ${
              accent
                ? "bg-white/[0.06] text-white ring-white/10"
                : "bg-foreground/[0.04] text-foreground/70 ring-foreground/[0.06]"
            }`}
            aria-hidden
          >
            {icon}
          </span>
        )}
      </div>

      <div className="mt-7 flex items-end gap-3">
        <span
          className={`font-editorial text-5xl font-light leading-none tracking-[-0.02em] ${
            accent ? "text-white" : "text-foreground"
          }`}
        >
          {value}
        </span>
        {delta && (
          <span
            className={`mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              delta.trend === "up"
                ? "bg-success/10 text-success ring-1 ring-inset ring-success/20"
                : delta.trend === "down"
                  ? "bg-destructive/10 text-destructive ring-1 ring-inset ring-destructive/20"
                  : "bg-foreground/[0.05] text-muted-foreground ring-1 ring-inset ring-foreground/10"
            }`}
          >
            {delta.trend === "up" && <ArrowUp width={11} height={11} />}
            {delta.trend === "down" && <ArrowDown width={11} height={11} />}
            {delta.value}
          </span>
        )}
      </div>

      {sub && (
        <p
          className={`mt-4 text-xs leading-relaxed ${
            accent ? "text-white/55" : "text-muted-foreground"
          }`}
        >
          {sub}
        </p>
      )}
    </Panel>
  );
}
