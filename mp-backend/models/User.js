import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },

    // ================= STUDENT FIELDS =================
    phone: {
      type: String,
    },

    college: {
      type: String,
    },

    branch: {
      type: String,
    },

    graduationYear: {
      type: Number,
    },

    cgpa: {
      type: Number,
    },

    skills: [
      {
        type: String,
      },
    ],
    profileImage: {
      type: String,
      default: "",
    },
    resume: {
  type: String,
  default: "",
},


    // ================= RECRUITER FIELDS =================
    companyName: {
      type: String,
    },

    companyWebsite: {
      type: String,
    },

    companyDescription: {
      type: String,
    },

    industry: {
      type: String,
    },

    companyLocation: {
      type: String,
    },



    companyLogo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);