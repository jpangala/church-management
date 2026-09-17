import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "src/**/*.spec.ts",
      "src/**/*.test.ts",
      "prisma/**/*.spec.ts",
      "prisma/**/*.test.ts",
    ],
  },
  resolve: {
    alias: {
      "@church/shared": path.resolve(__dirname, "../../packages/shared/src"),
    },
  },
});
