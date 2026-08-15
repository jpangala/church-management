export const FinanceCategoryType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type FinanceCategoryType =
  (typeof FinanceCategoryType)[keyof typeof FinanceCategoryType];

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
