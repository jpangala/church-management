import type { ModuleRoute } from "@/app/types";
import UsersListPage from "./UsersListPage";
import UserFormPage from "./UserFormPage";

export const identityRoutes: ModuleRoute[] = [
  { path: "/admin/users", roles: ["ADMIN"], element: <UsersListPage /> },
  { path: "/admin/users/new", roles: ["ADMIN"], element: <UserFormPage /> },
  { path: "/admin/users/:id", roles: ["ADMIN"], element: <UserFormPage /> },
];
