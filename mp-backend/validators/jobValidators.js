// validators/jobValidators.js
import { body } from "express-validator";

const JOB_TYPES = ["Full-Time", "Part-Time", "Internship", "Remote", "Contract"];

export const createJobRules = [
  body("title").trim().notEmpty().withMessage("Job title is required")
    .isLength({ max: 150 }).withMessage("Job title is too long"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("description").trim().notEmpty().withMessage("Job description is required")
    .isLength({ max: 10000 }).withMessage("Job description is too long"),
  body("jobType").optional().isIn(JOB_TYPES).withMessage(`jobType must be one of: ${JOB_TYPES.join(", ")}`),
  body("experienceMin").optional().isInt({ min: 0 }).withMessage("experienceMin must be a non-negative number"),
  body("experienceMax").optional().isInt({ min: 0 }).withMessage("experienceMax must be a non-negative number"),
  body("salaryMin").optional().isFloat({ min: 0 }).withMessage("salaryMin must be a non-negative number"),
  body("salaryMax").optional().isFloat({ min: 0 }).withMessage("salaryMax must be a non-negative number"),
  body("vacancies").optional().isInt({ min: 1 }).withMessage("vacancies must be at least 1"),
  body("deadline").optional().isISO8601().withMessage("deadline must be a valid date"),
];

// Same shape, but every field is optional since this is a partial update
export const updateJobRules = [
  body("title").optional().trim().notEmpty().withMessage("Job title cannot be empty")
    .isLength({ max: 150 }).withMessage("Job title is too long"),
  body("location").optional().trim().notEmpty().withMessage("Location cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("Job description cannot be empty")
    .isLength({ max: 10000 }).withMessage("Job description is too long"),
  body("jobType").optional().isIn(JOB_TYPES).withMessage(`jobType must be one of: ${JOB_TYPES.join(", ")}`),
  body("experienceMin").optional().isInt({ min: 0 }).withMessage("experienceMin must be a non-negative number"),
  body("experienceMax").optional().isInt({ min: 0 }).withMessage("experienceMax must be a non-negative number"),
  body("salaryMin").optional().isFloat({ min: 0 }).withMessage("salaryMin must be a non-negative number"),
  body("salaryMax").optional().isFloat({ min: 0 }).withMessage("salaryMax must be a non-negative number"),
  body("vacancies").optional().isInt({ min: 1 }).withMessage("vacancies must be at least 1"),
  body("deadline").optional().isISO8601().withMessage("deadline must be a valid date"),
];
