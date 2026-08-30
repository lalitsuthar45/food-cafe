import {
  Suspense,
  lazy,
  useEffect,
  useState,
} from "react";

import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MenuSection from "./components/MenuSection";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Loginpage from "./components/Loginpage";
import Registerpage from "./components/Registerpage";

import type { CartItem } from "./components/FullMenu";


// =========================================================
// LAZY COMPONENTS
// =========================================================

const FullMenu = lazy(() => import("./components/FullMenu"));
const CartPage = lazy(() => import("./components/CartPage"));
const Profile = lazy(() => import("./components/Profile"));
const Reservation = lazy(() => import("./components/Reservation"));
const MyOrders = lazy(() => import("./components/MyOrders"));

const AdminDashboard = lazy(
  () => import("./components/AdminDashboard")
);

const AdminOrders = lazy(
  () => import("./components/AdminOrders")
);

const AdminReservations = lazy(
  () => import("./components/AdminReservations")
);


// =========================================================
// API URL
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pythonfastapi-production-f08a.up.railway.app";


// =========================================================
// TYPES
// =========================================================

type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

type HomePageProps = {
  cartItems: CartItem[];

  setCartItems: React.Dispatch<
    React.SetStateAction<CartItem[]>
  >;

  isMenuOpen: boolean;
};


// =========================================================
// PAGE LOADER
// =========================================================

function PageLoader() {
  return (
    <div className="min-h-screen pt-24 px-4 bg-orange-50 dark:bg-slate-950">

      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">

        <div className="h-10 w-56 rounded-xl bg-orange-200 dark:bg-slate-800" />

        <div className="grid md:grid-cols-3 gap-6">

          <div className="h-56 rounded-3xl bg-orange-100 dark:bg-slate-800" />

          <div className="h-56 rounded-3xl bg-orange-100 dark:bg-slate-800" />

          <div className="h-56 rounded-3xl bg-orange-100 dark:bg-slate-800" />

        </div>

      </div>

    </div>
  );
}


// =========================================================
// SCROLL TO TOP
// =========================================================

function ScrollToTop() {

  const location = useLocation();

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }, [location.pathname]);

  return null;
}


// =========================================================
// HOME PAGE
// =========================================================

function HomePage({
  cartItems,
  setCartItems,
  isMenuOpen,
}: HomePageProps) {

  return (

    <main
      className={`page-transition pt-16 transition-transform duration-300 ${
        isMenuOpen
          ? "translate-x-64"
          : "translate-x-0"
      }`}
    >

      <Hero />

      <MenuSection
        cartItems={cartItems}
        setCartItems={setCartItems}
      />

      <About />

      <Gallery />

      <Contact />

    </main>
  );
}


// =========================================================
// PUBLIC ROUTE
// =========================================================

function PublicRoute({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User | null;
}) {

  if (currentUser) {

    return (
      <Navigate
        to="/home"
        replace
      />
    );

  }

  return <>{children}</>;
}


// =========================================================
// PROTECTED ROUTE
// =========================================================

function ProtectedRoute({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User | null;
}) {

  if (!currentUser) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }

  return <>{children}</>;
}


// =========================================================
// ADMIN ROUTE
// =========================================================

function AdminRoute({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User | null;
}) {

  // Login required
  if (!currentUser) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  // Admin required
  if (currentUser.role !== "admin") {

    return (
      <Navigate
        to="/home"
        replace
      />
    );

  }

  return <>{children}</>;
}


// =========================================================
// APP
// =========================================================

