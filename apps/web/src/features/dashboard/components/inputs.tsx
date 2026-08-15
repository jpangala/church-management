import { forwardRef } from "react";
import { ChevronDown } from "./icons";

const base =
  "block w-full rounded-2xl bg-foreground/[0.025] px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground/70 ring-1 ring-inset ring-foreground/[0.08] transition-all duration-500 ease-spring-out focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface disabled:opacity-50 disabled:pointer-events-none";

const invalid =
  "ring-destructive/40 bg-destructive/[0.03] focus:ring-destructive/60";

// ---- TextInput ----
interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  leading?: React.ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ invalid: isInvalid, leading, className = "", ...rest }, ref) {
    if (leading) {
      return (
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-foreground/55">
            {leading}
          </span>
          <input
            ref={ref}
            {...rest}
            className={`${base} ${isInvalid ? invalid : ""} pl-11 ${className}`}
          />
        </div>
      );
    }
    return (
      <input
        ref={ref}
        {...rest}
        className={`${base} ${isInvalid ? invalid : ""} ${className}`}
      />
    );
  },
);

// ---- Textarea ----
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ invalid: isInvalid, className = "", rows = 4, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        {...rest}
        className={`${base} resize-none ${isInvalid ? invalid : ""} ${className}`}
      />
    );
  },
);

// ---- Select ----
interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid: isInvalid, options, className = "", ...rest },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        {...rest}
        className={`${base} appearance-none pr-11 ${isInvalid ? invalid : ""} ${className}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-foreground/55">
        <ChevronDown width={14} height={14} />
      </span>
    </div>
  );
});

// ---- Switch (toggle) ----
interface SwitchProps {
  id?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Switch({
  id,
  checked,
  onChange,
  label,
  description,
  disabled,
}: SwitchProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-4 rounded-2xl bg-foreground/[0.025] p-4 ring-1 ring-inset ring-foreground/[0.06] transition-all duration-500 ease-spring-out ${
        disabled ? "opacity-50" : "cursor-pointer hover:bg-foreground/[0.04]"
      }`}
    >
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-500 ease-spring-out ${
          checked ? "bg-primary" : "bg-foreground/[0.12]"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-soft-glow transition-transform duration-500 ease-spring-out ${
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
      {(label || description) && (
        <div className="min-w-0 flex-1">
          {label && (
            <p className="text-[13px] font-medium text-foreground">{label}</p>
          )}
          {description && (
            <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
    </label>
  );
}
