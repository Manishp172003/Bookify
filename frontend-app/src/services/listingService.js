import { getBookCover } from "../utils/bookCoverUtils";

// Unified listing management service for student user listings and seller flow
// Broadcasts 'bookify_user_listings_updated' on changes

const LISTINGS_STORAGE_KEY = "bookify_user_listings_v1";

const MOCK_LISTING_IDS = new Set(["BKFY-518290", "BKFY-982741", "BKFY-304910", "BKFY-298301"]);

function getStoredListings() {
  try {
    const raw = localStorage.getItem(LISTINGS_STORAGE_KEY);
    if (!raw) return [];
    let listings = JSON.parse(raw);
    if (Array.isArray(listings)) {
      // Filter out any legacy dummy mock listings
      const cleanListings = listings.filter((item) => !MOCK_LISTING_IDS.has(item.id));
      if (cleanListings.length !== listings.length) {
        localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(cleanListings));
      }
      return cleanListings.map((item) => {
        const coverUrl = getBookCover(item);
        return {
          ...item,
          cover: item.cover || coverUrl,
          image: item.image || coverUrl,
          photos: Array.isArray(item.photos) && item.photos.length > 0 ? item.photos : [coverUrl],
        };
      });
    }
    return [];
  } catch {
    return [];
  }
}

function saveAndNotify(listings) {
  try {
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
    window.dispatchEvent(new CustomEvent("bookify_user_listings_updated", { detail: listings }));
  } catch (err) {
    console.error("Failed saving listings", err);
  }
}

export const listingService = {
  getAllListings() {
    return getStoredListings();
  },

  getActiveListings() {
    return getStoredListings().filter((l) => l.status === "Active");
  },

  createListing(listingData) {
    const listings = getStoredListings();
    const idNum = Math.floor(100000 + Math.random() * 900000);
    const coverUrl = getBookCover(listingData);
    const newListing = {
      id: `BKFY-${idNum}`,
      title: listingData.title || "Untitled Textbook",
      author: listingData.author || "Author not specified",
      price: Number(listingData.price) || 399,
      mrp: Number(listingData.mrp) || 999,
      condition: listingData.condition || "good",
      conditionLabel: listingData.condition === "like-new" ? "Like New" : listingData.condition === "very-good" ? "Very Good" : listingData.condition === "fair" ? "Fair" : "Good",
      status: "Active",
      mode: listingData.mode || "sell",
      views: 1,
      wishlists: 0,
      cover: coverUrl,
      image: coverUrl,
      photos: listingData.photos && listingData.photos.length > 0 
        ? listingData.photos 
        : [coverUrl],
      coverClass: "from-[#6C4BF4] to-[#8B3FD9]",
      date: new Date().toISOString().split("T")[0]
    };

    const updated = [newListing, ...listings];
    saveAndNotify(updated);
    return newListing;
  },

  updateListing(id, updates) {
    const listings = getStoredListings();
    let updatedItem = null;
    const updated = listings.map((item) => {
      if (item.id === id) {
        const cond = updates.condition || item.condition;
        const conditionLabel =
          cond === "like-new" ? "Like New" :
          cond === "very-good" ? "Very Good" :
          cond === "fair" ? "Fair" : "Good";

        updatedItem = {
          ...item,
          ...updates,
          condition: cond,
          conditionLabel,
          price: updates.price !== undefined ? Number(updates.price) : item.price,
          mrp: updates.mrp !== undefined ? Number(updates.mrp) : item.mrp,
        };
        if (updates.cover) {
          updatedItem.cover = updates.cover;
          updatedItem.image = updates.cover;
          if (!updatedItem.photos || updatedItem.photos.length === 0) {
            updatedItem.photos = [updates.cover];
          }
        }
        return updatedItem;
      }
      return item;
    });
    saveAndNotify(updated);
    return updatedItem;
  },

  updateStatus(id, newStatus) {
    const listings = getStoredListings();
    const updated = listings.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    saveAndNotify(updated);
  },

  deleteListing(id) {
    const listings = getStoredListings();
    const updated = listings.filter((item) => item.id !== id);
    saveAndNotify(updated);
  },

  getStats() {
    const listings = getStoredListings();
    const sold = listings.filter((l) => l.status === "Sold");
    const active = listings.filter((l) => l.status === "Active");
    const totalEarned = sold.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    return {
      totalListings: listings.length,
      activeCount: active.length,
      soldCount: sold.length,
      totalEarned
    };
  }
};
