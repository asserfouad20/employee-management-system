// src/components/attendance/Attendance.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { showToast } from "../../utils/toast";

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
    timeIn: "",
    timeOut: "",
    remarks: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAttendance();
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

  useEffect(() => {
    const filtered = attendanceRecords.filter((record) => {
      const employeeName = record.employee?.userId?.name?.toLowerCase() || "";
      const employeeId = record.employee?.employeeId?.toLowerCase() || "";
      const status = record.status?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return (
        employeeName.includes(search) ||
        employeeId.includes(search) ||
        status.includes(search)
      );
    });
    setFilteredRecords(filtered);
  }, [searchTerm, attendanceRecords]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get("/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAttendanceRecords(response.data.attendance);
        setFilteredRecords(response.data.attendance);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setToast({
        show: true,
        message: "Failed to fetch attendance records",
        type: "error",
      });
      setLoading(false);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/attendance/mark",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setToast({
          show: true,
          message: response.data.message,
          type: "success",
        });
        setShowModal(false);
        setFormData({
          employeeId: "",
          date: new Date().toISOString().split("T")[0],
          status: "Present",
          timeIn: "",
          timeOut: "",
          remarks: "",
        });
        fetchAttendance();
      }
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.error || "Failed to mark attendance",
        type: "error",
      });
    }
  };

  const handleDelete = (id) => {
    showToast.confirm(
      "Are you sure you want to delete this record?",
      async () => {
        // On confirm
        try {
          const response = await axios.delete(
            `/api/attendance/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.success) {
            showToast.success("Attendance record deleted successfully");
            fetchAttendance();
          }
        } catch (error) {
          showToast.error(error.response?.data?.error || "Failed to delete record");
        }
      },
      () => {
        // On cancel
        showToast.info("Delete cancelled");
      }
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      Present: "bg-green-700/30 text-green-300 border-green-600/50",
      Absent: "bg-red-700/30 text-red-300 border-red-600/50",
      Late: "bg-yellow-700/30 text-yellow-300 border-yellow-600/50",
      "Half-Day": "bg-blue-700/30 text-blue-300 border-blue-600/50",
      "Work from Home": "bg-purple-700/30 text-purple-300 border-purple-600/50",
      "On Leave": "bg-gray-700/30 text-gray-300 border-gray-600/50",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          badges[status] || "bg-gray-700/30 text-gray-300"
        }`}
      >
        {status}
      </span>
    );
  };

  const columns = [
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
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString(),
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
    {
      name: "Remarks",
      selector: (row) => row.remarks || "-",
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#242b35]"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="p-3 md:p-6">
      {toast.show && (
        <div
          className={`fixed top-0 left-0 sm:top-4 sm:left-4 lg:top-6 lg:left-6 z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-2 rounded opacity-100`}
        >
          {toast.message}
        </div>
      )}

      <div className="bg-[#242b35] rounded-xl shadow-lg p-3 md:p-6 border border-gray-700/50">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-gray-100">
            Attendance Management
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name, ID, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out"
          />

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 h-[42px] transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#242b35]"
          >
            Mark Attendance
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 md:mx-0">
            <div className="min-w-[700px]">
              <DataTable
            columns={columns}
            data={filteredRecords}
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
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#242b35] border border-gray-700/50 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-100 mb-6">
              Mark Attendance
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Employee
                  </label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1a1f26] border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.employeeId} - {emp.userId?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1a1f26] border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#1a1f26] border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Half-Day">Half-Day</option>
                    <option value="Work from Home">Work from Home</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Time In
                  </label>
                  <input
                    type="time"
                    name="timeIn"
                    value={formData.timeIn}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1f26] border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-2">
                    Time Out
                  </label>
                  <input
                    type="time"
                    name="timeOut"
                    value={formData.timeOut}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1f26] border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 font-medium mb-2">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-[#1a1f26] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional remarks..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#242b35]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#242b35]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
