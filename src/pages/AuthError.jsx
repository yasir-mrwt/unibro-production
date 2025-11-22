import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Home, RefreshCw } from "lucide-react";
import { useTheme } from "../components/ThemeContext";

const AuthError = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
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
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center pt-20 p-4 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-red-50 to-orange-50"
      }`}
    >
      <div
        className={`text-center p-8 rounded-2xl shadow-xl max-w-md w-full ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        <h2
          className={`text-2xl font-bold mb-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Authentication Failed
        </h2>

        <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          There was a problem signing in with Google. Please try again.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRetryGoogle}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again with Google
          </button>

          <button
            onClick={handleGoHome}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg transition-all duration-200 ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-900"
            }`}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>

          <p
            className={`text-xs pt-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Auto-redirecting in {countdown} second{countdown !== 1 ? "s" : ""}
            ...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthError;
