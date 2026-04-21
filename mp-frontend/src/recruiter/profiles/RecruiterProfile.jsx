import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import { AuthContext } from "../../context/AuthContext";
import {
  RiBuildingLine,
  RiGlobalLine,
  RiBriefcaseLine,
  RiMapPinLine,
  RiFileTextLine,
  RiImageAddLine,
  RiCloseLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiCheckLine,
} from "react-icons/ri";
import api from "../../utils/api.js"

/* ── Google Font inject ── */
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

/* ─────────────────────────────────────────
   STEP META
───────────────────────────────────────── */
const STEPS = [
  { label: "Logo",        icon: RiImageAddLine,   field: null },
  { label: "Name",        icon: RiBuildingLine,   field: "companyName" },
  { label: "Website",     icon: RiGlobalLine,     field: "companyWebsite" },
  { label: "Industry",    icon: RiBriefcaseLine,  field: "industry" },
  { label: "Location",    icon: RiMapPinLine,     field: "companyLocation" },
  { label: "About",       icon: RiFileTextLine,   field: "companyDescription" },
];

const PLACEHOLDERS = {
  companyName: "e.g. Acme Technologies",
  companyWebsite: "https://yourcompany.com",
  industry: "e.g. Software, Finance, Healthcare",
  companyLocation: "e.g. Bengaluru, India",
  companyDescription: "Tell candidates what makes your company a great place to work…",
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const RecruiterProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const [step, setStep]   = useState(0);
  const [form, setForm]   = useState({
    companyName: "", companyWebsite: "", companyDescription: "",
    industry: "",    companyLocation: "",  companyLogo: "",
  });
  const [loading, setLoading]                   = useState(false);
  const [imageSrc, setImageSrc]                 = useState(null);
  const [croppedImage, setCroppedImage]         = useState(null);
  const [cropModalOpen, setCropModalOpen]       = useState(false);
  const [crop, setCrop]                         = useState({ x: 0, y: 0 });
  const [zoom, setZoom]                         = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/profile", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      const user = res.data;
      setForm({
        companyName:        user.companyName        || "",
        companyWebsite:     user.companyWebsite     || "",
        companyDescription: user.companyDescription || "",
        industry:           user.industry           || "",
        companyLocation:    user.companyLocation    || "",
        companyLogo:        user.companyLogo        || "",
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
    const ctx    = canvas.getContext("2d");
    const { width, height, x, y } = croppedAreaPixels;
    canvas.width  = width;
    canvas.height = height;
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    return new Promise((resolve) => { canvas.toBlob((blob) => resolve(blob), "image/jpeg"); });
  };

  const handleSaveCrop = async () => {
    const blob = await createCroppedImage();
    setCroppedImage(blob);
    setCropModalOpen(false);
  };

  const handleRemoveLogo = () => {
    setCroppedImage(null);
    setImageSrc(null);
    setForm({ ...form, companyLogo: "" });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("companyName",        form.companyName);
      formData.append("companyWebsite",     form.companyWebsite);
      formData.append("companyDescription", form.companyDescription);
      formData.append("industry",           form.industry);
      formData.append("companyLocation",    form.companyLocation);
      if (croppedImage) formData.append("companyLogo", croppedImage, "logo.jpg");
      await api.put("/api/profile/recruiter", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await refreshUser();
      toast.success("Company profile created!");
      navigate("/recruiter-dashboard");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const logoSrc = croppedImage
    ? URL.createObjectURL(croppedImage)
    : form.companyLogo || null;

  const isLastStep   = step === STEPS.length - 1;
  const currentStep  = STEPS[step];
  const StepIcon     = currentStep.icon;

  return (
    <div
      className="min-h-screen flex justify-center items-center p-4"
      style={{
        fontFamily: "'Sora', sans-serif",
        background: "linear-gradient(135deg, #f0faf5 0%, #ffffff 50%, #e8f5ee 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden",
      }}>
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
        className="relative w-full bg-white"
        style={{
          maxWidth: 520,
          borderRadius: 24,
          boxShadow: "0 24px 64px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)",
          border: "1px solid rgba(16,185,129,0.12)",
          overflow: "hidden",
        }}
      >
        {/* ── Top accent bar ── */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #059669, #34d399, #6ee7b7)" }} />

        <div className="px-8 py-8">

          {/* ── Header ── */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center mb-4"
              style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #059669, #10b981)",
                boxShadow: "0 8px 20px rgba(5,150,105,0.25)",
              }}
            >
              <RiBuildingLine size={24} color="#fff" />
            </div>
            <h1
              className="text-2xl font-bold text-gray-900 mb-1"
              style={{ fontFamily: "'Lora', serif", letterSpacing: "-0.02em" }}
            >
              Set Up Your Company
            </h1>
            <p className="text-sm text-gray-400 font-normal">
              Step {step + 1} of {STEPS.length} — {currentStep.label}
            </p>
          </div>

          {/* ── Progress ── */}
          <div className="flex items-center gap-1.5 mb-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done    = i < step;
              const active  = i === step;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    style={{
                      width: "100%", height: 3, borderRadius: 4,
                      background: done || active
                        ? "linear-gradient(90deg, #059669, #10b981)"
                        : "#e5e7eb",
                      transition: "background 0.3s ease",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* ── Step label pill ── */}
          <div className="flex items-center gap-2 mb-6">
            <div
              style={{
                width: 32, height: 32, borderRadius: 10,
                background: "rgba(5,150,105,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <StepIcon size={16} color="#059669" />
            </div>
            <span className="text-sm font-semibold text-gray-700 tracking-wide">
              {currentStep.label}
            </span>
          </div>

          {/* ── Step Content ── */}
          <div className="min-h-[160px]">

            {/* STEP 0 — Logo */}
            {step === 0 && (
              <div className="flex flex-col items-center gap-5">
                {logoSrc ? (
                  <div className="flex flex-col items-center gap-3">
                    <div style={{
                      width: 112, height: 112, borderRadius: "50%",
                      border: "3px solid #10b981",
                      boxShadow: "0 8px 24px rgba(16,185,129,0.2)",
                      overflow: "hidden",
                    }}>
                      <img src={logoSrc} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
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
                    <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: "rgba(5,150,105,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <RiImageAddLine size={22} color="#059669" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">Upload Company Logo</p>
                      <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB</p>
                    </div>
                  </label>
                )}
              </div>
            )}

            {/* STEP 1–4 — Text inputs */}
            {step >= 1 && step <= 4 && currentStep.field && (
              <StepInput
                name={currentStep.field}
                value={form[currentStep.field]}
                onChange={handleChange}
                placeholder={PLACEHOLDERS[currentStep.field]}
                icon={StepIcon}
              />
            )}

            {/* STEP 5 — Description */}
            {step === 5 && (
              <div>
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: 14, top: 14,
                    color: "#9ca3af", pointerEvents: "none",
                  }}>
                    <RiFileTextLine size={16} />
                  </div>
                  <textarea
                    name="companyDescription"
                    value={form.companyDescription}
                    onChange={handleChange}
                    rows={5}
                    placeholder={PLACEHOLDERS.companyDescription}
                    style={{
                      width: "100%", paddingLeft: 40, paddingRight: 16,
                      paddingTop: 12, paddingBottom: 12,
                      background: "#f9fafb",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: 12,
                      fontSize: 14, color: "#111827",
                      resize: "none", outline: "none",
                      fontFamily: "'Sora', sans-serif",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#059669";
                      e.target.style.boxShadow   = "0 0 0 3px rgba(5,150,105,0.08)";
                      e.target.style.background  = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow   = "none";
                      e.target.style.background  = "#f9fafb";
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid #f3f4f6" }}>

            {/* Back */}
            {step > 0 ? (
              <button
                type="button"
                onClick={prev}
                style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "#f3f4f6",
                  border: "none", cursor: "pointer",
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
              onClick={() => navigate("/recruiter-dashboard")}
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
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "#fff", borderRadius: 20, padding: 24,
              width: 420, maxWidth: "90vw",
              boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 18, fontWeight: 600,
                textAlign: "center", marginBottom: 16, color: "#111827",
              }}
            >
              Crop your logo
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

/* ── Reusable step input ── */
const StepInput = ({ name, value, onChange, placeholder, icon: Icon }) => (
  <div style={{ position: "relative" }}>
    <div style={{
      position: "absolute", left: 14, top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af", pointerEvents: "none",
    }}>
      <Icon size={16} />
    </div>
    <input
      type="text"
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
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e5e7eb";
        e.target.style.boxShadow   = "none";
        e.target.style.background  = "#f9fafb";
      }}
    />
  </div>
);

export default RecruiterProfile;