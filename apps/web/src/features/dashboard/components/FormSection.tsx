import Eyebrow from "./Eyebrow";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}

/**
 * Two-column form section — Stripe Dashboard pattern.
 * Left rail (col-span-4) holds title/description; right (col-span-8) holds fields.
 * Collapses to single column on mobile.
 */
export default function FormSection({
  eyebrow,
  title,
  description,
  children,
  aside,
}: Props) {
  return (
    <section className="border-b border-foreground/[0.06] py-10 first:pt-8 last:border-b-0">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2 className="mt-3 font-editorial text-[24px] leading-tight tracking-[-0.015em] text-foreground">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground text-pretty">
                {description}
              </p>
            )}
            {aside && <div className="mt-5">{aside}</div>}
          </div>
        </div>
        <div className="space-y-5 lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}
