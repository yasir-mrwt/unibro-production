import React, { useState, useEffect } from "react";
import { X, AlertCircle, Mail, Shield } from "lucide-react";
import { useTheme } from "./ThemeContext";
import "./styles/announcementBanner.css";

const AnnouncementBanner = ({ onVisibilityChange }) => {
  const { darkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  // Notify parent component when visibility changes
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isVisible);
    }
  }, [isVisible, onVisibilityChange]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-20 left-0 right-0 z-50 overflow-hidden ${
        darkMode
          ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      }`}
    >
      <div className="relative flex items-center h-10 sm:h-12">
        {/* Scrolling Text Container */}
        <div className="flex-1 overflow-hidden">
          <div className="scroll-animation flex whitespace-nowrap">
            {/* Duplicate the content for seamless loop */}
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-8"
              >
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                <span className="text-white text-xs sm:text-sm font-medium">
                  🚧 Working on Custom Domain
                </span>
                <span className="text-white/90 text-xs sm:text-sm">•</span>
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                <span className="text-white text-xs sm:text-sm font-medium">
                  For now verify Account by signing in with google (Recommended)
                </span>
                <span className="text-white/90 text-xs sm:text-sm">•</span>
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                <span className="text-white text-xs sm:text-sm font-medium">
                  Password Reset: Contact{" "}
                  <a
                    href="mailto:yasirmarwat09@gmail.com"
                    className="underline hover:text-yellow-300 transition-colors"
                  >
                    yasirmarwat09@gmail.com
                  </a>
                </span>
                <span className="text-white/90 text-xs sm:text-sm">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-2 sm:right-4 p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors group"
          aria-label="Close announcement"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-yellow-300 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
