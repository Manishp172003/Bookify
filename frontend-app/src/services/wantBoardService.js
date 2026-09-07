// Want Board Service with localStorage persistence and reactive sync

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
    campus: "Delhi University (North Campus)",
    date: "1 day ago",
    status: "Open",
    notes: "Willing to buy outright or rent for the remaining semester."
  },
  {
    id: "REQ-001",
    title: "Introduction to Algorithms, 3rd Edition",
    author: "Thomas H. Cormen",
    department: "Computer Science",
    courseCode: "CS201",
    urgency: "Low Urgency",
    urgencyLevel: "Low",
    budget: 550,
    expectedPrice: "₹500 - ₹600",
    requestedBy: "Me",
    isMyRequest: true,
    campus: "Main Campus Library",
    date: "2 days ago",
    status: "Open",
    notes: "Urgent need for algorithmic assignment and semester core reference."
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
      return JSON.parse(stored);
    } catch {
      return INITIAL_REQUESTS;
    }
  },

  getMyRequests: () => {
    const all = wantBoardService.getAllRequests();
    return all.filter(r => r.isMyRequest || r.requestedBy === "Me");
  },

  getBrowseRequests: () => {
    const all = wantBoardService.getAllRequests();
    return all.filter(r => !r.isMyRequest && r.requestedBy !== "Me");
  },

  createRequest: (data) => {
    const all = wantBoardService.getAllRequests();
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
      requestedBy: "Me",
      isMyRequest: true,
      campus: data.campus || "Main Campus Library",
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
    return newReq;
  },

  deleteRequest: (id) => {
    const all = wantBoardService.getAllRequests();
    const updated = all.filter(r => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("bookify_want_board_updated"));
    } catch (e) {
      console.error("Failed to delete request", e);
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
