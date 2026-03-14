import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import { AuthContext } from "../../../context/AuthContext";

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const [step, setStep] = useState(0);

  const steps = [
    "Company Logo",
    "Company Name",
    "Website",
    "Industry",
    "Location",
    "Description",
  ];

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
      console.error(error);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const next = () => step < steps.length - 1 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropModalOpen(true);
    };
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
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
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
      formData.append("companyName", form.companyName);
      formData.append("companyWebsite", form.companyWebsite);
      formData.append("companyDescription", form.companyDescription);
      formData.append("industry", form.industry);
      formData.append("companyLocation", form.companyLocation);
      if (croppedImage) {
        formData.append("companyLogo", croppedImage, "logo.jpg");
      }
      await axios.put("http://localhost:5000/api/profile/recruiter", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl w-full max-w-xl p-10 border border-gray-100">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
          <p className="text-gray-500 text-sm">Help candidates know more about your company</p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition ${i <= step ? "bg-purple-600" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">{steps[step]}</h2>

        <form noValidate onSubmit={(e) => e.preventDefault()} className="space-y-6">

          {step === 0 && (
            <div className="text-center space-y-5">
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-purple-500 transition">
                <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                <p className="text-gray-500 text-sm">Click to upload company logo</p>
              </label>

              {/* ✅ FIX: Cloudinary URL is complete — no localhost prefix needed */}
              {!croppedImage && form.companyLogo && (
                <img
                  src={form.companyLogo}
                  alt="Logo"
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-purple-500 shadow"
                />
              )}

              {croppedImage && (
                <div className="space-y-3">
                  <img
                    src={URL.createObjectURL(croppedImage)}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-purple-500 shadow"
                  />
                  <button type="button" onClick={handleRemoveLogo} className="text-red-500 text-sm">
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 1 && <Input label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} />}
          {step === 2 && <Input label="Company Website" name="companyWebsite" value={form.companyWebsite} onChange={handleChange} />}
          {step === 3 && <Input label="Industry" name="industry" value={form.industry} onChange={handleChange} />}
          {step === 4 && <Input label="Location" name="companyLocation" value={form.companyLocation} onChange={handleChange} />}

          {step === 5 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="companyDescription"
                value={form.companyDescription}
                onChange={handleChange}
                rows="4"
                className="w-full border border-gray-300 focus:border-purple-500 rounded-lg px-4 py-3 outline-none transition resize-none"
                placeholder="Tell candidates about your company..."
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-6">
            {step > 0 ? (
              <button type="button" onClick={prev} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition">←</button>
            ) : <div />}

            <button
              type="button"
              onClick={() => navigate("/recruiter-dashboard")}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Skip
            </button>

            {step < steps.length - 1 ? (
              <button type="button" onClick={next} className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition">→</button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
              >
                {loading ? "Saving..." : "Finish"}
              </button>
            )}
          </div>

        </form>
      </div>

      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-center">Crop your image</h3>
            <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
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
            <div className="flex justify-between pt-3">
              <button type="button" onClick={() => setCropModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button type="button" onClick={handleSaveCrop} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      className="w-full border border-gray-300 focus:border-purple-500 rounded-lg px-4 py-3 outline-none transition"
      {...props}
    />
  </div>
);

export default RecruiterProfile;