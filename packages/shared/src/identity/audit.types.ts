export const AuditAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];
