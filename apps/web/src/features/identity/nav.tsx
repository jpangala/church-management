import type { NavEntry } from "@/app/types";
import { Clipboard, Layers, Users } from "@/components/shared/icons";

export const identityNav: NavEntry[] = [
  {
    role: "ADMIN",
    section: "Overview",
    to: "/admin/audit",
    label: "Audit Log",
    icon: <Clipboard />,
  },
  {
    role: "ADMIN",
    section: "Manage",
    to: "/admin/users",
    label: "Users",
    icon: <Users />,
  },
  {
    role: "ADMIN",
    section: "Manage",
    to: "/admin/divisions",
    label: "Divisions",
    icon: <Layers />,
  },
];
