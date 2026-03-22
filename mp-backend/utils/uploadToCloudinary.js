import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} buffer   - File buffer from multer memoryStorage
 * @param {string} folder   - Cloudinary folder e.g. "student_profiles"
 * @param {string} format   - File extension e.g. "pdf" (optional)
 * @returns {Promise}       - Resolves with Cloudinary result (.secure_url)
 */
export const uploadToCloudinary = (buffer, folder, format = null) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: format === "pdf" ? "raw" : "auto",
        ...(format && { format }),
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};