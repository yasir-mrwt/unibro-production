import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Get auth token
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token;
};

// Axios instance with auth
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ FIXED: Get messages for a room (consistent parameters)
export const getRoomMessages = async (
  department,
  semester,
  limit = 50,
  page = null
) => {
  try {
    let url = `/api/chat/messages/${encodeURIComponent(
      department
    )}/${semester}?limit=${limit}`;

    // Note: Backend uses 'before' parameter, not 'page'
    // If you need pagination, modify backend to support page numbers
    // For now, we'll just load the last N messages

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Get messages error:", error);
    throw error.response?.data || { message: "Failed to fetch messages" };
  }
};

// Send a message (via REST API as backup)
export const sendMessage = async (
  department,
  semester,
  message,
  replyTo = null
) => {
  try {
    const response = await api.post("/api/chat/messages", {
      department,
      semester,
      message,
      replyTo,
    });
    return response.data;
  } catch (error) {
    console.error("Send message error:", error);
    throw error.response?.data || { message: "Failed to send message" };
  }
};

// Delete a message
export const deleteMessage = async (messageId) => {
  try {
    const response = await api.delete(`/api/chat/messages/${messageId}`);
    return response.data;
  } catch (error) {
    console.error("Delete message error:", error);
    throw error.response?.data || { message: "Failed to delete message" };
  }
};

// Get unread count
export const getUnreadCount = async (department, semester) => {
  try {
    const response = await api.get(
      `/api/chat/unread/${encodeURIComponent(department)}/${semester}`
    );
    return response.data;
  } catch (error) {
    console.error("Get unread count error:", error);
    return { unreadCount: 0 };
  }
};

// Mark as read
export const markAsRead = async (department, semester) => {
  try {
    const response = await api.put(
      `/api/chat/read/${encodeURIComponent(department)}/${semester}`
    );
    return response.data;
  } catch (error) {
    console.error("Mark as read error:", error);
    throw error.response?.data || { message: "Failed to mark as read" };
  }
};

// Get active users
export const getActiveUsers = async (department, semester) => {
  try {
    const response = await api.get(
      `/api/chat/active/${encodeURIComponent(department)}/${semester}`
    );
    return response.data;
  } catch (error) {
    console.error("Get active users error:", error);
    return { count: 0, users: [] };
  }
};
