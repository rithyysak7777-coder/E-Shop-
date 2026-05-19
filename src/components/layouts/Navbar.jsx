import React from "react";

const AdminNavbar = ({ onLogout }) => {
  return (
    <nav
      className="navbar navbar-dark px-4"
      style={{
        background: "#3b82f6", // blue-500
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      <span className="navbar-brand fw-bold d-flex align-items-center gap-2">
        <i className="bi bi-shield-lock-fill"></i>
        Admin Panel
      </span>

      <div className="ms-auto d-flex align-items-center gap-3">
        <span className="text-white small d-flex align-items-center gap-1">
          <i className="bi bi-person-circle"></i>
          Admin
        </span>

        <button
          onClick={onLogout}
          className="btn btn-light btn-sm d-flex align-items-center gap-1"
          style={{ borderRadius: "20px" }}
        >
          <i className="bi bi-box-arrow-right"></i>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;