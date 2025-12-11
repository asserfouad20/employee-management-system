import React from "react";
import { useAuth } from "../../context/authContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  return (
    <div className="flex-1 bg-[#1a1f26] border-b border-gray-800 h-14 flex items-center px-4 md:px-6 shadow-md pl-16 lg:pl-6">
      <p className="font-semibold text-sm md:text-base text-gray-200">
        <span className="hidden sm:inline">Welcome </span>
        {user?.role === "admin" ? "Admin" : user?.name || "User"}
      </p>
      <button
        className="text-white font-semibold ml-auto px-3 py-1.5 md:px-6 md:py-2 bg-blue-600 rounded-lg transform transition-all duration-200 ease-in-out hover:scale-105 hover:bg-blue-700 active:scale-95 text-sm md:text-base shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1f26]"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default NavBar;
