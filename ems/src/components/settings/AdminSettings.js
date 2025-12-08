import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaLock,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaEdit,
} from "react-icons/fa";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("password");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Company Info State
  const [companyData, setCompanyData] = useState(() => {
    // Load from localStorage if available, otherwise use defaults
    const saved = localStorage.getItem("companyInfo");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved company info:", e);
      }
    }
    return {
      companyName: "TechVision Solutions Inc.",
      address: "1234 Innovation Drive, Suite 500\nSan Francisco, CA 94105\nUnited States",
      phone: "+1 (415) 555-0123",
      email: "info@techvisionsolutions.com",
      website: "https://www.techvisionsolutions.com",
    };
  });
  const [companyLoading, setCompanyLoading] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companySaved, setCompanySaved] = useState(true);

  // Leave Types State
  const [leaveTypes, setLeaveTypes] = useState(() => {
    // Load from localStorage if available, otherwise use defaults
    const saved = localStorage.getItem("leaveTypesConfig");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved leave types:", e);
      }
    }
    return [
      { type: "Sick Leave", maxDays: 10, enabled: true },
      { type: "Casual Leave", maxDays: 12, enabled: true },
      { type: "Annual Leave", maxDays: 20, enabled: true },
      { type: "Maternity Leave", maxDays: 90, enabled: true },
      { type: "Paternity Leave", maxDays: 15, enabled: true },
    ];
  });
  const [isEditingLeaveTypes, setIsEditingLeaveTypes] = useState(false);
  const [leaveTypesSaved, setLeaveTypesSaved] = useState(true);

  useEffect(() => {
    if (toast.show) {
      const id = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
      return () => clearTimeout(id);
    }
  }, [toast.show]);

  // Password Change Handlers
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({
        show: true,
        message: "New password and confirm password do not match",
        type: "error",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setToast({
        show: true,
        message: "New password must be at least 6 characters long",
        type: "error",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/auth/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setToast({
          show: true,
          message: "Password changed successfully!",
          type: "success",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setToast({
        show: true,
        message: error.response?.data?.error || "Failed to change password",
        type: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Company Info Handlers
  const handleCompanyChange = (e) => {
    setCompanyData({
      ...companyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setCompanyLoading(true);

    try {
      // Save to localStorage for persistence
      localStorage.setItem("companyInfo", JSON.stringify(companyData));

      // Simulate API call delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      setToast({
        show: true,
        message: "Company information saved successfully!",
        type: "success",
      });
      setIsEditingCompany(false);
      setCompanySaved(true);
    } catch (error) {
      console.error("Error saving company info:", error);
      setToast({
        show: true,
        message: "Failed to save company information",
        type: "error",
      });
    } finally {
      setCompanyLoading(false);
    }
  };

  // Leave Types Handlers
  const handleLeaveTypeChange = (index, field, value) => {
    const updatedLeaveTypes = [...leaveTypes];
    updatedLeaveTypes[index][field] = value;
    setLeaveTypes(updatedLeaveTypes);
    setLeaveTypesSaved(false); // Mark as unsaved when changes are made
  };

  const handleLeaveTypesSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save to localStorage for persistence
      localStorage.setItem("leaveTypesConfig", JSON.stringify(leaveTypes));

      // Simulate API call delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      setToast({
        show: true,
        message: "Leave types configuration saved successfully!",
        type: "success",
      });
      setIsEditingLeaveTypes(false);
      setLeaveTypesSaved(true);
    } catch (error) {
      console.error("Error saving leave types:", error);
      setToast({
        show: true,
        message: "Failed to save leave types configuration",
        type: "error",
      });
    }
  };

  return (
    <div className="p-6 relative">
      {/* Toast */}
      {toast.show && (
        <div
          className={`
            fixed top-0 left-0 sm:top-4 sm:left-4 lg:top-6 lg:left-6 z-50
            transform transition-transform transition-opacity duration-300 ease-out
            ${
              toast.show
                ? "translate-x-0 translate-y-0 opacity-100"
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

      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Admin Settings</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
            activeTab === "password"
              ? "text-blue-400 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-blue-400"
          }`}
        >
          <FaLock />
          Change Password
        </button>
        <button
          onClick={() => setActiveTab("company")}
          className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
            activeTab === "company"
              ? "text-blue-400 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-blue-400"
          }`}
        >
          <FaBuilding />
          Company Info
        </button>
        <button
          onClick={() => setActiveTab("leave")}
          className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
            activeTab === "leave"
              ? "text-blue-400 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-blue-400"
          }`}
        >
          <FaCalendarAlt />
          Leave Types
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-[#242b35] rounded-xl shadow-lg p-8 border border-gray-700/50">
        {/* Password Change Tab */}
        {activeTab === "password" && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-100 mb-6 text-center">
              Change Admin Password
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  placeholder="Enter current password"
                />
              </div>

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
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

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
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className={`w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                    passwordLoading
                      ? "opacity-50 cursor-not-allowed transform-none"
                      : ""
                  }`}
                >
                  {passwordLoading ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            </form>

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
        )}

        {/* Company Info Tab */}
        {activeTab === "company" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-100">
                Company Information
              </h3>
              {!isEditingCompany && companySaved && (
                <button
                  onClick={() => setIsEditingCompany(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <FaEdit />
                  Edit
                </button>
              )}
            </div>

            {!isEditingCompany && companySaved ? (
              // View Mode
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name
                  </label>
                  <p className="px-4 py-3 bg-[#1a1f26] border border-gray-700/50 rounded-lg text-gray-200">
                    {companyData.companyName}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <p className="px-4 py-3 bg-[#1a1f26] border border-gray-700/50 rounded-lg text-gray-200 whitespace-pre-line">
                    {companyData.address}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <p className="px-4 py-3 bg-[#1a1f26] border border-gray-700/50 rounded-lg text-gray-200">
                    {companyData.phone}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <p className="px-4 py-3 bg-[#1a1f26] border border-gray-700/50 rounded-lg text-gray-200">
                    {companyData.email}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website
                  </label>
                  <p className="px-4 py-3 bg-[#1a1f26] border border-gray-700/50 rounded-lg text-gray-200">
                    {companyData.website || "Not specified"}
                  </p>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleCompanySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={companyData.companyName}
                  onChange={handleCompanyChange}
                  required
                  className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  placeholder="Enter company name"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={companyData.address}
                  onChange={handleCompanyChange}
                  required
                  rows="3"
                  className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  placeholder="Enter company address"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={companyData.phone}
                  onChange={handleCompanyChange}
                  required
                  className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={companyData.email}
                  onChange={handleCompanyChange}
                  required
                  className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  placeholder="Enter email address"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={companyData.website}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
                  placeholder="https://example.com"
                />
              </div>

              <div className="md:col-span-2 pt-4 flex gap-4">
                <button
                  type="submit"
                  disabled={companyLoading}
                  className={`flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                    companyLoading
                      ? "opacity-50 cursor-not-allowed transform-none"
                      : ""
                  }`}
                >
                  {companyLoading ? "Saving..." : "Save Company Information"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingCompany(false)}
                  className="px-6 bg-gray-600 text-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
            )}
          </div>
        )}

        {/* Leave Types Tab */}
        {activeTab === "leave" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-100">
                Configure Leave Types
              </h3>
              {!isEditingLeaveTypes && leaveTypesSaved && (
                <button
                  onClick={() => setIsEditingLeaveTypes(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <FaEdit />
                  Edit
                </button>
              )}
            </div>

            {!isEditingLeaveTypes && leaveTypesSaved ? (
              // View Mode
              <div className="space-y-4">
                {leaveTypes.map((leave, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg ${
                      leave.enabled
                        ? "border-blue-600/30 bg-blue-600/10"
                        : "border-gray-700/50 bg-[#1a1f26]"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          leave.enabled ? "bg-blue-500" : "bg-gray-600"
                        }`}
                      />
                      <div>
                        <p className="text-lg font-semibold text-gray-200">
                          {leave.type}
                        </p>
                        <p className="text-sm text-gray-400">
                          {leave.enabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-400">
                        {leave.maxDays}
                      </p>
                      <p className="text-sm text-gray-400">days/year</p>
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">
                    Note:
                  </h4>
                  <p className="text-sm text-gray-300">
                    Disabled leave types will not appear in the employee leave application
                    form. Maximum days per year defines the limit for each leave type.
                  </p>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleLeaveTypesSubmit} className="space-y-4">
              <div className="space-y-4">
                {leaveTypes.map((leave, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-700/50 rounded-lg hover:border-blue-500 transition-colors bg-[#1a1f26]"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={leave.enabled}
                        onChange={(e) =>
                          handleLeaveTypeChange(index, "enabled", e.target.checked)
                        }
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300">
                        Leave Type
                      </label>
                      <input
                        type="text"
                        value={leave.type}
                        onChange={(e) =>
                          handleLeaveTypeChange(index, "type", e.target.value)
                        }
                        disabled={!leave.enabled}
                        className="mt-1 block w-full bg-[#242b35] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out disabled:bg-gray-800 disabled:text-gray-600"
                      />
                    </div>

                    <div className="w-40">
                      <label className="block text-sm font-medium text-gray-300">
                        Max Days/Year
                      </label>
                      <input
                        type="number"
                        value={leave.maxDays}
                        onChange={(e) =>
                          handleLeaveTypeChange(
                            index,
                            "maxDays",
                            parseInt(e.target.value) || 0
                          )
                        }
                        disabled={!leave.enabled}
                        min="1"
                        className="mt-1 block w-full bg-[#242b35] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out disabled:bg-gray-800 disabled:text-gray-600"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  Save Leave Configuration
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingLeaveTypes(false)}
                  className="px-6 bg-gray-600 text-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">
                  Note:
                </h4>
                <p className="text-sm text-gray-300">
                  Disabled leave types will not appear in the employee leave application
                  form. Maximum days per year defines the limit for each leave type.
                </p>
              </div>
            </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
