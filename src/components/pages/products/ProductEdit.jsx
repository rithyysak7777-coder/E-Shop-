import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllCategoriesApi } from "../../services/categoryService";
import {
  getProductByIdApi,
  updateProductApi,
} from "../../services/productService";
import {
  buildFormData,
  createSlug,
  extractCollection,
  extractResource,
} from "../../services/apiHelpers";
import LoadingSpinner from "../../common/LoadingSpinner";
import "../adminCrud.css";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
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
  const [replaceImages, setReplaceImages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          getProductByIdApi(id),
          getAllCategoriesApi(),
        ]);
        const product = extractResource(productResponse, "product");
        setCategories(extractCollection(categoryResponse, "categories"));
        setCurrentImages(
          product?.product_images || product?.productImages || [],
        );
        setImagesToRemove([]);
        setForm({
          category_id: product?.category_id || "",
          name: product?.name || "",
          slug: product?.slug || "",
          description: product?.description || "",
          price: product?.price || "",
          stock: product?.stock || "",
          status: product?.status || "active",
          images: [],
        });
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Could not load this product.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

      // include replace_images flag (default: append)
      buildFormData(formDataObj, {
        ...formWithoutImages,
        _method: "PUT",
        replace_images: replaceImages ? 1 : 0,
      });

      // Append image files separately as images[]
      if (form.images.length > 0) {
        console.log("📤 Uploading", form.images.length, "images to Cloudinary");
        form.images.forEach((image, index) => {
          console.log(
            `  Image ${index + 1}:`,
            image.name,
            `(${(image.size / 1024).toFixed(2)}KB)`,
          );
          formDataObj.append("images[]", image);
        });
      } else {
        console.log(
          "ℹ️ No new images selected - only updating product details",
        );
      }

      // Append delete_image_ids[] for any images selected to remove
      if (imagesToRemove.length > 0) {
        imagesToRemove.forEach((imgId) =>
          formDataObj.append("delete_image_ids[]", String(imgId)),
        );
      }

      console.log("🔄 Sending PUT request to /admin/products/" + id, {
        replace_images: replaceImages,
      });
      await updateProductApi(id, formDataObj);
      console.log("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("❌ Error updating product:", err);
      console.error("Response:", err.response?.data);
      setError(
        "Could not update product. Please check the form and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading product for editing..." />;
  }

  return (
    <div className="admin-crud">
      <div className="admin-crud-header">
        <div>
          <h2>Edit Product</h2>
          <p>
            Update product details and add images (images append by default).
          </p>
        </div>
        <Link className="btn btn-outline-secondary" to="/admin/products">
          Back
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form className="admin-crud-card p-4" onSubmit={handleSubmit}>
        {currentImages.length > 0 && (
          <div className="product-gallery mb-4">
            {currentImages.map((image) => {
              const removed = imagesToRemove.includes(image.id);
              return (
                <div
                  key={image.id || image.image_url}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginRight: 8,
                  }}
                >
                  <img
                    src={image.image_url}
                    alt={form.name}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 6,
                      opacity: removed ? 0.45 : 1,
                    }}
                  />
                  <button
                    type="button"
                    className={`btn btn-sm ${removed ? "btn-danger" : "btn-outline-danger"}`}
                    style={{ position: "absolute", top: 6, right: 6 }}
                    onClick={() => {
                      setImagesToRemove((curr) => {
                        if (curr.includes(image.id))
                          return curr.filter((i) => i !== image.id);
                        return [...curr, image.id];
                      });
                    }}
                    title={removed ? "Undo remove" : "Remove this image"}
                  >
                    <i className="bi bi-trash" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="admin-form-grid">
          <div>
            <label className="form-label">Name</label>
            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Slug</label>
            <input
              className="form-control"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Category</label>
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
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="form-label">Price</label>
            <input
              className="form-control"
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Stock</label>
            <input
              className="form-control"
              type="number"
              min="0"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="full">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div className="full">
            <label className="form-label">Add Images (will append)</label>
            <input
              className="form-control"
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleChange}
            />
            <div className="form-text mt-2">
              By default new images are appended. Check to replace existing
              images.
            </div>
            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="replaceImages"
                checked={replaceImages}
                onChange={(e) => setReplaceImages(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="replaceImages">
                Replace existing images
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Link className="btn btn-light" to="/admin/products">
            Cancel
          </Link>
          <button className="btn btn-primary" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
