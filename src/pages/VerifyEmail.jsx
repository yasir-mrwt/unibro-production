import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader,
  Mail,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  const hasVerified = useRef(false);

  useEffect(() => {
    if (!hasVerified.current) {
      hasVerified.current = true;
      verifyEmail();
    }
  }, [token]);

  // Auto-redirect countdown
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      handleContinue();
    }
  }, [status, countdown]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + `/api/auth/verify-email/${token}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");

        // Update user verification status in localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            user.isVerified = true;
            localStorage.setItem("user", JSON.stringify(user));

            window.dispatchEvent(
              new CustomEvent("userVerified", {
                detail: { isVerified: true },
              })
            );

            window.dispatchEvent(
              new StorageEvent("storage", {
                key: "user",
                newValue: JSON.stringify(user),
              })
            );
          } catch (parseError) {
            console.error("Error updating localStorage:", parseError);
          }
        }
      } else {
        setStatus("error");
        setMessage(
          data.message || "Verification failed. Token may be expired."
        );
        if (data.expired) {
          setIsExpired(true);
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage("Failed to verify email. Please try again.");
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    setResendMessage("");

    try {
      let authToken = localStorage.getItem("token");

      if (!authToken) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            authToken = user.token;
          } catch (e) {
            console.error("Error parsing user:", e);
          }
        }
      }

      if (!authToken) {
        setResendMessage("Please log in to resend verification email");
        setResending(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/auth/resend-verification",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setResendMessage(
          `${data.message} (${data.remainingAttempts} attempts remaining today)`
        );
        setStatus("resent");
      } else {
        if (response.status === 429) {
          setResendMessage(data.message);
        } else {
          setResendMessage(data.message);
        }
      }
    } catch (error) {
      console.error("Resend error:", error);
      setResendMessage("Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  const handleContinue = () => {
    if (window.opener) {
      window.close();
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 pt-20 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-md w-full rounded-2xl shadow-xl p-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {status === "verifying" && (
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Loader className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          )}
          {(status === "success" || status === "resent") && (
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          )}
          {status === "error" && (
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2
          className={`text-2xl font-bold text-center mb-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {status === "verifying" && "Verifying Your Email..."}
          {status === "success" && "Email Verified!"}
          {status === "resent" && "Verification Email Sent!"}
          {status === "error" && "Verification Failed"}
        </h2>

        {/* Message */}
        <p
          className={`text-center mb-6 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {message}
        </p>

        {/* Success State */}
        {status === "success" && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              darkMode
                ? "bg-green-900/20 border border-green-800"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <Mail
                className={`w-5 h-5 mt-0.5 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              />
              <div>
                <p
                  className={`font-medium mb-1 ${
                    darkMode ? "text-green-400" : "text-green-700"
                  }`}
                >
                  Welcome to Unibro!
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-green-300" : "text-green-600"
                  }`}
                >
                  Your account is now active. You can start exploring courses
                  and learning materials.
                </p>
                <p
                  className={`text-xs mt-2 font-semibold ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  Redirecting to home in {countdown} seconds...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resent State */}
        {status === "resent" && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              darkMode
                ? "bg-blue-900/20 border border-blue-800"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <Mail
                className={`w-5 h-5 mt-0.5 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <div>
                <p
                  className={`font-medium mb-1 ${
                    darkMode ? "text-blue-400" : "text-blue-700"
                  }`}
                >
                  Check Your Email
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-blue-300" : "text-blue-600"
                  }`}
                >
                  We've sent a new verification link to your email. The link
                  will expire in 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              darkMode
                ? "bg-red-900/20 border border-red-800"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <XCircle
                className={`w-5 h-5 mt-0.5 ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              />
              <div className="flex-1">
                <p
                  className={`font-medium mb-1 ${
                    darkMode ? "text-red-400" : "text-red-700"
                  }`}
                >
                  {isExpired ? "Link Expired" : "What can you do?"}
                </p>
                {isExpired ? (
                  <p
                    className={`text-sm mb-3 ${
                      darkMode ? "text-red-300" : "text-red-600"
                    }`}
                  >
                    This verification link has expired. Click below to receive a
                    new one.
                  </p>
                ) : (
                  <ul
                    className={`text-sm list-disc list-inside space-y-1 ${
                      darkMode ? "text-red-300" : "text-red-600"
                    }`}
                  >
                    <li>Request a new verification email</li>
                    <li>Contact support if the issue persists</li>
                    <li>Check if the link has expired (valid for 24 hours)</li>
                  </ul>
                )}

                {/* Resend Button */}
                {isExpired && (
                  <button
                    onClick={handleResendVerification}
                    disabled={resending}
                    className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {resending ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Resend Verification Email
                      </>
                    )}
                  </button>
                )}

                {/* Resend Message */}
                {resendMessage && (
                  <div
                    className={`mt-3 p-3 rounded-lg text-sm ${
                      resendMessage.includes("remaining")
                        ? darkMode
                          ? "bg-green-900/30 text-green-300"
                          : "bg-green-100 text-green-700"
                        : darkMode
                        ? "bg-yellow-900/30 text-yellow-300"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {resendMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {(status === "success" ||
          status === "resent" ||
          (status === "error" && !isExpired)) && (
          <button
            onClick={handleContinue}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {status === "success"
              ? "Start Learning"
              : status === "resent"
              ? "Check Your Email"
              : "Go to Home"}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {/* Loading Text */}
        {status === "verifying" && (
          <p
            className={`text-center text-sm ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Please wait while we verify your email address...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
