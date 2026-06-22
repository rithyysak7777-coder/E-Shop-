import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginAccount } from "../../services/authService";
import { AuthContext } from "../../contexts/AuthContextValue";

const Login = () => {
  const { HandleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorMsg(""); // Clear error when user types
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await LoginAccount(formData);

      // Response is already parsed data from authService
      // Improved: Check for success status or presence of token
      if (res.status?.toLowerCase() === "success" || res.token) {
        HandleLogin(res.user, res.token);

        if (res.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        setErrorMsg(res.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("🔴 Login Error:", error);

      // Detailed error handling
      if (error.response?.status === 401) {
        setErrorMsg("❌ Invalid email or password");
      } else if (error.response?.status === 422) {
        setErrorMsg(
          "❌ " + (error.response.data?.message || "Invalid input data"),
        );
      } else if (error.code === "ECONNABORTED") {
        setErrorMsg("❌ Request timeout - Backend might be down or slow");
      } else if (!error.response) {
        const apiUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
        setErrorMsg(
          `❌ Network Error: Cannot reach API at ${apiUrl}. Ensure backend is running and CORS is configured.`,
        );
      } else {
        setErrorMsg(
          "❌ " +
            (error.response.data?.message ||
              "Server error or invalid credentials"),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="container min-vh-100 d-flex align-items-center justify-content-center"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
          <div
            className="card shadow-lg border-0 rounded-4 overflow-hidden"
            style={{ background: "#ffffff" }}
          >
            <div className="p-4 p-md-5">
              <div className="text-center mb-4">
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "26px",
                    fontWeight: "800",
                    letterSpacing: "0.5px",
                  }}
                >
                  <i className="bi bi-bag-heart-fill me-1"></i>
                  E-Shop
                </span>
                <p className="text-secondary small mt-2">
                  Welcome back! Please login to your account.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {errorMsg && (
                  <div
                    className="alert alert-danger alert-dismissible fade show d-flex align-items-start gap-2"
                    role="alert"
                    style={{ fontSize: "14px" }}
                  >
                    <i className="bi bi-exclamation-circle-fill flex-shrink-0 mt-0.5"></i>
                    <div className="flex-grow-1">{errorMsg}</div>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setErrorMsg("")}
                      aria-label="Close"
                    ></button>
                  </div>
                )}
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label text-secondary small fw-semibold"
                  >
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control px-3"
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="form-label text-secondary small fw-semibold"
                  >
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control px-3"
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 fw-bold"
                  disabled={isSubmitting}
                  style={{
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
                  }}
                >
                  {isSubmitting ? "Logging In..." : "Log In"}
                </button>
              </form>

              <p className="text-center mt-4 mb-0 small text-secondary">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary fw-bold text-decoration-none"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
