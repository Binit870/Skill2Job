import { forwardRef } from "react";
import {
  RiMailLine, RiPhoneLine, RiMapPinLine,
  RiLinkedinBoxLine, RiGithubLine, RiGlobalLine, RiExternalLinkLine,
} from "react-icons/ri";

export const RESUME_SHEET_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

  :root {
    --bg:        #F7F5EF;
    --surface:   #ffffff;
    --border:    #E7E4DA;
    --primary:   #0D1512;
    --primary-h: #143D30;
    --accent:    #0E6B52;
    --accent-lt: #E9F2EE;
    --accent-md: #BBDACE;
    --text-3:    #7a9984;
    --danger-lt: #fef2f2;
  }

  .rv-sheet * , .rv-sheet *::before, .rv-sheet *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rv-sheet {
    background: #fff;
    padding: 2.8rem 2.8rem 3.2rem;
    border: none;
    border-radius: 0;
    box-shadow: none;
    font-family: 'Sora', sans-serif;
  }

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

  @media (max-width: 768px) {
    .rv-sheet { padding: 1.8rem 1.5rem 2.2rem; }
    .rv-name  { font-size: 1.65rem; }
  }
  @media (max-width: 540px) {
    .rv-sheet { padding: 1.3rem 1rem 1.8rem; }
    .rv-name  { font-size: 1.35rem; }
    .rv-contacts { gap: .3rem .75rem; }
    .rv-contact-item { font-size: 11px; }
    .rv-links { gap: .85rem; }
    .rv-row   { flex-direction: column; gap: 1px; }
    .rv-skill-row { flex-direction: column; gap: 1px; }
    .rv-skill-key { min-width: unset; }
  }
`;

export const safeUrl = (u) => (!u ? "#" : u.startsWith("http") ? u : `https://${u}`);

const RvSection = ({ title, children }) => (
  <div className="rv-sec">
    <h2 className="rv-sec-title">{title}</h2>
    {children}
  </div>
);

/**
 * The actual visual resume — accepts data in either the ResumeBuilder's
 * short-key shape (fn, e, ph, ed, ex...) or the saved Resume model's shape
 * (fullName, email, phone, education, experience...), same fallback chain
 * ResumeView always used.
 *
 * forwardRef so a parent (ResumeView for visible preview, or ResumeBuilder
 * for a hidden off-screen render) can pass this DOM node straight to
 * html2pdf().from(ref.current).
 */
const ResumeSheet = forwardRef(({ resume }, ref) => {
  if (!resume) return null;

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
    <div ref={ref} className="rv-sheet">
      <style>{RESUME_SHEET_STYLES}</style>

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

      {summary && (
        <RvSection title="Professional Summary">
          <p className="rv-para">{summary}</p>
        </RvSection>
      )}

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

      {langs.filter(l => l.trim()).length > 0 && (
        <RvSection title="Languages">
          <p style={{ fontSize: "12.5px", color: "#000" }}>
            {langs.filter(l => l.trim()).join(" · ")}
          </p>
        </RvSection>
      )}
    </div>
  );
});

ResumeSheet.displayName = "ResumeSheet";
export default ResumeSheet;