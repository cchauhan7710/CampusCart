import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    collageName: {
      type: String,
      default: "",
      trim: true,
    },
    department: {
      type: String,
      enum: [
        "CSE",
        "IT",
        "ECE",
        "EEE",
        "Mechanical",
        "Civil",
        "MBA",
        "BCA",
        "MCA",
        "Other",
      ],
    },
    semester: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "user",
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// TTL Index: MongoDB automatically purges documents when otpExpiresAt passes
pendingUserSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingUser = mongoose.model("PendingUser", pendingUserSchema);

export default PendingUser;
