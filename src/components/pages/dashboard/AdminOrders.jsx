import React, { useCallback, useEffect, useState } from "react";
import { FaEye, FaSyncAlt, FaTrash } from "react-icons/fa";
import { deleteOrderApi, getAdminOrdersApi, updateOrderStatusApi } from "../../services/orderService";
import "../adminCrud.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // Selected Order for Details View
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setOrders(await getAdminOrdersApi());
    } catch (err) {
      console.error("Error loading admin orders:", err);
      setError("Could not load orders from the database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDelete = async (orderId) => {
    if (window.confirm(`Are you sure you want to delete/cancel order #${orderId}?`)) {
      try {
        await deleteOrderApi(orderId);
        setOrders((current) => current.filter((order) => order.id !== orderId));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } catch (err) {
        console.error("Error deleting order:", err);
        alert("Failed to delete order.");
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateOrderStatusApi(orderId, newStatus);
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? updatedOrder : order)),
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status.");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning text-dark";
      case "Processing":
        return "bg-primary";
      case "Shipped":
        return "bg-info text-dark";
      case "Completed":
        return "bg-success";
      case "Cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="admin-crud">
      <div className="admin-crud-header">
        <div>
          <h2>Order Management</h2>
          <p>View, track, and update client orders and payment statuses.</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={fetchOrders} disabled={isLoading}>
          <FaSyncAlt className="me-2" />
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-crud-card">
        {isLoading ? (
          <div className="admin-empty d-flex flex-column align-items-center justify-content-center text-muted py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 mb-0">Loading orders from database...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-empty d-flex flex-column align-items-center justify-content-center text-muted py-5">
            <i className="bi bi-cart-x fs-1 mb-2" />
            <p className="mb-0">No client orders placed yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Order Status</th>
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="ps-4">
                      <span className="font-monospace fw-bold text-dark">#{order.id}</span>
                    </td>
                    <td>
                      <div className="fw-bold">{order.userName}</div>
                      <small className="text-muted">{order.userEmail}</small>
                    </td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td className="fw-bold text-primary">${Number(order.total || 0).toFixed(2)}</td>
                    <td>
                      <span className="badge bg-success">{order.paymentStatus || "Paid"}</span>
                    </td>
                    <td>
                      <select
                        className={`form-select form-select-sm fw-semibold ${getStatusBadgeClass(order.orderStatus)}`}
                        style={{
                          width: "130px",
                          border: "none",
                          borderRadius: "6px",
                          color: order.orderStatus === "Pending" || order.orderStatus === "Shipped" ? "#000" : "#fff",
                        }}
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="Pending" style={{ color: "#000", background: "#fff" }}>Pending</option>
                        <option value="Processing" style={{ color: "#000", background: "#fff" }}>Processing</option>
                        <option value="Shipped" style={{ color: "#000", background: "#fff" }}>Shipped</option>
                        <option value="Completed" style={{ color: "#000", background: "#fff" }}>Completed</option>
                        <option value="Cancelled" style={{ color: "#000", background: "#fff" }}>Cancelled</option>
                      </select>
                    </td>
                    <td className="pe-4">
                      <div className="admin-actions d-flex gap-2 justify-content-end">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(order.id)}
                          title="Delete Order"
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

      {/* Details Modal */}
      {selectedOrder && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white border-0 py-3">
                <h5 className="modal-title fw-bold">Order Details: #{selectedOrder.id}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedOrder(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4 mb-4">
                  {/* Buyer Info */}
                  <div className="col-12 col-md-6">
                    <h6 className="text-secondary small fw-semibold text-uppercase mb-2">Customer Profile</h6>
                    <div className="p-3 bg-light rounded-3">
                      <div className="fw-bold">{selectedOrder.userName}</div>
                      <div className="text-secondary small">{selectedOrder.userEmail}</div>
                      <div className="text-secondary small mt-1">Phone: {selectedOrder.shippingDetails.phone}</div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="col-12 col-md-6">
                    <h6 className="text-secondary small fw-semibold text-uppercase mb-2">Shipping Destination</h6>
                    <div className="p-3 bg-light rounded-3">
                      <div>{selectedOrder.shippingDetails.fullName}</div>
                      <div className="text-secondary small mt-1">
                        {selectedOrder.shippingDetails.address}, {selectedOrder.shippingDetails.city}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ordered Items Table */}
                <h6 className="text-secondary small fw-semibold text-uppercase mb-2">Ordered Items</h6>
                <div className="card border border-light rounded-3 overflow-hidden mb-4">
                  <table className="table align-middle mb-0 small">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th className="pe-3 text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="ps-3 py-2 fw-semibold text-dark">{item.name}</td>
                          <td>${Number(item.price).toFixed(2)}</td>
                          <td>{item.quantity}</td>
                          <td className="pe-3 text-end fw-bold">${(Number(item.price) * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Order Totals Summary */}
                <div className="row g-3 justify-content-between align-items-center">
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-secondary small">Set Order Status:</span>
                      <select
                        className={`form-select form-select-sm fw-semibold w-50 ${getStatusBadgeClass(selectedOrder.orderStatus)}`}
                        style={{
                          border: "none",
                          borderRadius: "6px",
                          color: selectedOrder.orderStatus === "Pending" || selectedOrder.orderStatus === "Shipped" ? "#000" : "#fff",
                        }}
                        value={selectedOrder.orderStatus}
                        onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                      >
                        <option value="Pending" style={{ color: "#000", background: "#fff" }}>Pending</option>
                        <option value="Processing" style={{ color: "#000", background: "#fff" }}>Processing</option>
                        <option value="Shipped" style={{ color: "#000", background: "#fff" }}>Shipped</option>
                        <option value="Completed" style={{ color: "#000", background: "#fff" }}>Completed</option>
                        <option value="Cancelled" style={{ color: "#000", background: "#fff" }}>Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-md-5">
                    <div className="d-flex flex-column gap-1.5 small text-secondary">
                      <div className="d-flex justify-content-between">
                        <span>Subtotal:</span>
                        <span className="fw-semibold text-dark">${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Shipping Cost:</span>
                        <span className="fw-semibold text-dark">${selectedOrder.shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Tax (10%):</span>
                        <span className="fw-semibold text-dark">${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <hr className="my-1.5 text-muted" />
                      <div className="d-flex justify-content-between fw-bold text-dark fs-6">
                        <span>Total:</span>
                        <span className="text-primary">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
