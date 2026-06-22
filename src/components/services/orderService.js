import axios from "../api/axios";
import { extractCollection, extractResource } from "./apiHelpers";

const normalizeOrder = (order) => {
  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : [];

  return {
    ...order,
    id: order.id,
    userName: order.customer_name || order.user?.name || order.userName,
    userEmail: order.customer_email || order.user?.email || order.userEmail,
    date: order.created_at || order.date,
    items: items.map((item) => ({
      ...item,
      id: item.id,
      name: item.product_name || item.name,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 0),
    })),
    shippingDetails: {
      fullName: order.customer_name,
      phone: order.phone,
      address: order.shipping_address,
      city: order.shipping_city,
    },
    paymentDetails: {
      cardType: order.payment_method || "Simulated Card",
      lastFour: order.payment_last_four || "0000",
    },
    subtotal: Number(order.subtotal || 0),
    shippingCost: Number(order.shipping_cost || 0),
    tax: Number(order.tax || 0),
    total: Number(order.total || 0),
    paymentStatus: order.payment_status || "Paid",
    orderStatus: order.order_status || "Pending",
  };
};

export const createOrderApi = async ({ items, shipping, payment }) => {
  const response = await axios.post("/orders", {
    shipping,
    payment,
    items: items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    })),
  });

  return normalizeOrder(extractResource(response.data, "order"));
};

export const getMyOrdersApi = async () => {
  const response = await axios.get("/orders");
  return extractCollection(response.data, "orders").map(normalizeOrder);
};

export const getAdminOrdersApi = async () => {
  const response = await axios.get("/admin/orders");
  return extractCollection(response.data, "orders").map(normalizeOrder);
};

export const updateOrderStatusApi = async (id, orderStatus) => {
  const response = await axios.patch(`/admin/orders/${id}/status`, {
    order_status: orderStatus,
  });
  return normalizeOrder(extractResource(response.data, "order"));
};

export const updatePaymentStatusApi = async (id, paymentStatus) => {
  const response = await axios.patch(`/admin/orders/${id}/payment-status`, {
    payment_status: paymentStatus,
  });
  return normalizeOrder(extractResource(response.data, "order"));
};

export const deleteOrderApi = async (id) => {
  const response = await axios.delete(`/admin/orders/${id}`);
  return response.data;
};
