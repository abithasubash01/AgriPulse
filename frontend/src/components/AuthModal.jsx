import React, { useState, useEffect } from "react";
import { Smartphone, X, ShieldCheck, User, ArrowRight } from "lucide-react";
import { signInWithPhoneNumber } from "firebase/auth";

import { auth, RecaptchaVerifier } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setOtpConfirmation, verifyOtp } =
    useAuth();

  const { showToast } = useApp();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("farmer");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthModalOpen) return;

    setStep(1);
    setPhone("");
    setOtp(["", "", "", "", "", ""]);
    setName("");
  }, [isAuthModalOpen]);

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      return window.recaptchaVerifier;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "normal",
        callback: () => {
          console.log("reCAPTCHA verified");
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
          showToast("reCAPTCHA expired. Please try again.");
        },
      },
    );

    window.recaptchaVerifier.render();

    return window.recaptchaVerifier;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Please enter your name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      showToast("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = `+91${phone}`;

      const appVerifier = setupRecaptcha();

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier,
      );

      setOtpConfirmation(confirmationResult);
      setStep(2);

      showToast("📱 OTP sent successfully to your phone.");
    } catch (error) {
      console.error("OTP sending failed:", error);

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      showToast(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (!/^[0-9]{6}$/.test(enteredOtp)) {
      showToast("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp(enteredOtp, `+91${phone}`, name.trim(), role);

      showToast(`Welcome ${name.trim()}! Logged in successfully.`);
    } catch (error) {
      console.error("OTP verification failed:", error);

      showToast(error.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp(["", "", "", "", "", ""]);
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-cyan-500/40 p-6 space-y-6 bg-[#0B0F19]/95 shadow-[0_0_50px_rgba(0,255,136,0.25)] relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-[#00FF88]" />

            <h3 className="text-xl font-extrabold text-white font-tech">
              AgriPulse Phone Auth
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <p className="text-xs text-gray-400">
              Farmers & Traders login directly using their phone number. No
              email or password needed.
            </p>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                Farmer Name
              </label>

              <div className="relative">
                <User className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-900 border border-cyan-500/30 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                Mobile Phone Number (+91)
              </label>

              <div className="relative">
                <Smartphone className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />

                <input
                  type="tel"
                  maxLength="10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-900 border border-cyan-500/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2">
                I am a
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole("farmer")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    role === "farmer"
                      ? "bg-[#00FF88]/20 border-[#00FF88] text-[#00FF88]"
                      : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  Farmer
                </button>
                <button
                  type="button"
                  onClick={() => setRole("buyer")}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    role === "buyer"
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                      : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  Buyer
                </button>
              </div>
            </div>

            {/* reCAPTCHA */}
            <div id="recaptcha-container" className="flex justify-center"></div>

            {/* Send OTP */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-[#00FF88] to-cyan-500 text-black shadow-[0_0_15px_rgba(0,255,136,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "Sending OTP..." : "Get 6-Digit OTP"}</span>

              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center space-y-1">
              <span className="text-xs text-gray-400">
                Enter the verification code sent to
              </span>

              <p className="text-sm font-bold text-[#00FF88] font-mono">
                +91 {phone}
              </p>

              <span className="text-[10px] text-gray-500 font-mono block">
                Enter the 6-digit OTP received by SMS
              </span>
            </div>

            {/* OTP */}
            <div className="flex justify-center space-x-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className="w-10 h-12 text-center text-lg font-bold font-mono rounded-xl bg-gray-900 border border-cyan-500/50 text-[#00FF88] focus:border-[#00FF88] focus:outline-none"
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="w-1/3 py-2.5 rounded-xl text-xs font-bold bg-gray-800 text-gray-300 disabled:opacity-50"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-2.5 rounded-xl text-xs font-extrabold bg-[#00FF88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)] hover:brightness-110 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Login 🚀"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
