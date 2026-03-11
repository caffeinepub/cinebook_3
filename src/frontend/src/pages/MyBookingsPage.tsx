import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, ClipboardList, LogIn, MapPin, Ticket } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { toast } from "sonner";
import { SAMPLE_MOVIES } from "../data/sampleMovies";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllShowtimes,
  useCancelBooking,
  useMovies,
  useMyBookings,
} from "../hooks/useQueries";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };
  return (
    <Badge
      variant="outline"
      className={styles[status] || "bg-muted text-muted-foreground"}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function MyBookingsPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: bookings = [], isLoading: bookingsLoading } = useMyBookings();
  const { data: allShowtimes = [] } = useAllShowtimes();
  const { data: movies = [] } = useMovies();
  const { mutateAsync: cancelBooking, isPending: cancelling } =
    useCancelBooking();

  const enrichedBookings = useMemo(() => {
    return bookings.map((b) => {
      const showtime = allShowtimes.find((s) => s.id === b.showtimeId);
      const backendMovie = movies.find((m) => m.id === b.movieId);
      const movie =
        backendMovie || SAMPLE_MOVIES.find((m) => m.id === b.movieId);
      return { booking: b, showtime, movie };
    });
  }, [bookings, allShowtimes, movies]);

  const handleCancel = async (bookingId: bigint) => {
    try {
      await cancelBooking(bookingId);
      toast.success("Booking cancelled successfully");
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <LogIn className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Sign In Required
        </h2>
        <p className="text-muted-foreground mb-6">
          Please sign in to view your bookings
        </p>
        <Button onClick={login} className="bg-primary text-primary-foreground">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-foreground">
          My <span className="text-primary">Bookings</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Your ticket history and upcoming shows
        </p>
      </div>

      {bookingsLoading ? (
        <div
          data-ocid="mybookings.loading_state"
          className="flex flex-col gap-4"
        >
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : enrichedBookings.length === 0 ? (
        <div
          data-ocid="mybookings.empty_state"
          className="text-center py-20 bg-card border border-border rounded-xl"
        >
          <ClipboardList className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-muted-foreground">
            No bookings yet
          </h3>
          <p className="text-muted-foreground/60 mt-1 mb-6">
            Start by browsing movies and booking your first ticket
          </p>
          <Button
            onClick={() => navigate({ to: "/" })}
            className="bg-primary text-primary-foreground"
          >
            Browse Movies
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {enrichedBookings.map(({ booking, showtime, movie }, idx) => (
            <motion.div
              key={booking.id.toString()}
              data-ocid={`mybookings.booking.item.${idx + 1}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row gap-4"
            >
              {movie?.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded-lg flex-shrink-0 hidden sm:block"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground leading-tight">
                      {movie?.title || "Unknown Movie"}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Booking #{booking.id.toString()}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                  {showtime && (
                    <>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {showtime.date} · {showtime.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {showtime.hall}
                      </span>
                    </>
                  )}
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    {booking.seats.join(", ")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-bold text-primary">
                    ${Number(booking.totalPrice)}
                  </p>
                  {booking.status === "confirmed" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          data-ocid={`mybookings.booking.cancel_button.${idx + 1}`}
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          disabled={cancelling}
                        >
                          Cancel Booking
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="mybookings.cancel.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Cancel this booking?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel booking #
                            {booking.id.toString()}? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="mybookings.cancel.cancel_button">
                            Keep Booking
                          </AlertDialogCancel>
                          <AlertDialogAction
                            data-ocid="mybookings.cancel.confirm_button"
                            onClick={() => handleCancel(booking.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Yes, Cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
