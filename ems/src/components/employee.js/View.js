// src/components/employees/View.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { showToast } from "../../utils/toast";

const View = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setEmployee(data.employee);
        } else {
          showToast.error(data.error || "Failed to load employee");
        }
      } catch (err) {
        console.error("Error loading employee:", err);
        showToast.error("Server error while loading employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-2xl font-bold text-gray-300">Loading…</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="pt-10 text-center text-red-400">Employee not found.</div>
    );
  }

  return (
    <div className="pt-5 px-6 space-y-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f1419]"
      >
        <FaArrowLeft className="mr-2" />
        Back to Employees
      </button>

      {/* Details card */}
      <div className="max-w-3xl mx-auto bg-[#242b35] p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-100">
          Employee Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Image */}
          <div className="flex justify-center items-center">
            <img
              src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${employee.userId.profileImage}`}
              alt={employee.userId.name}
              className="h-64 w-52 rounded-full object-cover"
            />
          </div>

          {/* Details List */}
          <div className="space-y-4">
            <div className="flex space-x-3">
              <p className="text-lg font-bold text-gray-300">Name:</p>
              <p className="font-medium text-gray-200">{employee.userId.name}</p>
            </div>

            <div className="flex space-x-3">
              <p className="text-lg font-bold text-gray-300">Employee ID:</p>
              <p className="font-medium text-gray-200">{employee.employeeId}</p>
            </div>
            <div className="flex space-x-3">
              <p className="text-lg font-bold text-gray-300">Department:</p>
              <p className="font-medium text-gray-200">{employee.department.dep_name}</p>
            </div>
            <div className="flex space-x-3">
              <p className="text-lg font-bold text-gray-300">Designation:</p>
              <p className="font-medium text-gray-200">{employee.designation}</p>
            </div>
            <div className="flex space-x-3">
              <p className="text-lg font-bold text-gray-300">Salary In USD:</p>
              <p className="font-medium text-gray-200">${employee.salary.toLocaleString()}</p>
            </div>
            <div className="flex space-x-3">
              <p className="text-lg font-bold text-gray-300">Date Of Birth:</p>
              <p className="font-medium text-gray-200">
                {new Date(employee.dob).toLocaleDateString()}
              </p>
            </div>

            <div className="flex space-x-3">
              <p className="text-lg font-bold text-gray-300">Gender:</p>
              <p className="font-medium text-gray-200">{employee.gender}</p>
            </div>

            <div className="flex space-x-3">
              <p className="text-lg font-bold text-gray-300">Marital Status:</p>
              <p className="font-medium text-gray-200">{employee.maritalStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
