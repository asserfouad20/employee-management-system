// src/components/departments/EditDepartment.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { showToast } from "../../utils/toast";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (data.success) {
          setDepartment({
            dep_name: data.department.dep_name,
            description: data.department.description || "",
          });
        } else {
          showToast.error(data.error);
        }
      } catch (err) {
        console.error(err);
        showToast.error("Error loading department");
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/department/${id}`,
        department,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (data.success) {
        navigate("/admin-dashboard/departments");
      } else {
        showToast.error(data.error);
      }
    } catch (err) {
      console.error(err);
      showToast.error("Update failed");
    }
  };

  if (loading) {
    return <div className="pt-5 text-center text-gray-300">Loading…</div>;
  }

  const inputClasses = "mt-1 block w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out";
  const labelClasses = "block font-medium mb-1 text-gray-300";

  return (
    <div className="max-w-md mx-auto mt-32 p-6 bg-[#242b35] rounded-xl shadow-2xl border border-gray-700/50">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Edit Department</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="dep_name" className={labelClasses}>
            Department Name
          </label>
          <input
            id="dep_name"
            name="dep_name"
            type="text"
            value={department.dep_name}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="description" className={labelClasses}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={department.description}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#242b35]"
        >
          Update
        </button>
        <Link
          to="/admin-dashboard/departments"
          className="block mt-4 text-start text-blue-400 hover:text-blue-300 hover:underline transition-all duration-200 ease-in-out"
        >
          ← Back to Departments
        </Link>
      </form>
    </div>
  );
};

export default EditDepartment;
