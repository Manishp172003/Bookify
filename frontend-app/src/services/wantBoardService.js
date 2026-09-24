import { api } from "./apiClient";

// Want Board Service with localStorage persistence and reactive sync with backend

const STORAGE_KEY = "bookify_want_board_v1";

const INITIAL_REQUESTS = [
  {
    id: "REQ-9012",
    title: "Operating System Concepts, 10th Edition",
    author: "Abraham Silberschatz, Peter B. Galvin",
    department: "Computer Science",
    courseCode: "CS301",
    urgency: "High Urgency",
    urgencyLevel: "High",
    budget: 450,
    expectedPrice: "₹400 - ₹500",
    requestedBy: "Rohan Sharma",
    isMyRequest: false,
    campus: "IIT Bombay (Powai)",
    date: "1 hour ago",
    status: "Open",
    notes: "Need for Mid-term preparation next week. Any condition is fine as long as chapters 1-8 are legible."
  },
  {
    id: "REQ-8412",
    title: "Engineering Mechanics: Statics & Dynamics",
    author: "R.C. Hibbeler",
    department: "Mechanical Engineering",
    courseCode: "ME101",
    urgency: "Medium Urgency",
    urgencyLevel: "Medium",
    budget: 350,
    expectedPrice: "₹300 - ₹400",
    requestedBy: "Ananya Patel",
    isMyRequest: false,
    campus: "BITS Pilani",
    date: "5 hours ago",
    status: "Open",
    notes: "Looking for 14th or 15th edition with problem sets."
  },
  {
    id: "REQ-7290",
    title: "Microeconomic Theory: Basic Principles & Extensions",
    author: "Walter Nicholson, Christopher Snyder",
    department: "Economics & Commerce",
    courseCode: "ECO204",
    urgency: "High Urgency",
    urgencyLevel: "High",
    budget: 500,
    expectedPrice: "₹500",
    requestedBy: "Kabir Mehta",
    isMyRequest: false,
    campus: "Delhi University (North Campus)",
    date: "1 day ago",
    status: "Open",
    notes: "Willing to buy outright or rent for the remaining semester."
  },
  {
    id: "REQ-6184",
    title: "Organic Chemistry, 2nd Edition",
    author: "Jonathan Clayden, Nick Greeves",
    department: "Pre-Med / NEET",
    courseCode: "CHM210",
    urgency: "Medium Urgency",
    urgencyLevel: "Medium",
    budget: 650,
    expectedPrice: "₹600 - ₹700",
    requestedBy: "Priya Nair",
    isMyRequest: false,
    campus: "IISc Bangalore",
    date: "3 days ago",
    status: "Fulfilled",
    notes: "Found through Bookify campus meetup."
  }
];

