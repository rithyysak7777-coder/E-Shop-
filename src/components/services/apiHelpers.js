import axios from "../api/axios";

/**
 * Creates a slug from a string (for URL-friendly names)
 */
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Builds FormData object from a regular object (for file uploads)
 */
export const buildFormData = (formData, data, parentKey) => {
  if (
    data &&
    typeof data === "object" &&
    !(data instanceof Date) &&
    !(data instanceof File)
  ) {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File) {
        formData.append(formKey, value);
      } else if (
        value &&
        typeof value === "object" &&
        !(value instanceof Date)
      ) {
        buildFormData(formData, value, formKey);
      } else if (value !== null && value !== undefined && value !== "") {
        formData.append(formKey, value);
      }
    });
  }
  return formData;
};

export const extractCollection = (payload, key) => {
  const data = payload?.data ?? payload;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

export const extractResource = (payload, key) => {
  const data = payload?.data ?? payload;
  return data?.[key] ?? data?.data ?? data ?? null;
};

/**
 * Fetches a single resource by ID
 */
export const getResource = async (endpoint, id) => {
  try {
    const response = await axios.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches a collection of resources with pagination
 */
export const getCollection = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a new resource
 */
export const createResource = async (endpoint, data) => {
  try {
    const response = await axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Updates an existing resource
 */
export const updateResource = async (endpoint, id, data) => {
  try {
    const response = await axios.put(`${endpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a resource
 */
export const deleteResource = async (endpoint, id) => {
  try {
    const response = await axios.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
