import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  Award,
  Sparkles,
  Heart,
  Star,
  Zap,
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import { getStoredUser } from "../services/authService";
import "./styles/ctaSection.css";

const CTASection = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    setIsAuthenticated(!!user);
  }, []);

  const benefits = [
    {
      icon: CheckCircle,
      text: "Access 10,000+ verified resources",
      color: "text-green-500",
    },
    {
      icon: Users,
      text: "Connect with 200+ expert faculty",
      color: "text-blue-500",
    },
    {
      icon: BookOpen,
      text: "Collaborate with 5,000+ students",
      color: "text-purple-500",
    },
    {
      icon: Award,
      text: "Track your academic progress",
      color: "text-yellow-500",
    },
  ];

  const testimonials = [
    {
      text: "UNIBRO transformed how I study. Everything I need is in one place!",
      author: "Sarah Ahmed",
      role: "Computer Science, Semester 6",
      avatar: "🎓",
    },
    {
      text: "The real-time chat feature helped me collaborate better with my classmates.",
      author: "Ali Khan",
      role: "Electrical Engineering, Semester 4",
      avatar: "⚡",
    },
    {
      text: "Finding past papers and study materials has never been easier.",
      author: "Fatima Malik",
      role: "Industrial Engineering, Semester 8",
      avatar: "⚙️",
    },
  ];

  const floatingIcons = [
    { icon: Star, delay: "0s", top: "10%", left: "5%" },
    { icon: Sparkles, delay: "1s", top: "20%", right: "10%" },
    { icon: Heart, delay: "2s", bottom: "15%", left: "8%" },
    { icon: Zap, delay: "1.5s", bottom: "20%", right: "5%" },
  ];

  return (
    <div
      className={`relative py-20 sm:py-32 overflow-hidden ${
        darkMode ? "bg-gray-950" : "bg-white"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        {floatingIcons.map((element, index) => (
          <div
            key={index}
            className="absolute animate-float opacity-20"
            style={{
              top: element.top,
              bottom: element.bottom,
              left: element.left,
              right: element.right,
              animationDelay: element.delay,
            }}
          >
            <element.icon
              className={`w-8 h-8 ${darkMode ? "text-white" : "text-gray-600"}`}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials Section */}
        <div className="mb-20 animate-fade-in-up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 backdrop-blur-sm mb-4">
              <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
              <span
                className={`text-sm font-semibold ${
                  darkMode ? "text-pink-400" : "text-pink-600"
                }`}
              >
                Loved by Students
              </span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              What Students Say About{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                UNIBRO
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`group p-8 rounded-3xl transition-all duration-500 hover:scale-105 animate-fade-in-up ${
                  darkMode
                    ? "bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800"
                    : "bg-white border border-gray-200 shadow-xl"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Quote Mark */}
                <div className="text-6xl text-blue-600 opacity-20 mb-4">"</div>

                {/* Testimonial Text */}
                <p
                  className={`text-lg mb-6 leading-relaxed ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {testimonial.text}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p
                      className={`font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {testimonial.author}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <div
          className={`relative p-12 sm:p-16 rounded-3xl overflow-hidden animate-fade-in-up ${
            darkMode
              ? "bg-gradient-to-br from-blue-900 to-purple-900"
              : "bg-gradient-to-br from-blue-600 to-purple-600"
          }`}
          style={{ animationDelay: "0.3s" }}
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

          <div className="relative z-10 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <span className="text-sm font-semibold text-white">
                Join 5,000+ Students Today
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Ready to Transform Your
              <br />
              Learning Experience?
            </h2>

            {/* Description */}
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Join UNIBRO today and unlock access to thousands of resources,
              connect with expert faculty, and collaborate with peers in
              real-time.
            </p>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
                >
                  <benefit.icon
                    className={`w-5 h-5 ${benefit.color} flex-shrink-0`}
                  />
                  <span className="text-sm font-medium text-white text-left">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  navigate("/about");
                  window.scrollTo(0, 0);
                }}
                className="group px-8 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Learn more
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Free to Join</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">
                  No Credit Card Required
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Instant Access</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full opacity-5 translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
