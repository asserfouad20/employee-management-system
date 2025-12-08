import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaMoneyBill,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";
import axios from "axios";

const AdminSummary = () => {
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    monthlySalary: 0,
    leaves: {
      applied: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/dashboard/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setSummary(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-xl text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Overview */}
      <h3 className="text-2xl font-bold text-gray-100 mb-2">Dashboard Overview</h3>
      <p className="text-gray-400 mb-6">Key metrics and statistics</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <SummaryCard
          icon={<FaUser />}
          text="Total Employees"
          number={summary.totalEmployees}
          color="bg-blue-600"
        />
        <SummaryCard
          icon={<FaBuilding />}
          text="Total Departments"
          number={summary.totalDepartments}
          color="bg-purple-600"
        />
        <SummaryCard
          icon={<FaMoneyBill />}
          text="Monthly Salary"
          number={`$${summary.monthlySalary.toLocaleString()}`}
          color="bg-indigo-600"
        />
      </div>

      {/* Leave Details */}
      <div className="mt-12">
        <h4 className="text-center text-2xl font-bold text-gray-100 mb-2">Leave Details</h4>
        <p className="text-center text-gray-400 mb-6">Current leave status overview</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <SummaryCard
            icon={<FaFileAlt />}
            text="Leave Applied"
            number={summary.leaves.applied}
            color="bg-blue-600"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            text="Leave Approved"
            number={summary.leaves.approved}
            color="bg-green-600"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text="Leave Pending"
            number={summary.leaves.pending}
            color="bg-yellow-600"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Leave Rejected"
            number={summary.leaves.rejected}
            color="bg-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
