import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  RiUploadCloud2Line,
  RiFileTextLine,
  RiAddCircleLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiEyeLine,
  RiCheckboxCircleFill,
  RiFilePdf2Line,
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
    --danger:    #dc2626;
    --danger-lt: #fef2f2;
    --r-xl: 26px; --r-lg: 18px; --r-md: 12px; --r-sm: 8px;
    --sd: 0 1px 3px rgba(10,31,18,.07),0 1px 2px rgba(10,31,18,.04);
    --sm: 0 4px 18px rgba(10,31,18,.08),0 2px 6px rgba(10,31,18,.04);
    --sl: 0 12px 42px rgba(10,31,18,.11),0 4px 14px rgba(10,31,18,.06);
  }

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  .mr-page{
    min-height:100vh; background:var(--bg);
    font-family:'Sora',sans-serif; padding:2.5rem 1.5rem 5rem;
  }

  /* Hero */
  .mr-hero{
    max-width:820px; margin:0 auto 2rem;
    background:var(--primary); border-radius:var(--r-xl);
    padding:2.8rem 3rem; position:relative; overflow:hidden;
    box-shadow:var(--sl); animation:fade-up .45s cubic-bezier(.22,1,.36,1) both;
  }
  .mr-hero::before{
    content:''; position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(ellipse 65% 90% at 95% -5%,rgba(39,168,95,.28) 0%,transparent 55%),
      radial-gradient(ellipse 40% 50% at -5% 105%,rgba(39,168,95,.12) 0%,transparent 50%);
  }
  .mr-hero-inner{position:relative;z-index:1}
  .mr-hero-chip{
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(39,168,95,.15); border:1px solid rgba(39,168,95,.3); color:var(--accent);
    font-size:.64rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
    padding:4px 12px; border-radius:40px; margin-bottom:.9rem;
  }
  .mr-hero-title{
    font-family:'Libre Baskerville',serif;
    font-size:clamp(1.8rem,5vw,2.7rem); font-weight:700; color:#fff; line-height:1.08; margin-bottom:.4rem;
  }
  .mr-hero-title em{color:var(--accent);font-style:italic}
  .mr-hero-sub{font-size:.85rem;color:rgba(255,255,255,.5);font-weight:400}

  /* Content */
  .mr-content{max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:1.4rem}

  /* Card */
  .mr-card{
    background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xl);
    padding:2rem 2.2rem; box-shadow:var(--sd);
    animation:fade-up .5s cubic-bezier(.22,1,.36,1) both;
  }
  .mr-card:nth-child(2){animation-delay:.07s}

  /* Section label */
  .mr-sec-lbl{
    display:flex; align-items:center; gap:10px;
    font-size:.64rem; font-weight:700; letter-spacing:.13em; text-transform:uppercase; color:var(--text-3);
    margin-bottom:1.4rem;
  }
  .mr-sec-lbl::after{content:'';flex:1;height:1px;background:var(--border)}

  /* Resume row */
  .mr-row{
    display:flex; align-items:center; gap:1rem;
    padding:1.1rem 1.2rem; background:var(--bg);
    border:1px solid var(--border); border-radius:var(--r-lg);
    transition:box-shadow .2s,border-color .22s,transform .22s; flex-wrap:wrap;
  }
  .mr-row:hover{box-shadow:var(--sm);border-color:var(--accent-md);transform:translateY(-2px)}
  .mr-row-icon{
    width:46px;height:46px;flex-shrink:0;background:var(--accent-lt);
    border-radius:var(--r-md);display:flex;align-items:center;justify-content:center;
    color:var(--accent);font-size:1.25rem;
  }
  .mr-row-body{flex:1;min-width:0}
  .mr-row-name{font-size:.95rem;font-weight:600;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mr-row-status{display:inline-flex;align-items:center;gap:4px;margin-top:3px;font-size:.71rem;font-weight:600;color:var(--accent)}
  .mr-row-actions{display:flex;gap:7px;flex-wrap:wrap}

  /* Action buttons */
  .mr-btn-act{
    display:inline-flex;align-items:center;gap:5px;padding:7px 13px;
    border:1px solid var(--border);border-radius:var(--r-sm);background:var(--surface);
    color:var(--text-2);font-family:'Sora',sans-serif;font-size:.75rem;font-weight:600;
    cursor:pointer;white-space:nowrap;
    transition:background .17s,border-color .17s,color .17s,transform .17s;
  }
  .mr-btn-act:hover{background:var(--accent-lt);border-color:var(--accent);color:var(--primary);transform:translateY(-1px)}
  .mr-btn-act.danger:hover{background:var(--danger-lt);border-color:#fca5a5;color:var(--danger)}
  .mr-btn-act.icon-only{padding:7px 9px}

  /* Empty */
  .mr-empty{text-align:center;padding:.6rem 0 .2rem}
  .mr-empty-text{font-size:.88rem;color:var(--text-3);margin-bottom:1.3rem}

  /* Create btn */
  .mr-btn-create{
    display:inline-flex;align-items:center;gap:7px;padding:.72rem 1.5rem;
    background:var(--primary);color:#fff;border:none;border-radius:var(--r-md);
    font-family:'Sora',sans-serif;font-size:.85rem;font-weight:700;
    cursor:pointer;transition:background .2s,box-shadow .2s;
  }
  .mr-btn-create:hover{background:var(--primary-h);box-shadow:var(--sm)}

  /* Drop zone */
  .mr-dropzone{
    display:block;border:2px dashed var(--border);border-radius:var(--r-lg);
    padding:3rem 1.5rem;text-align:center;cursor:pointer;background:var(--bg);
    transition:border-color .22s,background .22s;margin-bottom:1.1rem;
  }
  .mr-dropzone:hover,.mr-dropzone.drag{border-color:var(--accent);background:var(--accent-lt)}
  .mr-dropzone.has-file{border-color:var(--accent);border-style:solid;background:var(--accent-lt)}
  .mr-dz-icon{
    width:56px;height:56px;background:var(--surface);border-radius:var(--r-md);box-shadow:var(--sd);
    display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--text-3);
    margin:0 auto 1rem;transition:color .2s;
  }
  .mr-dropzone.has-file .mr-dz-icon{color:var(--accent)}
  .mr-dz-title{font-size:.96rem;font-weight:600;color:var(--text-1);margin-bottom:3px}
  .mr-dz-sub{font-size:.78rem;color:var(--text-3)}
  .mr-dz-badge{
    display:inline-flex;align-items:center;gap:6px;background:var(--primary);color:#fff;
    padding:5px 14px;border-radius:40px;font-size:.79rem;font-weight:600;margin-bottom:5px;
  }

  /* Primary CTA */
  .mr-btn-primary{
    width:100%;padding:.95rem;background:var(--primary);color:#fff;border:none;
    border-radius:var(--r-md);font-family:'Sora',sans-serif;font-size:.9rem;font-weight:700;
    cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;
    transition:background .2s,transform .2s,box-shadow .2s;
  }
  .mr-btn-primary:hover:not(:disabled){background:var(--primary-h);transform:translateY(-2px);box-shadow:0 10px 30px rgba(13,61,34,.18)}
  .mr-btn-primary:disabled{background:#9aad9e;cursor:not-allowed}

  /* Spinner */
  .mr-spin{
    width:17px;height:17px;border:2.5px solid rgba(255,255,255,.3);
    border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;
  }
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fade-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

  /* Responsive */
  @media(max-width:768px){
    .mr-hero{padding:2rem 1.6rem;border-radius:20px}
    .mr-card{padding:1.5rem 1.3rem;border-radius:20px}
    .mr-row-actions{width:100%;justify-content:flex-end;margin-top:.3rem}
  }
  @media(max-width:480px){
    .mr-page{padding:1rem .85rem 4rem}
    .mr-hero{padding:1.5rem 1.1rem;border-radius:16px;margin-bottom:1.2rem}
    .mr-hero-title{font-size:1.75rem}
    .mr-card{padding:1.1rem .95rem;border-radius:16px}
    .mr-row{flex-direction:column;align-items:flex-start;gap:.65rem}
    .mr-row-icon{width:40px;height:40px;font-size:1.1rem}
    .mr-row-actions{width:100%}
    .mr-btn-act{flex:1;justify-content:center}
    .mr-dropzone{padding:2rem 1rem}
    .mr-btn-primary{font-size:.85rem;padding:.88rem}
  }
`;

const API = "http://localhost:5000/api/resume";
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const MyResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [drag, setDrag] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API, { headers: auth() }).then(r => setResume(r.data)).catch(() => {});
  }, []);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");
    const fd = new FormData();
    fd.append("resume", file);
    try {
      setLoading(true);
      const r = await axios.post(`${API}/analyze`, fd, {
        headers: { "Content-Type": "multipart/form-data", ...auth() },
      });
      toast.success("Resume analyzed successfully");
      navigate("/student/analyze", { state: r.data });
    } catch { toast.error("Upload failed"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(API, { headers: auth() });
      setResume(null);
      toast.success("Resume deleted");
    } catch { toast.error("Failed to delete"); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    f?.type === "application/pdf" ? setFile(f) : toast.error("PDF files only");
  };

  const name = resume?.fileName || resume?.fullName || "Uploaded Resume";

  return (
    <>
      <style>{S}</style>
      <div className="mr-page">
        <div className="mr-hero">
          <div className="mr-hero-inner">
            <div className="mr-hero-chip"><RiFilePdf2Line /> Career Tools</div>
            <h1 className="mr-hero-title">Resume <em>Center</em></h1>
            <p className="mr-hero-sub">Manage and analyze your resume with AI-powered insights</p>
          </div>
        </div>

        <div className="mr-content">
          <div className="mr-card">
            <p className="mr-sec-lbl">Current Resume</p>
            {resume ? (
              <div className="mr-row">
                <div className="mr-row-icon"><RiFileTextLine /></div>
                <div className="mr-row-body">
                  <p className="mr-row-name">{name}</p>
                  <span className="mr-row-status"><RiCheckboxCircleFill /> Live on profile</span>
                </div>
                <div className="mr-row-actions">
                  <button className="mr-btn-act" onClick={() => navigate("/student/resume-view", { state: { resume } })}>
                    <RiEyeLine /> View
                  </button>
                  <button className="mr-btn-act" onClick={() => navigate("/student/resume-builder")}>
                    <RiEditLine /> Edit
                  </button>
                  <button className="mr-btn-act danger icon-only" onClick={handleDelete}>
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mr-empty">
                <p className="mr-empty-text">No resume found on your profile.</p>
                <button className="mr-btn-create" onClick={() => navigate("/student/resume-builder")}>
                  <RiAddCircleLine /> Create New Resume
                </button>
              </div>
            )}
          </div>

          <div className="mr-card">
            <p className="mr-sec-lbl">AI Resume Analyzer</p>
            <label>
              <input type="file" accept=".pdf" hidden onChange={e => setFile(e.target.files[0])} />
              <div
                className={`mr-dropzone${drag ? " drag" : ""}${file ? " has-file" : ""}`}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}
              >
                <div className="mr-dz-icon"><RiUploadCloud2Line /></div>
                {file ? (
                  <>
                    <div className="mr-dz-badge"><RiFileTextLine /> {file.name}</div>
                    <p className="mr-dz-sub">Click to replace file</p>
                  </>
                ) : (
                  <>
                    <p className="mr-dz-title">Drag your PDF here</p>
                    <p className="mr-dz-sub">or click to browse &mdash; supports files up to 5 MB</p>
                  </>
                )}
              </div>
            </label>
            <button className="mr-btn-primary" onClick={handleUpload} disabled={loading || !file}>
              {loading
                ? <span className="mr-spin" />
                : <><RiUploadCloud2Line style={{ fontSize: "1.1rem" }} /> Upload &amp; Get Feedback</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyResume;