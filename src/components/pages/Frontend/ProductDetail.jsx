import { useState, useEffect, useContext } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { api } from "../../api/axios";
import { extractCollection, extractResource } from "../../services/apiHelpers";
import { CartContext } from "../../contexts/CartContext";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../../common/LoadingSpinner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        const productData = extractResource(response.data, "product");
        if (!mounted) return;
        setProduct(productData || {});

        if (productData?.category_id) {
          const productsRes = await api.get("/products");
          const allProducts = extractCollection(productsRes.data, "products");
          const filtered = allProducts
            .filter(
              (p) =>
                p.category_id === productData.category_id &&
                p.id !== productData.id,
            )
            .slice(0, 4);
          setSimilarProducts(filtered);
        } else {
          setSimilarProducts([]);
        }
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    return () => {
      mounted = false;
    };
  }, [id]);

  // normalize images
  const images = (() => {
    const raw = product?.product_images || product?.productImages || [];
    if (!Array.isArray(raw)) return [];
    return raw
      .map((it) => {
        if (!it) return null;
        if (typeof it === "string") return { image_url: it };
        return {
          image_url: it.image_url || it.url || it.src || it.path || null,
          title: it.title || it.alt || it.name || null,
          caption: it.caption || it.description || it.alt_text || null,
          price_override: it.price || it.price_override || null,
          sku: it.sku || null,
          attributes: it.attributes || it.meta || null,
        };
      })
      .filter((i) => i && i.image_url);
  })();

  useEffect(() => {
    if (images.length === 0) setActiveImage(0);
    else if (activeImage >= images.length) setActiveImage(0);
  }, [images.length]);

  // sync active image with `?img=` query param for deep linking
  useEffect(() => {
    const imgParam = searchParams.get("img");
    if (!imgParam) return;
    const idx = parseInt(imgParam, 10);
    if (!Number.isNaN(idx) && idx >= 0 && idx < images.length) {
      setActiveImage(idx);
    }
  }, [searchParams, images.length]);

  useEffect(() => {
    if (!showLightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowLightbox(false);
      if (e.key === "ArrowRight")
        setActiveImage((s) => Math.min(images.length - 1, s + 1));
      if (e.key === "ArrowLeft") setActiveImage((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLightbox, images.length]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity });
    navigate("/cart");
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product)
    return <div className="alert alert-warning">Product not found.</div>;

  const isAdmin = user?.role === "admin" || user?.is_admin;

  const activeImg = images[activeImage] || null;
  const displayPrice = activeImg?.price_override
    ? Number(activeImg.price_override)
    : Number(product.price);

  return (
    <div className="container my-5">
      <div className="product-card mx-auto p-4" style={{ maxWidth: 1100 }}>
        <div className="row g-5 align-items-start">
          {/* Left: Image */}
          <div className="col-lg-6">
            <div className="d-flex flex-column gap-3">
              <div className="image-area rounded-3 d-flex align-items-center justify-content-center mx-auto">
                {images.length > 0 ? (
                  <img
                    loading="lazy"
                    src={images[activeImage].image_url}
                    alt={product.name}
                    className="main-square-image cursor-pointer"
                    onClick={() => setShowLightbox(true)}
                  />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                    <i className="bi bi-image text-secondary fs-1"></i>
                  </div>
                )}
              </div>

              {/* up to two thumbnails */}
              {images.length > 1 && (
                <div className="d-flex gap-3 justify-content-center mt-3 gallery-thumbs">
                  {images.slice(0, 4).map((img, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      type="button"
                      onClick={() => {
                        setActiveImage(idx);
                        setSearchParams(
                          { img: String(idx) },
                          { replace: true },
                        );
                      }}
                      aria-label={`View image ${idx + 1}`}
                      className={`thumb-btn p-0 border rounded-2 ${activeImage === idx ? "active-thumb" : ""}`}
                      style={{ width: 84, height: 84, overflow: "hidden" }}
                    >
                      <img
                        src={img.image_url}
                        alt={`thumb-${idx}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      {activeImage === idx && (
                        <span className="selected-dot" aria-hidden></span>
                      )}
                    </button>
                  ))}

                  {images.length > 4 && (
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none"
                      onClick={() => {
                        // jump to thumbnail strip start
                        setActiveImage(4);
                        setSearchParams({ img: String(4) }, { replace: true });
                      }}
                    >
                      +{images.length - 4} more
                    </button>
                  )}
                </div>
              )}

              {/* small strip for many images (kept for accessibility) */}
              {images.length > 2 && (
                <div className="d-flex gap-2 overflow-auto mt-3 justify-content-center thumbnails-row">
                  {images.map((img, idx) => (
                    <button
                      key={`mini-${idx}`}
                      type="button"
                      onClick={() => {
                        setActiveImage(idx);
                        setSearchParams(
                          { img: String(idx) },
                          { replace: true },
                        );
                      }}
                      aria-label={`Select image ${idx + 1}`}
                      className={`thumb-btn p-0 border rounded-2 ${activeImage === idx ? "active-thumb" : ""}`}
                      style={{ width: 56, height: 56, flexShrink: 0 }}
                    >
                      <img
                        loading="lazy"
                        src={img.image_url}
                        alt={`mini-${idx}`}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {images.length > 1 && (
                <div className="text-muted small mt-2">
                  {activeImage + 1} / {images.length} photos
                </div>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div className="col-lg-6">
            <div className="ps-lg-4">
              <span className="badge bg-dark rounded-0 text-uppercase mb-2">
                {product.category?.name || "New Arrival"}
              </span>
              <h1
                className="display-5 fw-bold mb-3"
                style={{ letterSpacing: "-0.02em", color: "#0b1220" }}
              >
                {product.name}
              </h1>

              <div className="d-flex align-items-center gap-3 mb-4">
                <h2 className="fw-black mb-0" style={{ color: "#f6b021" }}>
                  ${displayPrice.toFixed(2)}
                </h2>
                {isAdmin && (
                  <span className="text-secondary small fw-bold">
                    STOCK: {product.stock} UNITS
                  </span>
                )}
              </div>

              <hr
                className="my-4"
                style={{ borderColor: "rgba(11,18,32,0.06)" }}
              />

              <p
                className="mb-4"
                style={{
                  lineHeight: "1.7",
                  fontSize: "1rem",
                  color: "rgba(11,18,32,0.75)",
                }}
              >
                {activeImg?.caption ||
                  product.description ||
                  "No description available for this product."}
              </p>

              <div className="d-flex flex-column gap-3 mb-5">
                <div className="d-flex align-items-center gap-3">
                  <div className="input-group" style={{ width: "140px" }}>
                    <div
                      className="quantity-box rounded-pill d-flex align-items-center justify-content-center"
                      style={{
                        background: "#ffffff",
                        padding: "6px 10px",
                        border: "1px solid rgba(11,18,32,0.06)",
                      }}
                    >
                      <button
                        className="btn btn-link text-dark text-decoration-none fw-bold"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="text"
                        className="form-control border-0 text-center fw-bold bg-transparent text-dark"
                        value={quantity}
                        readOnly
                      />
                      <button
                        className="btn btn-link text-dark text-decoration-none fw-bold"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>

                  <button
                    className="add-cart-btn rounded-pill flex-grow-1 py-3 fw-bold text-uppercase"
                    disabled={Number(product.stock) === 0}
                    onClick={handleAddToCart}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    {Number(product.stock) === 0
                      ? "Out of Stock"
                      : `Add to Cart - $${(displayPrice * quantity).toFixed(2)}`}
                  </button>
                </div>

                <button className="btn btn-outline-dark rounded-pill py-3 fw-bold text-uppercase">
                  <i className="bi bi-heart me-2"></i>Add to Wishlist
                </button>
              </div>

              <div className="small d-grid gap-2">
                <div className="d-flex gap-2">
                  <span className="fw-bold text-dark">AVAILABILITY:</span>
                  <span
                    className={
                      Number(product.stock) > 0 ? "text-success" : "text-danger"
                    }
                  >
                    {Number(product.stock) > 0 ? "In Stock" : "Unavailable"}
                  </span>
                </div>

                <div className="d-flex gap-2">
                  <span className="fw-bold text-dark">SKU:</span>
                  <span
                    className="text-secondary"
                    style={{ color: "rgba(11,18,32,0.6)" }}
                  >
                    {activeImg?.sku ||
                      `ES-${product.id}-${product.slug?.substring(0, 3).toUpperCase()}`}
                  </span>
                </div>

                <div className="d-flex gap-2">
                  <span className="fw-bold text-dark">TAGS:</span>
                  <span className="text-secondary text-uppercase">
                    {product.category?.name}, E-SHOP, PREMIUM
                  </span>
                </div>

                {activeImg?.attributes && (
                  <div className="mt-3">
                    <strong className="d-block mb-2">Attributes</strong>
                    <div className="d-flex flex-wrap gap-2">
                      {Object.entries(activeImg.attributes).map(([k, v]) => (
                        <span key={k} className="badge bg-secondary text-dark">
                          {k}: {String(v)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-5 pt-5 border-top border-dark border-opacity-10">
              <h3 className="fw-bold text-dark mb-4 text-uppercase">
                Similar Products
              </h3>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {similarProducts.map((p) => (
                  <div key={p.id} className="col">
                    <div
                      className="card h-100 border-dark rounded-0 group transition-all"
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        className="position-relative bg-light"
                        style={{ height: "200px" }}
                      >
                        {p.product_images && p.product_images.length > 0 ? (
                          <img
                            src={p.product_images[0].image_url}
                            alt={p.name}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <i className="bi bi-image text-secondary fs-2"></i>
                          </div>
                        )}
                        <div className="card-overlay">
                          <Link
                            to={`/products/${p.id}`}
                            className="btn btn-dark btn-sm rounded-0"
                          >
                            VIEW DETAIL
                          </Link>
                        </div>
                      </div>
                      <div className="card-body p-3">
                        <h6 className="fw-bold text-dark text-truncate mb-1">
                          {p.name}
                        </h6>
                        <p className="fw-black text-dark mb-0">
                          ${Number(p.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .fw-black { font-weight: 900; }
        .group:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
        .card-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.85); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.25s ease; }
        .card:hover .card-overlay { opacity: 1; }
        .thumb-btn { background: transparent; outline: none; }
        .thumb-btn img { transition: transform 0.25s ease; }
        .thumb-btn:hover img { transform: scale(1.05); }
        .active-thumb { box-shadow: 0 6px 18px rgba(246,176,33,0.12); border: 2px solid rgba(246,176,33,0.95); }
        .image-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.9); border: none; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 6px; box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
        .image-nav.left { left: 12px; }
        .image-nav.right { right: 12px; }
        .image-nav i { font-size: 1.15rem; }
        .main-image { max-width: 100%; height: auto; }
        @media (max-width: 991px) { .gallery-thumbs { display: none !important; } }
        .thumbnails-row { padding: 0 6px; }
        .thumbnails-row .active-thumb { border: 2px solid rgba(79,111,247,0.85); box-shadow: 0 8px 18px rgba(79,111,247,0.08); }
        .all-images-strip { justify-content: center; }
        .strip-item { border: 2px solid transparent; }
        .strip-item.border-primary { border-color: rgba(79,111,247,0.85); box-shadow: 0 8px 18px rgba(79,111,247,0.08); }
        /* Card layout (light/modal) */
        .product-card { background: #ffffff; color: #0b1220; border-radius: 14px; box-shadow: 0 12px 40px rgba(8,12,20,0.35); }
        .product-card .text-dark { color: #0b1220 !important; }
        .product-card h1.display-5, .product-card .display-5 { color: #0b1220 !important; opacity: 1 !important; }
        .product-card h1.display-5 { font-weight: 800; }
        .product-card .text-secondary { color: rgba(11,18,32,0.6) !important; }
        .product-card .fw-bold.text-dark { color: #0b1220 !important; }
        .image-area { background: transparent; width: 100%; max-width: 520px; padding: 28px; }
        .main-square-image { width: 100%; height: 520px; object-fit: contain; background: transparent; border-radius: 12px; }
        .product-card .badge.bg-dark { background: #fff3db !important; color: #7a4a00 !important; border: 1px solid rgba(122,74,0,0.08); }
        .thumb-btn { border-radius: 6px; padding: 2px; }
        .thumb-btn.active-thumb { padding: 0; }
        /* Make light backgrounds subtle in cards */
        .product-card .position-relative.bg-light { background: #fafafa !important; }
        .product-card .card-body { background: transparent; color: #0b1220; }
        .product-card .card-overlay { background: rgba(255,255,255,0.95); color: #0b1220; }
        .add-cart-btn { background: #f6b021; color: #0b1220; border: 3px solid rgba(0,0,0,0.85); box-shadow: 0 6px 0 rgba(0,0,0,0.06); }
        .add-cart-btn:disabled { opacity: 0.5; }
        .quantity-box input { width: 48px; }
        @media (max-width: 991px) {
          .main-square-image { height: 360px; }
          .product-card { padding: 18px; }
          .add-cart-btn { width: 100%; }
        }

        /* selected thumbnail indicator */
        .thumb-btn { position: relative; }
        .selected-dot { position: absolute; top: 6px; right: 6px; width: 10px; height: 10px; border-radius: 50%; background: #4f6ff7; box-shadow: 0 6px 18px rgba(79,111,247,0.18); border: 2px solid rgba(255,255,255,0.9); }

        /* Lightbox modal */
        .lightbox-overlay { position: fixed; inset: 0; background: rgba(2,6,23,0.6); display: flex; align-items: center; justify-content: center; z-index: 2050; }
        .lightbox-content { max-width: 1100px; width: 95%; max-height: 90vh; padding: 18px; display:flex; flex-direction:column; align-items:center; }
        .lightbox-img { max-height: 70vh; width: auto; object-fit: contain; border-radius: 8px; }
        .lightbox-thumbs { margin-top: 12px; display:flex; gap:8px; overflow:auto; }
        .lightbox-thumbs img { width: 64px; height: 64px; object-fit: cover; border-radius: 8px; cursor: pointer; opacity: 0.85; border: 2px solid transparent; }
        .lightbox-thumbs img.active { border-color: #4f6ff7; box-shadow: 0 8px 20px rgba(79,111,247,0.12); opacity: 1; }
        .lightbox-close { position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: #fff; font-size: 28px; }
      `}</style>

      {showLightbox && (
        <div
          className="lightbox-overlay"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              aria-label="Close"
              onClick={() => setShowLightbox(false)}
            >
              ×
            </button>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <button
                className="image-nav left"
                onClick={() => setActiveImage((s) => Math.max(0, s - 1))}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <img
                src={images[activeImage]?.image_url}
                alt={`Image ${activeImage + 1}`}
                className="lightbox-img"
              />
              <button
                className="image-nav right"
                onClick={() =>
                  setActiveImage((s) => Math.min(images.length - 1, s + 1))
                }
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
            <div className="lightbox-thumbs">
              {images.map((img, idx) => (
                <img
                  key={`lb-${idx}`}
                  src={img.image_url}
                  alt={`thumb-${idx}`}
                  className={idx === activeImage ? "active" : ""}
                  onClick={() => {
                    setActiveImage(idx);
                    setSearchParams({ img: String(idx) }, { replace: true });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
