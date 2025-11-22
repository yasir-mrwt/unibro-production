import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  TrendingUp,
  Award,
  CheckCircle,
  Rocket,
  Target,
  Shield,
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import { getStoredUser } from "../services/authService";
import "./styles/heroSection.css";

const HeroSection = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Check authentication on mount and listen for changes
  useEffect(() => {
    const checkAuth = () => {
      const user = getStoredUser();
      setIsAuthenticated(!!user);
    };

    // Check initially
    checkAuth();

    // Listen for storage changes (cross-tab)
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "token") {
        checkAuth();
      }
    };

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authStateChanged", handleAuthChange);

    // Poll for auth changes every second
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChanged", handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: BookOpen,
      text: "10,000+ Resources",
      color: "from-blue-500 to-cyan-500",
      delay: "0s",
    },
    {
      icon: Users,
      text: "5,000+ Students",
      color: "from-purple-500 to-pink-500",
      delay: "0.1s",
    },
    {
      icon: Award,
      text: "200+ Faculty",
      color: "from-yellow-500 to-orange-500",
      delay: "0.2s",
    },
  ];

  const floatingElements = [
    { icon: BookOpen, delay: "0s", top: "8%", left: "3%", scale: 1 },
    { icon: Star, delay: "0.5s", top: "12%", right: "5%", scale: 0.8 },
    { icon: Users, delay: "1s", top: "55%", left: "2%", scale: 1.2 },
    { icon: Zap, delay: "1.5s", top: "65%", right: "4%", scale: 0.9 },
    { icon: Award, delay: "2s", top: "25%", right: "12%", scale: 1.1 },
    { icon: TrendingUp, delay: "2.5s", top: "75%", left: "8%", scale: 0.85 },
    { icon: Target, delay: "3s", top: "40%", left: "5%", scale: 0.95 },
    { icon: Rocket, delay: "3.5s", top: "85%", right: "10%", scale: 1.05 },
  ];

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${
        darkMode ? "bg-gray-950" : "bg-white"
      }`}
    >
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600 rounded-full blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-purple-600 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-pink-600 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute top-2/3 left-1/3 w-[500px] h-[500px] bg-cyan-600 rounded-full blur-3xl opacity-15 animate-blob animation-delay-6000"></div>
      </div>

      {/* Parallax Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className="absolute animate-float-complex opacity-15"
            style={{
              top: element.top,
              left: element.left,
              right: element.right,
              animationDelay: element.delay,
              transform: `scale(${element.scale}) translate(${
                mousePosition.x * 0.02
              }px, ${mousePosition.y * 0.02}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <element.icon
              className={`w-14 h-14 ${
                darkMode ? "text-white" : "text-gray-600"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-30 sm:pt-30 pb-20">
        <div className="text-center mb-20 space-y-8">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-xl shadow-2xl animate-slide-down">
            <div className="relative">
              <Sparkles className="w-5 h-5 text-blue-500 animate-spin-slow" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-5 h-5 text-blue-500 opacity-75" />
              </div>
            </div>
            <span
              className={`text-sm font-bold tracking-wider ${
                darkMode ? "text-blue-300" : "text-blue-700"
              }`}
            >
              TRANSFORM YOUR LEARNING JOURNEY
            </span>
          </div>

          {/* Hero Heading with Stagger Animation */}
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              <span
                className={`block animate-slide-up ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Your Gateway to
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient animate-slide-up animation-delay-200">
                Smarter Learning
              </span>
            </h1>
          </div>

          {/* Subtitle with Typewriter Effect */}
          <p
            className={`text-xl sm:text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in-up animation-delay-400 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Join thousands of students in a{" "}
            <span className="relative inline-block">
              <span className="relative z-10 font-bold text-blue-600">
                revolutionary
              </span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-600/20 animate-expand-width"></span>
            </span>{" "}
            academic platform where collaboration meets excellence
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6 animate-fade-in-up animation-delay-600">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative px-6 py-3 rounded-full bg-gradient-to-r ${feature.color} transform hover:scale-110 transition-all duration-300 cursor-pointer animate-bounce-in`}
                style={{ animationDelay: feature.delay }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative flex items-center gap-2 text-white font-bold">
                  <feature.icon className="w-5 h-5 animate-pulse" />
                  <span className="text-sm">{feature.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-8 animate-scale-in animation-delay-800">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/select-department");
                } else {
                  document.getElementById("auth-modal-trigger")?.click();
                }
              }}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg sm:shadow-xl hover:shadow-purple-500/50 w-full sm:w-auto text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-2 sm:gap-3 justify-center">
                {isAuthenticated ? (
                  <>
                    Start Learning Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform" />
                  </>
                ) : (
                  <>
                    Join UNIBRO Free
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              </div>
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`group px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 border-2 w-full sm:w-auto text-center ${
                darkMode
                  ? "bg-gray-800/50 text-white border-gray-700 hover:bg-gray-800 hover:border-gray-600 backdrop-blur-xl"
                  : "bg-white/80 text-gray-900 border-gray-200 hover:border-gray-300 backdrop-blur-xl shadow-lg sm:shadow-xl"
              }`}
            >
              <span className="flex items-center gap-2 justify-center">
                Explore Features
                <Star className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
              </span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-10 animate-fade-in animation-delay-1000">
            {[
              {
                icon: CheckCircle,
                text: "Verified Resources",
                color: "text-green-500",
              },
              { icon: Shield, text: "Secure Platform", color: "text-blue-500" },
              { icon: Zap, text: "Instant Access", color: "text-yellow-500" },
            ].map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <badge.icon
                  className={`w-5 h-5 ${badge.color} group-hover:scale-125 transition-transform`}
                />
                <span
                  className={`text-sm font-semibold ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  } group-hover:text-gray-900 dark:group-hover:text-white transition-colors`}
                >
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="text-center animate-bounce-slow">
          <div
            className={`inline-flex flex-col items-center gap-3 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            <span className="text-sm font-bold tracking-widest uppercase">
              Discover More
            </span>
            <div className="relative w-8 h-12 rounded-full border-2 border-current flex items-start justify-center p-2">
              <div className="w-2 h-4 bg-current rounded-full animate-scroll-indicator"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
