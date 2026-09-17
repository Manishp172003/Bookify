const API_BASE_URL = "http://localhost:5000/api/author";

/**
 * Get authorization header from stored user token
 */
const getAuthHeaders = () => {
  let token = null;
  try {
    const user = JSON.parse(localStorage.getItem("bookify_user") || "{}");
    token = user.token || localStorage.getItem("bookify_token");
  } catch {}

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authorService = {
  // ==========================================
  // Profile & Verification
  // ==========================================
  async getProfile() {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch author profile");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] getProfile fallback:", err.message);
      return null;
    }
  },

  async updateProfile(profileData) {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] updateProfile fallback:", err.message);
      return null;
    }
  },

  async submitVerification(documentTitle, documentUrl) {
    try {
      const res = await fetch(`${API_BASE_URL}/verify`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ documentTitle, documentUrl }),
      });
      if (!res.ok) throw new Error("Failed to submit verification");
      return await res.json();
    } catch (err) {
      console.warn("[authorService] submitVerification fallback:", err.message);
      return null;
    }
  },

  // ==========================================
  // Books Management
  // ==========================================
  async getMyBooks() {
    try {
      const res = await fetch(`${API_BASE_URL}/my-books`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch author books");
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn("[authorService] getMyBooks fallback:", err.message);
      return [];
    }
  },

  async submitBook(bookData) {
    try {
      const res = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(bookData),
      });
      if (!res.ok) throw new Error("Failed to submit book");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] submitBook fallback:", err.message);
      return null;
    }
  },

  async updateBook(id, bookData) {
    try {
      const res = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(bookData),
      });
      if (!res.ok) throw new Error("Failed to update book");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] updateBook fallback:", err.message);
      return null;
    }
  },

  async deleteBook(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete book");
      return await res.json();
    } catch (err) {
      console.warn("[authorService] deleteBook fallback:", err.message);
      return null;
    }
  },

  // ==========================================
  // Coupons Management
  // ==========================================
  async getCoupons() {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch coupons");
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn("[authorService] getCoupons fallback:", err.message);
      return [];
    }
  },

  async createCoupon(couponData) {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(couponData),
      });
      if (!res.ok) throw new Error("Failed to create coupon");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] createCoupon fallback:", err.message);
      return null;
    }
  },

  async toggleCoupon(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/${id}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to toggle coupon");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] toggleCoupon fallback:", err.message);
      return null;
    }
  },

  async deleteCoupon(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete coupon");
      return await res.json();
    } catch (err) {
      console.warn("[authorService] deleteCoupon fallback:", err.message);
      return null;
    }
  },

  // ==========================================
  // Marketing Campaigns
  // ==========================================
  async getCampaigns() {
    try {
      const res = await fetch(`${API_BASE_URL}/campaigns`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn("[authorService] getCampaigns fallback:", err.message);
      return [];
    }
  },

  async createCampaign(campaignData) {
    try {
      const res = await fetch(`${API_BASE_URL}/campaigns`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(campaignData),
      });
      if (!res.ok) throw new Error("Failed to create campaign");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] createCampaign fallback:", err.message);
      return null;
    }
  },

  async updateCampaignStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/campaigns/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update campaign status");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] updateCampaignStatus fallback:", err.message);
      return null;
    }
  },

  // ==========================================
  // Earnings & Payouts
  // ==========================================
  async getEarnings() {
    try {
      const res = await fetch(`${API_BASE_URL}/earnings`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch earnings");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] getEarnings fallback:", err.message);
      return null;
    }
  },

  async requestPayout(amount, payoutMethod, payoutDetails) {
    try {
      const res = await fetch(`${API_BASE_URL}/payouts`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount, payoutMethod, payoutDetails }),
      });
      if (!res.ok) throw new Error("Failed to submit payout request");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] requestPayout fallback:", err.message);
      return null;
    }
  },

  // ==========================================
  // Dashboard Stats & Analytics
  // ==========================================
  async getDashboardStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard-stats`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] getDashboardStats fallback:", err.message);
      return null;
    }
  },

  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn("[authorService] getAnalytics fallback:", err.message);
      return null;
    }
  },
};
