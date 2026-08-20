import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import blackListModel from "../models/blackList.model.js";
import crypto from "crypto";
import sessionModel from "../models/session.model.js";
import { generateOTP, otpHTML } from "../utils/otp.utils.js";
import otpModel from "../models/otp.model.js";
import { sendMail } from "../utils/sendMail.utils.js";
import { sendOTP } from "../services/otp.service.js";

export async function register(req, res) {
  try {
    const {
      userName,
      email,
      password,
      collageName,
      department,
      semester,
      phone,
      avatar,
      role,
    } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const cleanedEmail = email.toLowerCase().trim();
    const cleanedUserName = userName.trim();

    const isUserAlreadyExist = await userModel.findOne({
      $or: [{ email: cleanedEmail }, { userName: cleanedUserName }],
    });

    if (isUserAlreadyExist) {
      const isEmailMatch = isUserAlreadyExist.email === cleanedEmail;
      return res.status(400).json({
        message: isEmailMatch
          ? "User with this email already exists. Please log in to continue."
          : "Username is already taken. Please choose another username.",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      userName: cleanedUserName,
      email: cleanedEmail,
      password: hash,
      collageName: collageName ? collageName.trim() : "",
      department,
      semester,
      phone: phone ? phone.trim() : "",
      avatar: avatar || "",
      role: role || "user",
    });

    await sendOTP(cleanedEmail);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        id: user._id,
        userName: user.userName,
        username: user.userName,
        email: user.email,
        collageName: user.collageName,
        department: user.department,
        semester: user.semester,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User already exists with provided email or username",
      });
    }
    console.error("Error while creating user:", error.message, error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const cleanedEmail = email ? email.toLowerCase().trim() : "";
    const user = await userModel.findOne({ email: cleanedEmail });

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found please Register first" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Incorrect Password" });

    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.REFRESH_TOKEN_EXPIRE,
      },
    );
    const isTokenBlackList = await blackListModel.findOne({ refreshToken });
    if (isTokenBlackList)
      return res.status(401).json({ message: "Unauthorized access" });

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const session = await sessionModel.create({
      user: user._id,
      refreshTokenHash: refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    console.log("ip address", req.ip);
    if (!session)
      return res.status(401).json({ message: "Unauthorized access" });

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        sessionId: session._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.ACCESS_TOKEN_EXPIRE,
      },
    );
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "User login successfully",
      session: "session created successfully",
      accessToken,
      user: {
        _id: user._id,
        id: user._id,
        userName: user.userName,
        username: user.userName,
        email: user.email,
        collageName: user.collageName,
        department: user.department,
        semester: user.semester,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.log(error.message, "error occure while login", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
}

export async function genrateRefreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res
      .status(401)
      .json({ message: "Unauthorized access , refresh token not found" });

  const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

  const refreshTokenHash = await crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res
      .status(401)
      .json({ message: "unauthorized access , session not found" });
  }

  const newRefreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRE,
    },
  );

  const blackList = await blackListModel.findOne({ refreshToken });
  if (blackList) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const accessToken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRET,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRE,
    },
  );

  res.status(200).json({
    message: "Refresh token generated successfully",
    accessToken: accessToken,
  });
}

export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await blackListModel.create({ refreshToken });
  }
  const refreshTokenHash = await crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(401).json({
      message: "Unauthorized access , session not found",
    });
  }

  session.revoked = true;
  await session.save();

  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "user Logged Out successFully   ",
  });
}

export async function forgetPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const cleanedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: cleanedEmail });

    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    await sendOTP(cleanedEmail);

    return res.status(200).json({
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function changePassword(req, res) {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }

    const cleanedEmail = email.toLowerCase().trim();
    const otpHash = crypto.createHash("sha256").update(otp.trim()).digest("hex");

    const otpDetail = await otpModel.findOne({ email: cleanedEmail, otpHash });
    if (!otpDetail) return res.status(400).json({ message: "Invalid OTP or Email" });

    const otpAge = Date.now() - otpDetail.createdAt.getTime();

    if (otpAge > 5 * 60 * 1000) {
      await otpModel.deleteMany({ email: cleanedEmail });
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const newPassword = await bcrypt.hash(password, 10);

    const user = await userModel.findByIdAndUpdate(
      otpDetail.user,
      { password: newPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await otpModel.deleteMany({
      user: otpDetail.user,
    });

    return res.status(200).json({
      message: "Password changed successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function verifyEmail(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const cleanedEmail = email.toLowerCase().trim();
    const otpHash = crypto.createHash("sha256").update(otp.trim()).digest("hex");

    const otpDetail = await otpModel.findOne({
      email: cleanedEmail,
      otpHash,
    });
    if (!otpDetail) return res.status(400).json({ message: "Invalid OTP" });

    const otpAge = Date.now() - otpDetail.createdAt.getTime();

    if (otpAge > 5 * 60 * 1000) {
      await otpModel.deleteMany({ email: cleanedEmail });
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      otpDetail.user,
      { isVerified: true },
      { new: true }
    );

    await otpModel.deleteMany({
      user: otpDetail.user,
    });

    return res.status(200).json({
      message: "Email verified successfully",
      userverified: user ? user.isVerified : true,
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMe(req, res) {
  const curretLoggedInUser = await userModel.findById(req.user.id);

  return res.status(200).json({
    message: "User details fetched successfully",
    user: curretLoggedInUser,
  });
}

export async function updateProfile(req, res) {
  try {
    const { userName, semester, phone, avatar } = req.body;
    
    const updateData = {};
    if (userName !== undefined) updateData.userName = userName;
    if (semester !== undefined) updateData.semester = semester;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

