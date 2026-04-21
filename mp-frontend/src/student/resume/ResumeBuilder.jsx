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

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

  :root {
    --bg:        #f2f4f3;
    --surface:   #ffffff;
    --border:    #d0d8d3;
    --primary:   #0d3d22;
    --primary-h: #145c33;
    --accent:    #27a85f;
    --accent-lt: #e6f7ed;
    --accent-md: #b2e6c8;
    --text-1:    #0a1f12;
    --text-2:    #34523e;
    --text-3:    #7a9984;
    --danger:    #dc2626;
    --danger-lt: #fef2f2;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rb-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Sora', sans-serif;
    padding: 2rem 1.25rem 5rem;
    display: flex;
    justify-content: center;
  }

  .rb-wrap {
    width: 100%;
    max-width: 860px;
    animation: rb-rise .35s ease both;
  }
  @keyframes rb-rise {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: none; }
  }

  /* ── Header ── */
  .rb-header {
    background: var(--primary);
    padding: 1.1rem 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border-radius: 0;
  }
  .rb-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }
  .rb-back {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.2);
    color: #fff;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    transition: background .2s;
  }
  .rb-back:hover { background: rgba(255,255,255,.22); }
  .rb-eyebrow {
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1px;
  }
  .rb-title {
    font-size: clamp(1.1rem, 3vw, 1.55rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .rb-title span { color: var(--accent); }
  .rb-preview {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: .5rem 1rem;
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.22);
    color: #fff;
    border-radius: 0;
    font-family: 'Sora', sans-serif;
    font-size: .78rem;
    font-weight: 600;
    cursor: pointer;
    transition: background .2s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .rb-preview:hover { background: rgba(255,255,255,.22); }

  /* ── Section card ── */
  .rb-sec {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0;
    padding: 1.5rem 1.5rem;
    margin-bottom: 1rem;
  }

  /* ── Section heading ── */
  .rb-sh {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: .62rem;
    font-weight: 700;
    letter-spacing: .13em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 1.2rem;
  }
  .rb-sh-icon {
    width: 26px;
    height: 26px;
    background: var(--accent-lt);
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    font-size: .85rem;
    flex-shrink: 0;
  }
  .rb-sh::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── Grid ── */
  .rb-g2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .85rem;
  }
  .rb-span2 { grid-column: 1 / -1; }

  /* ── Field ── */
  .rb-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .rb-lbl { font-size: .7rem; font-weight: 600; color: var(--text-2); }

  .rb-inp,
  .rb-sel,
  .rb-ta {
    width: 100%;
    min-width: 0;
    border: 1px solid var(--border);
    border-radius: 0;
    padding: .6rem .75rem;
    font-family: 'Sora', sans-serif;
    font-size: .84rem;
    color: var(--text-1);
    background: var(--surface);
    transition: border-color .15s, box-shadow .15s;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
  }
  .rb-inp:focus,
  .rb-sel:focus,
  .rb-ta:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(39,168,95,.12);
  }
  .rb-inp::placeholder,
  .rb-ta::placeholder { color: var(--text-3); }

  /* Custom select wrapper so it works across devices */
  .rb-sel-wrap {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 0;
  }
  .rb-sel-wrap::after {
    content: '▾';
    position: absolute;
    right: .7rem;
    color: var(--text-3);
    font-size: .75rem;
    pointer-events: none;
  }
  .rb-sel {
    padding-right: 2rem;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
  }

  .rb-ta { resize: vertical; min-height: 78px; }

  /* ── Item card ── */
  .rb-item {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 0;
    padding: 1.2rem;
    margin-bottom: .8rem;
    position: relative;
  }
  .rb-rm {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 26px;
    height: 26px;
    background: var(--danger-lt);
    color: var(--danger);
    border: none;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .9rem;
    cursor: pointer;
    transition: background .15s;
  }
  .rb-rm:hover { background: #fca5a5; }

  /* ── Add button ── */
  .rb-add {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: var(--accent-lt);
    color: var(--primary);
    border: 1px dashed var(--accent-md);
    padding: 6px 14px;
    border-radius: 0;
    font-family: 'Sora', sans-serif;
    font-size: .77rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: .25rem;
    transition: background .15s;
  }
  .rb-add:hover { background: #d0f0de; border-color: var(--accent); }

  /* ── Inline row ── */
  .rb-inline-row {
    display: flex;
    gap: 7px;
    margin-bottom: 7px;
    align-items: center;
  }
  .rb-inline-del {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    background: var(--danger-lt);
    color: var(--danger);
    border: none;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .9rem;
    cursor: pointer;
    transition: background .15s;
  }
  .rb-inline-del:hover { background: #fca5a5; }

  /* ── Save button ── */
  .rb-save {
    width: 100%;
    padding: .9rem;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: 0;
    font-family: 'Sora', sans-serif;
    font-size: .92rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background .2s, transform .18s;
    margin-top: .5rem;
  }
  .rb-save:hover:not(:disabled) { background: var(--primary-h); transform: translateY(-1px); }
  .rb-save:disabled { background: #9aad9e; cursor: not-allowed; }

  /* ── Spinner ── */
  .rb-spin {
    width: 17px;
    height: 17px;
    border: 2.5px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .rb-page { padding: .85rem .75rem 4.5rem; }
    .rb-header { padding: .9rem 1rem; margin-bottom: 1rem; }
    .rb-sec { padding: 1.1rem 1rem; }
    .rb-g2 { grid-template-columns: 1fr; }
    .rb-span2 { grid-column: 1; }
    .rb-item { padding: 1rem; }
    .rb-title { font-size: 1.1rem; }
    .rb-preview span { display: none; }
  }
  @media (max-width: 380px) {
    .rb-title { font-size: .95rem; }
    .rb-back { width: 30px; height: 30px; }
  }
`;

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
const Field = ({ label, span2, as, type, rows, placeholder, value, onChange, children }) => (
  <div className={`rb-field${span2 ? " rb-span2" : ""}`}>
    <label className="rb-lbl">{label}</label>
    {type === "textarea" ? (
      <textarea className="rb-ta" rows={rows || 2} placeholder={placeholder} value={value} onChange={onChange} />
    ) : as === "select" ? (
      <div className="rb-sel-wrap">
        <select className="rb-sel" value={value} onChange={onChange}>{children}</select>
      </div>
    ) : (
      <input className="rb-inp" type={type || "text"} placeholder={placeholder} value={value} onChange={onChange} />
    )}
  </div>
);

/* ── Section heading ── */
const SecHead = ({ icon, label }) => (
  <p className="rb-sh">
    <span className="rb-sh-icon">{icon}</span>
    {label}
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

  useEffect(() => {
    if (!tok()) return;
    API.get("/api/resume", { headers: auth() }).then(res => {
      if (res.data?.success) {
        const d = res.data.data;
        setFd(prev => ({
          ...prev,
          fn: d.fullName || prev.fn,
          e: d.email || prev.e,
          ph: d.phone || prev.ph,
          ad: d.address || prev.ad,
          sm: d.summary || prev.sm,
          gh: d.github || prev.gh,
          li: d.linkedin || prev.li,
          pf: d.portfolio || prev.pf,
          ed: d.education?.length ? d.education : prev.ed,
          ex: d.experience?.length ? d.experience : prev.ex,
          skills: d.skillsCategorized || prev.skills,
          pr: d.projects?.length ? d.projects : prev.pr,
          cer: d.certifications?.length ? d.certifications : prev.cer,
          ach: d.achievementsStructured?.length ? d.achievementsStructured : prev.ach,
          lang: d.languagesKnown?.length ? d.languagesKnown : prev.lang,
        }));
      }
    }).catch(() => { });
  }, []);

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
      <style>{S}</style>
      <div className="rb-page">
        <div className="rb-wrap">

          {/* Header */}
          <div className="rb-header">
            <div className="rb-header-left">
              <button className="rb-back" onClick={() => navigate(-1)} title="Go Back">
                <RiArrowLeftLine />
              </button>
              <div>
                <p className="rb-eyebrow">Career Tools</p>
                <h1 className="rb-title">Resume <span>Builder</span></h1>
              </div>
            </div>
            <button className="rb-preview" onClick={handlePreview}>
              <RiEyeLine /> <span>Preview</span>
            </button>
          </div>

          {/* ── Personal Details ── */}
          <div className="rb-sec">
            <SecHead icon={<RiUser3Line />} label="Personal Details" />
            <div className="rb-g2">
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
          <div className="rb-sec">
            <SecHead icon={<RiToolsLine />} label="Skills" />
            <div className="rb-g2">
              <Field label="Technical Skills" placeholder="e.g. HTML, CSS, React, Node.js, MongoDB" value={fd.skills.technical} onChange={e => set({ skills: { ...fd.skills, technical: e.target.value } })} />
              <Field label="Professional Skills" placeholder="e.g. Communication, Teamwork, Leadership" value={fd.skills.professional} onChange={e => set({ skills: { ...fd.skills, professional: e.target.value } })} />
            </div>
          </div>

          {/* ── Projects ── */}
          <div className="rb-sec">
            <SecHead icon={<RiCodeBoxLine />} label="Project Details" />
            {fd.pr.map((proj, i) => (
              <div key={i} className="rb-item">
                {i > 0 && <button className="rb-rm" onClick={() => rm("pr", i)}><RiCloseLine /></button>}
                <div className="rb-g2">
                  <Field label="Project Name" placeholder="e.g. E-Commerce Website" value={proj.name} onChange={e => setArr("pr", i, { name: e.target.value })} />
                  <Field label="Project Link" placeholder="e.g. https://github.com/user/project" value={proj.link} onChange={e => setArr("pr", i, { link: e.target.value })} />
                  <Field label="Description" type="textarea" placeholder="e.g. Built a full-stack e-commerce app using React and Node.js with payment integration..." value={proj.description} onChange={e => setArr("pr", i, { description: e.target.value })} span2 />
                </div>
              </div>
            ))}
            <button className="rb-add" onClick={() => addItem("pr", { name: "", description: "", link: "" })}>
              <RiAddLine /> Add More
            </button>
          </div>

          {/* ── Education ── */}
          <div className="rb-sec">
            <SecHead icon={<RiBookOpenLine />} label="Education" />
            {fd.ed.map((edu, i) => (
              <div key={i} className="rb-item">
                {i > 0 && <button className="rb-rm" onClick={() => rm("ed", i)}><RiCloseLine /></button>}
                <div className="rb-g2">
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
            <button className="rb-add" onClick={() => addItem("ed", { degreeType: "B.Tech - Computer Science", institution: "", state: "", startYear: "", endYear: "", cgpa: "" })}>
              <RiAddLine /> Add More
            </button>
          </div>

          {/* ── Experience ── */}
          <div className="rb-sec">
            <SecHead icon={<RiBriefcaseLine />} label="Internship / Experience" />
            {fd.ex.map((exp, i) => (
              <div key={i} className="rb-item">
                {i > 0 && <button className="rb-rm" onClick={() => rm("ex", i)}><RiCloseLine /></button>}
                <div className="rb-g2">
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
            <button className="rb-add" onClick={() => addItem("ex", { role: "", company: "", startDate: "", endDate: "", location: "", desc: "", projectUrl: "" })}>
              <RiAddLine /> Add More
            </button>
          </div>

          {/* ── Certifications ── */}
          <div className="rb-sec">
            <SecHead icon={<RiAwardLine />} label="Certifications" />
            {fd.cer.map((cert, i) => (
              <div key={i} className="rb-item">
                {i > 0 && <button className="rb-rm" onClick={() => rm("cer", i)}><RiCloseLine /></button>}
                <div className="rb-g2">
                  <Field label="Course Name" placeholder="e.g. AWS Solutions Architect" value={cert.courseName} onChange={e => setArr("cer", i, { courseName: e.target.value })} />
                  <Field label="Platform / Institution" placeholder="e.g. Coursera, Udemy, NPTEL" value={cert.platform} onChange={e => setArr("cer", i, { platform: e.target.value })} />
                  <Field label="Issue Date" type="date" value={cert.issueDate} onChange={e => setArr("cer", i, { issueDate: e.target.value })} />
                  <Field label="Certificate Link" placeholder="e.g. https://coursera.org/verify/abc123" value={cert.certificateLink} onChange={e => setArr("cer", i, { certificateLink: e.target.value })} />
                </div>
              </div>
            ))}
            <button className="rb-add" onClick={() => addItem("cer", { courseName: "", platform: "", issueDate: "", certificateLink: "" })}>
              <RiAddLine /> Add More
            </button>
          </div>

          {/* ── Achievements ── */}
          <div className="rb-sec">
            <SecHead icon={<RiTrophyLine />} label="Achievements" />
            {fd.ach.map((item, i) => (
              <div key={i} className="rb-inline-row">
                <input
                  className="rb-inp"
                  style={{ flex: 1, minWidth: 0 }}
                  value={typeof item === "string" ? item : item.academic || ""}
                  onChange={e => {
                    const a = [...fd.ach]; a[i] = e.target.value; setFd(p => ({ ...p, ach: a }));
                  }}
                  placeholder="e.g. Winner of State-level Hackathon 2023"
                />
                {i > 0 && (
                  <button className="rb-inline-del" onClick={() => rm("ach", i)}><RiCloseLine /></button>
                )}
              </div>
            ))}
            <button className="rb-add" onClick={() => addItem("ach", "")}><RiAddLine /> Add More</button>
          </div>

          {/* ── Languages ── */}
          <div className="rb-sec">
            <SecHead icon={<RiTranslate2 />} label="Languages Known" />
            {fd.lang.map((v, i) => (
              <div key={i} className="rb-inline-row">
                <input
                  className="rb-inp"
                  style={{ flex: 1, minWidth: 0 }}
                  value={v}
                  onChange={e => {
                    const a = [...fd.lang]; a[i] = e.target.value; setFd(p => ({ ...p, lang: a }));
                  }}
                  placeholder="e.g. Hindi, English, Telugu"
                />
                {i > 0 && (
                  <button className="rb-inline-del" onClick={() => rm("lang", i)}><RiCloseLine /></button>
                )}
              </div>
            ))}
            <button className="rb-add" onClick={() => addItem("lang", "")}><RiAddLine /> Add More</button>
          </div>

          {/* ── Save ── */}
          <button className="rb-save" onClick={saveResume} disabled={loading}>
            {loading
              ? <><span className="rb-spin" /> Saving...</>
              : <><RiSaveLine style={{ fontSize: "1.1rem" }} /> Save Resume</>}
          </button>

        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;