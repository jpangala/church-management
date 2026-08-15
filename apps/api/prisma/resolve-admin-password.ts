import { randomBytes } from "node:crypto";

export interface ResolvedAdminPassword {
  password: string;
  generated: boolean;
}

/**
 * Resolves the password used to seed the initial admin user.
 *
 * The repository is public, so no usable password may be committed. A value in
 * SEED_ADMIN_PASSWORD wins; otherwise a random one is generated and printed once
 * by the seed script.
 */
export function resolveAdminPassword(
  env: NodeJS.ProcessEnv = process.env,
): ResolvedAdminPassword {
  const fromEnv = env.SEED_ADMIN_PASSWORD?.trim();

  if (fromEnv) {
    return { password: fromEnv, generated: false };
  }

  return { password: randomBytes(15).toString("base64url"), generated: true };
}
