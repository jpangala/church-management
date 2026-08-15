import { NavLink } from "react-router-dom";
import {
  Grid,
  Users,
  Layers,
  User,
  Document,
  Clipboard,
  Gear,
  ChartLine,
  Folder,
  Tag,
  Calendar,
  ArrowUp,
  ArrowDown,
  Globe,
  Sparkles,
} from "./icons";
import type { UserRole } from "../../auth/auth.types";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NAV: Record<UserRole, { section: string; items: NavItem[] }[]> = {
  ADMIN: [
    {
      section: "Overview",
      items: [
        { to: "/admin", label: "Dashboard", icon: <Grid /> },
        { to: "/admin/audit", label: "Audit Log", icon: <Clipboard /> },
      ],
    },
    {
      section: "Manage",
      items: [
        { to: "/admin/users", label: "Users", icon: <Users /> },
        { to: "/admin/divisions", label: "Divisions", icon: <Layers /> },
        { to: "/admin/members", label: "Members", icon: <User /> },
        { to: "/admin/content", label: "Landing Content", icon: <Document /> },
      ],
    },
    {
      section: "System",
      items: [{ to: "/admin/settings", label: "Settings", icon: <Gear /> }],
    },
  ],
  FINANCE: [
    {
      section: "Overview",
      items: [
        { to: "/finance", label: "Dashboard", icon: <Grid /> },
        { to: "/finance/reports", label: "Reports", icon: <ChartLine /> },
      ],
    },
    {
      section: "Ledger",
      items: [
        { to: "/finance/income", label: "Income", icon: <ArrowUp /> },
        { to: "/finance/expenses", label: "Expenses", icon: <ArrowDown /> },
        { to: "/finance/categories", label: "Categories", icon: <Tag /> },
        { to: "/finance/budgets", label: "Budgets", icon: <Sparkles /> },
      ],
    },
  ],
  DIVISION_LEADER: [
    {
      section: "Overview",
      items: [
        { to: "/division", label: "Dashboard", icon: <Grid /> },
        { to: "/division/calendar", label: "Calendar", icon: <Calendar /> },
      ],
    },
    {
      section: "Team",
      items: [
        { to: "/division/members", label: "Members", icon: <User /> },
        { to: "/division/projects", label: "Projects", icon: <Folder /> },
        { to: "/division/bookings", label: "Bookings", icon: <Calendar /> },
      ],
    },
  ],
};

const ROLE_TITLE: Record<UserRole, string> = {
  ADMIN: "Admin Console",
  FINANCE: "Finance Office",
  DIVISION_LEADER: "Division Lead",
};

const ROLE_SUBTITLE: Record<UserRole, string> = {
  ADMIN: "System-wide oversight",
  FINANCE: "Stewardship & ledgers",
  DIVISION_LEADER: "Your division",
};

interface Props {
  role: UserRole;
}

export default function Sidebar({ role }: Props) {
  return (
    <aside className="hidden md:block sticky top-6 h-[calc(100dvh-3rem)] w-72 shrink-0 px-3 pl-6 py-6">
      <div className="relative h-full rounded-[2rem] bg-foreground/[0.035] p-[6px] ring-1 ring-inset ring-foreground/[0.06] shadow-soft-lift">
        <div className="flex h-full flex-col rounded-[calc(2rem-6px)] bg-surface/85 backdrop-blur-md shadow-inner-hairline">
          {/* Brandmark */}
          <div className="flex items-center gap-3 px-6 pt-6">
            <span
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft-glow"
              aria-hidden
            >
              <span className="font-editorial text-xl font-medium leading-none">G</span>
              <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-surface" />
            </span>
            <div className="leading-tight">
              <p className="font-editorial text-[15px] font-medium text-foreground">
                Gereja XYZ
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {ROLE_TITLE[role]}
              </p>
            </div>
          </div>

          <div className="mx-6 mt-5 hairline" />

          <p className="px-6 pt-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {ROLE_SUBTITLE[role]}
          </p>

          {/* Nav */}
          <nav className="mt-4 flex-1 space-y-6 overflow-y-auto px-3 pb-4">
            {NAV[role].map((group) => (
              <div key={group.section}>
                <p className="px-3 pb-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                  {group.section}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === `/${role.toLowerCase().split("_")[0]}`}
                        className={({ isActive }) =>
                          `group relative flex items-center gap-3 rounded-full px-3 py-2 text-sm transition-all duration-500 ease-spring-out ${
                            isActive
                              ? "bg-primary text-primary-foreground shadow-soft-glow ring-1 ring-inset ring-white/10"
                              : "text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-500 ease-spring-out ${
                                isActive
                                  ? "bg-white/15 text-white"
                                  : "bg-foreground/[0.04] text-foreground/70 group-hover:bg-foreground/[0.07]"
                              }`}
                              aria-hidden
                            >
                              {item.icon}
                            </span>
                            <span className="tracking-[-0.005em]">{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer card */}
          <div className="m-3 mt-2 rounded-[1.25rem] bg-foreground/[0.04] p-[5px] ring-1 ring-inset ring-foreground/[0.05]">
            <div className="rounded-[calc(1.25rem-5px)] bg-surface p-4 shadow-inner-hairline">
              <div className="flex items-center gap-2 text-foreground/70">
                <Globe width={14} height={14} />
                <span className="text-[10px] uppercase tracking-[0.22em]">
                  Locale ID · EN
                </span>
              </div>
              <p className="mt-2 font-editorial text-sm leading-snug text-foreground">
                Bilingual UI siap. Tekan toggle di header.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
