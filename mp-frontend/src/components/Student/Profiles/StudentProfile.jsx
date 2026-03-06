import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import { AuthContext } from "../../../context/AuthContext";

const StudentProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const [step, setStep] = useState(0);

  const steps = [
    "Profile Image",
    "Phone",
    "College",
    "Branch",
    "Graduation Year",
    "CGPA",
    "Skills",
  ];

  const [form, setForm] = useState({
    phone: "",
    college: "",
    branch: "",
    graduationYear: "",
    cgpa: "",
    skills: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);

  // SAME CROP LOGIC (unchanged)
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
        phone: user.phone || "",
        college: user.college || "",
        branch: user.branch || "",
        graduationYear: user.graduationYear || "",
        cgpa: user.cgpa || "",
        skills: user.skills?.join(", ") || "",
        profileImage: user.profileImage || "",
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

  const handleRemoveImage = () => {
    setCroppedImage(null);
    setImageSrc(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("phone", form.phone);
      formData.append("college", form.college);
      formData.append("branch", form.branch);
      formData.append("graduationYear", form.graduationYear);
      formData.append("cgpa", form.cgpa);

      form.skills
        .split(",")
        .map((s) => s.trim())
        .forEach((skill) => formData.append("skills[]", skill));

      if (croppedImage) {
        formData.append("profileImage", croppedImage, "profile.jpg");
      }

      await axios.put(
        "http://localhost:5000/api/profile/student",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await refreshUser();
      toast.success("Profile updated!");
      navigate("/student-dashboard");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-100 to-indigo-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-xl p-8 relative">

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
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
                className="w-full border rounded-lg px-4 py-2"
              />

              {!croppedImage && form.profileImage && (
                <img
                  src={`http://localhost:5000${form.profileImage}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 mx-auto"
                />
              )}

              {croppedImage && (
                <div className="space-y-3">
                  <img
                    src={URL.createObjectURL(croppedImage)}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 mx-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-1 bg-red-500 text-white rounded-full text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
          )}
          {step === 2 && (
            <Input label="College Name" name="college" value={form.college} onChange={handleChange} />
          )}
          {step === 3 && (
            <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} />
          )}
          {step === 4 && (
            <Input label="Graduation Year" name="graduationYear" value={form.graduationYear} onChange={handleChange} />
          )}
          {step === 5 && (
            <Input label="CGPA" name="cgpa" value={form.cgpa} onChange={handleChange} />
          )}
          {step === 6 && (
            <Input label="Skills (comma separated)" name="skills" value={form.skills} onChange={handleChange} />
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
                className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:scale-105 transition"
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
              onClick={() => navigate("/student-dashboard")}
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
                cropShape="round"
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
                className="px-4 py-2 bg-purple-600 text-white rounded"
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
      className="w-full border-2 border-gray-200 focus:border-purple-500 focus:ring-0 rounded-lg px-4 py-3 outline-none transition"
      {...props}
    />
  </div>
);

export default StudentProfile;