import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllCategoriesApi } from "../../services/categoryService";
import { createProductApi } from "../../services/productService";
import {
  buildFormData,
  createSlug,
  extractCollection,
} from "../../services/apiHelpers";
import "../adminCrud.css";

const ProductCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category_id: "",
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    status: "active",
    images: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoriesApi();
        const data = extractCollection(response, "categories");
        setCategories(data);
        setForm((current) => ({
          ...current,
          category_id: current.category_id || data[0]?.id || "",
        }));
      } catch (err) {
        console.error("Error loading categories:", err);
        setError(
          "Could not load categories. Create a category before adding products.",
        );
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: files ? Array.from(files) : value,
      ...(name === "name" ? { slug: createSlug(value) } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const formDataObj = new FormData();

      // Append form fields (excluding images to handle separately)
      const formWithoutImages = { ...form };
      delete formWithoutImages.images;

      buildFormData(formDataObj, formWithoutImages);

      // Append image files separately as images[]
      if (form.images.length > 0) {
        console.log("📤 Creating product with", form.images.length, "images");
        form.images.forEach((image, index) => {
          console.log(
            `  Image ${index + 1}:`,
            image.name,
            `(${(image.size / 1024).toFixed(2)}KB)`,
          );
          formDataObj.append("images[]", image);
        });
      } else {
        console.warn("⚠️ No images selected!");
      }

      console.log("🔄 Creating product via POST /admin/products");
      await createProductApi(formDataObj);
      console.log("✅ Product created successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("❌ Error creating product:", err);
      console.error("Response:", err.response?.data);
      setError(
        "Could not create product. Please check the form and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-crud">
      <div className="admin-crud-header">
        <div>
          <h2>Create Product</h2>
          <p>Add a new product with pricing, stock, category, and images.</p>
        </div>
        <Link className="btn-cancel" to="/admin/products">
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
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
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
                📦
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "16px" }}>
                  {form.name || "New Product"}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                  {form.price
                    ? `$${Number(form.price).toFixed(2)}`
                    : "Set a price below"}{" "}
                  · {form.stock || "0"} in stock
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "28px" }}>
            {/* Basic Info */}
            <div className="form-section-title">
              <i className="bi bi-box-seam me-2" />
              Product Info
            </div>
            <div className="admin-form-grid mb-4">
              <div className="form-field">
                <label>Product Name</label>
                <div className="input-wrapper">
                  <i className="bi bi-box input-icon" />
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. iPhone 15 Pro"
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
                    (auto)
                  </span>
                </label>
                <div className="input-wrapper">
                  <i className="bi bi-link-45deg input-icon" />
                  <input
                    className="form-control"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="auto-slug"
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label>Category</label>
                <div className="input-wrapper">
                  <i className="bi bi-tags input-icon" />
                  <select
                    className="form-select"
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label>Status</label>
                <div className="input-wrapper">
                  <i className="bi bi-toggle-on input-icon" />
                  <select
                    className="form-select"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="active">
                      Active — Visible to customers
                    </option>
                    <option value="inactive">Inactive — Hidden</option>
                  </select>
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
                    placeholder="Describe this product..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="form-section-title">
              <i className="bi bi-currency-dollar me-2" />
              Pricing & Inventory
            </div>
            <div className="admin-form-grid mb-4">
              <div className="form-field">
                <label>Price (USD)</label>
                <div className="input-wrapper">
                  <i className="bi bi-currency-dollar input-icon" />
                  <input
                    className="form-control"
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="form-field">
                <label>Stock Quantity</label>
                <div className="input-wrapper">
                  <i className="bi bi-layers input-icon" />
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="form-section-title">
              <i className="bi bi-images me-2" />
              Product Images
            </div>
            <div className="form-field">
              <label>
                Upload Images{" "}
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "10px",
                    fontWeight: 400,
                    textTransform: "none",
                  }}
                >
                  (multiple allowed)
                </span>
              </label>
              <div className="input-wrapper">
                <i className="bi bi-cloud-upload input-icon" />
                <input
                  className="form-control"
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleChange}
                  style={{ paddingLeft: "40px" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Link className="btn-cancel" to="/admin/products">
            <i className="bi bi-x-lg" /> Cancel
          </Link>
          <button
            className="btn-save"
            type="submit"
            disabled={isSaving || categories.length === 0}
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              boxShadow: "0 4px 14px rgba(139,92,246,0.35)",
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
                <i className="bi bi-plus-circle" /> Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
