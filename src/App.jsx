import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import Navbar from "./components/navbar";
import HeroSection from "./components/heroSection";
import CTASection from "./components/ctaSection";
import FeaturesSection from "./components/features";
import DepartmentSelection from "./components/academics/departmentSelection";
import SemesterSelection from "./components/academics/semesterSelection";
import Dashboard from "./components/academics/dashboard";
import ResourceDetails from "./components/academics/resourceDetails";
import UploadModal from "./components/academics/uploadModel";
import AboutPage from "./components/navbarLinks/aboutPage";
import StaffDirectory from "./components/navbarLinks/StaffDirectory";
import CommunityGuidelines from "./components/navbarLinks/communityPage";
import AnnouncementBanner from "./components/AnnouncementBanner";

// Import authentication pages
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ProfileSettings from "./pages/profileSettings";
import MyPosts from "./pages/MyPosts";
import AdminDashboard from "./pages/AdminDashboard";

// Import Google OAuth callback pages
import AuthSuccess from "./pages/AuthSuccess";
import AuthError from "./pages/AuthError";

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </>
  );
};

const App = () => {
  // ✅ State to track if announcement banner is visible
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  // Handler to update navbar when user logs in via OAuth
  const handleOAuthLoginSuccess = (user) => {
    window.dispatchEvent(
      new CustomEvent("userLoggedIn", {
        detail: user,
      })
    );
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
          {/* ✅ Announcement Banner */}
          <AnnouncementBanner onVisibilityChange={setIsBannerVisible} />

          {/* ✅ Conditionally apply padding based on banner visibility */}
          <div
            className={`transition-all duration-300 ${
              isBannerVisible ? "pt-10 sm:pt-12" : "pt-0"
            }`}
          >
            <Navbar />
          </div>

          <Routes>
            {/* Landing & Academic Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/select-department"
              element={<DepartmentSelection />}
            />
            <Route path="/select-semester" element={<SemesterSelection />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resource-details" element={<ResourceDetails />} />
            <Route path="/upload-modal" element={<UploadModal />} />

            {/* Navbar Links */}
            <Route path="/community" element={<CommunityGuidelines />} />
            <Route path="/staff" element={<StaffDirectory />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Authentication Routes */}
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />

            {/* Google OAuth Callback Routes */}
            <Route
              path="/auth/success"
              element={<AuthSuccess onLoginSuccess={handleOAuthLoginSuccess} />}
            />
            <Route path="/auth/error" element={<AuthError />} />

            {/* Resource Management Routes */}
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
