import { Check } from "./icons";

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface Props {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  columns?: 1 | 2 | 3;
}

/**
 * Radio group rendered as selectable cards. Active state uses primary tint
 * + ring + check badge. Great for role / plan / variant pickers.
 */
export default function RadioCardGroup({
  name,
  value,
  onChange,
  options,
  columns = 2,
}: Props) {
  // `columns` is a maximum. Cards never get narrower than 13rem: when the
  // container can't fit that many, they reflow onto more rows. Sized by the
  // container rather than the screen, so it works in narrow form columns too.
  const gridTemplateColumns = `repeat(auto-fit, minmax(min(100%, max(13rem, calc((100% - ${columns - 1} * 0.75rem) / ${columns}))), 1fr))`;
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns }}
      role="radiogroup"
    >
      {options.map((o) => {
        const isActive = value === o.value;
        return (
          <label
            key={o.value}
            className={`relative flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 ring-inset transition-all duration-500 ease-spring-out ${
              isActive
                ? "bg-primary/[0.06] ring-primary/40 shadow-soft-glow"
                : "bg-foreground/[0.025] ring-foreground/[0.06] hover:bg-foreground/[0.04] hover:ring-foreground/[0.1]"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={isActive}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.icon && (
              <span
                className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-colors duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground ring-primary/30"
                    : "bg-surface text-foreground/70 ring-foreground/[0.08]"
                }`}
              >
                {o.icon}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="break-words text-[13px] font-medium text-foreground">
                {o.label}
              </p>
              {o.description && (
                <p className="mt-0.5 break-words text-[12px] leading-relaxed text-muted-foreground">
                  {o.description}
                </p>
              )}
            </div>
            <span
              className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-foreground ring-primary/30"
                  : "bg-surface ring-foreground/15"
              }`}
            >
              {isActive && <Check width={11} height={11} />}
            </span>
          </label>
        );
      })}
    </div>
  );
}
