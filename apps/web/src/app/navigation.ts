import type { Role } from "@church/shared";
import type { NavEntry } from "./types";
import { dashboardsNav } from "@/features/dashboards/nav";
import { identityNav } from "@/features/identity/nav";
import { membersNav } from "@/features/members/nav";
import { bookingsNav } from "@/features/bookings/nav";
import { financeNav } from "@/features/finance/nav";
import { landingNav } from "@/features/landing/nav";

// Which sections each role's sidebar has, and in what order. This is the only
// part of the sidebar that needs the lead. The links inside each section belong
// to the modules, in features/<module>/nav.tsx.
export const SECTIONS: Record<Role, string[]> = {
  ADMIN: ["Overview", "Manage", "System"],
  FINANCE: ["Overview", "Ledger"],
  DIVISION_LEADER: ["Overview", "Team"],
};

// Within a section, links appear in this module order, then in the order each
// module declares them.
export const ALL_NAV_ENTRIES: NavEntry[] = [
  ...dashboardsNav,
  ...identityNav,
  ...membersNav,
  ...bookingsNav,
  ...financeNav,
  ...landingNav,
];

export interface NavSection {
  section: string;
  items: NavEntry[];
}

export function navFor(role: Role): NavSection[] {
  return SECTIONS[role]
    .map((section) => ({
      section,
      items: ALL_NAV_ENTRIES.filter(
        (e) => e.role === role && e.section === section,
      ),
    }))
    .filter((group) => group.items.length > 0);
}
