import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import {
  Building2, Globe, Briefcase, MapPin, FileText, Save, Camera, 
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ✅ Outside component — prevents re-mount on every keystroke (fixes tab-jump bug)
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

const RecruiterEditProfile = () => {
  const { refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    industry: "",
    companyLocation: "",
    companyLogo: "",
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
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
    } catch (error) {
      toast.error("Failed to load profile");
    }
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
      await axios.put("http://localhost:5000/api/profile/recruiter", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  // ✅ FIX: Cloudinary URL is already complete — no localhost prefix needed
  const logoSrc = croppedImage
    ? URL.createObjectURL(croppedImage)
    : form.companyLogo || null;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start py-12 px-4">

      {/* Subtle page background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #d1fae5 0%, transparent 50%), radial-gradient(circle at 80% 20%, #e0e7ff 0%, transparent 40%)" }}
      />

      <div className="relative bg-white shadow-xl rounded-3xl w-full max-w-2xl overflow-hidden border border-slate-100">

        {/* ── Banner ── */}
        <div
          className="h-36 relative flex items-center px-8 gap-5"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #134e4a 100%)" }}
        >
          {/* Dot pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          />
          {/* Emerald glow */}
          <div className="absolute right-8 top-0 w-40 h-40 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #34d399, transparent 70%)" }}
          />

          {/* Company logo */}
          <div className="relative z-10 flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl border-2 border-emerald-400/40 shadow-xl overflow-hidden bg-white/10">
              {logoSrc ? (
                <img src={logoSrc} alt="Company Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 size={28} className="text-white/50" />
                </div>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center justify-center cursor-pointer shadow-md transition-colors z-20">
              <Camera size={12} className="text-slate-900" />
              <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            </label>
          </div>

          {/* Company name & industry */}
          <div className="relative z-10 min-w-0">
            <h2 className="text-xl font-bold text-white leading-tight truncate">
              {form.companyName || "Company Name"}
            </h2>
            <p className="text-sm text-emerald-300/80 mt-0.5 truncate">
              {form.industry || "Industry"}
            </p>
          </div>
        </div>

        <div className="px-8 pb-8 pt-6">

          

          {/* Company Info section label */}
          <div className="flex items-center gap-2 mb-5">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Company Info</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField icon={Building2} label="Company Name" name="companyName" placeholder="Acme Corp" value={form.companyName} onChange={handleChange} />
              <InputField icon={Globe} label="Website" name="companyWebsite" placeholder="https://acme.com" value={form.companyWebsite} onChange={handleChange} />
              <InputField icon={Briefcase} label="Industry" name="industry" placeholder="Software / Finance" value={form.industry} onChange={handleChange} />
              <InputField icon={MapPin} label="Location" name="companyLocation" placeholder="Bangalore, India" value={form.companyLocation} onChange={handleChange} />
            </div>

            {/* Description section label */}
            <div className="flex items-center gap-2 pt-1">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">About</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Description */}
            <div className="relative group">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Company Description
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <FileText size={16} />
                </div>
                <textarea
                  name="companyDescription"
                  value={form.companyDescription}
                  onChange={handleChange}
                  placeholder="Tell candidates what makes your company great..."
                  rows="4"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400
                    focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white
                    transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2
                text-white py-3 rounded-2xl font-semibold text-sm shadow-lg
                transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: "linear-gradient(135deg, #0f172a, #134e4a)" }}
            >
              <Save size={16} />
              {loading ? "Saving changes..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-3xl w-[420px] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-center text-slate-800">Crop Company Logo</h3>
            <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden">
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
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCrop}
                className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors"
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

export default RecruiterEditProfile;