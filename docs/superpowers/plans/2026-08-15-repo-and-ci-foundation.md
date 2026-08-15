# Repository & CI Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single-developer Church Management prototype into a public, CI-gated GitHub repository that four developers can work in, with the lint rules that enforce the architecture boundaries already in place.

**Architecture:** Everything is configured at the monorepo root — one ESLint flat config, one Prettier config, one CI workflow — so there is a single place to change a rule. ESLint carries the architectural boundaries from the design spec (controllers may not touch Prisma, features may not import each other, `packages/shared` stays framework-free) so violations fail CI instead of relying on reviewer memory. Vitest runs per-app via `pnpm -r test`. No deployment automation, no e2e tests, no Docker.

**Tech Stack:** pnpm 9 workspaces, Node 22 LTS, TypeScript 5.6, ESLint 9 (flat config), Prettier 3, Vitest 2, GitHub Actions, NestJS 10, React 18 + Vite 5.

**Source spec:** `docs/superpowers/specs/2026-08-15-team-dev-foundation-design.md`

**Follow-up plan:** Plan 2 (structural refactor) depends on this plan being complete. Do not start it until CI is green.

---

## File Structure

Files created or modified by this plan, and what each is responsible for:

| File | Responsibility |
|---|---|
| `.gitignore` (modify) | Exclude generated output that is currently untracked-but-present |
| `.nvmrc` (create) | Pin Node 22 for CI and all four machines |
| `.editorconfig` (create) | Editor-level whitespace consistency |
| `.prettierrc` (create) | Formatting rules — one source of truth |
| `.prettierignore` (create) | Keep Prettier off generated and vendored files |
| `eslint.config.mjs` (create) | Base lint rules **and** the architectural boundary rules |
| `package.json` (modify) | Root scripts (`lint`, `test`, `format`), `engines` |
| `apps/api/package.json` (modify) | `test` script; drop app-level `lint` |
| `apps/web/package.json` (modify) | `test` script; drop app-level `lint` |
| `apps/api/tsconfig.build.json` (create) | Keep `*.spec.ts` out of the deployed `dist/` |
| `apps/api/nest-cli.json` (modify) | Point `nest build` at `tsconfig.build.json` |
| `apps/api/vitest.config.ts` (create) | API test runner |
| `apps/web/vitest.config.ts` (create) | Web test runner |
| `apps/api/prisma/resolve-admin-password.ts` (create) | Testable seed-password resolution |
| `apps/api/prisma/resolve-admin-password.spec.ts` (create) | Its tests |
| `apps/api/prisma/seed.ts` (modify) | Stop hardcoding the admin password before going public |
| `apps/web/src/lib/utils.spec.ts` (create) | Proves the web runner works; covers IDR formatting |
| `.github/workflows/ci.yml` (create) | The `verify` job — the required status check |
| `.github/CODEOWNERS` (create) | Ownership + auto-requested review |
| `.github/pull_request_template.md` (create) | PR checklist |
| `CONTRIBUTING.md` (create) | Branch naming, commit format, where new files go |
| `README.md` (modify) | Correct setup steps (brew Postgres, port 5175, Node 22) |
| `docs/PROGRESS.md` (modify) | Record the commit-convention change and Phase 2 status |

**Why `eslint.config.mjs` and not `eslint.config.js`** (the spec says `.js`): the root `package.json` has no `"type": "module"`, so a `.js` config would be parsed as CommonJS while the config itself uses ESM `import` syntax. `.mjs` is unambiguous. This is the only deviation from the spec in this plan.

---

## Task 1: Git bootstrap and secret audit

**Files:**
- Modify: `.gitignore`

> **Safety gate.** This repository becomes public in Task 13. `apps/api/.env` and `apps/web/.env` contain real JWT secrets. A secret that reaches a public commit must be *rotated*, not deleted. Do not skip step 3.

- [ ] **Step 1: Confirm you are in the right directory and there is no repo yet**

Run:
```bash
cd "/Users/jpangala/Project/Church Management Project" && pwd && ls -d .git 2>/dev/null || echo "NO GIT REPO - correct starting state"
```
Expected: prints the project path, then `NO GIT REPO - correct starting state`.

- [ ] **Step 2: Add the missing ignore entries**

Append to `.gitignore`, after the existing `# Misc` block:

```gitignore

# Generated config output (emitted by `tsc -b` on tsconfig.node.json)
apps/web/vite.config.js
apps/web/vite.config.d.ts

# Knowledge-graph output (generated, not source)
graphify-out/
```

- [ ] **Step 3: Initialise the repo and audit what would be committed**

Run:
```bash
git init -b main && git add -A && git diff --cached --name-only | grep -E '(^|/)\.env$' && echo "!!! STOP: .env IS STAGED !!!" || echo "OK: no .env files staged"
```
Expected: `OK: no .env files staged`.

If it prints `!!! STOP !!!`, run `git rm --cached apps/api/.env apps/web/.env`, confirm `.gitignore` contains `.env`, and re-run this step before continuing.

