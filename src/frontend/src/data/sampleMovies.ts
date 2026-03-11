import type { Movie } from "../backend.d";

export const SAMPLE_MOVIES: Movie[] = [
  {
    id: BigInt(1),
    title: "Stellar Horizon",
    description:
      "A lone astronaut ventures beyond the edge of the known galaxy, discovering an ancient alien civilization that holds the key to humanity's survival. A breathtaking journey through time, space, and the human spirit.",
    genre: "Sci-Fi",
    duration: BigInt(148),
    rating: "8.7",
    posterUrl: "/assets/generated/movie-stellar-horizon.dim_400x600.jpg",
    isActive: true,
  },
  {
    id: BigInt(2),
    title: "The Last Cipher",
    description:
      "A cryptographer is pulled into a deadly web of international espionage after decoding a message that was never meant to be found. Every clue leads deeper into a conspiracy that could unravel the world order.",
    genre: "Thriller",
    duration: BigInt(122),
    rating: "8.2",
    posterUrl: "/assets/generated/movie-last-cipher.dim_400x600.jpg",
    isActive: true,
  },
  {
    id: BigInt(3),
    title: "Ember Crown",
    description:
      "In a kingdom consumed by war and betrayal, a disgraced queen must reclaim her throne using ancient fire magic she swore never to use again. An epic tale of sacrifice, power, and redemption.",
    genre: "Fantasy",
    duration: BigInt(162),
    rating: "8.5",
    posterUrl: "/assets/generated/movie-ember-crown.dim_400x600.jpg",
    isActive: true,
  },
  {
    id: BigInt(4),
    title: "Midnight Requiem",
    description:
      "A jazz musician in 1940s New Orleans discovers his late father's secret life as a resistance fighter, leading him on an emotional quest across war-torn Europe to uncover the truth.",
    genre: "Drama",
    duration: BigInt(135),
    rating: "8.0",
    posterUrl: "",
    isActive: true,
  },
  {
    id: BigInt(5),
    title: "Neon Phantom",
    description:
      "In a rain-soaked cyberpunk metropolis, a street hacker teams up with a rogue AI to expose a megacorporation harvesting memories from the city's sleeping citizens.",
    genre: "Action",
    duration: BigInt(118),
    rating: "7.9",
    posterUrl: "",
    isActive: true,
  },
  {
    id: BigInt(6),
    title: "The Cartographer",
    description:
      "Two rival explorers race to map an uncharted island in the 1800s, only to discover the island's indigenous people have been mapping them all along in a profound meditation on discovery and colonialism.",
    genre: "Adventure",
    duration: BigInt(140),
    rating: "8.3",
    posterUrl: "",
    isActive: true,
  },
];

export const GENRES = [
  "All",
  "Action",
  "Adventure",
  "Drama",
  "Fantasy",
  "Sci-Fi",
  "Thriller",
  "Comedy",
  "Horror",
  "Romance",
];
