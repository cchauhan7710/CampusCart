import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const OtpPage = () => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  // Email passed from Register or Forgot Password page
  const email = location.state?.email || "";
  const isResetPassword = Boolean(location.state?.isResetPassword);

  // Countdown timer logic
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return; // Allow only numeric entries

    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1); // Extract final char
    setOtpValues(newOtp);

    // Auto-focus next field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        // Clear previous box and shift focus
        const newOtp = [...otpValues];
        newOtp[index - 1] = "";
        setOtpValues(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else if (otpValues[index]) {
        // Clear current value
        const newOtp = [...otpValues];
        newOtp[index] = "";
        setOtpValues(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return; // Validate 6 digits

    const digits = pastedData.split("");
    setOtpValues(digits);
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otpValues.join("");

    if (fullOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (isResetPassword) {
      if (!newPassword || !confirmPassword) {
        toast.error("Please fill in both password fields.");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      if (isResetPassword) {
        // Password Reset verification
        const response = await axios.post(
          "http://localhost:5000/api/auth/change-password",
          {
            email,
            otp: fullOtp,
            password: newPassword,
          }
        );

        if (response.data) {
          toast.success(response.data?.message || "Password Changed Successfully!");
          navigate("/login");
        }
      } else {
        // Email OTP verification
        const response = await axios.post(
          "http://localhost:5000/api/auth/verify-email",
          {
            email,
            otp: fullOtp,
          }
        );

        if (response.data) {
          toast.success("OTP Verified Successfully!");
          navigate("/login");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      try {
        await axios.post("http://localhost:5000/api/auth/forget-password", { email });
        toast.success("Verification code has been resent to your email.");
        setResendTimer(30);
      } catch (err) {
        toast.error("Failed to resend OTP. Please try again.");
      }
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black via-[#0d0709] to-[#170508] px-4 py-8">
      {/* Background radial glows */}
      <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-[#ff4569]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[30%] w-[300px] h-[300px] bg-[#7c3aed]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative border border-white/5 bg-[#111111]/85 backdrop-blur-xl p-8 md:p-10 w-full max-w-[420px] text-white shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-[28px] z-10 text-center">
        <h2 className="text-3xl font-black tracking-tight text-white mb-2">
          {isResetPassword ? "Reset Password" : "Verify OTP"}
        </h2>

        <p className="text-[#B89AA2] text-sm mb-6 leading-relaxed">
          {isResetPassword
            ? "Enter the OTP code sent to your email and your new password"
            : "We have sent a verification code to"}
          {email && (
            <>
              <br />
              <strong className="text-white text-[15px] font-medium break-all">{email}</strong>
            </>
          )}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div 
            className="flex justify-center gap-3.5 mb-2"
            onPaste={handlePaste}
          >
            {otpValues.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={value}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                className="w-11 h-11 md:w-13 md:h-13 rounded-xl border border-white/10 bg-[#161616]/50 text-white text-center text-xl font-extrabold focus:outline-none focus:border-[#ff4569] focus:ring-1 focus:ring-[#ff4569]/30 focus:bg-[#1c1c1c]/50 transition duration-300"
              />
            ))}
          </div>

          {/* New Password fields when in Reset Password mode */}
          {isResetPassword && (
            <div className="flex flex-col gap-3 text-left">
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#ff4569]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#ff4569]"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-[#ff4569] to-[#d5354f] hover:from-[#ff5c7d] hover:to-[#e6405c] py-3.5 rounded-xl font-bold tracking-wide transition duration-300 shadow-[0_6px_20px_rgba(255,69,105,0.25)] hover:shadow-[0_8px_24px_rgba(255,69,105,0.4)] active:scale-[0.98] disabled:opacity-50 text-[15px] cursor-pointer"
          >
            {loading
              ? isResetPassword
                ? "Resetting..."
                : "Verifying..."
              : isResetPassword
              ? "Change Password"
              : "Verify OTP"}
          </button>
        </form>

        {/* Resend button / Timer */}
        <div className="mt-6 text-center text-sm">
          {resendTimer > 0 ? (
            <p className="text-gray-500 text-xs">
              Resend code in <span className="text-[#ff4569] font-medium">{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-[#ff4569] hover:underline text-xs font-semibold bg-transparent border-0 cursor-pointer p-0"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default OtpPage;