- [ ] **Step 4: Confirm the generated files are excluded too**

Run:
```bash
git diff --cached --name-only | grep -E 'vite\.config\.(js|d\.ts)|graphify-out|tsbuildinfo|node_modules' && echo "!!! STOP: generated files staged !!!" || echo "OK: no generated files staged"
```
Expected: `OK: no generated files staged`.

- [ ] **Step 5: Review the file list once by eye**

Run:
```bash
git diff --cached --name-only | wc -l && git diff --cached --name-only | head -60
```
Expected: roughly 70–90 files, all of them source, config, docs, or `.env.example`. No `.env`, no `node_modules`, no `dist`.

- [ ] **Step 6: Commit**

```bash
git commit -m "chore: initial commit of church management monorepo"
```

---

## Task 2: Pin the Node version

**Files:**
- Create: `.nvmrc`
- Create: `.editorconfig`
- Modify: `package.json`

Context: the lead's machine runs Node v26, the README says 20+, and CI needs one answer. Node 22 is the LTS line that NestJS 10 and Vite 5 both target.

- [ ] **Step 1: Create `.nvmrc`**

```
22
```

(A single line containing `22`, with a trailing newline.)

- [ ] **Step 2: Create `.editorconfig`**

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

- [ ] **Step 3: Add `engines` to the root `package.json`**

In `package.json`, add an `engines` block immediately after the `"packageManager"` line:

```json
  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=22 <23",
    "pnpm": ">=9"
  },
```

- [ ] **Step 4: Verify the constraint is real**

Run:
```bash
node -p "require('./package.json').engines.node"
```
Expected: `>=22 <23`

Note: if your local Node is v26, `pnpm install` will now warn. Switch with `nvm use` (which reads `.nvmrc`) or `nvm install 22`. CI uses `.nvmrc` and will always be on 22.

- [ ] **Step 5: Commit**

```bash
git add .nvmrc .editorconfig package.json
git commit -m "chore: pin node 22 lts and add editorconfig"
```

---

## Task 3: Prettier

**Files:**
- Create: `.prettierrc`
- Create: `.prettierignore`
- Modify: `package.json`

- [ ] **Step 1: Install Prettier at the workspace root**

Run:
```bash
pnpm add -Dw prettier@^3.3.0
```
Expected: adds `prettier` to root `devDependencies`.

- [ ] **Step 2: Create `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

These match the style already used across the codebase, so formatting produces near-zero churn.

- [ ] **Step 3: Create `.prettierignore`**

```
node_modules
dist
coverage
pnpm-lock.yaml
graphify-out
apps/api/prisma/migrations
apps/web/vite.config.js
apps/web/vite.config.d.ts
*.tsbuildinfo
```

- [ ] **Step 4: Add format scripts to the root `package.json`**

Add to the `"scripts"` block:

```json
    "format": "prettier --write .",
    "format:check": "prettier --check .",
```

- [ ] **Step 5: Check what would change before changing it**

Run:
```bash
pnpm format:check
```
Expected: FAIL, listing a handful of files. This is the "test fails first" step — it proves Prettier is actually reading your config.

- [ ] **Step 6: Format the repository**

Run:
```bash
pnpm format
```

- [ ] **Step 7: Verify it now passes**

Run:
```bash
pnpm format:check
```
Expected: `All matched files use Prettier code style!`

- [ ] **Step 8: Confirm nothing outside source was touched**

Run:
```bash
git status --porcelain | grep -vE '\.(ts|tsx|json|md|css|js|mjs|yml)$' || echo "OK: only source files changed"
```
Expected: `OK: only source files changed`

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: add prettier config and format repository"
```

---

## Task 4: ESLint base configuration

**Files:**
- Create: `eslint.config.mjs`
- Modify: `package.json`
- Modify: `apps/api/package.json`
- Modify: `apps/web/package.json`

Context: `pnpm lint` is already wired into both apps but **fails today** — no ESLint config exists anywhere. This task makes it pass. Task 5 adds the architectural rules on top.

- [ ] **Step 1: Prove the current state is broken**

Run:
```bash
pnpm --filter api lint
```
Expected: FAIL — ESLint reports it could not find a configuration file (or `eslint: command not found`). Either failure confirms the gap.

- [ ] **Step 2: Install ESLint and plugins at the workspace root**

Run:
```bash
pnpm add -Dw eslint@^9.13.0 @eslint/js@^9.13.0 typescript-eslint@^8.11.0 eslint-plugin-react-hooks@^5.0.0 eslint-config-prettier@^9.1.0 globals@^15.11.0
```

- [ ] **Step 3: Create `eslint.config.mjs`**

```js
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
    files: ["apps/web/**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { "react-hooks": reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
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
```

- [ ] **Step 4: Replace the root `lint` script**

In `package.json`, change the `lint` script from `pnpm -r lint` to a single root-level run. One config, one pass, and it works regardless of ESLint's config-lookup behaviour from subdirectories:

