/**
 * Lightweight in-memory sliding-window rate limiter
 * Protects sensitive endpoints (Login, Register, OTP verification) against brute force attacks.
 */
export const rateLimit = ({
  windowMs = 60 * 1000, // 1 minute window
  max = 30, // 30 requests per minute
  message = "Too many attempts from this IP address. Please try again in 1 minute.",
} = {}) => {
  const ipRequests = new Map();

  // Periodically purge stale IP entries every 5 minutes to avoid memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of ipRequests.entries()) {
      const valid = timestamps.filter((t) => now - t < windowMs);
      if (valid.length === 0) {
        ipRequests.delete(ip);
      } else {
        ipRequests.set(ip, valid);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown_ip";
    const now = Date.now();

    let timestamps = ipRequests.get(ip) || [];
    timestamps = timestamps.filter((t) => now - t < windowMs);

    if (timestamps.length >= max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: Math.ceil((timestamps[0] + windowMs - now) / 1000),
      });
    }

    timestamps.push(now);
    ipRequests.set(ip, timestamps);
    next();
  };
};

export default rateLimit;
