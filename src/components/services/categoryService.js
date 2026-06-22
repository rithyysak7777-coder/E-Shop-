import axios from "../api/axios";

export const getAllCategoriesApi = async () => {
  try {
    const response = await axios.get("/admin/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryByIdApi = async (id) => {
  try {
    const response = await axios.get(`/admin/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCategoryApi = async (data) => {
  try {
    const response = await axios.post("/admin/categories", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategoryApi = async (id, data) => {
  try {
    const response = await axios.put(`/admin/categories/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategoryApi = async (id) => {
  try {
    const response = await axios.delete(`/admin/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
