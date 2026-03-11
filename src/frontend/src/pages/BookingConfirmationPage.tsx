import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle,
  ClipboardList,
  Home,
  MapPin,
  Ticket,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { SAMPLE_MOVIES } from "../data/sampleMovies";
import { useAllShowtimes, useMovies, useMyBookings } from "../hooks/useQueries";

export function BookingConfirmationPage() {
  const { bookingId } = useParams({ from: "/booking/$bookingId" });
  const navigate = useNavigate();
  const bookingIdBig = useMemo(() => BigInt(bookingId), [bookingId]);

  const { data: myBookings = [] } = useMyBookings();
  const { data: allShowtimes = [] } = useAllShowtimes();
  const { data: movies = [] } = useMovies();

  const booking = useMemo(
    () => myBookings.find((b) => b.id === bookingIdBig) || null,
    [myBookings, bookingIdBig],
  );

  const showtime = useMemo(
    () =>
      booking
        ? allShowtimes.find((s) => s.id === booking.showtimeId) || null
        : null,
    [booking, allShowtimes],
  );

  const movie = useMemo(() => {
    if (!booking) return null;
    const backendMovie = movies.find((m) => m.id === booking.movieId);
    if (backendMovie) return backendMovie;
    return SAMPLE_MOVIES.find((m) => m.id === booking.movieId) || null;
  }, [booking, movies]);

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="font-display font-black text-3xl text-foreground mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-muted-foreground mb-6">
          Your booking ID: #{bookingId}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate({ to: "/" })} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button
            onClick={() => navigate({ to: "/my-bookings" })}
            className="bg-primary text-primary-foreground"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            My Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
        >
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-4 drop-shadow-[0_0_20px_oklch(0.74_0.155_72/0.5)]" />
        </motion.div>
        <h1 className="font-display font-black text-3xl md:text-4xl text-foreground mb-2">
          Booking <span className="text-primary">Confirmed!</span>
        </h1>
        <p className="text-muted-foreground">
          Your seats are reserved. Enjoy the show!
        </p>
      </motion.div>

      {/* Ticket card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card border border-border rounded-2xl overflow-hidden shadow-gold-lg"
      >
        {/* Ticket header */}
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                Booking ID
              </p>
              <p className="font-mono font-bold text-primary text-lg">
                #{booking.id.toString()}
              </p>
            </div>
            <Badge
              className={`${
                booking.status === "confirmed"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-muted text-muted-foreground"
              }`}
              variant="outline"
            >
              {booking.status}
            </Badge>
          </div>
        </div>

        {/* Ticket body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {movie && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Movie
              </p>
              <p className="font-display font-bold text-xl text-foreground">
                {movie.title}
              </p>
            </div>
          )}

          {showtime && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Date & Time
                </p>
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {showtime.date} · {showtime.time}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Hall
                </p>
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {showtime.hall}
                </p>
              </div>
            </div>
          )}

          {/* Divider with perforations */}
          <div className="relative flex items-center gap-2 my-1">
            <div className="w-5 h-5 rounded-full bg-background -ml-8" />
            <div className="flex-1 border-t border-dashed border-border" />
            <div className="w-5 h-5 rounded-full bg-background -mr-8" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Seats
            </p>
            <div className="flex flex-wrap gap-2">
              {booking.seats.map((seat) => (
                <span
                  key={seat}
                  className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary font-mono font-bold text-sm rounded-md"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">Total Paid</p>
            <p className="font-display font-black text-2xl text-primary">
              ${Number(booking.totalPrice)}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => navigate({ to: "/" })}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => navigate({ to: "/my-bookings" })}
        >
          <ClipboardList className="w-4 h-4 mr-2" />
          My Bookings
        </Button>
      </div>
    </div>
  );
}
