import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#2563eb", // blue-600
        color: "white",
        padding: "20px",
      }}
    >
      {/* Logo */}
      <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-speedometer2"></i>
        Admin Menu
      </h4>

      <ul className="nav flex-column gap-2">

        <SidebarItem to="/admin" label="Dashboard" icon="bi-speedometer2" />
        <SidebarItem to="/admin/users" label="Users" icon="bi-people-fill" />
        <SidebarItem to="/admin/products" label="Products" icon="bi-box-seam" />
        <SidebarItem to="/admin/orders" label="Orders" icon="bi-receipt" />

      </ul>
    </div>
  );
};

const SidebarItem = ({ to, label, icon }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          "nav-link d-flex align-items-center gap-2 px-3 py-2 rounded " +
          (isActive ? "active-link" : "text-white")
        }
        style={{
          transition: "0.3s",
        }}
      >
        <i className={`bi ${icon}`}></i>
        <span>{label}</span>
      </NavLink>

      <style>{`
        .nav-link:hover {
          background: rgba(255,255,255,0.15);
          transform: translateX(5px);
        }

        .active-link {
          background: white;
          color: #2563eb !important;
          font-weight: bold;
        }
      `}</style>
    </li>
  );
};

export default Sidebar;