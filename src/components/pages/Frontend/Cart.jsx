import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const getProductImage = (product) => {
    const images = product?.product_images || product?.productImages || [];
    return images[0]?.image_url || null;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shippingCost = cartItems.length > 0 ? 10.00 : 0.00;
  const tax = subtotal * 0.10;
  const total = subtotal + shippingCost + tax;

  const handleCheckoutClick = () => {
    navigate("/checkout");
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-cart3 text-primary"></i> Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4">
          <div className="py-4">
            <i className="bi bi-cart-x text-muted mb-3 d-block" style={{ fontSize: "5rem" }}></i>
            <h4 className="fw-bold text-dark">Your cart is currently empty</h4>
            <p className="text-muted mb-4">Add products to your cart before proceeding to checkout.</p>
            <Link
              to="/store"
              className="btn btn-primary btn-lg px-4"
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)",
                border: "none",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
              }}
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th className="pe-4 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => {
                      const imgUrl = getProductImage(item);
                      return (
                        <tr key={item.id}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              {imgUrl ? (
                                <img
                                  src={imgUrl}
                                  alt={item.name}
                                  className="rounded-3 border"
                                  style={{ width: "64px", height: "64px", objectFit: "cover", background: "#f8fafc" }}
                                />
                              ) : (
                                <div
                                  className="rounded-3 border d-flex align-items-center justify-content-center bg-light text-muted"
                                  style={{ width: "64px", height: "64px" }}
                                >
                                  <i className="bi bi-image"></i>
                                </div>
                              )}
                              <div>
                                <span className="fw-bold text-dark d-block text-truncate" style={{ maxWidth: "200px" }}>
                                  {item.name}
                                </span>
                                <small className="text-muted">ID: #{item.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>${Number(item.price).toFixed(2)}</td>
                          <td>
                            <div
                              className="input-group border border-light rounded-pill overflow-hidden"
                              style={{ width: "110px", height: "32px" }}
                            >
                              <button
                                className="btn btn-light bg-white border-0 py-0"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </button>
                              <input
                                type="text"
                                className="form-control border-0 text-center bg-white font-monospace fw-bold py-0"
                                value={item.quantity}
                                readOnly
                              />
                              <button
                                className="btn btn-light bg-white border-0 py-0"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="fw-bold text-dark">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </td>
                          <td className="pe-4 text-end">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="btn btn-sm btn-outline-danger rounded-circle p-2 d-inline-flex align-items-center justify-content-center"
                              style={{ width: "32px", height: "32px" }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clear Cart Action Button */}
            <div className="d-flex justify-content-between align-items-center">
              <Link to="/store" className="btn btn-link text-decoration-none fw-semibold p-0">
                <i className="bi bi-arrow-left me-1"></i> Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="btn btn-sm btn-outline-secondary"
                style={{ borderRadius: "10px" }}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
              <h5 className="fw-bold text-dark mb-4">Order Summary</h5>
              <ul className="list-unstyled mb-4">
                <li className="d-flex justify-content-between mb-3 text-secondary">
                  <span>Subtotal</span>
                  <span className="fw-semibold text-dark">${subtotal.toFixed(2)}</span>
                </li>
                <li className="d-flex justify-content-between mb-3 text-secondary">
                  <span>Shipping Cost</span>
                  <span className="fw-semibold text-dark">${shippingCost.toFixed(2)}</span>
                </li>
                <li className="d-flex justify-content-between mb-3 text-secondary">
                  <span>Estimated Tax (10%)</span>
                  <span className="fw-semibold text-dark">${tax.toFixed(2)}</span>
                </li>
                <hr className="my-3 text-muted" />
                <li className="d-flex justify-content-between mb-4">
                  <span className="fw-bold text-dark fs-5">Total</span>
                  <span className="fw-bold text-primary fs-4">${total.toFixed(2)}</span>
                </li>
              </ul>

              <button
                onClick={handleCheckoutClick}
                className="btn btn-primary btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                style={{
                  borderRadius: "15px",
                  background: "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                <span>Proceed to Checkout</span>
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
