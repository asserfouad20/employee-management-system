import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaMoneyBillWave, FaCalendarAlt, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const Sidebar = () => {
  const { logout } = useAuth();

  const linkClasses =
    "flex items-center h-12 pl-6 pr-4 rounded-xl transition-colors duration-200 ease-in-out";

  return (
    <aside className="bg-[#16191e] text-gray-200 h-screen fixed left-0 top-0 w-64 space-y-2 rounded-tr-xl rounded-br-xl overflow-visible shadow-2xl border-r border-gray-800">
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-500 border border-blue-500/30 h-14 flex items-center justify-center rounded-r-xl -mr-4 px-4 shadow-lg">
        <h3 className="text-2xl font-bold text-white">Employee Portal</h3>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-col px-3">
        <NavLink
          to="/employee-dashboard"
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
          to="/employee-dashboard/profile"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-blue-600/20 border-l-4 border-blue-500 text-blue-400"
                : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
            }`
          }
        >
          <FaUser className="text-xl ml-2" />
          <span className="ml-4">My Profile</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/salary"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-blue-600/20 border-l-4 border-blue-500 text-blue-400"
                : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
            }`
          }
        >
          <FaMoneyBillWave className="text-xl ml-2" />
          <span className="ml-4">My Salary</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/leaves"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-blue-600/20 border-l-4 border-blue-500 text-blue-400"
                : "text-gray-300 hover:bg-blue-600/10 hover:text-blue-400"
            }`
          }
        >
          <FaCalendarAlt className="text-xl ml-2" />
          <span className="ml-4">Leave</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/settings"
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

        <button
          onClick={logout}
          className={`${linkClasses} text-gray-300 hover:bg-red-600/20 hover:text-red-400 mt-4`}
        >
          <FaSignOutAlt className="text-xl ml-2" />
          <span className="ml-4">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
