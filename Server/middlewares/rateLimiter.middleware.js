// middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

// General API limiter (all routes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // send RateLimit-* headers
  legacyHeaders: false, // disable X-RateLimit-* headers
  message: {
    status: 429,
    error: "Too many requests. Please try again later.",
  },
});

// Stricter limiter for sensitive routes like login
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 login attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many login attempts. Try again later.",
  },
});
