import crypto from "crypto"
import { generateOTP , otpHTML } from "../utils/otp.utils.js"
import { sendMail } from "../utils/sendMail.utils.js"
import otpModel from "../models/otp.model.js"
import userModel from "../models/user.model.js";

export async function sendOTP(email, providedOtp = null) {
  const otp = providedOtp || generateOTP();
  const html = otpHTML(otp);
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await userModel.findOne({ email });

  if (user) {
    // Delete previous reset OTPs for this user
    await otpModel.deleteMany({ email });
    await otpModel.create({
      email,
      user: user._id,
      otpHash,
    });
  }

  await sendMail(email, "OTP Verification", `Your OTP is: ${otp}`, html);
  return otp;
}