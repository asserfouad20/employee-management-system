// src/components/departments/DepartmentsList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import { columns } from "../../utils/DepartmentHelper";
import { DepartmentButtons } from "../../utils/DepartmentHelper";
import { FaPlus } from "react-icons/fa";
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
};

export default function DepartmentsList() {
  const [departments, setDepartments] = useState([]); // raw data
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // remove by id with functional update
  const onDepartmentDelete = (id) =>
    setDepartments((prev) => prev.filter((dep) => dep._id !== id));

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/department", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success) {
          setDepartments(data.departments);
        }
      } catch (err) {
        console.error(err);
        showToast.error(err.response?.data?.error || "Failed to load departments");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // filter & then map into table rows
  const rows = departments
    .filter((dep) =>
      dep.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((dep, idx) => ({
      _id: dep._id,
      sno: idx + 1,
      dep_name: dep.dep_name,
      action: (
        <DepartmentButtons
          DepId={dep._id}
          onDepartmentDelete={onDepartmentDelete}
        />
      ),
    }));

  return (
    <div className="pt-5 px-3 md:px-6 space-y-4">
      {/* Header + Add */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg md:text-2xl font-bold text-gray-100">Manage Departments</h3>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0">
        <input
          type="text"
          placeholder="Search By Dept Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-46 px-4 py-2 bg-[#242b35] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
        <Link
          to="/admin-dashboard/add-department"
          className="flex items-center justify-center w-full sm:w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          aria-label="Add Department"
        >
          <FaPlus className="text-sm" />
        </Link>
      </div>

      {/* Table */}
      <div className="mt-5 bg-[#242b35] shadow-2xl rounded-xl border border-gray-700/50 overflow-x-auto">
        <div className="min-w-[600px]">
          <DataTable
            columns={columns}
            data={rows}
            customStyles={customStyles}
            progressPending={loading}
            progressComponent={
              <div className="flex items-center justify-center h-48">
                <span className="text-xl md:text-3xl font-bold text-gray-300">Loading…</span>
              </div>
            }
            pagination
            noDataComponent={
              <div className="p-8 text-center text-gray-400">No departments found</div>
            }
          />
        </div>
      </div>
    </div>
  );
}
