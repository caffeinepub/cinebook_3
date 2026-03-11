import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Booking, Movie, Showtime } from "../backend.d";
import { useActor } from "./useActor";

export function useMovies() {
  const { actor, isFetching } = useActor();
  return useQuery<Movie[]>({
    queryKey: ["movies"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMovies();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMovie(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Movie | null>({
    queryKey: ["movie", id?.toString()],
    queryFn: async (): Promise<Movie | null> => {
      if (!actor || id === null) return null;
      const result = await actor.getMovie(id);
      return result.length > 0 ? (result[0] as Movie) : null;
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useShowtimes(movieId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Showtime[]>({
    queryKey: ["showtimes", movieId?.toString()],
    queryFn: async () => {
      if (!actor || movieId === null) return [];
      return actor.getShowtimes(movieId);
    },
    enabled: !!actor && !isFetching && movieId !== null,
  });
}

export function useAllShowtimes() {
  const { actor, isFetching } = useActor();
  return useQuery<Showtime[]>({
    queryKey: ["allShowtimes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShowtimes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookedSeats(showtimeId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["bookedSeats", showtimeId?.toString()],
    queryFn: async () => {
      if (!actor || showtimeId === null) return [];
      return actor.getBookedSeats(showtimeId);
    },
    enabled: !!actor && !isFetching && showtimeId !== null,
  });
}

export function useMyBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["myBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminStats() {
  const { actor, isFetching } = useActor();
  return useQuery<[bigint, bigint]>({
    queryKey: ["adminStats"],
    queryFn: async (): Promise<[bigint, bigint]> => {
      if (!actor) return [BigInt(0), BigInt(0)];
      return actor.getAdminStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<bigint, Error, { showtimeId: bigint; seats: string[] }>({
    mutationFn: async ({ showtimeId, seats }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createBooking(showtimeId, seats);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookedSeats"] });
    },
  });
}

export function useCancelBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (bookingId) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.cancelBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });
}

export function useAddMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    bigint,
    Error,
    {
      title: string;
      description: string;
      genre: string;
      duration: bigint;
      rating: string;
      posterUrl: string;
    }
  >({
    mutationFn: async ({
      title,
      description,
      genre,
      duration,
      rating,
      posterUrl,
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addMovie(
        title,
        description,
        genre,
        duration,
        rating,
        posterUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}

export function useUpdateMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    boolean,
    Error,
    {
      id: bigint;
      title: string;
      description: string;
      genre: string;
      duration: bigint;
      rating: string;
      posterUrl: string;
      isActive: boolean;
    }
  >({
    mutationFn: async ({
      id,
      title,
      description,
      genre,
      duration,
      rating,
      posterUrl,
      isActive,
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateMovie(
        id,
        title,
        description,
        genre,
        duration,
        rating,
        posterUrl,
        isActive,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}

export function useDeleteMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteMovie(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}

export function useAddShowtime() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    bigint,
    Error,
    {
      movieId: bigint;
      date: string;
      time: string;
      hall: string;
      totalSeats: bigint;
      price: bigint;
    }
  >({
    mutationFn: async ({ movieId, date, time, hall, totalSeats, price }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addShowtime(movieId, date, time, hall, totalSeats, price);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allShowtimes"] });
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
  });
}

export function useDeleteShowtime() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteShowtime(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allShowtimes"] });
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
  });
}
