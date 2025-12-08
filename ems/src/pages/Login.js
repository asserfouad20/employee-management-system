// src/pages/Login.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"; // adjust this import to wherever your hook lives

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  // Load saved credentials on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem("rememberedCredentials");
    if (savedCredentials) {
      try {
        const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      } catch (e) {
        console.error("Failed to load saved credentials:", e);
      }
    }
  }, []);

  // Handle clearing saved credentials when user unchecks "Remember Me"
  const handleRememberMeChange = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);

    // If unchecking, immediately remove saved credentials
    if (!isChecked) {
      localStorage.removeItem("rememberedCredentials");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log({ email, password });

      const { data } = await axios.post("/api/auth/login", { email, password });

      if (data.success) {
        // 1) Handle "Remember Me" functionality
        if (rememberMe) {
          // Save credentials to localStorage
          localStorage.setItem(
            "rememberedCredentials",
            JSON.stringify({ email, password })
          );
        } else {
          // Remove saved credentials if "Remember Me" is unchecked
          localStorage.removeItem("rememberedCredentials");
        }

        // 2) update auth context
        login(data.user);

        // 3) persist the JWT
        localStorage.setItem("token", data.token);

        // 4) show success toast
        setToast({
          show: true,
          message: "Logged in successfully!",
          type: "success",
        });

        // 5) redirect based on role
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      } else {
        // fallback if success===false
        setToast({ show: true, message: "Login failed", type: "error" });
      }
    } catch (error) {
      const msg = error.response?.data?.error || "Login failed";
      setToast({ show: true, message: msg, type: "error" });
    }
  };

  useEffect(() => {
    if (toast.show) {
      const id = setTimeout(
        () => setToast((t) => ({ ...t, show: false })),
        3000
      );
      return () => clearTimeout(id);
    }
  }, [toast.show]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1f26] to-[#0f1419] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      {/* Toast */}
      {toast.show && (
        <div
          className={`
            fixed top-0 left-0 sm:top-4 sm:left-4 lg:top-6 lg:left-6 z-50
            transform transition-transform transition-opacity duration-300 ease-out
            ${
              toast.show
                ? "translate-x-0 translate-y-0 opacity-90"
                : "-translate-x-full -translate-y-full opacity-0"
            }
            ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}
            text-white px-4 py-2 rounded
            text-sm sm:text-base
          `}
        >
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-100 font-bold mb-6 sm:mb-8 text-center drop-shadow-lg">
          Employee Management System
        </h1>

        {/* Card */}
        <div className="bg-[#242b35] shadow-2xl rounded-3xl px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 border border-gray-700/50">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 text-center mb-4 sm:mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or ID */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-300 mb-1 sm:mb-2 font-medium"
              >
                Email or Employee ID
              </label>
              <input
                id="email"
                type="text"
                placeholder="Enter Email or Employee ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-3xl px-3 py-2 text-sm sm:text-base ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-300 mb-1 sm:mb-2 font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                pattern=".{4,}"
                title="Password must be at least 4 characters"
                required
                className="w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-3xl px-3 py-2 text-sm sm:text-base ring-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out outline-none"
              />
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
              <label className="inline-flex items-center text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="form-checkbox h-4 w-4 text-blue-600 bg-[#1a1f26] border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="ml-2 text-sm sm:text-base">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm sm:text-base text-blue-400 hover:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#242b35] rounded px-2 py-1"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-3xl font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#242b35]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
