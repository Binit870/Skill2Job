import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // Who sees this notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "application_submitted",  // recruiter: someone applied to your job
        "application_status",     // student: your application status changed
        "job_posted",             // reserved for future use
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    // Where clicking the notification should take the user
    link: { type: String, default: "" },
    read: { type: Boolean, default: false, index: true },

    // Optional references so the frontend can deep-link / dedupe
    relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    relatedApplication: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
