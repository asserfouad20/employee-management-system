import React, { useState } from "react";
import axios from "axios";
import { FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Settings = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New password and confirm password do not match",
      });
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "New password must be at least 6 characters long",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/employee/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Password changed successfully! You can now login with your new password.",
        });
        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-[#242b35] rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-2">
          <FaLock className="text-2xl md:text-3xl text-blue-400" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-100">Settings</h2>
        </div>
        <p className="text-sm md:text-base text-gray-400">Manage your account security settings</p>
      </div>

      {/* Change Password Form */}
      <div className="bg-[#242b35] rounded-lg shadow-md p-4 md:p-6 border border-gray-700/50">
        <h3 className="text-lg md:text-xl font-semibold text-gray-100 mb-4">
          Change Password
        </h3>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-600/20 text-green-400 border border-green-600/30"
                : "bg-red-600/20 text-red-400 border border-red-600/30"
            }`}
          >
            {message.type === "success" ? (
              <FaCheckCircle className="text-xl" />
            ) : (
              <FaExclamationCircle className="text-xl" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
              placeholder="Enter current password"
            />
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
              placeholder="Enter new password (min. 6 characters)"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
              placeholder="Confirm new password"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                loading
                  ? "opacity-50 cursor-not-allowed transform-none"
                  : ""
              }`}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-[#1a1f26] border border-gray-700/50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            Password Requirements:
          </h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Minimum 6 characters long</li>
            <li>• Use a unique password you haven't used before</li>
            <li>• Don't share your password with anyone</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
