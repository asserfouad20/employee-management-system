// src/components/employees/List.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import {
  columns as employeeColumns,
  EmployeeButtons,
} from "../../utils/EmployeeHelper";
import { showToast } from "../../utils/toast";

const customStyles = {
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
      fontSize: "1rem",
      fontWeight: 600,
      textAlign: "left",
      paddingLeft: "1rem",
      paddingRight: "1rem",
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
        cursor: "pointer",
      },
    },
  },
  cells: {
    style: {
      textAlign: "left",
      paddingLeft: "1rem",
      paddingRight: "1rem",
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
  columns: {
    // Shift Action column (index 6) 0.5rem to the left
    6: {
      style: {
        paddingLeft: "70.5rem",
      },
    },
  },
};

export default function List() {
  const [employees, setEmployees] = useState([]); // rows ready for display
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ← add this

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/employee", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success && Array.isArray(data.employees)) {
          const rows = data.employees.map((emp, idx) => ({
            _id: emp._id,
            sno: idx + 1,
            name: emp.userId?.name || "N/A",
            email: emp.userId?.email || "N/A",
            dept: emp.department?.dep_name || "No Department",
            dob: new Date(emp.dob).toLocaleDateString(),
            image: emp.userId?.profileImage || "",
            action: (
              <EmployeeButtons
                empId={emp._id}
                onEmployeeDelete={(id) =>
                  setEmployees((prev) => prev.filter((e) => e._id !== id))
                }
              />
            ),
          }));
          setEmployees(rows);
        } else {
          showToast.error(data.error || "Failed to load employees");
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        showToast.error(err.response?.data?.error || "Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // filter out of UI render (just like DepartmentsList)
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-5 px-3 md:px-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg md:text-2xl font-bold text-gray-100">Manage Employees</h3>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0">
        <input
          type="text"
          placeholder="Search By Emp Name"
          value={searchTerm} // ← controlled input
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 bg-[#242b35] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />

        <Link
          to="/admin-dashboard/add-employee"
          className="flex items-center justify-center w-full sm:w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          aria-label="Add Employee"
        >
          <FaPlus className="text-sm" />
        </Link>
      </div>

      <div className="mt-5 bg-[#242b35] shadow-2xl rounded-xl border border-gray-700/50 overflow-x-auto">
        <div className="min-w-[800px]">
          <DataTable
            columns={employeeColumns}
            data={filteredEmployees}
            customStyles={customStyles}
            progressPending={loading}
            progressComponent={
              <div className="flex items-center justify-center h-48">
                <span className="text-xl md:text-3xl font-bold text-gray-300">Loading…</span>
              </div>
            }
            pagination
            noDataComponent={
              <div className="p-8 text-center text-gray-400">No employees found</div>
            }
          />
        </div>
      </div>
    </div>
  );
}
