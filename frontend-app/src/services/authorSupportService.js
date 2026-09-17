// Author Support Desk Service
// Manages shared support conversations between Authors and Platform Administrators/Editorial Staff

const STORAGE_KEY = "bookify_author_support_threads";

export const INQUIRY_TOPICS = [
  {
    id: "royalty",
    title: "Royalty & Payout Inquiry",
    badge: "Finance",
    prompt: "Hi Editorial Team, I would like to inquire about my latest royalty calculation and disbursement schedule."
  },
  {
    id: "isbn",
    title: "Verification & ISBN Assistance",
    badge: "Editorial",
    prompt: "Hello Bookify Desk, I need help verifying my official author credentials and mapping my ISBN catalog."
  },
  {
    id: "campaign",
    title: "Campaign & Promotion Advice",
    badge: "Marketing",
    prompt: "Hi Marketing Desk, I am preparing a special campaign discount and would like advice on banner placement and spotlight features."
  },
  {
    id: "listing",
    title: "Book Listing & Cover Update",
    badge: "Catalog",
    prompt: "Hello Editorial, I'd like to update the manuscript preview sample and cover art for my active book."
  }
];

const INITIAL_SEEDED_THREADS = [
  {
    id: "support_author_rahul",
    authorId: "author_rahul",
    name: "Rahul Verma",
    email: "rahul@bookify.com",
    role: "Author",
    avatar: "RV",
    unreadCount: 1,
    adminUnread: 1,
    authorUnread: 0,
    lastMessage: "Could you please check my pending book submission status?",
    time: "10:30 AM",
    status: "Active",
    messages: [
      {
        id: "msg_r1",
        sender: "author",
        senderName: "Rahul Verma",
        text: "Hello Admin, I submitted a new book 'Clean Code' yesterday.",
        time: "10:28 AM",
        timestamp: Date.now() - 3600000
      },
      {
        id: "msg_r2",
        sender: "author",
        senderName: "Rahul Verma",
        text: "Could you please check my pending book submission status?",
        time: "10:30 AM",
        timestamp: Date.now() - 3500000
      }
    ]
  },
  {
    id: "support_author_vikram",
    authorId: "author_vikram",
    name: "Dr. Vikram Das",
    email: "vikram@bookify.com",
    role: "Author",
    avatar: "VD",
    unreadCount: 0,
    adminUnread: 0,
    authorUnread: 0,
    lastMessage: "I will update the cover image and re-submit.",
    time: "11:05 AM",
    status: "Active",
    messages: [
      {
        id: "msg_v1",
        sender: "admin",
        senderName: "Bookify Editorial Staff",
        text: "Hello Vikram, your listing was rejected due to blurry cover page illustration. Please re-upload at 300 DPI.",
        time: "11:00 AM",
        timestamp: Date.now() - 7200000
      },
      {
        id: "msg_v2",
        sender: "author",
        senderName: "Dr. Vikram Das",
        text: "I will update the cover image and re-submit.",
        time: "11:05 AM",
        timestamp: Date.now() - 6900000
      }
    ]
  }
];