```json
    "lint": "eslint .",
```

- [ ] **Step 5: Remove the now-dead app-level lint scripts**

Delete the `"lint"` line from `apps/api/package.json` (currently `"lint": "eslint \"src/**/*.ts\""`) and from `apps/web/package.json` (currently `"lint": "eslint ."`). Linting happens once, at the root.

- [ ] **Step 6: Run the linter**

Run:
```bash
pnpm lint
```
Expected: PASS with no errors. If it reports `@typescript-eslint/no-unused-vars` or `no-undef` in existing source, fix those source files — do not weaken the config to hide them.

- [ ] **Step 7: Confirm typecheck still passes**

Run:
```bash
pnpm --filter api prisma:generate && pnpm typecheck
```
Expected: PASS. (`prisma generate` must run first — `@prisma/client` types do not exist until it does.)

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: add eslint 9 flat config at workspace root"
```

---

## Task 5: Architectural boundary rules

**Files:**
- Modify: `eslint.config.mjs`

Context: this is the task that makes the design spec's boundaries enforceable. Each rule below corresponds to a rule in §6 and §8.2 of the spec.

The relative-path patterns are depth-aware on purpose. A file directly inside a feature (`features/members/Page.tsx`) leaves its feature with a single `../`, while a file one level deeper (`features/members/components/Row.tsx`) uses `../` to reach its *own* feature and needs `../../` to escape. Banning `../*` at both depths would produce false positives on legitimate same-feature imports, so the two depths get separate blocks.

- [ ] **Step 1: Add the boundary blocks to `eslint.config.mjs`**

Insert these blocks after the React block and **before** the tests block and the final `prettier` entry:

```js
  // ── Boundary: controllers must never touch Prisma. ───────────────────────
  {
    files: ["apps/api/src/**/*.controller.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          allowTypeImports: true,
          patterns: [
            {
              group: ["**/prisma/prisma.service", "@prisma/client"],
              message:
                "Controllers delegate to services. Data access belongs in *.service.ts.",
            },
          ],
        },
      ],
    },
  },

  // ── Boundary: files at the top level of a feature. ───────────────────────
  // Here any "../x" import has already left the feature directory.
  {
    files: ["apps/web/src/features/*/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*", "../*/**"],
              message:
                "No cross-feature imports. Shared code belongs in @/components/shared or @church/shared.",
            },
            {
              group: ["@/features/*", "@/features/*/**"],
              message:
                "No cross-feature imports. Inside your own feature use relative paths.",
            },
            {
              group: ["**/lib/api-client", "@/lib/api-client"],
              message:
                "Only your feature's api.ts may import apiClient. Components use the hooks in queries.ts.",
            },
          ],
        },
      ],
    },
  },

  // ── Boundary: files nested one level inside a feature. ───────────────────
  // Here "../" is still your own feature; "../../x" escapes it.
  {
    files: ["apps/web/src/features/*/*/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../../*", "../../*/**"],
              message:
                "No cross-feature imports. Shared code belongs in @/components/shared or @church/shared.",
            },
            {
              group: ["@/features/*", "@/features/*/**"],
              message:
                "No cross-feature imports. Inside your own feature use relative paths.",
            },
            {
              group: ["**/lib/api-client", "@/lib/api-client"],
              message:
                "Only your feature's api.ts may import apiClient. Components use the hooks in queries.ts.",
            },
          ],
        },
      ],
    },
  },

  // ── Exception: a feature's api.ts is the one file allowed to use apiClient.
  // Restated in full rather than switched off, so the cross-feature bans still apply.
  {
    files: ["apps/web/src/features/*/api.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*", "../*/**"],
              message:
                "No cross-feature imports. Shared code belongs in @/components/shared or @church/shared.",
            },
            {
              group: ["@/features/*", "@/features/*/**"],
              message: "No cross-feature imports.",
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
```

- [ ] **Step 2: Prove the controller rule fires**

Create a throwaway file `apps/api/src/scratch.controller.ts`:

```ts
import { Controller } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Controller("scratch")
export class ScratchController {
  constructor(private readonly prisma: PrismaService) {}
}
```

Run:
```bash
pnpm lint
```
Expected: FAIL with `Controllers delegate to services. Data access belongs in *.service.ts.`

- [ ] **Step 3: Prove the cross-feature rule fires**

Create a throwaway file `apps/web/src/features/landing/scratch.ts`:

```ts
import { PrivateRoute } from "../auth/PrivateRoute";

export const scratch = PrivateRoute;
```

Run:
```bash
pnpm lint
```
Expected: FAIL with `No cross-feature imports. Shared code belongs in @/components/shared or @church/shared.`

- [ ] **Step 4: Prove there is no false positive on same-feature imports**

Create `apps/web/src/features/landing/components/scratch-ok.ts`:

```ts
import { scratch } from "../scratch";

export const stillScratch = scratch;
```

Run:
```bash
pnpm lint 2>&1 | grep "scratch-ok" || echo "OK: same-feature relative import is allowed"
```
Expected: `OK: same-feature relative import is allowed` — the file must produce no cross-feature error. (The `scratch.ts` error from Step 3 is still expected and unrelated.)

- [ ] **Step 5: Remove all three throwaway files**

Run:
```bash
rm -f "apps/api/src/scratch.controller.ts" "apps/web/src/features/landing/scratch.ts" "apps/web/src/features/landing/components/scratch-ok.ts"
```

- [ ] **Step 6: Verify the repository is clean again**

Run:
```bash
pnpm lint
```
Expected: PASS with no errors.

- [ ] **Step 7: Commit**

```bash
git add eslint.config.mjs
git commit -m "chore(lint): enforce architecture boundaries via no-restricted-imports"
```

---

## Task 6: Vitest for the API, and stop shipping tests

**Files:**
- Create: `apps/api/tsconfig.build.json`
- Modify: `apps/api/nest-cli.json`
- Create: `apps/api/vitest.config.ts`
- Modify: `apps/api/package.json`

Context: `apps/api` has no `tsconfig.build.json`, so `nest build` compiles everything matched by `tsconfig.json` — including, once this task lands, every `*.spec.ts`. Tests would be deployed to the VPS. Fix that in the same task that introduces them.

- [ ] **Step 1: Install Vitest in the API package**

Run:
```bash
pnpm --filter api add -D vitest@^2.1.0
```

- [ ] **Step 2: Create `apps/api/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.spec.ts", "prisma/**/*.spec.ts"],
  },
});
```

Note: `globals` is deliberately left off. Test files import `describe`/`it`/`expect` from `vitest` explicitly, which means no extra `types` entry is needed in `tsconfig.json` and `pnpm typecheck` keeps working unchanged.

- [ ] **Step 3: Create `apps/api/tsconfig.build.json`**

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "**/*.spec.ts", "prisma/seed.ts"]
}
```

