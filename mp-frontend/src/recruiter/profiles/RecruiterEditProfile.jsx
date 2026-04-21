import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  RiBuildingLine,
  RiGlobalLine,
  RiBriefcaseLine,
  RiMapPinLine,
  RiFileTextLine,
  RiSaveLine,
  RiCameraLine,
  RiCloseLine,
  RiArrowLeftLine,
  RiCheckLine,
} from "react-icons/ri";
import api from "../../utils/api.js"
/* ── Font injection ── */
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap";
fontLink.rel = "stylesheet";
if (!document.head.querySelector(`link[href="${fontLink.href}"]`)) {
  document.head.appendChild(fontLink);
}

/* ─────────────────────────────────────────
   INPUTFIELD — defined outside to prevent
   re-mount on every keystroke
───────────────────────────────────────── */
const InputField = ({ icon: Icon, label, name, placeholder, value, onChange }) => (
  <div>
    <label
      style={{
        display: "block",
        fontSize: 11, fontWeight: 600,
        color: "#6b7280",
        textTransform: "uppercase", letterSpacing: "0.08em",
        marginBottom: 6,
      }}
    >
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
        type="text"
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

/* ─────────────────────────────────────────
   SECTION DIVIDER
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const RecruiterEditProfile = () => {
  const { refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "", companyWebsite: "", companyDescription: "",
    industry: "", companyLocation: "", companyLogo: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/profile", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      const user = res.data;
      setForm({
        companyName: user.companyName || "",
        companyWebsite: user.companyWebsite || "",
        companyDescription: user.companyDescription || "",
        industry: user.industry || "",
        companyLocation: user.companyLocation || "",
        companyLogo: user.companyLogo || "",
      });
    } catch (error) { toast.error("Failed to load profile"); }
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
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("companyName", form.companyName);
      formData.append("companyWebsite", form.companyWebsite);
      formData.append("companyDescription", form.companyDescription);
      formData.append("industry", form.industry);
      formData.append("companyLocation", form.companyLocation);
      if (croppedImage) formData.append("companyLogo", croppedImage, "logo.jpg");
      await api.put("/api/profile/recruiter", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await refreshUser();
      toast.success("Company profile updated successfully");
      navigate("/recruiter-dashboard");
    } catch (error) {
      toast.error("Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const logoSrc = croppedImage
    ? URL.createObjectURL(croppedImage)
    : form.companyLogo || null;

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
        {/* ── Top accent stripe ── */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #059669, #34d399, #a7f3d0)" }} />

        {/* ── Hero Banner ── */}
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
          {/* Glow orb */}
          <div style={{
            position: "absolute", right: 40, top: -30,
            width: 160, height: 160, borderRadius: "50%", opacity: 0.15,
            background: "radial-gradient(circle, #6ee7b7, transparent 70%)",
          }} />
          {/* Glow orb 2 */}
          <div style={{
            position: "absolute", left: -20, bottom: -20,
            width: 120, height: 120, borderRadius: "50%", opacity: 0.1,
            background: "radial-gradient(circle, #34d399, transparent 70%)",
          }} />

          {/* Logo area */}
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
              {logoSrc ? (
                <img src={logoSrc} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <RiBuildingLine size={30} color="rgba(255,255,255,0.4)" />
              )}
            </div>
            {/* Camera badge */}
            <label
              title="Change logo"
              style={{
                position: "absolute", bottom: -4, right: -4,
                width: 26, height: 26, borderRadius: 8,
                background: "#10b981",
                border: "2px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(5,150,105,0.4)",
                transition: "background 0.2s",
                zIndex: 3,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#059669"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#10b981"}
            >
              <RiCameraLine size={13} color="#fff" />
              <input type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }} />
            </label>
          </div>

          {/* Company identity */}
          <div style={{ position: "relative", zIndex: 2, minWidth: 0, flex: 1 }}>
            <h2
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 20, fontWeight: 600,
                color: "#fff", margin: 0,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}
            >
              {form.companyName || "Your Company"}
            </h2>
            <p style={{ color: "#6ee7b7", fontSize: 13, margin: "4px 0 0", opacity: 0.85 }}>
              {form.industry || "Industry"}
              {form.companyLocation && ` · ${form.companyLocation}`}
            </p>
            {logoSrc && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                style={{
                  marginTop: 8,
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11.5, color: "rgba(252,165,165,0.9)",
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Sora', sans-serif", padding: 0,
                }}
              >
                <RiCloseLine size={13} />
                Remove logo
              </button>
            )}
          </div>

          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate("/recruiter-dashboard")}
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

        {/* ── Form body ── */}
        <div style={{ padding: "28px 32px 32px" }}>

          <SectionLabel label="Company Info" />

          <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <InputField icon={RiBuildingLine} label="Company Name" name="companyName" placeholder="Acme Corp" value={form.companyName} onChange={handleChange} />
              <InputField icon={RiGlobalLine} label="Website" name="companyWebsite" placeholder="https://acme.com" value={form.companyWebsite} onChange={handleChange} />
              <InputField icon={RiBriefcaseLine} label="Industry" name="industry" placeholder="Software / Finance" value={form.industry} onChange={handleChange} />
              <InputField icon={RiMapPinLine} label="Location" name="companyLocation" placeholder="Bengaluru, India" value={form.companyLocation} onChange={handleChange} />
            </div>

            <SectionLabel label="About" />

            <div style={{ marginTop: 14 }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 600,
                color: "#6b7280", textTransform: "uppercase",
                letterSpacing: "0.08em", marginBottom: 6,
              }}>
                Company Description
              </label>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", left: 13, top: 13,
                  color: "#9ca3af", pointerEvents: "none",
                }}>
                  <RiFileTextLine size={15} />
                </div>
                <textarea
                  name="companyDescription"
                  value={form.companyDescription}
                  onChange={handleChange}
                  placeholder="Tell candidates what makes your company a great place to work…"
                  rows={4}
                  style={{
                    width: "100%", paddingLeft: 38, paddingRight: 14,
                    paddingTop: 11, paddingBottom: 11,
                    background: "#f9fafb",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 10, fontSize: 13.5,
                    color: "#111827", outline: "none", resize: "none",
                    fontFamily: "'Sora', sans-serif",
                    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#059669";
                    e.target.style.boxShadow = "0 0 0 3px rgba(5,150,105,0.09)";
                    e.target.style.background = "#fff";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "#f9fafb";
                  }}
                />
              </div>
            </div>

            {/* ── Submit ── */}
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

      {/* ── Crop Modal ── */}
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
              Crop Company Logo
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

export default RecruiterEditProfile;