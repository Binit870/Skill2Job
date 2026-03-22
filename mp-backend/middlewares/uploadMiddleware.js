import multer from "multer";
import path from "path";

// ── Use memoryStorage so req.file.buffer is available for Cloudinary ─────
// Do NOT use diskStorage when uploading to Cloudinary — buffer must exist
const storage = multer.memoryStorage();

// ── File filters ─────────────────────────────────────────────────────────
const documentFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext)
    ? cb(null, true)
    : cb(new Error("Only PDF and Word documents are allowed"), false);
};

const imageFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext)
    ? cb(null, true)
    : cb(new Error("Only image files (JPG, PNG, WEBP) are allowed"), false);
};

// ─────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT — used by profileRoutes.js and resumeRoutes.js
//   upload.fields([{ name: "profileImage" }, { name: "resume" }])
//   upload.fields([{ name: "companyLogo" }])
//   upload.single("resume")
// ─────────────────────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "resume") return documentFilter(req, file, cb);
    return imageFilter(req, file, cb);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export default upload;

// ─────────────────────────────────────────────────────────────────────────
// NAMED EXPORT — used by applicationRoutes.js
//   uploadResume middleware before applyForJob
// ─────────────────────────────────────────────────────────────────────────
export const uploadResume = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("resume");