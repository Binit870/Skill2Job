import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (fileBuffer, folder, fileExt = null) => {

  const resourceType =
    folder === "student_resumes" ? "raw" : "image";

  const options = {
    folder: folder,
    resource_type: resourceType,
  };

  // Only add format for resumes
  if (resourceType === "raw" && fileExt) {
    options.format = fileExt;
    options.use_filename = true;
  }

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);

  });
};