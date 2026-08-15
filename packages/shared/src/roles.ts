export const Role = {
  ADMIN: "ADMIN",
  FINANCE: "FINANCE",
  DIVISION_LEADER: "DIVISION_LEADER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ALL_ROLES: Role[] = [Role.ADMIN, Role.FINANCE, Role.DIVISION_LEADER];
