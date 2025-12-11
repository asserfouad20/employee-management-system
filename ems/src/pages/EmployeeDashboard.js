import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/EmployeeDashboard/Sidebar";
import NavBar from "../components/dashboard.js/NavBar";

const EmployeeDashboard = () => {
  return (
    <div className="flex bg-[#0f1419]">
      <Sidebar />

      <div className="flex-1 ml-0 lg:ml-64 bg-[#0f1419] min-h-screen">
        <NavBar />
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
