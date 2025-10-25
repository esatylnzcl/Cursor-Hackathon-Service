// app.ts - Main application entry point
import "reflect-metadata";
import express from "express";
import { config } from "./config";
import { connectDB } from "./src/database/connection";
import { corsConfig } from "./src/api/middlewares/cors";
import { createSession } from "./src/api/middlewares/session";
import { ErrHandler } from "./src/api/middlewares/ErrorHandler";

const app = express();
const port = config.PORT;

// Database connection
connectDB();

// Middlewares
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true })); // URL encoded parser

// CORS Configuration
app.use(corsConfig);

// Session Management
createSession(app);

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: true,
    message: "API is running!",
    environment: config.ENV,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
import { addRoutes } from "./src/api/routes";
addRoutes(app);

// Global Error Handler (must be last)
app.use(ErrHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📍 Environment: ${config.ENV}`);
});
