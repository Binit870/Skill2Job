// validators/profileValidators.js
import { body } from "express-validator";

export const updateStudentProfileRules = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty")
    .isLength({ max: 100 }).withMessage("Name is too long"),
  body("email").optional().isEmail().withMessage("Please provide a valid email address"),
  body("phone").optional().trim().isLength({ max: 20 }).withMessage("Phone number is too long"),
  body("graduationYear").optional().isInt({ min: 1950, max: 2100 }).withMessage("Invalid graduation year"),
  body("cgpa").optional().isFloat({ min: 0, max: 10 }).withMessage("CGPA must be between 0 and 10"),
];

export const updateRecruiterProfileRules = [
  body("companyName").optional().trim().notEmpty().withMessage("Company name cannot be empty")
    .isLength({ max: 150 }).withMessage("Company name is too long"),
  body("companyWebsite").optional({ checkFalsy: true }).isURL().withMessage("Company website is not a valid URL"),
  body("companyDescription").optional().isLength({ max: 3000 }).withMessage("Company description is too long"),
];
