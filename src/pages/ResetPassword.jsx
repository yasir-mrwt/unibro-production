import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader,
  Key,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validatePassword = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!/\d/.test(password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, password);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      setError(
        err.message || "Failed to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 pt-20 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`max-w-md w-full rounded-2xl shadow-xl p-8 text-center ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>

          <h2
            className={`text-2xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Password Reset Successful!
          </h2>

          <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Your password has been changed successfully. You can now login with
            your new password.
          </p>

          <div
            className={`p-4 rounded-lg mb-6 ${
              darkMode
                ? "bg-green-900/20 border border-green-800"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-green-400" : "text-green-700"
              }`}
            >
              Redirecting to home page in 3 seconds...
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Go to Home Now
          </button>
        </div>
      </div>
    );
  }

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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h2
            className={`text-2xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Reset Your Password
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div
              className={`p-3 rounded-lg flex items-start gap-2 ${
                darkMode
                  ? "bg-red-900/20 border border-red-800"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <AlertCircle
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              />
              <p
                className={`text-sm ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {error}
              </p>
            </div>
          )}

          {/* Password Requirements */}
          <div
            className={`p-4 rounded-lg ${
              darkMode
                ? "bg-blue-900/20 border border-blue-800"
                : "bg-blue-50 border border-blue-200"
            }`}
          >
            <p
              className={`text-sm font-medium mb-2 ${
                darkMode ? "text-blue-400" : "text-blue-700"
              }`}
            >
              Password Requirements:
            </p>
            <ul
              className={`text-sm space-y-1 ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
            >
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    password.length >= 6 ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                At least 6 characters
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    /\d/.test(password) ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                Contains at least one number
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    password && confirmPassword && password === confirmPassword
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                ></div>
                Passwords match
              </li>
            </ul>
          </div>

          {/* New Password Input */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              New Password
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={loading}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                } hover:text-blue-600 transition-colors disabled:opacity-50`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Confirm New Password
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={loading}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                } hover:text-blue-600 transition-colors disabled:opacity-50`}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Resetting Password...
              </>
            ) : (
              <>
                <Key className="w-5 h-5" />
                Reset Password
              </>
            )}
          </button>
        </form>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/")}
            className={`text-sm ${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-700"
            } transition-colors`}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
