// routes/applicationRoutes.js
import express from 'express';
import {
  applyForJob,
  getRecruiterApplications
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('student'), applyForJob);
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterApplications);

export default router;