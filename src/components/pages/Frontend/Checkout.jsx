import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { useAuth } from "../../hooks/useAuth";
import { createOrderApi } from "../../services/orderService";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!token || !user) {
      navigate("/login", { replace: true });
    }
    if (cartItems.length === 0 && !isSuccess) {
      navigate("/cart", { replace: true });
    }
  }, [user, token, cartItems, navigate]);

  // Form States
  const [shippingForm, setShippingForm] = useState({
    fullName: user ? user.name : "",
    phone: localStorage.getItem("ecommerce_shipping_phone") || "",
    address: localStorage.getItem("ecommerce_shipping_address") || "",
    city: localStorage.getItem("ecommerce_shipping_city") || "",
  });

  const [paymentForm, setPaymentForm] = useState(() => {
    const saved = localStorage.getItem("ecommerce_saved_payment");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        cardNumber: parsed.cardNumber || "",
        expiryDate: parsed.expiryDate || "",
        cvv: parsed.cvv || "",
      };
    }
    return {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    };
  });

  // Flow control states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState("");

  const handleShippingChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Small validation check
    if (!shippingForm.fullName || !shippingForm.phone || !shippingForm.address || !shippingForm.city) {
      alert("Please fill in all shipping details");
      return;
    }
    if (paymentForm.cardNumber.replace(/\s/g, "").length < 16) {
      alert("Please enter a valid 16-digit card number");
      return;
    }
    if (!paymentForm.expiryDate || paymentForm.cvv.length < 3) {
      alert("Please fill in card expiry and CVV");
      return;
    }

    setIsProcessing(true);
    setError("");

    // Multi-phase loader animation messages
    const steps = [
      "Contacting secure gateway...",
      "Authorizing simulated funds...",
      "Generating order ticket...",
      "Clearing cart & finalizing...",
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingMessage(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    try {
      const order = await createOrderApi({
        items: cartItems,
        shipping: shippingForm,
        payment: paymentForm,
      });
      clearCart();
      setPlacedOrder(order);
      setIsSuccess(true);
    } catch (err) {
      console.error("Order checkout failed:", err);
      setError(err?.response?.data?.message || "Could not place order. Please check stock and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shippingCost = 10.00;
  const tax = subtotal * 0.10;
  const total = subtotal + shippingCost + tax;

  if (isProcessing) {
    return (
      <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center py-5">
        <div className="text-center p-5 rounded-4 shadow-sm border border-light bg-white" style={{ maxWidth: "420px", width: "100%" }}>
          <div className="spinner-border text-primary mb-4" role="status" style={{ width: "3.5rem", height: "3.5rem", borderWidth: "4px" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="fw-bold text-dark mb-2">Processing Payment</h4>
          <p className="text-muted font-monospace small mb-0">{processingMessage}</p>
        </div>
      </div>
    );
  }

  if (isSuccess && placedOrder) {
    return (
      <div className="container py-5 d-flex justify-content-center align-items-center min-vh-80">
        <div className="card border-0 shadow-lg rounded-4 p-5 text-center my-4" style={{ maxWidth: "580px", width: "100%" }}>
          <div className="mb-4">
            <div
              className="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-success-subtle text-success"
              style={{ width: "80px", height: "80px", background: "#d1e7dd", color: "#0f5132" }}
            >
              <i className="bi bi-check-lg" style={{ fontSize: "40px" }}></i>
            </div>
          </div>
          <h2 className="fw-bold text-dark mb-2">Order Confirmed!</h2>
          <p className="text-muted mb-4">
            Thank you for your purchase. Your payment was successfully authorized.
          </p>

          <div className="bg-light rounded-3 p-4 mb-4 text-start border border-light">
            <div className="row g-2 small">
              <div className="col-5 text-secondary">Order ID:</div>
              <div className="col-7 fw-bold font-monospace text-dark">#{placedOrder.id}</div>

              <div className="col-5 text-secondary">Placed on:</div>
              <div className="col-7 text-dark">{new Date(placedOrder.date).toLocaleString()}</div>

              <div className="col-5 text-secondary">Total:</div>
              <div className="col-7 fw-bold text-primary">${placedOrder.total.toFixed(2)}</div>

              <div className="col-5 text-secondary">Shipping to:</div>
              <div className="col-7 text-dark text-truncate">
                {placedOrder.shippingDetails.address}, {placedOrder.shippingDetails.city}
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <button
              onClick={() => navigate("/orders")}
              className="btn btn-primary px-4 py-2.5 fw-semibold"
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)",
                border: "none",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
              }}
            >
              View Order History
            </button>
            <button
              onClick={() => navigate("/store")}
              className="btn btn-outline-secondary px-4 py-2.5 fw-semibold"
              style={{ borderRadius: "12px" }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Checkout Details</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Shipping & Payment Fields */}
          <div className="col-12 col-lg-8">
            {/* Step 1: Shipping */}
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4">
              <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <span className="badge bg-primary rounded-circle px-2 py-1.5" style={{ fontSize: "14px" }}>1</span>
                Shipping Address
              </h4>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label text-secondary small fw-semibold">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control px-3 py-2"
                    placeholder="John Doe"
                    value={shippingForm.fullName}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-secondary small fw-semibold">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control px-3 py-2"
                    placeholder="+1 234-567-890"
                    value={shippingForm.phone}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-secondary small fw-semibold">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control px-3 py-2"
                    placeholder="123 Main St, Apt 4B"
                    value={shippingForm.address}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-secondary small fw-semibold">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-control px-3 py-2"
                    placeholder="New York"
                    value={shippingForm.city}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
              <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <span className="badge bg-primary rounded-circle px-2 py-1.5" style={{ fontSize: "14px" }}>2</span>
                Simulated Payment Details
              </h4>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label text-secondary small fw-semibold">Card Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white text-muted">
                      <i className="bi bi-credit-card"></i>
                    </span>
                    <input
                      type="text"
                      name="cardNumber"
                      className="form-control px-3 py-2"
                      placeholder="4111 2222 3333 4444"
                      maxLength="19"
                      value={paymentForm.cardNumber}
                      onChange={(e) => {
                        // Auto-format card spacing
                        const val = e.target.value.replace(/\D/g, "");
                        const next = val.replace(/(\d{4})(?=\d)/g, "$1 ");
                        setPaymentForm({ ...paymentForm, cardNumber: next });
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary small fw-semibold">Expiration Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    className="form-control px-3 py-2"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={paymentForm.expiryDate}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      const next = val.length > 2 ? `${val.slice(0, 2)}/${val.slice(2, 4)}` : val;
                      setPaymentForm({ ...paymentForm, expiryDate: next });
                    }}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-secondary small fw-semibold">CVV Code</label>
                  <input
                    type="password"
                    name="cvv"
                    className="form-control px-3 py-2"
                    placeholder="123"
                    maxLength="3"
                    value={paymentForm.cvv}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cart Sidebar Breakdown */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
              <h5 className="fw-bold text-dark mb-4">Review Order</h5>
              <div className="mb-4 overflow-auto" style={{ maxHeight: "200px" }}>
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ maxWidth: "200px" }}>
                      <span className="small text-dark fw-semibold d-block text-truncate">{item.name}</span>
                      <small className="text-muted font-monospace">{item.quantity} x ${Number(item.price).toFixed(2)}</small>
                    </div>
                    <span className="small fw-bold text-dark">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className="my-3 text-muted" />

              <ul className="list-unstyled mb-4">
                <li className="d-flex justify-content-between mb-2 text-secondary small">
                  <span>Subtotal</span>
                  <span className="fw-semibold text-dark">${subtotal.toFixed(2)}</span>
                </li>
                <li className="d-flex justify-content-between mb-2 text-secondary small">
                  <span>Shipping</span>
                  <span className="fw-semibold text-dark">${shippingCost.toFixed(2)}</span>
                </li>
                <li className="d-flex justify-content-between mb-2 text-secondary small">
                  <span>Tax (10%)</span>
                  <span className="fw-semibold text-dark">${tax.toFixed(2)}</span>
                </li>
                <hr className="my-2.5 text-muted" />
                <li className="d-flex justify-content-between my-2">
                  <span className="fw-bold text-dark">Order Total</span>
                  <span className="fw-bold text-primary fs-5">${total.toFixed(2)}</span>
                </li>
              </ul>

              <button
                type="submit"
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
                <i className="bi bi-shield-lock-fill"></i>
                <span>Pay & Place Order</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
