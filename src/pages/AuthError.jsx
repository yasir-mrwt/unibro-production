import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Home, RefreshCw } from "lucide-react";
import { useTheme } from "../components/ThemeContext";

const AuthError = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/", { replace: true });
    }
  }, [countdown, navigate]);

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  const handleRetryGoogle = () => {
    window.location.href = import.meta.env.VITE_API_URL + "/api/auth/google";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <div className="w-full max-w-md px-6 text-center space-y-8">
        {/* Clean Error Icon */}
        <div className="flex justify-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? "bg-red-500/10" : "bg-red-50"
            }`}
          >
            <XCircle
              className={`w-10 h-10 ${
                darkMode ? "text-red-500" : "text-red-600"
              }`}
            />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1
            className={`text-2xl font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Authentication failed
          </h1>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            We couldn't sign you in with Google. Please try again.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetryGoogle}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-white text-gray-900 hover:bg-gray-100"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>

          <button
            onClick={handleGoHome}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              darkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Home className="w-4 h-4" />
            Return home
          </button>
        </div>

        {/* Countdown */}
        <p
          className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}
        >
          Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default AuthError;
