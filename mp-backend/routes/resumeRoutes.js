import express from 'express';
import { 
  analyzeResume,
  getLatest,
  getResume,
  createOrUpdateResume,
  deleteResume
} from '../controllers/resumeController.js';
import auth from '../middlewares/authMiddleware.js';  // 👈 PATH SAHI KIYA
import upload from '../middlewares/uploadMiddleware.js';  // 👈 PATH SAHI KIYA

const router = express.Router();

// Test route
router.post('/test', (req, res) => {
  console.log("✅ Test route hit!");
  res.json({ 
    success: true, 
    message: "Test successful! Backend is working.",
    receivedData: req.body 
  });
});

// Protected routes
router.post('/analyze', auth, upload.single('resume'), analyzeResume);
router.get('/latest', auth, getLatest);
router.get('/', auth, getResume);
router.post('/create', auth, createOrUpdateResume);
router.delete('/', auth, deleteResume);

export default router;