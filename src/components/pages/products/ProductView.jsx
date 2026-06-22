import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllCategoriesApi } from "../../services/categoryService";
import { getProductByIdApi } from "../../services/productService";
import { extractCollection, extractResource } from "../../services/apiHelpers";
import LoadingSpinner from "../../common/LoadingSpinner";
import "../adminCrud.css";

const ProductView = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          getProductByIdApi(id),
          getAllCategoriesApi(),
        ]);
        setProduct(extractResource(productResponse, "product"));
        setCategories(extractCollection(categoryResponse, "categories"));
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Could not load this product.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const categoryName =
    categories.find(
      (category) => Number(category.id) === Number(product?.category_id),
    )?.name || "-";
  const images = product?.product_images || product?.productImages || [];

  if (isLoading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  return (
    <div className="admin-crud">
      <div className="admin-crud-header">
        <div>
          <h2>Product Details</h2>
          <p>View product information from the database.</p>
        </div>
        <div className="admin-actions">
          <Link className="btn btn-outline-secondary" to="/admin/products">
            Back
          </Link>
          {product && (
            <Link
              className="btn btn-primary"
              to={`/admin/products/${product.id}/edit`}
            >
              Edit
            </Link>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {product && (
        <div className="admin-crud-card overflow-hidden">
          {/* Cover Banner */}
          <div
            style={{
              height: "120px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              position: "relative",
            }}
          />

          {/* Product Gallery Header Overlay */}
          <div
            className="px-4 pb-4 d-flex flex-column flex-md-row align-items-center align-items-md-end gap-3"
            style={{
              marginTop: "-60px",
              marginBottom: "20px",
              position: "relative",
              zIndex: 2,
            }}
          >
            {images.length > 0 ? (
              <img
                className="shadow border border-4 border-white rounded-3"
                src={images[0]?.image_url}
                alt={product.name}
                style={{
                  width: "110px",
                  height: "110px",
                  objectFit: "cover",
                  background: "#f8fafc",
                }}
              />
            ) : (
              <div
                className="shadow border border-4 border-white rounded-3 d-flex align-items-center justify-content-center bg-warning text-white"
                style={{
                  width: "110px",
                  height: "110px",
                  fontSize: "40px",
                  fontWeight: "bold",
                }}
              >
                <i className="bi bi-box" />
              </div>
            )}
            <div className="text-center text-md-start mb-1">
              <h3 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                {product.name}
              </h3>
              <p className="text-muted mb-0 small d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                <span
                  className="badge bg-secondary"
                  style={{ fontSize: "11px" }}
                >
                  {categoryName}
                </span>
                <span
                  className={`badge ${product.status === "inactive" ? "bg-secondary" : "bg-success"}`}
                  style={{ fontSize: "11px" }}
                >
                  {product.status || "active"}
                </span>
                <span className="fw-bold text-dark">
                  ${Number(product.price || 0).toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          {images.length > 1 && (
            <div className="px-4 mb-4">
              <h6
                className="text-muted text-uppercase fw-bold mb-2"
                style={{ fontSize: "11px", letterSpacing: "0.05em" }}
              >
                All Gallery Images
              </h6>
              <div className="product-gallery d-flex gap-2">
                {images.slice(1).map((image) => (
                  <img
                    key={image.id || image.image_url}
                    src={image.image_url}
                    alt={product.name}
                    className="border rounded cursor-pointer"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      transition: "0.2s",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="p-4 pt-0">
            <dl className="admin-detail-list">
              <div>
                <dt>Product ID</dt>
                <dd>#{product.id}</dd>
              </div>
              <div>
                <dt>Product Name</dt>
                <dd>{product.name}</dd>
              </div>
              <div>
                <dt>URL Slug</dt>
                <dd>
                  <code>{product.slug}</code>
                </dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>
                  <span className="badge bg-light text-dark border px-3 py-1.5 fw-semibold">
                    {categoryName}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Price (USD)</dt>
                <dd>
                  <span className="fw-bold text-primary">
                    ${Number(product.price || 0).toFixed(2)}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Stock Level</dt>
                <dd>
                  <span
                    className={`fw-bold ${Number(product.stock) < 5 ? "text-danger" : "text-dark"}`}
                  >
                    {product.stock} units
                  </span>
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span
                    className={`badge ${product.status === "inactive" ? "bg-secondary" : "bg-success"}`}
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                  >
                    {product.status || "active"}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Description</dt>
                <dd
                  className="text-muted fw-normal"
                  style={{ fontSize: "14px", lineHeight: "1.6" }}
                >
                  {product.description || "No description provided."}
                </dd>
              </div>
              <div>
                <dt>Created Date</dt>
                <dd>
                  {product.created_at
                    ? new Date(product.created_at).toLocaleString()
                    : "-"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;
