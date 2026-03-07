import mongoose from 'mongoose';

// 1. Education Schema
const educationSchema = new mongoose.Schema({
  degreeType: { type: String },
  institution: String,
  state: String,
  startYear: String,
  endYear: String,
  cgpa: String
}, { _id: false });

// 2. Experience Schema
const experienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  startDate: String,
  endDate: String,
  location: String,
  desc: String,
  projectUrl: String
}, { _id: false });

// 3. Skills Categorized Schema
const skillsSchema = new mongoose.Schema({
  languages: String,
  frontend: String,
  backend: String,
  database: String,
  tools: String,
  others: String
}, { _id: false });

// 4. Structured Projects Schema (NEW)
const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  link: String
}, { _id: false });

// 5. Structured Certifications Schema (NEW)
const certificationSchema = new mongoose.Schema({
  courseName: String,
  platform: String,
  issueDate: String,
  certificateLink: String
}, { _id: false });

// 6. Structured Achievements Schema (NEW)
const achievementSchema = new mongoose.Schema({
  academic: String,
  project: String,
  technical: String,
  leadership: String
}, { _id: false });

// MAIN RESUME SCHEMA
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

  // Object Arrays for Structured Data
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],        // Updated from String to Object
  certifications: [certificationSchema], // Updated from String to Object
  achievements: [achievementSchema],     // Updated from String to Object
  
  // Categorized Skills
  skillsCategorized: skillsSchema,
  
  // Basic Arrays
  languagesKnown: [String],
  skills: [String], // General skills list if needed
  leadership: [String]
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);