import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { resolveAdminPassword } from "./resolve-admin-password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail =
    process.env.SEED_ADMIN_EMAIL?.trim() || "admin@church.local";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (existing) {
    console.log(`[seed] admin already exists: ${adminEmail}`);
    return;
  }

  const { password, generated } = resolveAdminPassword();
  const passwordHash = await argon2.hash(password);

  await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Admin Gereja",
      role: "ADMIN",
      passwordHash,
    },
  });

  console.log(`[seed] created admin: ${adminEmail}`);

  if (generated) {
    console.log(`[seed] generated password: ${password}`);
    console.log(
      "[seed] This is shown ONCE. Save it now, then change it after first login.",
    );
  } else {
    console.log("[seed] password taken from SEED_ADMIN_PASSWORD.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
