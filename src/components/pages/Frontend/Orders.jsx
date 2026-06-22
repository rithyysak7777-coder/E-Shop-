import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getMyOrdersApi } from "../../services/orderService";

const Orders = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user) {
      navigate("/login", { replace: true });
      return;
    }
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        setMyOrders(await getMyOrdersApi());
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Could not load your order history.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, token, navigate]);

  if (!user) return null;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning-subtle text-warning border border-warning-subtle";
      case "Processing":
        return "bg-primary-subtle text-primary border border-primary-subtle";
      case "Shipped":
        return "bg-info-subtle text-info border border-info-subtle";
      case "Completed":
        return "bg-success-subtle text-success border border-success-subtle";
      case "Cancelled":
        return "bg-danger-subtle text-danger border border-danger-subtle";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-receipt text-primary"></i> Order History
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading order history...</p>
        </div>
      ) : myOrders.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4">
          <div className="py-4">
            <i className="bi bi-clock-history text-muted mb-3 d-block" style={{ fontSize: "5rem" }}></i>
            <h4 className="fw-bold text-dark">No orders placed yet</h4>
            <p className="text-muted mb-4">You haven't made any purchases on this account.</p>
            <Link
              to="/store"
              className="btn btn-primary px-4"
              style={{
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4f6ff7 0%, #3b82f6 100%)",
                border: "none",
              }}
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {myOrders.map((order) => (
            <div key={order.id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
              {/* Order Card Header */}
              <div
                className="card-header border-0 px-4 py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2"
                style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
              >
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <span className="font-monospace fw-bold text-dark" style={{ fontSize: "15px" }}>
                    #{order.id}
                  </span>
                  <span className="text-secondary small">
                    {new Date(order.date).toLocaleString()}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge px-3 py-1.5 rounded-pill fw-semibold ${getStatusBadgeClass(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className="badge bg-success px-3 py-1.5 rounded-pill fw-semibold">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Card Body */}
              <div className="card-body p-4">
                <div className="row g-4">
                  {/* Order Items */}
                  <div className="col-12 col-md-7">
                    <h6 className="text-secondary small fw-semibold text-uppercase mb-3">Items Ordered</h6>
                    <div className="d-flex flex-column gap-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold text-dark small">{item.name}</span>
                            <span className="badge bg-light text-secondary border font-monospace">
                              x{item.quantity}
                            </span>
                          </div>
                          <span className="small fw-semibold text-dark">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="col-12 col-md-5">
                    <h6 className="text-secondary small fw-semibold text-uppercase mb-3">Shipment Information</h6>
                    <div className="small text-dark">
                      <div className="fw-bold mb-1">{order.shippingDetails.fullName}</div>
                      <div className="text-secondary mb-1">{order.shippingDetails.phone}</div>
                      <div className="text-secondary">
                        {order.shippingDetails.address}, {order.shippingDetails.city}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-4 text-muted" />

                {/* Totals Summary */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-secondary small">
                    Payment Method: <span className="fw-semibold text-dark">{order.paymentDetails.cardType} (ending in {order.paymentDetails.lastFour})</span>
                  </div>
                  <div className="text-end">
                    <span className="text-secondary small me-2">Grand Total:</span>
                    <span className="fw-extrabold text-primary fs-5" style={{ fontWeight: 800 }}>
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
