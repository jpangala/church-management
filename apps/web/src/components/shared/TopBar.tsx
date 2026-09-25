import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/identity/auth.context";
import { Search, Bell, Logout, ChevronRight, Menu } from "./icons";
import { useMobileNav } from "./mobileNav";

interface Props {
  eyebrow: string;
  title: string;
  caption?: string;
  trailing?: React.ReactNode;
}

export default function TopBar({ eyebrow, title, caption, trailing }: Props) {
  const { i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = useMobileNav();

  const toggleLocale = () =>
    void i18n.changeLanguage(i18n.language === "id" ? "en" : "id");

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 -mx-4 px-4 pb-3 pt-6 md:-mx-2 md:px-2">
      {/* Scrim — masks content scrolling past the floating header.
          Solid bg at the very top, blurs + fades into atmosphere below.
          Sits behind the TopBar card (which keeps its own glass effect). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-background via-background/85 to-background/0 backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
      />
      <div className="rounded-[1.75rem] bg-foreground/[0.035] p-[5px] ring-1 ring-inset ring-foreground/[0.06] shadow-soft-lift backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[calc(1.75rem-5px)] bg-surface/85 px-4 py-3 shadow-inner-hairline">
          {/* Menu — opens the sidebar drawer below md */}
          {nav && (
            <button
              type="button"
              onClick={() => nav.setOpen(true)}
              aria-label="Open menu"
              className="md:hidden inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground/[0.04] text-foreground/75 ring-1 ring-inset ring-foreground/[0.06] transition-all duration-500 ease-spring-out hover:bg-foreground/[0.07]"
            >
              <Menu width={16} height={16} />
            </button>
          )}

          {/* Breadcrumb / Title — wraps rather than spilling or truncating */}
          <div className="min-w-[10rem] flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span>{eyebrow}</span>
              <ChevronRight width={10} height={10} />
              <span className="text-foreground/80">{title}</span>
            </div>
            {caption && (
              <p className="mt-0.5 text-pretty text-xs text-muted-foreground">
                {caption}
              </p>
            )}
          </div>

          {/* Controls — move onto their own row when there isn't room */}
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            {/* Search — only once there's room for it beside the title */}
            <div className="hidden xl:flex items-center gap-2 rounded-full bg-foreground/[0.04] px-3 py-1.5 text-sm text-muted-foreground ring-1 ring-inset ring-foreground/[0.06] w-64">
              <Search width={14} height={14} />
              <input
                type="search"
                placeholder="Cari…"
                className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="ml-auto rounded bg-foreground/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground ring-1 ring-inset ring-foreground/[0.05]">
                ⌘K
              </kbd>
            </div>

            {trailing}

            {/* Locale */}
            <button
              onClick={toggleLocale}
              className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground/75 ring-1 ring-inset ring-foreground/[0.06] transition-all duration-500 ease-spring-out hover:bg-foreground/[0.07]"
            >
              {i18n.language === "id" ? "ID·EN" : "EN·ID"}
            </button>

            {/* Bell */}
            <button
              aria-label="Notifications"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-foreground/[0.04] text-foreground/75 ring-1 ring-inset ring-foreground/[0.06] transition-all duration-500 ease-spring-out hover:bg-foreground/[0.07]"
            >
              <Bell width={15} height={15} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>

            {/* User pill — avatar + logout island */}
            <div className="flex items-center gap-2 rounded-full bg-foreground/[0.04] py-1 pl-1 pr-1 ring-1 ring-inset ring-foreground/[0.06]">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[11px] font-medium tracking-wide text-primary-foreground shadow-soft-glow">
                {initials}
              </span>
              <div className="hidden md:flex flex-col leading-tight pr-1">
                <span className="text-[12px] font-medium tracking-[-0.005em] text-foreground">
                  {user?.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {user?.role.replace("_", " ").toLowerCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/70 transition-all duration-500 ease-spring-out hover:bg-destructive/15 hover:text-destructive"
              >
                <Logout width={14} height={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
