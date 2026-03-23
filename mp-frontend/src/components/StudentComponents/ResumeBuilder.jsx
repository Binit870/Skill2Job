import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh"
];
const INDIAN_LANGUAGES = [
  "Hindi","English","Bengali","Marathi","Telugu","Tamil","Gujarati","Urdu","Kannada","Odia",
  "Malayalam","Punjabi","Sanskrit","Assamese","Maithili","Santali","Kashmiri","Nepali","Sindhi",
  "Konkani","Dogri","Manipuri","Bodo","Khasi","Garo","Mizo","Haryanvi","Bhojpuri","Rajasthani"
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
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root{
    --c:#faf9f6;--c2:#f2f0eb;--c3:#e8e4dc;
    --s:#1e293b;--s2:#334155;--s3:#64748b;
    --a:#d97706;--a2:#f59e0b;--ab:#fffbeb;
    --g:#059669;--gb:#ecfdf5;
    --r:#dc2626;--rb:#fef2f2;
    --b:#2563eb;--bb:#eff6ff;
    --sh:0 4px 16px rgba(30,41,59,.09),0 2px 6px rgba(30,41,59,.06);
    --sl:0 12px 40px rgba(30,41,59,.12),0 4px 12px rgba(30,41,59,.07);
    --rad:14px;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  .rb-page{
    min-height:100vh;background-color:#ffffff;font-family:'DM Sans',sans-serif;color:#1e293b;
    background-image:linear-gradient(rgba(217,119,6,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(217,119,6,.04) 1px,transparent 1px);
    background-size:40px 40px;padding:2.5rem 1.5rem;position:relative;overflow-x:hidden;
  }
  .rb-page::before{content:'';position:fixed;top:-120px;left:-120px;width:480px;height:480px;background:radial-gradient(circle,rgba(217,119,6,.06) 0%,transparent 65%);border-radius:50%;pointer-events:none;z-index:0}
  .rb-page::after{content:'';position:fixed;bottom:-100px;right:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(200,200,200,.3) 0%,transparent 70%);border-radius:50%;pointer-events:none;z-index:0}
  .rb-wrap{max-width:860px;margin:0 auto;position:relative;z-index:1;animation:rise .55s cubic-bezier(.22,1,.36,1) both}
  @keyframes rise{from{opacity:0;transform:translateY(28px) scale(.98)}to{opacity:1;transform:none}}
  .rb-card{background:#fff;border:1px solid var(--c3);border-radius:24px;box-shadow:var(--sl);overflow:hidden}
  .rb-hd{background:var(--s);padding:2rem 2.5rem;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:1rem}
  .rb-hd::before{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;background:radial-gradient(circle,rgba(217,119,6,.22) 0%,transparent 65%);border-radius:50%;pointer-events:none}
  .rb-hd::after{content:'';position:absolute;bottom:-40px;left:40px;width:160px;height:160px;background:radial-gradient(circle,rgba(217,119,6,.1) 0%,transparent 65%);border-radius:50%;pointer-events:none}
  .rb-hd-left{position:relative;z-index:1}
  .rb-eye{font-size:.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--a2);margin-bottom:.4rem}
  .rb-ttl{font-family:'Playfair Display',serif;font-size:1.85rem;font-weight:700;color:#fff;line-height:1.15}
  .rb-ttl em{font-style:italic;color:var(--a2)}
  .rb-prev{position:relative;z-index:1;display:inline-flex;align-items:center;gap:7px;padding:.6rem 1.4rem;border-radius:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:#fff;font-family:'DM Sans',sans-serif;font-size:.84rem;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap}
  .rb-prev:hover{background:rgba(217,119,6,.25);border-color:rgba(217,119,6,.5);transform:translateY(-1px);box-shadow:0 4px 12px rgba(217,119,6,.2)}
  .rb-body{padding:2rem 2.5rem 2.5rem;display:flex;flex-direction:column;gap:1.5rem}
  .rb-sec{background:var(--c);border:1px solid var(--c3);border-radius:var(--rad);padding:1.5rem;animation:fd .4s ease both}
  @keyframes fd{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  .rb-sh{font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--s3);margin-bottom:1.1rem;display:flex;align-items:center;gap:8px}
  .rb-sh::after{content:'';flex:1;height:1px;background:var(--c3)}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:.85rem}
  @media(max-width:600px){.g2{grid-template-columns:1fr}}
  .rb-field{display:flex;flex-direction:column;gap:4px}
  .rb-lbl{font-size:.68rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--s3);margin-left:2px}
  .rb-inp,.rb-sel,.rb-ta{
    width:100%;border:1px solid var(--c3);border-radius:9px;padding:.55rem .75rem;
    font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:500;color:var(--s);
    background:#fff;outline:none;transition:border-color .18s,box-shadow .18s;
  }
  .rb-inp:focus,.rb-sel:focus,.rb-ta:focus{border-color:var(--a);box-shadow:0 0 0 3px rgba(217,119,6,.1)}
  .rb-ta{resize:none}
  .rb-sel{cursor:pointer}
  .rb-item{background:#fff;border:1px solid var(--c3);border-radius:11px;padding:1.1rem;margin-bottom:.85rem;position:relative;display:flex;flex-direction:column;gap:.75rem;transition:box-shadow .2s}
  .rb-item:hover{box-shadow:var(--sh)}
  .rb-item:last-of-type{margin-bottom:0}
  .rb-rm{position:absolute;top:-10px;right:-10px;width:24px;height:24px;background:var(--r);color:#fff;border:none;border-radius:50%;font-size:1rem;line-height:1;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 6px rgba(220,38,38,.3);transition:transform .15s}
  .rb-rm:hover{transform:scale(1.1)}
  .rb-add{display:inline-flex;align-items:center;gap:5px;margin-top:.75rem;padding:.45rem 1rem;border-radius:8px;border:1px dashed var(--c3);background:transparent;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:600;color:var(--s2);cursor:pointer;transition:all .18s}
  .rb-add:hover{border-color:var(--a);color:var(--a);background:var(--ab)}
  .rb-langrow{display:flex;gap:.5rem;margin-bottom:.5rem;align-items:center}
  .rb-langrow .rb-inp{flex:1}
  .rb-langx{background:none;border:none;color:var(--r);font-size:1.1rem;font-weight:700;cursor:pointer;padding:0 4px;line-height:1}
  .rb-save{
    width:100%;padding:1rem;background:var(--s);color:#fff;border:none;border-radius:14px;
    font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:700;cursor:pointer;
    display:flex;align-items:center;justify-content:center;gap:10px;
    transition:all .22s;position:relative;overflow:hidden;letter-spacing:.04em;text-transform:uppercase;
  }
  .rb-save::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--a),#b45309);opacity:0;transition:opacity .22s}
  .rb-save:hover::after{opacity:1}
  .rb-save:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(30,41,59,.25)}
  .rb-save:active{transform:none}
  .rb-save:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
  .rb-save>*{position:relative;z-index:1}
  .rb-sp{width:17px;height:17px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:rot .7s linear infinite;flex-shrink:0}
  @keyframes rot{to{transform:rotate(360deg)}}
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

const API  = "http://localhost:5000/api/resume";
const tok  = () => localStorage.getItem("token");
const auth = () => ({ Authorization: `Bearer ${tok()}` });

const Field = ({ label, span2, as, type, rows, placeholder, value, onChange, children }) => (
  <div className="rb-field" style={span2 ? { gridColumn: "1/-1" } : {}}>
    <label className="rb-lbl">{label}</label>
    {type === "textarea" ? (
      <textarea
        className="rb-ta"
        rows={rows || 2}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    ) : as === "select" ? (
      <select className="rb-sel" value={value} onChange={onChange}>
        {children}
      </select>
    ) : (
      <input
        className="rb-inp"
        type={type || "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    )}
  </div>
);

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fd, setFd] = useState(INIT);

  useEffect(() => {
    if (!tok()) return;
    axios.get(API, { headers: auth() }).then(res => {
      if (res.data?.success) {
        const d = res.data.data;
        setFd(prev => ({
          ...prev,
          fn:  d.fullName  || "",
          e:   d.email     || "",
          ph:  d.phone     || "",
          ad:  d.address   || "",
          sm:  d.summary   || "",
          gh:  d.github    || "",
          li:  d.linkedin  || "",
          pf:  d.portfolio || "",
          ed:  d.education?.length          ? d.education          : prev.ed,
          ex:  d.experience?.length         ? d.experience         : prev.ex,
          skills: d.skillsCategorized       || prev.skills,
          pr:  d.projects?.length           ? d.projects           : prev.pr,
          cer: d.certifications?.length     ? d.certifications     : prev.cer,
          ach: d.achievementsStructured?.length ? d.achievementsStructured : prev.ach,
          lang:d.languagesKnown?.length     ? d.languagesKnown     : prev.lang,
        }));
      }
    }).catch(() => {});
  }, []);

  const set     = (patch) => setFd(p => ({ ...p, ...patch }));
  const setArr  = (key, i, patch) => setFd(p => {
    const a = [...p[key]];
    a[i] = { ...a[i], ...patch };
    return { ...p, [key]: a };
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
        education:    fd.ed.filter(e => e.institution),
        experience:   fd.ex.filter(e => e.company || e.role),
        skillsCategorized: fd.skills,
        projects:     fd.pr.filter(p => p.name),
        certifications: fd.cer.filter(c => c.courseName),
        achievementsStructured: fd.ach.filter(a =>
          typeof a === "string" ? a.trim() : Object.values(a).some(Boolean)
        ),
        languagesKnown: fd.lang.filter(l => l.trim()),
      };
      await axios.post(`${API}/create`, payload, { headers: auth() });
      toast.success("Saved! 🎉");
      navigate("/student/resume");
    } catch { toast.error("Save failed"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{S}</style>
      <div className="rb-page">
        <div className="rb-wrap">
          <div className="rb-card">

            {/* ── Header ── */}
            <div className="rb-hd">
              <div className="rb-hd-left">
                <p className="rb-eye">Career Tools</p>
                <h1 className="rb-ttl">Resume <em>Builder</em></h1>
              </div>
              <button className="rb-prev" onClick={handlePreview}>📄 Preview</button>
            </div>

            <div className="rb-body">

              {/* Personal Details */}
              <div className="rb-sec">
                <p className="rb-sh">Personal Details</p>
                <div className="g2">
                  {[
                    { l: "Full Name *",     n: "fn" },
                    { l: "Email Address *", n: "e"  },
                    { l: "Phone",           n: "ph" },
                    { l: "City, State",     n: "ad" },
                    { l: "GitHub",          n: "gh" },
                    { l: "LinkedIn",        n: "li" },
                  ].map(f => (
                    <Field
                      key={f.n}
                      label={f.l}
                      placeholder={f.l}
                      value={fd[f.n]}
                      onChange={e => set({ [f.n]: e.target.value })}
                    />
                  ))}
                  <Field label="Portfolio" placeholder="https://..." value={fd.pf}
                    onChange={e => set({ pf: e.target.value })} span2 />
                  <Field label="Professional Summary" type="textarea" rows={2}
                    placeholder="Brief Summary..." value={fd.sm}
                    onChange={e => set({ sm: e.target.value })} span2 />
                </div>
              </div>

              {/* Skills */}
              <div className="rb-sec">
                <p className="rb-sh">Skills</p>
                <div className="g2">
                  <Field label="Technical Skills" placeholder="HTML, CSS, React, Node..."
                    value={fd.skills.technical}
                    onChange={e => set({ skills: { ...fd.skills, technical: e.target.value } })} />
                  <Field label="Professional Skills" placeholder="Communication, Teamwork..."
                    value={fd.skills.professional}
                    onChange={e => set({ skills: { ...fd.skills, professional: e.target.value } })} />
                </div>
              </div>

              {/* Projects */}
              <div className="rb-sec">
                <p className="rb-sh">Project Details</p>
                {fd.pr.map((proj, i) => (
                  <div key={i} className="rb-item">
                    {i > 0 && <button className="rb-rm" onClick={() => rm("pr", i)}>×</button>}
                    <div className="g2">
                      <Field label="Project Name" placeholder="Project Name"
                        value={proj.name} onChange={e => setArr("pr", i, { name: e.target.value })} />
                      <Field label="Project Link" placeholder="https://..."
                        value={proj.link} onChange={e => setArr("pr", i, { link: e.target.value })} />
                    </div>
                    <Field label="Detailed Description" type="textarea"
                      placeholder="Describe your project..." value={proj.description}
                      onChange={e => setArr("pr", i, { description: e.target.value })} span2 />
                  </div>
                ))}
                <button className="rb-add"
                  onClick={() => addItem("pr", { name: "", description: "", link: "" })}>
                  + Add Project
                </button>
              </div>

              {/* Education */}
              <div className="rb-sec">
                <p className="rb-sh">Education</p>
                {fd.ed.map((edu, i) => (
                  <div key={i} className="rb-item">
                    {i > 0 && <button className="rb-rm" onClick={() => rm("ed", i)}>×</button>}
                    <div className="g2">
                      <Field label="Institution" value={edu.institution}
                        onChange={e => setArr("ed", i, { institution: e.target.value })} />
                      <Field label="Degree" as="select" value={edu.degreeType}
                        onChange={e => setArr("ed", i, { degreeType: e.target.value })}>
                        {DEGREE_OPTIONS.map(d => <option key={d}>{d}</option>)}
                      </Field>
                      <Field label="State" as="select" value={edu.state}
                        onChange={e => setArr("ed", i, { state: e.target.value })}>
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                      </Field>
                      <Field label="Score (CGPA / %)" value={edu.cgpa}
                        onChange={e => setArr("ed", i, { cgpa: e.target.value })} />
                      <Field label="Start Date" type="date" value={edu.startYear}
                        onChange={e => setArr("ed", i, { startYear: e.target.value })} />
                      <Field label="End Date" type="date" value={edu.endYear}
                        onChange={e => setArr("ed", i, { endYear: e.target.value })} />
                    </div>
                  </div>
                ))}
                <button className="rb-add" onClick={() => addItem("ed", {
                  degreeType: "B.Tech - Computer Science", institution: "",
                  state: "", startYear: "", endYear: "", cgpa: ""
                })}>+ Add Education</button>
              </div>

              {/* Experience */}
              <div className="rb-sec">
                <p className="rb-sh">Experience</p>
                {fd.ex.map((exp, i) => (
                  <div key={i} className="rb-item">
                    {i > 0 && <button className="rb-rm" onClick={() => rm("ex", i)}>×</button>}
                    <div className="g2">
                      <Field label="Role" as="select" value={exp.role}
                        onChange={e => setArr("ex", i, { role: e.target.value })}>
                        {JOB_ROLES.map(r => <option key={r}>{r}</option>)}
                      </Field>
                      <Field label="Company" value={exp.company}
                        onChange={e => setArr("ex", i, { company: e.target.value })} />
                      <Field label="Start Date" type="date" value={exp.startDate}
                        onChange={e => setArr("ex", i, { startDate: e.target.value })} />
                      <Field label="End Date" type="date" value={exp.endDate}
                        onChange={e => setArr("ex", i, { endDate: e.target.value })} />
                      <Field label="Location" placeholder="e.g. Remote" value={exp.location}
                        onChange={e => setArr("ex", i, { location: e.target.value })} />
                      <Field label="Project URL" placeholder="https://..." value={exp.projectUrl}
                        onChange={e => setArr("ex", i, { projectUrl: e.target.value })} />
                    </div>
                    <Field label="Responsibilities" type="textarea" rows={3} value={exp.desc}
                      onChange={e => setArr("ex", i, { desc: e.target.value })} span2 />
                  </div>
                ))}
                <button className="rb-add" onClick={() => addItem("ex", {
                  role: "", company: "", startDate: "", endDate: "",
                  location: "", desc: "", projectUrl: ""
                })}>+ Add Experience</button>
              </div>

              {/* Certifications */}
              <div className="rb-sec">
                <p className="rb-sh">Certifications</p>
                {fd.cer.map((cert, i) => (
                  <div key={i} className="rb-item">
                    {i > 0 && <button className="rb-rm" onClick={() => rm("cer", i)}>×</button>}
                    <div className="g2">
                      <Field label="Course Name" value={cert.courseName}
                        onChange={e => setArr("cer", i, { courseName: e.target.value })} />
                      <Field label="Platform / Institution" value={cert.platform}
                        onChange={e => setArr("cer", i, { platform: e.target.value })} />
                      <Field label="Issue Date" type="date" value={cert.issueDate}
                        onChange={e => setArr("cer", i, { issueDate: e.target.value })} />
                      <Field label="Certificate Link" placeholder="https://..."
                        value={cert.certificateLink}
                        onChange={e => setArr("cer", i, { certificateLink: e.target.value })} />
                    </div>
                  </div>
                ))}
                <button className="rb-add" onClick={() => addItem("cer", {
                  courseName: "", platform: "", issueDate: "", certificateLink: ""
                })}>+ Add Certification</button>
              </div>

              {/* Achievements */}
              <div className="rb-sec">
                <p className="rb-sh">Achievements</p>
                {fd.ach.map((item, i) => (
                  <div key={i} className="rb-langrow">
                    <input
                      className="rb-inp"
                      value={typeof item === "string" ? item : item.academic || ""}
                      onChange={e => {
                        const a = [...fd.ach];
                        a[i] = e.target.value;
                        setFd(p => ({ ...p, ach: a }));
                      }}
                      placeholder="Enter achievement..."
                    />
                    {i > 0 && <button className="rb-langx" onClick={() => rm("ach", i)}>×</button>}
                  </div>
                ))}
                <button className="rb-add" onClick={() => addItem("ach", "")}>+ Add Achievement</button>
              </div>

              {/* Languages Known */}
              <div className="rb-sec">
                <p className="rb-sh">Language</p>
                {fd.lang.map((v, i) => (
                  <div key={i} className="rb-langrow">
                    <input
                      className="rb-inp"
                      value={v}
                      onChange={e => {
                        const a = [...fd.lang];
                        a[i] = e.target.value;
                        setFd(p => ({ ...p, lang: a }));
                      }}
                      placeholder="Enter Language..."
                    />
                    {i > 0 && <button className="rb-langx" onClick={() => rm("lang", i)}>×</button>}
                  </div>
                ))}
                <button className="rb-add" onClick={() => addItem("lang", "")}>+ Add Language</button>
              </div>

              {/* Save */}
              <button className="rb-save" onClick={saveResume} disabled={loading}>
                {loading
                  ? <><span className="rb-sp" /><span>Saving...</span></>
                  : <span>Save Resume</span>}
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;