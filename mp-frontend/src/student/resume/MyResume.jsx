import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  RiUploadCloud2Line,
  RiFileTextLine,
  RiAddCircleLine,
  RiFilePdf2Line,
  RiSparklingLine,
  RiShieldCheckLine,
  RiArrowRightLine,
} from "react-icons/ri";
import API from "../../utils/api";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --bg:         #f7f6f2;
    --surface:    #ffffff;
    --border:     #e4e1d8;
    --border-h:   #c8c3b4;
    --primary:    #1a1a18;
    --primary-h:  #2e2e2b;
    --accent:     #4a7c59;
    --accent-h:   #3d6849;
    --accent-lt:  #eef5f0;
    --accent-md:  #c4dece;
    --gold:       #c8a84b;
    --gold-lt:    #faf5e6;
    --text-1:     #1a1a18;
    --text-2:     #4a4a44;
    --text-3:     #9a9890;
    --danger:     #c0392b;
    --danger-lt:  #fdf2f1;
    --r-xl: 24px; --r-lg: 16px; --r-md: 10px; --r-sm: 6px;
    --sd: 0 1px 4px rgba(26,26,24,.06),0 1px 2px rgba(26,26,24,.04);
    --sm: 0 6px 24px rgba(26,26,24,.09),0 2px 8px rgba(26,26,24,.05);
    --sl: 0 16px 56px rgba(26,26,24,.12),0 4px 16px rgba(26,26,24,.07);
  }

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  .mr-page{
    min-height:100vh;
    background:var(--bg);
    background-image:
      radial-gradient(ellipse 70% 50% at 110% -10%, rgba(74,124,89,.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at -10% 110%, rgba(200,168,75,.06) 0%, transparent 55%);
    font-family:'DM Sans',sans-serif;
    padding:3rem 1.5rem 6rem;
  }

  /* ── Header ── */
  .mr-header{
    max-width:780px; margin:0 auto 2.8rem;
    display:flex; flex-direction:column; gap:.5rem;
    animation:fade-up .5s cubic-bezier(.22,1,.36,1) both;
  }
  .mr-header-eyebrow{
    display:inline-flex; align-items:center; gap:7px;
    font-size:.66rem; font-weight:600; letter-spacing:.16em; text-transform:uppercase;
    color:var(--accent); margin-bottom:.2rem;
  }
  .mr-header-eyebrow svg{font-size:.8rem}
  .mr-header-title{
    font-family:'Instrument Serif',serif;
    font-size:clamp(2rem,5vw,3rem); color:var(--primary); line-height:1.06; font-weight:400;
  }
  .mr-header-title em{font-style:italic; color:var(--accent)}
  .mr-header-sub{
    font-size:.88rem; color:var(--text-3); font-weight:400; max-width:440px; line-height:1.65;
  }

  /* ── Divider ── */
  .mr-divider{
    max-width:780px; margin:0 auto;
    display:grid; grid-template-columns:1fr 1fr; gap:1.4rem;
  }

  /* ── Card ── */
  .mr-card{
    background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xl);
    padding:2.2rem; box-shadow:var(--sd);
    transition:box-shadow .25s, border-color .25s, transform .25s;
    animation:fade-up .5s cubic-bezier(.22,1,.36,1) both;
    display:flex; flex-direction:column;
  }
  .mr-card:nth-child(2){animation-delay:.08s}
  .mr-card:hover{box-shadow:var(--sm); border-color:var(--border-h); transform:translateY(-2px)}

  /* Card header */
  .mr-card-head{display:flex; align-items:flex-start; gap:1rem; margin-bottom:1.6rem}
  .mr-card-icon{
    width:48px; height:48px; flex-shrink:0; border-radius:var(--r-md);
    display:flex; align-items:center; justify-content:center; font-size:1.3rem;
  }
  .mr-card-icon.green{background:var(--accent-lt); color:var(--accent)}
  .mr-card-icon.gold{background:var(--gold-lt); color:var(--gold)}
  .mr-card-head-text{}
  .mr-card-title{font-size:1.06rem; font-weight:700; color:var(--text-1); margin-bottom:.18rem}
  .mr-card-desc{font-size:.8rem; color:var(--text-3); line-height:1.55}

  /* Feature list */
  .mr-features{display:flex; flex-direction:column; gap:.55rem; margin-bottom:1.8rem; flex:1}
  .mr-feature{
    display:flex; align-items:center; gap:.6rem;
    font-size:.8rem; color:var(--text-2);
  }
  .mr-feature-dot{
    width:6px; height:6px; flex-shrink:0; border-radius:50%; background:var(--accent-md);
  }
  .mr-feature-dot.gold{background:var(--gold)}

  /* CTA buttons */
  .mr-btn-cta{
    width:100%; padding:.88rem 1.2rem;
    display:flex; align-items:center; justify-content:center; gap:8px;
    border:none; border-radius:var(--r-md);
    font-family:'DM Sans',sans-serif; font-size:.88rem; font-weight:700;
    cursor:pointer; transition:background .2s, box-shadow .2s, transform .2s;
  }
  .mr-btn-cta.primary{
    background:var(--primary); color:#fff;
  }
  .mr-btn-cta.primary:hover{background:var(--primary-h); box-shadow:0 8px 28px rgba(26,26,24,.18); transform:translateY(-1px)}

  .mr-btn-cta.accent{
    background:var(--accent); color:#fff;
  }
  .mr-btn-cta.accent:hover:not(:disabled){background:var(--accent-h); box-shadow:0 8px 28px rgba(74,124,89,.2); transform:translateY(-1px)}
  .mr-btn-cta.accent:disabled{background:#a8c4b0; cursor:not-allowed; transform:none; box-shadow:none}

  /* ── Upload card (analyzer) ── */
  .mr-upload-card{
    background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xl);
    padding:2.2rem; box-shadow:var(--sd);
    animation:fade-up .5s cubic-bezier(.22,1,.36,1) .16s both;
    max-width:780px; margin:1.4rem auto 0;
    transition:box-shadow .25s, border-color .25s;
  }
  .mr-upload-card:hover{box-shadow:var(--sm); border-color:var(--border-h)}

  .mr-upload-head{
    display:flex; align-items:center; gap:1rem; margin-bottom:1.8rem;
    padding-bottom:1.4rem; border-bottom:1px solid var(--border);
  }
  .mr-upload-badge{
    display:inline-flex; align-items:center; gap:6px;
    background:var(--gold-lt); color:var(--gold);
    font-size:.66rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
    padding:4px 11px; border-radius:40px; border:1px solid rgba(200,168,75,.25);
    margin-left:auto;
  }

  /* Dropzone */
  .mr-dropzone{
    display:block; border:1.5px dashed var(--border-h);
    border-radius:var(--r-lg); padding:2.8rem 1.5rem; text-align:center;
    cursor:pointer; background:var(--bg);
    transition:border-color .22s, background .22s;
    margin-bottom:1.2rem;
  }
  .mr-dropzone:hover,.mr-dropzone.drag{border-color:var(--accent); background:var(--accent-lt)}
  .mr-dropzone.has-file{border-color:var(--accent); border-style:solid; background:var(--accent-lt)}

  .mr-dz-icon{
    width:52px; height:52px; background:var(--surface);
    border-radius:var(--r-md); box-shadow:var(--sd);
    display:flex; align-items:center; justify-content:center;
    font-size:1.4rem; color:var(--text-3);
    margin:0 auto .9rem; transition:color .2s, box-shadow .2s;
  }
  .mr-dropzone.has-file .mr-dz-icon{color:var(--accent); box-shadow:var(--sm)}

  .mr-dz-title{font-size:.95rem; font-weight:600; color:var(--text-1); margin-bottom:.28rem}
  .mr-dz-sub{font-size:.77rem; color:var(--text-3)}
  .mr-dz-chip{
    display:inline-flex; align-items:center; gap:6px;
    background:var(--primary); color:#fff;
    padding:5px 14px; border-radius:40px;
    font-size:.78rem; font-weight:600; margin-bottom:.35rem;
    max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }

  /* Spinner */
  .mr-spin{
    width:16px; height:16px;
    border:2.5px solid rgba(255,255,255,.3);
    border-top-color:#fff; border-radius:50%;
    animation:spin .65s linear infinite; flex-shrink:0;
  }

  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fade-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}

  /* ── Responsive ── */
  @media(max-width:680px){
    .mr-divider{grid-template-columns:1fr}
    .mr-card:nth-child(2){animation-delay:.12s}
    .mr-upload-card{border-radius:20px}
  }
  @media(max-width:480px){
    .mr-page{padding:1.2rem .9rem 4rem}
    .mr-header{margin-bottom:1.8rem}
    .mr-card{padding:1.5rem 1.3rem; border-radius:18px}
    .mr-upload-card{padding:1.5rem 1.3rem; margin-top:1rem}
    .mr-dropzone{padding:2rem 1rem}
    .mr-upload-head{flex-wrap:wrap; gap:.6rem}
    .mr-upload-badge{margin-left:0}
  }
