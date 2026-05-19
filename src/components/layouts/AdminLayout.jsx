import React from "react";

import Sidebar from "./Sidebar";
import AdminNavbar from "./Navbar";

const AdminLayout = ({ children }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      <AdminNavbar onLogout={handleLogout} />

      <div className="d-flex">
        <Sidebar />

        <div className="p-4 w-100 bg-light" style={{ minHeight: "100vh" }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default AdminLayout;