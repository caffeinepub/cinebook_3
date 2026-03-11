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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  Clock,
  Film,
  Loader2,
  Plus,
  ShieldAlert,
  Ticket,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GENRES } from "../data/sampleMovies";
import {
  useAddMovie,
  useAddShowtime,
  useAdminStats,
  useAllBookings,
  useAllShowtimes,
  useDeleteMovie,
  useDeleteShowtime,
  useIsAdmin,
  useMovies,
} from "../hooks/useQueries";

function StatsCard({
  label,
  value,
  icon: Icon,
  color,
}: { label: string; value: string; icon: any; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-display font-black text-3xl text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export function AdminPage() {
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: movies = [], isLoading: moviesLoading } = useMovies();
  const { data: showtimes = [], isLoading: showtimesLoading } =
    useAllShowtimes();
  const { data: bookings = [], isLoading: bookingsLoading } = useAllBookings();
  const { data: stats } = useAdminStats();

  const { mutateAsync: addMovie, isPending: addingMovie } = useAddMovie();
  const { mutateAsync: deleteMovie, isPending: deletingMovie } =
    useDeleteMovie();
  const { mutateAsync: addShowtime, isPending: addingShowtime } =
    useAddShowtime();
  const { mutateAsync: deleteShowtime, isPending: deletingShowtime } =
    useDeleteShowtime();

  // Add Movie form state
  const [movieForm, setMovieForm] = useState({
    title: "",
    description: "",
    genre: "Action",
    duration: "",
    rating: "",
    posterUrl: "",
  });
  const [movieDialogOpen, setMovieDialogOpen] = useState(false);

  // Add Showtime form state
  const [showtimeForm, setShowtimeForm] = useState({
    movieId: "",
    date: "",
    time: "",
    hall: "",
    totalSeats: "40",
    price: "",
  });
  const [showtimeDialogOpen, setShowtimeDialogOpen] = useState(false);

  const handleAddMovie = async () => {
    if (!movieForm.title || !movieForm.duration || !movieForm.rating) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addMovie({
        title: movieForm.title,
        description: movieForm.description,
        genre: movieForm.genre,
        duration: BigInt(movieForm.duration),
        rating: movieForm.rating,
        posterUrl: movieForm.posterUrl,
      });
      toast.success("Movie added successfully");
      setMovieForm({
        title: "",
        description: "",
        genre: "Action",
        duration: "",
        rating: "",
        posterUrl: "",
      });
      setMovieDialogOpen(false);
    } catch {
      toast.error("Failed to add movie");
    }
  };

  const handleDeleteMovie = async (id: bigint) => {
    try {
      await deleteMovie(id);
      toast.success("Movie deleted");
    } catch {
      toast.error("Failed to delete movie");
    }
  };

  const handleAddShowtime = async () => {
    if (
      !showtimeForm.movieId ||
      !showtimeForm.date ||
      !showtimeForm.time ||
      !showtimeForm.hall ||
      !showtimeForm.price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addShowtime({
        movieId: BigInt(showtimeForm.movieId),
        date: showtimeForm.date,
        time: showtimeForm.time,
        hall: showtimeForm.hall,
        totalSeats: BigInt(showtimeForm.totalSeats || "40"),
        price: BigInt(showtimeForm.price),
      });
      toast.success("Showtime added successfully");
      setShowtimeForm({
        movieId: "",
        date: "",
        time: "",
        hall: "",
        totalSeats: "40",
        price: "",
      });
      setShowtimeDialogOpen(false);
    } catch {
      toast.error("Failed to add showtime");
    }
  };

  const handleDeleteShowtime = async (id: bigint) => {
    try {
      await deleteShowtime(id);
      toast.success("Showtime deleted");
    } catch {
      toast.error("Failed to delete showtime");
    }
  };

  if (adminLoading) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="container mx-auto px-4 py-12"
      >
        <Skeleton className="h-10 w-48 mb-8" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-destructive/50 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Access Denied
        </h2>
        <p className="text-muted-foreground">
          You don't have admin permissions to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-foreground">
          Admin <span className="text-primary">Panel</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage movies, showtimes, and bookings
        </p>
      </div>

      <Tabs defaultValue="stats">
        <TabsList className="mb-6 bg-card border border-border">
          <TabsTrigger data-ocid="admin.stats_tab" value="stats">
            Stats
          </TabsTrigger>
          <TabsTrigger data-ocid="admin.movies_tab" value="movies">
            Movies
          </TabsTrigger>
          <TabsTrigger data-ocid="admin.showtimes_tab" value="showtimes">
            Showtimes
          </TabsTrigger>
          <TabsTrigger data-ocid="admin.bookings_tab" value="bookings">
            Bookings
          </TabsTrigger>
        </TabsList>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="Total Movies"
              value={movies.length.toString()}
              icon={Film}
              color="bg-primary/10 text-primary"
            />
            <StatsCard
              label="Total Showtimes"
              value={showtimes.length.toString()}
              icon={Clock}
              color="bg-blue-500/10 text-blue-400"
            />
            <StatsCard
              label="Total Bookings"
              value={stats ? stats[0].toString() : "0"}
              icon={Ticket}
              color="bg-green-500/10 text-green-400"
            />
            <StatsCard
              label="Total Revenue"
              value={`$${stats ? stats[1].toString() : "0"}`}
              icon={BarChart3}
              color="bg-accent/10 text-accent-foreground"
            />
          </div>
        </TabsContent>

        {/* Movies Tab */}
        <TabsContent value="movies">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-xl">
              Movies ({movies.length})
            </h2>
            <Dialog open={movieDialogOpen} onOpenChange={setMovieDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  data-ocid="admin.add_movie_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Movie
                </Button>
              </DialogTrigger>
              <DialogContent
                data-ocid="admin.add_movie.dialog"
                className="max-w-lg"
              >
                <DialogHeader>
                  <DialogTitle>Add New Movie</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                  <div>
                    <Label htmlFor="movie-title">Title *</Label>
                    <Input
                      data-ocid="admin.movie.title.input"
                      id="movie-title"
                      value={movieForm.title}
                      onChange={(e) =>
                        setMovieForm((p) => ({ ...p, title: e.target.value }))
                      }
                      placeholder="Movie title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="movie-desc">Description</Label>
                    <Textarea
                      data-ocid="admin.movie.description.textarea"
                      id="movie-desc"
                      value={movieForm.description}
                      onChange={(e) =>
                        setMovieForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Movie description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Genre</Label>
                      <Select
                        value={movieForm.genre}
                        onValueChange={(v) =>
                          setMovieForm((p) => ({ ...p, genre: v }))
                        }
                      >
                        <SelectTrigger data-ocid="admin.movie.genre.select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {GENRES.filter((g) => g !== "All").map((g) => (
                            <SelectItem key={g} value={g}>
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="movie-duration">Duration (min) *</Label>
                      <Input
                        data-ocid="admin.movie.duration.input"
                        id="movie-duration"
                        type="number"
                        value={movieForm.duration}
                        onChange={(e) =>
                          setMovieForm((p) => ({
                            ...p,
                            duration: e.target.value,
                          }))
                        }
                        placeholder="120"
                      />
                    </div>
                    <div>
                      <Label htmlFor="movie-rating">Rating *</Label>
                      <Input
                        data-ocid="admin.movie.rating.input"
                        id="movie-rating"
                        value={movieForm.rating}
                        onChange={(e) =>
                          setMovieForm((p) => ({
                            ...p,
                            rating: e.target.value,
                          }))
                        }
                        placeholder="8.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="movie-poster">Poster URL</Label>
                      <Input
                        data-ocid="admin.movie.posterurl.input"
                        id="movie-poster"
                        value={movieForm.posterUrl}
                        onChange={(e) =>
                          setMovieForm((p) => ({
                            ...p,
                            posterUrl: e.target.value,
                          }))
                        }
                        placeholder="https://…"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    data-ocid="admin.add_movie.cancel_button"
                    variant="outline"
                    onClick={() => setMovieDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    data-ocid="admin.add_movie.submit_button"
                    onClick={handleAddMovie}
                    disabled={addingMovie}
                    className="bg-primary text-primary-foreground"
                  >
                    {addingMovie ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Add Movie
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {moviesLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : movies.length === 0 ? (
            <div
              data-ocid="admin.movies.empty_state"
              className="text-center py-16 bg-card rounded-xl border border-border"
            >
              <Film className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No movies added yet</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <Table data-ocid="admin.movies.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.map((movie, idx) => (
                    <TableRow
                      key={movie.id.toString()}
                      data-ocid={`admin.movies.row.${idx + 1}`}
                    >
                      <TableCell className="font-medium">
                        {movie.title}
                      </TableCell>
                      <TableCell>{movie.genre}</TableCell>
                      <TableCell>{Number(movie.duration)}m</TableCell>
                      <TableCell>{movie.rating}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            movie.isActive
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {movie.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              data-ocid={`admin.movie.delete_button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              disabled={deletingMovie}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete "{movie.title}"?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the movie and all
                                its showtimes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteMovie(movie.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Showtimes Tab */}
        <TabsContent value="showtimes">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-xl">
              Showtimes ({showtimes.length})
            </h2>
            <Dialog
              open={showtimeDialogOpen}
              onOpenChange={setShowtimeDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  data-ocid="admin.add_showtime_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Showtime
                </Button>
              </DialogTrigger>
              <DialogContent
                data-ocid="admin.add_showtime.dialog"
                className="max-w-md"
              >
                <DialogHeader>
                  <DialogTitle>Add New Showtime</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                  <div>
                    <Label>Movie *</Label>
                    <Select
                      value={showtimeForm.movieId}
                      onValueChange={(v) =>
                        setShowtimeForm((p) => ({ ...p, movieId: v }))
                      }
                    >
                      <SelectTrigger data-ocid="admin.showtime.movie.select">
                        <SelectValue placeholder="Select a movie" />
                      </SelectTrigger>
                      <SelectContent>
                        {movies.map((m) => (
                          <SelectItem
                            key={m.id.toString()}
                            value={m.id.toString()}
                          >
                            {m.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="st-date">Date *</Label>
                      <Input
                        data-ocid="admin.showtime.date.input"
                        id="st-date"
                        type="date"
                        value={showtimeForm.date}
                        onChange={(e) =>
                          setShowtimeForm((p) => ({
                            ...p,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="st-time">Time *</Label>
                      <Input
                        data-ocid="admin.showtime.time.input"
                        id="st-time"
                        type="time"
                        value={showtimeForm.time}
                        onChange={(e) =>
                          setShowtimeForm((p) => ({
                            ...p,
                            time: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="st-hall">Hall *</Label>
                      <Input
                        data-ocid="admin.showtime.hall.input"
                        id="st-hall"
                        value={showtimeForm.hall}
                        onChange={(e) =>
                          setShowtimeForm((p) => ({
                            ...p,
                            hall: e.target.value,
                          }))
                        }
                        placeholder="Hall 1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="st-seats">Total Seats</Label>
                      <Input
                        data-ocid="admin.showtime.seats.input"
                        id="st-seats"
                        type="number"
                        value={showtimeForm.totalSeats}
                        onChange={(e) =>
                          setShowtimeForm((p) => ({
                            ...p,
                            totalSeats: e.target.value,
                          }))
                        }
                        placeholder="40"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="st-price">Price ($) *</Label>
                      <Input
                        data-ocid="admin.showtime.price.input"
                        id="st-price"
                        type="number"
                        value={showtimeForm.price}
                        onChange={(e) =>
                          setShowtimeForm((p) => ({
                            ...p,
                            price: e.target.value,
                          }))
                        }
                        placeholder="15"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    data-ocid="admin.add_showtime.cancel_button"
                    variant="outline"
                    onClick={() => setShowtimeDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    data-ocid="admin.add_showtime.submit_button"
                    onClick={handleAddShowtime}
                    disabled={addingShowtime}
                    className="bg-primary text-primary-foreground"
                  >
                    {addingShowtime ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Add Showtime
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {showtimesLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : showtimes.length === 0 ? (
            <div
              data-ocid="admin.showtimes.empty_state"
              className="text-center py-16 bg-card rounded-xl border border-border"
            >
              <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No showtimes added yet</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <Table data-ocid="admin.showtimes.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Movie</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Hall</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {showtimes.map((st, idx) => {
                    const stMovie = movies.find((m) => m.id === st.movieId);
                    return (
                      <TableRow
                        key={st.id.toString()}
                        data-ocid={`admin.showtimes.row.${idx + 1}`}
                      >
                        <TableCell className="font-medium">
                          {stMovie?.title || `Movie #${st.movieId.toString()}`}
                        </TableCell>
                        <TableCell>{st.date}</TableCell>
                        <TableCell>{st.time}</TableCell>
                        <TableCell>{st.hall}</TableCell>
                        <TableCell>{Number(st.totalSeats)}</TableCell>
                        <TableCell>${Number(st.price)}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                data-ocid={`admin.showtime.delete_button.${idx + 1}`}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                disabled={deletingShowtime}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete this showtime?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove this showtime.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteShowtime(st.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <h2 className="font-display font-bold text-xl mb-4">
            All Bookings ({bookings.length})
          </h2>
          {bookingsLoading ? (
            <Skeleton className="h-48 w-full rounded-xl" />
          ) : bookings.length === 0 ? (
            <div
              data-ocid="admin.bookings.empty_state"
              className="text-center py-16 bg-card rounded-xl border border-border"
            >
              <Ticket className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No bookings yet</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <Table data-ocid="admin.bookings.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Movie</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b, idx) => {
                    const bMovie = movies.find((m) => m.id === b.movieId);
                    return (
                      <TableRow
                        key={b.id.toString()}
                        data-ocid={`admin.bookings.row.${idx + 1}`}
                      >
                        <TableCell className="font-mono text-xs">
                          #{b.id.toString()}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {b.userId.toString().slice(0, 12)}…
                        </TableCell>
                        <TableCell>
                          {bMovie?.title || `#${b.movieId.toString()}`}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {b.seats.join(", ")}
                        </TableCell>
                        <TableCell>${Number(b.totalPrice)}</TableCell>
                        <TableCell>{b.bookingDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              b.status === "confirmed"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }
                          >
                            {b.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
