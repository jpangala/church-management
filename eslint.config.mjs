import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      "graphify-out/**",
      "apps/web/vite.config.js",
      "apps/web/vite.config.d.ts",
      "**/*.tsbuildinfo",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Build/config files run in Node.
  {
    files: [
      "*.mjs",
      "apps/*/vite.config.ts",
      "apps/*/vitest.config.ts",
      "apps/*/tailwind.config.ts",
      "apps/*/postcss.config.js",
    ],
    languageOptions: { globals: { ...globals.node } },
  },

  // NestJS API — Node environment.
  {
    files: ["apps/api/**/*.ts"],
    languageOptions: { globals: { ...globals.node } },
  },

  // React web app — browser environment + hooks rules.
  {
    files: ["apps/web/src/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { "react-hooks": reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },

  // ── Boundary: controllers must never touch Prisma. ───────────────────────
  {
    files: ["apps/api/src/**/*.controller.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/prisma/prisma.service", "@prisma/client"],
              message:
                "Controllers delegate to services. Data access belongs in *.service.ts.",
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },

  // ── Boundary: packages/shared must stay framework-free. ──────────────────
  // Both apps import it; a framework import here breaks one of them.
  {
    files: ["packages/shared/**/*.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@nestjs/*",
                "react",
                "react-*",
                "axios",
                "express",
                "@prisma/client",
              ],
              message:
                "packages/shared must import no framework — both apps depend on it.",
            },
          ],
        },
      ],
    },
  },

  // Tests may use non-null assertions and loose mock shapes.
  {
    files: ["**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },

  // Must be last: turns off every rule that fights Prettier.
  prettier,
);
