# CineBook

## Current State
The app has a homepage with movie listings, and showtimes are only visible on the individual MovieDetailPage. There is no dedicated page or section showing all show timings at a glance.

## Requested Changes (Diff)

### Add
- A new "Show Timings" page (`/showtimes`) that lists all upcoming showtimes grouped by movie, showing date, time, hall, price, and available seats.
- Navigation link to the Show Timings page in the top nav.

### Modify
- Navigation component to include a "Show Timings" link.
- App routing to register the new `/showtimes` route.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `ShowTimingsPage.tsx` that calls `getAllShowtimes()` and `getMovies()` backend APIs, groups showtimes by movie, and renders them in a clean table/card layout with date, time, hall, price, and a "Book" button.
2. Register `/showtimes` route in `App.tsx`.
3. Add "Show Timings" nav link in `Navigation.tsx`.
