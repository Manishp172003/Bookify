import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("bookify_auth") === "true";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("bookify_user");
    return savedUser ? JSON.parse(savedUser) : null;
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
        avatar: userData.avatar || "/images/profile-avatar.png",
      };
    } else {
      userObj = {
        id: `usr_${Date.now()}`,
        fullName: typeof userData === "string" && userData.includes("@") ? userData.split("@")[0] : "Student User",
        email: userData || "student@bookify.com",
        avatar: "/images/profile-avatar.png",
      };
    }
    localStorage.setItem("bookify_user", JSON.stringify(userObj));
    setIsAuthenticated(true);
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("bookify_auth");
    localStorage.removeItem("bookify_user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
