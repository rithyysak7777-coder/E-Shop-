import React, { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaUndo } from "react-icons/fa";
import { getAdminOrdersApi, updatePaymentStatusApi } from "../../services/orderService";
import "../adminCrud.css";

const AdminPayments = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setOrders(await getAdminOrdersApi());
    } catch (err) {
      console.error("Error loading payments:", err);
      setError("Could not load payment transactions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const payments = orders.map((order) => ({
    txnId: "TXN-" + String(order.id).padStart(6, "0"),
    orderId: order.id,
    customerName: order.userName,
    customerEmail: order.userEmail,
    amount: order.total,
    cardBrand: order.paymentDetails?.cardType || "Simulated Card",
    cardLastFour: order.paymentDetails?.lastFour || "0000",
    date: order.date,
    status: order.paymentStatus || "Paid",
  }));

  const handleRefund = async (orderId) => {
    if (!window.confirm(`Are you sure you want to issue a refund for Order #${orderId}?`)) return;

    try {
      const updatedOrder = await updatePaymentStatusApi(orderId, "Refunded");
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? updatedOrder : order)),
      );
    } catch (err) {
      console.error("Error refunding payment:", err);
      alert("Failed to refund payment.");
    }
  };

  return (
    <div className="admin-crud">
      <div className="admin-crud-header">
        <div>
          <h2>Payment Transactions</h2>
          <p>Track customer invoice payments, credit authorizations, and process refunds.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-crud-card">
        {isLoading ? (
          <div className="admin-empty d-flex flex-column align-items-center justify-content-center text-muted py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 mb-0">Loading payments from database...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="admin-empty d-flex flex-column align-items-center justify-content-center text-muted py-5">
            <i className="bi bi-credit-card fs-1 mb-2" />
            <p className="mb-0">No payment transactions recorded.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Transaction ID</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Card Details</th>
                  <th>Paid Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="pe-4 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay) => (
                  <tr key={pay.txnId}>
                    <td className="ps-4">
                      <span className="font-monospace fw-bold text-dark">{pay.txnId}</span>
                    </td>
                    <td>
                      <span className="font-monospace small">#{pay.orderId}</span>
                    </td>
                    <td>
                      <div className="fw-bold">{pay.customerName}</div>
                      <small className="text-muted">{pay.customerEmail}</small>
                    </td>
                    <td>
                      <div className="small d-flex align-items-center gap-1.5">
                        <i className="bi bi-credit-card-2-front"></i>
                        <span>
                          {pay.cardBrand} ending in <strong>{pay.cardLastFour}</strong>
                        </span>
                      </div>
                    </td>
                    <td>{new Date(pay.date).toLocaleString()}</td>
                    <td className="fw-bold text-primary">${pay.amount.toFixed(2)}</td>
                    <td>
                      {pay.status === "Refunded" ? (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle d-inline-flex align-items-center gap-1">
                          <FaTimesCircle /> Refunded
                        </span>
                      ) : (
                        <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
                          <FaCheckCircle /> Successful
                        </span>
                      )}
                    </td>
                    <td className="pe-4 text-end">
                      {pay.status !== "Refunded" && (
                        <button
                          onClick={() => handleRefund(pay.orderId)}
                          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 ms-auto"
                          style={{ borderRadius: "8px" }}
                        >
                          <FaUndo size={11} />
                          <span>Refund</span>
                        </button>
                      )}
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

export default AdminPayments;
