import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud, FileText, PlusCircle, Edit, Trash2, Eye } from "lucide-react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
  
  :root {
    --bg-page: #f0fdf4;    /* Lightest Deem Green for Background */
    --bg-card: #ffffff;    /* Pure White for Cards */
    --primary: #15803d;    /* Deep Green for Main Actions */
    --primary-light: #dcfce7;
    --text-main: #14532d;
    --text-muted: #64748b;
    --accent: #22c55e;
    --border: #e2e8f0;
    --sh: 0 10px 25px -5px rgba(21, 128, 61, 0.05), 0 8px 10px -6px rgba(21, 128, 61, 0.05);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  .mr-page { 
    min-height: 100vh; 
    background-color: var(--bg-page); 
    font-family: 'DM Sans', sans-serif; 
    padding: 3rem 1.5rem; 
  }

  /* Header - Keeping it dark for that premium contrast */
  .mr-hd {
    background: var(--text-main);
    padding: 3.5rem 2.5rem;
    position: relative;
    overflow: hidden;
    border-radius: 32px;
    margin: 0 auto 3rem;
    max-width: 850px;
    box-shadow: 0 20px 40px rgba(20, 83, 45, 0.15);
  }

  .mr-hd::before { 
    content:''; position:absolute; top:-50px; right:-50px; width:250px; height:250px; 
    background: radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%); 
    border-radius: 50%; 
  }

  .mr-eye { font-size:.75rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:var(--accent); margin-bottom:.5rem; position:relative; z-index:1; }
  .mr-ttl { font-family:'Playfair Display',serif; font-size:2.4rem; font-weight:700; color:#fff; position:relative; z-index:1; }
  .mr-ttl em { font-style:italic; color:var(--accent); }
  .mr-dsc { font-size:.9rem; color:rgba(255,255,255,0.7); margin-top:.5rem; position:relative; z-index:1; }

  /* Section Containers */
  .mr-sections-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
    width: 100%;
  }

  /* Main Card - White Theme */
  .mr-section {
    width: 100%;
    max-width: 850px;
    background: var(--bg-card); /* WHITE CARD */
    padding: 2.8rem;
    border-radius: 40px;      /* ROUNDED CORNERS */
    border: 1px solid rgba(21, 128, 61, 0.08);
    box-shadow: var(--sh);
  }

  /* Label Styling */
  .mr-lbl {
    font-size: .8rem;
    font-weight: 800;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--text-main);
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .mr-lbl::after { content:''; flex:1; height:1px; background: #e2e8f0; }

  /* Resume Row - White on subtle green border */
  .mr-row { 
    background: #f8fafc; 
    border: 1px solid #f1f5f9; 
    border-radius: 24px; 
    padding: 1.5rem; 
    display: flex; 
    align-items: center; 
    gap: 1.2rem; 
    transition: all .3s ease; 
  }
  .mr-row:hover { background: #fff; border-color: var(--accent); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.03); }
  
  .mr-fi { width:52px; height:52px; border-radius:14px; background:var(--primary-light); display:flex; align-items:center; justify-content:center; color: var(--primary); }
  .mr-fn { font-size:1.05rem; font-weight:700; color:var(--text-main); }
  .mr-fs { font-size:.8rem; color:var(--primary); font-weight:600; display:flex; align-items:center; gap:6px; margin-top:4px; }
  .mr-fs::before { content:''; width:6px; height:6px; background:var(--accent); border-radius:50%; }

  /* Action Buttons */
  .mr-ag { display:flex; gap:10px; }
  .mr-ab { 
    display:inline-flex; align-items:center; gap:8px; padding:10px 18px; 
    border-radius:12px; font-size:.85rem; font-weight:600; cursor:pointer; 
    border:1px solid #e2e8f0; background: #fff; color: var(--text-main); 
    transition: all .2s; 
  }
  .mr-ab:hover { border-color: var(--accent); background: var(--primary-light); color: var(--primary); }
  .mr-ab.d:hover { border-color: #fca5a5; background: #fef2f2; color: #dc2626; }

  /* Upload Zone - Dashed Green */
  .mr-uz { 
    border: 2px dashed #cbd5e1; 
    border-radius: 28px; 
    padding: 3.5rem 2rem; 
    text-align: center; 
    cursor: pointer; 
    background: #fdfdfd; 
    transition: all .3s; 
    margin-bottom: 2rem; 
    display: block; 
  }
  .mr-uz:hover { border-color: var(--primary); background: var(--primary-light); }
  .mr-uz.fr { border-color: var(--primary); background: #f0fdf4; border-style: solid; }
  
  .mr-ui { 
    width:64px; height:64px; border-radius:20px; background:white; 
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem; 
  }
  
  .mr-uh { font-size:1.1rem; font-weight:700; color:var(--text-main); }
  .mr-us { font-size:.85rem; color:var(--text-muted); margin-top:6px; }
  .mr-fp { 
    display:inline-flex; align-items:center; gap:8px; background:var(--primary); 
    color:#fff; padding:8px 20px; border-radius:40px; font-size:.9rem; font-weight:600; 
    margin-bottom:12px; 
  }

  /* Main Action Button */
  .mr-btn { 
    width:100%; padding:1.2rem; background: var(--primary); color:#fff; 
    border:none; border-radius:20px; font-size:1rem; font-weight:700; 
    cursor:pointer; display:flex; align-items:center; justify-content:center; 
    gap:12px; transition: all .3s; 
  }
  .mr-btn:hover { background: #166534; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(21, 128, 61, 0.2); }
  .mr-btn:disabled { background: #94a3b8; cursor: not-allowed; transform: none; }

  .mr-sp { width:20px; height:20px; border:3px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation: rot .7s linear infinite; }
  @keyframes rot { to { transform: rotate(360deg); } }
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
      toast.success("Resume analyzed successfully 🚀");
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
        <div className="mr-hd">
          <p className="mr-eye">Career Tools</p>
          <h1 className="mr-ttl">Resume <em>Center</em></h1>
          <p className="mr-dsc">Manage and analyze your resume with AI power</p>
        </div>

        <div className="mr-bd">
          <div className="mr-sections-container">
            {/* Section 1: Your Resume */}
            <div className="mr-section">
              <p className="mr-lbl">Current Resume</p>
              {resume ? (
                <div className="mr-row">
                  <div className="mr-fi"><FileText size={24} /></div>
                  <div style={{ flex: 1 }}>
                    <p className="mr-fn">{name}</p>
                    <span className="mr-fs">Live on profile</span>
                  </div>
                  <div className="mr-ag">
                    <button className="mr-ab" onClick={() => navigate("/student/resume-view", { state: { resume } })}><Eye size={16} /> View</button>
                    <button className="mr-ab" onClick={() => navigate("/student/resume-builder")}><Edit size={16} /> Edit</button>
                    <button className="mr-ab d" onClick={handleDelete}><Trash2 size={16} /></button>
                  </div>
                </div>
              ) : (
                <div style={{textAlign:'center', padding:'1rem'}}>
                  <p style={{color:'var(--text-muted)', marginBottom:'1.5rem'}}>No resume found on your profile.</p>
                  <button className="mr-btn" style={{maxWidth:'240px', margin:'0 auto'}} onClick={() => navigate("/student/resume-builder")}>
                    <PlusCircle size={18} /> Create New Resume
                  </button>
                </div>
              )}
            </div>

            {/* Section 2: Analyze */}
            <div className="mr-section">
              <p className="mr-lbl">AI Resume Analyzer</p>
              <label>
                <input type="file" accept=".pdf" hidden onChange={e => setFile(e.target.files[0])} />
                <div className={`mr-uz ${drag ? "da" : ""} ${file ? "fr" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={handleDrop}>
                  <div className="mr-ui">
                    <UploadCloud size={32} color={file ? "var(--primary)" : "var(--text-muted)"} />
                  </div>
                  {file ? (
                    <><div className="mr-fp"><FileText size={16} /> {file.name}</div><p className="mr-us">Click to replace file</p></>
                  ) : (
                    <><p className="mr-uh">Drag your PDF here</p><p className="mr-us">Supports files up to 5MB</p></>
                  )}
                </div>
              </label>

              <button className="mr-btn" onClick={handleUpload} disabled={loading || !file}>
                {loading ? <span className="mr-sp" /> : <><UploadCloud size={20} /> Upload & Get Feedback</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyResume;