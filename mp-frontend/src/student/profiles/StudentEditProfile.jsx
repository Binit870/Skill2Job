import { useEffect, useState, useCallback, useContext, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiBuildingLine,
  RiBookOpenLine,
  RiCalendarLine,
  RiStarLine,
  RiCodeLine,
  RiFileTextLine,
  RiSaveLine,
  RiCameraLine,
  RiCloseLine,
  RiArrowLeftLine,
  RiEyeLine,
  RiUploadLine,
  RiDownloadLine,
  RiExternalLinkLine,
  RiPrinterLine,
  RiShareLine,
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiZoomInLine,
  RiZoomOutLine,
  RiRefreshLine,
  RiBookmarkLine,
  RiSearchLine,
  RiCheckLine,
  RiFileCopyLine,
} from "react-icons/ri";
import API from "../../utils/api";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/* ── Font injection ── */
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap";
fontLink.rel = "stylesheet";
if (!document.head.querySelector(`link[href="${fontLink.href}"]`)) {
  document.head.appendChild(fontLink);
}

/* ─────────────────────────────────────────
   INPUTFIELD
───────────────────────────────────────── */
const InputField = ({ icon: Icon, label, name, placeholder, value, onChange, type = "text" }) => (
  <div>
    <label style={{
      display: "block", fontSize: 11, fontWeight: 600,
      color: "#6b7280", textTransform: "uppercase",
      letterSpacing: "0.08em", marginBottom: 6,
    }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute", left: 13, top: "50%",
        transform: "translateY(-50%)",
        color: "#9ca3af", pointerEvents: "none",
      }}>
        <Icon size={15} />
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%", paddingLeft: 38, paddingRight: 14,
          paddingTop: 11, paddingBottom: 11,
          background: "#f9fafb",
          border: "1.5px solid #e5e7eb",
          borderRadius: 10, fontSize: 13.5,
          color: "#111827", outline: "none",
          fontFamily: "'Sora', sans-serif",
          transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#059669";
          e.target.style.boxShadow = "0 0 0 3px rgba(5,150,105,0.09)";
          e.target.style.background = "#fff";
          e.target.previousSibling.style.color = "#059669";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e5e7eb";
          e.target.style.boxShadow = "none";
          e.target.style.background = "#f9fafb";
          e.target.previousSibling.style.color = "#9ca3af";
        }}
      />
    </div>
  </div>
);

/* ── Section Divider ── */
const SectionLabel = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
    <div style={{ flex: 1, height: 1, background: "#f0fdf4", borderTop: "1px solid #d1fae5" }} />
    <span style={{
      fontSize: 10.5, fontWeight: 700, color: "#6b7280",
      textTransform: "uppercase", letterSpacing: "0.1em",
    }}>
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: "#f0fdf4", borderTop: "1px solid #d1fae5" }} />
  </div>
);

/* ── PDF Icon Button ── */
const IconBtn = ({ onClick, disabled, children, accent = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: 32, height: 32,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: 8, border: "none",
      background: "transparent",
      color: accent ? "#34d399" : "rgba(255,255,255,0.6)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.3 : 1,
      transition: "all 0.15s",
      fontFamily: "'Sora', sans-serif",
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
        e.currentTarget.style.color = accent ? "#6ee7b7" : "#fff";
      }
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = accent ? "#34d399" : "rgba(255,255,255,0.6)";
    }}
  >
    {children}
  </button>
);

