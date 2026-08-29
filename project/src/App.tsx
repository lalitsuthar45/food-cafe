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

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  if (user.email !== "admin@savoryhaven.com") {
    return <Navigate to="/home" replace />;
  }

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
              LOGIN
          ========================= */}
          <Route
            path="/"
            element={<Loginpage />}
          />

          {/* =========================
              REGISTER
          ========================= */}
          <Route
            path="/register"
            element={<Registerpage />}
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
              ADMIN DASHBOARD
          ========================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* =========================
              ADMIN ORDERS
          ========================= */}
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* =========================
              ADMIN RESERVATIONS
          ========================= */}
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminReservations />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* =========================
              UNKNOWN ROUTE
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
