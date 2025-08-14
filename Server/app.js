import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import otherRoutes from "./routes/other.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";

// Load environment variables from .env file
config();

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Enable CORS for frontend origin with credentials
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Logger middleware for request details in development mode
app.use(morgan("dev"));

// Rate limiting middleware (optional, can be added for security)
app.use("/api/v1", apiLimiter);

// User-related routes
app.use("/api/v1/user", userRoutes);

// Course-related routes
app.use("/api/v1/courses", courseRoutes);

//Payments-related routes
app.use("/api/v1/payments", paymentRoutes);

// Progress-related routes
app.use("/api/v1/progress", progressRoutes);

//Other routes
app.use("/api/v1/other", otherRoutes);

// Base route for application status check
// app.use("/", (req, res) => {
//   res.send("Learning Management System");
// });

// Handle undefined routes with a 404 message
app.all("*", (req, res) => {
  res.status(404).send("OOPS! 404 page not found");
});

// Global error handling middleware
app.use(errorMiddleware);

export default app;
