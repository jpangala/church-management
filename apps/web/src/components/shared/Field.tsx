import { useId } from "react";

interface Props {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
  optionalLabel?: string;
  trailing?: React.ReactNode;
  children: (id: string) => React.ReactNode;
  className?: string;
}

/**
 * Field wrapper — label, optional/required hint, description, error, trailing slot.
 * Pass children as a render-prop so the label `htmlFor` matches the input id.
 */
export default function Field({
  label,
  description,
  error,
  required,
  optionalLabel = "opsional",
  trailing,
  children,
  htmlFor,
  className = "",
}: Props) {
  const generatedId = useId();
  const id = htmlFor ?? generatedId;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/75"
        >
          {label}
          {!required && (
            <span className="ml-2 text-[10px] font-normal lowercase tracking-[0.08em] text-muted-foreground">
              {optionalLabel}
            </span>
          )}
        </label>
        {trailing}
      </div>
      {children(id)}
      {(description || error) && (
        <p
          className={`text-[12px] leading-relaxed ${
            error ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {error ?? description}
        </p>
      )}
    </div>
  );
}
