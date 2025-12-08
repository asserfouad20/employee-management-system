import React from "react";
import { useAuth } from "../../context/authContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  return (
    <div className="flex-1 bg-[#1a1f26] border-b border-gray-800 h-14 flex items-center px-6 shadow-md">
      <p className="font-semibold text-base text-gray-200">
        Welcome {user?.role === "admin" ? "Admin" : user?.name || "User"}
      </p>
      <button
        className="text-white font-semibold ml-auto px-6 py-2 bg-blue-600 rounded-lg transform transition-all duration-200 ease-in-out hover:scale-105 hover:bg-blue-700 active:scale-95 text-base shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1f26]"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default NavBar;
