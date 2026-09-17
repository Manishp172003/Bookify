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
    let userObj;
    if (typeof userData === "object" && userData !== null) {
      userObj = {
        id: userData.id || userData._id || `usr_${Date.now()}`,
        fullName: userData.fullName || "Student User",
        email: userData.email || "student@bookify.com",
        phone: userData.phone || "",
        avatar: userData.avatar && userData.avatar !== "/images/profile-avatar.png" ? userData.avatar : null,
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
        role: "student",
        isAuthor: false,
      };
    }
    localStorage.setItem("bookify_user", JSON.stringify(userObj));
    setIsAuthenticated(true);
    setUser(userObj);
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...updates };
      localStorage.setItem("bookify_user", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem("bookify_auth");
    localStorage.removeItem("bookify_user");
    localStorage.removeItem("token");
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
