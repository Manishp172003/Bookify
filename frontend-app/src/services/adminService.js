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
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.warn("Could not fetch users from server:", err);
    }
    return [];
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
};
