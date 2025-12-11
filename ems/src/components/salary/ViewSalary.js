// src/components/salary/ViewSalary.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
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
      color: "#e5e7eb",
      minHeight: "52px",
    },
  },
  headCells: {
    style: {
      fontSize: "1rem",
      fontWeight: 600,
      textAlign: "left",
      paddingLeft: "1rem",
      color: "#e5e7eb",
    },
  },
  rows: {
    style: {
      backgroundColor: "#242b35",
      color: "#e5e7eb",
      minHeight: "60px",
      "&:hover": {
        backgroundColor: "#2d3748",
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
      backgroundColor: "#242b35",
      borderTop: "1px solid #374151",
      color: "#e5e7eb",
    },
    pageButtonsStyle: {
      color: "#e5e7eb",
      fill: "#e5e7eb",
      "&:hover": {
        backgroundColor: "#374151",
      },
      "&:disabled": {
        fill: "#6b7280",
      },
    },
  },
  progress: {
    style: {
      backgroundColor: "#242b35",
      color: "#e5e7eb",
    },
  },
  noData: {
    style: {
      backgroundColor: "#242b35",
      color: "#e5e7eb",
    },
  },
};

const columns = [
  { name: "SNO", selector: (row) => row.sno, width: "70px" },
  { name: "Emp ID", selector: (row) => row.empId, sortable: true },
  {
    name: "Salary",
    selector: (row) => row.salary,
    sortable: true,
    cell: (row) => (
      <span className="font-semibold text-blue-400">
        ${row.salary.toLocaleString()}
      </span>
    ),
  },
  {
    name: "Allowance",
    selector: (row) => row.allowance,
    sortable: true,
    cell: (row) => (
      <span className="font-semibold text-green-400">
        +${row.allowance.toLocaleString()}
      </span>
    ),
  },
  {
    name: "Deduction",
    selector: (row) => row.deduction,
    sortable: true,
    cell: (row) => (
      <span className="font-semibold text-red-400">
        -${row.deduction.toLocaleString()}
      </span>
    ),
  },
  {
    name: "Total",
    selector: (row) => row.total,
    sortable: true,
    cell: (row) => (
      <span className="font-bold text-blue-400 text-lg">
        ${row.total.toLocaleString()}
      </span>
    ),
  },
  { name: "Pay Date", selector: (row) => row.payDate, sortable: true },
];

export default function ViewSalary() {
  const { id } = useParams();
  const [salaries, setSalaries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/salary/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success) {
          // remap each salary into the row shape we need
          const rows = data.salary.map((sal, i) => ({
            _id: sal._id,
            sno: i + 1,
            empId: sal.employee.employeeId,
            salary: sal.basicSalary,
            allowance: sal.allowances,
            deduction: sal.deductions,
            total: sal.netSalary,
            payDate: new Date(sal.payDate).toLocaleDateString(),
          }));
          setSalaries(rows);
          setFiltered(rows);
        }
      } catch (err) {
        console.error(err);
        showToast.error("Failed to load salary history");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // live‐filter by Emp ID
  useEffect(() => {
    setFiltered(
      salaries.filter((r) =>
        r.empId.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, salaries]);

  return (
    <div className="pt-5 px-3 md:px-6 space-y-4">
      {/* 1) Title above */}
      <h3 className="text-lg md:text-2xl font-bold text-gray-100">Salary History</h3>

      {/* 2) Back button below title */}
      <div>
        <Link
          to="/admin-dashboard/employees"
          className="
            text-blue-400 hover:text-blue-300 hover:underline
            transition-colors duration-200
          "
        >
          ← Back to Employees
        </Link>
      </div>

      {/* 3) Table */}
      <div className="mt-5 bg-[#242b35] shadow-2xl rounded-xl border border-gray-700/50 overflow-x-auto">
        <div className="min-w-[800px]">
          <DataTable
            columns={columns}
            data={filtered}
            customStyles={customStyles}
            progressPending={loading}
            pagination
            noDataComponent={
              <div className="py-12 text-center text-gray-400">
                No salary records found
              </div>
            }
            progressComponent={
              <div className="py-12 text-center text-gray-400">
                Loading salary records...
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
