import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import ThemeToggle from "../common/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";

const CustomerNavbar = ({ user, cartItems, handleLogoutClick }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { isDarkGold } = useTheme();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shop-navbar"
      style={{
        background: "var(--shop-surface)",
        borderBottom: "1px solid var(--shop-border)",
        zIndex: 1000,
        padding: "0.8rem 0",
        boxShadow: "var(--shop-shadow)",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container">
        <Link
          to="/"
          className="navbar-brand fw-black d-flex align-items-center gap-2"
          style={{ letterSpacing: "-0.04em" }}
        >
          <div
            style={{
              background: "var(--shop-primary)",
              color: isDarkGold ? "#0f172a" : "#fff",
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              transition: "all 0.2s ease",
            }}
          >
            <i className="bi bi-bag-fill"></i>
          </div>
          <span
            className="fs-4 fw-extrabold"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "var(--shop-text)",
              fontWeight: 800,
            }}
          >
            E-SHOP
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#customerNavbar"
          aria-controls="customerNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ filter: isDarkGold ? "invert(1)" : "none" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="customerNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link px-4 py-2 fw-semibold text-uppercase small ${isActive ? "active" : ""}`
                }
                style={{ borderRadius: "8px" }}
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `nav-link px-4 py-2 fw-semibold text-uppercase small ${isActive ? "active" : ""}`
                }
                style={{ borderRadius: "8px" }}
              >
                Products
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link px-4 py-2 fw-semibold text-uppercase small ${isActive ? "active" : ""}`
                }
                style={{ borderRadius: "8px" }}
              >
                Contact
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link px-4 py-2 fw-semibold text-uppercase small ${isActive ? "active" : ""}`
                }
                style={{ borderRadius: "8px" }}
              >
                About
              </NavLink>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                      `nav-link px-4 py-2 fw-semibold text-uppercase small ${isActive ? "active" : ""}`
                    }
                    style={{ borderRadius: "8px" }}
                  >
                    My Orders
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `nav-link px-4 py-2 fw-semibold text-uppercase small ${isActive ? "active" : ""}`
                    }
                    style={{ borderRadius: "8px" }}
                  >
                    Settings
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <ThemeToggle />

            <Link
              to="/cart"
              className="btn btn-link p-0 position-relative cart-icon-button"
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                color: "var(--shop-text)",
                transition: "all 0.2s ease",
              }}
            >
              <i className="bi bi-cart3 fs-4"></i>
              {totalItems > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill border-2"
                  style={{
                    fontSize: "10px",
                    padding: "4px 6px",
                    background: "var(--shop-primary)",
                    color: isDarkGold ? "#0f172a" : "#ffffff",
                    borderColor: "var(--shop-surface)",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            <div
              className="vr d-none d-lg-block mx-2"
              style={{
                height: "24px",
                opacity: "0.15",
                background: "var(--shop-text)",
              }}
            ></div>

            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-link text-decoration-none dropdown-toggle p-0 fw-bold small text-uppercase d-flex align-items-center gap-2 user-profile-dropdown"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                    color: "var(--shop-text)",
                  }}
                >
                  {user.image ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${user.image}`}
                      alt="profile"
                      className="rounded-circle"
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "cover",
                        border: "1.5px solid var(--shop-border)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "var(--shop-primary)",
                        color: isDarkGold ? "#0f172a" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="bi bi-person-fill"></i>
                    </div>
                  )}
                  <span
                    className="d-none d-md-inline"
                    style={{ color: "var(--shop-text)" }}
                  >
                    {user.name} &middot;{" "}
                    <span style={{ color: "var(--shop-muted)" }}>
                      {user.role || "user"}
                    </span>
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2"
                  style={{ borderRadius: "12px" }}
                >
                  {user.role === "admin" && (
                    <li>
                      <Link
                        className="dropdown-item small fw-bold text-uppercase px-3 py-2"
                        to="/admin"
                        style={{ borderRadius: "6px" }}
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      className="dropdown-item small fw-bold text-uppercase px-3 py-2"
                      to="/settings"
                      style={{ borderRadius: "6px" }}
                    >
                      Profile Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item small fw-bold text-uppercase px-3 py-2"
                      to="/orders"
                      style={{ borderRadius: "6px" }}
                    >
                      My Orders
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-2" />
                  </li>
                  <li>
                    <button
                      onClick={handleLogoutClick}
                      className="dropdown-item small fw-bold text-uppercase text-danger px-3 py-2"
                      style={{ borderRadius: "6px" }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-sm btn-outline-theme px-4 py-2"
                  style={{ borderRadius: "8px" }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-sm btn-theme-primary px-4 py-2"
                  style={{ borderRadius: "8px" }}
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .nav-link {
          color: var(--shop-muted) !important;
          transition: all 0.25s ease;
        }
        .nav-link:hover,
        .nav-link.active {
          color: var(--shop-primary) !important;
          background: var(--shop-surface-2) !important;
        }
        .dropdown-menu {
          background: var(--shop-surface) !important;
          border: 1px solid var(--shop-border) !important;
          box-shadow: var(--shop-shadow) !important;
        }
        .dropdown-item {
          color: var(--shop-text) !important;
          transition: all 0.2s ease;
        }
        .dropdown-item:hover {
          background: var(--shop-primary) !important;
          color: ${isDarkGold ? "#0f172a" : "#ffffff"} !important;
        }
        .dropdown-divider {
          border-top: 1px solid var(--shop-border) !important;
        }
        .btn-outline-theme {
          border: 1px solid var(--shop-border) !important;
          color: var(--shop-text) !important;
          background: transparent !important;
          transition: all 0.2s ease;
          font-weight: 700;
        }
        .btn-outline-theme:hover {
          background: var(--shop-surface-2) !important;
          border-color: var(--shop-primary) !important;
          color: var(--shop-primary) !important;
          transform: translateY(-1px);
        }
        .btn-theme-primary {
          background: var(--shop-primary) !important;
          color: ${isDarkGold ? "#0f172a" : "#ffffff"} !important;
          border: none !important;
          font-weight: 700;
          transition: all 0.2s ease;
        }
        .btn-theme-primary:hover {
          opacity: 0.95;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(${isDarkGold ? "251, 191, 36" : "79, 111, 247"}, 0.25);
        }
        .cart-icon-button:hover,
        .user-profile-dropdown:hover {
          background: var(--shop-surface-2) !important;
          border-radius: 8px;
        }
        .fw-extrabold {
          font-weight: 800;
        }
      `}</style>
    </nav>
  );
};

export default CustomerNavbar;
