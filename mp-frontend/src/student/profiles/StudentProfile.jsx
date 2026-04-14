import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import { AuthContext } from "../../context/AuthContext";
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
  RiImageAddLine,
  RiCloseLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckLine,
} from "react-icons/ri";

/* ── Google Font inject ── */
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap";
fontLink.rel = "stylesheet";
if (!document.head.querySelector(`link[href="${fontLink.href}"]`)) {
  document.head.appendChild(fontLink);
}

/* ─────────────────────────────────────────
   STEP META
───────────────────────────────────────── */
const STEPS = [
  { label: "Photo",           icon: RiImageAddLine,  field: null },
  { label: "Full Name",       icon: RiUserLine,      field: "name" },
  { label: "Email",           icon: RiMailLine,      field: "email" },
  { label: "Phone",           icon: RiPhoneLine,     field: "phone" },
  { label: "College",         icon: RiBuildingLine,  field: "college" },
  { label: "Branch",          icon: RiBookOpenLine,  field: "branch" },
  { label: "Grad. Year",      icon: RiCalendarLine,  field: "graduationYear" },
  { label: "CGPA",            icon: RiStarLine,      field: "cgpa" },
  { label: "Skills",          icon: RiCodeLine,      field: "skills" },
  { label: "Resume",          icon: RiFileTextLine,  field: null },
];

const PLACEHOLDERS = {
  name: "e.g. Arjun Sharma",
  email: "arjun@email.com",
  phone: "+91 9876543210",
  college: "e.g. IIT Bombay",
  branch: "e.g. Computer Science",
  graduationYear: "e.g. 2026",
  cgpa: "e.g. 8.5",
  skills: "React, Node.js, Python…",
};

