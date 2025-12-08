// src/components/employees/AddEmployee.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { showToast } from "../../utils/toast";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    designation: "",
    department: "",
    salary: "",
    role: "",
    password: "",
    profileImage: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get("/api/department", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success) setDepartments(data.departments);
      } catch (err) {
        console.error("Could not load departments", err);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setForm((f) => ({ ...f, profileImage: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Build FormData
    const data = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val != null) data.append(key, val);
    });

    try {
      const res = await axios.post("/api/employee/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        navigate("/admin-dashboard/employees");
      } else {
        showToast.error(res.data.error);
      }
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      if (validationErrors && typeof validationErrors === "object") {
        console.groupCollapsed("🛑 Add employee validation errors");
        Object.entries(validationErrors).forEach(([field, { message }]) => {
          console.error(`${field}: ${message}`);
        });
        console.groupEnd();
        showToast.error("Validation errors - check console for details");
      } else {
        console.error("Add employee error:", err);
        const errorMessage = err.response?.data?.error || err.response?.data?.message || "Failed to add employee. Please check if Employee ID already exists.";
        showToast.error(errorMessage);
      }

      const msg =
        err.response?.data?.error ||
        Object.values(validationErrors || {})
          .map((e) => e.message)
          .join(", ") ||
        "Server error";
      showToast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = "mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out";
  const labelClasses = "block text-sm font-medium text-gray-300";

  return (
    <div className="max-w-4xl mx-auto mt-20 bg-[#242b35] p-8 rounded-3xl shadow-2xl border border-gray-700/50">
      <h2 className="text-2xl font-bold mb-6 text-gray-100">Add New Employee</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Name */}
        <div>
          <label className={labelClasses}>Name</label>
          <input
            name="name"
            type="text"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
        {/* Email */}
        <div>
          <label className={labelClasses}>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
        {/* Employee ID */}
        <div>
          <label className={labelClasses}>Employee ID</label>
          <input
            name="employeeId"
            type="text"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
        {/* Date of Birth */}
        <div>
          <label className={labelClasses}>Date of Birth</label>
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
        {/* Gender */}
        <div>
          <label className={labelClasses}>Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className={inputClasses}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
        {/* Marital Status */}
        <div>
          <label className={labelClasses}>Marital Status</label>
          <select
            name="maritalStatus"
            value={form.maritalStatus}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select Status</option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
          </select>
        </div>
        {/* Designation */}
        <div>
          <label className={labelClasses}>Designation</label>
          <input
            name="designation"
            type="text"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        {/* Department */}
        <div>
          <label className={labelClasses}>Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.dep_name}
              </option>
            ))}
          </select>
        </div>
        {/* Salary */}
        <div>
          <label className={labelClasses}>Salary</label>
          <input
            name="salary"
            type="number"
            placeholder="Salary In USD"
            value={form.salary}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        {/* Role */}
        <div>
          <label className={labelClasses}>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className={inputClasses}
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        {/* Password */}
        <div>
          <label className={labelClasses}>Password</label>
          <input
            name="password"
            type="password"
            placeholder="******"
            value={form.password}
            onChange={handleChange}
            required
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
            title="Must be at least 8 characters, and include uppercase, lowercase, number & special character"
            className={inputClasses}
          />
        </div>
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Profile Image
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            <label
              htmlFor="profileImage"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
            >
              Choose Image
            </label>
            {form.profileImage && (
              <span className="text-sm text-gray-400">
                {form.profileImage.name}
              </span>
            )}
          </div>
        </div>
        {/* Submit & Back */}
        <div className="md:col-span-3 flex justify-center items-center space-x-6 mt-6">
          <Link
            to="/admin-dashboard/employees"
            className="text-blue-400 hover:text-blue-300 hover:underline focus:outline-none transition-all duration-200 ease-in-out"
          >
            ← Back to Employees
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#242b35] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting ? "Adding…" : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
