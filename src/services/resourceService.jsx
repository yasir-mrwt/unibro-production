const API_URL = import.meta.env.VITE_API_URL + "/api/resources";
// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Upload resource (verified users only)
export const uploadResource = async (resourceData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login to upload resources");
    }

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Send token in header
      },
      credentials: "include", // Keep this for cookies if you use them
      body: JSON.stringify(resourceData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload resource");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get approved resources with filters
export const getResources = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${API_URL}?${queryParams}` : API_URL;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch resources");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get user's own resources
export const getMyResources = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login to view your posts");
    }

    const response = await fetch(`${API_URL}/my-posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch your resources");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Delete resource
export const deleteResource = async (resourceId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login to delete resources");
    }

    const response = await fetch(`${API_URL}/${resourceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete resource");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Increment download count
export const incrementDownload = async (resourceId) => {
  try {
    const response = await fetch(`${API_URL}/${resourceId}/download`, {
      method: "PUT",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    // Don't throw error for download increment
    if (!response.ok) {
      console.warn("Failed to increment download count");
    }
  } catch (error) {
    console.error("Failed to increment download:", error);
  }
};

// Increment view count
export const incrementView = async (resourceId) => {
  try {
    const response = await fetch(`${API_URL}/${resourceId}/view`, {
      method: "PUT",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    // Don't throw error for view increment
    if (!response.ok) {
      console.warn("Failed to increment view count");
    }
  } catch (error) {
    console.error("Failed to increment view:", error);
  }
};

// Get pending resources (Admin only)
export const getPendingResources = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Admin authentication required");
    }

    const response = await fetch(`${API_URL}/pending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch pending resources");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Approve resource (Admin only)
export const approveResource = async (resourceId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Admin authentication required");
    }

    const response = await fetch(`${API_URL}/${resourceId}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to approve resource");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Reject resource (Admin only)
export const rejectResource = async (resourceId, reason) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Admin authentication required");
    }

    const response = await fetch(`${API_URL}/${resourceId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({ reason }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reject resource");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get all resources (Admin only)
export const getAllResourcesAdmin = async (status = "all") => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Admin authentication required");
    }

    const url = `${API_URL}/admin/all?status=${status}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch resources");
    }

    return data;
  } catch (error) {
    throw error;
  }
};
