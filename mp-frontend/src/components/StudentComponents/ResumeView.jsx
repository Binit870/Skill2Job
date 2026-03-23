import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer, ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root{
    --s:#1e293b;--s2:#334155;--s3:#64748b;
    --a:#d97706;--a2:#f59e0b;--ab:#fffbeb;
    --c3:#e8e4dc;
    --sh:0 4px 16px rgba(30,41,59,.09),0 2px 6px rgba(30,41,59,.06);
    --sl:0 12px 40px rgba(30,41,59,.12),0 4px 12px rgba(30,41,59,.07);
  }

  /* ── Page ── */
  .rv-page{
    min-height:100vh;background-color:#0f172a;font-family:'DM Sans',sans-serif;
    background-image:linear-gradient(rgba(217,119,6,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(217,119,6,.04) 1px,transparent 1px);
    background-size:40px 40px;padding:2.5rem 1.5rem;position:relative;overflow-x:hidden;
  }
  .rv-page::before{content:'';position:fixed;top:-120px;left:-120px;width:480px;height:480px;background:radial-gradient(circle,rgba(217,119,6,.1) 0%,transparent 65%);border-radius:50%;pointer-events:none;z-index:0}
  .rv-page::after{content:'';position:fixed;bottom:-100px;right:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(30,41,59,.8) 0%,transparent 70%);border-radius:50%;pointer-events:none;z-index:0}

  .rv-wrap{max-width:860px;margin:0 auto;position:relative;z-index:1;animation:rise .55s cubic-bezier(.22,1,.36,1) both}
  @keyframes rise{from{opacity:0;transform:translateY(28px) scale(.98)}to{opacity:1;transform:none}}

  /* ── Top control bar ── */
  .rv-bar{
    background:#fff;border:1px solid var(--c3);border-radius:18px;
    box-shadow:var(--sl);overflow:hidden;margin-bottom:1.5rem;
  }

  /* Bar header — same dark strip as MyResume */
  .rv-bar-hd{
    background:var(--s);padding:1.5rem 2rem;position:relative;overflow:hidden;
    display:flex;align-items:center;justify-content:space-between;gap:1rem;
  }
  .rv-bar-hd::before{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;background:radial-gradient(circle,rgba(217,119,6,.22) 0%,transparent 65%);border-radius:50%;pointer-events:none}
  .rv-bar-hd::after{content:'';position:absolute;bottom:-40px;left:40px;width:160px;height:160px;background:radial-gradient(circle,rgba(217,119,6,.1) 0%,transparent 65%);border-radius:50%;pointer-events:none}

  .rv-bar-left{position:relative;z-index:1}
  .rv-eye{font-size:.68rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--a2);margin-bottom:.3rem}
  .rv-ttl{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:#fff;line-height:1.15}
  .rv-ttl em{font-style:italic;color:var(--a2)}

  /* Bar actions */
  .rv-bar-actions{display:flex;align-items:center;gap:.6rem;position:relative;z-index:1;flex-wrap:wrap}

  .rv-btn-back{display:inline-flex;align-items:center;gap:6px;padding:.55rem 1.1rem;border-radius:9px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);color:#fff;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap}
  .rv-btn-back:hover{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.3);transform:translateY(-1px)}

  .rv-btn-dl{display:inline-flex;align-items:center;gap:7px;padding:.6rem 1.3rem;border-radius:10px;background:linear-gradient(135deg,var(--a),#b45309);color:#fff;border:none;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap;box-shadow:0 3px 10px rgba(217,119,6,.3)}
  .rv-btn-dl:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(217,119,6,.4)}

  .rv-btn-print{display:inline-flex;align-items:center;gap:7px;padding:.6rem 1.3rem;border-radius:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:#fff;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap}
  .rv-btn-print:hover{background:rgba(255,255,255,.15);transform:translateY(-1px)}

  /* ── Resume sheet ── */
  .rv-sheet{background:#fff;padding:2.5rem;border:1px solid var(--c3);border-radius:18px;box-shadow:var(--sl)}

  /* ── Error state ── */
  .rv-err{min-height:100vh;background-color:#0f172a;display:flex;align-items:center;justify-content:center;padding:2rem}
  .rv-err-card{background:#fff;border:1px solid var(--c3);border-radius:18px;padding:2.5rem;text-align:center;box-shadow:var(--sl);max-width:360px;width:100%}
  .rv-err-card p{color:#dc2626;font-weight:600;margin-bottom:1rem;font-family:'DM Sans',sans-serif}
  .rv-err-btn{display:inline-flex;align-items:center;gap:6px;padding:.65rem 1.5rem;border-radius:10px;background:var(--s);color:#fff;border:none;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s}
  .rv-err-btn:hover{background:var(--s2);transform:translateY(-1px)}

  @media print{
    .rv-page{background:white!important;padding:0!important}
    .rv-page::before,.rv-page::after{display:none!important}
    .rv-bar{display:none!important}
    .rv-wrap{max-width:100%!important}
    .rv-sheet{border:none!important;border-radius:0!important;box-shadow:none!important;padding:0.5in!important}
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
      margin:[0.3,0.3,0.3,0.3],
      filename:`${resume?.fullName||"resume"}.pdf`,
      image:{type:"jpeg",quality:0.98},
      html2canvas:{scale:3,useCORS:true,letterRendering:true},
      jsPDF:{unit:"in",format:"a4",orientation:"portrait"}
    };
    html2pdf().set(opt).from(resumeRef.current).save();
  };

  const url = (u) => !u ? "#" : u.startsWith("http") ? u : `https://${u}`;

  if (!resume) return (
    <>
      <style>{S}</style>
      <div className="rv-err">
        <div className="rv-err-card">
          <p>No resume data found!</p>
          <button className="rv-err-btn" onClick={() => navigate("/student/resume")}>Go Back</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{S}</style>
      <div className="rv-page">
        <div className="rv-wrap">

          {/* ── Control Bar ── */}
          <div className="rv-bar print:hidden">
            <div className="rv-bar-hd">
              <div className="rv-bar-left">
                <p className="rv-eye">Career Tools</p>
                <h1 className="rv-ttl">Resume <em>Preview</em></h1>
              </div>
              <div className="rv-bar-actions">
                <button className="rv-btn-back" onClick={() => navigate("/student/resume-builder")}>
                  <ArrowLeft size={15} /> Back to Editor
                </button>
                <button className="rv-btn-dl" onClick={handleDownload}>
                  <Download size={15} /> Download PDF
                </button>
                <button className="rv-btn-print" onClick={() => window.print()}>
                  <Printer size={15} /> Print
                </button>
              </div>
            </div>
          </div>

          {/* ── Resume Sheet (print-ready white) ── */}
          <div ref={resumeRef} className="rv-sheet">

            {/* Header */}
            <div style={{textAlign:"center",borderBottom:"2px solid #000",paddingBottom:"1.25rem",marginBottom:"1.25rem"}}>
              <h1 style={{fontSize:"2rem",fontWeight:900,textTransform:"uppercase",letterSpacing:"-0.03em",marginBottom:"0.4rem",fontFamily:"Georgia,serif"}}>
                {resume.fullName||resume.fn||"Your Name"}
              </h1>
              <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"0.75rem 1.25rem",fontSize:"13px",color:"#4b5563",fontFamily:"sans-serif"}}>
                {(resume.email||resume.e)&&<span style={{display:"flex",alignItems:"center",gap:"4px",fontWeight:600}}><Mail size={12}/>{resume.email||resume.e}</span>}
                {(resume.phone||resume.ph)&&<span style={{display:"flex",alignItems:"center",gap:"4px",fontWeight:600}}><Phone size={12}/>{resume.phone||resume.ph}</span>}
                {(resume.address||resume.ad)&&<span style={{display:"flex",alignItems:"center",gap:"4px",fontWeight:600}}><MapPin size={12}/>{resume.address||resume.ad}</span>}
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:"1.25rem",marginTop:"0.6rem",fontSize:"13px",fontFamily:"sans-serif",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                {(resume.linkedin||resume.li)&&<a href={url(resume.linkedin||resume.li)} style={{color:"#000"}}>LinkedIn</a>}
                {(resume.github||resume.gh)&&<a href={url(resume.github||resume.gh)} style={{color:"#000"}}>GitHub</a>}
                {(resume.portfolio||resume.pf)&&<a href={url(resume.portfolio||resume.pf)} style={{color:"#000"}}>Portfolio</a>}
              </div>
            </div>

            {/* Summary */}
            {(resume.summary||resume.sm)&&(
              <Section title="Professional Summary">
                <p style={{fontSize:"13.5px",lineHeight:1.7,textAlign:"justify"}}>{resume.summary||resume.sm}</p>
              </Section>
            )}

            {/* Education */}
            {(resume.education?.length>0||resume.ed?.length>0)&&(
              <Section title="Education">
                {(resume.education||resume.ed).map((edu,i)=>edu.institution&&(
                  <div key={i} style={{marginBottom:"0.75rem"}}>
                    <Row left={<b style={{fontSize:"14.5px"}}>{edu.institution}</b>} right={<span style={{fontSize:"13px",fontWeight:600}}>{edu.startYear?.split("-")[0]} — {edu.endYear?.split("-")[0]||"Present"}</span>}/>
                    <Row left={<i style={{fontSize:"13px",color:"#4b5563"}}>{edu.degreeType}{edu.state?` | ${edu.state}`:""}</i>} right={edu.cgpa&&<span style={{fontSize:"12px",fontWeight:700}}>{edu.cgpa}</span>}/>
                  </div>
                ))}
              </Section>
            )}

            {/* Experience */}
            {(resume.experience?.length>0||resume.ex?.length>0)&&(
              <Section title="Experience">
                {(resume.experience||resume.ex).map((exp,i)=>(exp.company||exp.role)&&(
                  <div key={i} style={{marginBottom:"1rem"}}>
                    <Row left={<b style={{fontSize:"14.5px",textTransform:"uppercase"}}>{exp.role}</b>} right={<span style={{fontSize:"12.5px",fontWeight:600}}>{exp.startDate} — {exp.endDate||"Present"}</span>}/>
                    <Row
                      left={<i style={{fontSize:"13px",color:"#4b5563",fontWeight:600}}>{exp.company}{exp.location?` | ${exp.location}`:""}</i>}
                      right={exp.projectUrl&&<a href={url(exp.projectUrl)} style={{color:"#000",fontSize:"12px",display:"flex",alignItems:"center",gap:"3px"}}><ExternalLink size={10}/> Link</a>}
                    />
                    {exp.desc&&<p style={{fontSize:"13px",lineHeight:1.65,paddingLeft:"0.75rem",borderLeft:"2px solid #d1d5db",marginTop:"0.35rem",whiteSpace:"pre-line"}}>{exp.desc}</p>}
                  </div>
                ))}
              </Section>
            )}

            {/* Skills */}
            {(resume.skillsCategorized||resume.skills)&&(
              <Section title="Technical Skills">
                <div style={{display:"flex",flexDirection:"column",gap:"3px",fontFamily:"sans-serif"}}>
                  {Object.entries(resume.skillsCategorized||resume.skills).map(([k,v])=>v&&(
                    <div key={k} style={{fontSize:"13.5px"}}>
                      <strong style={{textTransform:"capitalize",color:"#000"}}>{k}:</strong>{" "}
                      <span style={{color:"#374151"}}>{v}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Projects */}
            {(resume.projects?.length>0||resume.pr?.length>0)&&(
              <Section title="Key Projects">
                {(resume.projects||resume.pr).map((p,i)=>p.name&&(
                  <div key={i} style={{marginBottom:"0.6rem"}}>
                    <Row
                      left={<b style={{fontSize:"14px"}}>{p.name}</b>}
                      right={p.link&&<a href={url(p.link)} style={{color:"#000",fontSize:"12px",display:"flex",alignItems:"center",gap:"3px"}}><ExternalLink size={10}/> Link</a>}
                    />
                    {p.description&&<p style={{fontSize:"13px",color:"#374151",lineHeight:1.6}}>{p.description}</p>}
                  </div>
                ))}
              </Section>
            )}

            {/* Certifications */}
            {(resume.certifications?.length>0||resume.cer?.length>0)&&(
              <Section title="Certifications">
                {(resume.certifications||resume.cer).map((c,i)=>c.courseName&&(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"13.5px",marginBottom:"0.3rem",fontFamily:"sans-serif"}}>
                    <span><b>{c.courseName}</b> — <i style={{color:"#6b7280"}}>{c.platform}</i></span>
                    <span style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
                      {c.issueDate&&<span style={{fontSize:"12px",fontWeight:600}}>{c.issueDate}</span>}
                      {c.certificateLink&&<a href={url(c.certificateLink)} style={{color:"#000"}}><ExternalLink size={12}/></a>}
                    </span>
                  </div>
                ))}
              </Section>
            )}

            {/* Achievements + Languages */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem",marginTop:"1.25rem"}}>
              {(resume.achievementsStructured||resume.ach||resume.achievements)?.length>0&&(
                <div>
                  <h2 style={{fontSize:"13.5px",fontWeight:900,textTransform:"uppercase",borderBottom:"2px solid #d1d5db",paddingBottom:"4px",marginBottom:"0.6rem",letterSpacing:"0.06em",fontFamily:"sans-serif"}}>Achievements</h2>
                  <ul style={{listStyle:"disc",paddingLeft:"1rem",fontSize:"13px",display:"flex",flexDirection:"column",gap:"4px"}}>
                    {(resume.achievementsStructured||resume.ach||resume.achievements).map((a,i)=>(
                      typeof a==="string"
                        ? a&&<li key={i}>{a}</li>
                        : <div key={i}>
                            {a.academic&&<li><b>Academic:</b> {a.academic}</li>}
                            {a.project&&<li><b>Project:</b> {a.project}</li>}
                            {a.technical&&<li><b>Technical:</b> {a.technical}</li>}
                            {a.leadership&&<li><b>Leadership:</b> {a.leadership}</li>}
                          </div>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h2 style={{fontSize:"13.5px",fontWeight:900,textTransform:"uppercase",borderBottom:"2px solid #d1d5db",paddingBottom:"4px",marginBottom:"0.6rem",letterSpacing:"0.06em",fontFamily:"sans-serif"}}>Language</h2>
                <p style={{fontSize:"13px",fontWeight:600,fontFamily:"sans-serif"}}>
                  {Array.isArray(resume.languagesKnown||resume.lang)
                    ?(resume.languagesKnown||resume.lang).join(", ")
                    :(resume.languagesKnown||resume.lang)}
                </p>
              </div>
            </div>

          </div>{/* /rv-sheet */}
        </div>
      </div>
    </>
  );
};

/* ── helpers ── */
const Section = ({title,children})=>(
  <div style={{marginBottom:"1.25rem"}}>
    <h2 style={{fontSize:"15px",fontWeight:900,textTransform:"uppercase",borderBottom:"2px solid #d1d5db",paddingBottom:"4px",marginBottom:"0.6rem",letterSpacing:"0.06em",fontFamily:"sans-serif"}}>{title}</h2>
    {children}
  </div>
);
const Row = ({left,right})=>(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:"0.5rem"}}>
    <span>{left}</span>{right&&<span style={{flexShrink:0}}>{right}</span>}
  </div>
);

export default ResumeView;