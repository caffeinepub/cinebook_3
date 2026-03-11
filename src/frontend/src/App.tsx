import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import { AdminPage } from "./pages/AdminPage";
import { BookingConfirmationPage } from "./pages/BookingConfirmationPage";
import { HomePage } from "./pages/HomePage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { SeatSelectionPage } from "./pages/SeatSelectionPage";
import { ShowTimingsPage } from "./pages/ShowTimingsPage";

// Root layout
function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const movieRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/movie/$movieId",
  component: MovieDetailPage,
});

const seatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/seats/$showtimeId",
  component: SeatSelectionPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/booking/$bookingId",
  component: BookingConfirmationPage,
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-bookings",
  component: MyBookingsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const showTimingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/showtimes",
  component: ShowTimingsPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  movieRoute,
  seatsRoute,
  bookingRoute,
  myBookingsRoute,
  adminRoute,
  showTimingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
