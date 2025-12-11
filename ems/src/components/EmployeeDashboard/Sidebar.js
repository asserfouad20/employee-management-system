import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaMoneyBillWave, FaCalendarAlt, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const Sidebar = () => {
  const { logout } = useAuth();
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
        <h3 className="text-2xl font-bold text-white">Employee Portal</h3>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-col px-3">
        <NavLink
          to="/employee-dashboard"
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
          to="/employee-dashboard/profile"
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
          <span className="ml-4">My Profile</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/salary"
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
          <span className="ml-4">My Salary</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/leaves"
          onClick={closeSidebar}
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

        <button
          onClick={() => {
            closeSidebar();
            logout();
          }}
          className={`${linkClasses} text-gray-300 hover:bg-red-600/20 hover:text-red-400 mt-4`}
        >
          <FaSignOutAlt className="text-xl ml-2" />
          <span className="ml-4">Logout</span>
        </button>
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;
