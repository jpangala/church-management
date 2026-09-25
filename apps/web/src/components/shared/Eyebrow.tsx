interface Props {
  children: React.ReactNode;
  tone?: "default" | "accent" | "primary";
  className?: string;
}

const tones = {
  default: "bg-foreground/[0.04] text-muted-foreground ring-foreground/[0.06]",
  primary: "bg-primary/[0.08] text-primary ring-primary/15",
  accent: "bg-accent/15 text-foreground/80 ring-accent/30",
} as const;

export default function Eyebrow({
  children,
  tone = "default",
  className = "",
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-current/70" aria-hidden />
      {children}
    </span>
  );
}
