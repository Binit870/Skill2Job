import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";

dotenv.config();

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected...");

    const recruiterId = new mongoose.Types.ObjectId(
      "69c6afcb95d745adfdca5685"
    );
await Job.deleteMany(); // optional
   const jobs = [
  {
    title: "Frontend Developer",
    company: "Tech Nivaran",
    companyWebsite: "https://technivaran.in",
    companyDescription:
      "Tech Nivaran is basically SaaS (Software as a Service) company offering Application Development, Website Development and Digital Marketing.",
    companyLogo:
      "https://res.cloudinary.com/dnv2s05mm/image/upload/v1774629531/recruiter_logos/ah6b08n7pi3bsendnmsi.jpg",
    location: "Jamshedpur, Jharkhand",
    jobType: "Full-Time",
    experienceMin: 1,
    experienceMax: 3,
    salaryMin: 400000,
    salaryMax: 800000,
    vacancies: 2,
    skills: ["React", "JavaScript", "CSS"],
    description: "Build and maintain modern UI applications.",
    deadline: new Date("2026-06-30"),
    contact: {
      email: "technivaranltd@gmail.com",
      phone: "8709808570",
    },
    recruiter: recruiterId,
  },
  {
    title: "Backend Developer",
    company: "Tech Nivaran",
    companyWebsite: "https://technivaran.in",
    companyDescription:
      "Tech Nivaran is basically SaaS company offering Application Development, Website Development and Digital Marketing.",
    companyLogo:
      "https://res.cloudinary.com/dnv2s05mm/image/upload/v1774542124/recruiter_logos/svtnomqz0okslayzznoc.jpg",
    location: "Jamshedpur, Jharkhand",
    jobType: "Full-Time",
    experienceMin: 2,
    experienceMax: 5,
    salaryMin: 500000,
    salaryMax: 1000000,
    vacancies: 2,
    skills: ["Node.js", "MongoDB", "Express"],
    description: "Develop scalable backend APIs.",
    deadline: new Date("2026-07-15"),
    contact: {
      email: "technivaranltd@gmail.com",
      phone: "8709808570",
    },
    recruiter: recruiterId,
  },
  {
    title: "Full Stack Developer",
    company: "Tech Nivaran",
    companyWebsite: "https://technivaran.in",
    companyDescription:
      "Tech Nivaran is basically SaaS company offering Application Development, Website Development and Digital Marketing.",
    companyLogo:
      "https://res.cloudinary.com/dnv2s05mm/image/upload/v1774542124/recruiter_logos/svtnomqz0okslayzznoc.jpg",
    location: "Jamshedpur, Jharkhand",
    jobType: "Full-Time",
    experienceMin: 2,
    experienceMax: 4,
    salaryMin: 600000,
    salaryMax: 1200000,
    vacancies: 1,
    skills: ["React", "Node.js", "MongoDB"],
    description: "Work on full-stack development.",
    deadline: new Date("2026-07-30"),
    contact: {
      email: "technivaranltd@gmail.com",
      phone: "8709808570",
    },
    recruiter: recruiterId,
  },
  {
    title: "UI/UX Designer",
    company: "Tech Nivaran",
    companyWebsite: "https://technivaran.in",
    companyDescription:
      "Tech Nivaran is basically SaaS company offering Application Development, Website Development and Digital Marketing.",
    companyLogo:
      "https://res.cloudinary.com/dnv2s05mm/image/upload/v1774542124/recruiter_logos/svtnomqz0okslayzznoc.jpg",
    location: "Jamshedpur, Jharkhand",
    jobType: "Part-Time",
    experienceMin: 1,
    experienceMax: 3,
    salaryMin: 300000,
    salaryMax: 600000,
    vacancies: 1,
    skills: ["Figma", "Adobe XD"],
    description: "Design user-friendly interfaces.",
    deadline: new Date("2026-06-20"),
    contact: {
      email: "technivaranltd@gmail.com",
      phone: "8709808570",
    },
    recruiter: recruiterId,
  },
  {
    title: "DevOps Engineer",
    companyWebsite: "https://technivaran.in",
    companyDescription:
      "Tech Nivaran is basically SaaS company offering Application Development, Website Development and Digital Marketing.",
    companyLogo:
      "https://res.cloudinary.com/dnv2s05mm/image/upload/v1774542124/recruiter_logos/svtnomqz0okslayzznoc.jpg",
    company: "Tech Nivaran",
    location: "Remote",
    jobType: "Remote",
    experienceMin: 3,
    experienceMax: 6,
    salaryMin: 800000,
    salaryMax: 1500000,
    vacancies: 1,
    skills: ["AWS", "Docker", "CI/CD"],
    description: "Manage cloud and deployment pipelines.",
    deadline: new Date("2026-08-01"),
    contact: {
      email: "technivaranltd@gmail.com",
      phone: "8709808570",
    },
    recruiter: recruiterId,
  },
  {
    title: "QA Engineer",
    company: "Tech Nivaran",
    companyWebsite: "https://technivaran.in",
    companyDescription:
      "Tech Nivaran is basically SaaS company offering Application Development, Website Development and Digital Marketing.",
    companyLogo:
      "https://res.cloudinary.com/dnv2s05mm/image/upload/v1774542124/recruiter_logos/svtnomqz0okslayzznoc.jpg",
    location: "Jamshedpur, Jharkhand",
    jobType: "Full-Time",
    experienceMin: 1,
    experienceMax: 4,
    salaryMin: 300000,
    salaryMax: 700000,
    vacancies: 2,
    skills: ["Testing", "Selenium", "Jest"],
    description: "Ensure product quality and testing.",
    deadline: new Date("2026-07-10"),
    contact: {
      email: "technivaranltd@gmail.com",
      phone: "8709808570",
    },
    recruiter: recruiterId,
  },
  {
    title: "Mobile App Developer",
    company: "Tech Nivaran",
    companyWebsite: "https://technivaran.in",
    companyDescription:
      "Tech Nivaran is basically SaaS company offering Application Development, Website Development and Digital Marketing.",
    companyLogo:
      "https://res.cloudinary.com/dnv2s05mm/image/upload/v1774542124/recruiter_logos/svtnomqz0okslayzznoc.jpg",
    location: "Jamshedpur, Jharkhand",
    jobType: "Full-Time",
    experienceMin: 2,
    experienceMax: 5,
    salaryMin: 500000,
    salaryMax: 1000000,
    vacancies: 1,
    skills: ["React Native", "Flutter"],
    description: "Develop mobile applications.",
    deadline: new Date("2026-07-25"),
    contact: {
      email: "technivaranltd@gmail.com",
      phone: "8709808570",
    },
    recruiter: recruiterId,
  },
  {
    title: "Digital Marketing Executive",
    company: "Tech Nivaran",
    companyWebsite: "https://technivaran.in",
    companyDescription:
      "Tech Nivaran is basically SaaS company offering Application Development, Website Development and Digital Marketing.",
    companyLogo:
      "https://res.cloudinary.com/dnv2s05mm/image/upload/v1774542124/recruiter_logos/svtnomqz0okslayzznoc.jpg",
    location: "Jamshedpur, Jharkhand",
    jobType: "Full-Time",
    experienceMin: 1,
    experienceMax: 3,
    salaryMin: 250000,
    salaryMax: 500000,
    vacancies: 2,
    skills: ["SEO", "Google Ads"],
    description: "Handle marketing campaigns.",
    deadline: new Date("2026-06-25"),
    contact: {
      email: "technivaranltd@gmail.com",
      phone: "8709808570",
    },
    recruiter: recruiterId,
  },
  {
    title: "Content Writer",
    company: "Tech Nivaran",
    companyWebsite: "https://technivaran.in",
    companyDescription:
      "Tech Nivaran is basically SaaS company offering Application Development, Website Development and Digital Marketing.",
    companyLogo:
      "https://res.cloudinary.com/dnv2s05mm/image/upload/v1774542124/recruiter_logos/svtnomqz0okslayzznoc.jpg",
    location: "Remote",
    jobType: "Part-Time",
    experienceMin: 0,
    experienceMax: 2,
    salaryMin: 150000,
    salaryMax: 300000,
    vacancies: 2,
    skills: ["Writing", "SEO"],
    description: "Create blogs and content.",
    deadline: new Date("2026-06-18"),
    contact: {
      email: "technivaranltd@gmail.com",
      phone: "8709808570",
    },
    recruiter: recruiterId,
  },
  {
    title: "Data Analyst",
    company: "Tech Nivaran",
    companyWebsite: "https://technivaran.in",
    companyDescription:
      "Tech Nivaran is basically SaaS company offering Application Development, Website Development and Digital Marketing.",
    companyLogo:
      "https://res.cloudinary.com/dnv2s05mm/image/upload/v1774542124/recruiter_logos/svtnomqz0okslayzznoc.jpg",
    location: "Jamshedpur, Jharkhand",
    jobType: "Full-Time",
    experienceMin: 1,
    experienceMax: 4,
    salaryMin: 400000,
    salaryMax: 900000,
    vacancies: 1,
    skills: ["Python", "SQL", "Excel"],
    description: "Analyze business data and trends.",
    deadline: new Date("2026-07-05"),
    contact: {
      email: "technivaranltd@gmail.com",
      phone: "8709808570",
    },
    recruiter: recruiterId,
  },
];

  
    await Job.insertMany(jobs);

    console.log("Jobs seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedJobs();