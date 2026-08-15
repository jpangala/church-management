import { describe, expect, it } from "vitest";
import { resolveAdminPassword } from "./resolve-admin-password";

describe("resolveAdminPassword", () => {
  it("uses SEED_ADMIN_PASSWORD when it is set", () => {
    const result = resolveAdminPassword({ SEED_ADMIN_PASSWORD: "s3cret-from-env" });

    expect(result.password).toBe("s3cret-from-env");
    expect(result.generated).toBe(false);
  });

  it("generates a password when the variable is absent", () => {
    const result = resolveAdminPassword({});

    expect(result.generated).toBe(true);
    expect(result.password.length).toBeGreaterThanOrEqual(16);
  });

  it("generates a password when the variable is blank or whitespace", () => {
    expect(resolveAdminPassword({ SEED_ADMIN_PASSWORD: "" }).generated).toBe(true);
    expect(resolveAdminPassword({ SEED_ADMIN_PASSWORD: "   " }).generated).toBe(true);
  });

  it("generates a different password on each call", () => {
    const first = resolveAdminPassword({});
    const second = resolveAdminPassword({});

    expect(first.password).not.toBe(second.password);
  });
});
