// routes/jobRoutes.js
import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
  deleteJob,
  closeJob
} from '../controllers/jobController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected recruiter routes
router.post('/', protect, authorize('recruiter'), createJob);
router.get('/recruiter/my-jobs', protect, authorize('recruiter'), getRecruiterJobs);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);
router.patch('/:id/close', protect, authorize('recruiter'), closeJob);

export default router;