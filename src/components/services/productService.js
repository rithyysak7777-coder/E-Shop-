import axios from "../api/axios";

export const getAllProductsApi = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get("/admin/products", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductByIdApi = async (id) => {
  try {
    const response = await axios.get(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProductApi = async (data) => {
  try {
    const response = await axios.post("/admin/products", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProductApi = async (id, data) => {
  try {
    // If sending FormData (files), use POST with _method=PUT so Laravel handles file uploads correctly
    if (data instanceof FormData) {
      const response = await axios.post(`/admin/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    }

    const response = await axios.put(`/admin/products/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProductApi = async (id) => {
  try {
    const response = await axios.delete(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
