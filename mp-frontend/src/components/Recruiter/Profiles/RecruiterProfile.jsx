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

  // SAME CROP LOGIC (UNCHANGED)
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

      if (croppedImage) {
        formData.append("companyLogo", croppedImage, "logo.jpg");
      }

      await axios.put(
        "http://localhost:5000/api/profile/recruiter",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await refreshUser();
      toast.success("Company profile updated!");
      navigate("/recruiter-dashboard");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-xl p-8">

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          {steps[step]}
        </h2>

        <p className="text-center text-sm text-gray-500 mb-6">
          Step {step + 1} of {steps.length}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* STEP CONTENT */}

          {step === 0 && (
            <div className="text-center space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="w-full px-4 py-2 border rounded-lg"
              />

              {!croppedImage && form.companyLogo && (
                <img
                  src={`http://localhost:5000${form.companyLogo}`}
                  alt="Logo"
                  className="w-28 h-28 rounded-xl object-cover border-4 border-indigo-500 mx-auto"
                />
              )}

              {croppedImage && (
                <div className="space-y-2">
                  <img
                    src={URL.createObjectURL(croppedImage)}
                    alt="Preview"
                    className="w-28 h-28 rounded-xl object-cover border-4 border-indigo-500 mx-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="text-red-500 text-sm"
                  >
                    Remove Logo
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <Input label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} />
          )}

          {step === 2 && (
            <Input label="Company Website" name="companyWebsite" value={form.companyWebsite} onChange={handleChange} />
          )}

          {step === 3 && (
            <Input label="Industry" name="industry" value={form.industry} onChange={handleChange} />
          )}

          {step === 4 && (
            <Input label="Location" name="companyLocation" value={form.companyLocation} onChange={handleChange} />
          )}

          {step === 5 && (
            <textarea
              required
              name="companyDescription"
              value={form.companyDescription}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-lg outline-none transition"
              placeholder="Company Description"
            />
          )}

          {/* NAVIGATION */}
          <div className="flex justify-between pt-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={prev}
                className="px-5 py-2 bg-gray-300 rounded-lg"
              >
                ← Back
              </button>
            ) : (
              <div />
              
            )}

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:scale-105 transition"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md"
              >
                {loading ? "Saving..." : "Finish"}
              </button>
            )}
          </div>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => navigate("/recruiter-dashboard")}
              className="text-sm text-gray-500 underline"
            >
              Skip for now
            </button>
          </div>

        </form>
      </div>

      {/* CROP MODAL — SAME LOGIC */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <div className="relative w-full h-64 bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCropModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveCrop}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      required
      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-lg outline-none transition"
      {...props}
    />
  </div>
);

export default RecruiterProfile;