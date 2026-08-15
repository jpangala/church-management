import { describe, expect, it } from "vitest";
import { cn, formatIDR } from "./utils";

describe("cn", () => {
  it("merges conflicting tailwind classes so the last one wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    expect(cn("text-sm", false, undefined, "font-bold")).toBe(
      "text-sm font-bold",
    );
  });
});

describe("formatIDR", () => {
  it("groups thousands the Indonesian way, with dots", () => {
    expect(formatIDR(1_500_000)).toContain("1.500.000");
  });

  it("includes the rupiah symbol", () => {
    expect(formatIDR(1_500_000)).toContain("Rp");
  });

  it("renders no fractional digits", () => {
    const formatted = formatIDR(1500.75);

    expect(formatted).toContain("1.501");
    expect(formatted).not.toContain(",75");
  });

  it("formats zero without throwing", () => {
    expect(formatIDR(0)).toContain("0");
  });
});
