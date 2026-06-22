import React, { useEffect, useState, useContext, useCallback } from "react";
import { api } from "../../api/axios";
import { CartContext } from "../../contexts/CartContext";
import LoadingSpinner from "../../common/LoadingSpinner";
import { extractCollection } from "../../services/apiHelpers";

const Storefront = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (
      name.includes("tech") ||
      name.includes("elect") ||
      name.includes("phone") ||
      name.includes("comput")
    )
      return "bi-cpu-fill";
    if (
      name.includes("cloth") ||
      name.includes("shirt") ||
      name.includes("fashion") ||
      name.includes("wear")
    )
      return "bi-tags-fill";
    if (
      name.includes("book") ||
      name.includes("read") ||
      name.includes("educat")
    )
      return "bi-book-half";
    if (
      name.includes("home") ||
      name.includes("furnit") ||
      name.includes("kitchen")
    )
      return "bi-house-heart-fill";
    if (
      name.includes("food") ||
      name.includes("drink") ||
      name.includes("grocer")
    )
      return "bi-cup-hot-fill";
    if (name.includes("sport") || name.includes("fit") || name.includes("run"))
      return "bi-dribbble";
    return "bi-grid-fill";
  };

  const getCategoryGradient = (index) => {
    const gradients = [
      "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", // Blue
      "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)", // Pink
      "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", // Green
      "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", // Amber
      "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)", // Purple
      "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)", // Teal
    ];
    return gradients[index % gradients.length];
  };

  const getCategoryTextColor = (index) => {
    const colors = [
      "#3b82f6", // Blue
      "#ec4899", // Pink
      "#10b981", // Green
      "#f59e0b", // Amber
      "#8b5cf6", // Purple
      "#14b8a6", // Teal
    ];
    return colors[index % colors.length];
  };

  const getProductCountForCategory = (catId) => {
    return products.filter((p) => Number(p.category_id) === Number(catId))
      .length;
  };

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Cart Context
  const { addToCart } = useContext(CartContext);
  const [addedMessage, setAddedMessage] = useState(null);

  // Quick View Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewQuantity, setQuickViewQuantity] = useState(1);

  const fetchStoreData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const [productResponse, categoryResponse] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);

      const prodList = extractCollection(productResponse.data, "products");
      const catList = extractCollection(categoryResponse.data, "categories");

      // Filter out inactive products
      const activeProducts = prodList.filter((p) => p.status !== "inactive");

      setProducts(activeProducts);
      setFilteredProducts(activeProducts);
      setCategories(catList);
    } catch (err) {
      console.error("Error fetching storefront data:", err);
      setError("Could not load products. Please check the backend connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  // Apply filters
  useEffect(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => Number(product.category_id) === Number(selectedCategory),
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query)),
      );
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, products]);

  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product, quantity);

    // Trigger success message flash
    setAddedMessage(`Added ${quantity} x ${product.name} to cart!`);
    setTimeout(() => {
      setAddedMessage(null);
    }, 2500);
  };

  const getProductImage = (product) => {
    const images = product?.product_images || product?.productImages || [];
    return images[0]?.image_url || null;
  };

  const getCategoryName = (categoryId) => {
    return (
      categories.find((cat) => Number(cat.id) === Number(categoryId))?.name ||
      "Uncategorized"
    );
  };

  return (
    <div className="container py-5">
      {/* Visual Header / Banner */}
      <div
        className="rounded-4 p-4 p-md-5 mb-5 text-white shadow-sm"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", zIndex: 2, maxWidth: "600px" }}>
          <span
            className="badge mb-3 px-3 py-2 rounded-pill text-uppercase fw-bold"
            style={{
              background: "#4f6ff7",
              fontSize: "11px",
              letterSpacing: "1px",
            }}
          >
            Summer Deals
          </span>
          <h1
            className="display-4 fw-extrabold mb-3"
            style={{ fontWeight: 800 }}
          >
            Find Your Next Favorite Item
          </h1>
          <p className="lead mb-4 text-white-50">
            Browse our curated categories of premium products, secure ordering,
            and fast shipping directly to your doorstep.
          </p>
        </div>
        {/* Background decorative shapes */}
        <div
          className="position-absolute rounded-circle"
          style={{
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(79, 111, 247, 0.2) 0%, transparent 70%)",
            top: "-50px",
            right: "-50px",
            zIndex: 1,
          }}
        />
      </div>

      {/* Floating Success Alert */}
      {addedMessage && (
        <div
          className="position-fixed bottom-4 end-4 bg-dark text-white px-4 py-3 rounded-4 shadow-lg border border-secondary d-flex align-items-center gap-2"
          style={{
            zIndex: 1050,
            bottom: "30px",
            right: "30px",
            animation: "slideIn 0.3s ease-out forwards",
            background: "#1e293b",
          }}
        >
          <i className="bi bi-check-circle-fill text-success fs-5"></i>
          <span className="fw-semibold">{addedMessage}</span>
        </div>
      )}

      {/* Category Cards Section */}
      <div className="mb-5">
        <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
          <i
            className="bi bi-grid-3x3-gap-fill text-primary"
            style={{ fontSize: "20px" }}
          ></i>
          Browse Categories
        </h4>
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
          {/* Card: All Categories */}
          <div className="col">
            <div
              onClick={() => setSelectedCategory("all")}
              className={`card h-100 border-0 rounded-4 text-center p-3 category-card cursor-pointer ${
                selectedCategory === "all"
                  ? "active-category shadow"
                  : "shadow-sm"
              }`}
              style={{
                background:
                  selectedCategory === "all"
                    ? "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)"
                    : "#ffffff",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
                cursor: "pointer",
                color: selectedCategory === "all" ? "#fff" : "#1e293b",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mx-auto rounded-circle mb-2"
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    selectedCategory === "all"
                      ? "rgba(255, 255, 255, 0.2)"
                      : "#f1f5f9",
                  color: selectedCategory === "all" ? "#fff" : "#3b82f6",
                  fontSize: "20px",
                }}
              >
                <i className="bi bi-grid-fill"></i>
              </div>
              <h6 className="fw-bold mb-1 small">All Items</h6>
              <span className="small opacity-75" style={{ fontSize: "11px" }}>
                {products.length} Products
              </span>
            </div>
          </div>

          {/* Cards for each category */}
          {categories.map((cat, index) => {
            const count = getProductCountForCategory(cat.id);
            const isSelected = Number(selectedCategory) === Number(cat.id);
            const gradient = isSelected
              ? "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)"
              : getCategoryGradient(index);
            const icon = getCategoryIcon(cat.name);
            const textColor = getCategoryTextColor(index);

            return (
              <div className="col" key={cat.id}>
                <div
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`card h-100 border-0 rounded-4 text-center p-3 category-card cursor-pointer ${
                    isSelected ? "active-category shadow" : "shadow-sm"
                  }`}
                  style={{
                    background: gradient,
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    color: isSelected ? "#fff" : "#1e293b",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center mx-auto rounded-circle mb-2"
                    style={{
                      width: "48px",
                      height: "48px",
                      background: isSelected
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(255,255,255,0.7)",
                      color: isSelected ? "#fff" : textColor,
                      fontSize: "20px",
                    }}
                  >
                    <i className={`bi ${icon}`}></i>
                  </div>
                  <h6
                    className="fw-bold mb-1 small text-truncate"
                    title={cat.name}
                  >
                    {cat.name}
                  </h6>
                  <span
                    className="small opacity-75"
                    style={{ fontSize: "11px" }}
                  >
                    {count} Products
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-8 mx-auto">
          <div className="input-group input-group-lg shadow-sm rounded-4 overflow-hidden border">
            <span className="input-group-text border-0 bg-white text-muted ps-4">
              <i className="bi bi-search fs-5"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 px-2 py-3"
              placeholder="Search through categories and items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: "16px", outline: "none", boxShadow: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {error && (
        <div className="alert alert-danger shadow-sm rounded-3">{error}</div>
      )}

      {isLoading ? (
        <LoadingSpinner message="Fetching store catalogue..." />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-5 my-5">
          <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
          <h4 className="fw-bold text-dark">No products found</h4>
          <p className="text-muted">
            Try adjusting your filters or search keywords.
          </p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {filteredProducts.map((product) => {
            const hasStock = Number(product.stock) > 0;
            const imgUrl = getProductImage(product);

            return (
              <div className="col" key={product.id}>
                <div
                  className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden storefront-card"
                  style={{
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Image wrapper */}
                  <div
                    className="position-relative overflow-hidden cursor-pointer"
                    onClick={() => {
                      setSelectedProduct(product);
                      setQuickViewQuantity(1);
                    }}
                    style={{
                      background: "#f8fafc",
                      paddingTop: "80%",
                      width: "100%",
                    }}
                  >
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={product.name}
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                      />
                    ) : (
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light text-muted">
                        <i className="bi bi-image fs-1 opacity-25"></i>
                      </div>
                    )}
                    {/* Badges */}
                    <div
                      className="position-absolute top-3 start-3 d-flex flex-column gap-1.5"
                      style={{ top: "12px", left: "12px" }}
                    >
                      <span
                        className="badge bg-dark px-2.5 py-1.5 rounded-pill"
                        style={{ fontSize: "11px" }}
                      >
                        {getCategoryName(product.category_id)}
                      </span>
                      {!hasStock && (
                        <span
                          className="badge bg-danger px-2.5 py-1.5 rounded-pill"
                          style={{ fontSize: "11px" }}
                        >
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div
                    className="card-body p-4 d-flex flex-column"
                    style={{ flexGrow: 1 }}
                  >
                    <div
                      className="text-muted small fw-semibold text-uppercase mb-1"
                      style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                    >
                      {getCategoryName(product.category_id)}
                    </div>
                    <h5
                      className="card-title fw-bold text-dark text-truncate mb-2 cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setQuickViewQuantity(1);
                      }}
                      title={product.name}
                    >
                      {product.name}
                    </h5>
                    <p
                      className="card-text text-muted mb-4 small text-clamp-2"
                      style={{
                        height: "38px",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.description || "No description provided."}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span
                        className="fs-4 fw-extrabold text-primary"
                        style={{ fontWeight: 800 }}
                      >
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                          onClick={() => {
                            setSelectedProduct(product);
                            setQuickViewQuantity(1);
                          }}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-primary d-flex align-items-center gap-2 px-3"
                          onClick={() => handleAddToCart(product)}
                          disabled={!hasStock}
                          style={{
                            borderRadius: "10px",
                            background: hasStock
                              ? "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)"
                              : "#cbd5e1",
                            border: "none",
                          }}
                        >
                          <i className="bi bi-cart-plus"></i>
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header border-0 pb-0">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedProduct(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4 p-md-5 pt-0">
                <div className="row g-4">
                  {/* Image Grid */}
                  <div className="col-12 col-md-6">
                    <div
                      className="rounded-4 bg-light overflow-hidden d-flex align-items-center justify-content-center"
                      style={{ height: "320px" }}
                    >
                      {getProductImage(selectedProduct) ? (
                        <img
                          src={getProductImage(selectedProduct)}
                          alt={selectedProduct.name}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <i className="bi bi-image fs-1 opacity-25"></i>
                      )}
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="col-12 col-md-6 d-flex flex-column justify-content-between">
                    <div>
                      <span className="badge bg-light text-primary border border-primary px-3 py-1.5 fw-semibold mb-2">
                        {getCategoryName(selectedProduct.category_id)}
                      </span>
                      <h3 className="fw-bold text-dark mb-2">
                        {selectedProduct.name}
                      </h3>
                      <h4
                        className="fw-extrabold text-primary mb-3"
                        style={{ fontWeight: 800 }}
                      >
                        ${Number(selectedProduct.price).toFixed(2)}
                      </h4>
                      <p
                        className="text-muted small mb-4"
                        style={{ lineHeight: "1.6" }}
                      >
                        {selectedProduct.description ||
                          "No description provided."}
                      </p>

                      <div className="mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <span className="text-secondary small fw-semibold">
                            Quantity:
                          </span>
                          <div
                            className="input-group shadow-sm border border-light rounded-pill overflow-hidden"
                            style={{ width: "120px" }}
                          >
                            <button
                              className="btn btn-light bg-white border-0 py-1"
                              onClick={() =>
                                setQuickViewQuantity((q) => Math.max(1, q - 1))
                              }
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="form-control border-0 text-center bg-white font-monospace fw-bold py-1"
                              value={quickViewQuantity}
                              readOnly
                              style={{ width: "30px" }}
                            />
                            <button
                              className="btn btn-light bg-white border-0 py-1"
                          onClick={() =>
                            setQuickViewQuantity((q) =>
                              Math.min(Number(selectedProduct.stock) || 1, q + 1),
                            )
                          }
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="mt-2.5 mt-2">
                          <small className="text-secondary">
                            Stock level:{" "}
                            <span
                              className={
                                Number(selectedProduct.stock) < 5
                                  ? "text-danger fw-bold"
                                  : "fw-bold text-dark"
                              }
                            >
                              {selectedProduct.stock} units
                            </span>
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="d-grid mt-4">
                      <button
                        className="btn btn-lg btn-primary d-flex align-items-center justify-content-center gap-2"
                        onClick={() => {
                          handleAddToCart(selectedProduct, quickViewQuantity);
                          setSelectedProduct(null);
                        }}
                        disabled={Number(selectedProduct.stock) <= 0}
                        style={{
                          borderRadius: "15px",
                          background:
                            Number(selectedProduct.stock) > 0
                              ? "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)"
                              : "#cbd5e1",
                          border: "none",
                        }}
                      >
                        <i className="bi bi-cart3"></i>
                        <span>
                          Add to Cart - $
                          {(
                            Number(selectedProduct.price) * quickViewQuantity
                          ).toFixed(2)}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styled inject animations */}
      <style>{`
        .category-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.08) !important;
        }
        .active-category {
          border: 1px solid transparent !important;
        }
        .storefront-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        }
        .storefront-card:hover img {
          transform: scale(1.06);
        }
        @keyframes slideIn {
          from {
            transform: translateY(20px) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Storefront;
