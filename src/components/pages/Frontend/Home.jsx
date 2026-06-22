import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/axios";
import { extractCollection } from "../../services/apiHelpers";
import { useTheme } from "../../contexts/ThemeContext";

const Home = () => {
  const { isDarkGold } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);

        const allProducts = extractCollection(productsRes.data, "products");

        const activeProducts = allProducts
          .filter((p) => p.status !== "inactive")
          .slice(0, 8);

        setFeaturedProducts(activeProducts);
        setCategories(extractCollection(categoriesRes.data, "categories"));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterMessage("Thanks for subscribing!");
      setEmail("");
      setTimeout(() => setNewsletterMessage(""), 3000);
    }
  };

  const themeGradient = isDarkGold 
    ? "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)" 
    : "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)";

  const themeGlow = isDarkGold
    ? "0 8px 25px rgba(251, 191, 36, 0.25)"
    : "0 8px 25px rgba(79, 111, 247, 0.25)";

  return (
    <div style={{ background: "var(--shop-bg)", transition: "all 0.3s ease", minHeight: "100vh" }}>
      {/* ===== HERO SECTION ===== */}
      <section
        style={{
          background: themeGradient,
          color: isDarkGold ? "#0f172a" : "white",
          padding: "120px 20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.08,
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.1%27%3E%3Cpath d=%270 0h60v60H0z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        ></div>
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: "-0.02em" }}>Welcome to E-Shop</h1>
          <p
            className="fs-5 mb-5"
            style={{ maxWidth: "650px", margin: "0 auto 30px", opacity: 0.9, fontWeight: 500 }}
          >
            Discover a world of quality products curated just for you. Fast
            shipping, secure checkout, and exceptional customer service.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link
              to="/products"
              className={`btn btn-lg fw-bold px-5 ${isDarkGold ? "btn-dark" : "btn-light"}`}
              style={{
                borderRadius: "10px",
                padding: "14px 40px",
                fontSize: "16px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                background: isDarkGold ? "#090d16" : "#ffffff",
                border: "none",
                color: isDarkGold ? "#fbbf24" : "#4f6ff7"
              }}
            >
              <i className="bi bi-box-seam me-2"></i>
              Shop Now
            </Link>
            <Link
              to="/about"
              className="btn btn-outline-light btn-lg fw-bold px-5"
              style={{
                borderRadius: "10px",
                padding: "14px 40px",
                fontSize: "16px",
                border: `2px solid ${isDarkGold ? "#0f172a" : "#ffffff"}`,
                color: isDarkGold ? "#0f172a" : "#ffffff"
              }}
            >
              <i className="bi bi-info-circle me-2"></i>
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section
        className="py-4"
        style={{ 
          background: "var(--shop-surface)", 
          borderBottom: "1px solid var(--shop-border)",
          transition: "all 0.3s ease" 
        }}
      >
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <i
                  className="bi bi-truck"
                  style={{ fontSize: "28px", color: isDarkGold ? "#fbbf24" : "#4f6ff7" }}
                ></i>
                <div className="text-start">
                  <p className="mb-0 small text-secondary">Free Shipping</p>
                  <p className="mb-0 fw-bold text-dark">Orders over $50</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <i
                  className="bi bi-shield-check text-success"
                  style={{ fontSize: "28px" }}
                ></i>
                <div className="text-start">
                  <p className="mb-0 small text-secondary">Secure Payment</p>
                  <p className="mb-0 fw-bold text-dark">100% Protected</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <i
                  className="bi bi-arrow-counterclockwise text-info"
                  style={{ fontSize: "28px" }}
                ></i>
                <div className="text-start">
                  <p className="mb-0 small text-secondary">Easy Returns</p>
                  <p className="mb-0 fw-bold text-dark">30-Day Guarantee</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <i
                  className="bi bi-headset text-warning"
                  style={{ fontSize: "28px" }}
                ></i>
                <div className="text-start">
                  <p className="mb-0 small text-secondary">24/7 Support</p>
                  <p className="mb-0 fw-bold text-dark">Always Here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS SECTION ===== */}
      <section className="py-5">
        <div className="container">
          <div className="mb-5">
            <h2 className="display-6 fw-bold mb-2 text-dark">
              <i className="bi bi-star-fill text-warning me-2"></i>
              Featured Products
            </h2>
            <p className="text-secondary">
              Handpicked bestsellers loved by our customers
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ color: "var(--shop-primary) !important" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="col animate-card-parent">
                  <div
                    className="card h-100"
                    style={{
                      background: "var(--shop-surface)",
                      border: "1px solid var(--shop-border)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "var(--shop-shadow)"
                    }}
                  >
                    <div
                      style={{
                        height: "220px",
                        background: "var(--shop-surface-2)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      {product.product_images &&
                      product.product_images.length > 0 ? (
                        <img
                          src={product.product_images[0].image_url}
                          alt={product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <i
                          className="bi bi-image text-secondary"
                          style={{ fontSize: "48px", color: "var(--shop-muted)" }}
                        ></i>
                      )}
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: themeGradient,
                          color: isDarkGold ? "#0f172a" : "white",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      >
                        ★ Featured
                      </div>
                    </div>
                    <div className="card-body">
                      <h6 className="card-title fw-bold text-truncate text-dark">
                        {product.name}
                      </h6>
                      <p
                        className="card-text text-secondary small"
                        style={{ height: "36px", overflow: "hidden", color: "var(--shop-muted) !important" }}
                      >
                        {product.description || "Premium quality product"}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold fs-5" style={{ color: isDarkGold ? "#fbbf24" : "#4f6ff7" }}>
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <small className="badge px-2.5 py-1.5" style={{ background: "var(--shop-surface-2)", color: "var(--shop-text)", border: "1px solid var(--shop-border)" }}>
                          Stock: {product.stock}
                        </small>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent" style={{ borderTop: "1px solid var(--shop-border)" }}>
                      <Link
                        to={`/products?id=${product.id}`}
                        className="btn btn-sm btn-primary w-100"
                        style={{ 
                          borderRadius: "8px",
                          background: "var(--shop-primary)",
                          color: isDarkGold ? "#0f172a" : "#fff",
                          border: "none",
                          fontWeight: "600"
                        }}
                      >
                        <i className="bi bi-eye me-1"></i>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-secondary">No products available</p>
          )}

          <div className="text-center mt-5">
            <Link
              to="/products"
              className="btn btn-outline-theme btn-lg fw-bold px-4 py-2.5"
              style={{ 
                borderRadius: "10px", 
                border: "1px solid var(--shop-border)", 
                color: "var(--shop-text)",
                background: "var(--shop-surface)"
              }}
            >
              <i className="bi bi-arrow-right me-2"></i>
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section
        className="py-5"
        style={{
          background: "var(--shop-surface-2)",
          borderTop: "1px solid var(--shop-border)",
          borderBottom: "1px solid var(--shop-border)",
          transition: "all 0.3s ease"
        }}
      >
        <div className="container">
          <div className="mb-5 text-center">
            <h2 className="display-6 fw-bold mb-2 text-dark">
              <i className="bi bi-tag-fill me-2" style={{ color: isDarkGold ? "#fbbf24" : "#4f6ff7" }}></i>
              Shop by Category
            </h2>
            <p className="text-secondary">Explore our curated collections</p>
          </div>

          <div className="row g-4">
            {categories.map((cat) => (
              <div key={cat.id} className="col-md-6 col-lg-4">
                <Link
                  to={`/products?category=${cat.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="p-5 category-card"
                    style={{
                      background: "var(--shop-surface)",
                      border: "1px solid var(--shop-border)",
                      borderRadius: "16px",
                      textAlign: "center",
                      color: "var(--shop-text)",
                      cursor: "pointer",
                      boxShadow: "var(--shop-shadow)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <i
                      className="bi bi-tag"
                      style={{
                        fontSize: "44px",
                        display: "block",
                        marginBottom: "16px",
                        opacity: 0.9,
                        color: isDarkGold ? "#fbbf24" : "#4f6ff7"
                      }}
                    ></i>
                    <h5 className="fw-bold mb-2 text-dark">{cat.name}</h5>
                    <p className="mb-0 small text-secondary" style={{ opacity: 0.9 }}>
                      {cat.description || "Browse collection"}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER SECTION ===== */}
      <section className="py-5">
        <div className="container">
          <div
            className="row align-items-center"
            style={{
              background: themeGradient,
              borderRadius: "20px",
              padding: "60px 40px",
              color: isDarkGold ? "#0f172a" : "white",
              boxShadow: themeGlow
            }}
          >
            <div className="col-md-6 mb-4 mb-md-0">
              <h3 className="fw-bold mb-3 fs-4">
                <i className="bi bi-envelope me-2"></i>
                Subscribe to Our Newsletter
              </h3>
              <p className="mb-0" style={{ opacity: 0.9 }}>
                Get exclusive deals, new product updates, and insider tips
                delivered to your inbox.
              </p>
            </div>
            <div className="col-md-6">
              <form onSubmit={handleNewsletterSubmit} className="d-flex gap-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    borderRadius: "10px",
                    border: "none",
                    padding: "12px 16px",
                    background: "var(--shop-surface)",
                    color: "var(--shop-text)"
                  }}
                />
                <button
                  type="submit"
                  className={`btn fw-bold px-4 ${isDarkGold ? "btn-dark" : "btn-light"}`}
                  style={{ 
                    borderRadius: "10px",
                    background: isDarkGold ? "#090d16" : "#ffffff",
                    border: "none",
                    color: isDarkGold ? "#fbbf24" : "#4f6ff7" 
                  }}
                >
                  <i className="bi bi-send me-1"></i>
                  Subscribe
                </button>
              </form>
              {newsletterMessage && (
                <small className="text-success mt-2 d-block fw-bold">
                  <i className="bi bi-check-circle me-1"></i>
                  {newsletterMessage}
                </small>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-5" style={{ background: "var(--shop-bg)" }}>
        <div className="container">
          <div className="mb-5 text-center">
            <h2 className="display-6 fw-bold mb-2 text-dark">
              <i className="bi bi-chat-hearts me-2" style={{ color: isDarkGold ? "#fbbf24" : "#4f6ff7" }}></i>
              What Our Customers Say
            </h2>
            <p className="text-secondary">Real reviews from real customers</p>
          </div>

          <div className="row g-4">
            {[
              {
                name: "Ractz",
                role: "Verified Buyer",
                text: "Amazing products and fast delivery! Customer service was incredibly helpful.",
                rating: 5,
              },
              {
                name: "PrakSo",
                role: "Verified Buyer",
                text: "Best shopping experience ever. Quality products at great prices!",
                rating: 5,
              },
              {
                name: "Sakk",
                role: "Verified Buyer",
                text: "Love the variety and competitive pricing. Highly recommended!",
                rating: 5,
              },
            ].map((review, idx) => (
              <div key={idx} className="col-md-6 col-lg-4">
                <div
                  className="p-4 testimonial-card"
                  style={{
                    background: "var(--shop-surface)",
                    borderRadius: "16px",
                    border: "1px solid var(--shop-border)",
                    boxShadow: "var(--shop-shadow)",
                    transition: "all 0.3s ease"
                  }}
                >
                  <div className="mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <i
                        key={i}
                        className="bi bi-star-fill text-warning"
                        style={{ fontSize: "14px" }}
                      ></i>
                    ))}
                  </div>
                  <p
                    className="text-secondary mb-4"
                    style={{ fontStyle: "italic", color: "var(--shop-muted) !important" }}
                  >
                    "{review.text}"
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: themeGradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isDarkGold ? "#0f172a" : "white",
                        fontWeight: "bold",
                      }}
                    >
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="mb-0 fw-bold small text-dark">{review.name}</p>
                      <p
                        className="mb-0 text-secondary"
                        style={{ fontSize: "12px", color: "var(--shop-muted) !important" }}
                      >
                        {review.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section
        style={{
          background: themeGradient,
          color: isDarkGold ? "#0f172a" : "white",
          padding: "80px 20px",
          textAlign: "center",
          boxShadow: themeGlow
        }}
      >
        <div className="container">
          <h2 className="display-5 fw-bold mb-4" style={{ letterSpacing: "-0.02em" }}>Ready to Explore?</h2>
          <p
            className="fs-5 mb-5"
            style={{ maxWidth: "600px", margin: "0 auto 40px", opacity: 0.9 }}
          >
            Join thousands of satisfied customers and start shopping today!
          </p>
          <Link
            to="/products"
            className={`btn btn-lg fw-bold px-5 ${isDarkGold ? "btn-dark" : "btn-light"}`}
            style={{
              borderRadius: "10px",
              padding: "14px 40px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              background: isDarkGold ? "#090d16" : "#ffffff",
              border: "none",
              color: isDarkGold ? "#fbbf24" : "#4f6ff7"
            }}
          >
            <i className="bi bi-arrow-right me-2"></i>
            Start Shopping
          </Link>
        </div>
      </section>

      <style>{`
        .category-card:hover {
          transform: translateY(-4px) !important;
          border-color: var(--shop-primary) !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08) !important;
        }
        :root[data-shop-theme="dark-gold"] .category-card:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4) !important;
        }
        .testimonial-card:hover {
          transform: translateY(-4px) !important;
        }
        .btn-outline-theme {
          border: 1px solid var(--shop-border) !important;
          color: var(--shop-text) !important;
          background: var(--shop-surface) !important;
          transition: all 0.25s ease !important;
        }
        .btn-outline-theme:hover {
          background: var(--shop-surface-2) !important;
          border-color: var(--shop-primary) !important;
          color: var(--shop-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default Home;
