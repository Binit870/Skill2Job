import { useState, useEffect } from "react";
import axios from "axios";
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
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh"
];
const DEGREE_OPTIONS = [
  "10th Standard","12th Standard",
  "B.Tech - Computer Science","B.Tech - Information Technology","B.Tech - Mechanical Engineering",
  "B.Tech - Electrical Engineering","B.Tech - Electronics & Communication","B.Tech - Civil Engineering",
  "BCA (Bachelor of Computer Applications)","B.Sc - Computer Science","B.Sc - IT","B.Sc - Mathematics",
  "B.Com","BBA","BA","M.Tech - Computer Science","MCA (Master of Computer Applications)","M.Sc - IT","MBA","Other"
];
const JOB_ROLES = [
  "Web Developer","Frontend Developer","Backend Developer","Full Stack Developer",
  "MERN Stack Developer","Software Engineer","Software Developer Intern","Java Developer",
  "Python Developer","React Developer","Mobile App Developer","UI/UX Designer",
  "Data Scientist","DevOps Engineer","Cybersecurity Analyst","AI/ML Engineer"
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

  :root {
    --bg:        #f4f8f5;
    --surface:   #ffffff;
    --border:    #dde8e1;
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
    --r-xl: 24px; --r-lg: 18px; --r-md: 12px; --r-sm: 8px;
    --sd: 0 1px 3px rgba(10,31,18,.07),0 1px 2px rgba(10,31,18,.04);
    --sm: 0 4px 18px rgba(10,31,18,.08),0 2px 6px rgba(10,31,18,.04);
    --sl: 0 12px 42px rgba(10,31,18,.11),0 4px 14px rgba(10,31,18,.06);
  }

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  .rb-page{
    min-height:100vh;background:var(--bg);
    font-family:'Sora',sans-serif;padding:2.5rem 1.5rem 6rem;
    display:flex;justify-content:center;
  }
  .rb-wrap{width:100%;max-width:820px;animation:rb-rise .4s cubic-bezier(.22,1,.36,1) both}
  @keyframes rb-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

  /* Header */
  .rb-header{
    background:var(--primary);border-radius:var(--r-xl);padding:1.3rem 1.8rem;
    margin-bottom:1.8rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;
    box-shadow:var(--sl);position:relative;overflow:hidden;
  }
  .rb-header::before{
    content:'';position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(ellipse 55% 120% at 100% -20%,rgba(39,168,95,.2) 0%,transparent 55%);
  }
  .rb-header-left{display:flex;align-items:center;gap:10px;position:relative;z-index:1;min-width:0}
  .rb-back{
    width:36px;height:36px;flex-shrink:0;
    background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:#fff;
    border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;
    cursor:pointer;font-size:1rem;transition:background .2s,transform .2s;
  }
  .rb-back:hover{background:rgba(255,255,255,.2);transform:translateX(-2px)}
  .rb-header-text{min-width:0}
  .rb-eyebrow{font-size:.62rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:1px}
  .rb-title{font-family:'Libre Baskerville',serif;font-size:clamp(1.3rem,3.5vw,1.7rem);font-weight:700;color:#fff;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rb-title span{color:var(--accent);font-style:italic}
  .rb-preview{
    display:inline-flex;align-items:center;gap:7px;padding:.55rem 1.1rem;
    background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;
    border-radius:var(--r-sm);font-family:'Sora',sans-serif;font-size:.78rem;font-weight:600;
    cursor:pointer;transition:background .2s;position:relative;z-index:1;white-space:nowrap;flex-shrink:0;
  }
  .rb-preview:hover{background:rgba(255,255,255,.2)}

  /* Section card */
  .rb-sec{
    background:var(--surface);border:1px solid var(--border);border-radius:var(--r-xl);
    padding:1.8rem 2rem;margin-bottom:1.1rem;box-shadow:var(--sd);
    transition:box-shadow .2s;
  }
  .rb-sec:focus-within{box-shadow:var(--sm)}

  /* Section heading */
  .rb-sh{
    display:flex;align-items:center;gap:10px;
    font-size:.64rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--text-3);
    margin-bottom:1.4rem;
  }
  .rb-sh-icon{
    width:28px;height:28px;background:var(--accent-lt);border-radius:6px;
    display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:.9rem;flex-shrink:0;
  }
  .rb-sh::after{content:'';flex:1;height:1px;background:var(--border)}

  /* Grid */
  .rb-g2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
  .rb-span2{grid-column:1/-1}

  /* Field */
  .rb-field{display:flex;flex-direction:column;gap:5px}
  .rb-lbl{font-size:.72rem;font-weight:600;color:var(--text-2);letter-spacing:.01em}
  .rb-inp,.rb-sel,.rb-ta{
    width:100%;border:1px solid var(--border);border-radius:var(--r-sm);
    padding:.68rem .85rem;font-family:'Sora',sans-serif;font-size:.85rem;color:var(--text-1);
    background:var(--surface);transition:border-color .18s,box-shadow .18s;outline:none;
  }
  .rb-inp:focus,.rb-sel:focus,.rb-ta:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(39,168,95,.1)}
  .rb-inp::placeholder,.rb-ta::placeholder{color:var(--text-3)}
  .rb-ta{resize:vertical;min-height:80px}
  .rb-sel{cursor:pointer;appearance:auto}

  /* Item card */
  .rb-item{
    background:var(--bg);border:1px solid var(--border);border-radius:var(--r-lg);
    padding:1.4rem;margin-bottom:.9rem;position:relative;
  }
  .rb-rm{
    position:absolute;top:10px;right:10px;width:26px;height:26px;
    background:var(--danger-lt);color:var(--danger);border:none;border-radius:50%;
    display:flex;align-items:center;justify-content:center;font-size:.9rem;
    cursor:pointer;transition:background .17s;
  }
  .rb-rm:hover{background:#fca5a5}

  /* Add button */
  .rb-add{
    display:inline-flex;align-items:center;gap:6px;
    background:var(--accent-lt);color:var(--primary);
    border:1px dashed var(--accent-md);
    padding:7px 15px;border-radius:var(--r-sm);
    font-family:'Sora',sans-serif;font-size:.78rem;font-weight:600;
    cursor:pointer;margin-top:.3rem;transition:background .17s,border-color .17s;
  }
  .rb-add:hover{background:#d0f0de;border-color:var(--accent)}

  /* Inline row for languages/achievements */
  .rb-inline-row{display:flex;gap:8px;margin-bottom:7px;align-items:center}
  .rb-inline-del{
    width:32px;height:32px;flex-shrink:0;background:var(--danger-lt);color:var(--danger);
    border:none;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;
    font-size:.9rem;cursor:pointer;transition:background .17s;
  }
  .rb-inline-del:hover{background:#fca5a5}

  /* Save button */
  .rb-save{
    width:100%;padding:1rem;background:var(--primary);color:#fff;
    border:none;border-radius:var(--r-md);font-family:'Sora',sans-serif;
    font-size:.95rem;font-weight:700;cursor:pointer;
    display:flex;align-items:center;justify-content:center;gap:9px;
    transition:background .2s,transform .2s,box-shadow .2s;margin-top:.5rem;
  }
  .rb-save:hover:not(:disabled){background:var(--primary-h);transform:translateY(-2px);box-shadow:0 10px 30px rgba(13,61,34,.18)}
  .rb-save:disabled{background:#9aad9e;cursor:not-allowed}

  /* Spin */
  .rb-spin{width:18px;height:18px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}

  /* Responsive */
  @media(max-width:768px){
    .rb-sec{padding:1.4rem 1.2rem;border-radius:18px}
    .rb-header{border-radius:18px;padding:1.1rem 1.3rem}
    .rb-g2{grid-template-columns:1fr 1fr}
  }
  @media(max-width:540px){
    .rb-page{padding:1rem .85rem 5rem}
    .rb-header{padding:.95rem 1rem;border-radius:14px;margin-bottom:1.2rem}
    .rb-g2{grid-template-columns:1fr}
    .rb-span2{grid-column:1}
    .rb-sec{padding:1.1rem .95rem;border-radius:14px;margin-bottom:.85rem}
    .rb-sh{margin-bottom:1rem}
    .rb-item{padding:1rem}
    .rb-inline-row .rb-inp{font-size:.82rem}
  }
  @media(max-width:360px){
    .rb-title{font-size:1.2rem}
    .rb-preview span{display:none}
  }
`;

const INIT = {
  fn:"",e:"",ph:"",ad:"",sm:"",gh:"",li:"",pf:"",
  ed:[{degreeType:"B.Tech - Computer Science",institution:"",state:"",startYear:"",endYear:"",cgpa:""}],
  ex:[{role:"",company:"",startDate:"",endDate:"",location:"",desc:"",projectUrl:""}],
  skills:{technical:"",professional:""},
  pr:[{name:"",description:"",link:""}],
  cer:[{courseName:"",platform:"",issueDate:"",certificateLink:""}],
  ach:[""],
  lang:[""]
};

const tok  = () => sessionStorage.getItem("token");
const auth = () => ({ Authorization: `Bearer ${tok()}` });

const Field = ({ label, span2, as, type, rows, placeholder, value, onChange, children }) => (
  <div className={`rb-field${span2 ? " rb-span2" : ""}`}>
    <label className="rb-lbl">{label}</label>
    {type === "textarea" ? (
      <textarea className="rb-ta" rows={rows || 2} placeholder={placeholder} value={value} onChange={onChange} />
    ) : as === "select" ? (
      <select className="rb-sel" value={value} onChange={onChange}>{children}</select>
    ) : (
      <input className="rb-inp" type={type || "text"} placeholder={placeholder} value={value} onChange={onChange} />
    )}
  </div>
);

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
          e:  d.email || prev.e,
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
    }).catch(() => {});
  }, []);

  const set     = (patch) => setFd(p => ({ ...p, ...patch }));
  const setArr  = (key, i, patch) => setFd(p => {
    const a = [...p[key]]; a[i] = { ...a[i], ...patch }; return { ...p, [key]: a };
  });
  const addItem = (key, blank) => setFd(p => ({ ...p, [key]: [...p[key], blank] }));
  const rm      = (key, i) => fd[key].length > 1 &&
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
              <div className="rb-header-text">
                <p className="rb-eyebrow">Career Tools</p>
                <h1 className="rb-title">Resume <span>Builder</span></h1>
              </div>
            </div>
            <button className="rb-preview" onClick={handlePreview}>
              <RiEyeLine /> <span>Preview</span>
            </button>
          </div>

          {/* Personal Details */}
          <div className="rb-sec">
            <SecHead icon={<RiUser3Line />} label="Personal Details" />
            <div className="rb-g2">
              {[
                { l: "Full Name *", n: "fn", ph: "Your full name" },
                { l: "Email Address *", n: "e", ph: "you@email.com" },
                { l: "Phone", n: "ph", ph: "+91 00000 00000" },
                { l: "City, State", n: "ad", ph: "e.g. Bengaluru, Karnataka" },
                { l: "GitHub", n: "gh", ph: "github.com/username" },
                { l: "LinkedIn", n: "li", ph: "linkedin.com/in/username" },
              ].map(f => (
                <Field key={f.n} label={f.l} placeholder={f.ph} value={fd[f.n]} onChange={e => set({ [f.n]: e.target.value })} />
              ))}
              <Field label="Portfolio" placeholder="https://yoursite.com" value={fd.pf} onChange={e => set({ pf: e.target.value })} span2 />
              <Field label="Professional Summary" type="textarea" rows={2} placeholder="A brief summary about yourself..." value={fd.sm} onChange={e => set({ sm: e.target.value })} span2 />
            </div>
          </div>

          {/* Skills */}
          <div className="rb-sec">
            <SecHead icon={<RiToolsLine />} label="Skills" />
            <div className="rb-g2">
              <Field label="Technical Skills" placeholder="HTML, CSS, React, Node.js..." value={fd.skills.technical} onChange={e => set({ skills: { ...fd.skills, technical: e.target.value } })} />
              <Field label="Professional Skills" placeholder="Communication, Leadership..." value={fd.skills.professional} onChange={e => set({ skills: { ...fd.skills, professional: e.target.value } })} />
            </div>
          </div>

          {/* Projects */}
          <div className="rb-sec">
            <SecHead icon={<RiCodeBoxLine />} label="Project Details" />
            {fd.pr.map((proj, i) => (
              <div key={i} className="rb-item">
                {i > 0 && <button className="rb-rm" onClick={() => rm("pr", i)}><RiCloseLine /></button>}
                <div className="rb-g2">
                  <Field label="Project Name" placeholder="My Awesome Project" value={proj.name} onChange={e => setArr("pr", i, { name: e.target.value })} />
                  <Field label="Project Link" placeholder="https://github.com/..." value={proj.link} onChange={e => setArr("pr", i, { link: e.target.value })} />
                  <Field label="Description" type="textarea" placeholder="Describe your project..." value={proj.description} onChange={e => setArr("pr", i, { description: e.target.value })} span2 />
                </div>
              </div>
            ))}
            <button className="rb-add" onClick={() => addItem("pr", { name: "", description: "", link: "" })}>
              <RiAddLine /> Add Project
            </button>
          </div>

          {/* Education */}
          <div className="rb-sec">
            <SecHead icon={<RiBookOpenLine />} label="Education" />
            {fd.ed.map((edu, i) => (
              <div key={i} className="rb-item">
                {i > 0 && <button className="rb-rm" onClick={() => rm("ed", i)}><RiCloseLine /></button>}
                <div className="rb-g2">
                  <Field label="Institution" value={edu.institution} onChange={e => setArr("ed", i, { institution: e.target.value })} />
                  <Field label="Degree" as="select" value={edu.degreeType} onChange={e => setArr("ed", i, { degreeType: e.target.value })}>
                    {DEGREE_OPTIONS.map(d => <option key={d}>{d}</option>)}
                  </Field>
                  <Field label="State" as="select" value={edu.state} onChange={e => setArr("ed", i, { state: e.target.value })}>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </Field>
                  <Field label="Score (CGPA / %)" value={edu.cgpa} onChange={e => setArr("ed", i, { cgpa: e.target.value })} />
                  <Field label="Start Date" type="date" value={edu.startYear} onChange={e => setArr("ed", i, { startYear: e.target.value })} />
                  <Field label="End Date" type="date" value={edu.endYear} onChange={e => setArr("ed", i, { endYear: e.target.value })} />
                </div>
              </div>
            ))}
            <button className="rb-add" onClick={() => addItem("ed", { degreeType: "B.Tech - Computer Science", institution: "", state: "", startYear: "", endYear: "", cgpa: "" })}>
              <RiAddLine /> Add Education
            </button>
          </div>

          {/* Experience */}
          <div className="rb-sec">
            <SecHead icon={<RiBriefcaseLine />} label="Experience" />
            {fd.ex.map((exp, i) => (
              <div key={i} className="rb-item">
                {i > 0 && <button className="rb-rm" onClick={() => rm("ex", i)}><RiCloseLine /></button>}
                <div className="rb-g2">
                  <Field label="Role" as="select" value={exp.role} onChange={e => setArr("ex", i, { role: e.target.value })}>
                    {JOB_ROLES.map(r => <option key={r}>{r}</option>)}
                  </Field>
                  <Field label="Company" value={exp.company} onChange={e => setArr("ex", i, { company: e.target.value })} />
                  <Field label="Start Date" type="date" value={exp.startDate} onChange={e => setArr("ex", i, { startDate: e.target.value })} />
                  <Field label="End Date" type="date" value={exp.endDate} onChange={e => setArr("ex", i, { endDate: e.target.value })} />
                  <Field label="Location" placeholder="e.g. Remote / Bengaluru" value={exp.location} onChange={e => setArr("ex", i, { location: e.target.value })} />
                  <Field label="Project URL" placeholder="https://..." value={exp.projectUrl} onChange={e => setArr("ex", i, { projectUrl: e.target.value })} />
                  <Field label="Responsibilities" type="textarea" rows={3} value={exp.desc} onChange={e => setArr("ex", i, { desc: e.target.value })} span2 />
                </div>
              </div>
            ))}
            <button className="rb-add" onClick={() => addItem("ex", { role: "", company: "", startDate: "", endDate: "", location: "", desc: "", projectUrl: "" })}>
              <RiAddLine /> Add Experience
            </button>
          </div>

          {/* Certifications */}
          <div className="rb-sec">
            <SecHead icon={<RiAwardLine />} label="Certifications" />
            {fd.cer.map((cert, i) => (
              <div key={i} className="rb-item">
                {i > 0 && <button className="rb-rm" onClick={() => rm("cer", i)}><RiCloseLine /></button>}
                <div className="rb-g2">
                  <Field label="Course Name" value={cert.courseName} onChange={e => setArr("cer", i, { courseName: e.target.value })} />
                  <Field label="Platform / Institution" value={cert.platform} onChange={e => setArr("cer", i, { platform: e.target.value })} />
                  <Field label="Issue Date" type="date" value={cert.issueDate} onChange={e => setArr("cer", i, { issueDate: e.target.value })} />
                  <Field label="Certificate Link" placeholder="https://..." value={cert.certificateLink} onChange={e => setArr("cer", i, { certificateLink: e.target.value })} />
                </div>
              </div>
            ))}
            <button className="rb-add" onClick={() => addItem("cer", { courseName: "", platform: "", issueDate: "", certificateLink: "" })}>
              <RiAddLine /> Add Certification
            </button>
          </div>

          {/* Achievements */}
          <div className="rb-sec">
            <SecHead icon={<RiTrophyLine />} label="Achievements" />
            {fd.ach.map((item, i) => (
              <div key={i} className="rb-inline-row">
                <input
                  className="rb-inp"
                  style={{ flex: 1 }}
                  value={typeof item === "string" ? item : item.academic || ""}
                  onChange={e => {
                    const a = [...fd.ach]; a[i] = e.target.value; setFd(p => ({ ...p, ach: a }));
                  }}
                  placeholder="Enter achievement..."
                />
                {i > 0 && (
                  <button className="rb-inline-del" onClick={() => rm("ach", i)}><RiCloseLine /></button>
                )}
              </div>
            ))}
            <button className="rb-add" onClick={() => addItem("ach", "")}><RiAddLine /> Add Achievement</button>
          </div>

          {/* Languages */}
          <div className="rb-sec">
            <SecHead icon={<RiTranslate2 />} label="Languages" />
            {fd.lang.map((v, i) => (
              <div key={i} className="rb-inline-row">
                <input
                  className="rb-inp"
                  style={{ flex: 1 }}
                  value={v}
                  onChange={e => {
                    const a = [...fd.lang]; a[i] = e.target.value; setFd(p => ({ ...p, lang: a }));
                  }}
                  placeholder="e.g. Hindi, English..."
                />
                {i > 0 && (
                  <button className="rb-inline-del" onClick={() => rm("lang", i)}><RiCloseLine /></button>
                )}
              </div>
            ))}
            <button className="rb-add" onClick={() => addItem("lang", "")}><RiAddLine /> Add Language</button>
          </div>

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