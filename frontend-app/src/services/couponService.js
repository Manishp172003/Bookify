// Coupon Service with isolated localStorage persistence, author account isolation, and permanent deletions

import { getCurrentAuthor, isDemoAuthor } from "./authorService";

const ADMIN_STORAGE_KEY = "bookify_admin_coupons_v4";

// Platform-Wide Initial Seed for Admin Portal
const initialAdminCoupons = [
  {
    id: "coup_admin_1",
    code: "WELCOME50",
    discountType: "percentage",
    discountValue: 50,
    minPurchase: 499,
    creatorRole: "admin",
    creatorName: "Platform Admin",
    applicableScope: "ALL_BOOKS",
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
  }
];

// Single showcase demo coupon for Demo Author ONLY (Rahul Verma)
const initialDemoAuthorCoupon = {
  id: "coup_demo_1",
  code: "SILENTMIND25",
  discountType: "percentage",
  discountValue: 25,
  minPurchase: 300,
  creatorRole: "author",
  creatorId: "demo",
  creatorName: "Rahul Verma",
  applicableScope: "SPECIFIC_BOOKS",
  applicableBooks: ["The Silent Mind"],
  validUntil: "2026-10-31",
  status: "Active",
  usageCount: 64,
  usageLimit: 150,
  createdAt: "2026-08-05"
};

// Storage key resolution per author
const getAuthorCouponsStorageKey = () => {
  const user = getCurrentAuthor();
  if (isDemoAuthor(user)) {
    return "bookify_author_coupons_demo_v4";
  }
  const id = user?.id || user?._id || user?.email || "clean";
  return `bookify_author_coupons_${id}`;
};

/**
 * Returns author coupons strictly isolated to the logged-in author
 * Real registered authors start with an empty array [] (clean slate).
 * Demo author starts with exactly 1 showcase coupon (SILENTMIND25).
 * Deletions are 100% permanent and will never reappear.
 */
export const getAuthorCoupons = () => {
  const user = getCurrentAuthor();
  const isDemo = isDemoAuthor(user);
  const storageKey = getAuthorCouponsStorageKey();

  try {
    const raw = localStorage.getItem(storageKey);
    if (raw !== null) {
      return JSON.parse(raw);
    }

    // First-time seed:
    // Only the demo author account gets the showcase demo coupon.
    // Every other author gets strictly [] (clean slate).
    const initial = isDemo ? [initialDemoAuthorCoupon] : [];
    localStorage.setItem(storageKey, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.error("Error reading author coupons from localStorage:", err);
    return isDemo ? [initialDemoAuthorCoupon] : [];
  }
};

/**
 * Returns platform admin coupons
 */
export const getAdminCoupons = () => {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw !== null) {
      return JSON.parse(raw);
    }
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(initialAdminCoupons));
    return initialAdminCoupons;
  } catch (err) {
    console.error("Error reading admin coupons from localStorage:", err);
    return initialAdminCoupons;
  }
};

/**
 * Returns all active coupons (Admin + Author)
 */
export const getCoupons = () => {
  const adminCoupons = getAdminCoupons();
  const authorCoupons = getAuthorCoupons();
  return [...adminCoupons, ...authorCoupons];
};

/**
 * Add a new coupon
 */
export const addCoupon = (newCoupon) => {
  const isAdmin = newCoupon.creatorRole === "admin";

  if (isAdmin) {
    const coupons = getAdminCoupons();
    const created = {
      ...newCoupon,
      id: `coup_admin_${Date.now()}`,
      code: newCoupon.code.toUpperCase().trim(),
      creatorRole: "admin",
      creatorName: newCoupon.creatorName || "Platform Admin",
      usageCount: 0,
      status: newCoupon.status || "Active",
      createdAt: new Date().toISOString().split("T")[0]
    };
    const updated = [created, ...coupons];
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
    return created;
  }

  // Author coupon
  const user = getCurrentAuthor();
  const storageKey = getAuthorCouponsStorageKey();
  const coupons = getAuthorCoupons();
  const myId = isDemoAuthor(user) ? "demo" : (user?.id || user?._id || user?.email || "author");
  const myName = user?.penName || user?.fullName || "Author";

  const created = {
    ...newCoupon,
    id: `coup_auth_${Date.now()}`,
    code: newCoupon.code.toUpperCase().trim(),
    creatorRole: "author",
    creatorId: myId,
    creatorName: myName,
    usageCount: 0,
    status: newCoupon.status || "Active",
    createdAt: new Date().toISOString().split("T")[0]
  };
  const updated = [created, ...coupons];
  localStorage.setItem(storageKey, JSON.stringify(updated));
  return created;
};

/**
 * Update an existing coupon
 */
export const updateCoupon = (id, updatedFields) => {
  // Check author storage first
  const authorKey = getAuthorCouponsStorageKey();
  const authorCoupons = getAuthorCoupons();
  const authIdx = authorCoupons.findIndex((c) => c.id === id);

  if (authIdx !== -1) {
    const updated = authorCoupons.map((c) =>
      c.id === id
        ? {
            ...c,
            ...updatedFields,
            code: updatedFields.code ? updatedFields.code.toUpperCase().trim() : c.code
          }
        : c
    );
    localStorage.setItem(authorKey, JSON.stringify(updated));
    return updated;
  }

  // Admin storage
  const adminCoupons = getAdminCoupons();
  const updatedAdmin = adminCoupons.map((c) =>
    c.id === id
      ? {
          ...c,
          ...updatedFields,
          code: updatedFields.code ? updatedFields.code.toUpperCase().trim() : c.code
        }
      : c
  );
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updatedAdmin));
  return updatedAdmin;
};

/**
 * Toggle Active / Inactive status
 */
export const toggleCouponStatus = (id) => {
  const authorKey = getAuthorCouponsStorageKey();
  const authorCoupons = getAuthorCoupons();
  const authIdx = authorCoupons.findIndex((c) => c.id === id);

  if (authIdx !== -1) {
    const updated = authorCoupons.map((c) =>
      c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c
    );
    localStorage.setItem(authorKey, JSON.stringify(updated));
    return updated;
  }

  const adminCoupons = getAdminCoupons();
  const updatedAdmin = adminCoupons.map((c) =>
    c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c
  );
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updatedAdmin));
  return updatedAdmin;
};

/**
 * Permanently delete a coupon
 */
export const deleteCoupon = (id) => {
  const authorKey = getAuthorCouponsStorageKey();
  const authorCoupons = getAuthorCoupons();
  const authIdx = authorCoupons.findIndex((c) => c.id === id);

  if (authIdx !== -1) {
    const updated = authorCoupons.filter((c) => c.id !== id);
    localStorage.setItem(authorKey, JSON.stringify(updated));
    return updated;
  }

  const adminCoupons = getAdminCoupons();
  const updatedAdmin = adminCoupons.filter((c) => c.id !== id);
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updatedAdmin));
  return updatedAdmin;
};
