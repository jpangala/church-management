import type { NavEntry } from "@/app/types";
import { Folder, User } from "@/components/shared/icons";

export const membersNav: NavEntry[] = [
  {
    role: "ADMIN",
    section: "Manage",
    to: "/admin/members",
    label: "Members",
    icon: <User />,
  },
  {
    role: "DIVISION_LEADER",
    section: "Team",
    to: "/division/members",
    label: "Members",
    icon: <User />,
  },
  {
    role: "DIVISION_LEADER",
    section: "Team",
    to: "/division/projects",
    label: "Projects",
    icon: <Folder />,
  },
];
