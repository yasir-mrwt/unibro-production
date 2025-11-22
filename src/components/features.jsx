import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  MessageSquare,
  Clock,
  TrendingUp,
  Video,
  ArrowRight,
  Sparkles,
  Star,
  Zap,
  Shield,
  Heart,
  Rocket,
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import "./styles/features.css";

const FeaturesSection = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const mainFeatures = [
    {
      icon: BookOpen,
      title: "Study Materials",
      description:
        "Access thousands of verified resources, notes, assignments, and past papers organized by department and semester",
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      bgGradient: "from-blue-500/5 to-cyan-500/5",
      onClick: () => navigate("/select-department"),
      stats: { count: "10,000+", label: "Resources" },
    },
    {
      icon: Users,
      title: "Teachers Directory",
      description:
        "Connect with expert faculty members, view their profiles, office hours, and schedule consultations",
      gradient: "from-purple-500 via-purple-600 to-pink-500",
      bgGradient: "from-purple-500/5 to-pink-500/5",
      onClick: () => navigate("/staff"),
      stats: { count: "200+", label: "Faculty" },
    },
    {
      icon: MessageSquare,
      title: "Group Chat",
      description:
        "Collaborate in real-time with your classmates through department and semester-specific chat rooms",
      gradient: "from-green-500 via-emerald-600 to-teal-500",
      bgGradient: "from-green-500/5 to-teal-500/5",
      onClick: () => navigate("/select-department"),
      stats: { count: "50,000+", label: "Messages" },
    },
  ];

  const upcomingFeatures = [
    {
      icon: Video,
      title: "Live Classes",
      description:
        "Interactive virtual classrooms with screen sharing and recording",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: MessageSquare,
      title: "Direct Messaging",
      description: "Private one-on-one conversations with peers and mentors",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your academic performance and learning milestones",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div
      id="features"
      className={`relative py-32 overflow-hidden ${
        darkMode ? "bg-gray-950" : "bg-white"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          id="features-header"
          data-animate
          className={`text-center mb-20 ${
            isVisible["features-header"] ? "animate-zoom-in" : "opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-xl mb-6 animate-bounce-in">
            <Star className="w-5 h-5 text-purple-500 animate-spin-slow" />
            <span
              className={`text-sm font-bold tracking-wider ${
                darkMode ? "text-purple-300" : "text-purple-700"
              }`}
            >
              POWERFUL FEATURES
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
            <span
              className={`block mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Everything You Need
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              In One Place
            </span>
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto leading-relaxed ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Discover powerful tools designed to transform your learning
            experience
          </p>
        </div>

        {/* Main Features - Interactive Cards */}
        <div
          id="main-features"
          data-animate
          className={`mb-32 ${isVisible["main-features"] ? "" : "opacity-0"}`}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                onClick={feature.onClick}
                onMouseEnter={() => setActiveFeature(index)}
                className={`group relative cursor-pointer ${
                  isVisible["main-features"] ? "animate-flip-in" : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Card */}
                <div
                  className={`relative h-full p-8 rounded-3xl transition-all duration-500 ${
                    darkMode
                      ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800"
                      : "bg-white border border-gray-200 shadow-2xl"
                  } ${
                    activeFeature === index
                      ? "scale-105 -translate-y-2"
                      : "hover:scale-105"
                  }`}
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon with Animated Border */}
                    <div className="relative w-20 h-20 mb-6">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity`}
                      ></div>
                      <div
                        className={`relative w-full h-full bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}
                      >
                        <feature.icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-2xl font-bold mb-4 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-sm leading-relaxed mb-6 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {feature.description}
                    </p>

                    {/* Stats */}
                    <div
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        darkMode ? "bg-gray-800/50" : "bg-gray-50"
                      }`}
                    >
                      <div>
                        <p
                          className={`text-3xl font-black ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {feature.stats.count}
                        </p>
                        <p
                          className={`text-xs font-medium ${
                            darkMode ? "text-gray-500" : "text-gray-600"
                          }`}
                        >
                          {feature.stats.label}
                        </p>
                      </div>
                      <ArrowRight
                        className={`w-6 h-6 transform group-hover:translate-x-2 transition-transform ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div
          id="upcoming"
          data-animate
          className={`${
            isVisible["upcoming"] ? "animate-slide-up" : "opacity-0"
          }`}
        >
          <div
            className={`relative p-12 rounded-3xl overflow-hidden ${
              darkMode
                ? "bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/20"
                : "bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200"
            }`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-xl mb-6">
                  <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />
                  <span
                    className={`text-sm font-bold ${
                      darkMode ? "text-yellow-300" : "text-yellow-700"
                    }`}
                  >
                    COMING SOON
                  </span>
                </div>
                <h3
                  className={`text-4xl font-black mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  The Future is Bright
                </h3>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  We're constantly innovating to bring you cutting-edge features
                </p>
              </div>

              {/* Upcoming Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {upcomingFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`group relative p-6 rounded-2xl transition-all duration-500 hover:scale-105 ${
                      darkMode
                        ? "bg-gray-800/30 border border-gray-700/50"
                        : "bg-white/50 border border-gray-200"
                    }`}
                  >
                    {/* Soon Badge */}
                    <div className="absolute -top-3 -right-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500 rounded-full blur-md animate-pulse"></div>
                        <span className="relative px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-black rounded-full shadow-lg">
                          SOON
                        </span>
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-60 flex items-center justify-center group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
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

              {/* Notice */}
              <div
                className={`text-center p-4 rounded-xl ${
                  darkMode ? "bg-gray-800/20" : "bg-white/30"
                } backdrop-blur-sm`}
              >
                <p
                  className={`text-sm flex items-center justify-center gap-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <Rocket className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">
                    These features are in active development and will launch
                    soon!
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div
          id="why-choose"
          data-animate
          className={`mt-32 text-center ${
            isVisible["why-choose"] ? "animate-fade-in" : "opacity-0"
          }`}
        >
          <h3
            className={`text-4xl font-black mb-12 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Why Students{" "}
            <span className="relative inline-block">
              <Heart className="inline w-10 h-10 text-red-500 animate-pulse" />
            </span>{" "}
            UNIBRO
          </h3>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Sparkles,
                text: "Intuitive Interface",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Zap,
                text: "Lightning Fast",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: Shield,
                text: "Secure & Reliable",
                color: "from-green-500 to-emerald-500",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl transition-all duration-500 hover:scale-110 hover:-rotate-3 cursor-pointer ${
                  darkMode
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "bg-gray-50 hover:bg-white shadow-lg"
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <p
                  className={`font-bold text-lg ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
