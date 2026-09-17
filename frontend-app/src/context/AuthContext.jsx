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

  const isAuthor = Boolean(user?.isAuthor || user?.role === "author" || (user?.email && user.email.toLowerCase().includes("author")));

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAuthor, login, updateUser, logout }}>
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
