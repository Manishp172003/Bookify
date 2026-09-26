const RAW_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_BASE_URL = `${RAW_API_URL.replace(/\/api\/?$/, "")}/api/author`;

/**
 * Get currently active user from localStorage
 */
export const getCurrentAuthor = () => {
  try {
    const raw = localStorage.getItem("bookify_user");
    if (raw) {
      const user = JSON.parse(raw);
      if (user && typeof user === "object") return user;
    }
  } catch {}
  return null;
};

/**
 * Check if the user is the showcase Demo Author
 */
export const isDemoAuthor = (user = null) => {
  const current = user || getCurrentAuthor();
  if (!current) return false; // Unauthenticated visitors get a clean slate, NOT demo showcase data
  const email = (current.email || "").toLowerCase();
  const id = (current.id || current._id || "").toString();
  return (
    email === "author@bookify.com" ||
    email === "demo@bookify.com" ||
    email === "rahulverma.author@gmail.com" ||
    id === "demo_author" ||
    id === "usr_demo_author" ||
    current.isDemoUser === true
  );
};

// Storage Keys
const getBooksStorageKey = () => {
  const user = getCurrentAuthor();
  if (isDemoAuthor(user)) return "bookify_author_books_demo_v3";
  return `bookify_author_books_${user?.id || user?._id || user?.email || "guest"}`;
};

const getCampaignsStorageKey = () => {
  const user = getCurrentAuthor();
  if (isDemoAuthor(user)) return "bookify_author_campaigns_demo_v3";
  return `bookify_author_campaigns_${user?.id || user?._id || user?.email || "guest"}`;
};

// Initial Demo Showcase Seed Data (strictly ONE showcase book for demo account only)
const DEMO_SINGLE_BOOK = [
  {
    id: "demo_b1",
    title: "The Silent Mind",
    category: "Self Help",
    publishedDate: "02 Apr 2026",
    status: "Published",
    sales: "3,260",
    earnings: "₹12,480",
    cover: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
    bgCover: "bg-[#6C4BF4]",
    price: 499
  }
];

const DEMO_SINGLE_CAMPAIGN = [
  {
    id: "demo_c1",
    name: "Home Banner Spotlight",
    type: "Home Boost",
    status: "Running",
    rate: "₹299 / day",
    views: "14.8K",
    clicks: "740",
    ctr: "5.00%",
    spent: "₹1,495",
    book: "The Silent Mind"
  }
];

/**
 * Get authorization header from stored user token
 */
