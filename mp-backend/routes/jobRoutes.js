// routes/jobRoutes.js
import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
  deleteJob,
  closeJob, reopenJob,
  getSavedJobs, toggleSaveJob,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validate.js';
import { createJobRules, updateJobRules } from '../validators/jobValidators.js';

const router = express.Router();

// Public routes
router.get('/', getAllJobs);
router.get('/recruiter/my-jobs', protect, authorize('recruiter'), getRecruiterJobs);
// NOTE: must be registered before '/:id' — otherwise Express would treat
// "saved" as the :id param and this route would never be reached.
router.get('/saved', protect, authorize('student'), getSavedJobs);
router.get('/:id', getJobById);

// Protected recruiter routes
router.post('/', protect, authorize('recruiter'), createJobRules, validate, createJob);
router.put('/:id', protect, authorize('recruiter'), updateJobRules, validate, updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);
router.patch('/:id/close', protect, authorize('recruiter'), closeJob);
router.patch('/:id/reopen', protect, authorize('recruiter'), reopenJob);

// Protected student routes
router.patch('/:id/save', protect, authorize('student'), toggleSaveJob);

export default router;