import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import { register } from "../../services/authService";

const RegisterForm = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onRegisterSuccess,
}) => {
  const { darkMode } = useTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
  });

  // Password validation function
  const validatePassword = (password, email) => {
    const errors = [];

    // Check minimum length
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    // Check for uppercase letter
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    // Check for lowercase letter
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    // Check for digit
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    // Check for special character
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    // Check if password contains email
    if (
      email &&
      password.toLowerCase().includes(email.toLowerCase().split("@")[0])
    ) {
      errors.push("Password cannot contain your email address");
    }

    // Check for common weak patterns
    if (/123456|password|qwerty|abc123/i.test(password)) {
      errors.push("Password is too common or weak");
    }

    return errors;
  };

  // Update password strength as user types
  useEffect(() => {
    if (password) {
      const errors = validatePassword(password, email);
      const score = Math.max(0, 6 - errors.length); // 0-6 score

      setPasswordStrength({
        score,
        feedback: errors,
      });
    } else {
      setPasswordStrength({ score: 0, feedback: [] });
    }
  }, [password, email]);

  // Close on escape key and disable scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreeTerms(false);
      setError("");
      setSuccess("");
      setPasswordStrength({ score: 0, feedback: [] });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    // Validate strong password
    const passwordErrors = validatePassword(password, email);
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]); // Show first error
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        fullName,
        email,
        password,
      });

      if (response.success) {
        setSuccess(
          "Registration successful! Please check your email to verify your account."
        );

        // Call parent success handler
        if (onRegisterSuccess) {
          onRegisterSuccess(response.user);
        }

        // Close modal after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-md rounded-xl shadow-xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        } transform transition-all max-h-[90vh] overflow-y-auto`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-1.5 rounded-lg transition-colors z-10 ${
            darkMode
              ? "hover:bg-gray-700 text-gray-400"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4">
          <h2
            className={`text-xl font-bold text-center mb-1 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Create Account
          </h2>
          <p
            className={`text-center text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Join us today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  {success}
                </p>
              </div>
            )}

            {/* Full Name Input */}
            <div>
              <label
                className={`block text-xs font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={loading || success}
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border transition-all outline-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                className={`block text-xs font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading || success}
                  className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border transition-all outline-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                className={`block text-xs font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create strong password"
                  required
                  disabled={loading || success}
                  className={`w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border transition-all outline-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || success}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  } hover:text-blue-600 transition-colors disabled:opacity-50`}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span
                      className={darkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Password strength:
                    </span>
                    <span
                      className={`
                      font-medium
                      ${
                        passwordStrength.score >= 4
                          ? "text-green-600"
                          : passwordStrength.score >= 2
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    `}
                    >
                      {passwordStrength.score >= 4
                        ? "Strong"
                        : passwordStrength.score >= 2
                        ? "Medium"
                        : "Weak"}
                    </span>
                  </div>

                  {/* Strength Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        passwordStrength.score >= 4
                          ? "bg-green-500"
                          : passwordStrength.score >= 2
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${(passwordStrength.score / 6) * 100}%`,
                      }}
                    ></div>
                  </div>

                  {/* Password Requirements */}
                  <div className="text-xs space-y-1">
                    {[
                      "8+ characters",
                      "Uppercase letter",
                      "Lowercase letter",
                      "Number",
                      "Special character",
                      "Not contain email",
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {passwordStrength.score > index ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-gray-400" />
                        )}
                        <span
                          className={
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {requirement}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                className={`block text-xs font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  disabled={loading || success}
                  className={`w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border transition-all outline-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading || success}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  } hover:text-blue-600 transition-colors disabled:opacity-50`}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start text-xs">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={loading || success}
                className="w-3 h-3 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                required
              />
              <label
                className={`ml-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading || success || passwordStrength.score < 4}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Account Created!
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p
                className={`text-xs ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
