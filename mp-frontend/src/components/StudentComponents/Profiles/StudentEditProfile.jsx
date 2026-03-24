import { useEffect, useState, useCallback, useContext, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  Phone, GraduationCap, BookOpen, Calendar, Star, Code,
  Save, User, Mail, FileText, Upload, Eye, X, Camera,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw,
  Download, Share2, Maximize2, Minimize2, Printer,
  Search, BookmarkPlus, ExternalLink, Copy, Check
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const InputField = ({ icon: Icon, label, name, placeholder, type = "text", value, onChange }) => (
  <div className="group">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
        <Icon size={16} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white
          transition-all duration-200"
      />
    </div>
  </div>
);

// ── Tooltip wrapper ──────────────────────────────────────────────────────────
const Tip = ({ label, children }) => (
  <div className="relative group/tip">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[11px] rounded-md
      opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-white/10">
      {label}
    </div>
  </div>
);

// ── Icon button ──────────────────────────────────────────────────────────────
const IconBtn = ({ onClick, disabled, children, className = "", variant = "ghost" }) => {
  const base = "flex items-center justify-center rounded-lg transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed";
  const variants = {
    ghost: "w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 active:bg-white/20",
    accent: "w-8 h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 active:bg-emerald-400/20",
    danger: "w-8 h-8 text-red-400 hover:text-red-300 hover:bg-red-400/10",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// ── Share modal ──────────────────────────────────────────────────────────────
const ShareModal = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  const shareOptions = [
    { label: "Copy link", icon: copied ? Check : Copy, action: copyLink, color: "emerald" },
    { label: "Open in tab", icon: ExternalLink, action: () => window.open(url, "_blank"), color: "blue" },
    { label: "Print", icon: Printer, action: () => window.open(url, "_blank")?.print(), color: "amber" },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-80 shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-sm">Share Resume</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* URL bar */}
        <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 rounded-xl px-3 py-2.5 mb-4">
          <span className="text-white/40 text-xs truncate flex-1 font-mono">{url?.slice(0, 45)}...</span>
          <button onClick={copyLink}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold shrink-0 transition-colors">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {shareOptions.map(({ label, icon: Icon, action, color }) => (
            <button key={label} onClick={action}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-white/10
                hover:border-${color}-400/40 hover:bg-${color}-400/10 transition-all group`}>
              <Icon size={18} className={`text-${color}-400 group-hover:scale-110 transition-transform`} />
              <span className="text-white/60 text-[11px] font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Native share if available */}
        {typeof navigator.share === "function" && (
          <button onClick={() => navigator.share({ title: "My Resume", url })}
            className="w-full mt-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors">
            Share via device
          </button>
        )}
      </div>
    </div>
  );
};

// ── Go-to-page input ─────────────────────────────────────────────────────────
const PageJumper = ({ current, total, onJump }) => {
  const [val, setVal] = useState("");
  const [open, setOpen] = useState(false);

  const submit = () => {
    const n = parseInt(val);
    if (n >= 1 && n <= total) { onJump(n); setOpen(false); setVal(""); }
  };

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="text-xs text-white/50 hover:text-white/80 transition-colors px-2 py-1 rounded-lg hover:bg-white/10">
      {current} / {total}
    </button>
  );

  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus
        type="number"
        value={val}
        min={1}
        max={total}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") setOpen(false); }}
        onBlur={() => { if (!val) setOpen(false); }}
        className="w-14 text-center bg-white/10 border border-white/20 rounded-lg text-white text-xs py-1 outline-none focus:border-emerald-400"
        placeholder={String(current)}
      />
      <span className="text-white/30 text-xs">/ {total}</span>
      <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/60 ml-1">
        <X size={12} />
      </button>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const StudentEditProfile = () => {
  const { refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", college: "", branch: "",
    graduationYear: "", cgpa: "", skills: "", profileImage: "", resume: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  // ── PDF viewer state ────────────────────────────────────────────────────────
  const [showPdf, setShowPdf] = useState(false);
  const [pdfSource, setPdfSource] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const viewerRef = useRef(null);

  useEffect(() => { fetchProfile(); }, []);

  // Keyboard shortcuts inside PDF viewer
  useEffect(() => {
    if (!showPdf) return;
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setPageNumber(p => Math.min(numPages || 1, p + 1));
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   setPageNumber(p => Math.max(1, p - 1));
      if (e.key === "+" || e.key === "=") setPdfZoom(z => Math.min(3, +(z + 0.25).toFixed(2)));
      if (e.key === "-")                  setPdfZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)));
      if (e.key === "Escape")             closePdf();
      if (e.key === "r" || e.key === "R") setRotation(r => (r + 90) % 360);
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showPdf, numPages]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const user = res.data;
      setForm({
        name: user.name || "", email: user.email || "", phone: user.phone || "",
        college: user.college || "", branch: user.branch || "",
        graduationYear: user.graduationYear || "", cgpa: user.cgpa || "",
        skills: user.skills?.join(", ") || "",
        profileImage: user.profileImage || "", resume: user.resume || "",
      });
    } catch { toast.error("Failed to load profile"); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { setImageSrc(reader.result); setCropModalOpen(true); };
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const createCroppedImage = async () => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise(resolve => (image.onload = resolve));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width; canvas.height = height;
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    return new Promise(resolve => { canvas.toBlob(blob => resolve(blob), "image/jpeg"); });
  };

  const handleSaveCrop = async () => {
    setCroppedImage(await createCroppedImage());
    setCropModalOpen(false);
  };

  const handleRemoveImage = () => {
    setCroppedImage(null);
    setImageSrc(null);
    setForm({ ...form, profileImage: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      ["name","email","phone","college","branch","graduationYear","cgpa"].forEach(k => formData.append(k, form[k]));
      form.skills.split(",").map(s => s.trim()).filter(Boolean).forEach(s => formData.append("skills[]", s));
      if (croppedImage) formData.append("profileImage", croppedImage, "profile.jpg");
      if (resumeFile)   formData.append("resume", resumeFile);
      await axios.put("http://localhost:5000/api/profile/student", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" },
      });
      await refreshUser();
      console.log("User after refresh:", JSON.parse(localStorage.getItem("user")));
      toast.success("Profile updated successfully");
      navigate("/student-dashboard");
    } catch { toast.error("Update failed. Try again."); }
    finally  { setLoading(false); }
  };

  // ── PDF controls ────────────────────────────────────────────────────────────
  const openPdf = () => {
    setPageNumber(1); setNumPages(null);
    setPdfError(false); setPdfZoom(1.0);
    setRotation(0); setPdfSource(form.resume);
    setShowPdf(true);
  };

  const closePdf = () => {
    setShowPdf(false); setPdfSource(null);
    if (document.fullscreenElement) document.exitFullscreen();
    setFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const zoomIn  = () => setPdfZoom(z => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setPdfZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)));
  const resetZoom = () => setPdfZoom(1.0);
  const rotate  = () => setRotation(r => (r + 90) % 360);

  const downloadPdf = () => {
    const a = document.createElement("a");
    a.href = form.resume;
    a.download = "resume.pdf";
    a.target = "_blank";
    a.click();
  };

  const printPdf = () => {
    const w = window.open(form.resume, "_blank");
    w?.addEventListener("load", () => w.print());
  };

  const profileImageSrc = croppedImage ? URL.createObjectURL(croppedImage) : form.profileImage || null;

  // ── Zoom label ──────────────────────────────────────────────────────────────
  const zoomLabel = Math.round(pdfZoom * 100) + "%";

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start py-12 px-4">

      <div className="fixed inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #d1fae5 0%, transparent 50%), radial-gradient(circle at 80% 20%, #e0e7ff 0%, transparent 40%)" }}
      />

      <div className="relative bg-white shadow-xl rounded-3xl w-full max-w-2xl overflow-hidden border border-slate-100">

        {/* Banner */}
        <div className="h-36 relative flex items-center px-8 gap-5"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #134e4a 100%)" }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="absolute right-8 top-0 w-40 h-40 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #34d399, transparent 70%)" }} />

          <div className="relative z-10 flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl border-2 border-emerald-400/40 shadow-xl overflow-hidden bg-white/10">
              {profileImageSrc
                ? <img src={profileImageSrc} alt="Profile" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><User size={28} className="text-white/50" /></div>}
            </div>
            <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center justify-center cursor-pointer shadow-md transition-colors z-20">
              <Camera size={12} className="text-slate-900" />
              <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            </label>
          </div>

          <div className="relative z-10 min-w-0">
            <h2 className="text-xl font-bold text-white leading-tight truncate">{form.name || "Your Name"}</h2>
            <p className="text-sm text-emerald-300/80 mt-0.5 truncate">{form.college || "College Name"}</p>
          </div>
        </div>

        <div className="px-8 pb-8 pt-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Personal Info</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField icon={User}         label="Full Name"            name="name"           placeholder="John Doe"          value={form.name}           onChange={handleChange} />
              <InputField icon={Mail}         label="Email"                name="email"          placeholder="john@email.com"    value={form.email}          onChange={handleChange} type="email" />
              <InputField icon={Phone}        label="Phone"                name="phone"          placeholder="+91 9876543210"    value={form.phone}          onChange={handleChange} />
              <InputField icon={GraduationCap} label="College"             name="college"        placeholder="IIT Bombay"        value={form.college}        onChange={handleChange} />
              <InputField icon={BookOpen}     label="Branch"               name="branch"         placeholder="Computer Science"  value={form.branch}         onChange={handleChange} />
              <InputField icon={Calendar}     label="Graduation Year"      name="graduationYear" placeholder="2025"              value={form.graduationYear} onChange={handleChange} type="number" />
              <InputField icon={Star}         label="CGPA"                 name="cgpa"           placeholder="8.5"               value={form.cgpa}           onChange={handleChange} />
              <InputField icon={Code}         label="Skills (comma sep.)"  name="skills"         placeholder="React, Node.js"    value={form.skills}         onChange={handleChange} />
            </div>

            {/* Resume */}
            <div className="flex items-center gap-2 pt-1">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Resume</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {resumeFile ? resumeFile.name : form.resume ? "Resume uploaded" : "No resume yet"}
                  </p>
                  {form.resume && !resumeFile && (
                    <button type="button" onClick={openPdf}
                      className="text-xs text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1 mt-0.5 transition-colors">
                      <Eye size={11} /> View Resume
                    </button>
                  )}
                  {resumeFile && <p className="text-xs text-emerald-600 font-medium mt-0.5">✓ Ready to upload</p>}
                </div>
              </div>

              <label className="cursor-pointer flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow">
                <Upload size={13} />
                {form.resume ? "Replace" : "Upload PDF"}
                <input type="file" accept=".pdf" onChange={e => { const f = e.target.files[0]; if (f) setResumeFile(f); }} className="hidden" />
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white py-3 rounded-2xl font-semibold text-sm shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: "linear-gradient(135deg, #0f172a, #134e4a)" }}>
              <Save size={16} />
              {loading ? "Saving changes..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          PDF VIEWER MODAL
      ════════════════════════════════════════════════════════════════════════ */}
      {showPdf && (
        <div ref={viewerRef} className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0c111d" }}>

          {/* ── Top toolbar ── */}
          <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0 border-b border-white/8"
            style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)" }}>

            {/* Left — file info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-red-500/15 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-400/20">
                <FileText size={14} className="text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate leading-tight">Resume.pdf</p>
                <p className="text-white/30 text-[10px] leading-tight">
                  {numPages ? `${numPages} page${numPages > 1 ? "s" : ""}` : "Loading…"}
                </p>
              </div>
            </div>

            {/* Center — page nav */}
            {numPages && (
              <div className="flex items-center gap-1">
                <Tip label="Previous (←)">
                  <IconBtn onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}>
                    <ChevronLeft size={15} />
                  </IconBtn>
                </Tip>
                <PageJumper current={pageNumber} total={numPages} onJump={setPageNumber} />
                <Tip label="Next (→)">
                  <IconBtn onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages}>
                    <ChevronRight size={15} />
                  </IconBtn>
                </Tip>
              </div>
            )}

            {/* Right — actions */}
            <div className="flex items-center gap-0.5">
              <Tip label="Zoom out (-)">
                <IconBtn onClick={zoomOut} disabled={pdfZoom <= 0.5}><ZoomOut size={14} /></IconBtn>
              </Tip>
              <button onClick={resetZoom}
                className="text-[11px] text-white/50 hover:text-white/90 w-12 text-center py-1 rounded-md hover:bg-white/10 transition-colors font-mono">
                {zoomLabel}
              </button>
              <Tip label="Zoom in (+)">
                <IconBtn onClick={zoomIn} disabled={pdfZoom >= 3}><ZoomIn size={14} /></IconBtn>
              </Tip>

              <div className="w-px h-5 bg-white/10 mx-1.5" />

              <Tip label="Rotate (R)">
                <IconBtn onClick={rotate}><RotateCw size={14} /></IconBtn>
              </Tip>

              <Tip label={bookmarked ? "Bookmarked" : "Bookmark"}>
                <IconBtn onClick={() => { setBookmarked(b => !b); toast.success(bookmarked ? "Bookmark removed" : "Page bookmarked!"); }}
                  variant={bookmarked ? "accent" : "ghost"}>
                  <BookmarkPlus size={14} />
                </IconBtn>
              </Tip>

              <Tip label="Search text (Ctrl+F)">
                <IconBtn onClick={() => setShowSearch(s => !s)} variant={showSearch ? "accent" : "ghost"}>
                  <Search size={14} />
                </IconBtn>
              </Tip>

              <div className="w-px h-5 bg-white/10 mx-1.5" />

              <Tip label="Print">
                <IconBtn onClick={printPdf}><Printer size={14} /></IconBtn>
              </Tip>

              <Tip label="Download">
                <IconBtn onClick={downloadPdf} variant="accent"><Download size={14} /></IconBtn>
              </Tip>

              <Tip label="Share">
                <IconBtn onClick={() => setShowShare(true)}><Share2 size={14} /></IconBtn>
              </Tip>

              <Tip label="Open in new tab">
                <IconBtn onClick={() => window.open(form.resume, "_blank")}><ExternalLink size={14} /></IconBtn>
              </Tip>

              <div className="w-px h-5 bg-white/10 mx-1.5" />

              <Tip label={fullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}>
                <IconBtn onClick={toggleFullscreen}>
                  {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </IconBtn>
              </Tip>

              <Tip label="Close (Esc)">
                <IconBtn onClick={closePdf} variant="danger" className="ml-1"><X size={14} /></IconBtn>
              </Tip>
            </div>
          </div>

          {/* ── Search bar (slides in) ── */}
          {showSearch && (
            <div className="flex items-center gap-3 px-4 py-2 border-b border-white/8 flex-shrink-0"
              style={{ background: "rgba(15,23,42,0.9)" }}>
              <Search size={13} className="text-white/30 flex-shrink-0" />
              <input autoFocus type="text" placeholder="Search in document… (text layer must be enabled)"
                className="flex-1 bg-transparent text-white/80 text-xs outline-none placeholder-white/20" />
              <span className="text-white/20 text-[10px]">Use browser Ctrl+F for full search</span>
              <button onClick={() => setShowSearch(false)} className="text-white/30 hover:text-white/60 transition-colors">
                <X size={13} />
              </button>
            </div>
          )}

          {/* ── PDF canvas area ── */}
          <div className="flex-1 overflow-auto flex flex-col items-center justify-start py-6 px-4"
            style={{ background: "#161b2e" }}>
            {pdfError ? (
              <div className="flex flex-col items-center justify-center h-full gap-5">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-400/20 flex items-center justify-center">
                  <FileText size={28} className="text-red-400/60" />
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-sm font-medium mb-1">Could not render PDF</p>
                  <p className="text-white/25 text-xs">The file may be inaccessible or corrupted</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={downloadPdf}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors">
                    <Download size={13} /> Download
                  </button>
                  <button onClick={() => window.open(form.resume, "_blank")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors">
                    <ExternalLink size={13} /> Open in Tab
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ transform: `scale(${pdfZoom}) rotate(${rotation}deg)`, transformOrigin: "top center", transition: "transform 0.2s ease" }}>
                <Document
                  file={pdfSource}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  onLoadError={err => { console.error(err); setPdfError(true); }}
                  loading={
                    <div className="flex flex-col items-center gap-3 mt-24">
                      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-white/30 text-xs">Loading PDF…</p>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={Math.min(window.innerWidth - 48, 860)}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="shadow-2xl rounded-xl overflow-hidden"
                  />
                </Document>
              </div>
            )}
          </div>

          {/* ── Bottom bar ── */}
          {numPages && (
            <div className="flex items-center justify-between px-6 py-2.5 flex-shrink-0 border-t border-white/8"
              style={{ background: "rgba(15,23,42,0.95)" }}>

              {/* Page strip */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-xs">
                {Array.from({ length: Math.min(numPages, 8) }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPageNumber(n)}
                    className={`w-7 h-7 rounded-md text-[11px] font-semibold transition-all flex-shrink-0
                      ${n === pageNumber
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "text-white/30 hover:text-white/70 hover:bg-white/10"}`}>
                    {n}
                  </button>
                ))}
                {numPages > 8 && <span className="text-white/20 text-xs px-1">+{numPages - 8} more</span>}
              </div>

              {/* Zoom slider */}
              <div className="flex items-center gap-2">
                <ZoomOut size={12} className="text-white/30" />
                <input type="range" min={50} max={300} step={25}
                  value={Math.round(pdfZoom * 100)}
                  onChange={e => setPdfZoom(+(e.target.value / 100).toFixed(2))}
                  className="w-24 accent-emerald-500 cursor-pointer" />
                <ZoomIn size={12} className="text-white/30" />
                <span className="text-white/30 text-[11px] font-mono w-9">{zoomLabel}</span>
              </div>

              {/* Shortcuts hint */}
              <p className="text-white/15 text-[10px] hidden md:block">
                ← → navigate · +/- zoom · R rotate · F fullscreen · Esc close
              </p>
            </div>
          )}
        </div>
      )}

      {/* Share modal */}
      {showShare && <ShareModal url={form.resume} onClose={() => setShowShare(false)} />}

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-3xl w-[420px] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-center text-slate-800">Crop Profile Photo</h3>
            <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden">
              <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} cropShape="round"
                onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setCropModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleSaveCrop}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors">
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEditProfile;