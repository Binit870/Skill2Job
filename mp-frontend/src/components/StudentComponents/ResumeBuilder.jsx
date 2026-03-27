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
  :root {
    --c3:#bbf7d0; --s:#14532d; --s2:#166534; --a:#16a34a; --a2:#22c55e; --g:#15803d;
    --sh:0 4px 16px rgba(20,83,45,.10),0 2px 6px rgba(20,83,45,.06);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  .rb-page { min-height:100vh; background:#f0fdf4; font-family:'DM Sans',sans-serif; padding: 2.5rem 1.5rem; display: flex; justify-content: center; }
  .rb-wrap { width: 100%; max-width: 860px; animation: fd .35s ease both; }
  
  /* Header Setup */
  .rb-hd { background: var(--s); padding: 1.5rem 2.5rem; position: relative; overflow: hidden; border-radius: 24px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; box-shadow: var(--sh); }
  .rb-hd-left { display: flex; align-items: center; gap: 15px; z-index: 1; }
  
  /* Back Button Style */
  .rb-back-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1.2rem;
  }
  .rb-back-btn:hover { background: rgba(255,255,255,0.2); transform: translateX(-3px); }

  .rb-eye{font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--a2);margin-bottom:.1rem;}
  .rb-ttl{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:#fff;line-height:1.15;}
  .rb-ttl em{font-style:italic;color:var(--a2)}

  .rb-prev { z-index:1; cursor:pointer; background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.2); color:#fff; padding:8px 16px; border-radius:12px; font-size:.85rem; transition:all .2s; }
  .rb-prev:hover { background:rgba(255,255,255,.2); transform:translateY(-2px); }

  /* Rest of the styles */
  .rb-sec { background: #fff; border: 1px solid var(--c3); border-radius: 20px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: var(--sh); }
  .rb-sh { font-size: .68rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--s2); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; }
  .rb-sh::after { content: ''; flex: 1; height: 1px; background: var(--c3); }
  .rb-lbl { font-size: .75rem; font-weight: 500; color: var(--s); margin-bottom: 6px; display: block; }
  .rb-inp, .rb-sel, .rb-ta { width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: .75rem; font-family: 'DM Sans', sans-serif; font-size: .9rem; transition: all .2s; }
  .rb-item { background: #fcfdfd; border: 1px solid #f1f5f9; border-radius: 16px; padding: 1.5rem; margin-bottom: 1rem; position: relative; }
  .rb-rm { position: absolute; top: 10px; right: 10px; width: 26px; height: 26px; background: #fee2e2; color: #ef4444; border: none; border-radius: 50%; cursor: pointer; }
  .rb-add { background: #dcfce7; color: var(--g); border: 1px dashed var(--a); padding: 8px 16px; border-radius: 10px; cursor: pointer; font-weight: 600; margin-top: 10px; font-size: .8rem; }
  .rb-save { width: 100%; padding: 1.1rem; background: var(--s); color: #fff; border: none; border-radius: 16px; font-weight: 600; cursor: pointer; font-size: 1rem; }
  .rb-langrow { display: flex; gap: 8px; margin-bottom: 8px; }
  .rb-langx { background: #fee2e2; color: #ef4444; border: none; width: 34px; height: 34px; border-radius: 10px; cursor: pointer; }
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
  @media(max-width:600px){ .g2{ grid-template-columns: 1fr; } }
  @keyframes fd{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
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
      <textarea className="rb-ta" rows={rows || 2} placeholder={placeholder} value={value} onChange={onChange} />
    ) : as === "select" ? (
      <select className="rb-sel" value={value} onChange={onChange}>{children}</select>
    ) : (
      <input className="rb-inp" type={type || "text"} placeholder={placeholder} value={value} onChange={onChange} />
    )}
  </div>
);

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Data persistence
  const [fd, setFd] = useState(() => {
    const saved = localStorage.getItem("resume_draft");
    return saved ? JSON.parse(saved) : INIT;
  });

  useEffect(() => {
    localStorage.setItem("resume_draft", JSON.stringify(fd));
  }, [fd]);

  useEffect(() => {
    if (!tok()) return;
    axios.get(API, { headers: auth() }).then(res => {
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
        education: fd.ed.filter(e => e.institution),
        experience: fd.ex.filter(e => e.company || e.role),
        skillsCategorized: fd.skills,
        projects: fd.pr.filter(p => p.name),
        certifications: fd.cer.filter(c => c.courseName),
        achievementsStructured: fd.ach.filter(a => typeof a === "string" ? a.trim() : Object.values(a).some(Boolean)),
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
          <div className="rb-hd">
            <div className="rb-hd-left">
              {/* Added Back Button here */}
              <button className="rb-back-btn" onClick={() => navigate(-1)} title="Go Back">←</button>
              <div>
                <p className="rb-eye">Career Tools</p>
                <h1 className="rb-ttl">Resume <em>Builder</em></h1>
              </div>
            </div>
            <button className="rb-prev" onClick={handlePreview}>📄 Preview</button>
          </div>

          <div className="rb-body">
            {/* Form Sections (Personal, Skills, etc.) continue exactly as before */}
            <div className="rb-sec">
              <p className="rb-sh">Personal Details</p>
              <div className="g2">
                {[{ l: "Full Name *", n: "fn" }, { l: "Email Address *", n: "e" }, { l: "Phone", n: "ph" }, { l: "City, State", n: "ad" }, { l: "GitHub", n: "gh" }, { l: "LinkedIn", n: "li" }].map(f => (
                  <Field key={f.n} label={f.l} placeholder={f.l} value={fd[f.n]} onChange={e => set({ [f.n]: e.target.value })} />
                ))}
                <Field label="Portfolio" placeholder="https://..." value={fd.pf} onChange={e => set({ pf: e.target.value })} span2 />
                <Field label="Professional Summary" type="textarea" rows={2} placeholder="Brief Summary..." value={fd.sm} onChange={e => set({ sm: e.target.value })} span2 />
              </div>
            </div>

            <div className="rb-sec">
              <p className="rb-sh">Skills</p>
              <div className="g2">
                <Field label="Technical Skills" placeholder="HTML, CSS, React, Node..." value={fd.skills.technical} onChange={e => set({ skills: { ...fd.skills, technical: e.target.value } })} />
                <Field label="Professional Skills" placeholder="Communication, Teamwork..." value={fd.skills.professional} onChange={e => set({ skills: { ...fd.skills, professional: e.target.value } })} />
              </div>
            </div>

            <div className="rb-sec">
              <p className="rb-sh">Project Details</p>
              {fd.pr.map((proj, i) => (
                <div key={i} className="rb-item">
                  {i > 0 && <button className="rb-rm" onClick={() => rm("pr", i)}>×</button>}
                  <div className="g2">
                    <Field label="Project Name" placeholder="Project Name" value={proj.name} onChange={e => setArr("pr", i, { name: e.target.value })} />
                    <Field label="Project Link" placeholder="https://..." value={proj.link} onChange={e => setArr("pr", i, { link: e.target.value })} />
                  </div>
                  <Field label="Detailed Description" type="textarea" placeholder="Describe your project..." value={proj.description} onChange={e => setArr("pr", i, { description: e.target.value })} span2 />
                </div>
              ))}
              <button className="rb-add" onClick={() => addItem("pr", { name: "", description: "", link: "" })}>+ Add Project</button>
            </div>

            <div className="rb-sec">
              <p className="rb-sh">Education</p>
              {fd.ed.map((edu, i) => (
                <div key={i} className="rb-item">
                  {i > 0 && <button className="rb-rm" onClick={() => rm("ed", i)}>×</button>}
                  <div className="g2">
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
              <button className="rb-add" onClick={() => addItem("ed", { degreeType: "B.Tech - Computer Science", institution: "", state: "", startYear: "", endYear: "", cgpa: "" })}>+ Add Education</button>
            </div>

            <div className="rb-sec">
              <p className="rb-sh">Experience</p>
              {fd.ex.map((exp, i) => (
                <div key={i} className="rb-item">
                  {i > 0 && <button className="rb-rm" onClick={() => rm("ex", i)}>×</button>}
                  <div className="g2">
                    <Field label="Role" as="select" value={exp.role} onChange={e => setArr("ex", i, { role: e.target.value })}>
                      {JOB_ROLES.map(r => <option key={r}>{r}</option>)}
                    </Field>
                    <Field label="Company" value={exp.company} onChange={e => setArr("ex", i, { company: e.target.value })} />
                    <Field label="Start Date" type="date" value={exp.startDate} onChange={e => setArr("ex", i, { startDate: e.target.value })} />
                    <Field label="End Date" type="date" value={exp.endDate} onChange={e => setArr("ex", i, { endDate: e.target.value })} />
                    <Field label="Location" placeholder="e.g. Remote" value={exp.location} onChange={e => setArr("ex", i, { location: e.target.value })} />
                    <Field label="Project URL" placeholder="https://..." value={exp.projectUrl} onChange={e => setArr("ex", i, { projectUrl: e.target.value })} />
                  </div>
                  <Field label="Responsibilities" type="textarea" rows={3} value={exp.desc} onChange={e => setArr("ex", i, { desc: e.target.value })} span2 />
                </div>
              ))}
              <button className="rb-add" onClick={() => addItem("ex", { role: "", company: "", startDate: "", endDate: "", location: "", desc: "", projectUrl: "" })}>+ Add Experience</button>
            </div>

            <div className="rb-sec">
              <p className="rb-sh">Certifications</p>
              {fd.cer.map((cert, i) => (
                <div key={i} className="rb-item">
                  {i > 0 && <button className="rb-rm" onClick={() => rm("cer", i)}>×</button>}
                  <div className="g2">
                    <Field label="Course Name" value={cert.courseName} onChange={e => setArr("cer", i, { courseName: e.target.value })} />
                    <Field label="Platform / Institution" value={cert.platform} onChange={e => setArr("cer", i, { platform: e.target.value })} />
                    <Field label="Issue Date" type="date" value={cert.issueDate} onChange={e => setArr("cer", i, { issueDate: e.target.value })} />
                    <Field label="Certificate Link" placeholder="https://..." value={cert.certificateLink} onChange={e => setArr("cer", i, { certificateLink: e.target.value })} />
                  </div>
                </div>
              ))}
              <button className="rb-add" onClick={() => addItem("cer", { courseName: "", platform: "", issueDate: "", certificateLink: "" })}>+ Add Certification</button>
            </div>

            <div className="rb-sec">
              <p className="rb-sh">Achievements</p>
              {fd.ach.map((item, i) => (
                <div key={i} className="rb-langrow">
                  <input className="rb-inp" value={typeof item === "string" ? item : item.academic || ""} onChange={e => {
                    const a = [...fd.ach]; a[i] = e.target.value; setFd(p => ({ ...p, ach: a }));
                  }} placeholder="Enter achievement..." />
                  {i > 0 && <button className="rb-langx" onClick={() => rm("ach", i)}>×</button>}
                </div>
              ))}
              <button className="rb-add" onClick={() => addItem("ach", "")}>+ Add Achievement</button>
            </div>

            <div className="rb-sec">
              <p className="rb-sh">Language</p>
              {fd.lang.map((v, i) => (
                <div key={i} className="rb-langrow">
                  <input className="rb-inp" value={v} onChange={e => {
                    const a = [...fd.lang]; a[i] = e.target.value; setFd(p => ({ ...p, lang: a }));
                  }} placeholder="Enter Language..." />
                  {i > 0 && <button className="rb-langx" onClick={() => rm("lang", i)}>×</button>}
                </div>
              ))}
              <button className="rb-add" onClick={() => addItem("lang", "")}>+ Add Language</button>
            </div>

            <button className="rb-save" onClick={saveResume} disabled={loading}>
              {loading ? <span>Saving...</span> : <span>Save Resume</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;