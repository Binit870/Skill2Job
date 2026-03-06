import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Uploads directory created');
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// ✅ FIXED: Allow PDF files (not just images)
const fileFilter = (req, file, cb) => {
  console.log("📁 Received file type:", file.mimetype);
  console.log("📁 File name:", file.originalname);
  
  // Allow PDF files
  if (file.mimetype === 'application/pdf') {
    console.log("✅ PDF file accepted");
    cb(null, true);
  } 
  // Also allow common image types if needed
  else if (file.mimetype.startsWith('image/')) {
    console.log("✅ Image file accepted");
    cb(null, true);
  }
  else {
    console.log("❌ File rejected - not PDF or image:", file.mimetype);
    cb(new Error('Only PDF files are allowed for resume upload'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;