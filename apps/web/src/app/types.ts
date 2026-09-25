import type { ReactNode } from "react";
import type { Role } from "@church/shared";

/**
 * One sidebar link, declared in features/<module>/nav.tsx by the module that
 * owns the screen. `section` must be one app/navigation.ts declares for the
 * role; the navigation spec fails if it isn't.
 */
export interface NavEntry {
  role: Role;
  section: string;
  to: string;
  label: string;
  icon: ReactNode;
}

/**
 * One authenticated page, declared in features/<module>/routes.tsx. Every
 * module route sits behind PrivateRoute; public pages stay in App.tsx.
 */
export interface ModuleRoute {
  path: string;
  roles: Role[];
  element: ReactNode;
}
