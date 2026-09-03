// Coupon Service with localStorage persistence and helper methods for Admin & Author

const STORAGE_KEY = "bookify_coupons_v1";

const initialCoupons = [
  // Admin Platform-Wide Coupons
  {
    id: "coup_admin_1",
    code: "WELCOME50",
    discountType: "percentage", // 'percentage' | 'fixed'
    discountValue: 50,
    minPurchase: 499,
    creatorRole: "admin",
    creatorName: "Platform Admin",
    applicableScope: "ALL_BOOKS", // 'ALL_BOOKS' | 'SPECIFIC_BOOKS'
    applicableBooks: ["All Books"],
    validUntil: "2026-12-31",
    status: "Active",
    usageCount: 142,
    usageLimit: 500,
    createdAt: "2026-08-01"
  },
  {
    id: "coup_admin_2",
    code: "FESTIVE200",
    discountType: "fixed",
    discountValue: 200,
    minPurchase: 999,
    creatorRole: "admin",
    creatorName: "Platform Admin",
    applicableScope: "ALL_BOOKS",
    applicableBooks: ["All Books"],
    validUntil: "2026-11-15",
    status: "Active",
    usageCount: 88,
    usageLimit: 300,
    createdAt: "2026-08-10"
  },
  {
    id: "coup_admin_3",
    code: "TECHPROMO15",
    discountType: "percentage",
    discountValue: 15,
    minPurchase: 200,
    creatorRole: "admin",
    creatorName: "Platform Admin",
    applicableScope: "SPECIFIC_BOOKS",
    applicableBooks: ["Clean Code", "Data Structures"],
    validUntil: "2026-09-30",
    status: "Active",
    usageCount: 45,
    usageLimit: 200,
    createdAt: "2026-08-15"
  },

  // Author Coupons (Applicable strictly to author's published books)
  {
    id: "coup_author_1",
    code: "SILENTMIND25",
    discountType: "percentage",
    discountValue: 25,
    minPurchase: 300,
    creatorRole: "author",
    creatorName: "Current Author",
    applicableScope: "SPECIFIC_BOOKS",
    applicableBooks: ["The Silent Mind"],
    validUntil: "2026-10-31",
    status: "Active",
    usageCount: 64,
    usageLimit: 150,
    createdAt: "2026-08-05"
  },
  {
    id: "coup_author_2",
    code: "INNERPEACE100",
    discountType: "fixed",
    discountValue: 100,
    minPurchase: 350,
    creatorRole: "author",
    creatorName: "Current Author",
    applicableScope: "SPECIFIC_BOOKS",
    applicableBooks: ["Inner Peace"],
    validUntil: "2026-09-15",
    status: "Active",
    usageCount: 29,
    usageLimit: 100,
    createdAt: "2026-08-12"
  },
  {
    id: "coup_author_3",
    code: "MYBOOKSFEST20",
    discountType: "percentage",
    discountValue: 20,
    minPurchase: 250,
    creatorRole: "author",
    creatorName: "Current Author",
    applicableScope: "ALL_AUTHOR_BOOKS",
    applicableBooks: ["All My Published Books"],
    validUntil: "2026-12-01",
    status: "Active",
    usageCount: 92,
    usageLimit: 250,
    createdAt: "2026-08-18"
  }
];

// Initialize storage if empty
const getStoredCoupons = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCoupons));
      return initialCoupons;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading coupons from localStorage:", err);
    return initialCoupons;
  }
};

const saveCouponsToStorage = (coupons) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
  } catch (err) {
    console.error("Error saving coupons to localStorage:", err);
  }
};

export const getCoupons = () => {
  return getStoredCoupons();
};

export const getAdminCoupons = () => {
  return getStoredCoupons().filter((c) => c.creatorRole === "admin");
};

export const getAuthorCoupons = () => {
  return getStoredCoupons().filter((c) => c.creatorRole === "author");
};

export const addCoupon = (newCoupon) => {
  const coupons = getStoredCoupons();
  const created = {
    ...newCoupon,
    id: `coup_${Date.now()}`,
    code: newCoupon.code.toUpperCase().trim(),
    usageCount: 0,
    status: newCoupon.status || "Active",
    createdAt: new Date().toISOString().split("T")[0]
  };
  const updated = [created, ...coupons];
  saveCouponsToStorage(updated);
  return created;
};

export const updateCoupon = (id, updatedFields) => {
  const coupons = getStoredCoupons();
  const updated = coupons.map((c) =>
    c.id === id
      ? {
          ...c,
          ...updatedFields,
          code: updatedFields.code ? updatedFields.code.toUpperCase().trim() : c.code
        }
      : c
  );
  saveCouponsToStorage(updated);
  return updated;
};

export const toggleCouponStatus = (id) => {
  const coupons = getStoredCoupons();
  const updated = coupons.map((c) =>
    c.id === id
      ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
      : c
  );
  saveCouponsToStorage(updated);
  return updated;
};

export const deleteCoupon = (id) => {
  const coupons = getStoredCoupons();
  const updated = coupons.filter((c) => c.id !== id);
  saveCouponsToStorage(updated);
  return updated;
};
