// Unified listing management service for student user listings and seller flow
// Broadcasts 'bookify_user_listings_updated' on changes

const LISTINGS_STORAGE_KEY = "bookify_user_listings_v1";

const INITIAL_USER_LISTINGS = [
  {
    id: "BKFY-518290",
    title: "Introduction to Algorithms, 3rd Edition",
    author: "Thomas H. Cormen, Charles E. Leiserson",
    price: 650,
    mrp: 1200,
    condition: "very-good",
    conditionLabel: "Very Good",
    status: "Active",
    mode: "sell",
    views: 42,
    wishlists: 12,
    photos: ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60"],
    coverClass: "from-[#111827] to-[#374151]",
    date: "2026-08-25"
  },
  {
    id: "BKFY-982741",
    title: "Cracking the Coding Interview",
    author: "Gayle Laakmann McDowell",
    price: 450,
    mrp: 850,
    condition: "good",
    conditionLabel: "Good",
    status: "Active",
    mode: "sell",
    views: 29,
    wishlists: 5,
    photos: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60"],
    coverClass: "from-[#6C4BF4] to-[#8B3FD9]",
    date: "2026-08-22"
  },
  {
    id: "BKFY-304910",
    title: "Organic Chemistry, 8th Edition",
    author: "L. G. Wade Jr.",
    price: 800,
    mrp: 1400,
    condition: "like-new",
    conditionLabel: "Like New",
    status: "Sold",
    mode: "sell",
    views: 95,
    wishlists: 18,
    photos: ["https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=500&auto=format&fit=crop&q=60"],
    coverClass: "from-[#059669] to-[#10B981]",
    date: "2026-08-15"
  },
  {
    id: "BKFY-298301",
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    price: 950,
    mrp: 1600,
    condition: "fair",
    conditionLabel: "Fair",
    status: "Inactive",
    mode: "sell",
    views: 14,
    wishlists: 2,
    photos: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60"],
    coverClass: "from-[#E11D48] to-[#F43F5E]",
    date: "2026-08-10"
  }
];

function getStoredListings() {
  try {
    const raw = localStorage.getItem(LISTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(INITIAL_USER_LISTINGS));
      return INITIAL_USER_LISTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USER_LISTINGS;
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
      photos: listingData.photos && listingData.photos.length > 0 
        ? listingData.photos 
        : [listingData.cover || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60"],
      coverClass: "from-[#6C4BF4] to-[#8B3FD9]",
      date: new Date().toISOString().split("T")[0]
    };

    const updated = [newListing, ...listings];
    saveAndNotify(updated);
    return newListing;
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
