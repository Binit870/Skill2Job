import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/api.js"
import {
  RiArrowLeftLine,
  RiEyeLine,
  RiAddLine,
  RiCloseLine,
  RiSaveLine,
  RiArrowDownSLine,
  RiLoader4Line,
  RiUser3Line,
  RiToolsLine,
  RiCodeBoxLine,
  RiBookOpenLine,
  RiBriefcaseLine,
  RiAwardLine,
  RiTrophyLine,
  RiTranslate2,
} from "react-icons/ri";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];
const DEGREE_OPTIONS = [
  "10th Standard", "12th Standard",
  "B.Tech - Computer Science", "B.Tech - Information Technology", "B.Tech - Mechanical Engineering",
  "B.Tech - Electrical Engineering", "B.Tech - Electronics & Communication", "B.Tech - Civil Engineering",
  "BCA (Bachelor of Computer Applications)", "B.Sc - Computer Science", "B.Sc - IT", "B.Sc - Mathematics",
  "B.Com", "BBA", "BA", "M.Tech - Computer Science", "MCA (Master of Computer Applications)", "M.Sc - IT", "MBA", "Other"
];
const JOB_ROLES = [
  "Web Developer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "MERN Stack Developer", "Software Engineer", "Software Developer Intern", "Java Developer",
  "Python Developer", "React Developer", "Mobile App Developer", "UI/UX Designer",
  "Data Scientist", "DevOps Engineer", "Cybersecurity Analyst", "AI/ML Engineer"
];

const INIT = {
  fn: "", e: "", ph: "", ad: "", sm: "", gh: "", li: "", pf: "",
  ed: [{ degreeType: "B.Tech - Computer Science", institution: "", state: "", startYear: "", endYear: "", cgpa: "" }],
  ex: [{ role: "", company: "", startDate: "", endDate: "", location: "", desc: "", projectUrl: "" }],
  skills: { technical: "", professional: "" },
  pr: [{ name: "", description: "", link: "" }],
  cer: [{ courseName: "", platform: "", issueDate: "", certificateLink: "" }],
  ach: [""],
  lang: [""]
};

const tok = () => sessionStorage.getItem("token");
const auth = () => ({ Authorization: `Bearer ${tok()}` });

/* ── Field component ── */
const inputCls = "w-full min-w-0 border border-mist rounded-xl px-3 py-2.5 text-sm text-ink bg-white placeholder:text-ink/35 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-colors";

const Field = ({ label, span2, as, type, rows, placeholder, value, onChange, children }) => (
  <div className={`flex flex-col gap-1 min-w-0${span2 ? " sm:col-span-2" : ""}`}>
    <label className="text-xs font-semibold text-ink/60">{label}</label>
    {type === "textarea" ? (
      <textarea className={`${inputCls} resize-y min-h-[78px]`} rows={rows || 2} placeholder={placeholder} value={value} onChange={onChange} />
    ) : as === "select" ? (
      <div className="relative flex items-center min-w-0">
        <select className={`${inputCls} pr-8 cursor-pointer appearance-none`} value={value} onChange={onChange}>{children}</select>
        <RiArrowDownSLine className="absolute right-3 w-3.5 h-3.5 text-ink/35 pointer-events-none" />
      </div>
    ) : (
      <input className={inputCls} type={type || "text"} placeholder={placeholder} value={value} onChange={onChange} />
    )}
  </div>
);