`prisma/seed.ts` is excluded because it is run directly by `tsx` (`pnpm db:seed`) and never needs to be in `dist/`.

- [ ] **Step 4: Point `nest build` at it**

Replace the contents of `apps/api/nest-cli.json`:

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "tsConfigPath": "tsconfig.build.json"
  }
}
```

- [ ] **Step 5: Add the API `test` script**

Add to `"scripts"` in `apps/api/package.json`:

```json
    "test": "vitest run --passWithNoTests",
```

`--passWithNoTests` matters: without it, Vitest exits non-zero when a package has no test files yet, which would fail CI.

- [ ] **Step 6: Verify the runner starts and the build still works**

Run:
```bash
pnpm --filter api prisma:generate && pnpm --filter api test && pnpm --filter api build && ls apps/api/dist/main.js
```
Expected: Vitest reports `No test files found` and exits 0; the build succeeds; `apps/api/dist/main.js` exists.

Then confirm the build output is clean of tests (this is the whole point of `tsconfig.build.json`):

```bash
find apps/api/dist -name "*.spec.js" | grep . && echo "!!! specs are being shipped !!!" || echo "OK: no spec files in dist"
```
Expected: `OK: no spec files in dist`

- [ ] **Step 7: Commit**

```bash
git add apps/api/vitest.config.ts apps/api/tsconfig.build.json apps/api/nest-cli.json apps/api/package.json pnpm-lock.yaml
git commit -m "chore(api): add vitest and keep spec files out of the build"
```

---

## Task 7: Harden the seed password (TDD)

**Files:**
- Create: `apps/api/prisma/resolve-admin-password.ts`
- Create: `apps/api/prisma/resolve-admin-password.spec.ts`
- Modify: `apps/api/prisma/seed.ts`

Context: `seed.ts` hardcodes `admin@church.local` / `ChangeMe123!`. Once the repository is public those are published default credentials. This is the first real test in the repo, and it proves the Vitest setup from Task 6.

- [ ] **Step 1: Write the failing test**

Create `apps/api/prisma/resolve-admin-password.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

Run:
```bash
pnpm --filter api test
```
Expected: FAIL — `Failed to resolve import "./resolve-admin-password"`. The module does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

Create `apps/api/prisma/resolve-admin-password.ts`:

```ts
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
```

`randomBytes(15).toString("base64url")` yields 20 characters, comfortably over the 16 the test requires.

- [ ] **Step 4: Run the tests and confirm they pass**

Run:
```bash
pnpm --filter api test
```
Expected: PASS — 4 tests in 1 file.

- [ ] **Step 5: Wire it into the seed script**

Replace the contents of `apps/api/prisma/seed.ts`:

```ts
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { resolveAdminPassword } from "./resolve-admin-password";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim() || "admin@church.local";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
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
    console.log("[seed] This is shown ONCE. Save it now, then change it after first login.");
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
```

- [ ] **Step 6: Document the new variable**

Add to `apps/api/.env.example`, under the `# Auth` block:

