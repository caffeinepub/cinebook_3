import AccessControl "./authorization/access-control";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Prim "mo:prim";
import Runtime "mo:core/Runtime";

actor {
  // ---- Authorization ----
  let accessControlState : AccessControl.AccessControlState = AccessControl.initState();

  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) { Runtime.trap("CAFFEINE_ADMIN_TOKEN not set") };
      case (?adminToken) {
        AccessControl.initialize(accessControlState, caller, adminToken, userSecret);
      };
    };
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // ---- Types ----
  public type Movie = {
    id : Nat;
    title : Text;
    description : Text;
    genre : Text;
    duration : Nat;
    rating : Text;
    posterUrl : Text;
    isActive : Bool;
  };

  public type Showtime = {
    id : Nat;
    movieId : Nat;
    date : Text;
    time : Text;
    hall : Text;
    totalSeats : Nat;
    price : Nat;
  };

  public type Booking = {
    id : Nat;
    userId : Principal;
    showtimeId : Nat;
    movieId : Nat;
    seats : [Text];
    totalPrice : Nat;
    bookingDate : Text;
    status : Text;
  };

  // ---- State ----
  var nextMovieId : Nat = 1;
  var nextShowtimeId : Nat = 1;
  var nextBookingId : Nat = 1;
  var seeded : Bool = false;

  let movies = Map.empty<Nat, Movie>();
  let showtimes = Map.empty<Nat, Showtime>();
  let bookings = Map.empty<Nat, Booking>();
  let bookedSeats = Map.empty<Text, Bool>();

  // ---- Seed ----
  func seedData() {
    if (seeded) return;
    seeded := true;

    func addMovie(title : Text, desc : Text, genre : Text, dur : Nat, rating : Text, poster : Text) : Nat {
      let id = nextMovieId; nextMovieId += 1;
      movies.add(id, { id; title; description = desc; genre; duration = dur; rating; posterUrl = poster; isActive = true });
      id;
    };

    func addShow(mid : Nat, date : Text, time : Text, hall : Text, price : Nat) {
      let id = nextShowtimeId; nextShowtimeId += 1;
      showtimes.add(id, { id; movieId = mid; date; time; hall; totalSeats = 40; price });
    };

    let m1 = addMovie("Avengers: Endgame", "The Avengers assemble once more to undo the destruction caused by Thanos.", "Action", 181, "PG-13", "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400");
    addShow(m1, "2026-03-15", "10:00", "Hall A", 12); addShow(m1, "2026-03-16", "14:30", "Hall B", 14); addShow(m1, "2026-03-17", "19:00", "Hall C", 15);

    let m2 = addMovie("The Dark Knight", "Batman battles the chaotic Joker in the streets of Gotham City.", "Action", 152, "PG-13", "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400");
    addShow(m2, "2026-03-15", "13:00", "Hall B", 12); addShow(m2, "2026-03-16", "17:00", "Hall C", 14); addShow(m2, "2026-03-17", "21:00", "Hall A", 15);

    let m3 = addMovie("Inception", "A thief uses dream-sharing technology to plant an idea in a CEO's mind.", "Sci-Fi", 148, "PG-13", "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400");
    addShow(m3, "2026-03-15", "16:00", "Hall C", 13); addShow(m3, "2026-03-16", "10:00", "Hall A", 13); addShow(m3, "2026-03-17", "14:30", "Hall B", 15);

    let m4 = addMovie("Interstellar", "A team of explorers travel through a wormhole in search of a new home for humanity.", "Sci-Fi", 169, "PG", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400");
    addShow(m4, "2026-03-15", "19:30", "Hall A", 14); addShow(m4, "2026-03-16", "21:30", "Hall B", 14); addShow(m4, "2026-03-17", "10:00", "Hall C", 13);

    let m5 = addMovie("The Lion King", "Simba, a young lion prince, flees his kingdom only to learn the true meaning of responsibility.", "Animation", 88, "G", "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400");
    addShow(m5, "2026-03-15", "11:00", "Hall C", 10); addShow(m5, "2026-03-16", "13:00", "Hall A", 10); addShow(m5, "2026-03-17", "15:00", "Hall B", 10);
  };

  // ---- Movie APIs ----
  public query func getMovies() : async [Movie] {
    seedData();
    movies.toArray().map(func((_, m) : (Nat, Movie)) : Movie = m).filter(func(m : Movie) : Bool = m.isActive);
  };

  public query func getMovie(id : Nat) : async ?Movie {
    movies.get(id);
  };

  public shared ({ caller }) func addMovie(title : Text, description : Text, genre : Text, duration : Nat, rating : Text, posterUrl : Text) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    let id = nextMovieId; nextMovieId += 1;
    movies.add(id, { id; title; description; genre; duration; rating; posterUrl; isActive = true });
    id;
  };

  public shared ({ caller }) func updateMovie(id : Nat, title : Text, description : Text, genre : Text, duration : Nat, rating : Text, posterUrl : Text, isActive : Bool) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    switch (movies.get(id)) {
      case (null) false;
      case (?_) {
        movies.add(id, { id; title; description; genre; duration; rating; posterUrl; isActive });
        true;
      };
    };
  };

  public shared ({ caller }) func deleteMovie(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    switch (movies.get(id)) {
      case (null) false;
      case (?_) { movies.remove(id); true };
    };
  };

  // ---- Showtime APIs ----
  public query func getShowtimes(movieId : Nat) : async [Showtime] {
    showtimes.toArray().map(func((_, s) : (Nat, Showtime)) : Showtime = s).filter(func(s : Showtime) : Bool = s.movieId == movieId);
  };

  public query func getAllShowtimes() : async [Showtime] {
    showtimes.toArray().map(func((_, s) : (Nat, Showtime)) : Showtime = s);
  };

  public shared ({ caller }) func addShowtime(movieId : Nat, date : Text, time : Text, hall : Text, totalSeats : Nat, price : Nat) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    let id = nextShowtimeId; nextShowtimeId += 1;
    showtimes.add(id, { id; movieId; date; time; hall; totalSeats; price });
    id;
  };

  public shared ({ caller }) func deleteShowtime(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    switch (showtimes.get(id)) {
      case (null) false;
      case (?_) { showtimes.remove(id); true };
    };
  };

  // ---- Seat APIs ----
  func seatKey(showtimeId : Nat, seat : Text) : Text {
    showtimeId.toText() # "|" # seat;
  };

  public query func getBookedSeats(showtimeId : Nat) : async [Text] {
    let prefix = showtimeId.toText() # "|";
    bookedSeats.toArray()
      .filter(func((k, v) : (Text, Bool)) : Bool {
        v and k.startsWith(#text prefix);
      })
      .map(func((k, _) : (Text, Bool)) : Text {
        switch (k.stripStart(#text prefix)) {
          case (?s) s;
          case (null) k;
        };
      });
  };

  // ---- Booking APIs ----
  public shared ({ caller }) func createBooking(showtimeId : Nat, seats : [Text]) : async Nat {
    if (caller.isAnonymous()) Runtime.trap("Must be logged in");
    switch (showtimes.get(showtimeId)) {
      case (null) Runtime.trap("Showtime not found");
      case (?st) {
        for (seat in seats.vals()) {
          switch (bookedSeats.get(seatKey(showtimeId, seat))) {
            case (?true) Runtime.trap("Seat " # seat # " is already booked");
            case (_) {};
          };
        };
        for (seat in seats.vals()) {
          bookedSeats.add(seatKey(showtimeId, seat), true);
        };
        let id = nextBookingId; nextBookingId += 1;
        bookings.add(id, {
          id;
          userId = caller;
          showtimeId;
          movieId = st.movieId;
          seats;
          totalPrice = st.price * seats.size();
          bookingDate = "2026-03-11";
          status = "confirmed";
        });
        id;
      };
    };
  };

  public query ({ caller }) func getMyBookings() : async [Booking] {
    if (caller.isAnonymous()) return [];
    bookings.toArray().map(func((_, b) : (Nat, Booking)) : Booking = b).filter(func(b : Booking) : Bool = b.userId == caller);
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    bookings.toArray().map(func((_, b) : (Nat, Booking)) : Booking = b);
  };

  public shared ({ caller }) func cancelBooking(id : Nat) : async Bool {
    switch (bookings.get(id)) {
      case (null) false;
      case (?b) {
        if (b.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
        for (seat in b.seats.vals()) {
          bookedSeats.remove(seatKey(b.showtimeId, seat));
        };
        bookings.add(id, { b with status = "cancelled" });
        true;
      };
    };
  };

  public query ({ caller }) func getAdminStats() : async (Nat, Nat) {
    if (not AccessControl.isAdmin(accessControlState, caller)) Runtime.trap("Unauthorized");
    let allBookings = bookings.toArray().map(func((_, b) : (Nat, Booking)) : Booking = b);
    var revenue : Nat = 0;
    for (b in allBookings.vals()) {
      if (b.status == "confirmed") revenue += b.totalPrice;
    };
    (allBookings.size(), revenue);
  };
};
