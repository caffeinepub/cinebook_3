# CineBook - Online Movie Ticket Booking Platform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Movie catalog with title, description, genre, duration, rating, poster
- Showtimes/schedules per movie (date, time, theater/hall)
- Seat selection grid per showtime (rows x columns, seat status: available/booked)
- Booking flow: select movie -> select showtime -> select seats -> confirm booking
- Booking confirmation with booking ID, movie, seats, total price
- Admin panel: add/edit movies, manage showtimes, view all bookings
- User bookings: view current user's bookings
- Sample seed data: 5 movies, multiple showtimes each

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend data models: Movie, Showtime, Seat, Booking, User principal tracking
2. Backend APIs: CRUD for movies/showtimes, seat availability query, book seats, get user bookings, admin stats
3. Frontend pages: Home (movie listing), Movie detail, Showtime selection, Seat picker, Booking confirmation, My Bookings, Admin panel
4. Authorization: admin role for managing content, authenticated users for booking
