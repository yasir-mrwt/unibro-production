import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  ClipboardList,
  Presentation,
  FolderOpen,
  BookMarked,
  TrendingUp,
  Target,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import ChatPanel from "../chat/ChatPanel";
import ChatIcon from "../chat/ChatIcon";
import ChatModal from "../chat/ChatModal";

// Premium Resource Card Component
const ResourceCard = ({ icon, title, count, color, darkMode, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer ${
        darkMode
          ? "bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-750 hover:to-gray-850"
          : "bg-white hover:shadow-2xl"
      } border ${
        darkMode ? "border-gray-700/50" : "border-gray-200"
      } hover:scale-[1.02]`}
    >
      {/* Animated gradient background on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      ></div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:shadow-xl transition-shadow`}
          >
            {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
          </div>
          <ChevronRight
            className={`w-5 h-5 ${
              darkMode ? "text-gray-600" : "text-gray-400"
            } group-hover:translate-x-1 transition-transform`}
          />
        </div>

        <h3
          className={`text-lg font-semibold mb-1 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-3xl font-bold bg-gradient-to-br ${color} bg-clip-text text-transparent`}
          >
            {count}
          </span>
          <span
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            items
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`h-1 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity`}
      ></div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color, darkMode }) => {
  return (
    <div
      className={`p-5 rounded-xl border transition-all hover:scale-[1.02] ${
        darkMode
          ? "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800"
          : "bg-white border-gray-200 hover:shadow-lg"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
        </div>
        <div>
          <p
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </p>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  const [dashboardData, setDashboardData] = useState({
    department: null,
    semester: null,
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("dashboardData");
    if (savedData) {
      setDashboardData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const { department, semester } = location.state || {};
    if (department && semester) {
      const newData = { department, semester };
      setDashboardData(newData);
      localStorage.setItem("dashboardData", JSON.stringify(newData));
    }
  }, [location.state]);

  const { department, semester } = dashboardData;

  const handleBack = () => {
    navigate("/select-semester", { state: { department } });
  };

  const handleStartOver = () => {
    localStorage.removeItem("dashboardData");
    navigate("/select-department");
  };

  const handleResourceClick = (resourceType) => {
    navigate("/resource-details", {
      state: {
        resourceType,
        department: department,
        semester: semester,
      },
    });
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const resources = [
    {
      icon: <ClipboardList />,
      title: "Assignments",
      count: 12,
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FileText />,
      title: "Quizzes",
      count: 8,
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Presentation />,
      title: "Presentations",
      count: 5,
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <FolderOpen />,
      title: "Projects",
      count: 3,
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <BookOpen />,
      title: "Notes",
      count: 45,
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <BookMarked />,
      title: "Past Papers",
      count: 15,
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div
      className={`min-h-screen relative ${
        darkMode ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl opacity-20 ${
            darkMode ? "bg-blue-600" : "bg-blue-400"
          } animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20 ${
            darkMode ? "bg-purple-600" : "bg-purple-400"
          } animate-pulse`}
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16 sm:pb-20">
        {/* Premium Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <button
            onClick={handleBack}
            className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
              darkMode
                ? "text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800"
                : "text-gray-700 hover:text-gray-900 hover:bg-white border border-gray-200 shadow-sm hover:shadow"
            }`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden xs:inline">Back to Semester</span>
            <span className="xs:hidden">Back</span>
          </button>

          <button
            onClick={handleStartOver}
            className={`px-4 py-2.5 rounded-xl font-medium transition-all ${
              darkMode
                ? "text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700"
                : "text-gray-700 hover:text-gray-900 hover:bg-white border border-gray-200 shadow-sm hover:shadow"
            }`}
          >
            Change Department
          </button>
        </div>

        {department && semester ? (
          <>
            {/* Hero Section with Gradient */}
            <div className="mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                <h1
                  className={`text-3xl sm:text-4xl lg:text-5xl font-black ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {department?.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Semester {semester}
                  </span>
                </div>
              </div>
              <p
                className={`text-base sm:text-lg ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Welcome back! Here's your academic overview
              </p>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Resources Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={`text-xl sm:text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Learning Resources
                  </h2>
                  <span
                    className={`text-sm px-3 py-1.5 rounded-full ${
                      darkMode
                        ? "bg-gray-800 text-gray-400"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {resources.reduce((acc, r) => acc + r.count, 0)} total
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  {resources.map((resource, index) => (
                    <ResourceCard
                      key={index}
                      icon={resource.icon}
                      title={resource.title}
                      count={resource.count}
                      color={resource.color}
                      darkMode={darkMode}
                      onClick={() => handleResourceClick(resource.title)}
                    />
                  ))}
                </div>
              </div>

              {/* Chat Panel - Desktop */}
              <div className="lg:col-span-1 hidden lg:block">
                <div className="sticky top-24">
                  <ChatPanel
                    darkMode={darkMode}
                    department={department}
                    semester={semester}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`flex flex-col items-center justify-center py-20 sm:py-32 rounded-3xl ${
              darkMode
                ? "bg-gray-800/30 border border-gray-700/50"
                : "bg-white border border-gray-200 shadow-xl"
            }`}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-2xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h2
              className={`text-2xl sm:text-3xl font-bold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No Department Selected
            </h2>
            <p
              className={`text-base sm:text-lg mb-8 text-center max-w-md ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Choose your department and semester to access your personalized
              learning dashboard
            </p>
            <button
              onClick={handleStartOver}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Chat */}
      {department && semester && (
        <>
          <ChatIcon
            onClick={handleOpenChat}
            department={department}
            semester={semester}
            darkMode={darkMode}
          />
          <ChatModal
            isOpen={isChatOpen}
            onClose={handleCloseChat}
            department={department}
            semester={semester}
            darkMode={darkMode}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
