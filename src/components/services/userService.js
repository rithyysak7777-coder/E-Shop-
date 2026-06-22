import axios from "../api/axios";

export const getAllUsersAPi = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get("/admin/users", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserByIdApi = async (id) => {
  try {
    const response = await axios.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUserApi = async (data) => {
  try {
    const response = await axios.post("/admin/users", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserApi = async (id, data) => {
  try {
    let response;
    // If sending FormData (file upload), use POST with method override so PHP/Laravel can parse files
    if (data instanceof FormData) {
      // ensure method override
      if (!data.has("_method")) data.append("_method", "PUT");
      response = await axios.post(`/admin/users/${id}`, data);
    } else {
      response = await axios.put(`/admin/users/${id}`, data);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserApi = async (id) => {
  try {
    const response = await axios.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
