import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Clapperboard, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Movie } from "../backend.d";
import { MovieCard } from "../components/MovieCard";
import { GENRES, SAMPLE_MOVIES } from "../data/sampleMovies";
import { useMovies } from "../hooks/useQueries";

const SKELETON_KEYS = [
  "sk1",
  "sk2",
  "sk3",
  "sk4",
  "sk5",
  "sk6",
  "sk7",
  "sk8",
  "sk9",
  "sk10",
];

export function HomePage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const { data: backendMovies, isLoading } = useMovies();
  const navigate = useNavigate();

  const movies: Movie[] = useMemo(() => {
    const list =
      backendMovies && backendMovies.length > 0 ? backendMovies : SAMPLE_MOVIES;
    return list.filter((m) => m.isActive);
  }, [backendMovies]);

  const filtered = useMemo(() => {
    return movies.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genre === "All" || m.genre === genre;
      return matchesSearch && matchesGenre;
    });
  }, [movies, search, genre]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/cinema-hero-bg.dim_1920x600.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">
              Now Showing
            </p>
            <h1 className="font-display font-black text-4xl md:text-6xl text-foreground mb-4 leading-tight gold-glow">
              Book Your Perfect
              <br />
              <span className="text-primary">Cinema Experience</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Reserve seats for the latest blockbusters and indie gems. Your
              next unforgettable movie night starts here.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="movies.search_input"
              placeholder="Search movies by title or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          <Select value={genre} onValueChange={setGenre}>
            <SelectTrigger
              data-ocid="movies.genre_filter.select"
              className="w-full sm:w-44 bg-card border-border"
            >
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {isLoading ? (
          <div
            data-ocid="movies.loading_state"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {SKELETON_KEYS.map((key) => (
              <div key={key} className="flex flex-col gap-3">
                <Skeleton className="aspect-[2/3] rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div data-ocid="movies.empty_state" className="text-center py-20">
            <Clapperboard className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-muted-foreground">
              No movies found
            </h3>
            <p className="text-muted-foreground/60 mt-1">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((movie, i) => (
              <MovieCard
                key={movie.id.toString()}
                movie={movie}
                index={i}
                onBookNow={(m) =>
                  navigate({
                    to: "/movie/$movieId",
                    params: { movieId: m.id.toString() },
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
