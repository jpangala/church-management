# Identity & Access — API module

**Owns:** `User`, `Division`, `AuditLog`
**Owner:** unassigned — see [`.github/CODEOWNERS`](../../../../../.github/CODEOWNERS)

## Built

- `auth.module.ts` — registers JwtModule + PassportModule
- `auth.controller.ts` — `POST /auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me`
- `auth.service.ts` — argon2 verify, token issuance
- `strategies/jwt.strategy.ts`, `guards/`, `decorators/`

## To build

- `users.controller.ts` / `users.service.ts` — backs the existing `/admin/users` UI, which is still on mock data
- `divisions.controller.ts` / `divisions.service.ts` — enforce `Division.leaderUserId` unique (exactly one leader per division)
- `audit.service.ts` — write the audit trail; Admin-only read

Controllers must not import `PrismaService` or `@prisma/client` — the linter enforces it. Data access belongs in the service.
