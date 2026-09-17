export const FinanceCategoryType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type FinanceCategoryType =
  (typeof FinanceCategoryType)[keyof typeof FinanceCategoryType];
