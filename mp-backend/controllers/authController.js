import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendResetEmail from "../utils/sendResetEmail.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const ALLOWED_ROLES = ["student", "recruiter"];

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// ================== SIGNUP ==================
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !name.trim()) throw new AppError("Name is required", 400);
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new AppError("Please provide a valid email address", 400);
  }
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400);
  }
  if (!role || !ALLOWED_ROLES.includes(role)) {
    throw new AppError(`Role must be one of: ${ALLOWED_ROLES.join(", ")}`, 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) throw new AppError("An account with this email already exists", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// ================== LOGIN ==================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // Normalize + guard against non-string payloads (e.g. NoSQL-injection-style
  // objects like { "$ne": null }) being passed as email/password.
  if (typeof email !== "string" || typeof password !== "string") {
    throw new AppError("Invalid credentials", 400);
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const token = generateToken(user);

  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// ================== GET ME ==================
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new AppError("User not found", 404);

  res.status(200).json({ success: true, data: user });
});

// ================== FORGOT PASSWORD ==================
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string") {
    throw new AppError("Email is required", 400);
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  // Always return the same message to prevent email enumeration
  const genericResponse = {
    success: true,
    message: "If that email exists, a reset link has been sent.",
  };

  if (!user) return res.json(genericResponse);

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendResetEmail(email, resetLink);
  } catch (err) {
    // Don't leave the user with a dangling reset token if the email failed
    // to send, and don't leak email-provider errors to the client.
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
    console.error("sendResetEmail failed:", err);
    throw new AppError("Could not send reset email. Please try again later.", 502);
  }

  res.json(genericResponse);
});

// ================== RESET PASSWORD ==================
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new AppError("Invalid or expired reset token", 400);

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});
