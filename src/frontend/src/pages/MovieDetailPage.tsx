import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Tag,
  Ticket,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import type { Movie } from "../backend.d";
import { SAMPLE_MOVIES } from "../data/sampleMovies";
import { useMovie, useShowtimes } from "../hooks/useQueries";

const GENRE_COLORS: Record<string, string> = {
  Action: "bg-accent/20 text-accent-foreground border-accent/30",
  "Sci-Fi": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Fantasy: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Thriller: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Drama: "bg-green-500/20 text-green-300 border-green-500/30",
  Adventure: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

const POSTER_GRADIENTS = [
  "from-blue-900 via-indigo-900 to-purple-950",
  "from-emerald-900 via-teal-900 to-cyan-950",
  "from-orange-900 via-red-900 to-rose-950",
  "from-violet-900 via-purple-900 to-fuchsia-950",
  "from-slate-800 via-zinc-900 to-stone-950",
  "from-amber-900 via-orange-900 to-red-950",
];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movie/$movieId" });
  const navigate = useNavigate();
  const movieIdBig = useMemo(() => BigInt(movieId), [movieId]);

  const { data: backendMovie, isLoading: movieLoading } = useMovie(movieIdBig);
  const { data: showtimes = [], isLoading: showtimesLoading } =
    useShowtimes(movieIdBig);

  const movie: Movie | null = useMemo(() => {
    if (backendMovie) return backendMovie;
    return SAMPLE_MOVIES.find((m) => m.id === movieIdBig) || null;
  }, [backendMovie, movieIdBig]);

  const sampleIndex = useMemo(
    () => SAMPLE_MOVIES.findIndex((m) => m.id === movieIdBig),
    [movieIdBig],
  );
  const gradientClass =
    POSTER_GRADIENTS[Math.max(0, sampleIndex) % POSTER_GRADIENTS.length];

  if (movieLoading) {
    return (
      <div
        data-ocid="movie.loading_state"
        className="container mx-auto px-4 py-12"
      >
        <Skeleton className="h-6 w-24 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="aspect-[2/3] rounded-xl" />
          <div className="md:col-span-2 flex flex-col gap-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-muted-foreground">
          Movie not found
        </h2>
        <Button onClick={() => navigate({ to: "/" })} className="mt-4">
          Back to Home
        </Button>
      </div>
    );
  }

  const genreClass =
    GENRE_COLORS[movie.genre] ||
    "bg-muted/50 text-muted-foreground border-border";

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/" })}
        className="mb-8 text-muted-foreground hover:text-foreground gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Movies
      </Button>

      {/* Movie details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Poster */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="aspect-[2/3] rounded-xl overflow-hidden shadow-gold"
        >
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-b ${gradientClass} flex items-center justify-center`}
            >
              <span className="text-8xl opacity-20">🎬</span>
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 flex flex-col justify-center gap-5"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className={`text-xs ${genreClass}`}>
                <Tag className="w-3 h-3 mr-1" />
                {movie.genre}
              </Badge>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-semibold text-primary">
                  {movie.rating}
                </span>
                <span className="text-muted-foreground">/ 10</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {Number(movie.duration)} minutes
              </div>
            </div>
            <h1 className="font-display font-black text-3xl md:text-4xl text-foreground mb-3">
              {movie.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {movie.description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Showtimes */}
      <div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-6">
          <span className="text-primary">Available</span> Showtimes
        </h2>

        {showtimesLoading ? (
          <div
            data-ocid="showtime.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : showtimes.length === 0 ? (
          <div
            data-ocid="showtime.empty_state"
            className="text-center py-16 bg-card rounded-xl border border-border"
          >
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No showtimes available yet
            </p>
            <p className="text-muted-foreground/60 text-sm mt-1">
              Check back soon for upcoming shows
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {showtimes.map((showtime, idx) => (
              <motion.button
                key={showtime.id.toString()}
                data-ocid={`showtime.item.${idx + 1}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.07 }}
                onClick={() =>
                  navigate({
                    to: "/seats/$showtimeId",
                    params: { showtimeId: showtime.id.toString() },
                  })
                }
                className="text-left bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:bg-card/80 hover:shadow-gold transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {showtime.time}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {showtime.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-lg">
                      ${Number(showtime.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">per seat</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {showtime.hall}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3 h-3" />
                    {Number(showtime.totalSeats)} seats
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
