import type { NavEntry } from "@/app/types";
import { Calendar } from "@/components/shared/icons";

export const bookingsNav: NavEntry[] = [
  {
    role: "DIVISION_LEADER",
    section: "Overview",
    to: "/division/calendar",
    label: "Calendar",
    icon: <Calendar />,
  },
  {
    role: "DIVISION_LEADER",
    section: "Team",
    to: "/division/bookings",
    label: "Bookings",
    icon: <Calendar />,
  },
];
