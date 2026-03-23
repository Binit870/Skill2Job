import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud, FileText, PlusCircle, Edit, Trash2, Eye } from "lucide-react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --c:#faf9f6;--c2:#f2f0eb;--c3:#e8e4dc;
    --s:#1e293b;--s2:#334155;--s3:#64748b;
    --a:#d97706;--a2:#f59e0b;--ab:#fffbeb;
    --g:#059669;--gb:#ecfdf5;
    --r:#dc2626;--rb:#fef2f2;
    --b:#2563eb;--bb:#eff6ff;
    --sh:0 4px 16px rgba(30,41,59,.09),0 2px 6px rgba(30,41,59,.06);
    --sl:0 12px 40px rgba(30,41,59,.12),0 4px 12px rgba(30,41,59,.07);
    --rad:18px;
  }
  .mr-page{min-height:100vh;background-color:#ffffff;font-family:'DM Sans',sans-serif;background-image:linear-gradient(rgba(217,119,6,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(217,119,6,.04) 1px,transparent 1px);background-size:40px 40px;display:flex;align-items:center;justify-content:center;padding:2.5rem 1.5rem;position:relative;overflow:hidden}
  .mr-page::before{content:'';position:fixed;top:-120px;left:-120px;width:480px;height:480px;background:radial-gradient(circle,rgba(217,119,6,.06) 0%,transparent 65%);border-radius:50%;pointer-events:none}
  .mr-page::after{content:'';position:fixed;bottom:-100px;right:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(200,200,200,.3) 0%,transparent 70%);border-radius:50%;pointer-events:none}
  .mr-card{background:#fff;border:1px solid var(--c3);border-radius:24px;box-shadow:var(--sl);width:100%;max-width:640px;overflow:hidden;animation:rise .55s cubic-bezier(.22,1,.36,1) both}
  @keyframes rise{from{opacity:0;transform:translateY(28px) scale(.98)}to{opacity:1;transform:none}}
  .mr-hd{background:var(--s);padding:2.25rem 2.5rem 2rem;position:relative;overflow:hidden}
  .mr-hd::before{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;background:radial-gradient(circle,rgba(217,119,6,.22) 0%,transparent 65%);border-radius:50%;pointer-events:none}
  .mr-hd::after{content:'';position:absolute;bottom:-40px;left:40px;width:160px;height:160px;background:radial-gradient(circle,rgba(217,119,6,.1) 0%,transparent 65%);border-radius:50%;pointer-events:none}
  .mr-eye{font-size:.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--a2);margin-bottom:.55rem;position:relative;z-index:1}
  .mr-ttl{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:#fff;line-height:1.15;position:relative;z-index:1}
  .mr-ttl em{font-style:italic;color:var(--a2)}
  .mr-dsc{font-size:.84rem;color:rgba(255,255,255,.42);margin-top:.5rem;font-weight:300;position:relative;z-index:1}
  .mr-bd{padding:2rem 2.5rem 2.5rem}
  .mr-lbl{font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--s3);margin-bottom:.75rem;display:flex;align-items:center;gap:8px;animation:fd .4s ease both .1s}
  .mr-lbl::after{content:'';flex:1;height:1px;background:var(--c3)}
  .mr-row{background:var(--c);border:1px solid var(--c3);border-radius:var(--rad);padding:1rem 1.25rem;display:flex;align-items:center;gap:1rem;margin-bottom:1.75rem;transition:box-shadow .2s;animation:fd .4s ease both .15s}
  .mr-row:hover{box-shadow:var(--sh)}
  .mr-fi{width:46px;height:46px;flex-shrink:0;border-radius:12px;background:var(--ab);border:1px solid rgba(217,119,6,.18);display:flex;align-items:center;justify-content:center}
  .mr-fn{font-size:.9rem;font-weight:600;color:var(--s);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .mr-fs{font-size:.73rem;color:var(--g);font-weight:500;display:flex;align-items:center;gap:4px;margin-top:2px}
  .mr-fs::before{content:'';width:6px;height:6px;background:var(--g);border-radius:50%}
  .mr-ag{display:flex;gap:6px;flex-shrink:0}
  .mr-ab{display:inline-flex;align-items:center;gap:5px;padding:6px 13px;border-radius:8px;border:1px solid transparent;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:500;cursor:pointer;transition:all .18s ease;white-space:nowrap}
  .mr-ab.v{background:var(--gb);border-color:rgba(5,150,105,.2);color:var(--g)}
  .mr-ab.e{background:var(--bb);border-color:rgba(37,99,235,.18);color:var(--b)}
  .mr-ab.d{background:var(--rb);border-color:rgba(220,38,38,.15);color:var(--r)}
  .mr-ab.v:hover{background:#d1fae5;border-color:rgba(5,150,105,.4);transform:translateY(-1px);box-shadow:0 3px 8px rgba(5,150,105,.15)}
  .mr-ab.e:hover{background:#dbeafe;border-color:rgba(37,99,235,.35);transform:translateY(-1px);box-shadow:0 3px 8px rgba(37,99,235,.15)}
  .mr-ab.d:hover{background:#fee2e2;border-color:rgba(220,38,38,.3);transform:translateY(-1px);box-shadow:0 3px 8px rgba(220,38,38,.12)}
  .mr-em{text-align:center;padding:1.5rem 1rem;margin-bottom:1.75rem;background:var(--c);border:1.5px dashed var(--c3);border-radius:var(--rad);animation:fd .4s ease both .15s}
  .mr-em p{font-size:.85rem;color:var(--s3);margin-bottom:1rem}
  .mr-cb{display:inline-flex;align-items:center;gap:7px;padding:.6rem 1.4rem;border-radius:10px;background:var(--s);color:#fff;font-family:'DM Sans',sans-serif;font-size:.84rem;font-weight:500;border:none;cursor:pointer;transition:all .2s}
  .mr-cb:hover{background:var(--s2);transform:translateY(-1px);box-shadow:var(--sh)}
  .mr-uz{border:2px dashed var(--c3);border-radius:var(--rad);padding:2.25rem 1.5rem;text-align:center;cursor:pointer;transition:all .22s;background:var(--c);margin-bottom:1.25rem;animation:fd .4s ease both .2s}
  .mr-uz:hover,.mr-uz.da{border-color:var(--a);background:var(--ab)}
  .mr-uz.da{box-shadow:0 0 0 4px rgba(217,119,6,.08)}
  .mr-uz.fr{border-color:var(--g);background:var(--gb)}
  .mr-ui{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;transition:transform .2s}
  .mr-uz:hover .mr-ui,.mr-uz.da .mr-ui{transform:translateY(-4px) scale(1.06)}
  .mr-ui.i{background:#fff;border:1px solid var(--c3)}
  .mr-ui.r{background:var(--gb);border:1px solid rgba(5,150,105,.2)}
  .mr-uh{font-size:.92rem;font-weight:600;color:var(--s);margin-bottom:3px}
  .mr-us{font-size:.78rem;color:var(--s3)}
  .mr-fp{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid rgba(5,150,105,.25);color:var(--g);padding:4px 12px;border-radius:999px;font-size:.8rem;font-weight:500;margin-bottom:4px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .mr-btn{width:100%;padding:.9rem;background:var(--s);color:#fff;border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-size:.94rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .22s;position:relative;overflow:hidden;animation:fd .4s ease both .28s}
  .mr-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--a),#b45309);opacity:0;transition:opacity .22s}
  .mr-btn:hover::after{opacity:1}
  .mr-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(30,41,59,.22)}
  .mr-btn:active{transform:none}
  .mr-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
  .mr-btn>*{position:relative;z-index:1}
  .mr-pt{height:3px;background:var(--c2);border-radius:999px;margin-top:1rem;overflow:hidden}
  .mr-pf{height:100%;width:100%;border-radius:999px;background:linear-gradient(90deg,var(--s),var(--a),var(--s));background-size:200%;animation:sh 1.6s linear infinite}
  @keyframes sh{from{background-position:200%}to{background-position:-200%}}
  .mr-lt{text-align:center;font-size:.76rem;color:var(--s3);margin-top:.6rem}
  .mr-sp{width:17px;height:17px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:rot .7s linear infinite;flex-shrink:0}
  @keyframes rot{to{transform:rotate(360deg)}}
  @keyframes fd{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
`;

const API  = "http://localhost:5000/api/resume";
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const MyResume = () => {
  const [file, setFile]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [drag, setDrag]     = useState(false);
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
        <div className="mr-card">

          <div className="mr-hd">
            <p className="mr-eye">Career Tools</p>
            <h1 className="mr-ttl">Resume <em>Center</em></h1>
            <p className="mr-dsc">Manage, analyze, and build your professional resume</p>
          </div>

          <div className="mr-bd">
            <p className="mr-lbl">Your Resume</p>

            {resume ? (
              <div className="mr-row">
                <div className="mr-fi"><FileText size={20} color="#d97706" /></div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p className="mr-fn">{name}</p>
                  <span className="mr-fs">Active &amp; Ready</span>
                </div>
                <div className="mr-ag">
                  <button className="mr-ab v" onClick={() => navigate("/student/resume-view", { state: { resume } })}><Eye size={13} /> View</button>
                  <button className="mr-ab e" onClick={() => navigate("/student/resume-builder")}><Edit size={13} /> Edit</button>
                  <button className="mr-ab d" onClick={handleDelete}><Trash2 size={13} /> Delete</button>
                </div>
              </div>
            ) : (
              <div className="mr-em">
                <p>You don't have a resume yet. Create one from scratch.</p>
                <button className="mr-cb" onClick={() => navigate("/student/resume-builder")}>
                  <PlusCircle size={15} /> Create Resume
                </button>
              </div>
            )}

            <p className="mr-lbl">Analyze a Resume</p>

            <label>
              <input type="file" accept=".pdf" hidden onChange={e => setFile(e.target.files[0])} />
              <div
                className={`mr-uz${drag ? " da" : ""}${file ? " fr" : ""}`}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}
              >
                <div className={`mr-ui ${file ? "r" : "i"}`}>
                  <UploadCloud size={24} color={file ? "#059669" : "#64748b"} strokeWidth={1.8} />
                </div>
                {file ? (
                  <><div className="mr-fp"><FileText size={12} />{file.name}</div><p className="mr-us">Click to change file</p></>
                ) : (
                  <><p className="mr-uh">Drop your resume here</p><p className="mr-us">or click to browse — PDF only</p></>
                )}
              </div>
            </label>

            <button className="mr-btn" onClick={handleUpload} disabled={loading}>
              {loading
                ? <><span className="mr-sp" /><span>Analyzing Resume…</span></>
                : <><UploadCloud size={17} strokeWidth={2} /><span>Upload &amp; Analyze</span></>}
            </button>

            {loading && (
              <><div className="mr-pt"><div className="mr-pf" /></div>
              <p className="mr-lt">Processing with AI — this may take a moment</p></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyResume;