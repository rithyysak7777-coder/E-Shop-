import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/axios";
import { updateCategoryApi } from "../../services/categoryService";
import LoadingSpinner from "../../common/LoadingSpinner";
import "../adminCrud.css";

const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get(`/admin/categories/${id}`);
        const category = response.data?.data || response.data;
        setForm({
          name: category?.name || "",
          slug: category?.slug || "",
          description: category?.description || "",
        });
      } catch (err) {
        console.error("Error loading category:", err);
        setError("Could not load this category.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

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
      await updateCategoryApi(id, form);
      navigate("/admin/categories");
    } catch (err) {
      console.error("Error updating category:", err);
      setError(
        "Could not update category. Please check the form and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading category for editing..." />;
  }

  return (
    <div className="admin-crud">
      <div className="admin-crud-header">
        <div>
          <h2>Edit Category</h2>
          <p>Update the category name, slug, and description.</p>
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
                ✏️
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "16px" }}>
                  {form.name || "Category"}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  /{form.slug}
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "28px" }}>
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
                    placeholder="Category name"
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label>URL Slug</label>
                <div className="input-wrapper">
                  <i className="bi bi-link-45deg input-icon" />
                  <input
                    className="form-control"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="url-slug"
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
                    placeholder="Describe this category..."
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
                <i className="bi bi-check2-circle" /> Update Category
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryEdit;
