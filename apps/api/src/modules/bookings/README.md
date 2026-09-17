# Bookings & Assets — API module

**Owns:** `Booking`, `BookingRoom`, `BookingItem`, `Room`, `Item` — five models, the largest slice
**Owner:** unassigned — see [`.github/CODEOWNERS`](../../../../../.github/CODEOWNERS)

## To build

- `bookings.controller.ts` / `bookings.service.ts` — backs `/division/bookings` and `/division/calendar`
- `rooms.controller.ts` / `rooms.service.ts`
- `items.controller.ts` / `items.service.ts`

## Rules that live here

- Hourly slots only — `startAt` / `endAt` must have `minute === 0`
- Overlapping reservations are rejected, across **both** `BookingRoom` and `BookingItem`
- `BookingStatus` transitions run through the service, never the controller

Overlap detection is the highest-risk logic in the codebase. It needs service-layer unit tests.
