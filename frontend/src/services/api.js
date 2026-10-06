import axios from "axios";

// Create Axios instance using Vite environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Bearer token to headers if available
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

// Response Interceptor: Handle global API errors & expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401 Unauthorized, token is expired or invalid
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      
      // Redirect to login page if user isn't already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;