import axios from "axios";

// Base URL
export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Axios instance
const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout if token invalid/expired
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;