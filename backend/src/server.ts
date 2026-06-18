import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables before routing or controllers
dotenv.config();

import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import aiRoutes from "./routes/ai.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (or you can limit to frontend localhost:5173/production domains)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Centralized error handler (must be last middleware)
app.use(errorMiddleware as any);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
