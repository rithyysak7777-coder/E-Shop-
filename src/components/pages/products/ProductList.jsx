import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaEye,
  FaPlus,
  FaSyncAlt,
  FaTrash,
  FaSearch,
  FaBox,
  FaChartLine,
  FaShoppingCart,
  FaArrowUp,
  FaFire,
} from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import {
  deleteProductApi,
  getAllProductsApi,
} from "../../services/productService";
import { getAllCategoriesApi } from "../../services/categoryService";
import { extractCollection } from "../../services/apiHelpers";
import LoadingSpinner from "../../common/LoadingSpinner";
import "../adminCrud.css";

const ProductList = () => {
  const { isDarkGold } = useTheme();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const [productResponse, categoryResponse] = await Promise.all([
        getAllProductsApi(),
        getAllCategoriesApi(),
      ]);
      setProducts(extractCollection(productResponse, "products"));
      setCategories(extractCollection(categoryResponse, "categories"));
    } catch (err) {
      console.error("🔴 API Fetch Error:", err.response || err);

      if (err.response?.status === 401) {
        setError("❌ Unauthorized: Please login again.");
      } else if (err.response?.status === 403) {
        setError("❌ Access Denied: Admin privileges required.");
      } else if (!err.response) {
        const apiBase =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
        setError(
          `❌ Network Error: Cannot reach ${apiBase}. Is 'php artisan serve' running?`,
        );
      } else {
        setError(
          `❌ Database Error: ${err.response.data?.message || "Could not load products."}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchProducts, 0);
    return () => window.clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    let result = products;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.slug.toLowerCase().includes(term),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((product) => product.status === statusFilter);
    }

    setFilteredProducts(result);
  }, [products, searchTerm, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await deleteProductApi(id);
      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  const categoryName = (categoryId) =>
    categories.find((category) => Number(category.id) === Number(categoryId))
      ?.name || "-";

  const productImage = (product) =>
    product.product_images?.[0]?.image_url ||
    product.productImages?.[0]?.image_url;

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    lowStock: products.filter((p) => Number(p.stock) < 10).length,
    totalValue: products.reduce(
      (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0),
      0,
    ),
  };

  return (
    <div className="admin-dashboard-container">
      <style>{`
        .admin-dashboard-container {
          background: linear-gradient(135deg, var(--shop-bg) 0%, var(--shop-surface) 100%);
          color: var(--shop-text);
          min-height: 100vh;
          padding: 32px 24px;
        }

        .dashboard-header {
          margin-bottom: 40px;
          animation: slideInDown 0.5s ease;
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          flex-wrap: wrap;
        }

        .header-content h1 {
          font-size: 36px;
          font-weight: 800;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #f59e0b, #f97316, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-content p {
          color: var(--shop-muted);
          font-size: 15px;
          margin: 0;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-refresh,
        .btn-add-product {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .btn-refresh {
          background: rgba(251, 146, 60, 0.1);
          color: #f97316;
          border: 2px solid #f97316;
        }

        .btn-refresh:hover {
          background: #f97316;
          color: white;
          transform: translateY(-2px);
        }

        .btn-add-product {
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: white;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
        }

        .btn-add-product:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .btn-refresh.spinning svg {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 36px;
        }

        .stat-card {
          background: var(--shop-surface);
          border: 1px solid var(--shop-border);
          border-radius: 16px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #f59e0b, #f97316);
        }

        .stat-card:nth-child(2)::before {
          background: linear-gradient(90deg, #10b981, #14b8a6);
        }

        .stat-card:nth-child(3)::before {
          background: linear-gradient(90deg, #8b5cf6, #d946ef);
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .stat-card-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--shop-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .stat-number {
          font-size: 42px;
          font-weight: 800;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-card:nth-child(2) .stat-number {
          background: linear-gradient(135deg, #10b981, #14b8a6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-card:nth-child(3) .stat-number {
          background: linear-gradient(135deg, #8b5cf6, #d946ef);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-trend {
          font-size: 13px;
          color: #10b981;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-icon-box {
          width: 70px;
          height: 70px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(249, 115, 22, 0.05));
          color: #f97316;
        }

        .stat-card:nth-child(2) .stat-icon-box {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.05));
          color: #10b981;
        }

        .stat-card:nth-child(3) .stat-icon-box {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.05));
          color: #d946ef;
        }

        .alert-box {
          background: rgba(239, 68, 68, 0.1);
          border-left: 4px solid #ef4444;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          animation: slideInDown 0.3s ease;
        }

        .alert-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .alert-message {
          flex: 1;
          color: var(--shop-text);
          font-size: 14px;
          line-height: 1.5;
        }

        .alert-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: var(--shop-muted);
          padding: 0;
          width: 24px;
          height: 24px;
        }

        .search-filter-bar {
          display: flex;
          gap: 14px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-wrapper {
          flex: 1;
          min-width: 280px;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--shop-muted);
          font-size: 16px;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 12px 14px 12px 40px;
          border: 2px solid var(--shop-border);
          border-radius: 10px;
          background: var(--shop-bg);
          color: var(--shop-text);
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
          background: var(--shop-surface);
        }

        .filter-select {
          padding: 12px 14px;
          border: 2px solid var(--shop-border);
          border-radius: 10px;
          background: var(--shop-surface);
          color: var(--shop-text);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 150px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
        }

        .table-card {
          background: var(--shop-surface);
          border: 1px solid var(--shop-border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          animation: slideInUp 0.5s ease;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
        }

        .products-table thead {
          background: linear-gradient(90deg, var(--shop-surface-2), var(--shop-surface));
          border-bottom: 2px solid var(--shop-border);
        }

        .products-table th {
          padding: 16px 14px;
          text-align: left;
          font-weight: 700;
          color: var(--shop-text);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .products-table tbody tr {
          border-bottom: 1px solid var(--shop-border);
          transition: all 0.2s ease;
        }

        .products-table tbody tr:hover {
          background-color: var(--shop-surface-2, rgba(0, 0, 0, 0.02));
        }

        .products-table td {
          padding: 14px;
        }

        .product-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .product-thumbnail {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          object-fit: cover;
          border: 2px solid var(--shop-border);
        }

        .thumbnail-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .product-info {
          flex: 1;
        }

        .product-name {
          font-weight: 700;
          color: var(--shop-text);
          margin: 0 0 2px 0;
          font-size: 14px;
        }

        .product-slug {
          color: var(--shop-muted);
          font-size: 12px;
          margin: 0;
        }

        .category-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.1));
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .price-text {
          color: var(--shop-text);
          font-weight: 700;
          font-size: 14px;
        }

        .stock-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.1));
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .stock-badge.low {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.1));
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.1));
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-badge.inactive {
          background: linear-gradient(135deg, rgba(107, 114, 128, 0.15), rgba(107, 114, 128, 0.1));
          color: #6b7280;
          border-color: rgba(107, 114, 128, 0.3);
        }

        .actions-buttons {
          display: flex;
          gap: 8px;
        }

        .action-button {
          width: 38px;
          height: 38px;
          border: 1px solid var(--shop-border);
          border-radius: 8px;
          background: var(--shop-bg);
          color: var(--shop-text);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          font-size: 15px;
        }

        .action-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
        }

        .action-button.view {
          color: #10b981;
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .action-button.edit {
          color: #f97316;
          border-color: #f97316;
          background: rgba(249, 115, 22, 0.05);
        }

        .action-button.delete {
          color: #ef4444;
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .action-button.view:hover {
          background: rgba(16, 185, 129, 0.15);
        }

        .action-button.edit:hover {
          background: rgba(249, 115, 22, 0.15);
        }

        .action-button.delete:hover {
          background: rgba(239, 68, 68, 0.15);
        }

        .empty-state-box {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-emoji {
          font-size: 80px;
          margin-bottom: 20px;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--shop-text);
          margin: 0 0 10px 0;
        }

        .empty-description {
          color: var(--shop-muted);
          font-size: 14px;
          margin: 0;
        }

        @media (max-width: 768px) {
          .admin-dashboard-container {
            padding: 20px 16px;
          }

          .header-content h1 {
            font-size: 24px;
          }

          .header-wrapper {
            flex-direction: column;
            gap: 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .search-filter-bar {
            flex-direction: column;
          }

          .search-wrapper {
            min-width: 100%;
          }

          .filter-select {
            min-width: 100%;
          }

          .products-table {
            font-size: 12px;
          }

          .products-table th,
          .products-table td {
            padding: 12px 8px;
          }

          .product-thumbnail {
            width: 36px;
            height: 36px;
          }

          .thumbnail-placeholder {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }

          .action-button {
            width: 34px;
            height: 34px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <div className="header-wrapper">
          <div className="header-content">
            <h1>Product Management</h1>
            <p>Manage inventory, pricing, and categories with ease</p>
          </div>
          <div className="header-actions">
            <button
              className={`btn-refresh ${isLoading ? "spinning" : ""}`}
              onClick={fetchProducts}
              disabled={isLoading}
            >
              <FaSyncAlt />
              Refresh
            </button>
            <Link className="btn-add-product" to="/admin/products/create">
              <FaPlus />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p className="stat-label">Total Products</p>
              <h3 className="stat-number">{stats.total}</h3>
              <span className="stat-trend">
                <FaArrowUp /> {stats.active} active
              </span>
            </div>
            <div className="stat-icon-box">
              <FaBox />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p className="stat-label">Active Products</p>
              <h3 className="stat-number">{stats.active}</h3>
              <span className="stat-trend">Published items</span>
            </div>
            <div className="stat-icon-box">
              <FaShoppingCart />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p className="stat-label">Inventory Value</p>
              <h3 className="stat-number">${stats.totalValue.toFixed(0)}</h3>
              <span className="stat-trend">{stats.lowStock} low stock</span>
            </div>
            <div className="stat-icon-box">
              <FaChartLine />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert-box">
          <span className="alert-icon">⚠️</span>
          <div className="alert-message">{error}</div>
          <button className="alert-close-btn" onClick={() => setError("")}>
            ✕
          </button>
        </div>
      )}

      <div className="search-filter-bar">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="table-card">
        {isLoading ? (
          <LoadingSpinner message="Loading products..." />
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state-box">
            <div className="empty-emoji">
              {products.length === 0 ? "📦" : "🔍"}
            </div>
            <p className="empty-title">
              {products.length === 0 ? "No products yet" : "No results found"}
            </p>
            <p className="empty-description">
              {products.length === 0
                ? "Start by creating your first product"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        {productImage(product) ? (
                          <img
                            src={productImage(product)}
                            alt={product.name}
                            className="product-thumbnail"
                          />
                        ) : (
                          <div className="thumbnail-placeholder">
                            <FaBox />
                          </div>
                        )}
                        <div className="product-info">
                          <p className="product-name">{product.name}</p>
                          <p className="product-slug">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">
                        {categoryName(product.category_id)}
                      </span>
                    </td>
                    <td>
                      <span className="price-text">
                        ${Number(product.price || 0).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`stock-badge ${
                          Number(product.stock) < 10 ? "low" : ""
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          product.status === "inactive" ? "inactive" : ""
                        }`}
                      >
                        {product.status || "active"}
                      </span>
                    </td>
                    <td>
                      <div className="actions-buttons">
                        <Link
                          to={`/admin/products/${product.id}`}
                          className="action-button view"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="action-button edit"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="action-button delete"
                          onClick={() => handleDelete(product.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
