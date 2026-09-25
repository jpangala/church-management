import type { NavEntry } from "@/app/types";
import { Document } from "@/components/shared/icons";

// The landing page is unassigned for now; its admin editor link lives here so
// whoever picks it up owns it.
export const landingNav: NavEntry[] = [
  {
    role: "ADMIN",
    section: "Manage",
    to: "/admin/content",
    label: "Landing Content",
    icon: <Document />,
  },
];
