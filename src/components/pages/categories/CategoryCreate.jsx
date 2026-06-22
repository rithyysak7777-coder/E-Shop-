import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import "../adminCrud.css";

const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const CategoryCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "name" ? { slug: createSlug(value) } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      await api.post("/admin/categories", form);
      navigate("/admin/categories");
    } catch (err) {
      console.error("Error creating category:", err);
      setError(
        "Could not create category. Please check the form and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-crud">
      <div className="admin-crud-header">
        <div>
          <h2>Create Category</h2>
          <p>
            Add a new product category with a name and optional description.
          </p>
        </div>
        <Link className="btn-cancel" to="/admin/categories">
          <i className="bi bi-arrow-left" /> Back
        </Link>
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center gap-2 mb-4 rounded-3"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-crud-card overflow-hidden">
          {/* Banner */}
          <div
            className="form-banner"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            }}
          >
            <div className="form-banner-dots" />
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "28px",
                zIndex: 3,
                color: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(6px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                🏷️
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "16px" }}>
                  {form.name || "New Category"}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  {form.slug || "slug-will-appear-here"}
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "28px" }}>
            {/* Info */}
            <div className="form-section-title">
              <i className="bi bi-tags me-2" />
              Category Details
            </div>
            <div className="admin-form-grid mb-4">
              <div className="form-field">
                <label>Category Name</label>
                <div className="input-wrapper">
                  <i className="bi bi-tag input-icon" />
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Electronics"
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label>
                  URL Slug{" "}
                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: "10px",
                      fontWeight: 400,
                      textTransform: "none",
                    }}
                  >
                    (auto-generated)
                  </span>
                </label>
                <div className="input-wrapper">
                  <i className="bi bi-link-45deg input-icon" />
                  <input
                    className="form-control"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="auto-generated-slug"
                    required
                  />
                </div>
              </div>
              <div className="form-field full">
                <label>
                  Description{" "}
                  <span
                    style={{
                      color: "#94a3b8",
                      fontSize: "10px",
                      fontWeight: 400,
                      textTransform: "none",
                    }}
                  >
                    (optional)
                  </span>
                </label>
                <div className="input-wrapper">
                  <i
                    className="bi bi-card-text input-icon"
                    style={{ top: "14px", alignSelf: "flex-start" }}
                  />
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Briefly describe this category..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link className="btn-cancel" to="/admin/categories">
            <i className="bi bi-x-lg" /> Cancel
          </Link>
          <button
            className="btn-save"
            type="submit"
            disabled={isSaving}
            style={{
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
            }}
          >
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
                <i className="bi bi-plus-circle" /> Create Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryCreate;