export const wantBoardService = {
  getAllRequests: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
        return INITIAL_REQUESTS;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Clean out legacy fake request REQ-001
        const cleaned = parsed.filter(r => r.id !== "REQ-001");
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      }
      return INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  },

  syncWithBackend: async () => {
    try {
      const res = await api.get("/want-board");
      if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        let user = null;
        try { user = JSON.parse(localStorage.getItem("bookify_user")); } catch {}
        const currentUserId = user?.id || user?._id;

        const backendItems = res.data.data.map((item) => {
          const isMine = Boolean(
            currentUserId &&
            (item.userId?._id === currentUserId ||
              item.userId === currentUserId ||
              item.userName === user?.fullName)
          );
          return {
            id: item._id || item.id,
            title: item.bookTitle,
            author: item.author || "Unknown Author",
            department: item.category || "General",
            courseCode: "GEN101",
            urgency: `${item.urgency || "Medium"} Urgency`,
            urgencyLevel: item.urgency || "Medium",
            budget: item.budget || 0,
            expectedPrice: `₹${item.budget || 0}`,
            requestedBy: isMine ? (user?.fullName || "Me") : (item.userName || item.userId?.fullName || "Campus Student"),
            isMyRequest: isMine,
            campus: "Campus Community",
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent",
            status: item.status || "Open",
            notes: item.notes || "Looking for campus copy."
          };
        });

        // Merge with local requests
        localStorage.setItem(STORAGE_KEY, JSON.stringify(backendItems));
        window.dispatchEvent(new Event("bookify_want_board_updated"));
        return backendItems;
      }
    } catch {
      // Offline fallback
    }
    return wantBoardService.getAllRequests();
  },

  getMyRequests: () => {
    const all = wantBoardService.getAllRequests();
    let user = null;
    try { user = JSON.parse(localStorage.getItem("bookify_user")); } catch {}
    const myName = user?.fullName;

    return all.filter((r) => r.isMyRequest || r.requestedBy === "Me" || (myName && r.requestedBy === myName));
  },

  getBrowseRequests: () => {
    const all = wantBoardService.getAllRequests();
    let user = null;
    try { user = JSON.parse(localStorage.getItem("bookify_user")); } catch {}
    const myName = user?.fullName;

    return all.filter((r) => !r.isMyRequest && r.requestedBy !== "Me" && (!myName || r.requestedBy !== myName));
  },

  createRequest: async (data) => {
    const all = wantBoardService.getAllRequests();
    let user = null;
    try { user = JSON.parse(localStorage.getItem("bookify_user")); } catch {}
    const myName = user?.fullName || "Me";

    const newReq = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title,
      author: data.author || "Unknown Author",
      department: data.department || "Computer Science",
      courseCode: data.courseCode || "GEN101",
      urgency: data.urgency ? (data.urgency.includes("Urgency") ? data.urgency : `${data.urgency} Urgency`) : "Medium Urgency",
      urgencyLevel: data.urgencyLevel || (data.urgency?.includes("High") ? "High" : data.urgency?.includes("Low") ? "Low" : "Medium"),
      budget: Number(data.budget) || (data.expectedPrice ? parseInt(data.expectedPrice.replace(/[^0-9]/g, "")) || 400 : 400),
      expectedPrice: data.expectedPrice || (data.budget ? `₹${data.budget}` : "₹300 - ₹500"),
      requestedBy: myName,
      isMyRequest: true,
      campus: data.campus || user?.campus || "Main Campus Library",
      date: "Just now",
      status: "Open",
      notes: data.notes || data.details || "Looking for urgent semester copy."
    };

    const updated = [newReq, ...all];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("bookify_want_board_updated"));
    } catch (e) {
      console.error("Failed to save want board request", e);
    }

    // Sync to backend if authenticated
    try {
      const backendRes = await api.post("/want-board", {
        bookTitle: newReq.title,
        author: newReq.author,
        category: newReq.department,
        budget: newReq.budget,
        urgency: newReq.urgencyLevel,
        notes: newReq.notes,
      });
      if (backendRes?.data?.data?._id) {
        newReq.id = backendRes.data.data._id;
      }
    } catch (err) {
      console.warn("Backend sync failed for want board post:", err);
    }

    return newReq;
  },

  deleteRequest: async (id) => {
    const all = wantBoardService.getAllRequests();
    const updated = all.filter(r => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("bookify_want_board_updated"));
    } catch (e) {
      console.error("Failed to delete request", e);
    }

    // Sync deletion with backend if MongoDB id
    try {
      if (id && !id.startsWith("REQ-")) {
        await api.delete(`/want-board/${id}`);
      }
    } catch (err) {
      console.warn("Backend delete sync failed:", err);
    }

    return updated;
  },

  markFulfilled: (id) => {
    const all = wantBoardService.getAllRequests();
    const updated = all.map(r => r.id === id ? { ...r, status: "Fulfilled" } : r);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("bookify_want_board_updated"));
    } catch (e) {
      console.error("Failed to update request", e);
    }
    return updated;
  }
};
