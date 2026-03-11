import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Star, Tag, Ticket } from "lucide-react";
import { motion } from "motion/react";
import type { Movie } from "../backend.d";

const GENRE_COLORS: Record<string, string> = {
  Action: "bg-accent/20 text-accent-foreground border-accent/30",
  "Sci-Fi": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Fantasy: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Thriller: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Drama: "bg-green-500/20 text-green-300 border-green-500/30",
  Adventure: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Comedy: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Horror: "bg-red-900/40 text-red-300 border-red-500/30",
  Romance: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

const POSTER_GRADIENTS = [
  "from-blue-900 via-indigo-900 to-purple-950",
  "from-emerald-900 via-teal-900 to-cyan-950",
  "from-orange-900 via-red-900 to-rose-950",
  "from-violet-900 via-purple-900 to-fuchsia-950",
  "from-slate-800 via-zinc-900 to-stone-950",
  "from-amber-900 via-orange-900 to-red-950",
];

interface MovieCardProps {
  movie: Movie;
  index: number;
  onBookNow: (movie: Movie) => void;
}

export function MovieCard({ movie, index, onBookNow }: MovieCardProps) {
  const genreClass =
    GENRE_COLORS[movie.genre] ||
    "bg-muted/50 text-muted-foreground border-border";
  const gradientClass = POSTER_GRADIENTS[index % POSTER_GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative bg-card border border-border rounded-xl overflow-hidden card-hover flex flex-col"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-b ${gradientClass} flex flex-col items-center justify-center p-4`}
          >
            <span className="text-6xl mb-3 opacity-30">🎬</span>
            <span className="font-display font-bold text-lg text-center text-white/60 leading-tight">
              {movie.title}
            </span>
          </div>
        )}
        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span className="text-xs font-semibold text-primary">
            {movie.rating}
          </span>
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-display font-bold text-base text-foreground leading-tight mb-1 line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {movie.description}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-auto">
          <Badge
            variant="outline"
            className={`text-xs px-2 py-0.5 ${genreClass}`}
          >
            <Tag className="w-2.5 h-2.5 mr-1" />
            {movie.genre}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {Number(movie.duration)}m
          </span>
        </div>

        <Button
          data-ocid="movie.book_button"
          size="sm"
          className="w-full mt-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          onClick={() => onBookNow(movie)}
        >
          <Ticket className="w-3.5 h-3.5 mr-1.5" />
          Book Now
        </Button>
      </div>
    </motion.div>
  );
}
