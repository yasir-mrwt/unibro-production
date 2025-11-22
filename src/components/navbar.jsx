import {
  Moon,
  Sun,
  BookOpen,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Mail,
  Shield,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import LoginForm from "./authentication/loginForm";
import RegisterForm from "./authentication/registerForm";
import {
  logout,
  isAuthenticated,
  getStoredUser,
  getUsernameFromEmail,
  getStoredToken,
} from "../services/authService";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const coursesRef = useRef(null);
  const profileButtonRef = useRef(null);

  // ✅ OAuth Login Event Listeners - ADDED THIS SECTION
  useEffect(() => {
    // ✅ Listen for OAuth login success
    const handleOAuthLogin = (event) => {
      // Update user state
      if (event.detail) {
        setCurrentUser(event.detail);
        setIsLoggedIn(true);
      }
    };

    // ✅ Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      const storedUser = getStoredUser();
      const token = getStoredToken();

      if (storedUser && token) {
        setCurrentUser(storedUser);
        setIsLoggedIn(true);
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    };

    // Add event listeners
    window.addEventListener("userLoggedIn", handleOAuthLogin);
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("userLoggedIn", handleOAuthLogin);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ✅ Also add this check on component mount - UPDATED
  useEffect(() => {
    // Check for user on initial load
    const checkUser = () => {
      const storedUser = getStoredUser();
      const token = getStoredToken();

      if (storedUser && token) {
        setCurrentUser(storedUser);
        setIsLoggedIn(true);
      }
    };

    checkUser();
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Real-time user data updates
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "user" && event.newValue) {
        try {
          const updatedUser = JSON.parse(event.newValue);
          setCurrentUser({ ...updatedUser });
          setIsLoggedIn(true);
        } catch (error) {}
      }
    };

    const handleUserVerified = (event) => {
      const updatedUser = getStoredUser();
      if (updatedUser) {
        setCurrentUser({ ...updatedUser });
        setIsLoggedIn(true);
      }
    };

    const pollInterval = setInterval(() => {
      if (isLoggedIn) {
        const storedUser = getStoredUser();
        if (
          storedUser &&
          currentUser &&
          storedUser.isVerified !== currentUser.isVerified
        ) {
          setCurrentUser({ ...storedUser });
        }
      }
    }, 2000);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userVerified", handleUserVerified);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userVerified", handleUserVerified);
      clearInterval(pollInterval);
    };
  }, [isLoggedIn, currentUser]);

  // SIMPLIFIED: Close dropdowns when clicking outside - REMOVED COMPLEX LOGIC
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close courses dropdown when clicking outside
      if (coursesRef.current && !coursesRef.current.contains(event.target)) {
        setIsCoursesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close profile dropdown when clicking anywhere else (except the dropdown itself)
  useEffect(() => {
    const handleGlobalClick = (event) => {
      if (isProfileOpen) {
        // If profile is open and click is NOT on profile button or dropdown, close it
        if (
          profileButtonRef.current &&
          !profileButtonRef.current.contains(event.target) &&
          profileRef.current &&
          !profileRef.current.contains(event.target)
        ) {
          setIsProfileOpen(false);
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [isProfileOpen]);

  const checkAuthStatus = () => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);

    if (authenticated) {
      const user = getStoredUser();
      setCurrentUser(user);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowLogin(false);
    setIsProfileOpen(false);
  };

  const handleRegisterSuccess = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowRegister(false);
    setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setCurrentUser(null);
      setIsProfileOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMobileCoursesOpen(false);
  };

  // Handle profile icon click for mobile and desktop - FIXED
  const handleProfileIconClick = (event) => {
    event.stopPropagation(); // Prevent event from bubbling up
    if (isLoggedIn) {
      setIsProfileOpen(!isProfileOpen);
    } else {
      setShowLogin(true);
      setIsProfileOpen(false);
    }
  };

  // Handle courses dropdown toggle
  const handleCoursesToggle = () => {
    setIsCoursesOpen(!isCoursesOpen);
  };

  const handleOpenLogin = () => {
    setShowLogin(true);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleOpenRegister = () => {
    setShowRegister(true);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleCloseAll = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleCourseSelect = (courseName) => {
    const departmentMap = {
      "Computer Science": {
        id: 1,
        name: "Computer Science",
        tagline: "Code the Future",
        color: "from-blue-500 to-cyan-500",
      },
      "Electrical Engineering": {
        id: 2,
        name: "Electrical Engineering",
        tagline: "Power the World",
        color: "from-purple-500 to-pink-500",
      },
      "Mechanical Engineering": {
        id: 3,
        name: "Mechanical Engineering",
        tagline: "Build Tomorrow",
        color: "from-orange-500 to-red-500",
      },
      "Industrial Engineering": {
        id: 4,
        name: "Industrial Engineering",
        tagline: "Optimize Systems",
        color: "from-pink-500 to-rose-500",
      },
    };

    const department = departmentMap[courseName];
    if (department) {
      navigate("/select-semester", { state: { department } });
    } else if (courseName === "Explore More") {
      navigate("/select-department");
    }
    setIsCoursesOpen(false);
    setIsMenuOpen(false);
  };

  // FIXED: Navigation handler for profile dropdown links
  const handleNavigation = (path) => {
    navigate(path);
    setIsProfileOpen(false); // Close dropdown after navigation
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", href: "/", type: "link" },
    {
      name: "Courses",
      type: "dropdown",
      dropdown: [
        { name: "Computer Science" },
        { name: "Electrical Engineering" },
        { name: "Mechanical Engineering" },
        { name: "Industrial Engineering" },
        { name: "Explore More" },
      ],
    },
    { name: "Community", href: "/community", type: "link" },
    { name: "Staff", href: "/staff", type: "link" },
    { name: "About", href: "/about", type: "link" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b backdrop-blur-sm bg-opacity-90 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 dark:from-purple-500 dark:to-pink-500 flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                Unibro
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <div key={index} className="relative group">
                  {item.type === "dropdown" ? (
                    <div
                      className="relative"
                      ref={coursesRef}
                      onMouseEnter={() => setIsCoursesOpen(true)}
                      onMouseLeave={() => setIsCoursesOpen(false)}
                    >
                      <button
                        onClick={handleCoursesToggle}
                        className="flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isCoursesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isCoursesOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 z-50">
                          {item.dropdown.map((dropdownItem, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                handleCourseSelect(dropdownItem.name)
                              }
                              className={`w-full text-left block px-4 py-3 transition-colors duration-200 mx-2 rounded-lg ${
                                dropdownItem.name === "Explore More"
                                  ? darkMode
                                    ? "text-yellow-400 hover:bg-yellow-900/20 hover:text-yellow-300 border-t border-gray-600 mt-2"
                                    : "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 border-t border-gray-200 mt-2"
                                  : darkMode
                                  ? "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                              }`}
                            >
                              {dropdownItem.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(item.href)}
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {item.name}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-yellow-400 transition-all duration-200 hover:shadow-lg"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {isLoggedIn ? (
                /* Profile Dropdown with hover and click - FIXED */
                <div className="relative">
                  <button
                    ref={profileButtonRef}
                    onClick={handleProfileIconClick}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      darkMode
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">
                      {getUsernameFromEmail(currentUser?.email)}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div
                      ref={profileRef}
                      className={`absolute right-0 mt-2 w-72 rounded-xl shadow-2xl border backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 z-50 ${
                        darkMode
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {/* User Info Header */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">
                              {getUsernameFromEmail(currentUser?.email)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-semibold ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {currentUser?.fullName}
                            </p>
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {currentUser?.email}
                            </p>
                          </div>
                        </div>

                        {/* Verification Status */}
                        <div className="mt-3">
                          {currentUser?.isVerified ? (
                            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg animate-pulse">
                              <Shield className="w-3.5 h-3.5" />
                              <span>Verified Account</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg">
                              <Mail className="w-3.5 h-3.5" />
                              <span>Please verify your email</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Role Badge */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Role
                          </span>
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            {currentUser?.role?.charAt(0).toUpperCase() +
                              currentUser?.role?.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Navigation Links - FIXED: Using handleNavigation */}
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => handleNavigation("/my-posts")}
                          className={`w-full flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                            darkMode
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <BookOpen className="w-4 h-4" />
                          <span className="font-medium">My Posts</span>
                        </button>

                        <button
                          onClick={() => handleNavigation("/profile-settings")}
                          className={`w-full flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                            darkMode
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="font-medium">Settings</span>
                        </button>

                        {/* ADMIN ONLY: Admin Dashboard */}
                        {currentUser?.role === "admin" && (
                          <>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                            <button
                              onClick={() =>
                                handleNavigation("/admin/dashboard")
                              }
                              className={`w-full flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                darkMode
                                  ? "text-red-400 hover:bg-red-900/20 border border-red-800/50"
                                  : "text-red-600 hover:bg-red-50 border border-red-200"
                              }`}
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              <span className="font-medium">
                                Admin Dashboard
                              </span>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Logout Button */}
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                            darkMode
                              ? "text-red-400 hover:bg-red-900/20"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Desktop Login/Register Buttons */
                <>
                  <button
                    onClick={handleOpenLogin}
                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleOpenRegister}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Get Started
                  </button>
                </>
              )}

              {/* Hidden trigger for HeroSection */}
              <button
                id="auth-modal-trigger"
                onClick={handleOpenRegister}
                className="hidden"
                aria-hidden="true"
              />
            </div>

            {/* Mobile Right Side */}
            <div className="flex lg:hidden items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-yellow-400 transition-all duration-200"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Profile Icon - Click functionality only for mobile */}
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={handleProfileIconClick}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Profile Dropdown Menu - Only show when logged in */}
                {isLoggedIn && isProfileOpen && (
                  <div
                    ref={profileRef}
                    className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl border backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 z-50 ${
                      darkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {/* User Info Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {getUsernameFromEmail(currentUser?.email)
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-semibold text-sm ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {currentUser?.fullName}
                          </p>
                          <p
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {currentUser?.email}
                          </p>
                        </div>
                      </div>

                      {/* Verification Status */}
                      <div className="mt-2">
                        {currentUser?.isVerified ? (
                          <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
                            <Shield className="w-3 h-3" />
                            <span>Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                            <Mail className="w-3 h-3" />
                            <span>Verify Email</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Navigation Links - FIXED: Using handleNavigation */}
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => handleNavigation("/my-posts")}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span className="font-medium text-sm">My Posts</span>
                      </button>

                      <button
                        onClick={() => handleNavigation("/profile-settings")}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                          darkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="font-medium text-sm">Settings</span>
                      </button>

                      {/* ADMIN ONLY: Mobile Admin Dashboard */}
                      {currentUser?.role === "admin" && (
                        <button
                          onClick={() => handleNavigation("/admin/dashboard")}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                            darkMode
                              ? "text-red-400 hover:bg-red-900/20 border border-red-800/50"
                              : "text-red-600 hover:bg-red-50 border border-red-200"
                          }`}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span className="font-medium text-sm">
                            Admin Dashboard
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Logout Button */}
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                          darkMode
                            ? "text-red-400 hover:bg-red-900/20"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Menu Toggle Button */}
              <button
                onClick={toggleMenu}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-6 pb-4 border-t border-gray-200 dark:border-gray-800 pt-6">
              <div className="flex flex-col space-y-3">
                {navItems.map((item, index) => (
                  <div key={index}>
                    {item.type === "dropdown" ? (
                      <div className="space-y-2">
                        <button
                          className="flex items-center justify-between w-full px-4 py-3 text-left rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                          onClick={() =>
                            setIsMobileCoursesOpen(!isMobileCoursesOpen)
                          }
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isMobileCoursesOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isMobileCoursesOpen && (
                          <div className="ml-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                            {item.dropdown.map((dropdownItem, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  handleCourseSelect(dropdownItem.name)
                                }
                                className={`w-full text-left block px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                                  dropdownItem.name === "Explore More"
                                    ? darkMode
                                      ? "text-yellow-400 hover:bg-yellow-900/20 hover:text-yellow-300"
                                      : "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                                    : darkMode
                                    ? "text-gray-400 hover:bg-gray-700 hover:text-blue-400"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                }`}
                              >
                                {dropdownItem.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          navigate(item.href);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left block px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors duration-200"
                      >
                        {item.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Forms */}
      <LoginForm
        isOpen={showLogin}
        onClose={handleCloseAll}
        onSwitchToRegister={handleSwitchToRegister}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterForm
        isOpen={showRegister}
        onClose={handleCloseAll}
        onSwitchToLogin={handleSwitchToLogin}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </>
  );
};

export default Navbar;
