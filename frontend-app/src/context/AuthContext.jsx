import { createContext, useContext, useState } from "react";

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
        authorAvatar: userData.authorAvatar || null,
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
    setUser((prev) => {
      const updated = {
        ...(prev || {}),
        ...updates,
        avatar: updates.authorAvatar !== undefined ? (updates.authorAvatar || (updates.avatar !== undefined ? updates.avatar : null)) : (updates.avatar !== undefined ? updates.avatar : prev?.avatar),
      };
      localStorage.setItem("bookify_user", JSON.stringify(updated));
      return updated;
    });
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
