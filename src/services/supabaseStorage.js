import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = "https://dxhloitdkenuoknnoygq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4aGxvaXRka2VudW9rbm5veWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NDU0OTksImV4cCI6MjA3ODQyMTQ5OX0.2dlovWaZMFSwUY0mwi64QRuSLyBBkIR8HXX4sJWvfMg";

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

/**
 * Upload file to Supabase Storage
 */
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

    if (error) {
      throw error;
    }

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

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - The storage path of file to delete (e.g., "resources/1234567-abc.pdf")
 * OR
 * @param {string} fileUrl - The full public URL of the file
 * @returns {Promise<Object>} - { success, error }
 */
export const deleteFileFromSupabase = async (filePathOrUrl) => {
  try {
    let filePath = filePathOrUrl;

    // If it's a full URL, extract the path from it
    if (filePathOrUrl.includes("http")) {
      const url = new URL(filePathOrUrl);
      // Extract path after bucket name
      // URL format: https://xxx.supabase.co/storage/v1/object/public/unibro-files/resources/file.pdf
      const pathParts = url.pathname.split("/unibro-files/");
      if (pathParts.length > 1) {
        filePath = pathParts[1];
      }
    }

    const { error } = await supabase.storage
      .from("unibro-files")
      .remove([filePath]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Supabase delete error:", error);
    return {
      success: false,
      error: error.message || "Failed to delete file",
    };
  }
};

/**
 * Extract storage path from file URL
 * @param {string} fileUrl - The full public URL
 * @returns {string} - The storage path (e.g., "resources/1234567-abc.pdf")
 */
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

/**
 * Get download URL - Forces file download instead of opening in browser
 * @param {string} fileUrl - The public URL of the file
 * @param {string} fileName - Original filename for download
 * @returns {string} - Download URL with proper headers
 */
export const getDownloadUrl = (fileUrl, fileName = "download") => {
  // For Supabase, we need to add download parameter to force download
  // Extract the path from the full URL
  const url = new URL(fileUrl);
  url.searchParams.set("download", fileName);
  return url.toString();
};

/**
 * Download file directly - Handles the actual download with proper filename
 * @param {string} fileUrl - The public URL of the file
 * @param {string} fileName - Name to save the file as
 */
export const downloadFile = async (fileUrl, fileName = "download.pdf") => {
  try {
    // Fetch the file as blob
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
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

/**
 * Get preview URL for viewing in browser (for PDFs and images)
 * @param {string} fileUrl - The public URL of the file
 * @returns {string} - URL for preview
 */
export const getPreviewUrl = (fileUrl) => {
  // Return the public URL as-is for preview
  return fileUrl;
};

/**
 * Check if file exists in storage
 */
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

/**
 * Upload staff profile image to Supabase Storage
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - { success, imageUrl, error }
 */
export const uploadStaffImage = async (file) => {
  try {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG, and WebP images are allowed");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Image size must be less than 5MB");
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `staff-${timestamp}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `staff-profiles/${fileName}`; // Use staff-profiles folder

    // Upload to existing 'unibro-files' bucket
    const { data, error } = await supabase.storage
      .from("unibro-files") // Use existing working bucket
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("unibro-files") // Use existing working bucket
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

/**
 * Delete staff image from Supabase Storage
 * @param {string} storagePath - The storage path of image to delete
 * @returns {Promise<Object>} - { success, error }
 */
export const deleteStaffImage = async (storagePath) => {
  try {
    const { error } = await supabase.storage
      .from("unibro-files") // Use existing working bucket
      .remove([storagePath]);

    if (error) {
      throw error;
    }

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
