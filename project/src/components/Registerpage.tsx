import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  GoogleLogin,
  type CredentialResponse,
} from "@react-oauth/google";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pythonfastapi-production-f08a.up.railway.app";


type UserData = {
  id: number;
  name: string;
  email: string;
  role?: string;
};


function Registerpage() {

  const navigate = useNavigate();


  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
    });


  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // SAVE AUTHENTICATION
  // =====================================================

  const saveUser = (
    user: UserData,
    accessToken: string,
    message: string
  ) => {

    // Remove old authentication flag
    localStorage.removeItem(
      "isLoggedIn"
    );


    // Save JWT
    localStorage.setItem(
      "access_token",
      accessToken
    );


    // Save user
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );


    alert(message);


    navigate(
      "/home",
      {
        replace: true,
      }
    );

  };


  // =====================================================
  // GOOGLE LOGIN / REGISTER
  // =====================================================

  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ) => {

    if (
      !credentialResponse.credential
    ) {

      alert(
        "Google login failed: No token received"
      );

      return;
    }


    setLoading(true);


    try {

      const response =
        await fetch(
          `${API_URL}/google-login`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              token:
                credentialResponse.credential,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        alert(
          data.detail ||
          "Google login failed"
        );

        return;
      }


      if (!data.access_token) {

        alert(
          "Authentication token not received"
        );

        return;
      }


      saveUser(
        data.user,
        data.access_token,
        data.message ||
          "Google Login Successful"
      );

    } catch (error) {

      console.error(
        "Google Login Error:",
        error
      );

      alert(
        "Unable to connect to server"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };


  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();


    const name =
      formData.name.trim();


    const email =
      formData.email.trim();


    const password =
      formData.password;


    if (
      !name ||
      !email ||
      !password
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }


    if (password.length < 6) {

      alert(
        "Password must be at least 6 characters"
      );

      return;
    }


    setLoading(true);


    try {

      const response =
        await fetch(
          `${API_URL}/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        alert(
          data.detail ||
          "Registration failed"
        );

        return;
      }


      if (!data.access_token) {

        alert(
          "Registration successful, but authentication token was not received."
        );

        return;
      }


      saveUser(
        data.user,
        data.access_token,
        data.message ||
          "Registration successful"
      );

    } catch (error) {

      console.error(
        "Register Error:",
        error
      );

      alert(
        "Unable to connect to server"
      );

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


        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-red-500 to-orange-600 p-10 text-white">

          <h1 className="text-5xl font-bold mb-4">
            Join Savory Haven
          </h1>


          <p className="text-lg mb-8">
            Create your account and enjoy
            tasty meals anytime.
          </p>


          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            alt="Food"
            className="rounded-2xl shadow-lg h-72 object-cover"
          />

        </div>


        {/* =================================================
            REGISTER FORM
        ================================================= */}

        <form
          onSubmit={handleRegister}
          className="p-8 md:p-12"
        >

          <h2 className="text-3xl font-bold text-orange-600 mb-2">
            Create Account
          </h2>


          <p className="text-gray-500 mb-8">
            Register and start ordering food
          </p>


          {/* NAME */}

          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            autoComplete="name"
            required
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
          />


          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            autoComplete="email"
            required
            className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
          />


          {/* PASSWORD */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
            required
            className="w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
          />


          {/* REGISTER BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-orange-600 text-white py-3 rounded-xl font-semibold transition ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-orange-700"
            }`}
          >

            {loading
              ? "Registering..."
              : "Register & Enter Website"}

          </button>


          {/* OR */}

          <div className="my-5 flex items-center gap-3">

            <div className="h-px bg-gray-300 flex-1" />

            <span className="text-sm text-gray-500">
              OR
            </span>

            <div className="h-px bg-gray-300 flex-1" />

          </div>


          {/* GOOGLE */}

          <div className="flex justify-center">

            <GoogleLogin
              onSuccess={
                handleGoogleLogin
              }
              onError={() =>
                alert(
                  "Google login failed"
                )
              }
            />

          </div>


          {/* LOGIN */}

          <p className="text-center text-sm text-gray-600 mt-6">

            Already have an account?{" "}

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              disabled={loading}
              className="text-orange-600 font-semibold disabled:opacity-50"
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