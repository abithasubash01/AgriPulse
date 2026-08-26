import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("agripulse_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem("agripulse_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("agripulse_user");
    }
  }, [user]);

  const setOtpConfirmation = (result) => {
    setConfirmationResult(result);
  };

  const verifyOtp = async (otp, phone, name, role = "farmer") => {
    try {
      if (!confirmationResult) {
        throw new Error("OTP session expired. Please request a new OTP.");
      }

      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);

      // Get Firebase ID token
      const firebaseIdToken = await result.user.getIdToken();

      // Try to register first
      let response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firebaseIdToken, phone, name, role }),
      });

      // If user already exists (409 Conflict), fall back to login
      if (response.status === 409) {
        response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ firebaseIdToken }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Save logged-in user
      setUser({
        ...data.data.user,
        isLoggedIn: true,
        accessToken: data.data.accessToken,
      });

      setConfirmationResult(null);
      setIsAuthModalOpen(false);

      return data;
    } catch (error) {
      console.error("OTP verification failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase logout error:", error);
    }

    setUser(null);
    setConfirmationResult(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        confirmationResult,
        setOtpConfirmation,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
