import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import {
  Phone, GraduationCap, BookOpen, Calendar, Star, Code,
  Image as ImageIcon, Save, User, Mail, FileText, Upload, Eye, X, Camera
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";

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

const StudentEditProfile = () => {
  const { refreshUser } = useContext(AuthContext);

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
  const [showResumePreview, setShowResumePreview] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const user = res.data;
      setForm({
        name: user.name || "", email: user.email || "", phone: user.phone || "",
        college: user.college || "", branch: user.branch || "",
        graduationYear: user.graduationYear || "", cgpa: user.cgpa || "",
        skills: user.skills?.join(", ") || "",
        profileImage: user.profileImage || "", resume: user.resume || "",
      });
    } catch (err) {
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
    await new Promise((resolve) => image.onload = resolve);
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
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("college", form.college);
      formData.append("branch", form.branch);
      formData.append("graduationYear", form.graduationYear);
      formData.append("cgpa", form.cgpa);
      form.skills.split(",").map((s) => s.trim()).filter((s) => s !== "")
        .forEach((skill) => { formData.append("skills[]", skill); });
      if (croppedImage) formData.append("profileImage", croppedImage, "profile.jpg");
      if (resumeFile) formData.append("resume", resumeFile);
      await axios.put("http://localhost:5000/api/profile/student", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        }
      });
      await refreshUser();
      toast.success("Profile updated successfully 🚀");
    } catch (error) {
      toast.error("Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const profileImageSrc = croppedImage
    ? URL.createObjectURL(croppedImage)
    : form.profileImage || null;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start py-12 px-4">

      {/* Subtle page background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #d1fae5 0%, transparent 50%), radial-gradient(circle at 80% 20%, #e0e7ff 0%, transparent 40%)" }}
      />

      <div className="relative bg-white shadow-xl rounded-3xl w-full max-w-2xl overflow-hidden border border-slate-100">

        {/* ── Banner: dark with emerald accent ── */}
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

          {/* Profile image */}
          <div className="relative z-10 flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl border-2 border-emerald-400/40 shadow-xl overflow-hidden bg-white/10">
              {profileImageSrc ? (
                <img src={profileImageSrc} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={28} className="text-white/50" />
                </div>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center justify-center cursor-pointer shadow-md transition-colors z-20">
              <Camera size={12} className="text-slate-900" />
              <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            </label>
          </div>

          {/* Name & college */}
          <div className="relative z-10 min-w-0">
            <h2 className="text-xl font-bold text-white leading-tight truncate">
              {form.name || "Your Name"}
            </h2>
            <p className="text-sm text-emerald-300/80 mt-0.5 truncate">
              {form.college || "College Name"}
            </p>
          </div>
        </div>

        <div className="px-8 pb-8 pt-6">

          {/* Personal Info section label */}
          <div className="flex items-center gap-2 mb-5">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Personal Info</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField icon={User} label="Full Name" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
              <InputField icon={Mail} label="Email" name="email" placeholder="john@email.com" type="email" value={form.email} onChange={handleChange} />
              <InputField icon={Phone} label="Phone" name="phone" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} />
              <InputField icon={GraduationCap} label="College" name="college" placeholder="IIT Bombay" value={form.college} onChange={handleChange} />
              <InputField icon={BookOpen} label="Branch" name="branch" placeholder="Computer Science" value={form.branch} onChange={handleChange} />
              <InputField icon={Calendar} label="Graduation Year" name="graduationYear" placeholder="2025" type="number" value={form.graduationYear} onChange={handleChange} />
              <InputField icon={Star} label="CGPA" name="cgpa" placeholder="8.5" value={form.cgpa} onChange={handleChange} />
              <InputField icon={Code} label="Skills (comma separated)" name="skills" placeholder="React, Node.js, Python" value={form.skills} onChange={handleChange} />
            </div>

            {/* Resume section label */}
            <div className="flex items-center gap-2 pt-1">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Resume</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Resume card */}
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
                    <button
                      type="button"
                      onClick={() => setShowResumePreview(true)}
                      className="text-xs text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1 mt-0.5 transition-colors"
                    >
                      <Eye size={11} /> View Resume
                    </button>
                  )}
                  {resumeFile && (
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">✓ Ready to upload</p>
                  )}
                </div>
              </div>

              <label className="cursor-pointer flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow">
                <Upload size={13} />
                {form.resume ? "Replace" : "Upload PDF"}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setResumeFile(file);
                  }}
                  className="hidden"
                />
              </label>
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

      {/* ── Resume Preview: TRUE FULLSCREEN dark viewer ── */}
      {showResumePreview && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0f172a" }}>

          {/* Top toolbar */}
          <div
            className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-white/10"
            style={{ background: "#1e293b" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-500/20 rounded-xl flex items-center justify-center">
                <FileText size={16} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Resume Preview</p>
                <p className="text-xs text-white/40">{form.name || "Student"}'s resume</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={form.resume}
                download
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors"
              >
                <Upload size={13} /> Download
              </a>
              <button
                onClick={() => setShowResumePreview(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* PDF iframe fills entire remaining screen */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(form.resume)}`}
              className="w-full h-full border-0"
              title="Resume Preview"
            />
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-3xl w-[420px] shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-center text-slate-800">Crop Profile Photo</h3>
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
                onClick={() => setCropModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
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

export default StudentEditProfile;