import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, LogIn, Ticket } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { SAMPLE_MOVIES } from "../data/sampleMovies";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllShowtimes,
  useBookedSeats,
  useCreateBooking,
  useMovie,
} from "../hooks/useQueries";

const ROWS = ["A", "B", "C", "D", "E"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];

export function SeatSelectionPage() {
  const { showtimeId } = useParams({ from: "/seats/$showtimeId" });
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const showtimeIdBig = useMemo(() => BigInt(showtimeId), [showtimeId]);
  const { data: allShowtimes = [], isLoading: showtimesLoading } =
    useAllShowtimes();
  const showtime = useMemo(
    () => allShowtimes.find((s) => s.id === showtimeIdBig) || null,
    [allShowtimes, showtimeIdBig],
  );
  const movieIdBig = useMemo(() => showtime?.movieId ?? null, [showtime]);

  const { data: backendMovie, isLoading: movieLoading } = useMovie(movieIdBig);
  const movie = useMemo(() => {
    if (backendMovie) return backendMovie;
    if (movieIdBig !== null)
      return SAMPLE_MOVIES.find((m) => m.id === movieIdBig) || null;
    return null;
  }, [backendMovie, movieIdBig]);

  const { data: bookedSeats = [], isLoading: seatsLoading } =
    useBookedSeats(showtimeIdBig);
  const { mutateAsync: createBooking, isPending } = useCreateBooking();

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const isLoading = showtimesLoading || movieLoading || seatsLoading;

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const totalPrice = showtime
    ? selectedSeats.length * Number(showtime.price)
    : 0;

  const handleConfirm = async () => {
    if (!isLoggedIn) {
      login();
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }
    if (!showtime) return;
    try {
      const bookingId = await createBooking({
        showtimeId: showtimeIdBig,
        seats: selectedSeats,
      });
      toast.success("Booking confirmed!");
      navigate({
        to: "/booking/$bookingId",
        params: { bookingId: bookingId.toString() },
      });
    } catch {
      toast.error("Failed to create booking. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="seat.loading_state"
        className="container mx-auto px-4 py-12"
      >
        <Skeleton className="h-6 w-24 mb-8" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-muted-foreground">
          Showtime not found
        </h2>
        <Button onClick={() => navigate({ to: "/" })} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          navigate({
            to: "/movie/$movieId",
            params: { movieId: showtime.movieId.toString() },
          })
        }
        className="mb-6 text-muted-foreground hover:text-foreground gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Showtimes
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-black text-2xl md:text-3xl text-foreground">
          {movie?.title || "Select Seats"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {showtime.date} · {showtime.time} · {showtime.hall}
        </p>
      </div>

      {/* Screen indicator */}
      <div className="mb-8">
        <div className="w-full max-w-lg mx-auto">
          <div className="h-2 bg-primary/30 rounded-full mb-1 shadow-gold" />
          <p className="text-center text-xs text-muted-foreground tracking-widest uppercase">
            Screen
          </p>
        </div>
      </div>

      {/* Seat grid */}
      <div className="max-w-lg mx-auto mb-8">
        <div className="flex flex-col gap-2">
          {ROWS.map((row) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-5 text-center text-xs font-bold text-muted-foreground font-mono">
                {row}
              </span>
              <div className="flex gap-1.5 flex-1 justify-center">
                {COLS.map((col, colIdx) => {
                  const seatId = `${row}${col}`;
                  const isBooked = bookedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);
                  const seatNum = ROWS.indexOf(row) * COLS.length + colIdx + 1;
                  return (
                    <motion.button
                      key={seatId}
                      data-ocid={`seat.item.${seatNum}`}
                      whileHover={!isBooked ? { scale: 1.1 } : {}}
                      whileTap={!isBooked ? { scale: 0.95 } : {}}
                      onClick={() => toggleSeat(seatId)}
                      disabled={isBooked}
                      title={seatId}
                      className={`w-8 h-8 rounded-md text-xs font-bold transition-all duration-150 ${
                        isBooked
                          ? "seat-booked"
                          : isSelected
                            ? "seat-selected"
                            : "seat-available"
                      }`}
                    >
                      {col}
                    </motion.button>
                  );
                })}
              </div>
              <span className="w-5 text-center text-xs font-bold text-muted-foreground font-mono">
                {row}
              </span>
            </div>
          ))}
        </div>

        {/* Column numbers */}
        <div className="flex items-center gap-2 mt-2">
          <span className="w-5" />
          <div className="flex gap-1.5 flex-1 justify-center">
            {COLS.map((col) => (
              <span
                key={col}
                className="w-8 text-center text-xs text-muted-foreground/50"
              >
                {col}
              </span>
            ))}
          </div>
          <span className="w-5" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-8 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-sm bg-secondary border border-border" />
          Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-sm bg-primary" />
          Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-sm bg-muted opacity-50" />
          Booked
        </span>
      </div>

      {/* Summary & CTA */}
      <div className="max-w-lg mx-auto bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Selected seats</p>
            <p className="font-mono font-semibold text-foreground">
              {selectedSeats.length > 0
                ? selectedSeats.sort().join(", ")
                : "None selected"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-display font-bold text-2xl text-primary">
              ${totalPrice}
            </p>
          </div>
        </div>

        {!isLoggedIn && (
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-primary" />
            You need to sign in to complete your booking
          </p>
        )}

        <Button
          data-ocid="booking.confirm_button"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
          size="lg"
          onClick={handleConfirm}
          disabled={isPending || selectedSeats.length === 0}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Confirming…
            </span>
          ) : !isLoggedIn ? (
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In to Book
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              Confirm {selectedSeats.length} Seat
              {selectedSeats.length !== 1 ? "s" : ""}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
