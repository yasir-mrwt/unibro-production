// API Base URL
const API_URL = import.meta.env.VITE_API_URL + "/api/auth";

// ✅ Cache for user data to prevent repeated parsing
let cachedUser = null;
let lastUserCheck = 0;
const USER_CACHE_DURATION = 1000; // Cache for 1 second

// Register user
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    if (data.success && data.token) {
      const userWithToken = {
        ...data.user,
        token: data.token,
      };
      localStorage.setItem("user", JSON.stringify(userWithToken));
      localStorage.setItem("token", data.token);
      cachedUser = userWithToken;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (email, password, rememberMe = false) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.success && data.token) {
      const userWithToken = {
        ...data.user,
        token: data.token,
      };
      localStorage.setItem("user", JSON.stringify(userWithToken));
      localStorage.setItem("token", data.token);
      cachedUser = userWithToken;
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = async () => {
  try {
    const token = getStoredToken(); // ✅ Get the token properly

    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Add authorization header
      },
      credentials: "include",
    });

    const data = await response.json();

    // Clear local storage regardless of API response
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    cachedUser = null; // ✅ Clear cache

    return { success: true };
  } catch (error) {
    console.error("❌ Logout error:", error);
    // Still clear local data on error
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    cachedUser = null; // ✅ Clear cache
    return { success: true }; // Consider it successful for UX
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Not authenticated");
    }

    return data.user;
  } catch (error) {
    throw error;
  }
};

// Google OAuth login
export const loginWithGoogle = () => {
  window.location.href = import.meta.env.VITE_API_URL + `/api/auth/google`;
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset email");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/reset-password/${token}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reset password");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Resend verification email
export const resendVerificationEmail = async () => {
  try {
    const token = getStoredToken();

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await fetch(`${API_URL}/resend-verification`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          data.message || "Too many requests. Please wait before trying again."
        );
      }
      throw new Error(data.message || "Failed to resend verification email");
    }

    return data;
  } catch (error) {
    console.error("❌ Resend verification error:", error);
    throw error;
  }
};

// Check if user is logged in
export const isAuthenticated = () => {
  const user = getStoredUser();
  const token = getStoredToken();
  return !!(user && token);
};

// ✅ OPTIMIZED: Get stored user with caching
export const getStoredUser = () => {
  const now = Date.now();

  // Return cached user if still valid
  if (cachedUser && now - lastUserCheck < USER_CACHE_DURATION) {
    return cachedUser;
  }

  try {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      cachedUser = parsed;
      lastUserCheck = now;
      return parsed;
    }
  } catch (error) {
    console.error("❌ Error parsing user from localStorage:", error);
  }

  cachedUser = null;
  lastUserCheck = now;
  return null;
};

// Get stored token from multiple sources
export const getStoredToken = () => {
  let token = localStorage.getItem("token");

  if (!token) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        token = user.token;
      } catch (e) {
        console.error("❌ Error parsing user for token:", e);
      }
    }
  }

  return token;
};

// Get username from email
export const getUsernameFromEmail = (email) => {
  if (!email) return "User";
  return email.split("@")[0];
};

// Get auth token (used by chat services)
export const getAuthToken = () => {
  return getStoredToken();
};

// Update user in storage
export const updateStoredUser = (updates) => {
  const currentUser = getStoredUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    cachedUser = updatedUser;

    window.dispatchEvent(
      new CustomEvent("userUpdated", { detail: updatedUser })
    );

    return updatedUser;
  }
  return null;
};

// Store auth data (called after login/register)
export const storeAuthData = (userData) => {
  if (userData.token) {
    localStorage.setItem("token", userData.token);
  }
  if (userData.user) {
    const userWithToken = {
      ...userData.user,
      token: userData.token || userData.user.token,
    };
    localStorage.setItem("user", JSON.stringify(userWithToken));
    cachedUser = userWithToken; // ✅ Update cache
  } else {
    localStorage.setItem("user", JSON.stringify(userData));
    cachedUser = userData; // ✅ Update cache
  }
};

// Clear auth data (called on logout)
export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  cachedUser = null;
};
