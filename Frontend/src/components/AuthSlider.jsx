import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AuthSlider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/register");

  // Sync state if pathname changes externally
  useEffect(() => {
    setIsSignUp(location.pathname === "/register");
  }, [location.pathname]);

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form states
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCollege, setRegCollege] = useState("");
  const [regDept, setRegDept] = useState("");
  const [regSemester, setRegSemester] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Forgot password states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleToggleSignUp = () => {
    setIsSignUp(true);
    setIsForgotPassword(false);
    navigate("/register", { replace: true });
  };

  const handleToggleSignIn = () => {
    setIsSignUp(false);
    setIsForgotPassword(false);
    navigate("/login", { replace: true });
  };

  const handleOpenForgotPassword = (e) => {
    e.preventDefault();
    setForgotEmail(loginEmail);
    setForgotStep(1);
    setForgotOtp("");
    setForgotNewPassword("");
    setForgotConfirmPassword("");
    setIsForgotPassword(true);
  };

  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your registered email address.");
      return;
    }

    try {
      setForgotLoading(true);
      const res = await API.post("/auth/forget-password", {
        email: forgotEmail,
      });
      toast.success(res.data?.message || "OTP sent successfully to your email!");
      // Navigate to OTP page for password reset verification
      navigate("/otp", {
        state: { email: forgotEmail, isResetPassword: true },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotOtp || !forgotNewPassword || !forgotConfirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (forgotNewPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setForgotLoading(true);
      const res = await API.post("/auth/change-password", {
        email: forgotEmail,
        otp: forgotOtp,
        password: forgotNewPassword,
      });

      toast.success(res.data?.message || "Password changed successfully!");
      setLoginEmail(forgotEmail);
      setLoginPassword("");
      setIsForgotPassword(false);
      setForgotStep(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoginLoading(true);
      const response = await API.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      if (response.data) {
        const token = response.data.accessToken;
        const user = response.data.user;
        login(token, user);
        toast.success("Login Successful!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (
      !regUsername ||
      !regEmail ||
      !regPassword ||
      !regPhone ||
      !regCollege ||
      !regDept ||
      !regSemester
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setRegLoading(true);
      const response = await API.post("/auth/register", {
        userName: regUsername,
        email: regEmail,
        password: regPassword,
        collageName: regCollege,
        department: regDept,
        semester: regSemester,
        phone: regPhone,
      });
      if (response.data) {
        toast.success("Account created! Please verify your OTP.");
        navigate("/otp", {
          state: { email: regEmail },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-[calc(100vh-72px)] bg-gradient-to-br from-black via-[#0d0709] to-[#170508] px-4 py-6">
      {/* Background ambient glows */}
      <div className="absolute top-[10%] right-[20%] w-[350px] h-[350px] bg-[#ff4569]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[350px] h-[350px] bg-[#7c3aed]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className={`auth-card ${isSignUp ? "right-panel-active" : ""} z-10`}>
        {/* SIGN UP FORM (Left/Right sliding) */}
        <div className="auth-form-container auth-sign-up-container">
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <h1 className="text-2xl font-black text-white mb-2">Create Account</h1>
            <span className="text-xs text-gray-400 mb-4">Use your university credentials</span>
            
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-full mb-3">
              <div className="col-span-1">
                <input
                  type="text"
                  placeholder="Username"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="auth-input !my-0"
                />
              </div>
              <div className="col-span-1">
                <input
                  type="email"
                  placeholder="Student Email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="auth-input !my-0"
                />
              </div>
              <div className="col-span-1">
                <input
                  type="password"
                  placeholder="Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="auth-input !my-0"
                />
              </div>
              <div className="col-span-1">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="auth-input !my-0"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="College Name"
                  value={regCollege}
                  onChange={(e) => setRegCollege(e.target.value)}
                  className="auth-input !my-0"
                />
              </div>
              <div className="col-span-1">
                <select
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  className="auth-input bg-[#111] text-gray-300 !my-0"
                >
                  <option value="" disabled>Department</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="MBA">MBA</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-span-1">
                <select
                  value={regSemester}
                  onChange={(e) => setRegSemester(e.target.value)}
                  className="auth-input bg-[#111] text-gray-300 !my-0"
                >
                  <option value="" disabled>Semester</option>
                  <option value="1">Sem 1</option>
                  <option value="2">Sem 2</option>
                  <option value="3">Sem 3</option>
                  <option value="4">Sem 4</option>
                  <option value="5">Sem 5</option>
                  <option value="6">Sem 6</option>
                  <option value="7">Sem 7</option>
                  <option value="8">Sem 8</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={regLoading} className="auth-button-primary">
              {regLoading ? "Registering..." : "Sign Up"}
            </button>

            <p className="text-xs text-gray-400 mt-4 md:hidden">
              Already have an account?{" "}
              <button
                type="button"
                onClick={handleToggleSignIn}
                className="text-[#ff4569] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>

        {/* SIGN IN / FORGOT PASSWORD FORM */}
        <div className="auth-form-container auth-sign-in-container">
          {isForgotPassword ? (
            forgotStep === 1 ? (
              /* Step 1: Send OTP Form */
              <form onSubmit={handleSendForgotOtp} className="auth-form">
                <h1 className="text-2xl font-black text-white mb-2">Forgot Password</h1>
                <span className="text-xs text-gray-400 mb-6 text-center">
                  Enter your registered email to receive an OTP verification code
                </span>

                <input
                  type="email"
                  placeholder="Student Email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="auth-input"
                  required
                />

                <button type="submit" disabled={forgotLoading} className="auth-button-primary mt-2">
                  {forgotLoading ? "Sending OTP..." : "Send Reset OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-xs text-gray-400 mt-5 hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </form>
            ) : (
              /* Step 2: Reset Password Form */
              <form onSubmit={handleResetPasswordSubmit} className="auth-form">
                <h1 className="text-2xl font-black text-white mb-1">Reset Password</h1>
                <span className="text-[11px] text-[#ff4569] mb-4 text-center">
                  OTP sent to {forgotEmail}
                </span>

                <input
                  type="text"
                  placeholder="Enter 6-Digit OTP"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  className="auth-input !my-1"
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  className="auth-input !my-1"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  className="auth-input !my-1"
                  required
                />

                <button type="submit" disabled={forgotLoading} className="auth-button-primary mt-3">
                  {forgotLoading ? "Resetting Password..." : "Set New Password"}
                </button>

                <div className="flex items-center justify-between w-full mt-4 px-1">
                  <button
                    type="button"
                    onClick={handleSendForgotOtp}
                    disabled={forgotLoading}
                    className="text-xs text-[#ff4569] hover:underline bg-transparent border-none p-0 cursor-pointer disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setForgotStep(1);
                    }}
                    className="text-xs text-gray-400 hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )
          ) : (
            /* Normal Sign In Form */
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <h1 className="text-2xl font-black text-white mb-2">Sign In</h1>
              <span className="text-xs text-gray-400 mb-6">Enter your account details</span>

              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="auth-input"
              />

              <button
                type="button"
                onClick={handleOpenForgotPassword}
                className="text-xs text-[#ff4569] my-4 hover:underline bg-transparent border-none p-0 cursor-pointer self-center"
              >
                Forgot your password?
              </button>

              <button type="submit" disabled={loginLoading} className="auth-button-primary">
                {loginLoading ? "Signing In..." : "Sign In"}
              </button>

              <p className="text-xs text-gray-400 mt-4 md:hidden">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={handleToggleSignUp}
                  className="text-[#ff4569] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Sign Up
                </button>
              </p>
            </form>
          )}
        </div>

        {/* OVERLAY SLIDER PANELS */}
        <div className="auth-overlay-container">
          <div className="auth-overlay">
            {/* Overlay Left (Shown during Sign Up) */}
            <div className="auth-overlay-panel auth-overlay-left">
              <h1 className="text-3xl font-black mb-2">Welcome Back!</h1>
              <p className="text-sm font-light leading-relaxed mb-6">
                To keep connected with us, please log in with your personal info
              </p>
              <button
                type="button"
                id="signIn"
                onClick={handleToggleSignIn}
                className="auth-button-ghost"
              >
                Sign In
              </button>
            </div>

            {/* Overlay Right (Shown during Sign In) */}
            <div className="auth-overlay-panel auth-overlay-right">
              <h1 className="text-3xl font-black mb-2">Hello, Friend!</h1>
              <p className="text-sm font-light leading-relaxed mb-6">
                Enter your details and start your journey with CampusCart today
              </p>
              <button
                type="button"
                id="signUp"
                onClick={handleToggleSignUp}
                className="auth-button-ghost"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthSlider;
