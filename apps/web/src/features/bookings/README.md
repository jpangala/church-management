# Bookings & Assets — web feature

**Owner:** unassigned — see [`.github/CODEOWNERS`](../../../../../.github/CODEOWNERS)

## Screens to build

| Route                      | Screen                                                                       |
| -------------------------- | ---------------------------------------------------------------------------- |
| `/division/bookings`       | Booking list, create/cancel, status                                          |
| `/division/calendar`       | Calendar view of room and item reservations                                  |
| _(not in the sidebar yet)_ | Room and item admin — add a link in `./nav.tsx` and a page in `./routes.tsx` |

The hourly-slot constraint and overlap rejection are enforced server-side. The UI should surface those errors clearly rather than trying to duplicate the rules.

## Conventions

- Shared UI comes from `@/components/shared/`.
- Components only this domain uses go in `./components/`.
- API calls go in `./api.ts`, data hooks in `./queries.ts`.
