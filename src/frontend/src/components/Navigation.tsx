import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { Film, LogIn, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export function Navigation() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const currentPath = router.state.location.pathname;

  const navLinks = [
    { label: "Home", to: "/", ocid: "nav.home_link" },
    ...(isLoggedIn
      ? [
          {
            label: "My Bookings",
            to: "/my-bookings",
            ocid: "nav.mybookings_link",
          },
        ]
      : []),
    ...(isAdmin
      ? [{ label: "Admin", to: "/admin", ocid: "nav.admin_link" }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
              <Film className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              Cine<span className="text-primary">Book</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={link.ocid}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && (
              <span className="text-xs text-muted-foreground">
                {identity?.getPrincipal().toString().slice(0, 10)}…
              </span>
            )}
            <Button
              data-ocid="nav.login_button"
              variant={isLoggedIn ? "outline" : "default"}
              size="sm"
              onClick={isLoggedIn ? clear : login}
              disabled={isLoggingIn}
              className={
                isLoggedIn
                  ? ""
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Connecting…
                </span>
              ) : isLoggedIn ? (
                <span className="flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </span>
              )}
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid={link.ocid}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPath === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                data-ocid="nav.login_button"
                variant={isLoggedIn ? "outline" : "default"}
                size="sm"
                onClick={() => {
                  isLoggedIn ? clear() : login();
                  setMobileOpen(false);
                }}
                disabled={isLoggingIn}
                className={`mt-1 ${isLoggedIn ? "" : "bg-primary text-primary-foreground"}`}
              >
                {isLoggedIn ? "Sign Out" : "Sign In"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
