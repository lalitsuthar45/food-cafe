import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleLogin,
  type CredentialResponse,
} from "@react-oauth/google";

import { useAuth } from "./AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pythonfastapi-production-f08a.up.railway.app";

type UserData = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

function Loginpage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // SAVE AUTHENTICATION
  // Ab ye AuthContext ke login() ko call karta hai, jo
  // turant currentUser state update kar deta hai — isliye
  // /home pe navigate karte hi ProtectedRoute ko pata rehta
  // hai ki user logged in hai (no bounce-back, no refresh
  // needed).
  // =====================================================

  const saveUser = (
    user: UserData,
    accessToken: string,
    message: string
  ) => {
    login(user, accessToken);

    alert(message);

    navigate("/home", { replace: true });
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) {
      alert("Google login failed");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Google login failed");
        return;
      }

      if (!data.access_token) {
        alert("Authentication token not received");
        return;
      }

      saveUser(
        data.user,
        data.access_token,
        data.message || "Google Login Successful"
      );
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Invalid email or password");
        return;
      }

      if (!data.access_token) {
        alert("Authentication token not received");
        return;
      }

      saveUser(
        data.user,
        data.access_token,
        data.message || "Login successful"
      );
    } catch (error) {
      console.error("Login Error:", error);
      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-orange-500 to-amber-600 p-10 text-white">
          <h1 className="text-5xl font-bold mb-4">Savory Haven</h1>

          <p className="text-lg mb-8">
            Fresh food, fast delivery and delicious taste at your
            doorstep.
          </p>

          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
            alt="Food"
            className="rounded-2xl shadow-lg h-72 object-cover"
          />
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-orange-600 mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-500 mb-8">
            Login to order your favorite food
          </p>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="email"
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
            className="w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
          />

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-orange-600 text-white py-3 rounded-xl font-semibold transition ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-orange-700"
            }`}
          >
            {loading ? "Logging in..." : "Login & Order Now"}
          </button>

          {/* OR */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="text-sm text-gray-500">OR</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>

          {/* GOOGLE */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google login failed")}
            />
          </div>

          {/* REGISTER */}
          <p className="text-center text-sm text-gray-600 mt-6">
            New to Savory Haven?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              disabled={loading}
              className="text-orange-600 font-semibold disabled:opacity-50"
            >
              Create Account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Loginpage;