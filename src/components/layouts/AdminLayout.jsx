import Sidebar from "./Sidebar";
import AdminNavbar from "./Navbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="admin-shell d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />

      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        <AdminNavbar onLogout={handleLogout} />
        <div className="p-4" style={{ flexGrow: 1 }}>
          <div className="content-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
