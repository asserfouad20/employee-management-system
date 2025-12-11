import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ← import useNavigate
import axios from "axios"; // ← import axios
import { showToast } from "../../utils/toast";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← actually call it
    try {
      const response = await axios.post(
        "/api/department/add",
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.error || "Something went wrong";
      showToast.error(msg);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 md:mt-40 bg-[#242b35] p-4 md:p-8 rounded-2xl shadow-2xl w-full max-w-md md:w-96 border border-gray-700/50">
      <h2 className="text-center text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-100">
        Add New Department
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Department Name */}
        <div className="mb-4">
          <label
            htmlFor="dep_name"
            className="block text-sm font-medium text-gray-300"
          >
            Department Name
          </label>
          <input
            id="dep_name"
            name="dep_name"
            type="text"
            placeholder="Enter Dept Name"
            value={department.dep_name}
            onChange={handleChange}
            className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Description"
            value={department.description}
            onChange={handleChange}
            className="mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#242b35]"
        >
          Add Department
        </button>

        {/* Back Link */}
        <Link
          to="/admin-dashboard/departments"
          className="inline-block mt-4 text-blue-400 hover:text-blue-300 hover:underline"
        >
          ← Back to Departments
        </Link>
      </form>
    </div>
  );
};

export default AddDepartment;
