export const Locale = {
  ID: "id",
  EN: "en",
} as const;

export type Locale = (typeof Locale)[keyof typeof Locale];

export const DEFAULT_LOCALE: Locale = Locale.ID;
