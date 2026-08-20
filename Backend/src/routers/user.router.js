import express from "express";
import {
  register,
  login,
  logout,
  genrateRefreshToken,
  verifyEmail,
  verifyOTP,
  forgetPassword,
  changePassword,
  updatePassword,
  getMe,
  updateProfile,
} from "../controllers/user.controller.js";
import authUser from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/rotate-token", genrateRefreshToken);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/verify-otp", verifyOTP);
router.post("/forget-password", forgetPassword);
router.post("/change-password", changePassword);
router.post("/update-password", authUser, updatePassword);
router.put("/update-profile", authUser, updateProfile);
router.get("/getMe", authUser, getMe);

export default router;
