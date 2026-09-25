import type { ModuleRoute } from "@/app/types";
import AdminDashboard from "./AdminDashboard";
import FinanceDashboard from "./FinanceDashboard";
import DivisionDashboard from "./DivisionDashboard";

// The /* catch-alls send not-yet-built screens to the role's dashboard. React
// Router ranks by specificity, so a module's own route always wins over these.
export const dashboardsRoutes: ModuleRoute[] = [
  { path: "/admin", roles: ["ADMIN"], element: <AdminDashboard /> },
  { path: "/admin/*", roles: ["ADMIN"], element: <AdminDashboard /> },
  { path: "/finance/*", roles: ["FINANCE"], element: <FinanceDashboard /> },
  {
    path: "/division/*",
    roles: ["DIVISION_LEADER"],
    element: <DivisionDashboard />,
  },
];
