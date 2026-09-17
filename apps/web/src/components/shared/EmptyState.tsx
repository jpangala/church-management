interface Props {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: Props) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      {icon && (
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground/[0.04] text-foreground/60 ring-1 ring-inset ring-foreground/[0.06]">
          {icon}
        </span>
      )}
      <h3 className="mt-5 font-editorial text-2xl tracking-[-0.015em] text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
