import { Suspense, lazy, useEffect, useState } from "react";
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
// ADMIN EMAILS LIST (Sirf ye emails admin access kar sakti hain)
// =========================================================
const ADMIN_EMAILS = [
  "lalitbhardwaj@gmail.com",
  // Apna admin email yahan add karein:
  // "youradmin@gmail.com",
];

type HomePageProps = {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<
    React.SetStateAction<CartItem[]>
  >;
  isMenuOpen: boolean;
};

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
// HELPER: Safely get logged-in user from localStorage
// =========================================================
function getAuthUser(): { id: number; name: string; email: string } | null {
  try {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    if (!user || !user.email) return null;

    return user;
  } catch {
    // Agar localStorage corrupt hai toh clean karo
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    return null;
  }
}

// =========================================================
// PUBLIC ROUTE: Logged-in user ko Login/Register nahi dikhega
// =========================================================
function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getAuthUser();

  // Agar already logged in hai toh Home par bhejo
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

// =========================================================
// PROTECTED ROUTE: Bina login kiye koi page nahi khulega
// =========================================================
function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getAuthUser();

  // Agar login nahi hai ya user data invalid hai -> Login page
  if (!user) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// =========================================================
// ADMIN ROUTE: Login + Admin Email dono check hote hain
// =========================================================
function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getAuthUser();

  // 1. Agar login hi nahi hai -> Login page par bhejo
  if (!user) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  // 2. Agar logged in hai lekin Admin nahi hai -> Home par bhejo
  if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return <Navigate to="/home" replace />;
  }

  // 3. Admin hai -> Panel kholo
  return <>{children}</>;
}

function App() {
  // ==========================================
  // GLOBAL CART STATE
  // ==========================================

  const [cartItems, setCartItems] = useState<CartItem[]>(
    []
  );

  // Navbar/mobile menu state
  const [isMenuOpen] = useState(false);

  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* =========================
              LOGIN (Public Only)
          ========================= */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Loginpage />
              </PublicRoute>
            }
          />

          {/* =========================
              REGISTER (Public Only)
          ========================= */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Registerpage />
              </PublicRoute>
            }
          />

          {/* =========================
              HOME
          ========================= */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />

                  <HomePage
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    isMenuOpen={isMenuOpen}
                  />
                </>
              </ProtectedRoute>
            }
          />

          {/* =========================
              FULL MENU
          ========================= */}
          <Route
            path="/fullmenu"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />

                  <FullMenu
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                </>
              </ProtectedRoute>
            }
          />

          {/* =========================
              CART
          ========================= */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />

                  <CartPage
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                </>
              </ProtectedRoute>
            }
          />

          {/* =========================
              PROFILE
          ========================= */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />

                  <Profile />
                </>
              </ProtectedRoute>
            }
          />

          {/* =========================
              MY ORDERS
          ========================= */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />

                  <MyOrders />
                </>
              </ProtectedRoute>
            }
          />

          {/* =========================
              RESERVATION
          ========================= */}
          <Route
            path="/reservation"
            element={
              <ProtectedRoute>
                <>
                  <Navbar cartItems={cartItems} />

                  <Reservation />
                </>
              </ProtectedRoute>
            }
          />

          {/* =========================
              ADMIN DASHBOARD (Admin Only)
          ========================= */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* =========================
              ADMIN ORDERS (Admin Only)
          ========================= */}
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          {/* =========================
              ADMIN RESERVATIONS (Admin Only)
          ========================= */}
          <Route
            path="/admin/reservations"
            element={
              <AdminRoute>
                <AdminReservations />
              </AdminRoute>
            }
          />

          {/* =========================
              UNKNOWN ROUTE -> Login
          ========================= */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </Suspense>
    </>
  );
}

export default App;