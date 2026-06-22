import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";

const AdminNavbar = ({ onLogout }) => {
  const { user } = useAuth();
  const { isDarkGold } = useTheme();

  return (
    <nav
      className="admin-navbar-themed navbar px-4 py-3"
      style={{
        background: isDarkGold ? "rgba(10, 10, 10, 0.85)" : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: isDarkGold ? "1px solid #222222" : "1px solid #e2e8f0",
        position: "sticky",
        top: 0,
        zIndex: 90,
      }}
    >
      <span 
        className="navbar-brand fw-bold d-flex align-items-center gap-2" 
        style={{ 
          color: isDarkGold ? "#f8fafc" : "#1e293b", 
          fontSize: "18px" 
        }}
      >
        <i 
          className="bi bi-shield-check-fill" 
          style={{ 
            fontSize: "20px", 
            color: isDarkGold ? "#fbbf24" : "#4f6ff7" 
          }}
        ></i>
        Admin Dashboard Panel
      </span>

      <div className="ms-auto d-flex align-items-center gap-3">
        <ThemeToggle />
        <span 
          className="small d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill fw-semibold"
          style={{
            background: isDarkGold ? "#2d3748" : "#f1f5f9",
            color: isDarkGold ? "#cbd5e1" : "#475569",
            border: isDarkGold ? "1px solid #4a5568" : "1px solid #e2e8f0"
          }}
        >
          <i className="bi bi-person-circle" style={{ color: isDarkGold ? "#fbbf24" : "#4f6ff7" }}></i>
          {user?.name || "Admin"} &middot; {user?.role || "admin"}
        </span>

        <button
          onClick={onLogout}
          className="btn btn-sm d-flex align-items-center gap-1.5 px-3 py-1.5"
          style={{ 
            borderRadius: "20px",
            fontWeight: "600",
            fontSize: "13px",
            background: isDarkGold ? "rgba(239, 68, 68, 0.15)" : "#fff1f2",
            border: isDarkGold ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid #ffe4e6",
            color: isDarkGold ? "#f87171" : "#e11d48",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkGold ? "rgba(239, 68, 68, 0.25)" : "#ffe4e6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDarkGold ? "rgba(239, 68, 68, 0.15)" : "#fff1f2";
          }}
        >
          <i className="bi bi-box-arrow-right"></i>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
