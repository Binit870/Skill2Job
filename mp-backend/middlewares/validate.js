// middlewares/validate.js
import { validationResult } from "express-validator";
import AppError from "../utils/AppError.js";

// Drop this after any express-validator rule chain:
//   router.post("/", createJobRules, validate, createJob)
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const message = errors
    .array({ onlyFirstError: true })
    .map((e) => e.msg)
    .join(", ");

  next(new AppError(message, 400));
};

export default validate;
