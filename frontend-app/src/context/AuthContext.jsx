import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("bookify_auth") === "true";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("bookify_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.avatar === "/images/profile-avatar.png") {
          parsed.avatar = null;
        }
        return parsed;
      } catch {}
    }
    return null;
  });

  // Re-sync with backend database to keep profile photo and data up-to-date across sessions
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("bookify_admin_token");
    if (!token || !isAuthenticated) return;

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    fetch(`${apiBase}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user || data?.profile) {
          const freshUser = data.user || data.profile;
          setUser((prev) => {
            const updated = {
              ...(prev || {}),
              ...freshUser,
              avatar: freshUser.avatar || freshUser.authorAvatar || prev?.avatar || null,
              coverImage: freshUser.coverImage || prev?.coverImage || null,
            };
            localStorage.setItem("bookify_user", JSON.stringify(updated));
            return updated;
          });
        }
      })
      .catch((err) => console.warn("Failed to fetch fresh user profile:", err));
  }, [isAuthenticated]);

  const login = (userData) => {
    localStorage.setItem("bookify_auth", "true");
    const prevUserRaw = localStorage.getItem("bookify_user");
    let prevUser = null;
    try { prevUser = prevUserRaw ? JSON.parse(prevUserRaw) : null; } catch {}

    let userObj;
    if (typeof userData === "object" && userData !== null) {
      userObj = {
        id: userData.id || userData._id || `usr_${Date.now()}`,
        fullName: userData.fullName || "Student User",
        email: userData.email || "student@bookify.com",
        phone: userData.phone || "",
        avatar: userData.avatar && userData.avatar !== "/images/profile-avatar.png" ? userData.avatar : (userData.authorAvatar || null),
        authorAvatar: userData.authorAvatar || userData.avatar || null,
        coverImage: userData.coverImage || null,
        role: userData.role || "student",
        isAdmin: Boolean(userData.isAdmin),
        isAuthor: Boolean(userData.isAuthor || userData.role === "author"),
        penName: userData.penName || "",
        authorBio: userData.authorBio || "",
        authorVerificationStatus: userData.authorVerificationStatus || "unverified",
        ...userData,
      };
    } else {
      userObj = {
        id: `usr_${Date.now()}`,
        fullName: typeof userData === "string" && userData.includes("@") ? userData.split("@")[0] : "Student User",
        email: userData || "student@bookify.com",
        avatar: null,
        authorAvatar: null,
        coverImage: null,
        role: "student",
        isAuthor: false,
      };
    }

    // If new user session or switching user, clear stale cache
    if (!prevUser || prevUser.id !== userObj.id || prevUser.email !== userObj.email) {
      localStorage.removeItem("bookify_orders");
      localStorage.removeItem("bookify_conversations");
      localStorage.removeItem("bookify_user_listings_v1");
      localStorage.removeItem("bookify_user_payment");
      localStorage.removeItem("bookify_wishlist");
      localStorage.removeItem("bookify_want_board_v1");
    }

    localStorage.setItem("bookify_user", JSON.stringify(userObj));
    setIsAuthenticated(true);
    setUser(userObj);
  };

  const updateUser = (updates) => {
    let nextUser;
    setUser((prev) => {
      const updated = {
        ...(prev || {}),
        ...updates,
        avatar: updates.authorAvatar !== undefined ? (updates.authorAvatar || (updates.avatar !== undefined ? updates.avatar : null)) : (updates.avatar !== undefined ? updates.avatar : prev?.avatar),
        coverImage: updates.coverImage !== undefined ? updates.coverImage : prev?.coverImage,
      };
      localStorage.setItem("bookify_user", JSON.stringify(updated));
      nextUser = updated;
      return updated;
    });

    // Persist changes to MongoDB backend if authenticated
    const token = localStorage.getItem("token") || localStorage.getItem("bookify_admin_token");
    if (token) {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      fetch(`${apiBase}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })
        .then(async (res) => {
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              setUser((curr) => {
                const synced = { ...curr, ...data.user };
                localStorage.setItem("bookify_user", JSON.stringify(synced));
                return synced;
              });
            }
          }
        })
        .catch((err) => {
          console.warn("Profile sync error:", err);
        });
    }

    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem("bookify_auth");
    localStorage.removeItem("bookify_user");
    localStorage.removeItem("token");
    localStorage.removeItem("bookify_orders");
    localStorage.removeItem("bookify_conversations");
    localStorage.removeItem("bookify_user_listings_v1");
    localStorage.removeItem("bookify_user_payment");
    localStorage.removeItem("bookify_wishlist");
    localStorage.removeItem("bookify_want_board_v1");
    setIsAuthenticated(false);
    setUser(null);
  };

  const isDemoUser = Boolean(
    user?.email && (
      user.email.toLowerCase() === "author@bookify.com" ||
      user.email.toLowerCase() === "demo@bookify.com" ||
      user.id === "demo_author"
    )
  );

  // Active Author Profile check:
  const hasAuthorProfile = Boolean(
    isDemoUser ||
    user?.hasAuthorProfile === true ||
    user?.isAuthor === true ||
    user?.role === "author" ||
    Boolean(user?.penName) ||
    user?.authorVerificationStatus === "verified" ||
    user?.authorVerificationStatus === "pending"
  );

  // Active Student Profile check:
  const hasStudentProfile = user?.hasStudentProfile !== false && user?.role !== "author_only";

  // Dual Role check:
  const isDualRole = Boolean(hasAuthorProfile && hasStudentProfile);

  const activateAuthorProfile = (authorData = {}) => {
    return updateUser({
      hasAuthorProfile: true,
      isAuthor: true,
      hasStudentProfile: true,
      penName: authorData.penName || user?.fullName || "Author",
      authorBio: authorData.authorBio || "Passionate creator on Bookify.",
      ...authorData,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        hasAuthorProfile,
        hasStudentProfile,
        isDualRole,
        activateAuthorProfile,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
