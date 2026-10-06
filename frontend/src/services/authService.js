const API_URL = "/api/auth";

export const authService = {
  // Login user and store token
  async login(credentials) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  // Register new user
  async register(userData) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

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

    const response = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      localStorage.removeItem("token");
      throw new Error("Session expired");
    }

    return await response.json();
  },

  // Helper to check token existence
  getToken() {
    return localStorage.getItem("token");
  },
};
