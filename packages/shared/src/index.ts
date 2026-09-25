// Framework-free types and constants shared by apps/api and apps/web.
// Grouped by domain module so each slice has an obvious home; see CONTRIBUTING.md.
//
// Every enum here mirrors one in apps/api/prisma/schema.prisma by hand, so the web
// app never has to depend on @prisma/client. That mirroring is guarded by
// apps/api/src/common/enum-parity.spec.ts — if the two drift, CI fails.
export * from "./identity/roles";
export * from "./identity/audit.types";
export * from "./members/project.types";
export * from "./bookings/booking.types";
export * from "./finance/finance.types";
export * from "./common/locale.types";
