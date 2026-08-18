import express from "express";
import userRouter from "./routers/user.router.js";
import productRoute from "./routers/product.routes.js";
import cartRouter from "./routers/cart.routes.js";
import wishlistRouter from "./routers/wishlist.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import config from "./config/config.js";

const app = express();

// Trust proxy for secure cookies on cloud hosts (Render, Heroku, Vercel, etc.)
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Dynamic CORS configuration
const allowedOriginsList = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:5000",
];

if (config.CLIENT_URL) {
  allowedOriginsList.push(config.CLIENT_URL.trim().replace(/\/$/, ""));
}

if (config.ALLOWED_ORIGINS) {
  const origins = config.ALLOWED_ORIGINS.split(",").map((o) => o.trim().replace(/\/$/, ""));
  allowedOriginsList.push(...origins);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      
      // If specific allowed origins are set, check match
      if (allowedOriginsList.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      
      // Fallback: reflect requesting origin if CORS check passes
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Health Check Endpoints
app.get(["/", "/health", "/api/health"], (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "CampusCart API operational",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", userRouter);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);

// Static file serving for single-server deployment (Frontend/dist)
const frontendDistPath = path.resolve(process.cwd(), "Frontend", "dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(frontendDistPath, "index.html"));
    }
    next();
  });
}

export default app;
