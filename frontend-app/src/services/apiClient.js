/**
 * Bookify Centralized API Client
 * Used to communicate with the Backend API (REST/JSON)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("bookify_token") || localStorage.getItem("bookify_auth_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  // Handle FormData upload (let browser set boundary)
  if (config.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      // Unauthorized: trigger token expiration / clean auth state if needed
      window.dispatchEvent(new CustomEvent("bookify_unauthorized"));
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return await response.json();
  } catch (err) {
    console.error(`[API Error] ${options.method || "GET"} ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: "DELETE" }),
};

export default api;
