import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserApi } from "../../services/userService";
import { buildFormData } from "../../services/apiHelpers";
import "../adminCrud.css";

const UserCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    image: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const formData = buildFormData(form);
      await createUserApi(formData);
      navigate("/admin/users");
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Could not create user. Please check the form and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = form.name ? form.name.charAt(0).toUpperCase() : "+";

  return (
    <div className="admin-crud">
      <div className="admin-crud-header">
        <div>
          <h2>Create User</h2>
          <p>Add a new admin or customer account to the system.</p>
        </div>
        <Link className="btn-cancel" to="/admin/users">
          <i className="bi bi-arrow-left" /> Back to Users
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-crud-card overflow-hidden">

          {/* Banner */}
          <div className="form-banner" style={{ background: "linear-gradient(135deg, #10b981 0%, #0891b2 100%)" }}>
            <div className="form-banner-dots" />
          </div>

          {/* Avatar preview */}
          <div className="d-flex align-items-end gap-4" style={{ padding: "0 28px" }}>
            <div className="form-avatar-initials" style={{ background: "linear-gradient(135deg, #10b981, #0891b2)" }}>
              {initials}
            </div>
            <div className="pb-3 pt-2">
              <h5 className="fw-bold mb-0" style={{ color: "#0f172a", fontSize: "17px" }}>
                {form.name || "New User"}
              </h5>
              <span className={`badge ${form.role === "admin" ? "bg-danger" : "bg-primary"}`} style={{ fontSize: "11px" }}>
                {form.role}
              </span>
            </div>
          </div>

          <div style={{ padding: "24px 28px" }}>

            {/* Identity */}
            <div className="form-section-title"><i className="bi bi-person me-2" />Identity</div>
            <div className="admin-form-grid mb-4">
              <div className="form-field">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <i className="bi bi-person input-icon" />
                  <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" required />
                </div>
              </div>
              <div className="form-field">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <i className="bi bi-envelope input-icon" />
                  <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email address" required />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="form-section-title"><i className="bi bi-shield-lock me-2" />Security & Access</div>
            <div className="admin-form-grid mb-4">
              <div className="form-field">
                <label>Password</label>
                <div className="input-wrapper">
                  <i className="bi bi-lock input-icon" />
                  <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} minLength="4" placeholder="Minimum 4 characters" required />
                </div>
              </div>
              <div className="form-field">
                <label>System Role</label>
                <div className="input-wrapper">
                  <i className="bi bi-person-badge input-icon" />
                  <select className="form-select" name="role" value={form.role} onChange={handleChange}>
                    <option value="user">User — Standard access</option>
                    <option value="admin">Admin — Full access</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Avatar */}
            <div className="form-section-title"><i className="bi bi-image me-2" />Profile Image</div>
            <div className="form-field">
              <label>Upload Avatar</label>
              <div className="input-wrapper">
                <i className="bi bi-cloud-upload input-icon" />
                <input className="form-control" type="file" name="image" accept="image/*" onChange={handleChange} style={{ paddingLeft: "40px" }} required />
              </div>
            </div>

          </div>
        </div>

        <div className="form-actions">
          <Link className="btn-cancel" to="/admin/users"><i className="bi bi-x-lg" /> Cancel</Link>
          <button className="btn-save" type="submit" disabled={isSaving}>
            {isSaving ? (
              <><span className="spinner-border spinner-border-sm" role="status" /> Saving...</>
            ) : (
              <><i className="bi bi-person-plus" /> Create User</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCreate;
