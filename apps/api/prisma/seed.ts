import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@church.local";
  const adminPassword = "ChangeMe123!";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log(`[seed] admin already exists: ${adminEmail}`);
    return;
  }

  const passwordHash = await argon2.hash(adminPassword);
  await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Admin Gereja",
      role: "ADMIN",
      passwordHash,
    },
  });

  console.log(`[seed] created admin: ${adminEmail} / ${adminPassword}`);
  console.log("[seed] CHANGE THIS PASSWORD IMMEDIATELY after first login.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
