// src/components/attendance/AttendanceReport.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const AttendanceReport = () => {
  const [reportData, setReportData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [filters, setFilters] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/api/employee", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.employeeId) params.append("employeeId", filters.employeeId);
      params.append("month", filters.month);
      params.append("year", filters.year);

      const response = await axios.get(
        `/api/attendance/report?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setReportData(response.data);
      }
      setLoading(false);
    } catch (error) {
      setToast({
        show: true,
        message: "Failed to generate report",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const getStatusBadge = (status) => {
    const badges = {
      Present: "bg-green-100 text-green-800 border-green-300",
      Absent: "bg-red-100 text-red-800 border-red-300",
      Late: "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Half-Day": "bg-blue-100 text-blue-800 border-blue-300",
      "Work from Home": "bg-purple-100 text-purple-800 border-purple-300",
      "On Leave": "bg-gray-100 text-gray-800 border-gray-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          badges[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const columns = [
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true,
      width: "120px",
    },
    {
      name: "Employee ID",
      selector: (row) => row.employee?.employeeId || "N/A",
      sortable: true,
    },
    {
      name: "Employee Name",
      selector: (row) => row.employee?.userId?.name || "N/A",
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.employee?.department?.dep_name || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => getStatusBadge(row.status),
      sortable: true,
    },
    {
      name: "Time In",
      selector: (row) => row.timeIn || "-",
    },
    {
      name: "Time Out",
      selector: (row) => row.timeOut || "-",
    },
    {
      name: "Working Hours",
      selector: (row) =>
        row.workingHours ? `${row.workingHours.toFixed(1)}h` : "-",
    },
  ];

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="p-6">
      {toast.show && (
        <div
          className={`fixed top-0 left-0 sm:top-4 sm:left-4 lg:top-6 lg:left-6 z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-2 rounded opacity-100`}
        >
          {toast.message}
        </div>
      )}

      <div className="bg-[#242b35] rounded-xl shadow-lg p-6 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">
          Attendance Report
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Employee
            </label>
            <select
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
              className="w-full bg-[#1a1f26] border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.employeeId} - {emp.userId?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Month
            </label>
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="w-full bg-[#1a1f26] border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Year</label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="w-full bg-[#1a1f26] border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchReport}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#242b35]"
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {reportData && reportData.summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <div className="bg-[#1a1f26] rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm font-medium">Total Days</p>
              <p className="text-2xl font-bold text-gray-100">
                {reportData.summary.totalDays}
              </p>
            </div>

            <div className="bg-[#1a1f26] rounded-lg p-4 border border-green-700/50">
              <p className="text-green-400 text-sm font-medium">Present</p>
              <p className="text-2xl font-bold text-green-300">
                {reportData.summary.present}
              </p>
            </div>

            <div className="bg-[#1a1f26] rounded-lg p-4 border border-red-700/50">
              <p className="text-red-400 text-sm font-medium">Absent</p>
              <p className="text-2xl font-bold text-red-300">
                {reportData.summary.absent}
              </p>
            </div>

            <div className="bg-[#1a1f26] rounded-lg p-4 border border-yellow-700/50">
              <p className="text-yellow-400 text-sm font-medium">Late</p>
              <p className="text-2xl font-bold text-yellow-300">
                {reportData.summary.late}
              </p>
            </div>

            <div className="bg-[#1a1f26] rounded-lg p-4 border border-blue-700/50">
              <p className="text-blue-400 text-sm font-medium">Half-Day</p>
              <p className="text-2xl font-bold text-blue-300">
                {reportData.summary.halfDay}
              </p>
            </div>

            <div className="bg-[#1a1f26] rounded-lg p-4 border border-purple-700/50">
              <p className="text-purple-400 text-sm font-medium">WFH</p>
              <p className="text-2xl font-bold text-purple-300">
                {reportData.summary.wfh}
              </p>
            </div>

            <div className="bg-[#1a1f26] rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm font-medium">On Leave</p>
              <p className="text-2xl font-bold text-gray-100">
                {reportData.summary.onLeave}
              </p>
            </div>

            <div className="bg-[#1a1f26] rounded-lg p-4 border border-blue-700/50">
              <p className="text-blue-400 text-sm font-medium">Total Hours</p>
              <p className="text-2xl font-bold text-blue-300">
                {reportData.summary.totalWorkingHours.toFixed(1)}h
              </p>
            </div>
          </div>
        )}

        {/* Data Table */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-400">Generating report...</p>
          </div>
        ) : reportData && reportData.records ? (
          <DataTable
            columns={columns}
            data={reportData.records}
            pagination
            responsive
            customStyles={{
              table: {
                style: {
                  backgroundColor: "#242b35",
                  color: "#e5e7eb",
                },
              },
              headRow: {
                style: {
                  backgroundColor: "#1a1f26",
                  borderBottom: "2px solid #374151",
                  minHeight: "52px",
                },
              },
              headCells: {
                style: {
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#9ca3af",
                },
              },
              rows: {
                style: {
                  backgroundColor: "#242b35",
                  borderBottom: "1px solid #374151",
                  color: "#e5e7eb",
                  "&:hover": {
                    backgroundColor: "#2d3748",
                  },
                },
              },
              cells: {
                style: {
                  color: "#e5e7eb",
                },
              },
              pagination: {
                style: {
                  backgroundColor: "#1a1f26",
                  borderTop: "1px solid #374151",
                  color: "#e5e7eb",
                },
                pageButtonsStyle: {
                  fill: "#9ca3af",
                  "&:hover": {
                    fill: "#3b82f6",
                  },
                },
              },
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-48">
            <p className="text-gray-400 mb-2">No report generated yet</p>
            <p className="text-gray-500 text-sm">
              Select filters and click "Generate Report"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;
