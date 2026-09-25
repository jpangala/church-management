# Role dashboards — cross-cutting

**Owner:** repo lead. Not a domain slice.

`AdminDashboard`, `FinanceDashboard` and `DivisionDashboard` are the landing screens for each
role. They are **aggregate views**: `/division` alone shows members, projects _and_ bookings,
so no single domain owner can own the file.

## How to add your domain's data here

Don't restructure the page. Add a widget fed by your own module's API, keep the data fetching
in your feature folder, and import the presentational piece here. If a change needs the layout
reworked, raise it with the lead rather than reshaping a page three other people depend on.

All three currently render hardcoded arrays. Replacing that mock data with real API calls is
the job of whoever owns the underlying domain, not of whoever owns this folder.
