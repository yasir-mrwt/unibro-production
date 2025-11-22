import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Download,
  MessageCircle,
  Shield,
  Users,
  Layers,
  Lock,
  Zap,
  CheckCircle,
  Sparkles,
  Star,
  TrendingUp,
  Award,
  Target,
  Heart,
  Rocket,
  Globe,
  Code,
  BookOpen,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import "../styles/aboutPage.css";

const AboutPage = () => {
  const { darkMode } = useTheme();
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });
  }, []);

  const features = [
    {
      icon: Upload,
      title: "Upload Resources",
      description:
        "Students can easily upload academic resources like quizzes, assignments, and presentations for sharing.",
      gradient: "from-blue-500 to-cyan-500",
      animation: "slide-left",
    },
    {
      icon: Download,
      title: "Access Materials",
      description:
        "Download and view shared materials from your department, all organized in one place.",
      gradient: "from-purple-500 to-pink-500",
      animation: "slide-right",
    },
    {
      icon: MessageCircle,
      title: "Real-Time Communication",
      description:
        "Engage in real-time chat with mentors and peers for instant academic support and guidance.",
      gradient: "from-green-500 to-emerald-500",
      animation: "slide-left",
    },
    {
      icon: Shield,
      title: "Admin Oversight",
      description:
        "Admins approve accounts and monitor content to ensure authenticity and quality.",
      gradient: "from-orange-500 to-red-500",
      animation: "slide-right",
    },
    {
      icon: Users,
      title: "Mentor Guidance",
      description:
        "Mentors provide guidance through integrated discussion interfaces for personalized learning.",
      gradient: "from-indigo-500 to-purple-500",
      animation: "slide-left",
    },
    {
      icon: Layers,
      title: "Department Organization",
      description:
        "Resources are categorized department-wise for easy navigation and organized access.",
      gradient: "from-pink-500 to-rose-500",
      animation: "slide-right",
    },
  ];

  const systemFeatures = [
    {
      icon: Lock,
      title: "Secure Authentication",
      description:
        "Token-based authentication with encryption ensures your data is protected.",
      color: "blue",
    },
    {
      icon: Zap,
      title: "Scalable Architecture",
      description:
        "Built with modular design to handle multiple departments and growing user base.",
      color: "purple",
    },
    {
      icon: CheckCircle,
      title: "Responsive Design",
      description:
        "User-friendly interface that works seamlessly across all devices and browsers.",
      color: "pink",
    },
  ];

  const stats = [
    { icon: Users, value: "5,000+", label: "Active Students", color: "blue" },
    { icon: BookOpen, value: "10,000+", label: "Resources", color: "purple" },
    { icon: MessageCircle, value: "50,000+", label: "Messages", color: "pink" },
    { icon: Award, value: "200+", label: "Faculty Members", color: "yellow" },
  ];

  const principles = [
    {
      title: "Accessibility",
      desc: "Resources available anytime, anywhere, on any device",
      icon: Globe,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Collaboration",
      desc: "Fostering meaningful connections between students and mentors",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Organization",
      desc: "Department-wise categorization for effortless navigation",
      icon: Layers,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Security",
      desc: "Protecting user data with industry-standard encryption",
      icon: Shield,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Scalability",
      desc: "Growing with your institution's expanding needs",
      icon: TrendingUp,
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      title: "Quality",
      desc: "Maintaining high standards through admin oversight",
      icon: Award,
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const floatingElements = [
    { icon: Star, delay: "0s", top: "5%", left: "3%" },
    { icon: Sparkles, delay: "0.5s", top: "10%", right: "5%" },
    { icon: Heart, delay: "1s", top: "25%", left: "8%" },
    { icon: Zap, delay: "1.5s", top: "40%", right: "7%" },
    { icon: Target, delay: "2s", top: "60%", left: "5%" },
    { icon: Rocket, delay: "2.5s", top: "75%", right: "6%" },
  ];

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        darkMode ? "bg-gray-950" : "bg-white"
      }`}
    >
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/4 w-[600px] h-[600px] bg-pink-600 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-cyan-600 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className="absolute animate-float-diagonal opacity-10"
            style={{
              top: element.top,
              left: element.left,
              right: element.right,
              animationDelay: element.delay,
            }}
          >
            <element.icon
              className={`w-10 h-10 ${
                darkMode ? "text-white" : "text-gray-600"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 pt-30 sm:pt-32 ">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center space-y-8 animate-fade-in-up">
            {/* Badge */}
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
                TRANSFORMING EDUCATION
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                <span
                  className={`block animate-slide-up ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  About
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient animate-slide-up animation-delay-200">
                  UNIBRO
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className={`text-xl sm:text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in-up animation-delay-400 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              A comprehensive academic resource platform designed to bridge the
              gap between students, mentors, and administrators through{" "}
              <span className="relative inline-block">
                <span className="relative z-10 font-bold text-blue-600">
                  seamless collaboration
                </span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-600/20 animate-expand-width"></span>
              </span>{" "}
              and{" "}
              <span className="relative inline-block">
                <span className="relative z-10 font-bold text-purple-600">
                  organized knowledge sharing
                </span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-purple-600/20 animate-expand-width"></span>
              </span>
            </p>

            {/* Stats Grid - Animated */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto pt-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group relative p-6 rounded-3xl transition-all duration-500 cursor-pointer animate-scale-in ${
                    darkMode
                      ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800"
                      : "bg-white border border-gray-200 shadow-2xl"
                  } hover:scale-110 hover:rotate-3`}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="relative z-10 text-center">
                    <div
                      className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-125 group-hover:rotate-12 ${
                        stat.color === "blue"
                          ? "bg-blue-500/10"
                          : stat.color === "purple"
                          ? "bg-purple-500/10"
                          : stat.color === "pink"
                          ? "bg-pink-500/10"
                          : "bg-yellow-500/10"
                      }`}
                    >
                      <stat.icon
                        className={`w-7 h-7 ${
                          stat.color === "blue"
                            ? "text-blue-500"
                            : stat.color === "purple"
                            ? "text-purple-500"
                            : stat.color === "pink"
                            ? "text-pink-500"
                            : "text-yellow-500"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-3xl font-black mb-1 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {stat.label}
                    </p>
                  </div>
                  {/* Shimmer */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div
          id="mission"
          data-animate
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-15 ${
            isVisible.mission ? "animate-zoom-in" : "opacity-0"
          }`}
        >
          <div
            className={`p-12 sm:p-16 rounded-3xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800"
                : "bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100"
            }`}
          >
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/3">
                <div
                  className={`w-32 h-32 mx-auto lg:mx-0 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl animate-bounce-slow`}
                >
                  <Target className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="lg:w-2/3 text-center lg:text-left">
                <h2
                  className={`text-4xl sm:text-5xl font-black mb-6 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Our Mission
                </h2>
                <p
                  className={`text-xl leading-relaxed ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  UNIBRO empowers students with{" "}
                  <span className="font-bold text-blue-600">
                    easy access to academic resources
                  </span>{" "}
                  while fostering meaningful connections between learners and
                  mentors. We believe in creating a{" "}
                  <span className="font-bold text-purple-600">
                    secure, organized, and collaborative
                  </span>{" "}
                  educational ecosystem where knowledge flows freely and every
                  student thrives.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Features Section */}
        <div
          id="features"
          data-animate
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
        >
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm mb-4">
              <Star className="w-4 h-4 text-purple-500 animate-pulse" />
              <span
                className={`text-sm font-semibold ${
                  darkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                Powerful Features
              </span>
            </div>
            <h2
              className={`text-4xl sm:text-5xl font-black mb-6 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl transition-all duration-500 cursor-pointer ${
                  isVisible.features
                    ? `animate-${feature.animation}`
                    : "opacity-0"
                } ${
                  darkMode
                    ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800"
                    : "bg-white border border-gray-200 shadow-2xl"
                } hover:scale-105 hover:-rotate-2`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${feature.gradient} opacity-5`}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 group-hover:rotate-12`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-xl font-bold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm leading-relaxed ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Corner Accent */}
                <div
                  className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-3xl rounded-tr-3xl group-hover:w-24 group-hover:h-24 transition-all`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* System Features Section */}
        <div
          id="tech"
          data-animate
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 ${
            isVisible.tech ? "animate-bounce-in" : "opacity-0"
          }`}
        >
          <div
            className={`p-12 sm:p-16 rounded-3xl ${
              darkMode
                ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800"
                : "bg-white shadow-2xl border border-gray-200"
            }`}
          >
            <div className="text-center mb-12">
              <h2
                className={`text-4xl sm:text-5xl font-black mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Built for{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h2>
              <p
                className={`text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Enterprise-grade technology powering your education
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {systemFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`group text-center p-8 rounded-2xl transition-all duration-500 hover:scale-110 ${
                    darkMode
                      ? "bg-gray-800/50 hover:bg-gray-800"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-125 group-hover:rotate-12 ${
                      feature.color === "blue"
                        ? "bg-blue-500/10"
                        : feature.color === "purple"
                        ? "bg-purple-500/10"
                        : "bg-pink-500/10"
                    }`}
                  >
                    <feature.icon
                      className={`w-8 h-8 ${
                        feature.color === "blue"
                          ? "text-blue-500"
                          : feature.color === "purple"
                          ? "text-purple-500"
                          : "text-pink-500"
                      }`}
                    />
                  </div>
                  <h4
                    className={`text-lg font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {feature.title}
                  </h4>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Who Uses Section */}
        <div
          id="users"
          data-animate
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 ${
            isVisible.users ? "animate-fade-in-up" : "opacity-0"
          }`}
        >
          <div className="text-center mb-16">
            <h2
              className={`text-4xl sm:text-5xl font-black mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Who Uses UNIBRO?
            </h2>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Designed for every member of the academic community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: "🎓",
                title: "Students",
                desc: "Upload, download, and access academic materials. Connect with mentors and collaborate with peers in real-time.",
                gradient: "from-blue-900 to-blue-800",
                lightGradient: "from-blue-100 to-blue-50",
                textColor: "text-blue-200",
                lightTextColor: "text-gray-700",
              },
              {
                emoji: "👨‍🏫",
                title: "Mentors",
                desc: "Guide students through discussions, provide feedback, and moderate academic content to maintain quality.",
                gradient: "from-purple-900 to-purple-800",
                lightGradient: "from-purple-100 to-purple-50",
                textColor: "text-purple-200",
                lightTextColor: "text-gray-700",
              },
              {
                emoji: "🛡️",
                title: "Administrators",
                desc: "Approve user accounts, monitor content authenticity, and ensure platform integrity across departments.",
                gradient: "from-pink-900 to-pink-800",
                lightGradient: "from-pink-100 to-pink-50",
                textColor: "text-pink-200",
                lightTextColor: "text-gray-700",
              },
            ].map((user, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl transition-all duration-500 cursor-pointer overflow-hidden ${
                  darkMode
                    ? `bg-gradient-to-br ${user.gradient}`
                    : `bg-gradient-to-br ${user.lightGradient}`
                } hover:scale-105 hover:rotate-2 animate-slide-up`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div
                  className="text-6xl mb-4 animate-bounce-slow"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  {user.emoji}
                </div>
                <h3
                  className={`text-2xl font-bold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.title}
                </h3>
                <p className={darkMode ? user.textColor : user.lightTextColor}>
                  {user.desc}
                </p>

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Principles Section */}
        <div
          id="principles"
          data-animate
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 ${
            isVisible.principles ? "animate-fade-in" : "opacity-0"
          }`}
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-sm mb-4">
              <Award className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span
                className={`text-sm font-semibold ${
                  darkMode ? "text-yellow-400" : "text-yellow-600"
                }`}
              >
                Our Foundation
              </span>
            </div>
            <h2
              className={`text-4xl sm:text-5xl font-black mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Core Principles
            </h2>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Values that drive everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl transition-all duration-500 cursor-pointer animate-flip-in ${
                  darkMode
                    ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800"
                    : "bg-white border border-gray-200 shadow-xl"
                } hover:scale-105`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br ${principle.gradient} flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 group-hover:rotate-12`}
                >
                  <principle.icon className="w-7 h-7 text-white" />
                </div>
                <h4
                  className={`text-xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {principle.title}
                </h4>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {principle.desc}
                </p>

                {/* Number Badge */}
                <div
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br ${principle.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Section */}
        <div
          id="vision"
          data-animate
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 ${
            isVisible.vision ? "animate-scale-in" : "opacity-0"
          }`}
        >
          <div
            className={`relative p-16 sm:p-20 rounded-3xl text-center overflow-hidden ${
              darkMode
                ? "bg-gradient-to-r from-purple-900 to-indigo-900"
                : "bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center animate-pulse">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Our Vision
              </h2>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                To create a unified academic ecosystem where knowledge flows
                freely, collaboration thrives, and every student has access to
                the resources and mentorship they need to excel in their
                educational journey.
              </p>
            </div>

            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full opacity-10 animate-bounce-slow"></div>
            <div
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-white rounded-full opacity-10 animate-bounce-slow"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        {/* Team Section - Creative Alternative to CTA */}
        <div
          id="team"
          data-animate
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 ${
            isVisible.team ? "animate-slide-up" : "opacity-0"
          }`}
        >
          <div
            className={`relative p-16 rounded-3xl overflow-hidden ${
              darkMode
                ? "bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
                : "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
            }`}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0 animate-pulse-slow"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
                }}
              ></div>
            </div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
                <Code className="w-5 h-5 text-white animate-pulse" />
                <span className="text-sm font-bold text-white tracking-wider">
                  BUILT BY STUDENTS, FOR STUDENTS
                </span>
              </div>

              <h2 className="text-5xl sm:text-6xl font-black text-white mb-6">
                The Future of Education
                <br />
                Starts Here
              </h2>

              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
                UNIBRO is continuously evolving with cutting-edge features,
                innovative tools, and a dedicated team committed to your
                academic success
              </p>

              <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    icon: Target,
                    title: "Student-Centric",
                    desc: "Built with student needs at the core",
                  },
                  {
                    icon: Zap,
                    title: "Always Innovating",
                    desc: "New features added regularly",
                  },
                  {
                    icon: Heart,
                    title: "Community Driven",
                    desc: "Powered by user feedback",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:scale-105 transition-all"
                  >
                    <item.icon
                      className="w-10 h-10 text-white mx-auto mb-4 animate-bounce-slow"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    />
                    <h4 className="text-lg font-bold text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-white/80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
