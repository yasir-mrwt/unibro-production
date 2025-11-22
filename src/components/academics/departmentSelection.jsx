import React from "react";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Briefcase,
  Palette,
  Microscope,
  Building,
  Calculator,
  Home,
  Cpu,
  Zap,
  Settings,
  Factory,
  Atom,
  Wrench,
  Sprout,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

// Department Selection Component
const DepartmentSelection = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const departments = [
    {
      id: 1,
      name: "Computer Science",
      tagline: "Code the Future",
      icon: "computer",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Electrical Engineering",
      tagline: "Power the World",
      icon: "electrical",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      name: "Mechanical Engineering",
      tagline: "Build Tomorrow",
      icon: "mechanical",
      color: "from-orange-500 to-red-500",
    },
    {
      id: 4,
      name: "Industrial Engineering",
      tagline: "Optimize Systems",
      icon: "industrial",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: 5,
      name: "Mechatronics Engineering",
      tagline: "Integrate Technologies",
      icon: "mechatronics",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 6,
      name: "Agricultural Engineering",
      tagline: "Cultivate Innovation",
      icon: "agricultural",
      color: "from-indigo-500 to-blue-500",
    },
    {
      id: 7,
      name: "Chemical Engineering",
      tagline: "Transform Materials",
      icon: "chemical",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: 8,
      name: "Civil Engineering",
      tagline: "Build Infrastructure",
      icon: "civil",
      color: "from-teal-500 to-green-500",
    },
  ];

  const getIconComponent = (iconName) => {
    const iconProps = { className: "w-8 h-8" };
    switch (iconName) {
      case "computer":
        return <Cpu {...iconProps} />;
      case "electrical":
        return <Zap {...iconProps} />;
      case "mechanical":
        return <Settings {...iconProps} />;
      case "industrial":
        return <Factory {...iconProps} />;
      case "mechatronics":
        return <Wrench {...iconProps} />;
      case "agricultural":
        return <Sprout {...iconProps} />;
      case "chemical":
        return <Atom {...iconProps} />;
      case "civil":
        return <Building {...iconProps} />;
      default:
        return <BookOpen {...iconProps} />;
    }
  };

  const handleSelectDepartment = (department) => {
    // Only pass serializable data (no React elements)
    const departmentData = {
      id: department.id,
      name: department.name,
      tagline: department.tagline,
      icon: department.icon, // Pass icon name instead of JSX
      color: department.color,
    };

    navigate("/select-semester", { state: { department: departmentData } });
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-6 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Back to Home Button */}
        <button
          onClick={handleBackToHome}
          className={`group flex items-center gap-2 mb-8 px-4 py-2 rounded-lg font-medium transition-all ${
            darkMode
              ? "text-gray-300 hover:text-white hover:bg-gray-800"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
          }`}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 mb-6">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm font-medium">Step 1 of 2</span>
          </div>
          <h1
            className={`text-5xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Choose Your Department
          </h1>
          <p
            className={`text-xl ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Select your field of study to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => handleSelectDepartment(dept)}
              className={`group cursor-pointer p-8 rounded-2xl transition-all duration-300 hover:scale-105 flex flex-col h-full ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-750 border border-gray-700"
                  : "bg-white hover:shadow-2xl border border-gray-200"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg flex-shrink-0`}
              >
                {getIconComponent(dept.icon)}
              </div>

              {/* Department Name with consistent height */}
              <div className="min-h-[72px] mb-4 flex items-center">
                <h3
                  className={`text-2xl font-bold leading-tight ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {dept.name}
                </h3>
              </div>

              {/* Tagline with consistent height */}
              <div className="min-h-[48px] mb-6 flex items-center">
                <p
                  className={`leading-relaxed ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {dept.tagline}
                </p>
              </div>

              {/* Button at consistent position */}
              <div className="mt-auto">
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                  Select Department
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentSelection;
