import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.warn("⚠️ Warning: MONGO_URI is not defined in environment variables.");
}

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ Warning: JWT_SECRET is not defined in environment variables.");
}

if (!process.env.USER || !process.env.PASS) {
  console.warn("⚠️ Warning: Email service credentials (USER, PASS) are not fully configured.");
}

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("⚠️ Warning: Cloudinary credentials are not fully configured.");
}

const config = {
  PORT: port,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/CampusCart",
  JWT_SECRET: process.env.JWT_SECRET || "default_campuscart_jwt_secret_key_change_in_production",
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || "7d",
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE || "15m",
  USER: process.env.USER || "",
  PASS: process.env.PASS || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  CLIENT_URL: process.env.CLIENT_URL || "",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "",
};

export default config;