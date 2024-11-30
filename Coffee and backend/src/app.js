import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

// Initialize express app
const app = express();

// Load environment variables from .env file
config({
  path: "./.env", // Ensure this is the correct path to your .env file
});

// Log CORS_ORIGIN to ensure it's being loaded from the environment variables
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

// Middleware configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // This should be set in the .env file (e.g., http://localhost:3000)
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use(express.json({ limit: "16kb" })); // Limit the request body size to 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Enable parsing of URL-encoded data
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(cookieParser()); // Enable cookie parsing

// Import routes
import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// Declare routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Example route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Export the app to be used in other files (e.g., for server initialization)
export { app };