/* ── Share Modal ── */
const ShareModal = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { toast.error("Could not copy"); }
  };
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20, padding: 24, width: 320,
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0, fontFamily: "'Sora', sans-serif" }}>
            Share Resume
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
            <RiCloseLine size={16} />
          </button>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12, padding: "10px 14px", marginBottom: 16,
        }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "monospace" }}>
            {url?.slice(0, 40)}...
          </span>
          <button onClick={copyLink} style={{
            fontSize: 11, fontWeight: 600, color: "#34d399",
            background: "none", border: "none", cursor: "pointer", flexShrink: 0,
            fontFamily: "'Sora', sans-serif",
          }}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Copy link", icon: copied ? RiCheckLine : RiFileCopyLine, action: copyLink },
            { label: "Open tab", icon: RiExternalLinkLine, action: () => window.open(url, "_blank") },
            { label: "Print", icon: RiPrinterLine, action: () => window.open(url, "_blank")?.print() },
          ].map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              onClick={action}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                padding: 12, borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", cursor: "pointer",
                color: "#34d399", transition: "all 0.15s",
                fontFamily: "'Sora', sans-serif",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(52,211,153,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <Icon size={18} />
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10.5, fontWeight: 500 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const StudentEditProfile = () => {
  const { refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", college: "", branch: "",
    graduationYear: "", cgpa: "", skills: "", profileImage: "", resume: "",
  });

  const [loading, setLoading]                     = useState(false);
  const [imageSrc, setImageSrc]                   = useState(null);
  const [croppedImage, setCroppedImage]           = useState(null);
  const [cropModalOpen, setCropModalOpen]         = useState(false);
  const [crop, setCrop]                           = useState({ x: 0, y: 0 });
  const [zoom, setZoom]                           = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [resumeFile, setResumeFile]               = useState(null);

  /* PDF viewer state */
  const [showPdf, setShowPdf]         = useState(false);
  const [pdfSource, setPdfSource]     = useState(null);
  const [numPages, setNumPages]       = useState(null);
  const [pageNumber, setPageNumber]   = useState(1);
  const [pdfError, setPdfError]       = useState(false);
  const [pdfZoom, setPdfZoom]         = useState(1.0);
  const [rotation, setRotation]       = useState(0);
  const [fullscreen, setFullscreen]   = useState(false);
  const [showShare, setShowShare]     = useState(false);
  const [bookmarked, setBookmarked]   = useState(false);
  const [showSearch, setShowSearch]   = useState(false);
  const viewerRef = useRef(null);

  useEffect(() => { fetchProfile(); }, []);

  useEffect(() => {
    if (!showPdf) return;
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setPageNumber(p => Math.min(numPages || 1, p + 1));
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   setPageNumber(p => Math.max(1, p - 1));
      if (e.key === "+" || e.key === "=") setPdfZoom(z => Math.min(3, +(z + 0.25).toFixed(2)));
      if (e.key === "-") setPdfZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)));
      if (e.key === "Escape") closePdf();
      if (e.key === "r" || e.key === "R") setRotation(r => (r + 90) % 360);
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showPdf, numPages]);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/api/profile", {
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
      ["name", "email", "phone", "college", "branch", "graduationYear", "cgpa"].forEach(k =>
        formData.append(k, form[k])
      );
      form.skills.split(",").map(s => s.trim()).filter(Boolean).forEach(s =>
        formData.append("skills[]", s)
      );
      if (croppedImage) formData.append("profileImage", croppedImage, "profile.jpg");
      if (resumeFile)   formData.append("resume", resumeFile);
      await API.put("/api/profile/student", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await refreshUser();
      toast.success("Profile updated successfully");
      navigate("/student-dashboard");
    } catch { toast.error("Update failed. Try again."); }
    finally { setLoading(false); }
  };

  /* PDF controls */
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
  const rotate = () => setRotation(r => (r + 90) % 360);
  const downloadPdf = () => {
    const a = document.createElement("a");
    a.href = form.resume; a.download = "resume.pdf"; a.target = "_blank"; a.click();
  };
  const printPdf = () => {
    const w = window.open(form.resume, "_blank");
    w?.addEventListener("load", () => w.print());
  };

  const profileImageSrc = croppedImage ? URL.createObjectURL(croppedImage) : form.profileImage || null;
  const zoomLabel = Math.round(pdfZoom * 100) + "%";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(150deg, #f0fdf9 0%, #ffffff 45%, #ecfdf5 100%)",
        display: "flex", justifyContent: "center", alignItems: "flex-start",
        padding: "40px 16px",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-8%", right: "-4%",
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-6%", left: "-6%",
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(5,150,105,0.05) 0%, transparent 65%)",
        }} />
      </div>

      <div
        style={{
          position: "relative", width: "100%", maxWidth: 640,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)",
          border: "1px solid rgba(16,185,129,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Top accent stripe */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #059669, #34d399, #a7f3d0)" }} />

        {/* Hero Banner */}
        <div
          style={{
            height: 148,
            background: "linear-gradient(135deg, #064e3b 0%, #065f46 55%, #047857 100%)",
            position: "relative", overflow: "hidden",
            display: "flex", alignItems: "center", padding: "0 32px", gap: 20,
          }}
        >
          {/* Dot grid overlay */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.07,
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }} />
          {/* Glow orbs */}
          <div style={{
            position: "absolute", right: 40, top: -30,
            width: 160, height: 160, borderRadius: "50%", opacity: 0.15,
            background: "radial-gradient(circle, #6ee7b7, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", left: -20, bottom: -20,
            width: 120, height: 120, borderRadius: "50%", opacity: 0.1,
            background: "radial-gradient(circle, #34d399, transparent 70%)",
          }} />

          {/* Avatar area */}
          <div style={{ position: "relative", zIndex: 2, flexShrink: 0 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 18,
              border: "2px solid rgba(110,231,183,0.35)",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}>
              {profileImageSrc ? (
                <img src={profileImageSrc} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <RiUserLine size={30} color="rgba(255,255,255,0.4)" />
              )}
            </div>
            {/* Camera badge */}
            <label
              title="Change photo"
              style={{
                position: "absolute", bottom: -4, right: -4,
                width: 26, height: 26, borderRadius: 8,
                background: "#10b981",
                border: "2px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(5,150,105,0.4)",
                transition: "background 0.2s", zIndex: 3,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#059669"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#10b981"}
            >
              <RiCameraLine size={13} color="#fff" />
              <input type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
            </label>
          </div>

          {/* Student identity */}
          <div style={{ position: "relative", zIndex: 2, minWidth: 0, flex: 1 }}>
            <h2 style={{
              fontFamily: "'Lora', serif",
              fontSize: 20, fontWeight: 600,
              color: "#fff", margin: 0,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {form.name || "Your Name"}
            </h2>
            <p style={{ color: "#6ee7b7", fontSize: 13, margin: "4px 0 0", opacity: 0.85 }}>
              {form.college || "College"}
              {form.branch && ` · ${form.branch}`}
            </p>
            {profileImageSrc && (
              <button
                type="button"
                onClick={handleRemoveImage}
                style={{
                  marginTop: 8,
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11.5, color: "rgba(252,165,165,0.9)",
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Sora', sans-serif", padding: 0,
                }}
              >
                <RiCloseLine size={13} />
                Remove photo
              </button>
            )}
          </div>

          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate("/student-dashboard")}
            style={{
              position: "absolute", top: 14, right: 14, zIndex: 2,
              width: 32, height: 32, borderRadius: 9,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", backdropFilter: "blur(4px)",
            }}
            title="Back to dashboard"
          >
            <RiArrowLeftLine size={16} color="#fff" />
          </button>
        </div>

        {/* Form body */}
        <div style={{ padding: "28px 32px 32px" }}>

          <SectionLabel label="Personal Info" />

          <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <InputField icon={RiUserLine}     label="Full Name"        name="name"           placeholder="Arjun Sharma"       value={form.name}           onChange={handleChange} />
              <InputField icon={RiMailLine}     label="Email"            name="email"          placeholder="arjun@email.com"    value={form.email}          onChange={handleChange} type="email" />
              <InputField icon={RiPhoneLine}    label="Phone"            name="phone"          placeholder="+91 9876543210"     value={form.phone}          onChange={handleChange} />
              <InputField icon={RiBuildingLine} label="College"          name="college"        placeholder="IIT Bombay"         value={form.college}        onChange={handleChange} />
              <InputField icon={RiBookOpenLine} label="Branch"           name="branch"         placeholder="Computer Science"   value={form.branch}         onChange={handleChange} />
              <InputField icon={RiCalendarLine} label="Graduation Year"  name="graduationYear" placeholder="2026"               value={form.graduationYear} onChange={handleChange} type="number" />
              <InputField icon={RiStarLine}     label="CGPA"             name="cgpa"           placeholder="8.5"                value={form.cgpa}           onChange={handleChange} />
              <InputField icon={RiCodeLine}     label="Skills (comma)"   name="skills"         placeholder="React, Node.js…"   value={form.skills}         onChange={handleChange} />
            </div>

            <SectionLabel label="Resume" />

            {/* Resume section */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#f9fafb", border: "1.5px solid #e5e7eb",
              borderRadius: 12, padding: "14px 16px", marginTop: 14,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, background: "#fef2f2",
                  borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <RiFileTextLine size={18} color="#f87171" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: 0 }}>
                    {resumeFile ? resumeFile.name : form.resume ? "Resume uploaded" : "No resume yet"}
                  </p>
                  {form.resume && !resumeFile && (
                    <button
                      type="button"
                      onClick={openPdf}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        fontSize: 11.5, color: "#059669", fontWeight: 500,
                        background: "none", border: "none", cursor: "pointer",
                        marginTop: 2, padding: 0,
                        fontFamily: "'Sora', sans-serif",
                      }}
                    >
                      <RiEyeLine size={11} />
                      View Resume
                    </button>
                  )}
                  {resumeFile && (
                    <p style={{ fontSize: 11.5, color: "#059669", fontWeight: 500, margin: "2px 0 0" }}>
                      ✓ Ready to upload
                    </p>
                  )}
                </div>
              </div>

              <label style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 10,
                background: "#fff", border: "1.5px solid #e5e7eb",
                fontSize: 12, fontWeight: 600, color: "#374151",
                cursor: "pointer",
                fontFamily: "'Sora', sans-serif",
                transition: "all 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#9ca3af"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
              >
                <RiUploadLine size={13} />
                {form.resume ? "Replace" : "Upload PDF"}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={e => { const f = e.target.files[0]; if (f) setResumeFile(f); }}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", marginTop: 24,
                padding: "13px 0",
                borderRadius: 12,
                background: loading
                  ? "#d1d5db"
                  : "linear-gradient(135deg, #064e3b, #059669)",
                border: "none",
                color: "#fff", fontSize: 14, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "'Sora', sans-serif",
                boxShadow: loading ? "none" : "0 6px 18px rgba(5,150,105,0.3)",
                transition: "all 0.2s",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(5,150,105,0.4)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(5,150,105,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 14, height: 14, borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Saving changes…
                </>
              ) : (
                <>
                  <RiSaveLine size={16} />
                  Save Profile
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ════════════════════════════════════════
          PDF VIEWER MODAL
      ════════════════════════════════════════ */}
      {showPdf && (
        <div
          ref={viewerRef}
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", flexDirection: "column",
            background: "#0c111d",
          }}
        >
          {/* Top toolbar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px", flexShrink: 0,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)",
          }}>
            {/* Left — file info */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <div style={{
                width: 32, height: 32, background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <RiFileTextLine size={14} color="#f87171" />
              </div>
              <div>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                  Resume.pdf
                </p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, margin: 0, lineHeight: 1.3 }}>
                  {numPages ? `${numPages} page${numPages > 1 ? "s" : ""}` : "Loading…"}
                </p>
              </div>
            </div>

            {/* Center — page nav */}
            {numPages && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <IconBtn onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}>
                  <RiArrowLeftSLine size={15} />
                </IconBtn>
                <span style={{
                  fontSize: 11, color: "rgba(255,255,255,0.5)",
                  padding: "4px 10px", cursor: "default",
                  fontFamily: "'Sora', sans-serif",
                }}>
                  {pageNumber} / {numPages}
                </span>
                <IconBtn onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages}>
                  <RiArrowRightSLine size={15} />
                </IconBtn>
              </div>
            )}

            {/* Right — actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconBtn onClick={zoomOut} disabled={pdfZoom <= 0.5}><RiZoomOutLine size={14} /></IconBtn>
              <button
                onClick={resetZoom}
                style={{
                  fontSize: 11, color: "rgba(255,255,255,0.5)",
                  background: "none", border: "none", cursor: "pointer",
                  width: 48, textAlign: "center", padding: "4px 0", borderRadius: 6,
                  fontFamily: "monospace", transition: "color 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.9)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
              >
                {zoomLabel}
              </button>
              <IconBtn onClick={zoomIn} disabled={pdfZoom >= 3}><RiZoomInLine size={14} /></IconBtn>

              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 6px" }} />

              <IconBtn onClick={rotate}><RiRefreshLine size={14} /></IconBtn>
              <IconBtn
                onClick={() => { setBookmarked(b => !b); toast.success(bookmarked ? "Bookmark removed" : "Page bookmarked!"); }}
                accent={bookmarked}
              >
                <RiBookmarkLine size={14} />
              </IconBtn>
              <IconBtn onClick={() => setShowSearch(s => !s)} accent={showSearch}>
                <RiSearchLine size={14} />
              </IconBtn>

              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 6px" }} />

              <IconBtn onClick={printPdf}><RiPrinterLine size={14} /></IconBtn>
              <IconBtn onClick={downloadPdf} accent><RiDownloadLine size={14} /></IconBtn>
              <IconBtn onClick={() => setShowShare(true)}><RiShareLine size={14} /></IconBtn>
              <IconBtn onClick={() => window.open(form.resume, "_blank")}><RiExternalLinkLine size={14} /></IconBtn>

              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)", margin: "0 6px" }} />

              <IconBtn onClick={toggleFullscreen}>
                {fullscreen ? <RiFullscreenExitLine size={14} /> : <RiFullscreenLine size={14} />}
              </IconBtn>
              <button
                onClick={closePdf}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: "none",
                  background: "transparent", color: "#f87171", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <RiCloseLine size={14} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          {showSearch && (
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "8px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(15,23,42,0.9)",
            }}>
              <RiSearchLine size={13} color="rgba(255,255,255,0.3)" />
              <input
                autoFocus
                type="text"
                placeholder="Search in document…"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "rgba(255,255,255,0.8)", fontSize: 12,
                  fontFamily: "'Sora', sans-serif",
                }}
              />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
                Use browser Ctrl+F for full search
              </span>
              <button
                onClick={() => setShowSearch(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}
              >
                <RiCloseLine size={13} />
              </button>
            </div>
          )}

          {/* PDF canvas */}
          <div style={{
            flex: 1, overflowY: "auto",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "flex-start",
            padding: "24px 16px",
            background: "#161b2e",
          }}>
            {pdfError ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "100%", gap: 20,
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <RiFileTextLine size={28} color="rgba(248,113,113,0.6)" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 500, margin: "0 0 4px" }}>
                    Could not render PDF
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, margin: 0 }}>
                    The file may be inaccessible or corrupted
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={downloadPdf} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 16px", borderRadius: 12,
                    background: "#059669", border: "none",
                    color: "#fff", fontSize: 12, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'Sora', sans-serif",
                  }}>
                    <RiDownloadLine size={13} /> Download
                  </button>
                  <button onClick={() => window.open(form.resume, "_blank")} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 16px", borderRadius: 12,
                    background: "rgba(255,255,255,0.1)", border: "none",
                    color: "#fff", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'Sora', sans-serif",
                  }}>
                    <RiExternalLinkLine size={13} /> Open in Tab
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                transform: `scale(${pdfZoom}) rotate(${rotation}deg)`,
                transformOrigin: "top center",
                transition: "transform 0.2s ease",
              }}>
                <Document
                  file={pdfSource}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  onLoadError={err => { console.error(err); setPdfError(true); }}
                  loading={
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 96 }}>
                      <div style={{
                        width: 40, height: 40,
                        border: "2px solid #059669", borderTopColor: "transparent",
                        borderRadius: "50%", animation: "spin 0.7s linear infinite",
                      }} />
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "'Sora', sans-serif" }}>
                        Loading PDF…
                      </p>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={Math.min(window.innerWidth - 48, 860)}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}
                  />
                </Document>
              </div>
            )}
          </div>

          {/* Bottom bar */}
          {numPages && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 24px", flexShrink: 0,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(15,23,42,0.95)",
            }}>
              {/* Page strip */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, overflowX: "auto", maxWidth: 240 }}>
                {Array.from({ length: Math.min(numPages, 8) }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => setPageNumber(n)}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      border: "none", cursor: "pointer",
                      fontSize: 11, fontWeight: 600,
                      background: n === pageNumber ? "#059669" : "transparent",
                      color: n === pageNumber ? "#fff" : "rgba(255,255,255,0.3)",
                      boxShadow: n === pageNumber ? "0 4px 12px rgba(5,150,105,0.3)" : "none",
                      transition: "all 0.15s", flexShrink: 0,
                      fontFamily: "'Sora', sans-serif",
                    }}
                    onMouseEnter={(e) => { if (n !== pageNumber) e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                    onMouseLeave={(e) => { if (n !== pageNumber) e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                  >
                    {n}
                  </button>
                ))}
                {numPages > 8 && (
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", padding: "0 4px" }}>
                    +{numPages - 8} more
                  </span>
                )}
              </div>

              {/* Zoom slider */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <RiZoomOutLine size={12} color="rgba(255,255,255,0.3)" />
                <input
                  type="range" min={50} max={300} step={25}
                  value={Math.round(pdfZoom * 100)}
                  onChange={e => setPdfZoom(+(e.target.value / 100).toFixed(2))}
                  style={{ width: 96, accentColor: "#059669", cursor: "pointer" }}
                />
                <RiZoomInLine size={12} color="rgba(255,255,255,0.3)" />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "monospace", width: 36 }}>
                  {zoomLabel}
                </span>
              </div>

              {/* Shortcuts hint */}
              <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 10, display: "none" }}>
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
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.78)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50,
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: 24,
            width: 420, maxWidth: "90vw",
            boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          }}>
            <h3 style={{
              fontFamily: "'Lora', serif",
              fontSize: 18, fontWeight: 600,
              textAlign: "center", marginBottom: 16, color: "#111827",
            }}>
              Crop Profile Photo
            </h3>
            <div style={{
              position: "relative", width: "100%", height: 256,
              background: "#0f172a", borderRadius: 14, overflow: "hidden",
            }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                style={{
                  flex: 1, padding: "11px 0", borderRadius: 10,
                  background: "#f3f4f6", border: "none",
                  fontSize: 13.5, fontWeight: 500, color: "#374151",
                  cursor: "pointer", fontFamily: "'Sora', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCrop}
                style={{
                  flex: 1, padding: "11px 0", borderRadius: 10,
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  border: "none", fontSize: 13.5, fontWeight: 600,
                  color: "#fff", cursor: "pointer",
                  fontFamily: "'Sora', sans-serif",
                  boxShadow: "0 4px 14px rgba(5,150,105,0.3)",
                }}
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default StudentEditProfile;