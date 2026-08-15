interface Props {
  children: React.ReactNode;
  /**
   * Renders inside the Double-Bezel card so the form body looks composed,
   * not slapped onto the background.
   */
}

/**
 * Wraps form sections inside the same Double-Bezel container the rest of
 * the dashboard uses. Sections inside this shell auto-divide with hairlines.
 */
export default function FormShell({ children }: Props) {
  return (
    <div className="mt-6 rounded-[2rem] bg-foreground/[0.035] p-[6px] ring-1 ring-inset ring-foreground/[0.06] shadow-soft-lift">
      <div className="rounded-[calc(2rem-6px)] bg-surface px-6 shadow-inner-hairline sm:px-10">
        {children}
      </div>
    </div>
  );
}
