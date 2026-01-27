import axios from "axios";

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token, logging, etc.
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.status,
      );
    }
    return response;
  },
  (error) => {
    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response?.status,
      );
    }

    // Handle specific error codes globally
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth")
      ) {
        window.location.href = "/auth/signin";
      }
    }

    // Extract error message
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Return a formatted error
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  },
);

export default api;