const getAuthHeaders = () => {
  let token = null;
  try {
    const user = getCurrentAuthor();
    token = user?.token || localStorage.getItem("bookify_token");
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
    const user = getCurrentAuthor();
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          return {
            ...data.data,
            authorAvatar: data.data.authorAvatar || user?.authorAvatar || user?.avatar || null,
          };
        }
      }
    } catch {}

    // Fallback based on user
    if (isDemoAuthor(user)) {
      return {
        fullName: "Rahul Verma",
        penName: "R. V. Writes",
        email: "author@bookify.com",
        authorBio: "Passionate writer on self-help and personal transformation.",
        website: "https://rvwrites.com",
        publisherImprint: "Lotus Crest Publishing",
        authorAvatar: user?.authorAvatar || null,
        isVerified: true,
        authorVerificationStatus: "verified",
        authorVerificationDocuments: [],
        socialLinks: {
          twitter: "https://twitter.com/rvwrites",
          instagram: "https://instagram.com/rvwrites",
          goodreads: "https://goodreads.com/rvwrites",
        },
      };
    }

    return {
      fullName: user?.fullName || "Author",
      penName: user?.penName || "",
      email: user?.email || "",
      authorBio: user?.authorBio || "",
      website: user?.website || "",
      publisherImprint: user?.publisherImprint || "",
      authorAvatar: user?.authorAvatar || user?.avatar || null,
      isVerified: user?.isVerified || false,
      authorVerificationStatus: user?.authorVerificationStatus || "unverified",
      authorVerificationDocuments: user?.authorVerificationDocuments || [],
      socialLinks: user?.socialLinks || {},
    };
  },

  async updateProfile(profileData) {
    let responseData = null;
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      if (res.ok) {
        const data = await res.json();
        responseData = data.data;
      }
    } catch {}

    // Save locally and synchronize bookify_user
    const user = getCurrentAuthor() || {};
    const updated = {
      ...user,
      ...(responseData || {}),
      ...profileData,
      isAuthor: true,
      hasAuthorProfile: true,
      authorAvatar:
        profileData.authorAvatar !== undefined
          ? profileData.authorAvatar
          : (responseData?.authorAvatar || user?.authorAvatar || user?.avatar || null),
    };
    localStorage.setItem("bookify_user", JSON.stringify(updated));
    return updated;
  },

  async submitVerification(payload) {
    let result = null;
    try {
      const res = await fetch(`${API_BASE_URL}/verify`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        result = json.data;
      }
    } catch {}

    // Synchronize locally to bookify_user
    const user = getCurrentAuthor() || {};
    const existingDocs = user.authorVerificationDocuments || [];
    const newDoc = {
      title: payload.documentTitle,
      url: payload.documentFile || payload.documentUrl,
      fileName: payload.fileName || "verification_document",
      fileType: payload.fileType || "pdf",
      uploadedAt: new Date().toISOString(),
    };
    const updated = {
      ...user,
      authorVerificationStatus: "pending",
      authorVerificationDocuments: [newDoc, ...existingDocs],
    };
    localStorage.setItem("bookify_user", JSON.stringify(updated));
    return { success: true, data: result || updated };
  },

  // ==========================================
  // Books Management (User-Isolated & Persistent)
  // ==========================================
  async getMyBooks() {
    const user = getCurrentAuthor();
    const storageKey = getBooksStorageKey();

    // 1. Check local storage first
    let localBooks = null;
    const rawLocal = localStorage.getItem(storageKey);
    if (rawLocal !== null) {
      try {
        localBooks = JSON.parse(rawLocal);
      } catch {}
    } else {
      // First time initialization:
      // If Demo Author -> 1 demo showcase book
      // If New Real Author -> strictly 0 books (clean slate!)
      if (isDemoAuthor(user)) {
        localBooks = DEMO_SINGLE_BOOK;
      } else {
        localBooks = [];
      }
      localStorage.setItem(storageKey, JSON.stringify(localBooks));
    }

    // 2. Try fetching from MongoDB backend
    try {
      const res = await fetch(`${API_BASE_URL}/my-books`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          const apiFormatted = data.data.map((b, idx) => ({
            id: b._id || b.id || `book_${idx}`,
            title: b.title,
            category: b.category || "General",
            publishedDate: b.createdAt
              ? new Date(b.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Recently",
            status: b.status === "Active" ? "Published" : (b.status || "Published"),
            sales: (b.salesCount || 0).toLocaleString(),
            earnings: `₹${(b.totalEarnings || (b.price ? b.price * (b.salesCount || 0) : 0)).toLocaleString()}`,
            cover: b.images && b.images[0] ? b.images[0] : null,
            price: b.price || 0,
            bgCover: "bg-[#6C4BF4]",
          }));

          // Merge without resurrecting deleted local items
          localStorage.setItem(storageKey, JSON.stringify(apiFormatted));
          return apiFormatted;
        }
      }
    } catch {}

    return localBooks || [];
  },

  async submitBook(bookData) {
    const user = getCurrentAuthor();
    const storageKey = getBooksStorageKey();

    const newBook = {
      id: `bk_${Date.now()}`,
      title: bookData.title,
      category: bookData.category || "General",
      publishedDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Published",
      sales: "0",
      earnings: "₹0",
      cover: bookData.images && bookData.images[0] ? bookData.images[0] : null,
      price: bookData.price || 0,
      bgCover: "bg-[#6C4BF4]",
    };

    // 1. Save to persistent localStorage
    let currentBooks = [];
    try {
      currentBooks = JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {}
    const updated = [newBook, ...currentBooks];
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // 2. Sync to MongoDB
    try {
      await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(bookData),
      });
    } catch {}

    return newBook;
  },

  async deleteBook(id) {
    const storageKey = getBooksStorageKey();

    // 1. Remove permanently from localStorage so it NEVER comes back on reload
    let currentBooks = [];
    try {
      currentBooks = JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {}
    const filtered = currentBooks.filter((b) => b.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filtered));

    // 2. Sync deletion to MongoDB
    try {
      await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    } catch {}

    return { success: true, id };
  },

  // ==========================================
  // Campaigns Management (User-Isolated)
  // ==========================================
  async getCampaigns() {
    const user = getCurrentAuthor();
    const storageKey = getCampaignsStorageKey();

    let localCamps = null;
    const rawLocal = localStorage.getItem(storageKey);
    if (rawLocal !== null) {
      try {
        localCamps = JSON.parse(rawLocal);
      } catch {}
    } else {
      localCamps = isDemoAuthor(user) ? DEMO_SINGLE_CAMPAIGN : [];
      localStorage.setItem(storageKey, JSON.stringify(localCamps));
    }

    try {
      const res = await fetch(`${API_BASE_URL}/campaigns`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          // Format backend Campaign model to frontend dashboard structure
          return data.data.map((c) => ({
            id: c._id || c.id,
            name: c.title,
            type: c.campaignType === "category_boost" ? "Category Boost" : "Home Boost",
            status: c.status === "active" ? "Running" : "Paused",
            rate: `₹${c.dailyRate || (c.campaignType === "category_boost" ? 149 : 299)} / day`,
            views: (c.impressions || 0).toString(),
            clicks: (c.clicks || 0).toString(),
            ctr: c.impressions > 0 ? `${((c.clicks / c.impressions) * 100).toFixed(2)}%` : "0.00%",
            spent: `₹${c.totalCost || c.budget || 0}`,
            book: c.bookId?.title || c.title,
            paymentMethod: c.paymentMethod,
            paymentStatus: c.paymentStatus,
          }));
        }
      }
    } catch {}

    return localCamps || [];
  },

  async createCampaign(campaignData) {
    const storageKey = getCampaignsStorageKey();
    const rate = campaignData.campaignType === "category_boost" ? 149 : 299;
    const days = Number(campaignData.days) || 7;
    const isFree = campaignData.paymentMethod === "free_trial";
    const totalCost = isFree ? 0 : rate * days;

    const newCamp = {
      id: `camp_${Date.now()}`,
      name: campaignData.title,
      type: campaignData.campaignType === "home_banner" ? "Home Boost" : "Category Boost",
      status: "Running",
      rate: `₹${rate} / day`,
      views: "0",
      clicks: "0",
      ctr: "0.00%",
      spent: `₹${totalCost}`,
      book: campaignData.book || "Published Book",
      paymentMethod: campaignData.paymentMethod || "wallet",
    };

    try {
      const res = await fetch(`${API_BASE_URL}/campaigns`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(campaignData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create campaign");
      }

      if (data.walletBalance !== undefined) {
        const rawUser = localStorage.getItem("bookify_user");
        if (rawUser) {
          const u = JSON.parse(rawUser);
          u.walletBalance = data.walletBalance;
          localStorage.setItem("bookify_user", JSON.stringify(u));
        }
      }

      if (data.data) {
        newCamp.id = data.data._id || newCamp.id;
      }
    } catch (err) {
      if (err.message && !err.message.includes("Failed to fetch")) {
        throw err;
      }
    }

    let current = [];
    try {
      current = JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {}
    localStorage.setItem(storageKey, JSON.stringify([newCamp, ...current]));

    return newCamp;
  },

  async updateCampaignStatus(id, status) {
    const storageKey = getCampaignsStorageKey();
    let current = [];
    try {
      current = JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {}
    const updated = current.map((c) =>
      c.id === id ? { ...c, status: status === "running" ? "Running" : "Paused" } : c
    );
    localStorage.setItem(storageKey, JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/campaigns/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: status === "running" ? "active" : "paused" }),
      });
    } catch {}
  },

  async deleteCampaign(id) {
    const storageKey = getCampaignsStorageKey();
    let current = [];
    try {
      current = JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {}
    const filtered = current.filter((c) => c.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filtered));

    try {
      await fetch(`${API_BASE_URL}/campaigns/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
    } catch {}
  },

  async getActiveFeaturedCampaigns() {
    try {
      const res = await fetch(`${API_BASE_URL}/campaigns/active-featured`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) {
          return data.data;
        }
      }
    } catch {}
    return [];
  },

  async trackCampaignEngagement(campaignId, action = "impression") {
    if (!campaignId || campaignId.startsWith("demo_") || campaignId.startsWith("camp_")) return;
    try {
      await fetch(`${API_BASE_URL}/campaigns/${campaignId}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
    } catch {}
  },

  // ==========================================
  // Earnings & Dashboard Metrics
  // ==========================================
  async getEarnings() {
    const user = getCurrentAuthor();
    if (!isDemoAuthor(user)) {
      // Real author: calculate from actual books
      const books = await this.getMyBooks();
      const totalRev = books.reduce((sum, b) => {
        const num = parseFloat((b.earnings || "0").replace(/[^0-9.]/g, ""));
        return sum + (isNaN(num) ? 0 : num);
      }, 0);

      return {
        totalRevenue: totalRev,
        availableBalance: totalRev,
        pendingPayout: 0,
        lifetimePaidOut: 0,
      };
    }

    // Demo showcase author
    return {
      totalRevenue: 48750,
      availableBalance: 32680,
      pendingPayout: 1980,
      lifetimePaidOut: 14090,
    };
  },

  async requestPayout(amount, payoutMethod, payoutDetails) {
    try {
      await fetch(`${API_BASE_URL}/payouts`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount, payoutMethod, payoutDetails }),
      });
    } catch {}
    return { success: true };
  },

  async getDashboardStats() {
    const user = getCurrentAuthor();
    const books = await this.getMyBooks();
    const campaigns = await this.getCampaigns();

    if (!isDemoAuthor(user)) {
      // Real author clean calculation
      const totalSales = books.reduce((sum, b) => {
        const num = parseInt((b.sales || "0").replace(/[^0-9]/g, ""), 10);
        return sum + (isNaN(num) ? 0 : num);
      }, 0);

      const totalRevenue = books.reduce((sum, b) => {
        const num = parseFloat((b.earnings || "0").replace(/[^0-9.]/g, ""));
        return sum + (isNaN(num) ? 0 : num);
      }, 0);

      return {
        isDemo: false,
        totalBooks: books.length,
        totalReaders: totalSales,
        totalSales: `₹${totalRevenue.toLocaleString()}`,
        totalEarnings: `₹${Math.round(totalRevenue * 0.75).toLocaleString()}`,
        activeCampaigns: campaigns.filter((c) => c.status === "Running").length,
        recentOrders: [],
      };
    }

    // Demo author showcase
    return {
      isDemo: true,
      totalBooks: books.length,
      totalReaders: books.length > 0 ? "12.4K" : "0",
      totalSales: books.length > 0 ? "₹48,750" : "₹0",
      totalEarnings: books.length > 0 ? "₹32,680" : "₹0",
      activeCampaigns: campaigns.filter((c) => c.status === "Running").length,
      recentOrders: [],
    };
  },
};