function App() {

  // =======================================================
  // GLOBAL CART
  // =======================================================

  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);


  // =======================================================
  // AUTH STATE
  // =======================================================

  const [currentUser, setCurrentUser] =
    useState<User | null>(null);


  const [authLoading, setAuthLoading] =
    useState(true);


  // =======================================================
  // MOBILE MENU
  // =======================================================

  const [isMenuOpen] =
    useState(false);


  // =======================================================
  // VERIFY AUTHENTICATION
  // =======================================================

  useEffect(() => {

    const verifyAuthentication = async () => {

      const token =
        localStorage.getItem("access_token");


      // No token
      if (!token) {

        localStorage.removeItem("user");

        setCurrentUser(null);

        setAuthLoading(false);

        return;
      }


      try {

        const response = await fetch(
          `${API_URL}/me`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        // Token invalid / expired
        if (!response.ok) {

          localStorage.removeItem(
            "access_token"
          );

          localStorage.removeItem(
            "user"
          );

          setCurrentUser(null);

          setAuthLoading(false);

          return;
        }


        const data =
          await response.json();


        if (
          !data ||
          !data.user ||
          !data.user.email
        ) {

          localStorage.removeItem(
            "access_token"
          );

          localStorage.removeItem(
            "user"
          );

          setCurrentUser(null);

          setAuthLoading(false);

          return;
        }


        // Valid authenticated user
        setCurrentUser(data.user);


        // Update local user data
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

      } catch (error) {

        console.error(
          "Authentication verification failed:",
          error
        );

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user"
        );

        setCurrentUser(null);

      } finally {

        setAuthLoading(false);

      }

    };


    verifyAuthentication();

  }, []);


  // =======================================================
  // SHOW LOADING WHILE AUTH IS BEING VERIFIED
  // =======================================================

  if (authLoading) {

    return <PageLoader />;

  }


  // =======================================================
  // ROUTES
  // =======================================================

  return (

    <>

      <ScrollToTop />

      <Suspense
        fallback={<PageLoader />}
      >

        <Routes>


          {/* =================================================
              LOGIN
          ================================================= */}

          <Route
            path="/"
            element={

              <PublicRoute
                currentUser={currentUser}
              >

                <Loginpage />

              </PublicRoute>

            }
          />


          {/* =================================================
              REGISTER
          ================================================= */}

          <Route
            path="/register"
            element={

              <PublicRoute
                currentUser={currentUser}
              >

                <Registerpage />

              </PublicRoute>

            }
          />


          {/* =================================================
              HOME
          ================================================= */}

          <Route
            path="/home"
            element={

              <ProtectedRoute
                currentUser={currentUser}
              >

                <>

                  <Navbar
                    cartItems={cartItems}
                  />

                  <HomePage
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    isMenuOpen={isMenuOpen}
                  />

                </>

              </ProtectedRoute>

            }
          />


          {/* =================================================
              FULL MENU
          ================================================= */}

          <Route
            path="/fullmenu"
            element={

              <ProtectedRoute
                currentUser={currentUser}
              >

                <>

                  <Navbar
                    cartItems={cartItems}
                  />

                  <FullMenu
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />

                </>

              </ProtectedRoute>

            }
          />


          {/* =================================================
              CART
          ================================================= */}

          <Route
            path="/cart"
            element={

              <ProtectedRoute
                currentUser={currentUser}
              >

                <>

                  <Navbar
                    cartItems={cartItems}
                  />

                  <CartPage
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />

                </>

              </ProtectedRoute>

            }
          />


          {/* =================================================
              PROFILE
          ================================================= */}

          <Route
            path="/profile"
            element={

              <ProtectedRoute
                currentUser={currentUser}
              >

                <>

                  <Navbar
                    cartItems={cartItems}
                  />

                  <Profile />

                </>

              </ProtectedRoute>

            }
          />


          {/* =================================================
              MY ORDERS
          ================================================= */}

          <Route
            path="/orders"
            element={

              <ProtectedRoute
                currentUser={currentUser}
              >

                <>

                  <Navbar
                    cartItems={cartItems}
                  />

                  <MyOrders />

                </>

              </ProtectedRoute>

            }
          />


          {/* =================================================
              RESERVATION
          ================================================= */}

          <Route
            path="/reservation"
            element={

              <ProtectedRoute
                currentUser={currentUser}
              >

                <>

                  <Navbar
                    cartItems={cartItems}
                  />

                  <Reservation />

                </>

              </ProtectedRoute>

            }
          />


          {/* =================================================
              ADMIN DASHBOARD
          ================================================= */}

          <Route
            path="/admin"
            element={

              <AdminRoute
                currentUser={currentUser}
              >

                <AdminDashboard />

              </AdminRoute>

            }
          />


          {/* =================================================
              ADMIN ORDERS
          ================================================= */}

          <Route
            path="/admin/orders"
            element={

              <AdminRoute
                currentUser={currentUser}
              >

                <AdminOrders />

              </AdminRoute>

            }
          />


          {/* =================================================
              ADMIN RESERVATIONS
          ================================================= */}

          <Route
            path="/admin/reservations"
            element={

              <AdminRoute
                currentUser={currentUser}
              >

                <AdminReservations />

              </AdminRoute>

            }
          />


          {/* =================================================
              UNKNOWN URL
          ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </Suspense>

    </>

  );
}


export default App;