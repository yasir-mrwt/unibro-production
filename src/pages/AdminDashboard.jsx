import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Download,
  Calendar,
  User,
  BookOpen,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Loader,
  Users,
  BarChart3,
  AlertCircle,
  Building,
  School,
  X,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import {
  getPendingResources,
  approveResource,
  rejectResource,
  getAllResourcesAdmin,
} from "../services/resourceService";
import { getStoredUser, isAuthenticated } from "../services/authService";
import {
  getDownloadUrl,
  getPreviewUrl,
  downloadFile,
} from "../services/supabaseStorage";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const user = getStoredUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (user?.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    fetchPendingResources();
    fetchStats();
  }, []);

  const fetchPendingResources = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPendingResources();
      setResources(data.resources || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching pending resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getAllResourcesAdmin();
      setStats(
        data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 }
      );
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleApprove = async (resourceId) => {
    setActionLoading(resourceId);
    try {
      await approveResource(resourceId);
      await fetchPendingResources();
      await fetchStats();
    } catch (err) {
      alert("Failed to approve resource: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (resourceId) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setActionLoading(resourceId);
    try {
      await rejectResource(resourceId, rejectReason);
      setShowRejectModal(null);
      setRejectReason("");
      await fetchPendingResources();
      await fetchStats();
    } catch (err) {
      alert("Failed to reject resource: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (resourceId) => {
    setShowRejectModal(resourceId);
    setRejectReason("");
  };

  const closeRejectModal = () => {
    setShowRejectModal(null);
    setRejectReason("");
  };

  const handleDownload = async (item) => {
    try {
      setDownloadingId(item._id);

      const result = await downloadFile(
        item.fileUrl,
        item.fileName || `${item.title}.pdf`
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to download file");
      }
    } catch (error) {
      console.error("Download error:", error);
      setError("Failed to download file. Please try again.");

      try {
        const downloadUrl = getDownloadUrl(item.fileUrl);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = item.fileName || `${item.title}.pdf`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setError("");
      } catch (fallbackError) {
        console.error("Fallback download also failed:", fallbackError);
        setError("Failed to download file. Please try again later.");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const handleView = (item) => {
    setSelectedResource(item);
    setShowViewModal(true);
  };

  const handleOpenPreview = (fileUrl) => {
    const previewUrl = getPreviewUrl(fileUrl);
    window.open(previewUrl, "_blank");
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedResource(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const statCards = [
    {
      title: "Total Resources",
      value: stats.total,
      icon: FileText,
      color: "blue",
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "red",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: darkMode
        ? "bg-blue-900/30 text-blue-400 border-blue-800"
        : "bg-blue-50 text-blue-700 border-blue-200",
      yellow: darkMode
        ? "bg-yellow-900/30 text-yellow-400 border-yellow-800"
        : "bg-yellow-50 text-yellow-700 border-yellow-200",
      green: darkMode
        ? "bg-green-900/30 text-green-400 border-green-800"
        : "bg-green-50 text-green-700 border-green-200",
      red: darkMode
        ? "bg-red-900/30 text-red-400 border-red-800"
        : "bg-red-50 text-red-700 border-red-200",
    };
    return colors[color];
  };

  return (
    <div
      className={`min-h-screen pt-20 sm:pt-24 pb-20 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ✅ FIXED: Mobile-Responsive Header */}
        <div className="mb-6 sm:mb-8">
          {/* Back Button - Separate row on mobile */}
          <button
            onClick={handleBack}
            className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg transition-all mb-4 sm:mb-0 ${
              darkMode
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </button>

          {/* Title - Centered */}
          <div className="text-center">
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Admin Dashboard
            </h1>
            <p
              className={`text-sm sm:text-base lg:text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Review and manage resource submissions
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {statCards.map((card) => (
            <div
              key={card.title}
              className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 ${getColorClasses(
                card.color
              )}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {card.title}
                  </p>
                  <p
                    className={`text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {card.value}
                  </p>
                </div>
                <card.icon className="w-6 h-6 sm:w-8 sm:h-8 opacity-70" />
              </div>
            </div>
          ))}
        </div>

        {/* Pending Resources Section */}
        <div
          className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <AlertCircle
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                darkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            />
            <h2
              className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Pending Resources ({resources.length})
            </h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 sm:p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-6 sm:mb-8">
              <p className="text-sm sm:text-base text-red-600 dark:text-red-400">
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

          {/* ✅ FIXED: Mobile-Responsive Resources List */}
          {!loading && !error && (
            <div className="space-y-4 sm:space-y-6">
              {resources.length > 0 ? (
                resources.map((item) => (
                  <div
                    key={item._id}
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all ${
                      darkMode
                        ? "bg-gray-750 border border-gray-700"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {/* ✅ FIXED: Resource Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <BookOpen
                            className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${
                              darkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                          />
                          <h3
                            className={`text-base sm:text-lg lg:text-xl font-bold truncate ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                            darkMode
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          Pending
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm mb-1 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Course: {item.courseName}
                      </p>
                      <p
                        className={`text-sm mb-3 line-clamp-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* ✅ FIXED: Metadata - Mobile Grid */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <User
                          className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`truncate ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.uploadedBy?.fullName || item.uploaderName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar
                          className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`truncate ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building
                          className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`truncate ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {item.department || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <School
                          className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={`truncate ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Sem {item.semester || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Sec {item.section}
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
                            ? "bg-purple-900/30 text-purple-400"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {item.resourceType}
                      </span>
                    </div>

                    {/* ✅ FIXED: Action Buttons - Mobile Layout */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {/* View & Download - Row on mobile */}
                      <div className="flex gap-2 sm:hidden">
                        <button
                          onClick={() => handleView(item)}
                          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                            darkMode
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">View</span>
                        </button>
                        <button
                          onClick={() => handleDownload(item)}
                          disabled={downloadingId === item._id}
                          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all ${
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
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          <span className="text-sm">Download</span>
                        </button>
                      </div>

                      {/* Desktop View & Download */}
                      <button
                        onClick={() => handleView(item)}
                        className={`hidden sm:flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                          darkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleDownload(item)}
                        disabled={downloadingId === item._id}
                        className={`hidden sm:flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all ${
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
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span>Download</span>
                      </button>

                      {/* Approve & Reject - Full width on mobile */}
                      <button
                        onClick={() => handleApprove(item._id)}
                        disabled={actionLoading === item._id}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all ${
                          actionLoading === item._id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-105"
                        } ${
                          darkMode
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {actionLoading === item._id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span className="text-sm sm:text-base">Approve</span>
                      </button>

                      <button
                        onClick={() => openRejectModal(item._id)}
                        disabled={actionLoading === item._id}
                        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all ${
                          actionLoading === item._id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:scale-105"
                        } ${
                          darkMode
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm sm:text-base">Reject</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className={`text-center py-12 rounded-2xl ${
                    darkMode ? "bg-gray-750" : "bg-gray-100"
                  }`}
                >
                  <CheckCircle
                    className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${
                      darkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`text-lg sm:text-xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    No pending resources
                  </h3>
                  <p
                    className={`text-sm sm:text-base ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    All resources have been reviewed. Great work!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          <div
            className={`relative w-full max-w-md rounded-2xl p-4 sm:p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Reject Resource
            </h3>
            <p
              className={`text-sm sm:text-base mb-3 sm:mb-4 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Please provide a reason for rejection. This will be sent to the
              uploader.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
              className={`w-full p-3 rounded-lg border outline-none transition-all text-sm sm:text-base ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500"
              }`}
            />
            <div className="flex gap-3 mt-4 sm:mt-6">
              <button
                onClick={closeRejectModal}
                className={`flex-1 px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={
                  !rejectReason.trim() || actionLoading === showRejectModal
                }
                className={`flex-1 px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  !rejectReason.trim() || actionLoading === showRejectModal
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                } ${
                  darkMode
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {actionLoading === showRejectModal ? (
                  <Loader className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Reject Resource"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ FIXED: Mobile-Responsive View Resource Modal */}
      {showViewModal && selectedResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
          onClick={handleBackdropClick}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          <div
            className={`relative w-full h-full sm:h-auto sm:max-w-5xl sm:rounded-2xl shadow-2xl transform transition-all duration-300 overflow-y-auto ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ✅ FIXED: Modal Header - Mobile Close Button Visible */}
            <div
              className={`sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } ${!darkMode && "shadow-sm"}`}
            >
              <div className="flex-1 pr-4">
                <h2
                  className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 line-clamp-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedResource.title}
                </h2>
                <p
                  className={`text-sm sm:text-base lg:text-lg truncate ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedResource.courseName}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className={`flex-shrink-0 p-2 sm:p-3 rounded-xl transition-all hover:scale-110 ${
                  darkMode
                    ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                    : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                }`}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* ✅ FIXED: Modal Content - Mobile Responsive */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Left Column - Preview */}
                <div>
                  <h3
                    className={`text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Resource Preview
                  </h3>
                  <div
                    className={`rounded-lg sm:rounded-xl overflow-hidden border-2 cursor-pointer hover:opacity-90 transition-opacity ${
                      darkMode ? "border-gray-600" : "border-gray-300"
                    }`}
                    onClick={() => handleOpenPreview(selectedResource.fileUrl)}
                  >
                    {selectedResource.thumbnailUrl ? (
                      <div className="relative">
                        <img
                          src={selectedResource.thumbnailUrl}
                          alt={selectedResource.title}
                          className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/800x400/374151/9CA3AF?text=Preview+Not+Available";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`w-full h-48 sm:h-56 lg:h-64 flex flex-col items-center justify-center ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <FileText
                          className={`w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 ${
                            darkMode ? "text-gray-600" : "text-gray-400"
                          }`}
                        />
                        <p
                          className={`text-xs sm:text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Click to open PDF
                        </p>
                        <ExternalLink
                          className={`w-4 h-4 sm:w-5 sm:h-5 mt-2 ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
                    <div
                      className={`text-center p-2 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <FileText
                        className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <div
                        className={`text-xs font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedResource.pages || "N/A"} Pages
                      </div>
                    </div>
                    <div
                      className={`text-center p-2 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <Clock
                        className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 ${
                          darkMode ? "text-green-400" : "text-green-600"
                        }`}
                      />
                      <div
                        className={`text-xs font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedResource.fileSize}
                      </div>
                    </div>
                    <div
                      className={`text-center p-2 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <Users
                        className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 ${
                          darkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                      <div
                        className={`text-xs font-medium ${
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
                    className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Resource Details
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h4
                        className={`font-semibold mb-1 text-xs sm:text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Description
                      </h4>
                      <p
                        className={`leading-relaxed text-xs sm:text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedResource.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <h4
                          className={`font-semibold mb-1 text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Uploaded By
                        </h4>
                        <div className="flex items-center space-x-2">
                          <User
                            className={`w-3 h-3 flex-shrink-0 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-xs sm:text-sm truncate ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedResource.uploadedBy?.fullName ||
                              selectedResource.uploaderName}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4
                          className={`font-semibold mb-1 text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Upload Date
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Calendar
                            className={`w-3 h-3 flex-shrink-0 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-xs sm:text-sm truncate ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {new Date(
                              selectedResource.createdAt
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <h4
                          className={`font-semibold mb-1 text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Department
                        </h4>
                        <div className="flex items-center space-x-2">
                          <Building
                            className={`w-3 h-3 flex-shrink-0 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-xs sm:text-sm truncate ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedResource.department || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4
                          className={`font-semibold mb-1 text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Semester
                        </h4>
                        <div className="flex items-center space-x-2">
                          <School
                            className={`w-3 h-3 flex-shrink-0 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-xs sm:text-sm truncate ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedResource.semester || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <h4
                          className={`font-semibold mb-1 text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Section
                        </h4>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
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
                          className={`font-semibold mb-1 text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Batch
                        </h4>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            darkMode
                              ? "bg-purple-600 text-white"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {selectedResource.batch}
                        </span>
                      </div>
                      <div>
                        <h4
                          className={`font-semibold mb-1 text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Resource Type
                        </h4>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            darkMode
                              ? "bg-green-600 text-white"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {selectedResource.resourceType}
                        </span>
                      </div>
                      <div>
                        <h4
                          className={`font-semibold mb-1 text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Year
                        </h4>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            darkMode
                              ? "bg-orange-600 text-white"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {selectedResource.year}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ FIXED: Modal Footer - Mobile Responsive Buttons */}
            <div
              className={`sticky bottom-0 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 border-t ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => {
                  handleCloseModal();
                  openRejectModal(selectedResource._id);
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-2 bg-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105 text-sm order-2 sm:order-1"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Resource</span>
              </button>
              <button
                onClick={() => {
                  handleCloseModal();
                  handleApprove(selectedResource._id);
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-2 bg-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105 text-sm order-1 sm:order-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Resource</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
