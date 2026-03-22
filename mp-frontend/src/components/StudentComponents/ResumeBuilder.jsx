import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];

// 👇 INDIA KI SAARI MAJOR LANGUAGES LIST
const INDIAN_LANGUAGES = [
  "Hindi", "English", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", 
  "Malayalam", "Punjabi", "Sanskrit", "Assamese", "Maithili", "Santali", "Kashmiri", "Nepali", "Sindhi", 
  "Konkani", "Dogri", "Manipuri", "Bodo", "Khasi", "Garo", "Mizo", "Haryanvi", "Bhojpuri", "Rajasthani"
];

const DEGREE_OPTIONS = [
  "10th Standard", "12th Standard",
  "B.Tech - Computer Science", "B.Tech - Information Technology", "B.Tech - Mechanical Engineering", "B.Tech - Electrical Engineering", "B.Tech - Electronics & Communication", "B.Tech - Civil Engineering",
  "BCA (Bachelor of Computer Applications)", "B.Sc - Computer Science", "B.Sc - IT", "B.Sc - Mathematics",
  "B.Com", "BBA", "BA", 
  "M.Tech - Computer Science", "MCA (Master of Computer Applications)", "M.Sc - IT", "MBA", "Other"
];

const JOB_ROLES = [
  "Web Developer", "Frontend Developer", "Backend Developer", "Full Stack Developer", 
  "MERN Stack Developer", "Software Engineer", "Software Developer Intern", "Java Developer", 
  "Python Developer", "React Developer", "Mobile App Developer", "UI/UX Designer", 
  "Data Scientist", "DevOps Engineer", "Cybersecurity Analyst", "AI/ML Engineer"
];

