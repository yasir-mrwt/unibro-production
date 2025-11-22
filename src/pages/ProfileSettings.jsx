import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import {
  getStoredUser,
  isAuthenticated,
  getUsernameFromEmail,
} from "../services/authService";

const ProfileSettings = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Load user data on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
      return;
    }

    const userData = getStoredUser();
    setUser(userData);
    setFullName(userData?.fullName || "");
    setEmail(userData?.email || "");
  }, [navigate]);

  // Listen for user data updates
  useEffect(() => {
    const handleUserVerified = () => {
      const updatedUser = getStoredUser();
      if (updatedUser) {
        setUser({ ...updatedUser });
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === "user" && event.newValue) {
        try {
          const updatedUser = JSON.parse(event.newValue);
          setUser({ ...updatedUser });
          setFullName(updatedUser?.fullName || "");
          setEmail(updatedUser?.email || "");
        } catch (error) {
          // Silent error handling
        }
      }
    };

    const pollInterval = setInterval(() => {
      const currentUser = getStoredUser();
      if (currentUser && user && currentUser.isVerified !== user.isVerified) {
        setUser({ ...currentUser });
      }
    }, 2000);

    window.addEventListener("userVerified", handleUserVerified);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userVerified", handleUserVerified);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [user]);

  // Update profile handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ fullName, email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProfileSuccess("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setTimeout(() => setProfileSuccess(""), 3000);
      } else {
        setProfileError(data.message || "Failed to update profile");
      }
    } catch (error) {
      setProfileError("Failed to update profile. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  // Change password handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (!/\d/.test(newPassword)) {
      setPasswordError("New password must contain at least one number");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match!");
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(""), 3000);
      } else {
        setPasswordError(data.message || "Failed to change password");
      }
    } catch (error) {
      setPasswordError("Failed to change password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div
          className={`rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                {getUsernameFromEmail(user.email).charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1
                className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {user.fullName}
              </h1>
              <p
                className={`text-sm sm:text-base mb-2 sm:mb-3 break-all ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {user.email}
              </p>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {user.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Unverified
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium">
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div
          className={`rounded-2xl shadow-xl overflow-hidden ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 font-medium transition-all text-sm sm:text-base ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
                  : darkMode
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                  : "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Profile</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 font-medium transition-all text-sm sm:text-base ${
                activeTab === "password"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
                  : darkMode
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
                  : "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <Key className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Password</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <form
                onSubmit={handleUpdateProfile}
                className="space-y-5 sm:space-y-6"
              >
                <h2
                  className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Update Your Profile
                </h2>

                {/* Success/Error Messages */}
                {profileSuccess && (
                  <div className="p-3 sm:p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {profileSuccess}
                    </p>
                  </div>
                )}

                {profileError && (
                  <div className="p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {profileError}
                    </p>
                  </div>
                )}

                {/* Full Name Input */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={profileLoading}
                      className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border transition-all outline-none ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600"
                      } disabled:opacity-50`}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={profileLoading}
                      className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border transition-all outline-none ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600"
                      } disabled:opacity-50`}
                    />
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    If you change your email, you'll need to verify it again.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {profileLoading ? (
                    <>
                      <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Update Profile</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Password Settings */}
            {activeTab === "password" && (
              <form
                onSubmit={handleChangePassword}
                className="space-y-5 sm:space-y-6"
              >
                <h2
                  className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Change Your Password
                </h2>

                {/* Success/Error Messages */}
                {passwordSuccess && (
                  <div className="p-3 sm:p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {passwordSuccess}
                    </p>
                  </div>
                )}

                {passwordError && (
                  <div className="p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {passwordError}
                    </p>
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                      disabled={passwordLoading}
                      className={`w-full pl-9 sm:pl-10 pr-11 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border transition-all outline-none ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600"
                      } disabled:opacity-50`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      } hover:text-blue-600 transition-colors`}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
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
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 chars with a number"
                      required
                      disabled={passwordLoading}
                      className={`w-full pl-9 sm:pl-10 pr-11 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border transition-all outline-none ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600"
                      } disabled:opacity-50`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      } hover:text-blue-600 transition-colors`}
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
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
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      disabled={passwordLoading}
                      className={`w-full pl-9 sm:pl-10 pr-11 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border transition-all outline-none ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600"
                      } disabled:opacity-50`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      } hover:text-blue-600 transition-colors`}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Changing...</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Change Password</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
