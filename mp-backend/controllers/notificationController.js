import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// GET /api/notifications — most recent first, capped at 50
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

  res.status(200).json({ success: true, data: notifications, unreadCount });
});

// PATCH /api/notifications/:id/read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new AppError("Notification not found", 404);
  if (notification.user.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized", 403);
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({ success: true, data: notification });
});

// PATCH /api/notifications/read-all
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.status(200).json({ success: true, message: "All notifications marked as read" });
});
