import type { ModuleRoute } from "./types";
import { dashboardsRoutes } from "@/features/dashboards/routes";
import { identityRoutes } from "@/features/identity/routes";
import { membersRoutes } from "@/features/members/routes";
import { bookingsRoutes } from "@/features/bookings/routes";
import { financeRoutes } from "@/features/finance/routes";

// Every authenticated page, collected from the modules. Kept apart from
// navigation.ts on purpose: routes import pages, pages render the Sidebar, and
// the Sidebar imports navigation.ts, so combining them would make a cycle.
export const MODULE_ROUTES: ModuleRoute[] = [
  ...dashboardsRoutes,
  ...identityRoutes,
  ...membersRoutes,
  ...bookingsRoutes,
  ...financeRoutes,
];
