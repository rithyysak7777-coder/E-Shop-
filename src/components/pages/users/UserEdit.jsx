import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/axios";
import LoadingSpinner from "../../common/LoadingSpinner";
import { getUserByIdApi, updateUserApi } from "../../services/userService";
import { buildFormData, extractResource } from "../../services/apiHelpers";
import "../adminCrud.css";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    image: null,
  });
  const [currentImage, setCurrentImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserByIdApi(id);
        const user = extractResource(response, "user");
        setForm({
          name: user?.name || "",
          email: user?.email || "",
          password: "",
          role: user?.role || "user",
          image: null,
        });
        setCurrentImage(user?.image_url || "");
      } catch (err) {
        console.error("Error loading user:", err);
        const status = err?.response?.status;
        if (status === 401) {
          setError("Authentication required. Please log in as an admin.");
        } else if (status === 403) {
          setError(
            "Forbidden. Your account needs admin privileges to edit users.",
          );
        } else if (status === 404) {
          setError("User not found. It may have been deleted.");
        } else {
          setError("Could not load this user.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const formData = buildFormData(new FormData(), {
        ...form,
        _method: "PUT",
      });
      await updateUserApi(id, formData);
      navigate("/admin/users");
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Could not update user. Please check the form and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading user for editing..." />;
  }

  const initials = form.name ? form.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="admin-crud">
      {/* Page Header */}
      <div className="admin-crud-header">
        <div>
          <h2>Edit User</h2>
          <p>Update profile information, role, password, or avatar image.</p>
        </div>
        <Link className="btn-cancel" to="/admin/users">
          <i className="bi bi-arrow-left" />
          Back to Users
        </Link>
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill" />
          {error}
          <div className="ms-auto d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
            <button
              className="btn btn-sm btn-light"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-crud-card overflow-hidden">
          {/* Banner */}
          <div
            className="form-banner"
            style={{
              background: "linear-gradient(135deg, #4f6ff7 0%, #7c3aed 100%)",
            }}
          >
            <div className="form-banner-dots" />
          </div>

          {/* Avatar + name row */}
          <div
            className="d-flex align-items-end gap-4 px-6 pb-0"
            style={{ padding: "0 28px" }}
          >
            {currentImage ? (
              <img className="form-avatar" src={currentImage} alt={form.name} />
            ) : (
              <div
                className="form-avatar-initials"
                style={{
                  background: "linear-gradient(135deg, #4f6ff7, #7c3aed)",
                }}
              >
                {initials}
              </div>
            )}
            <div className="pb-3 pt-2">
              <h5
                className="fw-bold mb-0"
                style={{ color: "#0f172a", fontSize: "18px" }}
              >
                {form.name || "User"}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                <i className="bi bi-person-badge me-1" />
                <span
                  className={`badge ${form.role === "admin" ? "bg-danger" : "bg-primary"} ms-1`}
                  style={{ fontSize: "11px" }}
                >
                  {form.role}
                </span>
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-4" style={{ padding: "24px 28px" }}>
            {/* Section: Identity */}
            <div className="form-section-title">
              <i className="bi bi-person me-2" />
              Identity
            </div>
            <div className="admin-form-grid mb-4">
              <div className="form-field">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <i className="bi bi-person input-icon" />
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <i className="bi bi-envelope input-icon" />
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section: Security */}
            <div className="form-section-title">
              <i className="bi bi-shield-lock me-2" />
              Security & Access
            </div>
            <div className="admin-form-grid mb-4">
              <div className="form-field">
                <label>New Password</label>
                <div className="input-wrapper">
                  <i className="bi bi-lock input-icon" />
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    minLength="4"
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>
              <div className="form-field">
                <label>System Role</label>
                <div className="input-wrapper">
                  <i className="bi bi-person-badge input-icon" />
                  <select
                    className="form-select"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="user">User — Standard access</option>
                    <option value="admin">Admin — Full access</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Avatar */}
            <div className="form-section-title">
              <i className="bi bi-image me-2" />
              Profile Image
            </div>
            <div className="form-field full">
              <label>Replace Avatar Image</label>
              <div className="input-wrapper">
                <i className="bi bi-cloud-upload input-icon" />
                <input
                  className="form-control"
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ paddingLeft: "40px" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div
          className="form-actions mt-0"
          style={{ borderRadius: "0 0 16px 16px", marginTop: "-1px" }}
        >
          <Link className="btn-cancel" to="/admin/users">
            <i className="bi bi-x-lg" /> Cancel
          </Link>
          <button className="btn-save" type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                />{" "}
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle" /> Update User
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
