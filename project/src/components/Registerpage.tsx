import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

const API_URL = "http://10.201.230.252:8000";

type UserData = {
  id: number;
  name: string;
  email: string;
};

function Registerpage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Register failed");
        return;
      }

      saveUser(data.user, data.message || "Registration successful");
    } catch {
      alert("Backend server not running");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-red-500 to-orange-600 p-10 text-white">
          <h1 className="text-5xl font-bold mb-4">Join Savory Haven</h1>
          <p className="text-lg mb-8">
            Create your account and enjoy tasty meals anytime.
          </p>
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            alt="Food"
            className="rounded-2xl shadow-lg h-72 object-cover"
          />
        </div>

        <form onSubmit={handleRegister} className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-orange-600 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500 mb-8">Register and start ordering food</p>

          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
          >
            Register & Enter Website
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
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-orange-600 font-semibold"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registerpage;