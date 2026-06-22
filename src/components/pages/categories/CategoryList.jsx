import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaPlus,
  FaSyncAlt,
  FaTrash,
  FaSearch,
  FaTags,
  FaBox,
  FaList,
  FaArrowUp,
} from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import {
  deleteCategoryApi,
  getAllCategoriesApi,
} from "../../services/categoryService";
import { getAllProductsApi } from "../../services/productService";
import { extractCollection } from "../../services/apiHelpers";
import LoadingSpinner from "../../common/LoadingSpinner";
import "../adminCrud.css";

const CategoryList = () => {
  const { isDarkGold } = useTheme();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const [categoryResponse, productResponse] = await Promise.all([
        getAllCategoriesApi(),
        getAllProductsApi(),
      ]);
      setCategories(extractCollection(categoryResponse, "categories"));
      setProducts(extractCollection(productResponse, "products"));
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
          `❌ Database Error: ${err.response.data?.message || "Could not load categories."}`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchCategories, 0);
    return () => window.clearTimeout(timer);
  }, [fetchCategories]);

  useEffect(() => {
    let result = categories;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(term) ||
          category.slug.toLowerCase().includes(term),
      );
    }
    setFilteredCategories(result);
  }, [categories, searchTerm]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this category? Products in this category may also be affected.",
      )
    )
      return;
    try {
      await deleteCategoryApi(id);
      setCategories((current) =>
        current.filter((category) => category.id !== id),
      );
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category.");
    }
  };

  const getProductCount = (categoryId) =>
    products.filter((p) => Number(p.category_id) === Number(categoryId)).length;

  const stats = {
    total: categories.length,
    totalProducts: products.length,
    avgProductsPerCategory:
      categories.length > 0
        ? Math.round(products.length / categories.length)
        : 0,
  };

  const categoryColors = [
    { grad: "linear-gradient(135deg, #ec4899, #db2777)", icon: "🏷️" },
    { grad: "linear-gradient(135deg, #6366f1, #4f46e5)", icon: "📌" },
    { grad: "linear-gradient(135deg, #14b8a6, #0d9488)", icon: "🎯" },
    { grad: "linear-gradient(135deg, #f59e0b, #d97706)", icon: "✨" },
    { grad: "linear-gradient(135deg, #8b5cf6, #7c3aed)", icon: "💫" },
    { grad: "linear-gradient(135deg, #3b82f6, #2563eb)", icon: "⭐" },
  ];

  const getCategoryColor = (index) =>
    categoryColors[index % categoryColors.length];

  return (
    <div className="admin-dashboard-container">
      <div className="content-wrapper">
        <div className="dashboard-header compact">
          <div className="header-content">
            <h2>Category Management</h2>
            <p className="muted">
              Manage product categories quick edits and bulk overview
            </p>
          </div>

          <div className="header-actions toolbar">
            <div className="toolbar-left">
              <button
                className={`btn btn-sm btn-outline-secondary me-2 ${isLoading ? "spinning" : ""}`}
                onClick={fetchCategories}
                disabled={isLoading}
                title="Refresh"
              >
                <FaSyncAlt />
              </button>
              <Link
                to="/admin/categories/create"
                className="btn btn-sm btn-primary"
              >
                <FaPlus className="me-1" /> Add Category
              </Link>
            </div>

            <div className="toolbar-right d-flex align-items-center">
              <div className="search-wrapper me-2">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="form-control form-control-sm search-input"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                /> 
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <div>{error}</div>
            <button className="btn-close" onClick={() => setError("")}></button>
          </div>
        )}

        <div className="table-card compact">
          {isLoading ? (
            <LoadingSpinner message="Loading categories..." />
          ) : filteredCategories.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-emoji">
                {categories.length === 0 ? "🏷️" : "🔍"}
              </div>
              <p className="empty-title">
                {categories.length === 0
                  ? "No categories yet"
                  : "No results found"}
              </p>
              <p className="empty-description">
                {categories.length === 0
                  ? "Start by creating your first category"
                  : "Try adjusting your search"}
              </p>
            </div>
          ) : (
            <div className="table-wrapper table-dark-style">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th style={{ width: 380 }}>Product / Category</th>
                    <th>Description</th>
                    <th style={{ width: 130 }}>Products</th>
                    <th style={{ width: 100 }}>Status</th>
                    <th style={{ width: 140, textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category, index) => {
                    const { grad, icon } = getCategoryColor(index);
                    const productCount = getProductCount(category.id);
                    return (
                      <tr key={category.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                style={{
                                  width: 56,
                                  height: 56,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                }}
                                className="me-3"
                              />
                            ) : (
                              <div
                                className="me-3"
                                style={{
                                  width: 56,
                                  height: 56,
                                  borderRadius: 8,
                                  background: grad,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#fff",
                                  fontSize: 18,
                                }}
                              >
                                {icon}
                              </div>
                            )}
                            <div>
                              <div className="fw-bold">{category.name}</div>
                              <div className="text-muted small">
                                {category.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="text-muted small">
                            {category.description || "-"}
                          </div>
                        </td>

                        <td>
                          <span className="badge bg-success">
                            {productCount} items
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge ${category.is_active ? "bg-success" : "bg-secondary"}`}
                          >
                            {category.is_active ? "active" : "inactive"}
                          </span>
                        </td>

                        <td className="text-center">
                          <div
                            className="btn-group"
                            role="group"
                            aria-label="actions"
                          >
                            <Link
                              to={`/admin/categories/${category.id}`}
                              className="btn btn-sm btn-outline-light"
                              title="View"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8z" />
                                <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                              </svg>
                            </Link>
                            <Link
                              to={`/admin/categories/${category.id}/edit`}
                              className="btn btn-sm btn-warning"
                              title="Edit"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(category.id)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
