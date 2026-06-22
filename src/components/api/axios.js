import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

//  Auto attach token for ALL requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("🔐 Axios Interceptor:", {
    url: config.url,
    method: config.method,
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
  });

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(
      "✅ Authorization header set:",
      config.headers.Authorization.substring(0, 30) + "...",
    );
  } else {
    console.warn("⚠️ No token found in localStorage!");
  }

  // Only set Content-Type for non-FormData requests
  // FormData needs to set its own Content-Type with boundary for multipart uploads
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  } else {
    // Remove Content-Type for FormData - let browser set it automatically
    delete config.headers["Content-Type"];
  }

  return config;
});

export default api;
