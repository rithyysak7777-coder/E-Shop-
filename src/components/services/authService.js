import axios from "../api/axios";

export const LoginAccount = async (credentials) => {
  try {
    const response = await axios.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const RegisterAccount = async (data) => {
  try {
    const response = await axios.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
