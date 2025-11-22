import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// File upload to Supabase Storage
export const uploadFileToSupabase = async (file, folder = "resources") => {
  try {
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("unibro-files")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("unibro-files")
      .getPublicUrl(filePath);

    return {
      success: true,
      fileUrl: urlData.publicUrl,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      fileType: file.type,
      storagePath: filePath,
    };
  } catch (error) {
    console.error("Supabase upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload file",
    };
  }
};

// Delete file from Supabase Storage
export const deleteFileFromSupabase = async (filePathOrUrl) => {
  try {
    let filePath = filePathOrUrl;

    // Extract path from URL if full URL provided
    if (filePathOrUrl.includes("http")) {
      const url = new URL(filePathOrUrl);
      const pathParts = url.pathname.split("/unibro-files/");
      if (pathParts.length > 1) {
        filePath = pathParts[1];
      }
    }

    const { error } = await supabase.storage
      .from("unibro-files")
      .remove([filePath]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Supabase delete error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete file",
    };
  }
};

// Extract storage path from file URL
export const extractStoragePath = (fileUrl) => {
  try {
    if (!fileUrl) return null;

    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/unibro-files/");

    if (pathParts.length > 1) {
      return pathParts[1];
    }

    return null;
  } catch (error) {
    console.error("Error extracting storage path:", error);
    return null;
  }
};

// Get download URL with proper filename
export const getDownloadUrl = (fileUrl, fileName = "download") => {
  const url = new URL(fileUrl);
  url.searchParams.set("download", fileName);
  return url.toString();
};

// Download file with proper filename handling
export const downloadFile = async (fileUrl, fileName = "download.pdf") => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error("Download error:", error);
    return {
      success: false,
      error: error.message || "Failed to download file",
    };
  }
};

// Get URL for file preview
export const getPreviewUrl = (fileUrl) => {
  return fileUrl;
};

// Check if file exists in storage
export const fileExists = async (filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from("unibro-files")
      .list(filePath.split("/")[0], {
        search: filePath.split("/")[1],
      });

    return !error && data && data.length > 0;
  } catch (error) {
    console.error("File exists check error:", error);
    return false;
  }
};

// Upload staff profile image with validation
export const uploadStaffImage = async (file) => {
  try {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG, and WebP images are allowed");
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("Image size must be less than 5MB");
    }

    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `staff-${timestamp}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `staff-profiles/${fileName}`;

    const { data, error } = await supabase.storage
      .from("unibro-files")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("unibro-files")
      .getPublicUrl(filePath);

    return {
      success: true,
      imageUrl: urlData.publicUrl,
      storagePath: filePath,
    };
  } catch (error) {
    console.error("Staff image upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image",
    };
  }
};

// Delete staff profile image
export const deleteStaffImage = async (storagePath) => {
  try {
    const { error } = await supabase.storage
      .from("unibro-files")
      .remove([storagePath]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Staff image delete error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete image",
    };
  }
};

export default supabase;