```
# Seed (optional) — if unset, `pnpm db:seed` generates a random admin password
# and prints it once. Never commit a real value here.
SEED_ADMIN_PASSWORD=
SEED_ADMIN_EMAIL=admin@church.local
```

- [ ] **Step 7: Verify lint, types and tests all still pass**

Run:
```bash
pnpm lint && pnpm typecheck && pnpm --filter api test
```
Expected: all three PASS.

- [ ] **Step 8: Commit**

```bash
git add apps/api/prisma/resolve-admin-password.ts apps/api/prisma/resolve-admin-password.spec.ts apps/api/prisma/seed.ts apps/api/.env.example
git commit -m "feat(api): generate a random seed admin password instead of hardcoding one"
```

---

## Task 8: Vitest for the web app (TDD)

**Files:**
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/src/lib/utils.spec.ts`
- Modify: `apps/web/package.json`

Context: the design's day-one coverage target is service-layer units, but a test runner with zero tests is an unproven test runner. `formatIDR` is a genuinely worthwhile first target — currency is IDR-only per the locked decisions, and this is the function every finance screen will render through.

The environment is `node`, not `jsdom`: nothing here touches the DOM. `jsdom` and `@testing-library/react` get added alongside the first component test, not before.

- [ ] **Step 1: Install Vitest in the web package**

Run:
```bash
pnpm --filter web add -D vitest@^2.1.0
```

- [ ] **Step 2: Create `apps/web/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.spec.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@church/shared": path.resolve(__dirname, "../../packages/shared/src"),
    },
  },
});
```

The aliases mirror `apps/web/vite.config.ts` so tests resolve imports exactly as the app does.

- [ ] **Step 3: Add the web `test` script**

Add to `"scripts"` in `apps/web/package.json`:

```json
    "test": "vitest run --passWithNoTests",
```

- [ ] **Step 4: Write the failing test**

Create `apps/web/src/lib/utils.spec.ts`:

```ts
import { describe, expect, it } from "vitest";
import { cn, formatIDR } from "./utils";

