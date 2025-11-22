import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Loader,
  CheckCircle,
  AlertCircle,
  BookOpen,
  File,
  X,
} from "lucide-react";
import { useTheme } from "../ThemeContext";
import { uploadResource } from "../../services/resourceService";
import { getStoredUser } from "../../services/authService";
import { uploadFileToSupabase } from "../../services/supabaseStorage";

const UploadModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();
  const fileInputRef = useRef(null);

  const resourceType = location.state?.resourceType || "Notes";
  const department = location.state?.department || "General";
  const semester = location.state?.semester || "N/A";

  const validResourceTypes = [
    "Assignments",
    "Quizzes",
    "Projects",
    "Presentations",
    "Notes",
    "Past Papers",
  ];

  React.useEffect(() => {
    if (!validResourceTypes.includes(resourceType)) {
      console.error(`Invalid resourceType: ${resourceType}`);
      navigate("/dashboard");
    }
  }, [resourceType, navigate]);

  const currentYear = new Date().getFullYear();
  const user = getStoredUser();

  const [uploadForm, setUploadForm] = useState({
    courseName: "",
    title: "",
    description: "",
    resourceType: resourceType,
    department: department.name || department,
    semester: semester,
    section: "",
    batch: "",
    year: currentYear,
    fileSize: "",
    fileType: "",
    pages: 0,
    fileName: "",
    fileUrl: "",
    thumbnailUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => {
    navigate("/resource-details", {
      state: {
        resourceType,
        department,
        semester,
      },
    });
  };

  const handleFileSelect = (file) => {
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 50MB");
      return false;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(
        /\.(pdf|doc|docx|ppt|pptx|txt|xls|xlsx|zip|rar|7z|jpg|jpeg|png|gif|webp)$/i
      )
    ) {
      setError(
        "Please select a valid file type (PDF, DOC, PPT, Images, ZIP, etc.)"
      );
      return false;
    }

    setSelectedFile(file);
    setUploadForm((prev) => ({
      ...prev,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      fileType: file.type,
    }));
    setError("");
    return true;
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file" && files[0]) {
      handleFileSelect(files[0]);
    } else {
      setUploadForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadForm((prev) => ({
      ...prev,
      fileName: "",
      fileSize: "",
      fileType: "",
    }));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    if (
      !uploadForm.courseName.trim() ||
      !uploadForm.title.trim() ||
      !uploadForm.description.trim() ||
      !uploadForm.section.trim() ||
      !uploadForm.batch.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      setUploadProgress(20);
      const folderName = resourceType.toLowerCase().replace(/\s+/g, "-");
      const uploadResult = await uploadFileToSupabase(selectedFile, folderName);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Failed to upload file");
      }

      setUploadProgress(60);

      const resourceData = {
        ...uploadForm,
        fileUrl: uploadResult.fileUrl,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        fileType: uploadResult.fileType,
        storagePath: uploadResult.storagePath,
        resourceType,
        department: department.name || department,
        semester: semester,
        uploaderName: user.fullName,
        uploaderEmail: user.email,
      };

      setUploadProgress(80);

      const response = await uploadResource(resourceData);

      if (response.success) {
        setUploadProgress(100);
        setSuccess(true);

        setTimeout(() => {
          navigate("/my-posts", {
            state: {
              resourceType,
              department,
              semester,
            },
          });
        }, 2000);
      }
    } catch (err) {
      setError(err.message || "Failed to upload resource. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <File className="w-8 h-8" />;

    const type = selectedFile.type;
    const name = selectedFile.name.toLowerCase();

    if (type.includes("pdf")) return <File className="w-8 h-8 text-red-500" />;
    if (type.includes("word") || name.includes(".doc"))
      return <File className="w-8 h-8 text-blue-500" />;
    if (type.includes("powerpoint") || name.includes(".ppt"))
      return <File className="w-8 h-8 text-orange-500" />;
    if (type.includes("excel") || name.includes(".xls"))
      return <File className="w-8 h-8 text-green-500" />;
    if (type.includes("image"))
      return <File className="w-8 h-8 text-purple-500" />;
    if (type.includes("zip") || type.includes("rar"))
      return <File className="w-8 h-8 text-yellow-500" />;

    return <File className="w-8 h-8 text-gray-500" />;
  };

  if (!user?.isVerified) {
    return (
      <div
        className={`min-h-screen pt-24 pb-20 flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`max-w-md p-8 rounded-2xl text-center ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Email Verification Required
          </h2>
          <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Please verify your email address before uploading resources.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    const isAdmin = user?.role === "admin";

    return (
      <div
        className={`min-h-screen pt-24 pb-20 flex items-center justify-center ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`max-w-md p-8 rounded-2xl text-center ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500 animate-bounce" />
          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {isAdmin ? "Upload Successful!" : "Upload Successful!"}
          </h2>
          <p className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {isAdmin
              ? `Your ${resourceType.toLowerCase()} has been uploaded and automatically approved! It's now available for all students.`
              : `Your ${resourceType.toLowerCase()} has been uploaded and is awaiting admin approval.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/my-posts")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Check My Posts
            </button>
            <button
              onClick={() =>
                navigate("/resource-details", {
                  state: { resourceType, department, semester },
                })
              }
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Back to Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-24 pb-20 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8">
          <button
            onClick={handleBack}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
              darkMode
                ? "text-gray-300 hover:bg-gray-800"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to {resourceType}</span>
          </button>
        </div>

        {/* Course Information */}
        <div
          className={`p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 ${
            darkMode
              ? "bg-blue-900/20 border border-blue-800"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-sm sm:text-base ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Course Information
              </h3>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm">
                <span className={darkMode ? "text-blue-300" : "text-blue-700"}>
                  <strong>Department:</strong> {department.name || department}
                </span>
                <span className={darkMode ? "text-blue-300" : "text-blue-700"}>
                  <strong>Semester:</strong> {semester}
                </span>
                <span className={darkMode ? "text-blue-300" : "text-blue-700"}>
                  <strong>Type:</strong> {resourceType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div
          className={`w-full p-4 sm:p-6 md:p-8 rounded-2xl ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2
              className={`text-xl sm:text-2xl md:text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Upload New {resourceType}
            </h2>
            <p
              className={`text-xs sm:text-base ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {department.name || department} - Semester {semester}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className={`p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 flex items-start gap-3 ${
                darkMode
                  ? "bg-red-900/20 border border-red-800"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <AlertCircle
                className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              />
              <p
                className={`text-xs sm:text-sm ${
                  darkMode ? "text-red-400" : "text-red-600"
                }`}
              >
                {error}
              </p>
            </div>
          )}

          {/* Upload Progress */}
          {loading && (
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between mb-2">
                <span
                  className={`text-xs sm:text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Uploading file...
                </span>
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {uploadProgress}%
                </span>
              </div>
              <div
                className={`w-full h-2 rounded-full ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Course Name *
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={uploadForm.courseName}
                  onChange={handleFormChange}
                  disabled={loading}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border outline-none transition-all text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } disabled:opacity-50`}
                  placeholder="e.g., Data Structures"
                />
              </div>

              <div>
                <label
                  className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Resource Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={uploadForm.title}
                  onChange={handleFormChange}
                  disabled={loading}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border outline-none transition-all text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } disabled:opacity-50`}
                  placeholder="e.g., Assignment 1 - Arrays"
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${
                  darkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Description *
              </label>
              <textarea
                name="description"
                value={uploadForm.description}
                onChange={handleFormChange}
                disabled={loading}
                rows="3"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border outline-none transition-all text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } disabled:opacity-50`}
                placeholder="Describe what this resource contains..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label
                  className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Section *
                </label>
                <input
                  type="text"
                  name="section"
                  value={uploadForm.section}
                  onChange={handleFormChange}
                  disabled={loading}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border outline-none transition-all text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } disabled:opacity-50`}
                  placeholder="e.g., A"
                />
              </div>

              <div>
                <label
                  className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Batch *
                </label>
                <input
                  type="text"
                  name="batch"
                  value={uploadForm.batch}
                  onChange={handleFormChange}
                  disabled={loading}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border outline-none transition-all text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } disabled:opacity-50`}
                  placeholder="e.g., 2023-2027"
                />
              </div>

              <div>
                <label
                  className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={uploadForm.year}
                  onChange={handleFormChange}
                  disabled={loading}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border outline-none transition-all text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } disabled:opacity-50`}
                  placeholder="2024"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Number of Pages (Optional)
                </label>
                <input
                  type="number"
                  name="pages"
                  value={uploadForm.pages}
                  onChange={handleFormChange}
                  disabled={loading}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border outline-none transition-all text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } disabled:opacity-50`}
                  placeholder="e.g., 12"
                />
              </div>

              <div>
                <label
                  className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  File * (Max 50MB)
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  onChange={handleFormChange}
                  disabled={loading}
                  accept="*/*"
                  className="hidden"
                />

                {!selectedFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : darkMode
                        ? "border-gray-600 hover:border-gray-500"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleBrowseClick}
                  >
                    <Upload
                      className={`w-8 h-8 mx-auto mb-3 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <p
                      className={`text-sm mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Drag & drop your file here
                    </p>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      or{" "}
                      <span className="text-blue-500 hover:text-blue-600">
                        browse files
                      </span>
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Supports: PDF, DOC, PPT, Images, ZIP, etc. (Max 50MB)
                    </p>
                  </div>
                ) : (
                  <div
                    className={`border rounded-lg p-3 sm:p-4 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        {getFileIcon()}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-medium truncate ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedFile.name}
                          </p>
                          <p
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {uploadForm.fileSize} •{" "}
                            {selectedFile.type || "Unknown type"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        disabled={loading}
                        className={`p-1 rounded-full flex-shrink-0 ${
                          darkMode
                            ? "text-gray-400 hover:text-gray-300 hover:bg-gray-600"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                        } disabled:opacity-50`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={loading || !selectedFile}
                className="flex items-center space-x-2 px-8 sm:px-12 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Uploading to Cloud...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Upload {resourceType}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
