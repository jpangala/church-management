import { Link } from "react-router-dom";
import { ArrowLeft } from "./icons";
import Eyebrow from "./Eyebrow";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backTo?: { to: string; label: string };
  meta?: React.ReactNode;
}

/**
 * Editorial page hero — used by list and form views.
 * Smaller than the dashboard hero, but same typographic family.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  backTo,
  meta,
}: Props) {
  return (
    <header className="mt-6">
      {backTo && (
        <Link
          to={backTo.to}
          className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-500 ease-spring-out hover:text-foreground"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground/[0.04] ring-1 ring-inset ring-foreground/[0.06] transition-transform duration-500 ease-spring-out group-hover:-translate-x-0.5">
            <ArrowLeft width={13} height={13} />
          </span>
          {backTo.label}
        </Link>
      )}

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <Eyebrow tone="primary">{eyebrow}</Eyebrow>}
          <h1 className="mt-4 font-editorial text-[36px] leading-[1.05] tracking-[-0.025em] text-balance sm:text-[44px]">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground text-pretty">
              {description}
            </p>
          )}
          {meta && <div className="mt-4">{meta}</div>}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        )}
      </div>
    </header>
  );
}