describe("cn", () => {
  it("merges conflicting tailwind classes so the last one wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    expect(cn("text-sm", false, undefined, "font-bold")).toBe("text-sm font-bold");
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
```

These assert on substrings rather than the whole string on purpose: `Intl.NumberFormat` puts a non-breaking space after `Rp` in some ICU versions, and an exact-match assertion would break on a Node upgrade for no real reason.

- [ ] **Step 5: Run the tests**

Run:
```bash
pnpm --filter web test
```
Expected: PASS — 6 tests in 1 file. (`cn` and `formatIDR` already exist in `src/lib/utils.ts`, so these pass immediately; they are characterisation tests that lock in current behaviour before four people start changing things.)

- [ ] **Step 6: Add the root `test` script**

Add to `"scripts"` in the root `package.json`:

```json
    "test": "pnpm -r test",
```

- [ ] **Step 7: Verify the whole suite runs from the root**

Run:
```bash
pnpm test
```
Expected: both `api` and `web` run; 10 tests pass in total; `@church/shared` is skipped (it has no `test` script).

- [ ] **Step 8: Commit**

```bash
git add apps/web/vitest.config.ts apps/web/src/lib/utils.spec.ts apps/web/package.json package.json pnpm-lock.yaml
git commit -m "test(web): add vitest and cover cn and formatIDR"
```

---

## Task 9: The CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Verify every gate passes locally first**

Run:
```bash
pnpm install --frozen-lockfile && pnpm --filter api prisma:generate && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```
Expected: all six PASS. Do not write the workflow until this exact sequence is green — the workflow runs these same commands and debugging them locally is far faster than debugging them in Actions.

- [ ] **Step 2: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [main, dev]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    name: verify
    runs-on: ubuntu-latest
    timeout-minutes: 15
    env:
      # `prisma generate` reads the datasource block but never connects,
      # so a placeholder is enough and no database service is needed.
      DATABASE_URL: postgresql://ci:ci@localhost:5432/placeholder
    steps:
      - uses: actions/checkout@v4

      # Version comes from "packageManager" in package.json.
      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # Must precede typecheck: @prisma/client types do not exist until generated.
      - name: Generate Prisma client
        run: pnpm --filter api prisma:generate

      # Ordered cheapest-first so failures surface fast.
      - name: Lint
        run: pnpm lint

      - name: Typecheck
        run: pnpm typecheck

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
```

- [ ] **Step 3: Check the YAML parses**

Run:
```bash
node -e "const fs=require('fs');const s=fs.readFileSync('.github/workflows/ci.yml','utf8');if(!s.includes('name: verify'))throw new Error('job name missing');console.log('OK: workflow file present, job name is verify')"
```
Expected: `OK: workflow file present, job name is verify`

The job name matters — `verify` is the exact string used as the required status check in Task 12.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add verify workflow for pull requests and pushes"
```

---

## Task 10: Ownership and PR guardrails

**Files:**
- Create: `.github/CODEOWNERS`
- Create: `.github/pull_request_template.md`

Context: the three collaborators join later (spec §10 item 2), so every path is assigned to the lead for now. The per-domain lines are present but commented out, ready to uncomment as each person is onboarded.

- [ ] **Step 1: Find the correct GitHub username**

Run:
```bash
gh api user --jq .login
```
Expected: prints your GitHub username. Use that exact value everywhere `@OWNER` appears below. If `gh` is not authenticated, run `gh auth login` first.

- [ ] **Step 2: Create `.github/CODEOWNERS`**

Replace every `@OWNER` with the username from Step 1.

```
# Code owners are requested for review automatically, and are required
# reviewers on protected branches.
#
# Until the other three collaborators join, everything is owned by the lead.
# As each person is onboarded, uncomment their slice below and remove the
# corresponding coverage from the catch-all.

# Catch-all
*                                   @OWNER

# ── Cross-cutting: always lead review, regardless of who owns the slice ──
/.github/                           @OWNER
/packages/shared/                   @OWNER
/apps/api/src/common/               @OWNER
/apps/api/prisma/schema.prisma      @OWNER
/apps/web/src/components/shared/    @OWNER
/apps/web/src/lib/                  @OWNER
/eslint.config.mjs                  @OWNER

# ── Domain slices (uncomment as collaborators join) ──────────────────────
# Identity & Access
# /apps/api/src/modules/auth/       @dev-identity
# /apps/api/src/modules/users/      @dev-identity
# /apps/api/src/modules/divisions/  @dev-identity
# /apps/api/src/modules/audit/      @dev-identity
# /apps/web/src/features/admin/     @dev-identity

# Members & Projects
# /apps/api/src/modules/members/    @dev-members
# /apps/api/src/modules/projects/   @dev-members
# /apps/web/src/features/members/   @dev-members
# /apps/web/src/features/projects/  @dev-members

# Bookings & Assets
# /apps/api/src/modules/bookings/   @dev-bookings
# /apps/api/src/modules/rooms/      @dev-bookings
# /apps/api/src/modules/items/      @dev-bookings
# /apps/web/src/features/bookings/  @dev-bookings
# /apps/web/src/features/assets/    @dev-bookings

# Finance
# /apps/api/src/modules/finance/    @dev-finance
# /apps/web/src/features/finance/   @dev-finance
```

- [ ] **Step 3: Create `.github/pull_request_template.md`**

```markdown
## What changed

<!-- One or two sentences. Link the sprint task if there is one. -->

## How I tested it

<!-- Commands you ran, or the screens you clicked through. "CI is green" is not an answer. -->

## Checklist

- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` passes locally
- [ ] Tests cover the new behaviour (service-layer units for new API logic)
- [ ] This touches shared code (`packages/shared`, `common/`, `components/shared/`, `lib/`) — if yes, say why below
- [ ] Screenshot attached, if the UI changed
```

- [ ] **Step 4: Verify the placeholder was actually replaced**

Run:
```bash
grep -c "@OWNER" .github/CODEOWNERS && echo "!!! STOP: @OWNER placeholder still present !!!" || echo "OK: no placeholders left"
```
Expected: `OK: no placeholders left`

- [ ] **Step 5: Commit**

```bash
git add .github/CODEOWNERS .github/pull_request_template.md
git commit -m "chore: add codeowners and pull request template"
```

---

## Task 11: Documentation

**Files:**
- Create: `CONTRIBUTING.md`
- Modify: `README.md`
- Modify: `docs/PROGRESS.md`

Context: the README currently documents a Docker-based setup that does not work on the lead's machine, and states the wrong web port. `vite.config.ts` sets `server.port` to **5175**, not 5173.

- [ ] **Step 1: Create `CONTRIBUTING.md`**

```markdown
# Contributing

## Prerequisites

- Node 22 (`nvm use` reads `.nvmrc`)
- pnpm 9 (`corepack enable`)
- PostgreSQL 16 running locally

## Branches

```
main   ← deployable. Only ever receives merges from dev.
 ↑
dev    ← integration. All feature work lands here.
 ↑
feat/<domain>-<thing>   ← your branch. Short-lived; aim to merge within 3 days.
```

Branch names: `feat/finance-budget-crud`, `fix/booking-overlap`, `chore/eslint-config`.

- Feature branches are **squash-merged** into `dev`.
- `dev` is merged into `main` with a **merge commit** at sprint end.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), with the domain as the scope:

```
feat(finance): add budget CRUD endpoints
fix(bookings): reject overlapping room reservations
chore(lint): enforce feature import boundaries
```

## Before you open a PR

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

CI runs exactly these four, in this order, plus `prisma generate` first. If they pass locally they will pass in CI.

## Where things go

| You are adding | It goes in |
| --- | --- |
| An API endpoint | `apps/api/src/modules/<domain>/<domain>.controller.ts` |
| Business logic | `apps/api/src/modules/<domain>/<domain>.service.ts` |
| A request/response shape used by both apps | `packages/shared/src/<domain>/` |
| A screen | `apps/web/src/features/<domain>/` |
| An API call from the web app | `apps/web/src/features/<domain>/api.ts` |
| A data hook | `apps/web/src/features/<domain>/queries.ts` |
| A component only your domain uses | `apps/web/src/features/<domain>/components/` |
| A component every domain could use | `apps/web/src/components/shared/` |

## Rules the linter enforces

These fail CI, so you will find out immediately:

- Controllers may not import `PrismaService` or `@prisma/client`. Data access belongs in the service.
- A feature may not import from another feature. Promote shared code to `components/shared/` or `packages/shared/`.
- Only a feature's own `api.ts` may import `apiClient`. Components use the hooks in `queries.ts`.
- `packages/shared` may not import NestJS, React, axios, express, or Prisma. Both apps depend on it, so it stays framework-free.

## Tests

Service-layer unit tests are expected for new API logic. Construct the service directly rather than through Nest's testing module:

```ts
const prisma = { member: { findMany: vi.fn() } };
const service = new MembersService(prisma as unknown as PrismaService);
```

This keeps Vitest working without extra tooling — esbuild does not emit the decorator metadata that Nest's DI needs. If a service is awkward to construct with `new`, it has too many dependencies.

## The design spec

`docs/superpowers/specs/2026-08-15-team-dev-foundation-design.md` explains why the structure is the way it is. Read it before proposing a change to it.
```

- [ ] **Step 2: Replace the "Getting started" section of `README.md`**

Replace lines 27–52 (the `## Getting started` section through the two localhost URLs) with:

```markdown
## Getting started

Prerequisites: Node 22 (`nvm use`), pnpm 9, PostgreSQL 16 running locally.

```bash
# 1. Install deps
pnpm install

# 2. Start Postgres (macOS, Homebrew)
brew services start postgresql@16
pg_isready

# 3. Create the role and database (first time only)
psql postgres -c "CREATE USER church WITH PASSWORD 'churchdev' CREATEDB;"
psql postgres -c "CREATE DATABASE church_management OWNER church;"

# 4. Copy env templates
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 5. Run migrations and seed the admin user
pnpm db:migrate
pnpm db:seed        # prints a generated admin password ONCE — save it

# 6. Start dev servers
pnpm dev
```

- API: <http://localhost:3000>
- Web: <http://localhost:5175>

`docker-compose.yml` is kept for anyone who prefers containers, but the supported local
path is Homebrew Postgres.

See `CONTRIBUTING.md` for branches, commits, and where new files go.
```

- [ ] **Step 3: Update the scripts table in `README.md`**

In the `## Scripts` table, add these rows after the `pnpm typecheck` row:

```markdown
| `pnpm lint` | ESLint across the whole repo |
| `pnpm test` | Vitest in every package |
| `pnpm format` | Prettier write |
| `pnpm format:check` | Prettier check (what CI runs indirectly) |
```

- [ ] **Step 4: Update `docs/PROGRESS.md`**

Replace the `## Conventions` section with:

```markdown
## Conventions

- Path separators: forward slashes in all docs (cross-platform safe).
- Dates in docs: ISO `YYYY-MM-DD`.
- Commits: Conventional Commits with the domain as scope, e.g. `feat(finance): add budget CRUD`.
  (This replaces the earlier `S1: scaffold monorepo` sprint-prefix convention.)
- Branches: `feat/<domain>-<thing>`, merged into `dev`, then `dev` → `main` at sprint end.
- Notion is the source of truth for design/PM artifacts; this repo is source of truth for code; `/docs` here is the bridge.
- Repository is **public**. Never commit real secrets; `.env` is gitignored and `.env.example` holds placeholders only.
```

Then update the `## Next Up` checklist — mark these complete:

```markdown
- [x] Run `pnpm install`
- [x] `pnpm db:migrate` + seed admin user
- [x] Implement Auth module (JWT + refresh + guards)
- [x] Implement Login page + auth context
```

and add a new section before `## Quick Resume Checklist`:

```markdown
## Phase 2.5 — Team Foundation (2026-08-15)

Design spec: `docs/superpowers/specs/2026-08-15-team-dev-foundation-design.md`

- [x] Git repository + public GitHub remote
- [x] Node 22 pinned, ESLint + Prettier, boundary lint rules
- [x] Vitest in both apps
- [x] CI (`verify`): lint → typecheck → test → build
- [x] CODEOWNERS, PR template, CONTRIBUTING.md
- [ ] Structural refactor — see `docs/superpowers/plans/2026-08-15-structural-refactor.md`
```

- [ ] **Step 5: Verify the docs are formatted and the repo is still green**

Run:
```bash
pnpm format && pnpm lint && pnpm typecheck && pnpm test
```
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add CONTRIBUTING.md README.md docs/PROGRESS.md
git commit -m "docs: add contributing guide and correct setup instructions"
```

---

## Task 12: Publish and protect

**Files:** none (GitHub configuration)

> **STOP — confirm with the user before this task.** Creating a public repository publishes all of this code and its full commit history to the internet, and that is not reversible by deleting the repo later. The user approved a public repository in the design spec (decision D10), but confirm explicitly before running Step 3.

- [ ] **Step 1: Final secret sweep across the entire history**

Run:
```bash
git log --all --diff-filter=A --name-only --format="" | sort -u | grep -E '(^|/)\.env$' && echo "!!! STOP: a .env file exists somewhere in history !!!" || echo "OK: no .env ever committed"
```
Expected: `OK: no .env ever committed`

If this fails, **do not publish**. The history must be rewritten (or the repo re-initialised) and the JWT secrets rotated first.

- [ ] **Step 2: Confirm the working tree is clean and green**

Run:
```bash
git status --porcelain && pnpm lint && pnpm typecheck && pnpm test && pnpm build && echo "READY TO PUBLISH"
```
Expected: no output from `git status`, then all gates pass, then `READY TO PUBLISH`.

- [ ] **Step 3: Create the public repository and push `main`**

Run:
```bash
gh repo create church-management --public --source=. --remote=origin --description "Church Management System — landing page + role-based dashboards (Admin, Finance, Division Leader)" --push
```
Expected: the repo is created and `main` is pushed. The command prints the repository URL.

- [ ] **Step 4: Create and push `dev`**

Run:
```bash
git checkout -b dev && git push -u origin dev && git checkout main
```
Expected: `dev` exists on the remote and tracks `origin/dev`.

- [ ] **Step 5: Watch the first CI run**

Run:
```bash
gh run watch
```
Expected: the `verify` job passes. If it fails, fix it on a branch and open the first PR — do not push a fix directly to `main`.

- [ ] **Step 6: Protect `main`**

Run:
```bash
gh api -X PUT "repos/:owner/church-management/branches/main/protection" \
  --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["verify"] },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```
Expected: JSON describing the protection rules is returned.

- [ ] **Step 7: Protect `dev`, without the approval requirement for now**

Per spec §10 item 4: you are currently the only developer, and GitHub will not let you approve your own PR. The status check is the gate that catches broken code; the approval rule is switched on when the second person joins.

Run:
```bash
gh api -X PUT "repos/:owner/church-management/branches/dev/protection" \
  --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["verify"] },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```
Expected: JSON describing the protection rules is returned.

- [ ] **Step 8: Verify protection is actually in force**

Run:
```bash
gh api "repos/:owner/church-management/branches/main/protection" --jq '{checks: .required_status_checks.contexts, reviews: .required_pull_request_reviews.required_approving_review_count, force_push: .allow_force_pushes.enabled}'
```
Expected: `{"checks":["verify"],"reviews":1,"force_push":false}`

- [ ] **Step 9: Turn off unused repository features**

Run:
```bash
gh api -X PATCH "repos/:owner/church-management" -f has_wiki=false -f has_projects=false --jq '{wiki: .has_wiki, projects: .has_projects, visibility: .visibility}'
```
Expected: `{"wiki":false,"projects":false,"visibility":"public"}`

- [ ] **Step 10: Record the outcome**

Append to `docs/PROGRESS.md` under the Phase 2.5 section:

```markdown
Repository: <paste the URL printed in Step 3>
Branch protection: `main` requires `verify` + 1 code-owner approval; `dev` requires `verify`.
Approval requirement on `dev` is switched on when the second collaborator joins.
```

Then commit on a branch and open a PR, to exercise the workflow end to end:

```bash
git checkout -b chore/record-repo-url
git add docs/PROGRESS.md
git commit -m "docs: record repository url and branch protection"
git push -u origin chore/record-repo-url
gh pr create --base dev --title "docs: record repository url and branch protection" --fill
```
Expected: the PR is created, CI runs, and the merge button is blocked until `verify` is green — which confirms the whole setup works.

---

## Done criteria

This plan is complete when all of the following are true:

1. `pnpm lint && pnpm typecheck && pnpm test && pnpm build` passes from a clean checkout.
2. A pull request into `dev` shows the `verify` check and cannot be merged while it is red.
3. `git log --all --diff-filter=A --name-only --format="" | grep -E '(^|/)\.env$'` returns nothing.
4. `apps/api/dist/` contains no `*.spec.js` files after `pnpm --filter api build`.
5. A deliberate cross-feature import in `apps/web/src/features/` fails `pnpm lint`.
6. `pnpm db:seed` on a fresh database prints a generated password rather than `ChangeMe123!`.

---

## Not in this plan

Handled by Plan 2 (`docs/superpowers/plans/2026-08-15-structural-refactor.md`):

- `packages/shared` reorganisation into per-domain folders
- API restructure into `src/modules/` and `src/common/`
- Web restructure: `components/shared/`, `layouts/`, per-feature `api.ts` / `queries.ts` / `routes.tsx`
- Splitting the route table out of `App.tsx`

Out of scope entirely, per spec §3: deployment automation, e2e tests, a Postgres service in CI, Zod, `packages/ui`, OpenAPI codegen, Docker, Dependabot.
