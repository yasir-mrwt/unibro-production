import React from "react";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeContext";

// Semester Selection Component
const SemesterSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  const department = location.state?.department;

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleSelectSemester = (semester) => {
    navigate("/dashboard", {
      state: {
        department: department,
        semester: semester,
      },
    });
  };

  const handleBack = () => {
    navigate("/select-department");
  };

  if (!department) {
    return (
      <div
        className={`min-h-screen pt-24 pb-20 px-6 flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            No department selected
          </h2>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-6 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBack}
          className={`group flex items-center gap-2 mb-8 px-4 py-2 rounded-lg font-medium transition-all ${
            darkMode
              ? "text-gray-300 hover:text-white hover:bg-gray-800"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
          }`}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Departments</span>
        </button>

        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 mb-6">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm font-medium">Step 2 of 2</span>
          </div>
          <h1
            className={`text-4xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            You're currently viewing:{" "}
            <span className="text-blue-600">{department.name}</span>
          </h1>
          <p
            className={`text-xl ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Select your Semester
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {semesters.map((semester) => (
            <div
              key={semester}
              onClick={() => handleSelectSemester(semester)}
              className={`group cursor-pointer p-8 rounded-2xl transition-all duration-300 hover:scale-105 text-center ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-750 border border-gray-700"
                  : "bg-white hover:shadow-2xl border border-gray-200"
              }`}
            >
              <div className="text-6xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-transparent bg-clip-text mb-4 group-hover:scale-110 transition-transform">
                {semester}
              </div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Semester {semester}
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Click to view resources
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SemesterSelection;