`;

const MyResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a PDF file first");
    const fd = new FormData();
    fd.append("resume", file);
    try {
      setLoading(true);
      const r = await API.post("/api/resume/analyze", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume analyzed successfully!");
      navigate("/student/analyze", { state: r.data });
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
    else toast.error("Only PDF files are supported");
  };

  return (
    <>
      <style>{S}</style>
      <div className="mr-page">

        {/* Header */}
        <div className="mr-header">
          <span className="mr-header-eyebrow"><RiShieldCheckLine /> Career Tools</span>
          <h1 className="mr-header-title">Resume <em>Center</em></h1>
          <p className="mr-header-sub">
            Build a professional resume from scratch or upload yours for instant ML-powered feedback.
          </p>
        </div>

        {/* Two cards side-by-side */}
        <div className="mr-divider">

          {/* Build Card */}
          <div className="mr-card">
            <div className="mr-card-head">
              <div className="mr-card-icon green"><RiAddCircleLine /></div>
              <div className="mr-card-head-text">
                <p className="mr-card-title">Resume Builder</p>
                <p className="mr-card-desc">Create a polished resume using our guided editor</p>
              </div>
            </div>
            <ul className="mr-features">
              {["Professional templates ready to use", "Guided section-by-section editor", "Export as PDF in one click", "ATS-friendly formatting"].map((f, i) => (
                <li key={i} className="mr-feature">
                  <span className="mr-feature-dot" />
                  {f}
                </li>
              ))}
            </ul>
            <button className="mr-btn-cta primary" onClick={() => navigate("/student/resume-builder")}>
              <RiAddCircleLine /> Build My Resume <RiArrowRightLine style={{ marginLeft: "auto" }} />
            </button>
          </div>

          {/* Analyze Card */}
          <div className="mr-card">
            <div className="mr-card-head">
              <div className="mr-card-icon gold"><RiSparklingLine /></div>
              <div className="mr-card-head-text">
                <p className="mr-card-title">Resume Analyzer</p>
                <p className="mr-card-desc">Get instant feedback on your existing resume</p>
              </div>
            </div>
            <ul className="mr-features">
              {["ATS compatibility score", "Skill gap analysis", "Actionable improvement tips", "Keyword optimization"].map((f, i) => (
                <li key={i} className="mr-feature">
                  <span className="mr-feature-dot gold" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="mr-btn-cta accent"
              onClick={() => document.getElementById("mr-drop-input")?.click()}
            >
              <RiUploadCloud2Line /> Upload & Analyze
            </button>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="mr-upload-card">
          <div className="mr-upload-head">
            <div className="mr-card-icon gold" style={{ flexShrink: 0 }}><RiFilePdf2Line /></div>
            <div>
              <p className="mr-card-title">Upload Your Resume</p>
              <p className="mr-card-desc">PDF format · Max 5 MB</p>
            </div>
            <span className="mr-upload-badge"><RiSparklingLine /> AI Powered</span>
          </div>

          <label>
            <input
              id="mr-drop-input"
              type="file"
              accept=".pdf"
              hidden
              onChange={e => setFile(e.target.files[0])}
            />
            <div
              className={`mr-dropzone${drag ? " drag" : ""}${file ? " has-file" : ""}`}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={handleDrop}
            >
              <div className="mr-dz-icon"><RiUploadCloud2Line /></div>
              {file ? (
                <>
                  <div className="mr-dz-chip"><RiFileTextLine /> {file.name}</div>
                  <p className="mr-dz-sub">Click to replace · drag a new file anytime</p>
                </>
              ) : (
                <>
                  <p className="mr-dz-title">Drag your PDF here</p>
                  <p className="mr-dz-sub">or click to browse your files</p>
                </>
              )}
            </div>
          </label>

          <button
            className="mr-btn-cta accent"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading
              ? <><span className="mr-spin" /> Analyzing your resume…</>
              : <><RiSparklingLine /> Get ML Feedback <RiArrowRightLine style={{ marginLeft: "auto" }} /></>
            }
          </button>
        </div>

      </div>
    </>
  );
};

export default MyResume;