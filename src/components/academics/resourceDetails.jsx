import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Download,
  Calendar,
  User,
  BookOpen,
  Eye,
  X,
  FileText,
  Clock,
  Users as UsersIcon,
  Loader,
  FolderOpen,
  ExternalLink,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import {
  getResources,
  incrementDownload,
  incrementView,
} from "../../services/resourceService";
import { getStoredUser, isAuthenticated } from "../../services/authService";
import {
  getDownloadUrl,
  getPreviewUrl,
  downloadFile,
} from "../../services/supabaseStorage";

const ResourceDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedResource, setSelectedResource] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [resources, setResources] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get data from navigation state or localStorage
  const resourceType =
    location.state?.resourceType ||
    localStorage.getItem("currentResourceType") ||
    "Resources";

  const department =
    location.state?.department ||
    JSON.parse(localStorage.getItem("dashboardData"))?.department;

  const semester =
    location.state?.semester ||
    JSON.parse(localStorage.getItem("dashboardData"))?.semester;

  // Save current resource type
  useEffect(() => {
    if (resourceType) {
      localStorage.setItem("currentResourceType", resourceType);
    }
  }, [resourceType]);

  // Fetch resources from database - UPDATED with department filtering
  useEffect(() => {
    fetchResources();
  }, [resourceType, selectedYear]);

  const fetchResources = async () => {
    setLoading(true);
    setError("");
    try {
      // Get department name from department object
      const departmentName = department?.name || department || "General";

      const filters = {
        resourceType: resourceType, // Specific resource type (Assignments, Quizzes, etc.)
        department: departmentName, // Specific department (Computer Science, Business, etc.)
        search: searchTerm,
      };

      if (selectedYear !== "All") {
        filters.year = selectedYear;
      }

      const data = await getResources(filters);
      setResources(data.resources || {});
    } catch (err) {
      setError(err.message);
      console.error("Error fetching resources:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    fetchResources();
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    if (showViewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showViewModal]);

  const handleBack = () => {
    navigate("/dashboard", { state: { department, semester } });
  };

  const handleUploadClick = () => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      alert("Please login to upload resources");
      return;
    }

    // Check if user is verified
    const user = getStoredUser();
    if (!user?.isVerified) {
      alert(
        "Please verify your email before uploading resources. Check your inbox for verification link."
      );
      return;
    }

    // Validate that we have department and semester
    if (!department) {
      alert("Please select a department first");
      navigate("/select-department");
      return;
    }

    if (!semester) {
      alert("Please select a semester first");
      navigate("/select-semester", { state: { department } });
      return;
    }

    // Navigate to upload modal with all required data
    navigate("/upload-modal", {
      state: {
        resourceType: resourceType || "Resource",
        department: department.name || department, // Handle both object and string
        semester: semester, // Remove the "N/A" fallback since we validated it exists
      },
    });
  };

  const handleMyPostsClick = () => {
    if (!isAuthenticated()) {
      alert("Please login to view your posts");
      return;
    }
    navigate("/my-posts", { state: { resourceType, department } });
  };

  const handleDownload = async (item) => {
    try {
      setDownloadingId(item._id);

      // Increment download count first
      await incrementDownload(item._id);

      // Use the downloadFile function from supabaseStorage
      const result = await downloadFile(
        item.fileUrl,
        item.fileName || `${item.title}.pdf`
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to download file");
      }

      // Refresh to show updated count
      fetchResources();
    } catch (error) {
      console.error("Download error:", error);
      setError("Failed to download file. Please try again.");

      // Fallback: Try direct download approach
      try {
        const downloadUrl = getDownloadUrl(item.fileUrl);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = item.fileName || `${item.title}.pdf`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // If we reach here, fallback worked
        setError("");
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError);
        setError("Failed to download file. Please try again later.");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const handleView = async (item) => {
    try {
      // Increment view count
      await incrementView(item._id);
      setSelectedResource(item);
      setShowViewModal(true);
      setIsFullscreen(false); // Reset fullscreen state
      fetchResources(); // Refresh to show updated view count
    } catch (error) {
      console.error("View error:", error);
      setSelectedResource(item);
      setShowViewModal(true);
      setIsFullscreen(false);
    }
  };

  const handleOpenPreview = (fileUrl) => {
    // Open PDF in new tab for preview using the preview URL
    const previewUrl = getPreviewUrl(fileUrl);
    window.open(previewUrl, "_blank");
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedResource(null);
    setIsFullscreen(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          handleCloseModal();
        }
      }
    };

    if (showViewModal) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showViewModal, isFullscreen]);

  // Get available years from resources
  const years = ["All", ...Object.keys(resources).sort((a, b) => b - a)];

  return (
    <div
      className={`min-h-screen pt-24 pb-20 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <button
            onClick={handleBack}
            className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              darkMode
                ? "text-gray-300 hover:text-white hover:bg-gray-800"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
            }`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex flex-wrap gap-3">
            {isAuthenticated() && (
              <button
                onClick={handleMyPostsClick}
                className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm sm:text-base"
              >
                <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>My Posts</span>
              </button>
            )}
            <button
              onClick={handleUploadClick}
              className="flex items-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm sm:text-base"
            >
              <span>Upload {resourceType}</span>
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {resourceType}
          </h1>
          <p
            className={`text-sm sm:text-lg ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {department?.name || department} -{" "}
            {semester && `Semester ${semester} - `}
            Browse and download {resourceType.toLowerCase()}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div
          className={`p-4 sm:p-6 rounded-2xl mb-8 ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search by course name, title, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className={`w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg outline-none transition-all text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-750 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <span
                className={`font-medium text-sm sm:text-base ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Filter by Year:
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg outline-none transition-all text-sm sm:text-base w-full sm:w-auto ${
                  darkMode
                    ? "bg-gray-750 text-white border border-gray-600"
                    : "bg-gray-100 text-gray-900 border border-gray-300"
                }`}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all text-sm sm:text-base w-full sm:w-auto"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 sm:p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-8">
            <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">
              {error}
            </p>
            <button
              onClick={() => setError("")}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Resources List */}
        {!loading && !error && (
          <div className="space-y-6 sm:space-y-8">
            {Object.keys(resources).length > 0 ? (
              Object.keys(resources)
                .sort((a, b) => b - a)
                .map((year) => (
                  <div key={year}>
                    <h2
                      className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b ${
                        darkMode
                          ? "text-white border-gray-700"
                          : "text-gray-900 border-gray-300"
                      }`}
                    >
                      {year}
                    </h2>
                    <div className="grid gap-4 sm:gap-6">
                      {resources[year].map((item) => (
                        <div
                          key={item._id}
                          className={`p-4 sm:p-6 rounded-2xl transition-all hover:scale-[1.02] ${
                            darkMode
                              ? "bg-gray-800 border border-gray-700 hover:bg-gray-750"
                              : "bg-white border border-gray-200 hover:shadow-xl"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                                <BookOpen
                                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                    darkMode ? "text-blue-400" : "text-blue-600"
                                  }`}
                                />
                                <h3
                                  className={`text-lg sm:text-xl font-bold ${
                                    darkMode ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {item.title}
                                </h3>
                              </div>
                              <p
                                className={`text-xs sm:text-sm mb-1 ${
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                Course: {item.courseName}
                              </p>
                              <p
                                className={`text-sm sm:text-base mb-4 ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {item.description}
                              </p>
                            </div>
                            <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                              <button
                                onClick={() => handleView(item)}
                                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm ${
                                  darkMode
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                }`}
                              >
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDownload(item)}
                                disabled={downloadingId === item._id}
                                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm ${
                                  downloadingId === item._id
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                } ${
                                  darkMode
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                }`}
                              >
                                {downloadingId === item._id ? (
                                  <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                                ) : (
                                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                                <span>
                                  {downloadingId === item._id
                                    ? "Downloading..."
                                    : "Download"}
                                </span>
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm mt-4">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <User
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              />
                              <span
                                className={
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                {item.uploaderName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Calendar
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              />
                              <span
                                className={
                                  darkMode ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                darkMode
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              Section {item.section}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                darkMode
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              Batch {item.batch}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                darkMode
                                  ? "bg-blue-900/30 text-blue-400"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              📥 {item.downloadCount} downloads
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                darkMode
                                  ? "bg-purple-900/30 text-purple-400"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              👁️ {item.viewCount} views
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <div
                className={`text-center py-8 sm:py-12 rounded-2xl ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <BookOpen
                  className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${
                    darkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-lg sm:text-xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  No {resourceType.toLowerCase()} found
                </h3>
                <p
                  className={`text-sm sm:text-base ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Be the first to upload {resourceType.toLowerCase()} for{" "}
                  {department?.name || department}!
                </p>
                <button
                  onClick={handleUploadClick}
                  className="mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all text-sm sm:text-base"
                >
                  Upload Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Resource Modal */}
      {showViewModal && selectedResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={handleBackdropClick}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          <div
            className={`relative w-full ${
              isFullscreen
                ? "h-full max-w-none rounded-none"
                : "max-w-4xl h-auto max-h-[90vh] rounded-2xl"
            } shadow-2xl transform transition-all duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between p-4 sm:p-6 border-b ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } ${isFullscreen ? "rounded-t-none" : "rounded-t-2xl"}`}
            >
              <div className="flex-1 min-w-0">
                <h2
                  className={`text-lg sm:text-xl md:text-2xl font-bold mb-1 truncate ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedResource.title}
                </h2>
                <p
                  className={`text-sm sm:text-lg truncate ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedResource.courseName}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={toggleFullscreen}
                  className={`p-2 rounded-xl transition-all hover:scale-110 ${
                    darkMode
                      ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                      : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  }`}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
                <button
                  onClick={handleCloseModal}
                  className={`p-2 sm:p-3 rounded-xl transition-all hover:scale-110 ${
                    darkMode
                      ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                      : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  }`}
                >
                  <X className="w-4 h-4 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div
              className={`p-4 sm:p-6 ${
                isFullscreen
                  ? "h-[calc(100%-80px)] overflow-auto"
                  : "max-h-[60vh] overflow-auto"
              }`}
            >
              <div
                className={`grid gap-4 sm:gap-8 ${
                  isFullscreen ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {/* Left Column - Preview */}
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Resource Preview
                  </h3>
                  <div
                    className={`rounded-xl overflow-hidden border-2 cursor-pointer hover:opacity-90 transition-opacity ${
                      darkMode ? "border-gray-600" : "border-gray-300"
                    }`}
                    onClick={() => handleOpenPreview(selectedResource.fileUrl)}
                  >
                    {selectedResource.thumbnailUrl ? (
                      <div className="relative">
                        <img
                          src={selectedResource.thumbnailUrl}
                          alt={selectedResource.title}
                          className="w-full h-48 sm:h-64 object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/800x400/374151/9CA3AF?text=Preview+Not+Available";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`w-full h-48 sm:h-64 flex flex-col items-center justify-center ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <FileText
                          className={`w-12 h-12 sm:w-20 sm:h-20 mb-3 sm:mb-4 ${
                            darkMode ? "text-gray-600" : "text-gray-400"
                          }`}
                        />
                        <p
                          className={`text-xs sm:text-sm text-center ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Click here to open file
                        </p>
                        <ExternalLink
                          className={`w-4 h-4 sm:w-5 sm:h-5 mt-1 sm:mt-2 ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
                    <div
                      className={`text-center p-2 sm:p-3 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <FileText
                        className={`w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <div
                        className={`text-xs sm:text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedResource.pages || "N/A"} Pages
                      </div>
                    </div>
                    <div
                      className={`text-center p-2 sm:p-3 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <Clock
                        className={`w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${
                          darkMode ? "text-green-400" : "text-green-600"
                        }`}
                      />
                      <div
                        className={`text-xs sm:text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedResource.fileSize}
                      </div>
                    </div>
                    <div
                      className={`text-center p-2 sm:p-3 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <UsersIcon
                        className={`w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${
                          darkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                      <div
                        className={`text-xs sm:text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Sec {selectedResource.section}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Resource Details
                  </h3>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h4
                        className={`font-semibold mb-2 text-sm sm:text-base ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Description
                      </h4>
                      <p
                        className={`leading-relaxed text-sm sm:text-base ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedResource.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h4
                          className={`font-semibold mb-2 text-sm sm:text-base ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Uploaded By
                        </h4>
                        <div className="flex items-center space-x-2">
                          <User
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm sm:text-base ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedResource.uploaderName}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4
                          className={`font-semibold mb-2 text-sm sm:text-base ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Upload Date
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Calendar
                            className={`w-3 h-3 sm:w-4 sm:h-4 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm sm:text-base ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {new Date(
                              selectedResource.createdAt
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h4
                          className={`font-semibold mb-2 text-sm sm:text-base ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Section
                        </h4>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            darkMode
                              ? "bg-blue-600 text-white"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {selectedResource.section}
                        </span>
                      </div>
                      <div>
                        <h4
                          className={`font-semibold mb-2 text-sm sm:text-base ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Batch
                        </h4>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            darkMode
                              ? "bg-purple-600 text-white"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {selectedResource.batch}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <h4
                          className={`font-semibold mb-2 text-sm sm:text-base ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Downloads
                        </h4>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            darkMode
                              ? "bg-green-600 text-white"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          📥 {selectedResource.downloadCount}
                        </span>
                      </div>
                      <div>
                        <h4
                          className={`font-semibold mb-2 text-sm sm:text-base ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Views
                        </h4>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            darkMode
                              ? "bg-orange-600 text-white"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          👁️ {selectedResource.viewCount}
                        </span>
                      </div>
                    </div>

                    {/* Department Information */}
                    <div>
                      <h4
                        className={`font-semibold mb-2 text-sm sm:text-base ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Department
                      </h4>
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          darkMode
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        {selectedResource.department}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className={`flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 border-t ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } ${isFullscreen ? "rounded-b-none" : "rounded-b-2xl"}`}
            >
              <button
                onClick={handleCloseModal}
                className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(selectedResource)}
                disabled={downloadingId === selectedResource._id}
                className={`flex items-center justify-center space-x-2 px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base ${
                  downloadingId === selectedResource._id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {downloadingId === selectedResource._id ? (
                  <>
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Download Resource</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDetails;
