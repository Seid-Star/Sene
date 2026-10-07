
import api from "./api";

export const authService = {
  // Login user and store token
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);

    const data = response.data;

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  // Register new user
  async register(userData) {
    const response = await api.post("/auth/register", userData);

    const data = response.data;

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  },

  // Logout user
  logout() {
    localStorage.removeItem("token");
  },

  // Fetch authenticated user profile
  async getCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
      }

      throw new Error(
        error.response?.data?.message || "Session expired"
      );
    }
  },

  // Helper to check token existence
  getToken() {
    return localStorage.getItem("token");
  },
};