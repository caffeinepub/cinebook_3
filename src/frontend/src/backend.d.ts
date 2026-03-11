import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type UserRole = { 'admin': null } | { 'guest': null } | { 'user': null };

export interface Movie {
  id: bigint;
  title: string;
  description: string;
  genre: string;
  duration: bigint;
  rating: string;
  posterUrl: string;
  isActive: boolean;
}

export interface Showtime {
  id: bigint;
  movieId: bigint;
  date: string;
  time: string;
  hall: string;
  totalSeats: bigint;
  price: bigint;
}

export interface Booking {
  id: bigint;
  userId: Principal;
  showtimeId: bigint;
  movieId: bigint;
  seats: string[];
  totalPrice: bigint;
  bookingDate: string;
  status: string;
}

export interface _SERVICE {
  _initializeAccessControlWithSecret: ActorMethod<[string], void>;
  addMovie: ActorMethod<[string, string, string, bigint, string, string], bigint>;
  addShowtime: ActorMethod<[bigint, string, string, string, bigint, bigint], bigint>;
  assignCallerUserRole: ActorMethod<[Principal, UserRole], void>;
  cancelBooking: ActorMethod<[bigint], boolean>;
  createBooking: ActorMethod<[bigint, string[]], bigint>;
  deleteMovie: ActorMethod<[bigint], boolean>;
  deleteShowtime: ActorMethod<[bigint], boolean>;
  getAdminStats: ActorMethod<[], [bigint, bigint]>;
  getAllBookings: ActorMethod<[], Booking[]>;
  getAllShowtimes: ActorMethod<[], Showtime[]>;
  getBookedSeats: ActorMethod<[bigint], string[]>;
  getCallerUserRole: ActorMethod<[], UserRole>;
  getMovie: ActorMethod<[bigint], [Movie] | []>;
  getMovies: ActorMethod<[], Movie[]>;
  getMyBookings: ActorMethod<[], Booking[]>;
  getShowtimes: ActorMethod<[bigint], Showtime[]>;
  isCallerAdmin: ActorMethod<[], boolean>;
  updateMovie: ActorMethod<[bigint, string, string, string, bigint, string, string, boolean], boolean>;
}