const SKILLS_OPTIONS = {
  languages: ["JavaScript", "TypeScript", "Java", "Python", "C", "C++", "C#", "PHP", "Go", "Rust"],
  frontend: ["HTML5", "CSS3", "JavaScript", "React.js", "Next.js", "Vue.js", "Tailwind CSS", "Bootstrap", "Material UI"],
  backend: ["Node.js", "Express.js", "Django", "Flask", "Spring Boot", "REST API", "GraphQL"],
  database: ["MongoDB", "MySQL", "PostgreSQL", "Firebase", "Redis", "Oracle"],
  tools: ["Git", "GitHub", "VS Code", "Postman", "npm", "Docker", "Netlify", "Vercel"],
  others: ["JWT Authentication", "API Integration", "Responsive Web Design", "CRUD Operations", "Unit Testing"]
};

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fn: "", e: "", ph: "", ad: "", sm: "", gh: "", li: "", pf: "",
    ed: [{ degreeType: "B.Tech - Computer Science", institution: "", state: "", startYear: "", endYear: "", cgpa: "" }],
    ex: [{ role: "", company: "", startDate: "", endDate: "", location: "", desc: "", projectUrl: "" }], 
    skills: { languages: "", frontend: "", backend: "", database: "", tools: "", others: "" },
    pr: [{ name: "", description: "", link: "" }], 
    cer: [{ courseName: "", platform: "", issueDate: "", certificateLink: "" }], 
    ach: [{ academic: "", project: "", technical: "", leadership: "" }], 
    lang: [""] 
  });

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/resume", { headers: { Authorization: `Bearer ${token}` } });
        if (res.data?.success) {
          const d = res.data.data;
          setFormData({
            fn: d.fullName || "", e: d.email || "", ph: d.phone || "", ad: d.address || "", sm: d.summary || "",
            gh: d.github || "", li: d.linkedin || "", pf: d.portfolio || "",
            ed: d.education?.length ? d.education : formData.ed,
            ex: d.experience?.length ? d.experience : formData.ex,
            skills: d.skillsCategorized || formData.skills,
            pr: d.projects?.length ? d.projects : formData.pr, 
            cer: d.certifications?.length ? d.certifications : formData.cer,
            ach: d.achievementsStructured?.length ? d.achievementsStructured : formData.ach,
            lang: d.languagesKnown?.length ? d.languagesKnown : [""]
          });
        }
      } catch (err) { console.log("New User Setup"); }
    };
    fetchResume();
  }, []);

  const handleSkillChange = (category, value) => {
    setFormData({ ...formData, skills: { ...formData.skills, [category]: value } });
  };

  const handleEduChange = (index, field, value) => {
    const updatedEd = [...formData.ed];
    updatedEd[index] = { ...updatedEd[index], [field]: value };
    setFormData({ ...formData, ed: updatedEd });
  };

  const handleExChange = (index, field, value) => {
    const updatedEx = [...formData.ex];
    updatedEx[index] = { ...updatedEx[index], [field]: value };
    setFormData({ ...formData, ex: updatedEx });
  };

  const handlePrChange = (index, field, value) => {
    const updatedPr = [...formData.pr];
    updatedPr[index] = { ...updatedPr[index], [field]: value };
    setFormData({ ...formData, pr: updatedPr });
  };

  const handleCerChange = (index, field, value) => {
    const updatedCer = [...formData.cer];
    updatedCer[index] = { ...updatedCer[index], [field]: value };
    setFormData({ ...formData, cer: updatedCer });
  };

  const handleAchChange = (index, field, value) => {
    const updatedAch = [...formData.ach];
    updatedAch[index] = { ...updatedAch[index], [field]: value };
    setFormData({ ...formData, ach: updatedAch });
  };

  const handleChange = (e, section, index) => {
    if (section === "main") return setFormData({ ...formData, [e.target.name]: e.target.value });
    const updated = [...formData[section]];
    updated[index] = e.target.value;
    setFormData({ ...formData, [section]: updated });
  };

  const addField = (sec, type = "string") => {
    let newVal = "";
    if (type === "edu") newVal = { degreeType: "B.Tech - Computer Science", institution: "", state: "", startYear: "", endYear: "", cgpa: "" };
    if (type === "exp") newVal = { role: "", company: "", startDate: "", endDate: "", location: "", desc: "", projectUrl: "" };
    if (type === "proj") newVal = { name: "", description: "", link: "" };
    if (type === "cert") newVal = { courseName: "", platform: "", issueDate: "", certificateLink: "" };
    if (type === "ach") newVal = { academic: "", project: "", technical: "", leadership: "" };
    
    setFormData({ ...formData, [sec]: [...formData[sec], newVal] });
  };

  const removeField = (sec, index) => formData[sec].length > 1 && setFormData({ ...formData, [sec]: formData[sec].filter((_, i) => i !== index) });

  const handlePreview = () => {
    if (!formData.fn.trim()) return toast.error("Enter your name first!");
    navigate("/student/resume-view", { state: { resume: formData } });
  };

  const saveResume = async () => {
    if (!formData.fn.trim() || !formData.e.trim()) return toast.error("Name & Email required!");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const cleanData = {
        fullName: formData.fn, email: formData.e, phone: formData.ph, address: formData.ad, 
        summary: formData.sm, github: formData.gh, linkedin: formData.li, portfolio: formData.pf,
        education: formData.ed.filter(edu => edu.institution),
        experience: formData.ex.filter(exp => exp.company || exp.role), 
        skillsCategorized: formData.skills,
        projects: formData.pr.filter(p => p.name), 
        certifications: formData.cer.filter(c => c.courseName),
        achievementsStructured: formData.ach.filter(a => a.academic || a.project || a.technical || a.leadership),
        languagesKnown: formData.lang.filter(i => i.trim())
      };
      await axios.post("http://localhost:5000/api/resume/create", cleanData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Saved! 🎉");
      navigate("/student/resume");
    } catch (err) { toast.error("Save failed"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-xl font-bold text-black uppercase tracking-tight">Resume Builder</h1>
            <button onClick={handlePreview} className="px-6 py-2 bg-black text-white rounded-full font-bold active:scale-95 shadow-md hover:bg-gray-900 transition">
              Preview 📄
            </button>
          </div>

          <div className="space-y-8">
            {/* PERSONAL DETAILS */}
            <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h2 className="text-xs font-bold mb-4 text-black uppercase border-b border-gray-200 pb-1 tracking-widest">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{l: "Full Name *", n: "fn"}, {l: "Email Address *", n: "e"}, {l: "Phone", n: "ph"}, {l: "City, State", n: "ad"}, {l: "GitHub", n: "gh"}, {l: "LinkedIn", n: "li"}, {l: "Portfolio", n: "pf"}].map((f) => (
                  <div key={f.n} className={`flex flex-col gap-1 ${f.n === 'pf' ? 'md:col-span-2' : ''}`}>
                    <label className="text-xs font-semibold text-gray-600 uppercase ml-1">{f.l}</label>
                    <input name={f.n} value={formData[f.n]} onChange={e => handleChange(e, "main")} className="border border-gray-300 p-2 rounded text-xs text-black font-medium focus:border-black outline-none bg-white transition-all" placeholder={f.l} />
                  </div>
                ))}
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Professional Summary</label>
                  <textarea name="sm" value={formData.sm} onChange={e => handleChange(e, "main")} rows="2" className="border border-gray-300 p-2 rounded text-xs text-black font-medium focus:border-black outline-none bg-white resize-none transition-all" placeholder="Brief Summary..." />
                </div>
              </div>
            </section>

            {/* TECHNICAL SKILLS */}
            <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h2 className="text-xs font-bold mb-4 text-black uppercase border-b border-gray-200 pb-1 tracking-widest">Technical Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(SKILLS_OPTIONS).map((key) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600 uppercase ml-1 capitalize">{key}</label>
                    <input list={`list-${key}`} value={formData.skills[key]} onChange={e => handleSkillChange(key, e.target.value)} className="border border-gray-300 p-2 rounded text-xs text-black font-medium focus:border-black outline-none bg-white transition-all" placeholder={`Select ${key}...`} />
                    <datalist id={`list-${key}`}>{SKILLS_OPTIONS[key].map(opt => <option key={opt} value={opt} />)}</datalist>
                  </div>
                ))}
              </div>
            </section>

            {/* PROJECT DETAILS */}
            <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h2 className="text-xs font-bold mb-4 text-black uppercase border-b border-gray-200 pb-1 tracking-widest">Project Details</h2>
              {formData.pr.map((proj, i) => (
                <div key={i} className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded relative space-y-4 text-black">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase ml-1">Project Name</label>
                      <input value={proj.name} onChange={e => handlePrChange(i, "name", e.target.value)} className="border border-gray-300 p-2 rounded text-xs font-medium" placeholder="Project Name" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase ml-1">Project Link</label>
                      <input value={proj.link} onChange={e => handlePrChange(i, "link", e.target.value)} className="border border-gray-300 p-2 rounded text-xs font-medium" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase ml-1">Detailed Description</label>
                    <textarea value={proj.description} onChange={e => handlePrChange(i, "description", e.target.value)} rows="2" className="border border-gray-300 p-2 rounded text-xs resize-none" placeholder="Describe your project work..." />
                  </div>
                  {i > 0 && <button onClick={() => removeField("pr", i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg shadow">×</button>}
                </div>
              ))}
              <button onClick={() => addField("pr", "proj")} className="text-xs text-black font-bold border-b border-black">+ Add Project</button>
            </section>

            {/* EDUCATION */}
            <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h2 className="text-xs font-bold mb-4 text-black uppercase border-b border-gray-200 pb-1 tracking-widest">Education</h2>
              {formData.ed.map((edu, i) => (
                <div key={i} className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded relative space-y-4 text-black">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">Institution</label><input value={edu.institution} onChange={e => handleEduChange(i, "institution", e.target.value)} className="border border-gray-300 p-2 rounded text-xs font-medium" /></div>
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">Degree</label><select value={edu.degreeType} onChange={e => handleEduChange(i, "degreeType", e.target.value)} className="border border-gray-300 p-2 rounded text-xs bg-white">{DEGREE_OPTIONS.map(deg => <option key={deg} value={deg}>{deg}</option>)}</select></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">State</label><select value={edu.state} onChange={e => handleEduChange(i, "state", e.target.value)} className="border border-gray-300 p-2 rounded text-xs bg-white"><option value="">Select State</option>{INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">Score (CGPA / %)</label><input value={edu.cgpa} onChange={e => handleEduChange(i, "cgpa", e.target.value)} className="border border-gray-300 p-2 rounded text-xs font-medium" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">Start Date</label><input type="date" value={edu.startYear} onChange={e => handleEduChange(i, "startYear", e.target.value)} className="border border-gray-300 p-2 rounded text-xs" /></div>
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">End Date</label><input type="date" value={edu.endYear} onChange={e => handleEduChange(i, "endYear", e.target.value)} className="border border-gray-300 p-2 rounded text-xs" /></div>
                  </div>
                  {i > 0 && <button onClick={() => removeField("ed", i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg shadow">×</button>}
                </div>
              ))}
              <button onClick={() => addField("ed", "edu")} className="text-xs text-black font-bold border-b border-black">+ Add Education Entry</button>
            </section>

            {/* EXPERIENCE */}
            <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h2 className="text-xs font-bold mb-4 text-black uppercase border-b border-gray-200 pb-1 tracking-widest">Experience</h2>
              {formData.ex.map((exp, i) => (
                <div key={i} className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded relative space-y-4 text-black">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">Role</label><select value={exp.role} onChange={e => handleExChange(i, "role", e.target.value)} className="border border-gray-300 p-2 rounded text-xs bg-white">{JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">Company</label><input value={exp.company} onChange={e => handleExChange(i, "company", e.target.value)} className="border border-gray-300 p-2 rounded text-xs" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">Start Date</label><input type="date" value={exp.startDate} onChange={e => handleExChange(i, "startDate", e.target.value)} className="border border-gray-300 p-2 rounded text-xs" /></div>
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">End Date</label><input type="date" value={exp.endDate} onChange={e => handleExChange(i, "endDate", e.target.value)} className="border border-gray-300 p-2 rounded text-xs" /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">Location</label><input value={exp.location} onChange={e => handleExChange(i, "location", e.target.value)} className="border border-gray-300 p-2 rounded text-xs" placeholder="e.g. Remote" /></div>
                    <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">Project URL</label><input value={exp.projectUrl} onChange={e => handleExChange(i, "projectUrl", e.target.value)} className="border border-gray-300 p-2 rounded text-xs" placeholder="https://..." /></div>
                  </div>
                  <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase ml-1 text-black">Responsibilities</label><textarea value={exp.desc} onChange={e => handleExChange(i, "desc", e.target.value)} rows="3" className="border border-gray-300 p-2 rounded text-xs resize-none" /></div>
                  {i > 0 && <button onClick={() => removeField("ex", i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg shadow">×</button>}
                </div>
              ))}
              <button onClick={() => addField("ex", "exp")} className="text-xs text-black font-bold border-b border-black">+ Add Experience</button>
            </section>

            {/* CERTIFICATIONS */}
            <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h2 className="text-xs font-bold mb-4 text-black uppercase border-b border-gray-200 pb-1 tracking-widest">Certifications</h2>
              {formData.cer.map((cert, i) => (
                <div key={i} className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded relative space-y-4 text-black">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase ml-1">Course Name</label>
                      <input value={cert.courseName} onChange={e => handleCerChange(i, "courseName", e.target.value)} className="border border-gray-300 p-2 rounded text-xs font-medium" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase ml-1">Platform / Institution</label>
                      <input value={cert.platform} onChange={e => handleCerChange(i, "platform", e.target.value)} className="border border-gray-300 p-2 rounded text-xs font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase ml-1">Issue Date</label>
                      <input type="date" value={cert.issueDate} onChange={e => handleCerChange(i, "issueDate", e.target.value)} className="border border-gray-300 p-2 rounded text-xs" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase ml-1">Certification Link</label>
                      <input value={cert.certificateLink} onChange={e => handleCerChange(i, "certificateLink", e.target.value)} className="border border-gray-300 p-2 rounded text-xs font-medium" placeholder="https://..." />
                    </div>
                  </div>
                  {i > 0 && <button onClick={() => removeField("cer", i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg shadow">×</button>}
                </div>
              ))}
              <button onClick={() => addField("cer", "cert")} className="text-xs text-black font-bold border-b border-black">+ Add Certification</button>
            </section>

            {/* ACHIEVEMENTS */}
            <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h2 className="text-xs font-bold mb-4 text-black uppercase border-b border-gray-200 pb-1 tracking-widest">Achievements</h2>
              {formData.ach.map((ach, i) => (
                <div key={i} className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded relative space-y-4 text-black">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase ml-1">Academic Achievements</label>
                      <input value={ach.academic} onChange={e => handleAchChange(i, "academic", e.target.value)} className="border border-gray-300 p-2 rounded text-xs font-medium" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase ml-1">Project Achievements</label>
                      <input value={ach.project} onChange={e => handleAchChange(i, "project", e.target.value)} className="border border-gray-300 p-2 rounded text-xs font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase ml-1">Technical Achievements</label>
                      <input value={ach.technical} onChange={e => handleAchChange(i, "technical", e.target.value)} className="border border-gray-300 p-2 rounded text-xs font-medium" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase ml-1">Leadership Achievements</label>
                      <input value={ach.leadership} onChange={e => handleAchChange(i, "leadership", e.target.value)} className="border border-gray-300 p-2 rounded text-xs font-medium" />
                    </div>
                  </div>
                  {i > 0 && <button onClick={() => removeField("ach", i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 shadow">×</button>}
                </div>
              ))}
              <button onClick={() => addField("ach", "ach")} className="text-xs text-black font-bold border-b border-black">+ Add Achievement Box</button>
            </section>

            {/* LANGUAGES KNOWN (WITH DROPDOWN) */}
            <section className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
              <h2 className="text-xs font-bold mb-4 text-black uppercase border-b border-gray-200 pb-1 tracking-widest">Languages Known</h2>
              {formData.lang.map((v, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input list="lang-list" value={v} onChange={e => handleChange(e, "lang", i)} className="flex-1 border border-gray-300 p-2 rounded text-xs font-medium text-black bg-white focus:border-black outline-none" placeholder="Select/Type Language..." />
                  <datalist id="lang-list">
                    {INDIAN_LANGUAGES.map(lang => <option key={lang} value={lang} />)}
                  </datalist>
                  {i > 0 && <button onClick={() => removeField("lang", i)} className="text-red-500 font-bold px-2">×</button>}
                </div>
              ))}
              <button onClick={() => addField("lang")} className="text-[10px] text-black font-bold border-b border-black">+ Add Language</button>
            </section>

            <button onClick={saveResume} disabled={loading} className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-md hover:bg-gray-900 active:scale-95 uppercase tracking-widest transition-all">
              {loading ? "Saving..." : "Save Resume"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;