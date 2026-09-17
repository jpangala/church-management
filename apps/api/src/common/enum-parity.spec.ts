import { describe, expect, it } from "vitest";
import {
  AuditAction as PrismaAuditAction,
  BookingStatus as PrismaBookingStatus,
  FinanceCategoryType as PrismaFinanceCategoryType,
  Locale as PrismaLocale,
  ProjectStatus as PrismaProjectStatus,
  Role as PrismaRole,
} from "@prisma/client";
import {
  AuditAction,
  BookingStatus,
  FinanceCategoryType,
  Locale,
  ProjectStatus,
  Role,
} from "@church/shared";

// packages/shared re-declares every enum from schema.prisma by hand, so apps/web can
// use them without taking a dependency on @prisma/client. Nothing structurally stops
// the two from drifting apart — this test does. Add a value to an enum in
// schema.prisma and forget to mirror it here, and CI fails on the next PR.
const MIRRORED: Record<string, [object, object]> = {
  Role: [PrismaRole, Role],
  Locale: [PrismaLocale, Locale],
  BookingStatus: [PrismaBookingStatus, BookingStatus],
  ProjectStatus: [PrismaProjectStatus, ProjectStatus],
  FinanceCategoryType: [PrismaFinanceCategoryType, FinanceCategoryType],
  AuditAction: [PrismaAuditAction, AuditAction],
};

describe("packages/shared enums mirror schema.prisma", () => {
  for (const [name, [fromPrisma, fromShared]] of Object.entries(MIRRORED)) {
    it(`${name} has the same values on both sides`, () => {
      expect(Object.values(fromShared).sort()).toEqual(
        Object.values(fromPrisma).sort(),
      );
    });
  }
});
