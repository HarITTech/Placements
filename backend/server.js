import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan"; // For logging HTTP requests

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import collegeRoutes from "./routes/college.routes.js";
import jobRoutes from "./routes/job.routes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://tnpportal.harittech.in'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable credentials
}));

// Middleware
app.use(cookieParser());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(morgan("dev")); // Log HTTP requests for better debugging

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/college", collegeRoutes);
app.use("/api/jobs", jobRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the College Placement Backend!");
});

// Handle non-existing routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store"); // Prevent caching
  next();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
