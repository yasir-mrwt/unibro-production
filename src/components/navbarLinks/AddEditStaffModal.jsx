import React, { useState, useEffect } from "react";
import {
  X,
  Loader,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { uploadStaffImage } from "../../services/supabaseStorage";

const AddEditStaffModal = ({ staff, onClose, onSuccess, darkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    image: "",
    courses: [""],
    qualification: "",
    office: "",
    counsellingHours: "",
    phoneNumber: "",
    bio: "",
    specialization: [""],
    yearsOfExperience: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Industrial Engineering",
    "Mechatronics Engineering",
    "Agricultural Engineering",
    "Chemical Engineering",
    "Civil Engineering",
  ];

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        department: staff.department || "",
        image: staff.image || "",
        courses: staff.courses || [""],
        qualification: staff.qualification || "",
        office: staff.office || "",
        counsellingHours: staff.counsellingHours || "",
        phoneNumber: staff.phoneNumber || "",
        bio: staff.bio || "",
        specialization: staff.specialization || [""],
        yearsOfExperience: staff.yearsOfExperience || "",
      });
      setImagePreview(staff.image || "");
    }
  }, [staff]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG, PNG, and WebP images are allowed");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const removeArrayField = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray.length > 0 ? newArray : [""],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let imageUrl = formData.image;

      // Step 1: Upload image to Supabase if new file selected
      if (selectedFile) {
        setUploadingImage(true);
        const uploadResult = await uploadStaffImage(selectedFile);

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }

        imageUrl = uploadResult.imageUrl;
      }

      setUploadingImage(false);

      // Step 2: Clean up form data
      const cleanData = {
        ...formData,
        image: imageUrl,
        courses: formData.courses.filter((c) => c.trim() !== ""),
        specialization: formData.specialization.filter((s) => s.trim() !== ""),
        yearsOfExperience: formData.yearsOfExperience
          ? parseInt(formData.yearsOfExperience)
          : undefined,
      };

      // Step 3: Save staff data to database
      const url = staff
        ? `https://unibro-production.up.railway.app/api/staff/${staff._id}`
        : "https://unibro-production.up.railway.app/api/staff";

      // NEW - Add Authorization header
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login as admin to add/edit staff");
      }

      const response = await fetch(url, {
        method: staff ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ ADD THIS
        },
        credentials: "include",
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || "Failed to save staff member");
      }
    } catch (error) {
      console.error("Error saving staff:", error);
      setError(error.message || "Failed to save staff member");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-2xl font-bold text-white">
            {staff ? "Edit Staff Member" : "Add New Staff Member"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Image Upload Section */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium mb-3 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Profile Image
            </label>

            <div className="flex items-start gap-4">
              {/* Image Preview */}
              <div className="flex-shrink-0">
                <div
                  className={`relative w-32 h-32 rounded-xl overflow-hidden border-2 ${
                    darkMode ? "border-gray-600" : "border-gray-300"
                  }`}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <ImageIcon
                        className={`w-12 h-12 ${
                          darkMode ? "text-gray-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                  )}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loading}
                />
                <label
                  htmlFor="imageUpload"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                    darkMode
                      ? "border-gray-600 hover:border-blue-500 bg-gray-700 hover:bg-gray-600"
                      : "border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-gray-100"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Upload className="w-5 h-5" />
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    {selectedFile ? "Change Image" : "Upload Image"}
                  </span>
                </label>
                <p
                  className={`text-xs mt-2 ${
                    darkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Recommended: Square image, max 5MB (JPEG, PNG, WebP)
                </p>
                {selectedFile && (
                  <p
                    className={`text-xs mt-1 ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    ✓ {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } disabled:opacity-50`}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } disabled:opacity-50`}
              />
            </div>

            {/* Department */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } disabled:opacity-50`}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } disabled:opacity-50`}
              />
            </div>

            {/* Office */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Office Location *
              </label>
              <input
                type="text"
                name="office"
                value={formData.office}
                onChange={handleChange}
                required
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } disabled:opacity-50`}
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Years of Experience
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } disabled:opacity-50`}
              />
            </div>
          </div>

          {/* Qualification */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Qualification *
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="e.g., PhD in Computer Science, MIT"
              className={`w-full px-4 py-2 rounded-lg border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } disabled:opacity-50`}
            />
          </div>

          {/* Counselling Hours */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Counselling Hours *
            </label>
            <input
              type="text"
              name="counsellingHours"
              value={formData.counsellingHours}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="e.g., Mon-Wed: 2:00 PM - 4:00 PM"
              className={`w-full px-4 py-2 rounded-lg border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } disabled:opacity-50`}
            />
          </div>

          {/* Bio */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Bio (max 500 characters)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={500}
              rows={3}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } disabled:opacity-50`}
            />
          </div>

          {/* Courses */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Courses Teaching
              </label>
              <button
                type="button"
                onClick={() => addArrayField("courses")}
                disabled={loading}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Course
              </button>
            </div>
            {formData.courses.map((course, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={course}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "courses")
                  }
                  placeholder="Course name"
                  disabled={loading}
                  className={`flex-1 px-4 py-2 rounded-lg border outline-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } disabled:opacity-50`}
                />
                {formData.courses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField(index, "courses")}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Specialization */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Specialization
              </label>
              <button
                type="button"
                onClick={() => addArrayField("specialization")}
                disabled={loading}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add Specialization
              </button>
            </div>
            {formData.specialization.map((spec, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "specialization")
                  }
                  placeholder="Specialization area"
                  disabled={loading}
                  className={`flex-1 px-4 py-2 rounded-lg border outline-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } disabled:opacity-50`}
                />
                {formData.specialization.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField(index, "specialization")}
                    disabled={loading}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploadingImage ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uploading Image...
                </>
              ) : loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : staff ? (
                "Update Staff"
              ) : (
                "Add Staff"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditStaffModal;
