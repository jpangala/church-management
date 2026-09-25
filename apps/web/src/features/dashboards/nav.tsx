import type { NavEntry } from "@/app/types";
import { Gear, Grid } from "@/components/shared/icons";

// The three role landing pages, plus admin Settings. Cross-cutting: lead-owned.
export const dashboardsNav: NavEntry[] = [
  {
    role: "ADMIN",
    section: "Overview",
    to: "/admin",
    label: "Dashboard",
    icon: <Grid />,
  },
  {
    role: "ADMIN",
    section: "System",
    to: "/admin/settings",
    label: "Settings",
    icon: <Gear />,
  },
  {
    role: "FINANCE",
    section: "Overview",
    to: "/finance",
    label: "Dashboard",
    icon: <Grid />,
  },
  {
    role: "DIVISION_LEADER",
    section: "Overview",
    to: "/division",
    label: "Dashboard",
    icon: <Grid />,
  },
];
