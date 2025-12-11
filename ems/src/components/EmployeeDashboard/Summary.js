import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaMoneyBillWave, FaBuilding, FaCalendarAlt } from "react-icons/fa";

const Summary = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const { data } = await axios.get("/api/employee/detail", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success) {
          setEmployee(data.employee);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-3xl font-bold text-gray-300">Loading...</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl text-red-400">Unable to load employee data</span>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-100">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-[#242b35] border border-gray-700/50 rounded-xl shadow-lg p-4 md:p-6 flex items-center space-x-3 md:space-x-4">
          <div className="bg-blue-600/20 p-3 md:p-4 rounded-full border border-blue-600/30">
            <FaUser className="text-blue-400 text-xl md:text-2xl" />
          </div>
          <div>
            <p className="text-gray-400 text-xs md:text-sm">Employee ID</p>
            <p className="text-xl md:text-2xl font-bold text-gray-100">{employee.employeeId}</p>
          </div>
        </div>

        <div className="bg-[#242b35] border border-gray-700/50 rounded-xl shadow-lg p-4 md:p-6 flex items-center space-x-3 md:space-x-4">
          <div className="bg-green-600/20 p-3 md:p-4 rounded-full border border-green-600/30">
            <FaMoneyBillWave className="text-green-400 text-xl md:text-2xl" />
          </div>
          <div>
            <p className="text-gray-400 text-xs md:text-sm">Salary</p>
            <p className="text-xl md:text-2xl font-bold text-gray-100">${employee.salary?.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-[#242b35] border border-gray-700/50 rounded-xl shadow-lg p-4 md:p-6 flex items-center space-x-3 md:space-x-4">
          <div className="bg-purple-600/20 p-3 md:p-4 rounded-full border border-purple-600/30">
            <FaBuilding className="text-purple-400 text-xl md:text-2xl" />
          </div>
          <div>
            <p className="text-gray-400 text-xs md:text-sm">Department</p>
            <p className="text-lg md:text-xl font-bold text-gray-100">{employee.department?.dep_name || "N/A"}</p>
          </div>
        </div>

        <div className="bg-[#242b35] border border-gray-700/50 rounded-xl shadow-lg p-4 md:p-6 flex items-center space-x-3 md:space-x-4">
          <div className="bg-orange-600/20 p-3 md:p-4 rounded-full border border-orange-600/30">
            <FaCalendarAlt className="text-orange-400 text-xl md:text-2xl" />
          </div>
          <div>
            <p className="text-gray-400 text-xs md:text-sm">Designation</p>
            <p className="text-lg md:text-xl font-bold text-gray-100">{employee.designation || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#242b35] border border-gray-700/50 rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-100">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <p className="text-gray-400 text-sm">Full Name</p>
            <p className="text-lg font-semibold text-gray-200">{employee.userId?.name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-lg font-semibold text-gray-200">{employee.userId?.email}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Date of Birth</p>
            <p className="text-lg font-semibold text-gray-200">
              {employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Gender</p>
            <p className="text-lg font-semibold text-gray-200">{employee.gender || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Marital Status</p>
            <p className="text-lg font-semibold text-gray-200">{employee.maritalStatus || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