/* ── Section heading ── */
const SecHead = ({ icon, label }) => (
  <p className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-ink/40 mb-5">
    <span className="w-6.5 h-6.5 bg-pine/10 rounded-lg flex items-center justify-center text-pine text-sm shrink-0">{icon}</span>
    {label}
    <span className="flex-1 h-px bg-mist" />
  </p>
);

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [fd, setFd] = useState(() => {
    const saved = sessionStorage.getItem("resume_draft");
    return saved ? JSON.parse(saved) : INIT;
  });

  useEffect(() => {
    sessionStorage.setItem("resume_draft", JSON.stringify(fd));
  }, [fd]);



  const set = (patch) => setFd(p => ({ ...p, ...patch }));
  const setArr = (key, i, patch) => setFd(p => {
    const a = [...p[key]]; a[i] = { ...a[i], ...patch }; return { ...p, [key]: a };
  });
  const addItem = (key, blank) => setFd(p => ({ ...p, [key]: [...p[key], blank] }));
  const rm = (key, i) => fd[key].length > 1 &&
    setFd(p => ({ ...p, [key]: p[key].filter((_, j) => j !== i) }));

  const handlePreview = () => {
    if (!fd.fn.trim()) return toast.error("Enter your name first!");
    navigate("/student/resume-view", { state: { resume: fd } });
  };

  const saveResume = async () => {
    if (!fd.fn.trim() || !fd.e.trim()) return toast.error("Name & Email required!");
    setLoading(true);
    try {
      const payload = {
        fullName: fd.fn, email: fd.e, phone: fd.ph, address: fd.ad, summary: fd.sm,
        github: fd.gh, linkedin: fd.li, portfolio: fd.pf,
        education: fd.ed.filter(e => e.institution),
        experience: fd.ex.filter(e => e.company || e.role),
        skillsCategorized: fd.skills,
        projects: fd.pr.filter(p => p.name),
        certifications: fd.cer.filter(c => c.courseName),
        achievementsStructured: fd.ach.filter(a => typeof a === "string" ? a.trim() : Object.values(a).some(Boolean)),
        languagesKnown: fd.lang.filter(l => l.trim()),
      };
      await API.post(`/api/resume/create`, payload, { headers: auth() });
      toast.success("Resume saved successfully");
      navigate("/student/resume");
    } catch { toast.error("Save failed"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div className="min-h-screen bg-paper flex justify-center px-3 sm:px-5 py-8 pb-20">
        <div className="w-full max-w-[860px]">

          {/* Header */}
          <div className="bg-ink rounded-2xl px-4 sm:px-6 py-4 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <button className="w-9 h-9 shrink-0 bg-white/10 border border-white/15 text-white rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors" onClick={() => navigate(-1)} title="Go Back">
                <RiArrowLeftLine />
              </button>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gold mb-0.5">Career Tools</p>
                <h1 className="font-display text-lg sm:text-2xl font-bold text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis">Resume <span className="text-gold">Builder</span></h1>
              </div>
            </div>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl text-xs font-semibold hover:bg-white/20 transition-colors whitespace-nowrap shrink-0" onClick={handlePreview}>
              <RiEyeLine /> <span>Preview</span>
            </button>
          </div>

          {/* ── Personal Details ── */}
          <div className="bg-white border border-mist rounded-2xl p-5 sm:p-6 mb-4 shadow-card">
            <SecHead icon={<RiUser3Line />} label="Personal Details" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Full Name *" placeholder="e.g. Rahul Sharma" value={fd.fn} onChange={e => set({ fn: e.target.value })} />
              <Field label="Email Address *" placeholder="e.g. rahul@gmail.com" value={fd.e} onChange={e => set({ e: e.target.value })} />
              <Field label="Phone" placeholder="e.g. +91 98765 43210" value={fd.ph} onChange={e => set({ ph: e.target.value })} />
              <Field label="City, State" placeholder="e.g. Bengaluru, Karnataka" value={fd.ad} onChange={e => set({ ad: e.target.value })} />
              <Field label="GitHub" placeholder="e.g. github.com/rahulsharma" value={fd.gh} onChange={e => set({ gh: e.target.value })} />
              <Field label="LinkedIn" placeholder="e.g. linkedin.com/in/rahulsharma" value={fd.li} onChange={e => set({ li: e.target.value })} />
              <Field label="Portfolio" placeholder="e.g. https://rahulsharma.dev" value={fd.pf} onChange={e => set({ pf: e.target.value })} span2 />
              <Field label="Professional Summary" type="textarea" rows={3} placeholder="e.g. Passionate Full Stack Developer with 2 years of experience building scalable web applications..." value={fd.sm} onChange={e => set({ sm: e.target.value })} span2 />
            </div>
          </div>

          {/* ── Skills ── */}
          <div className="bg-white border border-mist rounded-2xl p-5 sm:p-6 mb-4 shadow-card">
            <SecHead icon={<RiToolsLine />} label="Skills" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Technical Skills" placeholder="e.g. HTML, CSS, React, Node.js, MongoDB" value={fd.skills.technical} onChange={e => set({ skills: { ...fd.skills, technical: e.target.value } })} />
              <Field label="Professional Skills" placeholder="e.g. Communication, Teamwork, Leadership" value={fd.skills.professional} onChange={e => set({ skills: { ...fd.skills, professional: e.target.value } })} />
            </div>
          </div>

          {/* ── Projects ── */}
          <div className="bg-white border border-mist rounded-2xl p-5 sm:p-6 mb-4 shadow-card">
            <SecHead icon={<RiCodeBoxLine />} label="Project Details" />
            {fd.pr.map((proj, i) => (
              <div key={i} className="bg-paper/60 border border-mist rounded-xl p-4 mb-3 relative">
                {i > 0 && <button className="absolute top-2.5 right-2.5 w-6.5 h-6.5 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors" onClick={() => rm("pr", i)}><RiCloseLine /></button>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Project Name" placeholder="e.g. E-Commerce Website" value={proj.name} onChange={e => setArr("pr", i, { name: e.target.value })} />
                  <Field label="Project Link" placeholder="e.g. https://github.com/user/project" value={proj.link} onChange={e => setArr("pr", i, { link: e.target.value })} />
                  <Field label="Description" type="textarea" placeholder="e.g. Built a full-stack e-commerce app using React and Node.js with payment integration..." value={proj.description} onChange={e => setArr("pr", i, { description: e.target.value })} span2 />
                </div>
              </div>
            ))}
            <button className="inline-flex items-center gap-1.5 bg-pine/8 text-pine border border-dashed border-pine/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-pine/15 hover:border-pine/50 transition-colors mt-1" onClick={() => addItem("pr", { name: "", description: "", link: "" })}>
              <RiAddLine /> Add More
            </button>
          </div>

          {/* ── Education ── */}
          <div className="bg-white border border-mist rounded-2xl p-5 sm:p-6 mb-4 shadow-card">
            <SecHead icon={<RiBookOpenLine />} label="Education" />
            {fd.ed.map((edu, i) => (
              <div key={i} className="bg-paper/60 border border-mist rounded-xl p-4 mb-3 relative">
                {i > 0 && <button className="absolute top-2.5 right-2.5 w-6.5 h-6.5 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors" onClick={() => rm("ed", i)}><RiCloseLine /></button>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Institution Name" placeholder="e.g. IIT Bombay / Delhi University" value={edu.institution} onChange={e => setArr("ed", i, { institution: e.target.value })} />
                  <Field label="Degree" as="select" value={edu.degreeType} onChange={e => setArr("ed", i, { degreeType: e.target.value })}>
                    {DEGREE_OPTIONS.map(d => <option key={d}>{d}</option>)}
                  </Field>
                  <Field label="State" as="select" value={edu.state} onChange={e => setArr("ed", i, { state: e.target.value })}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </Field>
                  <Field label="Score (CGPA / %)" placeholder="e.g. 8.5 CGPA or 85%" value={edu.cgpa} onChange={e => setArr("ed", i, { cgpa: e.target.value })} />
                  <Field label="Start Date" type="date" value={edu.startYear} onChange={e => setArr("ed", i, { startYear: e.target.value })} />
                  <Field label="End Date (or Expected)" type="date" value={edu.endYear} onChange={e => setArr("ed", i, { endYear: e.target.value })} />
                </div>
              </div>
            ))}
            <button className="inline-flex items-center gap-1.5 bg-pine/8 text-pine border border-dashed border-pine/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-pine/15 hover:border-pine/50 transition-colors mt-1" onClick={() => addItem("ed", { degreeType: "B.Tech - Computer Science", institution: "", state: "", startYear: "", endYear: "", cgpa: "" })}>
              <RiAddLine /> Add More
            </button>
          </div>

          {/* ── Experience ── */}
          <div className="bg-white border border-mist rounded-2xl p-5 sm:p-6 mb-4 shadow-card">
            <SecHead icon={<RiBriefcaseLine />} label="Internship / Experience" />
            {fd.ex.map((exp, i) => (
              <div key={i} className="bg-paper/60 border border-mist rounded-xl p-4 mb-3 relative">
                {i > 0 && <button className="absolute top-2.5 right-2.5 w-6.5 h-6.5 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors" onClick={() => rm("ex", i)}><RiCloseLine /></button>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Role" as="select" value={exp.role} onChange={e => setArr("ex", i, { role: e.target.value })}>
                    <option value="">Select Role</option>
                    {JOB_ROLES.map(r => <option key={r}>{r}</option>)}
                  </Field>
                  <Field label="Company Name" placeholder="e.g. Infosys, TCS, Startup XYZ" value={exp.company} onChange={e => setArr("ex", i, { company: e.target.value })} />
                  <Field label="Start Date" type="date" value={exp.startDate} onChange={e => setArr("ex", i, { startDate: e.target.value })} />
                  <Field label="End Date (leave blank if current)" type="date" value={exp.endDate} onChange={e => setArr("ex", i, { endDate: e.target.value })} />
                  <Field label="Location" placeholder="e.g. Remote / Bengaluru / Hyderabad" value={exp.location} onChange={e => setArr("ex", i, { location: e.target.value })} />
                  <Field label="Project URL" placeholder="e.g. https://company.com/project" value={exp.projectUrl} onChange={e => setArr("ex", i, { projectUrl: e.target.value })} />
                  <Field label="Responsibilities & Achievements" type="textarea" rows={3} placeholder="e.g. Developed REST APIs using Node.js, reduced load time by 40%, collaborated with a team of 5 developers..." value={exp.desc} onChange={e => setArr("ex", i, { desc: e.target.value })} span2 />
                </div>
              </div>
            ))}
            <button className="inline-flex items-center gap-1.5 bg-pine/8 text-pine border border-dashed border-pine/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-pine/15 hover:border-pine/50 transition-colors mt-1" onClick={() => addItem("ex", { role: "", company: "", startDate: "", endDate: "", location: "", desc: "", projectUrl: "" })}>
              <RiAddLine /> Add More
            </button>
          </div>

          {/* ── Certifications ── */}
          <div className="bg-white border border-mist rounded-2xl p-5 sm:p-6 mb-4 shadow-card">
            <SecHead icon={<RiAwardLine />} label="Certifications" />
            {fd.cer.map((cert, i) => (
              <div key={i} className="bg-paper/60 border border-mist rounded-xl p-4 mb-3 relative">
                {i > 0 && <button className="absolute top-2.5 right-2.5 w-6.5 h-6.5 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors" onClick={() => rm("cer", i)}><RiCloseLine /></button>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Course Name" placeholder="e.g. AWS Solutions Architect" value={cert.courseName} onChange={e => setArr("cer", i, { courseName: e.target.value })} />
                  <Field label="Platform / Institution" placeholder="e.g. Coursera, Udemy, NPTEL" value={cert.platform} onChange={e => setArr("cer", i, { platform: e.target.value })} />
                  <Field label="Issue Date" type="date" value={cert.issueDate} onChange={e => setArr("cer", i, { issueDate: e.target.value })} />
                  <Field label="Certificate Link" placeholder="e.g. https://coursera.org/verify/abc123" value={cert.certificateLink} onChange={e => setArr("cer", i, { certificateLink: e.target.value })} />
                </div>
              </div>
            ))}
            <button className="inline-flex items-center gap-1.5 bg-pine/8 text-pine border border-dashed border-pine/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-pine/15 hover:border-pine/50 transition-colors mt-1" onClick={() => addItem("cer", { courseName: "", platform: "", issueDate: "", certificateLink: "" })}>
              <RiAddLine /> Add More
            </button>
          </div>

          {/* ── Achievements ── */}
          <div className="bg-white border border-mist rounded-2xl p-5 sm:p-6 mb-4 shadow-card">
            <SecHead icon={<RiTrophyLine />} label="Achievements" />
            {fd.ach.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input
                  className="w-full min-w-0 border border-mist rounded-xl px-3 py-2.5 text-sm text-ink bg-white placeholder:text-ink/35 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-colors"
                  style={{ flex: 1, minWidth: 0 }}
                  value={typeof item === "string" ? item : item.academic || ""}
                  onChange={e => {
                    const a = [...fd.ach]; a[i] = e.target.value; setFd(p => ({ ...p, ach: a }));
                  }}
                  placeholder="e.g. Winner of State-level Hackathon 2023"
                />
                {i > 0 && (
                  <button className="w-8 h-8 shrink-0 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors" onClick={() => rm("ach", i)}><RiCloseLine /></button>
                )}
              </div>
            ))}
            <button className="inline-flex items-center gap-1.5 bg-pine/8 text-pine border border-dashed border-pine/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-pine/15 hover:border-pine/50 transition-colors mt-1" onClick={() => addItem("ach", "")}><RiAddLine /> Add More</button>
          </div>

          {/* ── Languages ── */}
          <div className="bg-white border border-mist rounded-2xl p-5 sm:p-6 mb-4 shadow-card">
            <SecHead icon={<RiTranslate2 />} label="Languages Known" />
            {fd.lang.map((v, i) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input
                  className="w-full min-w-0 border border-mist rounded-xl px-3 py-2.5 text-sm text-ink bg-white placeholder:text-ink/35 focus:outline-none focus:border-pine focus:ring-2 focus:ring-pine/15 transition-colors"
                  style={{ flex: 1, minWidth: 0 }}
                  value={v}
                  onChange={e => {
                    const a = [...fd.lang]; a[i] = e.target.value; setFd(p => ({ ...p, lang: a }));
                  }}
                  placeholder="e.g. Hindi, English, Telugu"
                />
                {i > 0 && (
                  <button className="w-8 h-8 shrink-0 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors" onClick={() => rm("lang", i)}><RiCloseLine /></button>
                )}
              </div>
            ))}
            <button className="inline-flex items-center gap-1.5 bg-pine/8 text-pine border border-dashed border-pine/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-pine/15 hover:border-pine/50 transition-colors mt-1" onClick={() => addItem("lang", "")}><RiAddLine /> Add More</button>
          </div>

          {/* ── Save ── */}
          <button className="w-full py-3.5 bg-pine text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-moss transition-colors mt-2 disabled:bg-pine/40 disabled:cursor-not-allowed" onClick={saveResume} disabled={loading}>
            {loading
              ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Saving...</>
              : <><RiSaveLine style={{ fontSize: "1.1rem" }} /> Save Resume</>}
          </button>

        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;