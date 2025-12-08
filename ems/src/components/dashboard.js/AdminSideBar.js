// src/components/dashboard.js/AdminSidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaBuilding,
  FaCalendar,
  FaMoneyBill,
  FaCog,
  FaMoneyBillWave,
  FaClipboardList,
  FaChartBar,
} from "react-icons/fa";

const AdminSidebar = () => {
  const linkClasses =
    "flex items-center h-12 pl-6 pr-4 rounded-xl transition-colors duration-200 ease-in-out";

  return (
    <aside className="bg-[#16191e] text-gray-200 h-screen fixed left-0 top-0 w-64 space-y-2 rounded-tr-xl rounded-br-xl overflow-visible shadow-2xl border-r border-gray-800">
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-500 border border-blue-500/30 h-14 flex items-center justify-center rounded-r-xl -mr-4 px-4 shadow-lg">
        <h3 className="text-2xl font-bold text-white">Admin Portal</h3>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-col px-3">
        <NavLink
          to="/admin-dashboard"
          end
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-blue-600/20 border-l-4 border-blue-500 text-blue-400"
                : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
            }`
          }
        >
          <FaTachometerAlt className="text-xl ml-2" />
          <span className="ml-4">Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/employees"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-blue-600/20 border-l-4 border-blue-500 text-blue-400"
                : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
            }`
          }
        >
          <FaUser className="text-xl ml-2" />
          <span className="ml-4">Employees</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/departments"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-blue-600/20 border-l-4 border-blue-500 text-blue-400"
                : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
            }`
          }
        >
          <FaBuilding className="text-xl ml-2" />
          <span className="ml-4">Department</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/leave"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-blue-600/20 border-l-4 border-blue-500 text-blue-400"
                : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
            }`
          }
        >
          <FaCalendar className="text-xl ml-2" />
          <span className="ml-4">Leave</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/salary/add"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-blue-600/20 border-l-4 border-blue-500 text-blue-400"
                : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
            }`
          }
        >
          <FaMoneyBillWave className="text-xl ml-2" />
          <span className="ml-4">Salary</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/attendance"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-blue-600/20 border-l-4 border-blue-500 text-blue-400"
                : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
            }`
          }
        >
          <FaClipboardList className="text-xl ml-2" />
          <span className="ml-4">Attendance</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/attendance-report"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-blue-600/20 border-l-4 border-blue-500 text-blue-400"
                : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
            }`
          }
        >
          <FaChartBar className="text-xl ml-2" />
          <span className="ml-4">Attendance Report</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/settings"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-blue-600/20 border-l-4 border-blue-500 text-blue-400"
                : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
            }`
          }
        >
          <FaCog className="text-xl ml-2" />
          <span className="ml-4">Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
