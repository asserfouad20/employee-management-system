// src/components/dashboard.js/AdminSidebar.js
import React, { useState } from "react";
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
  FaBars,
  FaTimes,
} from "react-icons/fa";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses =
    "flex items-center h-12 pl-6 pr-4 rounded-xl transition-colors duration-200 ease-in-out";

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-[#16191e] text-gray-200 h-screen fixed left-0 top-0 w-64 space-y-2 rounded-tr-xl rounded-br-xl overflow-visible shadow-2xl border-r border-gray-800 z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-500 border border-blue-500/30 h-14 flex items-center justify-center rounded-r-xl -mr-4 px-4 shadow-lg">
        <h3 className="text-2xl font-bold text-white">Admin Portal</h3>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-col px-3">
        <NavLink
          to="/admin-dashboard"
          end
          onClick={closeSidebar}
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
          onClick={closeSidebar}
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
          onClick={closeSidebar}
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
          onClick={closeSidebar}
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
          onClick={closeSidebar}
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
          onClick={closeSidebar}
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
          onClick={closeSidebar}
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
          onClick={closeSidebar}
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
    </>
  );
};

export default AdminSidebar;