export const authorSupportService = {
  getThreads() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("[AuthorSupportService] Error reading threads:", e);
    }
    this.saveThreads(INITIAL_SEEDED_THREADS);
    return INITIAL_SEEDED_THREADS;
  },

  saveThreads(threads) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
      window.dispatchEvent(
        new CustomEvent("bookify_author_support_changed", { detail: threads })
      );
    } catch (e) {
      console.error("[AuthorSupportService] Error saving threads:", e);
    }
  },

  getThreadForAuthor(authorId, authorInfo = {}) {
    const threads = this.getThreads();
    const safeAuthorId = authorId ? String(authorId) : "current_author";
    const existingIndex = threads.findIndex(
      (t) => String(t.authorId) === safeAuthorId || t.id === `support_author_${safeAuthorId}`
    );

    if (existingIndex >= 0) {
      return threads[existingIndex];
    }

    const authorName =
      authorInfo.penName ||
      authorInfo.fullName ||
      authorInfo.name ||
      "Publishing Author";

    const initials = authorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AU";

    const welcomeTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    const newThread = {
      id: `support_author_${safeAuthorId}`,
      authorId: safeAuthorId,
      name: authorName,
      email: authorInfo.email || "",
      avatar: initials,
      photoUrl: authorInfo.authorAvatar || authorInfo.avatar || null,
      role: "Author",
      unreadCount: 0,
      adminUnread: 0,
      authorUnread: 0,
      status: "Active",
      time: welcomeTime,
      lastMessage:
        "Welcome to the Bookify Author & Editorial Desk! How can we assist with your publishing, royalties, or campaigns today?",
      messages: [
        {
          id: `welcome_${Date.now()}`,
          sender: "admin",
          senderName: "Bookify Editorial Staff",
          text: `Welcome ${authorName} to the Bookify Author & Editorial Desk!\n\nOur team is here to assist you with:\n• Book reviews, ISBN linking & verification\n• Royalty calculation and disbursement schedules\n• Promotional campaigns and spotlight placement\n• Manuscript updates and catalog guidelines\n\nHow may we help you today?`,
          time: welcomeTime,
          timestamp: Date.now()
        }
      ]
    };

    threads.unshift(newThread);
    this.saveThreads(threads);
    return newThread;
  },

  sendAuthorMessage(authorId, authorInfo, text) {
    if (!text || !text.trim()) return null;
    const threads = this.getThreads();
    const safeAuthorId = authorId ? String(authorId) : "current_author";
    let thread = threads.find(
      (t) => String(t.authorId) === safeAuthorId || t.id === `support_author_${safeAuthorId}`
    );

    const nowTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    if (!thread) {
      thread = this.getThreadForAuthor(authorId, authorInfo);
    }

    const newMsg = {
      id: `msg_auth_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      sender: "author",
      senderName: authorInfo?.penName || authorInfo?.fullName || thread.name || "Author",
      text: text.trim(),
      time: nowTime,
      timestamp: Date.now()
    };

    thread.messages.push(newMsg);
    thread.lastMessage = text.trim();
    thread.time = nowTime;
    thread.adminUnread = (thread.adminUnread || 0) + 1;
    thread.unreadCount = thread.adminUnread;
    thread.authorUnread = 0;

    const updatedThreads = threads.map((t) => (t.id === thread.id ? thread : t));
    this.saveThreads(updatedThreads);
    return { thread, newMsg };
  },

  sendAdminReply(authorId, text, adminName = "Bookify Editorial Staff") {
    if (!text || !text.trim()) return null;
    const threads = this.getThreads();
    const safeAuthorId = authorId ? String(authorId) : "current_author";
    const thread = threads.find(
      (t) => String(t.authorId) === safeAuthorId || t.id === `support_author_${safeAuthorId}`
    );

    if (!thread) return null;

    const nowTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    const newMsg = {
      id: `msg_admin_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      sender: "admin",
      senderName: adminName,
      text: text.trim(),
      time: nowTime,
      timestamp: Date.now()
    };

    thread.messages.push(newMsg);
    thread.lastMessage = text.trim();
    thread.time = nowTime;
    thread.authorUnread = (thread.authorUnread || 0) + 1;
    thread.adminUnread = 0;
    thread.unreadCount = 0;

    const updatedThreads = threads.map((t) => (t.id === thread.id ? thread : t));
    this.saveThreads(updatedThreads);
    return { thread, newMsg };
  },

  markAsReadByAuthor(authorId) {
    const threads = this.getThreads();
    const safeAuthorId = authorId ? String(authorId) : "current_author";
    let changed = false;

    const updatedThreads = threads.map((t) => {
      if (String(t.authorId) === safeAuthorId || t.id === `support_author_${safeAuthorId}`) {
        if (t.authorUnread > 0) {
          changed = true;
          return { ...t, authorUnread: 0 };
        }
      }
      return t;
    });

    if (changed) {
      this.saveThreads(updatedThreads);
    }
  },

  markAsReadByAdmin(authorId) {
    const threads = this.getThreads();
    const safeAuthorId = authorId ? String(authorId) : "current_author";
    let changed = false;

    const updatedThreads = threads.map((t) => {
      if (String(t.authorId) === safeAuthorId || t.id === `support_author_${safeAuthorId}`) {
        if (t.adminUnread > 0 || t.unreadCount > 0) {
          changed = true;
          return { ...t, adminUnread: 0, unreadCount: 0 };
        }
      }
      return t;
    });

    if (changed) {
      this.saveThreads(updatedThreads);
    }
  }
};