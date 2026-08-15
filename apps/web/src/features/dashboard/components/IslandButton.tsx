import { forwardRef } from "react";
import { ArrowUpRight } from "./icons";

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "soft";
  size?: "md" | "sm";
  trailingIcon?: React.ReactNode | null;
}

const variants = {
  primary:
    "bg-primary text-primary-foreground ring-1 ring-inset ring-white/10 shadow-soft-glow hover:bg-primary/95",
  soft: "bg-foreground/[0.04] text-foreground ring-1 ring-inset ring-foreground/[0.08] hover:bg-foreground/[0.06]",
  ghost:
    "bg-transparent text-foreground/80 ring-1 ring-inset ring-foreground/[0.08] hover:bg-foreground/[0.04]",
} as const;

const iconBgByVariant = {
  primary: "bg-white/15 text-white",
  soft: "bg-foreground/[0.06] text-foreground/80",
  ghost: "bg-foreground/[0.05] text-foreground/70",
} as const;

const sizes = {
  md: "px-5 py-2.5 text-sm gap-3",
  sm: "px-3.5 py-1.5 text-[12px] gap-2",
} as const;

const iconSizes = {
  md: "h-8 w-8",
  sm: "h-6 w-6",
} as const;

/**
 * Pill button with optional nested circular icon island flush to the right.
 * Provides the kinetic "button-in-button" hover physics from the design spec.
 */
const IslandButton = forwardRef<HTMLButtonElement, Props>(function IslandButton(
  {
    children,
    variant = "primary",
    size = "md",
    trailingIcon,
    className = "",
    ...rest
  },
  ref,
) {
  const icon =
    trailingIcon === null ? null : trailingIcon ?? <ArrowUpRight width={14} height={14} />;

  return (
    <button
      ref={ref}
      {...rest}
      className={`group inline-flex items-center justify-center rounded-full font-medium tracking-[-0.01em] transition-all duration-500 ease-spring-out active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
      {icon && (
        <span
          className={`-mr-1 inline-flex items-center justify-center rounded-full transition-transform duration-500 ease-spring-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105 ${iconSizes[size]} ${iconBgByVariant[variant]}`}
          aria-hidden
        >
          {icon}
        </span>
      )}
    </button>
  );
});

export default IslandButton;
