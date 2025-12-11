import React from "react";
import { useAuth } from "../context/authContext";
import AdminSidebar from "../components/dashboard.js/AdminSideBar";
import NavBar from "../components/dashboard.js/NavBar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex bg-[#0f1419]">
      <AdminSidebar />

      <div className="flex-1 ml-0 lg:ml-64 bg-[#0f1419] min-h-screen">
        <NavBar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