/* ── Reusable step input ── */
const StepInput = ({ name, value, onChange, placeholder, icon: Icon, type = "text" }) => (
  <div style={{ position: "relative" }}>
    <div style={{
      position: "absolute", left: 14, top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af", pointerEvents: "none",
    }}>
      <Icon size={16} />
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%", paddingLeft: 40, paddingRight: 16,
        paddingTop: 14, paddingBottom: 14,
        background: "#f9fafb",
        border: "1.5px solid #e5e7eb",
        borderRadius: 12,
        fontSize: 15, color: "#111827",
        outline: "none",
        fontFamily: "'Sora', sans-serif",
        transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
        boxSizing: "border-box",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "#059669";
        e.target.style.boxShadow   = "0 0 0 3px rgba(5,150,105,0.08)";
        e.target.style.background  = "#fff";
        e.target.previousSibling.style.color = "#059669";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e5e7eb";
        e.target.style.boxShadow   = "none";
        e.target.style.background  = "#f9fafb";
        e.target.previousSibling.style.color = "#9ca3af";
      }}
    />
  </div>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const StudentProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const [step, setStep]   = useState(0);
  const [form, setForm]   = useState({
    name: "", email: "", phone: "", college: "", branch: "",
    graduationYear: "", cgpa: "", skills: "", profileImage: "", resume: "",
  });
  const [resumeFile, setResumeFile]               = useState(null);
  const [loading, setLoading]                     = useState(false);
  const [imageSrc, setImageSrc]                   = useState(null);
  const [croppedImage, setCroppedImage]           = useState(null);
  const [cropModalOpen, setCropModalOpen]         = useState(false);
  const [crop, setCrop]                           = useState({ x: 0, y: 0 });
  const [zoom, setZoom]                           = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => { fetchProfile(); }, []);

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
    } catch (error) { console.error(error); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const next = () => step < STEPS.length - 1 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);

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
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width; canvas.height = height;
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    return new Promise((resolve) => { canvas.toBlob((blob) => resolve(blob), "image/jpeg"); });
  };

  const handleSaveCrop = async () => {
    const blob = await createCroppedImage();
    setCroppedImage(blob);
    setCropModalOpen(false);
  };

  const handleRemoveImage = () => {
    setCroppedImage(null);
    setImageSrc(null);
    setForm({ ...form, profileImage: "" });
  };

  const handleSubmit = async () => {
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
      await axios.put("http://localhost:5000/api/profile/student", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await refreshUser();
      toast.success("Profile created!");
      navigate("/student-dashboard");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const profileSrc = croppedImage
    ? URL.createObjectURL(croppedImage)
    : form.profileImage || null;

  const isLastStep  = step === STEPS.length - 1;
  const currentStep = STEPS[step];
  const StepIcon    = currentStep.icon;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex", justifyContent: "center", alignItems: "center",
        padding: "40px 16px",
        fontFamily: "'Sora', sans-serif",
        background: "linear-gradient(135deg, #f0faf5 0%, #ffffff 50%, #e8f5ee 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-10%", right: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-5%", left: "-8%",
          width: 350, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)",
        }} />
      </div>

      <div
        style={{
          position: "relative", width: "100%", maxWidth: 520,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 24px 64px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
          border: "1px solid rgba(16,185,129,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #059669, #34d399, #6ee7b7)" }} />

        <div style={{ padding: "32px 32px 32px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 52, height: 52, borderRadius: 16, marginBottom: 16,
              background: "linear-gradient(135deg, #059669, #10b981)",
              boxShadow: "0 8px 20px rgba(5,150,105,0.25)",
            }}>
              <RiUserLine size={24} color="#fff" />
            </div>
            <h1 style={{
              fontFamily: "'Lora', serif",
              fontSize: 24, fontWeight: 600, color: "#111827",
              letterSpacing: "-0.02em", margin: "0 0 4px",
            }}>
              Build Your Profile
            </h1>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
              Step {step + 1} of {STEPS.length} — {currentStep.label}
            </p>
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{
                  width: "100%", height: 3, borderRadius: 4,
                  background: i <= step
                    ? "linear-gradient(90deg, #059669, #10b981)"
                    : "#e5e7eb",
                  transition: "background 0.3s ease",
                }} />
              </div>
            ))}
          </div>

          {/* Step label pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "rgba(5,150,105,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <StepIcon size={16} color="#059669" />
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#374151", letterSpacing: "0.01em" }}>
              {currentStep.label}
            </span>
          </div>

          {/* Step Content */}
          <div style={{ minHeight: 160 }}>

            {/* STEP 0 — Photo */}
            {step === 0 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                {profileSrc ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 112, height: 112, borderRadius: "50%",
                      border: "3px solid #10b981",
                      boxShadow: "0 8px 24px rgba(16,185,129,0.2)",
                      overflow: "hidden",
                    }}>
                      <img src={profileSrc} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        fontSize: 12, fontWeight: 500, color: "#ef4444",
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: "'Sora', sans-serif",
                      }}
                    >
                      <RiCloseLine size={14} />
                      Remove photo
                    </button>
                  </div>
                ) : (
                  <label
                    style={{
                      width: "100%", padding: "36px 24px",
                      border: "2px dashed #d1fae5",
                      borderRadius: 16,
                      background: "rgba(5,150,105,0.02)",
                      cursor: "pointer",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 10,
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "#10b981"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "#d1fae5"}
                  >
                    <input type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: "rgba(5,150,105,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <RiImageAddLine size={22} color="#059669" />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: "#374151", margin: 0 }}>
                        Upload Profile Photo
                      </p>
                      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </label>
                )}
              </div>
            )}

            {/* STEPS 1–8 — Text inputs */}
            {step >= 1 && step <= 8 && currentStep.field && (
              <StepInput
                name={currentStep.field}
                value={form[currentStep.field]}
                onChange={handleChange}
                placeholder={PLACEHOLDERS[currentStep.field]}
                icon={StepIcon}
                type={["graduationYear", "cgpa"].includes(currentStep.field) ? "number" : "text"}
              />
            )}

            {/* STEP 9 — Resume */}
            {step === 9 && (
              <div>
                <label
                  style={{
                    width: "100%", padding: "28px 24px",
                    border: "2px dashed #d1fae5",
                    borderRadius: 16,
                    background: "rgba(5,150,105,0.02)",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 10,
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#10b981"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#d1fae5"}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => { const f = e.target.files[0]; if (f) setResumeFile(f); }}
                    style={{ display: "none" }}
                  />
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: "rgba(239,68,68,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <RiFileTextLine size={22} color="#ef4444" />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "#374151", margin: 0 }}>
                      {resumeFile ? resumeFile.name : "Upload Resume (PDF)"}
                    </p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                      {resumeFile ? "✓ File selected" : "PDF files only, up to 10MB"}
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 32, paddingTop: 24,
            borderTop: "1px solid #f3f4f6",
          }}>

            {/* Back */}
            {step > 0 ? (
              <button
                type="button"
                onClick={prev}
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "#f3f4f6", border: "none",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#e5e7eb"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
              >
                <RiArrowLeftLine size={18} color="#374151" />
              </button>
            ) : <div />}

            {/* Skip */}
            <button
              type="button"
              onClick={() => navigate("/student-dashboard")}
              style={{
                padding: "8px 18px", borderRadius: 10,
                border: "1.5px solid #e5e7eb",
                background: "transparent",
                fontSize: 13, fontWeight: 500,
                color: "#6b7280", cursor: "pointer",
                fontFamily: "'Sora', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#9ca3af";
                e.currentTarget.style.color = "#374151";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.color = "#6b7280";
              }}
            >
              Skip for now
            </button>

            {/* Next / Finish */}
            {!isLastStep ? (
              <button
                type="button"
                onClick={next}
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(5,150,105,0.3)",
                  transition: "box-shadow 0.2s, transform 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(5,150,105,0.4)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(5,150,105,0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <RiArrowRightLine size={18} color="#fff" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: "10px 24px", borderRadius: 12,
                  background: loading ? "#9ca3af" : "linear-gradient(135deg, #059669, #10b981)",
                  border: "none", cursor: loading ? "not-allowed" : "pointer",
                  color: "#fff", fontWeight: 600, fontSize: 14,
                  display: "flex", alignItems: "center", gap: 8,
                  fontFamily: "'Sora', sans-serif",
                  boxShadow: loading ? "none" : "0 4px 14px rgba(5,150,105,0.35)",
                  transition: "all 0.2s",
                }}
              >
                <RiCheckLine size={16} />
                {loading ? "Saving…" : "Finish Setup"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Crop Modal ── */}
      {cropModalOpen && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50,
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: 24,
            width: 420, maxWidth: "90vw",
            boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
          }}>
            <h3 style={{
              fontFamily: "'Lora', serif",
              fontSize: 18, fontWeight: 600,
              textAlign: "center", marginBottom: 16, color: "#111827",
            }}>
              Crop your photo
            </h3>
            <div style={{
              position: "relative", width: "100%", height: 256,
              background: "#111827", borderRadius: 14, overflow: "hidden",
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
                  flex: 1, padding: "10px 0", borderRadius: 10,
                  background: "#f3f4f6", border: "none",
                  fontSize: 14, fontWeight: 500, color: "#374151",
                  cursor: "pointer", fontFamily: "'Sora', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCrop}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 10,
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  border: "none", fontSize: 14, fontWeight: 600,
                  color: "#fff", cursor: "pointer",
                  fontFamily: "'Sora', sans-serif",
                  boxShadow: "0 4px 12px rgba(5,150,105,0.3)",
                }}
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;