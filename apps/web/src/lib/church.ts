// The church's display name. Set it once, as VITE_CHURCH_NAME in apps/web/.env;
// every screen and the browser tab title read it from here. Falls back to the
// real name so a missing or empty setting never shows a placeholder.
export const CHURCH_NAME =
  import.meta.env.VITE_CHURCH_NAME?.trim() || "GKI Bogor Baru";
