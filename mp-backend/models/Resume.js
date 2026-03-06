import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  degreeType: { type: String, default: "bachelor" },
  institution: String,
  startYear: String,
  endYear: String,
  cgpa: String
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  address: String,
  summary: String,
  github: String,
  linkedin: String,
  portfolio: String,
  education: [educationSchema],
  experience: [String],
  skills: [String],
  projects: [String],
  achievements: [String],
  leadership: [String]
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);