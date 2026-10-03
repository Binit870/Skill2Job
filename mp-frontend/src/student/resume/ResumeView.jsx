import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import html2pdf from "html2pdf.js";
import { RiArrowLeftLine, RiDownloadLine } from "react-icons/ri";
import ResumeSheet from "./ResumeSheet";

const S = `
  :root {
    --bg:        #F7F5EF;
    --primary:   #0D1512;
    --primary-h: #143D30;
    --accent:    #0E6B52;
    --border:    #E7E4DA;
  }

  *, *::before, *::after { box-sizing: border-box; }

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
  .rv-bar-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
  .rv-eyebrow {
    font-size: .6rem; font-weight: 700; letter-spacing: .14em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 1px;
  }
  .rv-title { font-size: clamp(1.1rem, 3vw, 1.55rem); font-weight: 800; color: #fff; line-height: 1.1; }
  .rv-title em { color: var(--accent); font-style: normal; }
  .rv-bar-actions { display: flex; align-items: center; gap: .45rem; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }

  .rv-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: .48rem .95rem; border-radius: 0;
    font-family: 'Sora', sans-serif; font-size: .78rem; font-weight: 600;
    cursor: pointer; transition: all .18s; white-space: nowrap; border: none;
  }
  .rv-btn-ghost { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); color: #fff; }
  .rv-btn-ghost:hover { background: rgba(255,255,255,.22); }
  .rv-btn-primary { background: var(--accent); color: #fff; box-shadow: 0 3px 10px rgba(39,168,95,.25); }
  .rv-btn-primary:hover { background: #2ec96b; }

  .rv-err {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center; padding: 2rem;
  }
  .rv-err-card {
    background: #fff; border: 1px solid var(--border); border-radius: 0;
    padding: 2.2rem; text-align: center; max-width: 320px; width: 100%;
  }
  .rv-err-title { font-size: 1rem; font-weight: 600; color: var(--primary); margin-bottom: 1rem; }
  .rv-err-btn {
    padding: .6rem 1.4rem; border-radius: 0; background: var(--primary); color: #fff;
    border: none; font-family: 'Sora', sans-serif; font-size: .86rem; font-weight: 600; cursor: pointer;
  }
  .rv-err-btn:hover { background: var(--primary-h); }

  @media print {
    .rv-page { background: white !important; padding: 0 !important; }
    .rv-bar  { display: none !important; }
    .rv-sheet { border: none !important; box-shadow: none !important; padding: .5in !important; }
  }

  @media (max-width: 540px) {
    .rv-page  { padding: .85rem .75rem 4rem; }
    .rv-bar   { margin-bottom: 1rem; }
    .rv-bar-inner { padding: .9rem 1rem; }
    .rv-btn   { font-size: .73rem; padding: .44rem .8rem; }
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

  return (
    <>
      <style>{S}</style>
      <div className="rv-page">
        <div className="rv-wrap">

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

          <ResumeSheet ref={resumeRef} resume={resume} />

        </div>
      </div>
    </>
  );
};

export default ResumeView;