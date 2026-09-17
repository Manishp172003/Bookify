const API_BASE_URL = "http://localhost:5000/api/admin";

const getAdminHeaders = () => {
  let token = null;
  try {
    token = localStorage.getItem("token") || localStorage.getItem("bookify_token");
    if (!token) {
      const user = JSON.parse(localStorage.getItem("bookify_user") || "{}");
      token = user.token;
    }
  } catch {}

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const adminService = {
  async getAuthorsForVerification() {
    try {
      const res = await fetch(`${API_BASE_URL}/authors-verification`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (err) {
      console.warn("Could not fetch authors from server:", err);
    }
    return [];
  },

  async verifyAuthor(id, status) {
    const isVerified = status === "verified";
    try {
      const res = await fetch(`${API_BASE_URL}/authors-verification/${id}`, {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ status, isVerified }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Could not update author verification on server:", err);
    }
    return null;
  },
};
