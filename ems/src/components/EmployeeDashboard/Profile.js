import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

const Profile = () => {
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
        <span className="text-xl text-red-400">Unable to load profile</span>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-100">My Profile</h2>

      <div className="bg-[#242b35] rounded-xl shadow-lg overflow-hidden border border-gray-700/50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-24 md:h-32"></div>

        <div className="px-4 md:px-8 pb-6 md:pb-8">
          {/* Profile Picture */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 md:-mt-16 mb-6">
            <img
              src={
                employee.userId?.profileImage
                  ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${employee.userId.profileImage}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      employee.userId?.name || "User"
                    )}&background=0D8ABC&color=fff&size=200`
              }
              alt={employee.userId?.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#242b35] shadow-lg object-cover"
            />
            <div className="sm:ml-6 mt-3 sm:mt-0 sm:pb-2 text-center sm:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-gray-100">{employee.userId?.name}</h3>
              <p className="text-sm md:text-base text-gray-400">{employee.designation || "Employee"}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-400">Employee ID</p>
                  <p className="font-semibold text-gray-200">{employee.employeeId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-semibold text-gray-200">{employee.userId?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaBriefcase className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-400">Department</p>
                  <p className="font-semibold text-gray-200">{employee.department?.dep_name || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-400">Gender</p>
                  <p className="font-semibold text-gray-200">{employee.gender || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-400">Date of Birth</p>
                  <p className="font-semibold text-gray-200">
                    {employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-400">Marital Status</p>
                  <p className="font-semibold text-gray-200">{employee.maritalStatus || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h4 className="text-xl font-bold mb-4 text-gray-100">Employment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Designation</p>
                <p className="font-semibold text-lg text-gray-200">{employee.designation || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Salary</p>
                <p className="font-semibold text-lg text-gray-200">${employee.salary?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Joined Date</p>
                <p className="font-semibold text-lg text-gray-200">
                  {employee.createdAt
                    ? new Date(employee.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
