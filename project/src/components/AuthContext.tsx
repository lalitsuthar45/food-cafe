import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// =========================================================
// API URL
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pythonfastapi-production-f08a.up.railway.app";

// =========================================================
// TYPES
// =========================================================

export type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  currentUser: User | null;
  authLoading: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
};

// =========================================================
// CONTEXT
// =========================================================

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // =======================================================
  // VERIFY AUTHENTICATION ON APP LOAD / REFRESH
  // =======================================================

  useEffect(() => {
    const verifyAuthentication = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        localStorage.removeItem("user");
        setCurrentUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }

        const data = await response.json();

        if (!data || !data.user || !data.user.email) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setCurrentUser(null);
          setAuthLoading(false);
          return;
        }

        setCurrentUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.error(
          "Authentication verification failed:",
          error
        );

        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuthentication();
  }, []);

  // =======================================================
  // LOGIN - updates state IMMEDIATELY (no refresh needed)
  // =======================================================

  const login = (user: User, accessToken: string) => {
    localStorage.removeItem("isLoggedIn");
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  // =======================================================
  // LOGOUT
  // =======================================================

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, authLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================
// HOOK
// =========================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}