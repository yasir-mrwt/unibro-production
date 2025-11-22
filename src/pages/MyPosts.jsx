import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Loader,
  User,
  Calendar,
  Building,
  School,
  X,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { getMyResources, deleteResource } from "../services/resourceService";
import { getStoredUser, isAuthenticated } from "../services/authService";

const MyPosts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  const [activeTab, setActiveTab] = useState("pending");
  const [resources, setResources] = useState({
    pending: [],
    approved: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // confirmation modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const resourceType = location.state?.resourceType || "Resources";
  const user = getStoredUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    fetchMyResources();
  }, []);

  const fetchMyResources = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyResources();
      setResources(
        data.resources || { pending: [], approved: [], rejected: [] }
      );
    } catch (err) {
      setError(err.message);
      console.error("Error fetching my resources:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/resource-details", { state: { resourceType } });
  };

  const handleDelete = async (item) => {
    // 🔹 Auto-delete rejected posts
    if (item.status === "rejected") {
      setDeleteLoading(item._id);
      try {
        await deleteResource(item._id);
        await fetchMyResources();
      } catch (err) {
        alert("Failed to delete resource: " + err.message);
      } finally {
        setDeleteLoading(null);
      }
      return;
    }

    // 🔹 For pending or approved → show confirmation modal
    setDeleteTarget(item);
    setConfirmInput("");
    setConfirmError("");
    setConfirmed(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (confirmInput.trim() !== deleteTarget.title.trim()) {
      setConfirmError("File name does not match. Please try again.");
      setConfirmed(false);
      return;
    }

    setConfirmed(true);
    setDeleteLoading(deleteTarget._id);

    // small delay for feedback
    setTimeout(async () => {
      try {
        await deleteResource(deleteTarget._id);
        await fetchMyResources();
        setShowDeleteConfirm(false);
      } catch (err) {
        alert("Failed to delete resource: " + err.message);
      } finally {
        setDeleteLoading(null);
      }
    }, 1000);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setConfirmError("");
    setConfirmed(false);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "approved":
        return `${baseClasses} ${
          darkMode
            ? "bg-green-900/30 text-green-400"
            : "bg-green-100 text-green-700"
        }`;
      case "rejected":
        return `${baseClasses} ${
          darkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700"
        }`;
      case "pending":
        return `${baseClasses} ${
          darkMode
            ? "bg-yellow-900/30 text-yellow-400"
            : "bg-yellow-100 text-yellow-700"
        }`;
      default:
        return baseClasses;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const currentResources = resources[activeTab] || [];

  const tabs = [
    { key: "pending", name: "Pending", count: resources.pending.length },
    { key: "approved", name: "Approved", count: resources.approved.length },
    { key: "rejected", name: "Rejected", count: resources.rejected.length },
  ];

  return (
    <div
      className={`min-h-screen pt-24 pb-20 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <button
            onClick={handleBack}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              darkMode
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to {resourceType}</span>
          </button>
          <div className="text-center">
            <h1
              className={`text-3xl sm:text-4xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              My Posts
            </h1>
            <p
              className={`text-base sm:text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Manage your {resourceType.toLowerCase()} submissions
            </p>
          </div>
          <div className="hidden sm:block w-32"></div>
        </div>

        {/* Tabs */}
        <div
          className={`p-2 rounded-xl mb-8 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center justify-center space-x-3 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium flex-1 transition-all ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span>{tab.name}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.key
                      ? "bg-white/20"
                      : darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Resources */}
        {!loading && !error && (
          <div className="space-y-6">
            {currentResources.length > 0 ? (
              currentResources.map((item) => (
                <div
                  key={item._id}
                  className={`p-4 sm:p-6 rounded-2xl transition-all ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700 hover:bg-gray-750"
                      : "bg-white border border-gray-200 hover:shadow-xl"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <BookOpen
                          className={`w-5 h-5 ${
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
                        {getStatusIcon(item.status)}
                        <span className={getStatusBadge(item.status)}>
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
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

                      {item.status === "rejected" && item.rejectionReason && (
                        <div
                          className={`p-4 rounded-lg mb-4 ${
                            darkMode
                              ? "bg-red-900/20 border border-red-800"
                              : "bg-red-50 border border-red-200"
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <XCircle
                              className={`w-4 h-4 ${
                                darkMode ? "text-red-400" : "text-red-600"
                              }`}
                            />
                            <span
                              className={`font-medium ${
                                darkMode ? "text-red-400" : "text-red-600"
                              }`}
                            >
                              Rejection Reason:
                            </span>
                          </div>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-red-300" : "text-red-700"
                            }`}
                          >
                            {item.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deleteLoading === item._id}
                      className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        deleteLoading === item._id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:scale-105"
                      } ${
                        darkMode
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {deleteLoading === item._id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Footer Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <User
                        className={`w-4 h-4 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
                      >
                        {item.uploaderName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar
                        className={`w-4 h-4 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <span
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
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
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
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
                        className={darkMode ? "text-gray-400" : "text-gray-600"}
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
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      📥 {item.downloadCount} downloads
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        darkMode
                          ? "bg-purple-900/30 text-purple-400"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      👁️ {item.viewCount} views
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        darkMode
                          ? "bg-emerald-900/30 text-emerald-400"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.resourceType}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div
                className={`text-center py-12 rounded-2xl ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <FileText
                  className={`w-16 h-16 mx-auto mb-4 ${
                    darkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  No {activeTab} posts found
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {activeTab === "pending"
                    ? "You don't have any pending submissions."
                    : activeTab === "approved"
                    ? "You don't have any approved posts yet."
                    : "You don't have any rejected posts."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 🔹 Delete Confirmation Modal */}
        {showDeleteConfirm && deleteTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) =>
              e.target === e.currentTarget && closeDeleteConfirm()
            }
          >
            <div
              className={`relative w-full max-w-sm sm:max-w-md rounded-2xl shadow-2xl p-6 sm:p-8 ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <button
                onClick={closeDeleteConfirm}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl sm:text-2xl font-bold mb-3 flex items-center space-x-2">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                <span>Delete Resource</span>
              </h2>

              <p className="text-sm sm:text-base mb-3">
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold">
                  {confirmed ? `"${deleteTarget.title}"` : deleteTarget.title}
                </span>
                ? This action cannot be undone.
              </p>

              <p className="text-xs sm:text-sm mb-2">
                Type the resource name to confirm:
              </p>

              <input
                type="text"
                value={confirmInput}
                onChange={(e) => {
                  setConfirmInput(e.target.value);
                  setConfirmError("");
                  setConfirmed(false);
                }}
                placeholder={deleteTarget.title}
                className={`w-full px-4 py-2 rounded-lg mb-2 border text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                } outline-none focus:ring-2 focus:ring-red-500`}
              />

              {confirmError && (
                <p className="text-red-500 text-xs sm:text-sm mb-2">
                  {confirmError}
                </p>
              )}

              {confirmed && (
                <p className="text-green-500 text-sm sm:text-base font-medium mb-2">
                  ✅ Confirmed — Deleting Resource...
                </p>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                <button
                  onClick={closeDeleteConfirm}
                  className={`w-full sm:w-auto px-5 py-2 rounded-lg font-medium ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading === deleteTarget._id}
                  className={`w-full sm:w-auto px-5 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                    darkMode
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white ${
                    deleteLoading === deleteTarget._id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {deleteLoading === deleteTarget._id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{confirmed ? "Deleting..." : "Confirm Delete"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
