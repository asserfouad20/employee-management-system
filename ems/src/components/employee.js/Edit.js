import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { showToast } from "../../utils/toast";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [employee, setEmployee] = useState({
    name: "",
    maritalStatus: "",
    designation: "",
    salary: 0,
    department: "",
  });

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const { data } = await axios.get("/api/department", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success) setDepartments(data.departments);
      } catch (err) {
        console.error("Could not load departments", err);
      }
    };
    getDepartments();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await axios.get(
          `/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (data.success) {
          const employee = data.employee;
          setEmployee((prev) => ({
            ...prev,
            name: employee.userId.name,
            maritalStatus: employee.maritalStatus,
            designation: employee.designation,
            salary: employee.salary,
            department: employee.department,
          }));
        } else {
          showToast.error(data.error || "Failed to load employee");
        }
      } catch (err) {
        console.error("Error loading employee:", err);
        showToast.error("Server error while loading employee");
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "department") {
      const fullDep = departments.find((d) => d._id === value) || null;
      setEmployee((prev) => ({ ...prev, department: fullDep }));
    } else if (name === "role") {
      // update inside userId
      setEmployee((prev) => ({
        ...prev,
        userId: {
          ...prev.userId,
          role: value,
        },
      }));
    } else {
      setEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.put(`/api/employee/${id}`, employee, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        navigate("/admin-dashboard/employees");
      } else {
        showToast.error(res.data.error);
      }
    } catch (err) {
      console.error("Update employee error:", err);
      showToast.error(err.response?.data?.error || "Server error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = "mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out";
  const labelClasses = "block text-sm font-medium text-gray-300";

  return (
    <div className="max-w-4xl mx-auto mt-8 md:mt-20 bg-[#242b35] p-4 md:p-8 rounded-3xl shadow-2xl border border-gray-700/50">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-100">Edit Employee</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {/* Name */}
        <div>
          <label className={labelClasses}>
            Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Enter Name"
            value={employee.name}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>

        {/* Marital Status */}
        <div>
          <label className={labelClasses}>
            Marital Status
          </label>
          <select
            name="maritalStatus"
            value={employee.maritalStatus}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">Select Status</option>
            <option>Single</option>
            <option>Married</option>
          </select>
        </div>

        {/* Designation */}
        <div>
          <label className={labelClasses}>
            Designation
          </label>
          <input
            required
            name="designation"
            type="text"
            placeholder="Designation"
            value={employee.designation}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        {/* Salary */}
        <div>
          <label className={labelClasses}>
            Salary
          </label>
          <input
            required
            name="salary"
            type="number"
            placeholder="Salary In USD"
            value={employee.salary}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        {/* Department */}
        <div className="md:col-span-2 lg:col-span-2">
          <label className={labelClasses}>
            Department
          </label>
          <select
            required
            name="department"
            value={employee.department?._id || ""}
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

        {/* Submit & Back */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row justify-center items-center gap-4 sm:space-x-6 sm:gap-0 mt-6">
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
            {submitting ? "Updating…" : "Update Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
