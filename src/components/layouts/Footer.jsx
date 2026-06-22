import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
  const { isDarkGold } = useTheme();

  return (
    <footer
      className="py-5 shop-footer"
      style={{
        background: "var(--shop-surface)",
        color: "var(--shop-text)",
        borderTop: "1px solid var(--shop-border)",
        transition: "all 0.3s ease",
      }}
    >
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <Link
              to="/"
              className="text-decoration-none d-flex align-items-center gap-2 mb-3"
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
                <i className="bi bi-bag-heart-fill"></i>
              </div>
              <span
                className="fw-bold fs-4"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "-0.02em",
                  color: "var(--shop-text)",
                  fontWeight: 800,
                }}
              >
                E-SHOP
              </span>
            </Link>
            <p
              className="text-secondary small mb-4"
              style={{
                lineHeight: "1.8",
                color: "var(--shop-muted) !important",
              }}
            >
              Experience the best online shopping with E-Shop. We provide
              high-quality products, fast delivery, and excellent customer
              support. Your satisfaction is our priority.
            </p>
            <div className="d-flex gap-3">
              <a
                href="#"
                className="social-icon-btn d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="#"
                className="social-icon-btn d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a
                href="#"
                className="social-icon-btn d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="#"
                className="social-icon-btn d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6
              className="fw-bold mb-4 text-uppercase text-dark"
              style={{
                letterSpacing: "0.05em",
                color: "var(--shop-text) !important",
              }}
            >
              Quick Links
            </h6>
            <ul className="list-unstyled d-grid gap-2 small">
              <li>
                <Link
                  to="/"
                  className="text-secondary text-decoration-none hover-theme-link px-2 py-1 d-inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-secondary text-decoration-none hover-theme-link px-2 py-1 d-inline-block"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-secondary text-decoration-none hover-theme-link px-2 py-1 d-inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-secondary text-decoration-none hover-theme-link px-2 py-1 d-inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-secondary text-decoration-none hover-theme-link px-2 py-1 d-inline-block"
                >
                  Products
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6
              className="fw-bold mb-4 text-uppercase text-dark"
              style={{
                letterSpacing: "0.05em",
                color: "var(--shop-text) !important",
              }}
            >
              Customer Care
            </h6>
            <ul className="list-unstyled d-grid gap-2 small">
              <li>
                <Link
                  to="/orders"
                  className="text-secondary text-decoration-none hover-theme-link px-2 py-1 d-inline-block"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="text-secondary text-decoration-none hover-theme-link px-2 py-1 d-inline-block"
                >
                  Settings
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-secondary text-decoration-none hover-theme-link px-2 py-1 d-inline-block"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-secondary text-decoration-none hover-theme-link px-2 py-1 d-inline-block"
                >
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-secondary text-decoration-none hover-theme-link px-2 py-1 d-inline-block"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6
              className="fw-bold mb-4 text-uppercase text-dark"
              style={{
                letterSpacing: "0.05em",
                color: "var(--shop-text) !important",
              }}
            >
              Newsletter
            </h6>
            <p
              className="text-secondary small mb-3"
              style={{ color: "var(--shop-muted) !important" }}
            >
              Subscribe to get special offers and once-in-a-lifetime deals.
            </p>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control border-1"
                placeholder="Your email address"
                aria-label="Recipient's email"
                style={{
                  borderRadius: "8px 0 0 8px",
                  boxShadow: "none",
                  background: "var(--shop-surface-2)",
                  borderColor: "var(--shop-border)",
                  color: "var(--shop-text)",
                }}
              />
              <button
                className="btn btn-theme-primary px-4 fw-bold text-uppercase"
                type="button"
                style={{ borderRadius: "0 8px 8px 0" }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <hr
          className="my-5"
          style={{ borderColor: "var(--shop-border)", opacity: "0.5" }}
        />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p
            className="text-secondary small mb-0 fw-bold"
            style={{ color: "var(--shop-muted) !important" }}
          >
            &copy; 2026 E-Shop Inc. All rights reserved. Developed by Bluesak.
          </p>
          <div className="d-flex gap-4">
            <a
              href="#"
              className="text-secondary text-decoration-none small hover-theme-link fw-bold"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-secondary text-decoration-none small hover-theme-link fw-bold"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-secondary text-decoration-none small hover-theme-link fw-bold"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .hover-theme-link {
          color: var(--shop-muted) !important;
          transition: all 0.25s ease;
          border-radius: 4px;
        }
        .hover-theme-link:hover {
          color: var(--shop-primary) !important;
          text-decoration: none !important;
          background: var(--shop-surface-2);
          transform: translateX(4px);
        }
        .social-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid var(--shop-border);
          color: var(--shop-text);
          background: transparent;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .social-icon-btn:hover {
          background: var(--shop-primary);
          color: ${isDarkGold ? "#0f172a" : "#ffffff"} !important;
          border-color: var(--shop-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(${isDarkGold ? "251, 191, 36" : "79, 111, 247"}, 0.25);
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
        }
      `}</style>
    </footer>
  );
};

export default Footer;
