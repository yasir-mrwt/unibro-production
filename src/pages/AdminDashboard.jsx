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
    navigate("/dashboard");
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

      // Use the downloadFile function from supabaseStorage
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

  const handleView = (item) => {
    setSelectedResource(item);
    setShowViewModal(true);
  };

  const handleOpenPreview = (fileUrl) => {
    // Open PDF in new tab for preview using the preview URL
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

  // Stats cards data
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
      className={`min-h-screen pt-24 pb-20 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              darkMode
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="text-center">
            <h1
              className={`text-4xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Admin Dashboard
            </h1>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Review and manage resource submissions
            </p>
          </div>
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div
              key={card.title}
              className={`p-6 rounded-2xl border-2 ${getColorClasses(
                card.color
              )}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {card.title}
                  </p>
                  <p
                    className={`text-3xl font-bold mt-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {card.value}
                  </p>
                </div>
                <card.icon className="w-8 h-8 opacity-70" />
              </div>
            </div>
          ))}
        </div>

        {/* Pending Resources Section */}
        <div
          className={`p-6 rounded-2xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <AlertCircle
              className={`w-6 h-6 ${
                darkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            />
            <h2
              className={`text-2xl font-bold ${
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
            <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-8">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => setError("")}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Resources List */}
          {!loading && !error && (
            <div className="space-y-6">
              {resources.length > 0 ? (
                resources.map((item) => (
                  <div
                    key={item._id}
                    className={`p-6 rounded-2xl transition-all ${
                      darkMode
                        ? "bg-gray-750 border border-gray-700"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <BookOpen
                            className={`w-5 h-5 ${
                              darkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                          />
                          <h3
                            className={`text-xl font-bold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              darkMode
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            Pending Review
                          </span>
                        </div>
                        <p
                          className={`text-sm mb-1 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Course: {item.courseName}
                        </p>
                        <p
                          className={`mb-4 ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleView(item)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
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
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
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
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <User
                          className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {item.uploadedBy?.fullName || item.uploaderName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar
                          className={`w-4 h-4 ${
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
                      <div className="flex items-center space-x-2">
                        <Building
                          className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {item.department || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <School
                          className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span
                          className={
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          Sem {item.semester || "N/A"}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Section {item.section}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Batch {item.batch}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          darkMode
                            ? "bg-purple-900/30 text-purple-400"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {item.resourceType}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleApprove(item._id)}
                        disabled={actionLoading === item._id}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
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
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => openRejectModal(item._id)}
                        disabled={actionLoading === item._id}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
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
                        <span>Reject</span>
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
                    className={`w-16 h-16 mx-auto mb-4 ${
                      darkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    No pending resources
                  </h3>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
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
            className={`relative w-full max-w-md rounded-2xl p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Reject Resource
            </h3>
            <p
              className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Please provide a reason for rejection. This will be sent to the
              uploader.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows="4"
              className={`w-full p-3 rounded-lg border outline-none transition-all ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500"
              }`}
            />
            <div className="flex space-x-4 mt-6">
              <button
                onClick={closeRejectModal}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
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
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
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

      {/* View Resource Modal */}
      {showViewModal && selectedResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          <div
            className={`relative w-full max-w-5xl rounded-2xl shadow-2xl transform transition-all duration-300 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between p-6 border-b ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } rounded-t-2xl`}
            >
              <div className="flex-1">
                <h2
                  className={`text-2xl font-bold mb-1 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedResource.title}
                </h2>
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {selectedResource.courseName}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className={`ml-4 p-3 rounded-xl transition-all hover:scale-110 ${
                  darkMode
                    ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                    : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Preview */}
                <div>
                  <h3
                    className={`text-xl font-semibold mb-4 ${
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
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/800x400/374151/9CA3AF?text=Preview+Not+Available";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`w-full h-64 flex flex-col items-center justify-center ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        <FileText
                          className={`w-20 h-20 mb-4 ${
                            darkMode ? "text-gray-600" : "text-gray-400"
                          }`}
                        />
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Click to open PDF
                        </p>
                        <ExternalLink
                          className={`w-5 h-5 mt-2 ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div
                      className={`text-center p-2 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <FileText
                        className={`w-5 h-5 mx-auto mb-1 ${
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
                        className={`w-5 h-5 mx-auto mb-1 ${
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
                        className={`w-5 h-5 mx-auto mb-1 ${
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
                    className={`text-lg font-semibold mb-3 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Resource Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4
                        className={`font-semibold mb-1 text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Description
                      </h4>
                      <p
                        className={`leading-relaxed text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedResource.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
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
                            className={`w-3 h-3 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm ${
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
                            className={`w-3 h-3 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm ${
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

                    <div className="grid grid-cols-2 gap-3">
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
                            className={`w-3 h-3 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm ${
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
                            className={`w-3 h-3 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedResource.semester || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <h4
                          className={`font-semibold mb-1 text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Section
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            darkMode
                              ? "bg-purple-600 text-white"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {selectedResource.batch}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <h4
                          className={`font-semibold mb-1 text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Resource Type
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
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

            {/* Modal Footer */}
            <div
              className={`flex justify-end space-x-3 p-4 border-t ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } rounded-b-2xl`}
            >
              <button
                onClick={() => {
                  handleCloseModal();
                  openRejectModal(selectedResource._id);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105 text-sm"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Resource</span>
              </button>
              <button
                onClick={() => {
                  handleCloseModal();
                  handleApprove(selectedResource._id);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105 text-sm"
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
