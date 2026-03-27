import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Printer, ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root{
    --s:#14532d;  /* Dark Green */
    --s2:#166534;
    --a:#16a34a;  /* Accent Green */
    --a2:#22c55e;
    --c3:#bbf7d0; /* Light Green Border */
    --sh:0 4px 16px rgba(20,83,45,.10),0 2px 6px rgba(20,83,45,.06);
    --sl:0 12px 40px rgba(20,83,45,.12),0 4px 12px rgba(20,83,45,.07);
  }

  /* ── Page ── */
  .rv-page{
    min-height:100vh; background-color:#f0fdf4; font-family:'DM Sans',sans-serif;
    padding:2.5rem 1.5rem; position:relative; overflow-x:hidden;
  }
  .rv-page::before{content:'';position:fixed;top:-120px;left:-120px;width:480px;height:480px;background:radial-gradient(circle,rgba(34,197,94,.1) 0%,transparent 65%);border-radius:50%;pointer-events:none;z-index:0}

  .rv-wrap{max-width:860px;margin:0 auto;position:relative;z-index:1;animation:rise .55s cubic-bezier(.22,1,.36,1) both}
  @keyframes rise{from{opacity:0;transform:translateY(28px) scale(.98)}to{opacity:1;transform:none}}

  /* ── Top control bar ── */
  .rv-bar{
    background:var(--s); border-radius:24px;
    box-shadow:var(--sl); overflow:hidden; margin-bottom:1.5rem;
  }

  /* Bar header */
  .rv-bar-hd{
    padding:1.2rem 2rem; position:relative; overflow:hidden;
    display:flex; align-items:center; justify-content:space-between; gap:1rem;
  }

  .rv-bar-left{position:relative;z-index:1}
  .rv-eye{font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--a2);margin-bottom:.2rem}
  .rv-ttl{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:#fff;line-height:1.15}
  .rv-ttl em{font-style:italic;color:var(--a2)}

  /* Bar actions */
  .rv-bar-actions{display:flex;align-items:center;gap:.6rem;position:relative;z-index:1}

  .rv-btn-back{display:inline-flex;align-items:center;gap:6px;padding:.5rem 1rem;border-radius:10px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:.8rem;font-weight:600;cursor:pointer;transition:all .2s}
  .rv-btn-back:hover{background:rgba(255,255,255,.2);transform:translateY(-1px)}

  .rv-btn-dl{display:inline-flex;align-items:center;gap:7px;padding:.6rem 1.2rem;border-radius:12px;background:var(--a);color:#fff;border:none;font-size:.82rem;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(22,163,74,.3)}
  .rv-btn-dl:hover{background:var(--a2);transform:translateY(-2px);box-shadow:0 6px 16px rgba(22,163,74,.4)}

  .rv-btn-print{display:inline-flex;align-items:center;gap:7px;padding:.6rem 1.2rem;border-radius:12px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s}

  /* ── Resume sheet ── */
  .rv-sheet{
    background:#fff; padding:3rem; border:1px solid var(--c3);
    border-radius:24px; box-shadow:var(--sl);
  }

  /* ── Error state ── */
  .rv-err{min-height:100vh;background-color:#f0fdf4;display:flex;align-items:center;justify-content:center;padding:2rem}
  .rv-err-card{background:#fff;border:1px solid var(--c3);border-radius:20px;padding:2.5rem;text-align:center;box-shadow:var(--sl);max-width:360px;width:100%}
  .rv-err-btn{padding:.65rem 1.5rem;border-radius:12px;background:var(--s);color:#fff;border:none;font-weight:600;cursor:pointer}

  @media print{
    .rv-page{background:white!important;padding:0!important}
    .rv-bar{display:none!important}
    .rv-sheet{border:none!important;box-shadow:none!important;padding:0.5in!important}
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
          <p style={{marginBottom:'1rem', color:'#166534', fontWeight:600}}>No resume data found!</p>
          <button className="rv-err-btn" onClick={() => navigate("/student/resume-builder")}>Go Back</button>
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
                  <ArrowLeft size={15} /> Back
                </button>
                <button className="rv-btn-dl" onClick={handleDownload}>
                  <Download size={15} /> PDF
                </button>
                <button className="rv-btn-print" onClick={() => window.print()}>
                  <Printer size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Resume Sheet ── */}
          <div ref={resumeRef} className="rv-sheet">
            {/* Header */}
            <div style={{textAlign:"center",borderBottom:"2px solid #14532d",paddingBottom:"1.25rem",marginBottom:"1.5rem"}}>
              <h1 style={{fontSize:"2.2rem",fontWeight:900,textTransform:"uppercase",color:"#14532d",marginBottom:"0.5rem",fontFamily:"'Playfair Display', serif"}}>
                {resume.fullName||resume.fn||"Your Name"}
              </h1>
              <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:"1rem 1.5rem",fontSize:"13px",color:"#374151"}}>
                {(resume.email||resume.e)&&<span style={{display:"flex",alignItems:"center",gap:"4px"}}><Mail size={12} color="#16a34a"/>{resume.email||resume.e}</span>}
                {(resume.phone||resume.ph)&&<span style={{display:"flex",alignItems:"center",gap:"4px"}}><Phone size={12} color="#16a34a"/>{resume.phone||resume.ph}</span>}
                {(resume.address||resume.ad)&&<span style={{display:"flex",alignItems:"center",gap:"4px"}}><MapPin size={12} color="#16a34a"/>{resume.address||resume.ad}</span>}
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:"1.5rem",marginTop:"0.8rem",fontSize:"12px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>
                {(resume.linkedin||resume.li)&&<a href={url(resume.linkedin||resume.li)} style={{color:"#14532d", textDecoration:'none'}}>LinkedIn</a>}
                {(resume.github||resume.gh)&&<a href={url(resume.github||resume.gh)} style={{color:"#14532d", textDecoration:'none'}}>GitHub</a>}
                {(resume.portfolio||resume.pf)&&<a href={url(resume.portfolio||resume.pf)} style={{color:"#14532d", textDecoration:'none'}}>Portfolio</a>}
              </div>
            </div>

            {/* Sections remain professional black/white for readability, 
                with subtle green accents for headers */}
            {(resume.summary||resume.sm)&&(
              <Section title="Professional Summary">
                <p style={{fontSize:"13.5px",lineHeight:1.7,color:"#374151"}}>{resume.summary||resume.sm}</p>
              </Section>
            )}

            {(resume.education?.length>0||resume.ed?.length>0)&&(
              <Section title="Education">
                {(resume.education||resume.ed).map((edu,i)=>edu.institution&&(
                  <div key={i} style={{marginBottom:"0.8rem"}}>
                    <Row left={<b style={{fontSize:"14.5px", color:"#111827"}}>{edu.institution}</b>} right={<span style={{fontSize:"12px",fontWeight:700, color:"#16a34a"}}>{edu.startYear?.split("-")[0]} — {edu.endYear?.split("-")[0]||"Present"}</span>}/>
                    <Row left={<i style={{fontSize:"13px",color:"#4b5563"}}>{edu.degreeType}{edu.state?` | ${edu.state}`:""}</i>} right={edu.cgpa&&<span style={{fontSize:"12px",fontWeight:600}}>{edu.cgpa} CGPA</span>}/>
                  </div>
                ))}
              </Section>
            )}

            {(resume.experience?.length>0||resume.ex?.length>0)&&(
              <Section title="Experience">
                {(resume.experience||resume.ex).map((exp,i)=>(exp.company||exp.role)&&(
                  <div key={i} style={{marginBottom:"1.2rem"}}>
                    <Row left={<b style={{fontSize:"14px",textTransform:"uppercase", color:"#111827"}}>{exp.role}</b>} right={<span style={{fontSize:"12px",fontWeight:700, color:"#16a34a"}}>{exp.startDate} — {exp.endDate||"Present"}</span>}/>
                    <Row left={<i style={{fontSize:"13px",color:"#14532d",fontWeight:600}}>{exp.company}{exp.location?` | ${exp.location}`:""}</i>} right={exp.projectUrl&&<a href={url(exp.projectUrl)} style={{color:"#16a34a",fontSize:"11px",display:"flex",alignItems:"center",gap:"3px"}}><ExternalLink size={10}/> Link</a>}/>
                    {exp.desc&&<p style={{fontSize:"13px",lineHeight:1.6,color:"#4b5563",marginTop:"0.4rem",whiteSpace:"pre-line"}}>{exp.desc}</p>}
                  </div>
                ))}
              </Section>
            )}

            {(resume.skillsCategorized||resume.skills)&&(
              <Section title="Technical Skills">
                <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
                  {Object.entries(resume.skillsCategorized||resume.skills).map(([k,v])=>v&&(
                    <div key={k} style={{fontSize:"13px"}}>
                      <strong style={{textTransform:"capitalize",color:"#14532d", width:'140px', display:'inline-block'}}>{k}:</strong>
                      <span style={{color:"#374151"}}>{v}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {(resume.projects?.length>0||resume.pr?.length>0)&&(
              <Section title="Projects">
                {(resume.projects||resume.pr).map((p,i)=>p.name&&(
                  <div key={i} style={{marginBottom:"0.8rem"}}>
                    <Row left={<b style={{fontSize:"14px", color:"#111827"}}>{p.name}</b>} right={p.link&&<a href={url(p.link)} style={{color:"#16a34a",fontSize:"11px"}}><ExternalLink size={10}/></a>}/>
                    {p.description&&<p style={{fontSize:"13px",color:"#4b5563",lineHeight:1.5}}>{p.description}</p>}
                  </div>
                ))}
              </Section>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

const Section = ({title,children})=>(
  <div style={{marginBottom:"1.5rem"}}>
    <h2 style={{fontSize:"14px",fontWeight:800,textTransform:"uppercase",borderBottom:"1.5px solid #bbf7d0",color:"#14532d",paddingBottom:"4px",marginBottom:"0.8rem",letterSpacing:"0.05em"}}>{title}</h2>
    {children}
  </div>
);

const Row = ({left,right})=>(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:"0.5rem"}}>
    <span>{left}</span>{right&&<span style={{flexShrink:0}}>{right}</span>}
  </div>
);

export default ResumeView;