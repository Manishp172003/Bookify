const RAW_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const ROOT_API = RAW_API_URL.replace(/\/api\/?$/, "");
const API_BASE_URL = `${ROOT_API}/api/admin`;

const getAdminHeaders = () => {
  let token = null;
  try {
    token =
      localStorage.getItem("bookify_admin_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("bookify_token");
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
  // ==========================================
  // Dashboard & Metrics
  // ==========================================
  async getMetrics() {
    try {
      const res = await fetch(`${API_BASE_URL}/metrics`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Could not fetch metrics from server:", err);
    }
    return null;
  },

  // ==========================================
  // Users Management
  // ==========================================
  async getUsers(category = "all") {
    try {
      const url = category && category !== "all" 
        ? `${API_BASE_URL}/users?category=${encodeURIComponent(category)}`
        : `${API_BASE_URL}/users`;
      const res = await fetch(url, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return {
          users: json.data || [],
          counts: json.counts || { total: 0, studentOnly: 0, authorOnly: 0, studentAuthor: 0, admin: 0 },
        };
      }
      if (res.status === 403 || res.status === 401) {
        throw new Error("Access Denied: You must be signed in with an Administrator account to view registered users.");
      }
    } catch (err) {
      console.warn("Could not fetch users from server:", err);
      throw err;
    }
    return { users: [], counts: { total: 0, studentOnly: 0, authorOnly: 0, studentAuthor: 0, admin: 0 } };
  },

  async toggleAuthorStatus(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/toggle-author`, {
        method: "PATCH",
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
      const json = await res.json();
      throw new Error(json.message || "Failed to toggle author status");
    } catch (err) {
      console.warn("Could not toggle author status on server:", err);
      throw err;
    }
  },

  async toggleUserBan(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/ban`, {
        method: "PATCH",
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Could not toggle user ban on server:", err);
    }
    return null;
  },

  // ==========================================
  // Listings Moderation
  // ==========================================
  async getListings() {
    try {
      const res = await fetch(`${API_BASE_URL}/listings`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.warn("Could not fetch listings from server:", err);
    }
    return [];
  },

  async moderateListing(id, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/listings/${id}`, {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Could not moderate listing on server:", err);
    }
    return null;
  },

  // ==========================================
  // Orders & Escrow Management
  // ==========================================
  async getOrdersEscrow() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders-escrow`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.warn("Could not fetch escrow orders from server:", err);
    }
    return [];
  },

  async updateEscrow(id, escrowStatus) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/escrow`, {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ escrowStatus }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Could not update escrow on server:", err);
    }
    return null;
  },

  // ==========================================
  // Authors Verification
  // ==========================================
  async getAuthorsForVerification() {
    try {
      const res = await fetch(`${API_BASE_URL}/authors-verification`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.warn("Could not fetch authors from server:", err);
    }
    return [];
  },

  async verifyAuthor(id, status, reviewNote = "") {
    const isVerified = status === "verified";
    try {
      const res = await fetch(`${API_BASE_URL}/authors-verification/${id}`, {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ status, isVerified, reviewNote }),
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

  // ==========================================
  // Platform Settings & Commission
  // ==========================================
  async getPlatformSettings() {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Could not fetch platform settings from server:", err);
    }
    return null;
  },

  async updatePlatformSettings(settings) {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Could not update platform settings on server:", err);
    }
    return null;
  },

  // ==========================================
  // Disputes
  // ==========================================
  async getDisputes() {
    try {
      const res = await fetch(`${API_BASE_URL}/disputes`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.warn("Could not fetch disputes from server:", err);
    }
    return [];
  },

  // ==========================================
  // Coupons Management
  // ==========================================
  async getAdminCoupons() {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.warn("Could not fetch coupons from server:", err);
    }
    return [];
  },

  async createAdminCoupon(couponData) {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons`, {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify(couponData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create coupon");
      return json.data;
    } catch (err) {
      throw err;
    }
  },

  async updateCouponStatus(id, updateData) {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify(updateData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update coupon");
      return json.data;
    } catch (err) {
      console.warn("Could not update coupon on server:", err);
      throw err;
    }
  },

  async deleteAdminCoupon(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.warn("Could not delete coupon on server:", err);
      return false;
    }
  },

  // ==========================================
  // Testimonials Moderation
  // ==========================================
  async getTestimonials(status = "all") {
    try {
      const url =
        status && status !== "all"
          ? `${ROOT_API}/api/testimonials/admin?status=${status}`
          : `${ROOT_API}/api/testimonials/admin`;
      const res = await fetch(url, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (err) {
      console.warn("Could not fetch testimonials for admin:", err);
    }
    return { data: [], counts: { total: 0, pending: 0, approved: 0, rejected: 0 } };
  },

  async updateTestimonialStatus(id, status) {
    try {
      const res = await fetch(`${ROOT_API}/api/testimonials/admin/${id}/status`, {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update testimonial status");
      return json.data;
    } catch (err) {
      console.warn("Could not update testimonial status:", err);
      throw err;
    }
  },

  async toggleFeaturedTestimonial(id) {
    try {
      const res = await fetch(`${ROOT_API}/api/testimonials/admin/${id}/toggle-featured`, {
        method: "PATCH",
        headers: getAdminHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to toggle featured status");
      return json.data;
    } catch (err) {
      console.warn("Could not toggle featured testimonial:", err);
      throw err;
    }
  },

  async deleteTestimonial(id) {
    try {
      const res = await fetch(`${ROOT_API}/api/testimonials/admin/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.warn("Could not delete testimonial:", err);
      return false;
    }
  },

  // ==========================================
  // Newsletter Subscribers
  // ==========================================
  async subscribeNewsletter(email, source = "explore_page") {
    const res = await fetch(`${ROOT_API}/api/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to subscribe");
    return json;
  },

  async getNewsletterSubscribers(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const url = `${ROOT_API}/api/newsletter/admin/subscribers${query ? `?${query}` : ""}`;
      const res = await fetch(url, { headers: getAdminHeaders() });
      if (!res.ok) throw new Error("Failed to fetch subscribers");
      const json = await res.json();
      return json.data || { subscribers: [], total: 0, counts: { total: 0, active: 0, unsubscribed: 0 } };
    } catch (err) {
      console.warn("Could not fetch subscribers:", err);
      return { subscribers: [], total: 0, counts: { total: 0, active: 0, unsubscribed: 0 } };
    }
  },

  async deleteNewsletterSubscriber(id) {
    try {
      const res = await fetch(`${ROOT_API}/api/newsletter/admin/subscribers/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      return res.ok;
    } catch (err) {
      console.warn("Could not delete subscriber:", err);
      return false;
    }
  },

  async exportNewsletterSubscribers() {
    try {
      const res = await fetch(`${ROOT_API}/api/newsletter/admin/export`, {
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error("Failed to export subscribers");
      const json = await res.json();
      return json.data || [];
    } catch (err) {
      console.warn("Could not export subscribers:", err);
      return [];
    }
  },
};
