// src/components/employees/AddSalary.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { showToast } from "../../utils/toast";

export default function AddSalary() {
  const { id } = useParams();
  const navigate = useNavigate();

  // For dropdowns
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Form fields
  const [form, setForm] = useState({
    department: "",
    employee: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    payDate: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // 1️⃣ Load departments
  useEffect(() => {
    axios
      .get("/api/department", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(({ data }) => {
        if (data.success) setDepartments(data.departments);
      })
      .catch((err) => console.error("Could not load departments", err));
  }, []);

  // 2️⃣ When department changes, fetch its employees
  const handleDepartment = async (e) => {
    const depId = e.target.value;
    // reset the form’s employee picker
    setForm((f) => ({ ...f, department: depId, employee: "" }));
    // clear the old list while loading
    setEmployees([]);

    try {
      // still hits your existing endpoint
      const { data } = await axios.get("/api/employee", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (data.success) {
        // only keep those whose populated .department._id matches
        const filtered = data.employees.filter(
          (emp) => emp.department && emp.department._id === depId
        );
        setEmployees(filtered);
      }
    } catch (err) {
      console.error("Could not load employees for dept", err);
    }
  };

  // 3️⃣ Handle any other form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // 4️⃣ Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.post("/api/salary/add", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        navigate("/admin-dashboard/employees");
      } else {
        showToast.error(res.data.error);
      }
    } catch (err) {
      console.error("Add salary error:", err);
      showToast.error(err.response?.data?.error || "Server error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = "mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out";
  const labelClasses = "block text-sm font-medium text-gray-300";

  return (
    <div className="max-w-4xl mx-auto mt-8 md:mt-20 bg-[#242b35] p-4 md:p-8 rounded-3xl shadow-2xl border border-gray-700/50">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-100">Add Salary</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {/* Department */}
        <div>
          <label className={labelClasses}>
            Department
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleDepartment}
            required
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

        {/* Employee */}
        <div>
          <label className={labelClasses}>
            Employee
          </label>
          <select
            name="employee"
            value={form.employee}
            onChange={handleChange}
            required
            className={inputClasses}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.userId.name} ({emp.employeeId})
              </option>
            ))}
          </select>
        </div>

        {/* Basic Salary */}
        <div>
          <label className={labelClasses}>
            Basic Salary
          </label>
          <input
            name="basicSalary"
            type="number"
            placeholder="Basic Salary"
            value={form.basicSalary}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>

        {/* Allowances */}
        <div>
          <label className={labelClasses}>
            Allowances
          </label>
          <input
            name="allowances"
            type="number"
            placeholder="Allowances"
            value={form.allowances}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>

        {/* Deductions */}
        <div>
          <label className={labelClasses}>
            Deductions
          </label>
          <input
            name="deductions"
            type="number"
            placeholder="Deductions"
            value={form.deductions}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>

        {/* Pay Date */}
        <div>
          <label className={labelClasses}>
            Pay Date
          </label>
          <input
            name="payDate"
            type="date"
            value={form.payDate}
            onChange={handleChange}
            required
            className={inputClasses}
          />
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
            {submitting ? "Saving…" : "Save Salary"}
          </button>
        </div>
      </form>
    </div>
  );
}
