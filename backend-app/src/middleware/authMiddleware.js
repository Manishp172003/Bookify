import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { isTokenRevoked } from "../utils/tokenBlacklist.js";

/**
 * protect — verifies JWT and attaches req.user.
 * Ensures req.user.role is always set (falls back from isAdmin for
 * documents that existed before the role field was added).
 */
export const protect = async (req, res, next) => {
  let token;

  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
        data: null,
      });
    }

    if (isTokenRevoked(token)) {
      return res.status(401).json({
        success: false,
        message: "Session expired or token revoked. Please log in again.",
        data: null,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Backward-compatibility: if role is missing but isAdmin is true, synthesize it
    if (!user.role) {
      user.role = user.isAdmin ? "admin" : "student";
    }

    if ((user.status === "Banned" || user.isBanned) && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Your account has been restricted by administration. Please contact support.",
        data: null,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
      data: null,
    });
  }
};

/**
 * authorize — role-based access control guard.
 * Usage: authorize("admin") or authorize("author", "admin")
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
        data: null,
      });
    }

    const isAuthorAllowed =
      roles.includes("author") &&
      (req.user.role === "author" ||
        req.user.isAuthor === true ||
        Boolean(req.user.penName || req.user.authorBio || req.user.authorVerificationStatus === "verified"));

    if (!roles.includes(req.user.role) && !isAuthorAllowed) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires role '${roles.join("' or '")}'`,
        data: null,
      });
    }

    next();
  };
};

// Alias for backward compatibility
export const verifyToken = protect;