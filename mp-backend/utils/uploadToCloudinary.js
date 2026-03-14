import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (fileBuffer, folder) => {

  const isResume = folder === "student_resumes";

  const options = {
    folder,
    resource_type: isResume ? "raw" : "image",
    use_filename: true,
    unique_filename: true,
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};