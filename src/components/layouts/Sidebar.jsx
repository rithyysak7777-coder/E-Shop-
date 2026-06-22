import { NavLink } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const Sidebar = () => {
  const { isDarkGold } = useTheme();

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #000000 0%, #121212 100%)",
        color: "#f8fafc",
        padding: "24px 20px",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Brand Logo */}
      <h4 
        className="fw-bold mb-4 d-flex align-items-center gap-2 pb-3"
        style={{ 
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <i className="bi bi-grid-1x2-fill" style={{ color: isDarkGold ? "#fbbf24" : "#38bdf8" }}></i>
        <span style={{
          background: isDarkGold 
            ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" 
            : "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "800",
          letterSpacing: "0.5px"
        }}>
          Admin Menu
        </span>
      </h4>

      <ul className="nav flex-column gap-2" style={{ flexGrow: 1 }}>
        <SidebarItem to="/admin" label="Dashboard" icon="bi-speedometer2" isDarkGold={isDarkGold} />
        <SidebarItem to="/admin/users" label="Users" icon="bi-people-fill" isDarkGold={isDarkGold} />
        <SidebarItem to="/admin/categories" label="Categories" icon="bi-tags-fill" isDarkGold={isDarkGold} />
        <SidebarItem to="/admin/products" label="Products" icon="bi-box-seam" isDarkGold={isDarkGold} />
        <SidebarItem to="/admin/orders" label="Orders" icon="bi-cart-check" isDarkGold={isDarkGold} />
        <SidebarItem to="/admin/payments" label="Payments" icon="bi-credit-card" isDarkGold={isDarkGold} />
        <SidebarItem to="/admin/settings" label="Settings" icon="bi-gear" isDarkGold={isDarkGold} />
      </ul>

      {/* Sidebar Footer info */}
      <div 
        className="mt-auto pt-3 text-center text-xs" 
        style={{ 
          fontSize: "11px", 
          color: "#4b5563",
          borderTop: "1px solid rgba(255,255,255,0.06)" 
        }}
      >
        <span>Ecommerce App v1.2</span>
      </div>
    </div>
  );
};

const SidebarItem = ({ to, label, icon, isDarkGold }) => {
  return (
    <li>
      <NavLink
        to={to}
        end={to === "/admin"}
        className={({ isActive }) =>
          "nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded fw-medium " +
          (isActive ? "active-link" : "inactive-link")
        }
        style={{
          transition: "all 0.25s ease",
          fontSize: "14px",
          letterSpacing: "0.01em"
        }}
      >
        <i className={`bi ${icon} fs-5`}></i>
        <span>{label}</span>
      </NavLink>

      <style>{`
        .inactive-link {
          color: #94a3b8 !important;
        }

        .nav-link:hover.inactive-link {
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc !important;
          transform: translateX(4px);
        }

        .active-link {
          background: ${isDarkGold 
            ? "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)" 
            : "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)"
          } !important;
          color: ${isDarkGold ? "#0f172a" : "#ffffff"} !important;
          font-weight: 700;
          box-shadow: ${isDarkGold 
            ? "0 4px 16px rgba(251, 191, 36, 0.25)" 
            : "0 4px 16px rgba(79, 111, 247, 0.35)"
          };
        }
      `}</style>
    </li>
  );
};

export default Sidebar;
