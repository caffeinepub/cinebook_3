import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Clapperboard,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import type { Movie, Showtime } from "../backend.d";
import { useAllShowtimes, useMovies } from "../hooks/useQueries";

const SKELETON_ROWS = ["s1", "s2", "s3", "s4", "s5", "s6"];

function ShowtimeCard({
  showtime,
  index,
  onBook,
}: {
  showtime: Showtime;
  index: number;
  onBook: () => void;
}) {
  return (
    <motion.div
      data-ocid={`showtimings.item.${index + 1}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm px-5 py-4 hover:border-primary/40 hover:bg-card transition-all duration-200"
    >
      {/* Subtle left accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-2/3 rounded-full bg-primary/0 group-hover:bg-primary/60 transition-all duration-300" />

      <div className="flex flex-wrap items-center gap-4">
        {/* Date */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Date
            </p>
            <p className="text-sm font-semibold text-foreground">
              {showtime.date}
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 min-w-[90px]">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Time
            </p>
            <p className="text-sm font-semibold text-foreground">
              {showtime.time}
            </p>
          </div>
        </div>

        {/* Hall */}
        <div className="flex items-center gap-2 min-w-[100px]">
          <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Hall
            </p>
            <p className="text-sm font-semibold text-foreground">
              {showtime.hall}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Ticket className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Price
            </p>
            <p className="text-sm font-semibold text-primary">
              {Number(showtime.price).toLocaleString()} ICP
            </p>
          </div>
        </div>

        {/* Seats badge */}
        <Badge variant="secondary" className="text-xs">
          {Number(showtime.totalSeats)} seats
        </Badge>
      </div>

      <Button
        data-ocid={`showtimings.book_button.${index + 1}`}
        size="sm"
        onClick={onBook}
        className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
      >
        Book Now
      </Button>
    </motion.div>
  );
}

export function ShowTimingsPage() {
  const { data: showtimes, isLoading: loadingShowtimes } = useAllShowtimes();
  const { data: movies, isLoading: loadingMovies } = useMovies();
  const navigate = useNavigate();

  const isLoading = loadingShowtimes || loadingMovies;

  const movieMap = useMemo(() => {
    const map = new Map<string, Movie>();
    if (movies) {
      for (const m of movies) {
        map.set(m.id.toString(), m);
      }
    }
    return map;
  }, [movies]);

  // Group showtimes by movieId
  const grouped = useMemo(() => {
    if (!showtimes) return [];
    const map = new Map<string, Showtime[]>();
    for (const s of showtimes) {
      const key = s.movieId.toString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    // Sort each group by date then time
    for (const [, list] of map) {
      list.sort((a, b) => {
        const dateCmp = a.date.localeCompare(b.date);
        return dateCmp !== 0 ? dateCmp : a.time.localeCompare(b.time);
      });
    }
    return Array.from(map.entries());
  }, [showtimes]);

  // Flat index across all showtimes for deterministic markers
  let globalIndex = 0;

  return (
    <div data-ocid="showtimings.page" className="min-h-screen">
      {/* Page Header */}
      <div className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="relative z-10 container mx-auto px-4 py-14">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <p className="text-primary text-xs font-semibold tracking-widest uppercase mb-2">
              Schedule
            </p>
            <h1 className="font-display font-black text-3xl md:text-5xl text-foreground leading-tight mb-3">
              Show <span className="text-primary">Timings</span>
            </h1>
            <p className="text-muted-foreground">
              Browse all upcoming showtimes across all movies. Find the perfect
              slot and reserve your seats.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div data-ocid="showtimings.loading_state" className="space-y-10">
            {["g1", "g2"].map((gk) => (
              <div key={gk} className="space-y-3">
                <Skeleton className="h-7 w-56 rounded-lg" />
                <div className="space-y-3">
                  {SKELETON_ROWS.map((sk) => (
                    <Skeleton key={sk} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : grouped.length === 0 ? (
          <motion.div
            data-ocid="showtimings.empty_state"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-5">
              <Clapperboard className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="font-display text-xl font-semibold text-muted-foreground mb-1">
              No showtimes scheduled
            </h3>
            <p className="text-sm text-muted-foreground/60">
              Check back soon — new shows are added regularly.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {grouped.map(([movieId, shows], groupIdx) => {
              const movie = movieMap.get(movieId);
              return (
                <motion.section
                  key={movieId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: groupIdx * 0.08 }}
                >
                  {/* Movie heading */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-border/40" />
                    <div className="flex items-center gap-2">
                      {movie?.genre && (
                        <Badge variant="outline" className="text-xs">
                          {movie.genre}
                        </Badge>
                      )}
                      <h2 className="font-display font-bold text-xl text-foreground">
                        {movie?.title ?? `Movie #${movieId}`}
                      </h2>
                    </div>
                    <div className="h-px flex-1 bg-border/40" />
                  </div>

                  {/* Showtimes */}
                  <div className="space-y-3">
                    {shows.map((show) => {
                      const idx = globalIndex++;
                      return (
                        <ShowtimeCard
                          key={show.id.toString()}
                          showtime={show}
                          index={idx}
                          onBook={() =>
                            navigate({
                              to: "/seats/$showtimeId",
                              params: { showtimeId: show.id.toString() },
                            })
                          }
                        />
                      );
                    })}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
