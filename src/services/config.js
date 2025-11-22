// src/config.js
export const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5001" // For local development
    : "https://unibro-production.up.railway.app"; // For production

export const FRONTEND_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5173" // Your local frontend
    : window.location.origin; // Your deployed frontend URL
