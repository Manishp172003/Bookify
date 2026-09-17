/**
 * Check if the avatar is an actual user-uploaded image rather than a stock/dummy URL
 */
export const isRealUserAvatar = (avatar) => {
  if (!avatar || typeof avatar !== "string") return false;
  const lower = avatar.toLowerCase();
  if (
    lower.includes("unsplash.com") ||
    lower.includes("pravatar.cc") ||
    lower.includes("randomuser.me") ||
    lower.includes("profile-avatar.png") ||
    lower.includes("placeholder")
  ) {
    return false;
  }
  return true;
};

/**
 * Get 1 or 2 letter uppercase initials from full name
 */
export const getInitials = (name, fallback = "SP") => {
  if (!name || typeof name !== "string") return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return parts[0] ? parts[0][0].toUpperCase() : fallback;
};
