import { describe, expect, it } from "vitest";
import { ALL_ROLES } from "@church/shared";
import { ALL_NAV_ENTRIES, SECTIONS, navFor } from "./navigation";
import { MODULE_ROUTES } from "./routes";

// Guards for four people adding links and pages in their own modules without
// seeing each other's files.
describe("module navigation", () => {
  it("every nav entry uses a section its role declares", () => {
    // Otherwise the link is silently dropped from the sidebar.
    const orphans = ALL_NAV_ENTRIES.filter(
      (e) => !SECTIONS[e.role].includes(e.section),
    ).map((e) => `${e.role} · ${e.section} · ${e.to}`);
    expect(orphans).toEqual([]);
  });

  it.each(ALL_ROLES)("%s has no duplicate links", (role) => {
    const paths = navFor(role).flatMap((g) => g.items.map((i) => i.to));
    expect(paths).toEqual([...new Set(paths)]);
  });

  it("no two modules register the same route path", () => {
    const paths = MODULE_ROUTES.map((r) => r.path);
    const dupes = paths.filter((p, i) => paths.indexOf(p) !== i);
    expect(dupes).toEqual([]);
  });

  it("every module route is restricted to at least one role", () => {
    const open = MODULE_ROUTES.filter((r) => r.roles.length === 0).map(
      (r) => r.path,
    );
    expect(open).toEqual([]);
  });
});
