// validators/applicationValidators.js
import { body } from "express-validator";

export const applyForJobRules = [
  body("jobId").notEmpty().withMessage("jobId is required")
    .isMongoId().withMessage("jobId must be a valid ID"),
  body("coverLetter").optional().isLength({ max: 5000 }).withMessage("Cover letter is too long"),
  body("phone").optional().trim().isLength({ max: 20 }).withMessage("Phone number is too long"),
  body("portfolioUrl").optional({ checkFalsy: true }).isURL().withMessage("Portfolio URL is not valid"),
];

export const updateApplicationStatusRules = [
  body("status")
    .notEmpty().withMessage("status is required")
    .isIn(["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"])
    .withMessage("Invalid status value"),
  body("recruiterNote").optional().isLength({ max: 2000 }).withMessage("Note is too long"),
];
