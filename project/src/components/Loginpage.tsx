import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

const API_URL = " http://10.44.113.252:8000";

type UserData = {
  id: number;
  name: string;
  email: string;
};

function Loginpage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const saveUser = (user: UserData, message: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(user));
    alert(message);
    window.location.href = "/home";
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      alert("Google login failed");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Google login failed");
        return;
      }

      saveUser(data.user, data.message || "Google Login Successful");
    } catch {
      alert("Backend server not running");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Invalid email or password");
        return;
      }

      saveUser(data.user, data.message || "Login successful");
    } catch {
      alert("Backend server not running");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-orange-500 to-amber-600 p-10 text-white">
          <h1 className="text-5xl font-bold mb-4">Savory Haven</h1>
          <p className="text-lg mb-8">
            Fresh food, fast delivery and delicious taste at your doorstep.
          </p>
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
            alt="Food"
            className="rounded-2xl shadow-lg h-72 object-cover"
          />
        </div>

        <form onSubmit={handleLogin} className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-orange-600 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-8">Login to order your favorite food</p>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
          >
            Login & Order Now
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google login failed")}
            />
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            New to Savory Haven?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-orange-600 font-semibold"
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