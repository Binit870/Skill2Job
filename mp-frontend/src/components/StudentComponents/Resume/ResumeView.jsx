import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import {
  RiArrowLeftLine,
  RiDownloadLine,
  RiPrinterLine,
  RiExternalLinkLine,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiLinkedinBoxLine,
  RiGithubLine,
  RiGlobalLine,
} from "react-icons/ri";

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
    --r-xl: 26px; --r-lg: 18px; --r-md: 12px; --r-sm: 8px;
    --sd: 0 1px 3px rgba(10,31,18,.07),0 1px 2px rgba(10,31,18,.04);
    --sm: 0 4px 18px rgba(10,31,18,.08),0 2px 6px rgba(10,31,18,.04);
    --sl: 0 12px 42px rgba(10,31,18,.11),0 4px 14px rgba(10,31,18,.06);
  }

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  .rv-page{
    min-height:100vh;background:var(--bg);
    font-family:'Sora',sans-serif;padding:2.5rem 1.5rem 5rem;
    position:relative;overflow-x:hidden;
  }
  .rv-page::before{
    content:'';position:fixed;top:-100px;left:-100px;width:420px;height:420px;
    background:radial-gradient(circle,rgba(39,168,95,.07) 0%,transparent 65%);
    border-radius:50%;pointer-events:none;z-index:0;
  }
  .rv-wrap{max-width:820px;margin:0 auto;position:relative;z-index:1;animation:rv-rise .5s cubic-bezier(.22,1,.36,1) both}
  @keyframes rv-rise{from{opacity:0;transform:translateY(20px) scale(.99)}to{opacity:1;transform:none}}

  /* Control bar */
  .rv-bar{
    background:var(--primary);border-radius:var(--r-xl);
    box-shadow:var(--sl);margin-bottom:1.5rem;overflow:hidden;
  }
  .rv-bar-inner{
    padding:1.3rem 1.8rem;display:flex;align-items:center;
    justify-content:space-between;gap:1rem;position:relative;overflow:hidden;
  }
  .rv-bar-inner::before{
    content:'';position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(ellipse 55% 120% at 100% -20%,rgba(39,168,95,.2) 0%,transparent 55%);
  }
  .rv-bar-left{display:flex;align-items:center;gap:10px;position:relative;z-index:1;min-width:0}
  .rv-eyebrow{font-size:.62rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:1px}
  .rv-title{font-family:'Libre Baskerville',serif;font-size:clamp(1.3rem,3.5vw,1.7rem);font-weight:700;color:#fff;line-height:1.1}
  .rv-title em{color:var(--accent);font-style:italic}
  .rv-bar-actions{display:flex;align-items:center;gap:.5rem;position:relative;z-index:1;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end}

  /* Bar buttons */
  .rv-btn{
    display:inline-flex;align-items:center;gap:6px;padding:.5rem 1rem;
    border-radius:var(--r-sm);font-family:'Sora',sans-serif;font-size:.78rem;font-weight:600;
    cursor:pointer;transition:all .2s;white-space:nowrap;
  }
  .rv-btn-ghost{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff}
  .rv-btn-ghost:hover{background:rgba(255,255,255,.2);transform:translateY(-1px)}
  .rv-btn-primary{background:var(--accent);border:none;color:#fff;box-shadow:0 4px 12px rgba(39,168,95,.3)}
  .rv-btn-primary:hover{background:#2ec96b;transform:translateY(-1px);box-shadow:0 6px 16px rgba(39,168,95,.4)}
  .rv-btn-icon{padding:.5rem .65rem}

  /* Resume sheet */
  .rv-sheet{
    background:#fff;padding:3rem 3rem 3.5rem;
    border:1px solid var(--border);border-radius:var(--r-xl);box-shadow:var(--sl);
  }

  /* ── Sheet internals (resume content) ── */
  .rv-name{
    font-size:2.1rem;font-weight:900;text-transform:uppercase;
    color:#0d3d22;letter-spacing:.02em;line-height:1;margin-bottom:.6rem;
    font-family:'Libre Baskerville',serif;
  }
  .rv-contacts{
    display:flex;flex-wrap:wrap;justify-content:center;
    gap:.4rem 1.2rem;margin-bottom:.7rem;
  }
  .rv-contact-item{display:flex;align-items:center;gap:4px;font-size:12.5px;color:#374151}
  .rv-contact-icon{color:#27a85f;font-size:.8rem;flex-shrink:0}
  .rv-links{display:flex;justify-content:center;gap:1.4rem;flex-wrap:wrap}
  .rv-link{
    font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
    color:#0d3d22;text-decoration:none;
    display:flex;align-items:center;gap:3px;
  }
  .rv-link:hover{color:#27a85f}

  .rv-divider{border:none;border-top:2px solid #0d3d22;margin:1.1rem 0 1.4rem}

  /* Section */
  .rv-sec{margin-bottom:1.4rem}
  .rv-sec-title{
    font-size:12.5px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;
    color:#0d3d22;border-bottom:1.5px solid #b2e6c8;padding-bottom:4px;margin-bottom:.75rem;
  }
  .rv-item{margin-bottom:.85rem}
  .rv-item:last-child{margin-bottom:0}
  .rv-row{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem;flex-wrap:wrap}
  .rv-row-l{font-size:13.5px;font-weight:700;color:#111827}
  .rv-row-r{font-size:11.5px;font-weight:700;color:#27a85f;flex-shrink:0;white-space:nowrap}
  .rv-row-sub{font-size:12.5px;font-style:italic;color:#34523e;font-weight:500}
  .rv-row-sub-r{font-size:12px;font-weight:600;color:#374151;flex-shrink:0}
  .rv-para{font-size:13px;line-height:1.65;color:#4b5563;margin-top:.3rem;white-space:pre-line}
  .rv-skill-row{font-size:13px;display:flex;gap:.4rem;margin-bottom:3px;flex-wrap:wrap}
  .rv-skill-key{font-weight:700;color:#0d3d22;min-width:130px;flex-shrink:0;text-transform:capitalize}
  .rv-skill-val{color:#374151}
  .rv-ext-link{color:#27a85f;font-size:11px;display:flex;align-items:center;gap:2px;text-decoration:none}
  .rv-ext-link:hover{color:#1a8045}

  /* Error */
  .rv-err{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:2rem}
  .rv-err-card{background:#fff;border:1px solid var(--border);border-radius:20px;padding:2.5rem;text-align:center;box-shadow:var(--sl);max-width:340px;width:100%}
  .rv-err-title{font-size:1rem;font-weight:600;color:var(--primary);margin-bottom:1rem}
  .rv-err-btn{padding:.65rem 1.5rem;border-radius:var(--r-md);background:var(--primary);color:#fff;border:none;font-family:'Sora',sans-serif;font-size:.88rem;font-weight:600;cursor:pointer}
  .rv-err-btn:hover{background:var(--primary-h)}

  /* Print */
  @media print{
    .rv-page{background:white!important;padding:0!important}
    .rv-bar{display:none!important}
    .rv-sheet{border:none!important;box-shadow:none!important;padding:.5in!important;border-radius:0!important}
  }

  /* Responsive */
  @media(max-width:768px){
    .rv-bar-inner{padding:1.1rem 1.3rem;border-radius:18px}
    .rv-sheet{padding:2rem 1.6rem 2.5rem;border-radius:20px}
    .rv-name{font-size:1.75rem}
  }
  @media(max-width:540px){
    .rv-page{padding:1rem .85rem 4rem}
    .rv-bar{border-radius:16px;margin-bottom:1rem}
    .rv-bar-inner{padding:.95rem 1rem}
    .rv-sheet{padding:1.4rem 1.1rem 2rem;border-radius:16px}
    .rv-name{font-size:1.5rem}
    .rv-contacts{gap:.35rem .9rem}
    .rv-contact-item{font-size:11.5px}
    .rv-links{gap:1rem}
    .rv-bar-actions{gap:.4rem}
    .rv-btn{font-size:.74rem;padding:.45rem .85rem}
    .rv-btn-icon{padding:.45rem .55rem}
    .rv-row{flex-direction:column;gap:1px}
    .rv-skill-row{flex-direction:column;gap:1px}
    .rv-skill-key{min-width:unset}
  }
  @media(max-width:380px){
    .rv-title{font-size:1.15rem}
    .rv-btn span{display:none}
    .rv-btn-primary span{display:none}
  }
`;

const ResumeView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeRef = useRef();

  const stateData = location.state?.resume;
  const resume = stateData?.data || stateData;

  const handleDownload = () => {
    const opt = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `${resume?.fullName || resume?.fn || "resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(resumeRef.current).save();
  };

  const safeUrl = (u) => !u ? "#" : u.startsWith("http") ? u : `https://${u}`;

  if (!resume) return (
    <>
      <style>{S}</style>
      <div className="rv-err">
        <div className="rv-err-card">
          <p className="rv-err-title">No resume data found</p>
          <button className="rv-err-btn" onClick={() => navigate("/student/resume-builder")}>Go to Builder</button>
        </div>
      </div>
    </>
  );

  const name = resume.fullName || resume.fn || "Your Name";
  const email = resume.email || resume.e;
  const phone = resume.phone || resume.ph;
  const address = resume.address || resume.ad;
  const linkedin = resume.linkedin || resume.li;
  const github = resume.github || resume.gh;
  const portfolio = resume.portfolio || resume.pf;
  const summary = resume.summary || resume.sm;
  const education = resume.education || resume.ed || [];
  const experience = resume.experience || resume.ex || [];
  const skills = resume.skillsCategorized || resume.skills;
  const projects = resume.projects || resume.pr || [];
  const certs = resume.certifications || resume.cer || [];
  const ach = resume.achievementsStructured || resume.ach || [];
  const langs = resume.languagesKnown || resume.lang || [];

  return (
    <>
      <style>{S}</style>
      <div className="rv-page">
        <div className="rv-wrap">

          {/* Control bar */}
          <div className="rv-bar">
            <div className="rv-bar-inner">
              <div className="rv-bar-left">
                <div>
                  <p className="rv-eyebrow">Career Tools</p>
                  <h1 className="rv-title">Resume <em>Preview</em></h1>
                </div>
              </div>
              <div className="rv-bar-actions">
                <button className="rv-btn rv-btn-ghost" onClick={() => navigate("/student/resume-builder")}>
                  <RiArrowLeftLine /> <span>Back</span>
                </button>
                <button className="rv-btn rv-btn-primary" onClick={handleDownload}>
                  <RiDownloadLine /> <span>Download PDF</span>
                </button>
                <button className="rv-btn rv-btn-ghost rv-btn-icon" onClick={() => window.print()} title="Print">
                  <RiPrinterLine />
                </button>
              </div>
            </div>
          </div>

          {/* Resume sheet */}
          <div ref={resumeRef} className="rv-sheet">

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 0 }}>
              <h1 className="rv-name">{name}</h1>
              <div className="rv-contacts">
                {email && <span className="rv-contact-item"><RiMailLine className="rv-contact-icon" />{email}</span>}
                {phone && <span className="rv-contact-item"><RiPhoneLine className="rv-contact-icon" />{phone}</span>}
                {address && <span className="rv-contact-item"><RiMapPinLine className="rv-contact-icon" />{address}</span>}
              </div>
              {(linkedin || github || portfolio) && (
                <div className="rv-links">
                  {linkedin && <a href={safeUrl(linkedin)} className="rv-link" target="_blank" rel="noreferrer"><RiLinkedinBoxLine />LinkedIn</a>}
                  {github && <a href={safeUrl(github)} className="rv-link" target="_blank" rel="noreferrer"><RiGithubLine />GitHub</a>}
                  {portfolio && <a href={safeUrl(portfolio)} className="rv-link" target="_blank" rel="noreferrer"><RiGlobalLine />Portfolio</a>}
                </div>
              )}
            </div>

            <hr className="rv-divider" />

            {/* Summary */}
            {summary && (
              <RvSection title="Professional Summary">
                <p className="rv-para">{summary}</p>
              </RvSection>
            )}

            {/* Education */}
            {education.filter(e => e.institution).length > 0 && (
              <RvSection title="Education">
                {education.filter(e => e.institution).map((edu, i) => (
                  <div key={i} className="rv-item">
                    <div className="rv-row">
                      <span className="rv-row-l">{edu.institution}</span>
                      <span className="rv-row-r">
                        {edu.startYear?.split("-")[0]} — {edu.endYear?.split("-")[0] || "Present"}
                      </span>
                    </div>
                    <div className="rv-row">
                      <span className="rv-row-sub">{edu.degreeType}{edu.state ? ` · ${edu.state}` : ""}</span>
                      {edu.cgpa && <span className="rv-row-sub-r">{edu.cgpa} CGPA</span>}
                    </div>
                  </div>
                ))}
              </RvSection>
            )}

            {/* Experience */}
            {experience.filter(e => e.company || e.role).length > 0 && (
              <RvSection title="Experience">
                {experience.filter(e => e.company || e.role).map((exp, i) => (
                  <div key={i} className="rv-item">
                    <div className="rv-row">
                      <span className="rv-row-l" style={{ textTransform: "uppercase", fontSize: "13px" }}>{exp.role}</span>
                      <span className="rv-row-r">{exp.startDate} — {exp.endDate || "Present"}</span>
                    </div>
                    <div className="rv-row">
                      <span className="rv-row-sub" style={{ color: "#0d3d22", fontWeight: 600 }}>
                        {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                      </span>
                      {exp.projectUrl && (
                        <a href={safeUrl(exp.projectUrl)} className="rv-ext-link" target="_blank" rel="noreferrer">
                          <RiExternalLinkLine /> Link
                        </a>
                      )}
                    </div>
                    {exp.desc && <p className="rv-para">{exp.desc}</p>}
                  </div>
                ))}
              </RvSection>
            )}

            {/* Skills */}
            {skills && Object.values(skills).some(Boolean) && (
              <RvSection title="Technical Skills">
                {Object.entries(skills).map(([k, v]) => v && (
                  <div key={k} className="rv-skill-row">
                    <span className="rv-skill-key">{k}:</span>
                    <span className="rv-skill-val">{v}</span>
                  </div>
                ))}
              </RvSection>
            )}

            {/* Projects */}
            {projects.filter(p => p.name).length > 0 && (
              <RvSection title="Projects">
                {projects.filter(p => p.name).map((p, i) => (
                  <div key={i} className="rv-item">
                    <div className="rv-row">
                      <span className="rv-row-l">{p.name}</span>
                      {p.link && (
                        <a href={safeUrl(p.link)} className="rv-ext-link" target="_blank" rel="noreferrer">
                          <RiExternalLinkLine /> View
                        </a>
                      )}
                    </div>
                    {p.description && <p className="rv-para">{p.description}</p>}
                  </div>
                ))}
              </RvSection>
            )}

            {/* Certifications */}
            {certs.filter(c => c.courseName).length > 0 && (
              <RvSection title="Certifications">
                {certs.filter(c => c.courseName).map((c, i) => (
                  <div key={i} className="rv-item">
                    <div className="rv-row">
                      <span className="rv-row-l">{c.courseName}</span>
                      {c.issueDate && <span className="rv-row-r">{c.issueDate}</span>}
                    </div>
                    <div className="rv-row">
                      {c.platform && <span className="rv-row-sub">{c.platform}</span>}
                      {c.certificateLink && (
                        <a href={safeUrl(c.certificateLink)} className="rv-ext-link" target="_blank" rel="noreferrer">
                          <RiExternalLinkLine /> Certificate
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </RvSection>
            )}

            {/* Achievements */}
            {ach.filter(a => (typeof a === "string" ? a.trim() : Object.values(a).some(Boolean))).length > 0 && (
              <RvSection title="Achievements">
                <ul style={{ paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {ach
                    .filter(a => (typeof a === "string" ? a.trim() : Object.values(a).some(Boolean)))
                    .map((a, i) => (
                      <li key={i} style={{ fontSize: "13px", color: "#374151", lineHeight: 1.55 }}>
                        {typeof a === "string" ? a : a.academic || Object.values(a).find(Boolean)}
                      </li>
                    ))}
                </ul>
              </RvSection>
            )}

            {/* Languages */}
            {langs.filter(l => l.trim()).length > 0 && (
              <RvSection title="Languages">
                <p style={{ fontSize: "13px", color: "#374151" }}>
                  {langs.filter(l => l.trim()).join(" · ")}
                </p>
              </RvSection>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

const RvSection = ({ title, children }) => (
  <div className="rv-sec">
    <h2 className="rv-sec-title">{title}</h2>
    {children}
  </div>
);

export default ResumeView;