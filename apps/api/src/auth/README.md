# Auth Module (placeholder)

Module belum diimplementasikan. Sprint 1 backlog:

- `auth.module.ts` — registers JwtModule + PassportModule
- `auth.controller.ts` — `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- `auth.service.ts` — argon2 verify, token issuance
- `strategies/jwt.strategy.ts` — validates access tokens
- `guards/jwt-auth.guard.ts`, `guards/roles.guard.ts`
- `decorators/roles.decorator.ts`, `decorators/current-user.decorator.ts`

Lihat Sprint Plan di Notion untuk detail.
