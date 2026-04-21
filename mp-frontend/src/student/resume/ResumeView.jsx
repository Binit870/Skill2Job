import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import {
  RiArrowLeftLine,
  RiDownloadLine,
  RiExternalLinkLine,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiLinkedinBoxLine,
  RiGithubLine,
  RiGlobalLine,
} from "react-icons/ri";

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
    --text-3:    #7a9984;
    --danger-lt: #fef2f2;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rv-page {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Sora', sans-serif;
    padding: 2rem 1.25rem 5rem;
  }

  .rv-wrap {
    max-width: 860px;
    margin: 0 auto;
    animation: rv-rise .35s ease both;
  }
  @keyframes rv-rise {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: none; }
  }

  /* ── Control bar ── */
  .rv-bar {
    background: var(--primary);
    border-radius: 0;
    margin-bottom: 1.4rem;
  }
  .rv-bar-inner {
    padding: 1.1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .rv-bar-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }
  .rv-eyebrow {
    font-size: .6rem;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 1px;
  }
  .rv-title {
    font-size: clamp(1.1rem, 3vw, 1.55rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
  }
  .rv-title em { color: var(--accent); font-style: normal; }
  .rv-bar-actions {
    display: flex;
    align-items: center;
    gap: .45rem;
    flex-shrink: 0;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  /* ── Bar buttons ── */
  .rv-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: .48rem .95rem;
    border-radius: 0;
    font-family: 'Sora', sans-serif;
    font-size: .78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all .18s;
    white-space: nowrap;
    border: none;
  }
  .rv-btn-ghost {
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.2);
    color: #fff;
  }
  .rv-btn-ghost:hover { background: rgba(255,255,255,.22); }
  .rv-btn-primary {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 3px 10px rgba(39,168,95,.25);
  }
  .rv-btn-primary:hover { background: #2ec96b; }

  /* ── Resume sheet ── */
  .rv-sheet {
    background: #fff;
    padding: 2.8rem 2.8rem 3.2rem;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }

  /* ── All resume text: black ── */
  .rv-name {
    font-size: 2rem;
    font-weight: 900;
    text-transform: uppercase;
    color: #000;
    letter-spacing: .025em;
    line-height: 1;
    margin-bottom: .55rem;
  }
  .rv-contacts {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: .35rem 1rem;
    margin-bottom: .6rem;
  }
  .rv-contact-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #000;
    line-height: 1;
  }
  .rv-contact-icon {
    color: #000;
    font-size: .85rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    line-height: 1;
  }

  .rv-links {
    display: flex;
    justify-content: center;
    gap: 1.2rem;
    flex-wrap: wrap;
  }
  .rv-link {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: #000;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .rv-link:hover { text-decoration: underline; }

  .rv-divider {
    border: none;
    border-top: 1.5px solid #000;
    margin: 1rem 0 1.3rem;
  }

  /* ── Sections ── */
  .rv-sec { margin-bottom: 1.3rem; }
  .rv-sec-title {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .07em;
    color: #000;
    border-bottom: 1.5px solid #000;
    padding-bottom: 3px;
    margin-bottom: .7rem;
  }
  .rv-item { margin-bottom: .8rem; }
  .rv-item:last-child { margin-bottom: 0; }

  .rv-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: .5rem;
    flex-wrap: wrap;
  }
  .rv-row-l  { font-size: 13px; font-weight: 700; color: #000; }
  .rv-row-r  { font-size: 11px; font-weight: 700; color: #000; flex-shrink: 0; white-space: nowrap; }
  .rv-row-sub   { font-size: 12px; font-style: italic; color: #000; font-weight: 500; }
  .rv-row-sub-r { font-size: 11.5px; font-weight: 600; color: #000; flex-shrink: 0; }

  .rv-para {
    font-size: 12.5px;
    line-height: 1.65;
    color: #000;
    margin-top: .28rem;
    white-space: pre-line;
  }

  .rv-skill-row {
    font-size: 12.5px;
    display: flex;
    gap: .35rem;
    margin-bottom: 3px;
    flex-wrap: wrap;
  }
  .rv-skill-key {
    font-weight: 700;
    color: #000;
    min-width: 130px;
    flex-shrink: 0;
    text-transform: capitalize;
  }
  .rv-skill-val { color: #000; }

  .rv-ext-link {
    color: #000;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 2px;
    text-decoration: none;
  }
  .rv-ext-link:hover { text-decoration: underline; }

  /* ── Error state ── */
  .rv-err {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .rv-err-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 0;
    padding: 2.2rem;
    text-align: center;
    max-width: 320px;
    width: 100%;
  }
  .rv-err-title { font-size: 1rem; font-weight: 600; color: var(--primary); margin-bottom: 1rem; }
  .rv-err-btn {
    padding: .6rem 1.4rem;
    border-radius: 0;
    background: var(--primary);
    color: #fff;
    border: none;
    font-family: 'Sora', sans-serif;
    font-size: .86rem;
    font-weight: 600;
    cursor: pointer;
  }
  .rv-err-btn:hover { background: var(--primary-h); }

  /* ── Print ── */
  @media print {
    .rv-page { background: white !important; padding: 0 !important; }
    .rv-bar  { display: none !important; }
    .rv-sheet { border: none !important; box-shadow: none !important; padding: .5in !important; }
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .rv-sheet { padding: 1.8rem 1.5rem 2.2rem; }
    .rv-name  { font-size: 1.65rem; }
  }
  @media (max-width: 540px) {
    .rv-page  { padding: .85rem .75rem 4rem; }
    .rv-bar   { margin-bottom: 1rem; }
    .rv-bar-inner { padding: .9rem 1rem; }
    .rv-sheet { padding: 1.3rem 1rem 1.8rem; }
    .rv-name  { font-size: 1.35rem; }
    .rv-contacts { gap: .3rem .75rem; }
    .rv-contact-item { font-size: 11px; }
    .rv-links { gap: .85rem; }
    .rv-btn   { font-size: .73rem; padding: .44rem .8rem; }
    .rv-row   { flex-direction: column; gap: 1px; }
    .rv-skill-row { flex-direction: column; gap: 1px; }
    .rv-skill-key { min-width: unset; }
  }
  @media (max-width: 380px) {
    .rv-title { font-size: 1rem; }
    .rv-btn span { display: none; }
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
          <button className="rv-err-btn" onClick={() => navigate("/student/resume-builder")}>
            Go to Builder
          </button>
        </div>
      </div>
    </>
  );

  const name       = resume.fullName || resume.fn || "Your Name";
  const email      = resume.email    || resume.e;
  const phone      = resume.phone    || resume.ph;
  const address    = resume.address  || resume.ad;
  const linkedin   = resume.linkedin || resume.li;
  const github     = resume.github   || resume.gh;
  const portfolio  = resume.portfolio|| resume.pf;
  const summary    = resume.summary  || resume.sm;
  const education  = resume.education|| resume.ed  || [];
  const experience = resume.experience||resume.ex  || [];
  const skills     = resume.skillsCategorized || resume.skills;
  const projects   = resume.projects || resume.pr  || [];
  const certs      = resume.certifications || resume.cer || [];
  const ach        = resume.achievementsStructured || resume.ach || [];
  const langs      = resume.languagesKnown || resume.lang || [];

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
              </div>
            </div>
          </div>

          {/* Resume sheet */}
          <div ref={resumeRef} className="rv-sheet">

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 0 }}>
              <h1 className="rv-name">{name}</h1>
              <div className="rv-contacts">
                {email   && <span className="rv-contact-item"><span className="rv-contact-icon"><RiMailLine   /></span>{email}</span>}
                {phone   && <span className="rv-contact-item"><span className="rv-contact-icon"><RiPhoneLine  /></span>{phone}</span>}
                {address && <span className="rv-contact-item"><span className="rv-contact-icon"><RiMapPinLine /></span>{address}</span>}
              </div>
              {(linkedin || github || portfolio) && (
                <div className="rv-links">
                  {linkedin  && <a href={safeUrl(linkedin)}  className="rv-link" target="_blank" rel="noreferrer"><RiLinkedinBoxLine />LinkedIn</a>}
                  {github    && <a href={safeUrl(github)}    className="rv-link" target="_blank" rel="noreferrer"><RiGithubLine />GitHub</a>}
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
                      {edu.cgpa && <span className="rv-row-sub-r">{edu.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </RvSection>
            )}

            {/* Experience */}
            {experience.filter(e => e.company || e.role).length > 0 && (
              <RvSection title="Internship / Experience">
                {experience.filter(e => e.company || e.role).map((exp, i) => (
                  <div key={i} className="rv-item">
                    <div className="rv-row">
                      <span className="rv-row-l" style={{ textTransform: "uppercase", fontSize: "12.5px" }}>{exp.role}</span>
                      <span className="rv-row-r">{exp.startDate} — {exp.endDate || "Present"}</span>
                    </div>
                    <div className="rv-row">
                      <span className="rv-row-sub" style={{ fontWeight: 600 }}>
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
                      <li key={i} style={{ fontSize: "12.5px", color: "#000", lineHeight: 1.55 }}>
                        {typeof a === "string" ? a : a.academic || Object.values(a).find(Boolean)}
                      </li>
                    ))}
                </ul>
              </RvSection>
            )}

            {/* Languages */}
            {langs.filter(l => l.trim()).length > 0 && (
              <RvSection title="Languages">
                <p style={{ fontSize: "12.5px", color: "#000" }}>
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