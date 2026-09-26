/**
 * Bookify In-Memory Token Revocation Store
 * Used to immediately invalidate JWT tokens when a user logs out.
 */
const revokedTokens = new Set();

export const revokeToken = (token) => {
  if (!token) return;
  // Clean 'Bearer ' prefix if present
  const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
  revokedTokens.add(cleanToken);
};

export const isTokenRevoked = (token) => {
  if (!token) return false;
  const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
  return revokedTokens.has(cleanToken);
};

export default { revokeToken, isTokenRevoked };
