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
    "Name",
    "Email",
    "Phone",
    "College",
    "Branch",
    "Graduation Year",
    "CGPA",
    "Skills",
    "Resume"
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    graduationYear: "",
    cgpa: "",
    skills: "",
    profileImage: "",
    resume: ""
  });

  const [resumeFile, setResumeFile] = useState(null);
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
      const res = await axios.get(
        "http://localhost:5000/api/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const user = res.data;

      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        college: user.college || "",
        branch: user.branch || "",
        graduationYear: user.graduationYear || "",
        cgpa: user.cgpa || "",
        skills: user.skills?.join(", ") || "",
        profileImage: user.profileImage || "",
        resume: user.resume || ""
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

    await new Promise(resolve => image.onload = resolve);

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

  // ✅ FIX: handleSubmit is now called explicitly from the Finish button only
  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.college ||
      !form.branch ||
      !form.graduationYear ||
      !form.cgpa ||
      !form.skills ||
      !resumeFile
    ) {
      return;
    }

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

      form.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .forEach((skill) => formData.append("skills[]", skill));

      if (croppedImage) {
        formData.append("profileImage", croppedImage, "profile.jpg");
      }

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      await axios.put(
        "http://localhost:5000/api/profile/student",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      await refreshUser();
      toast.success("Profile created!");
      navigate("/student-dashboard");

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
          <h1 className="text-3xl font-bold text-gray-800">
            Complete Your Profile
          </h1>
          <p className="text-gray-500 text-sm">
            Help recruiters know more about you
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition ${i <= step ? "bg-purple-600" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">
          {steps[step]}
        </h2>

        {/* ✅ FIX: form has no onSubmit — prevents any accidental submission.
            All buttons are type="button" so pressing Enter won't trigger submit. */}
        <form
          noValidate
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6"
        >

          {step === 0 && (
            <div className="text-center space-y-5">

              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-purple-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
                <p className="text-gray-500 text-sm">
                  Click to upload profile picture
                </p>
              </label>

              {!croppedImage && form.profileImage && (
                <img
                  src={form.profileImage}
                  alt="Profile"
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
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
          )}

          {step === 2 && (
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
          )}

          {step === 3 && (
            <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
          )}

          {step === 4 && (
            <Input label="College Name" name="college" value={form.college} onChange={handleChange} />
          )}

          {step === 5 && (
            <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} />
          )}

          {step === 6 && (
            <Input label="Graduation Year" name="graduationYear" value={form.graduationYear} onChange={handleChange} />
          )}

          {step === 7 && (
            <Input label="CGPA" name="cgpa" value={form.cgpa} onChange={handleChange} />
          )}

          {step === 8 && (
            <Input label="Skills (comma separated)" name="skills" value={form.skills} onChange={handleChange} />
          )}

          {step === 9 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Upload Resume
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-6">

            {step > 0 ? (
              <button
                type="button"
                onClick={prev}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                ←
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={() => navigate("/student-dashboard")}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Skip
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                →
              </button>
            ) : (
              // ✅ FIX: type="button" + onClick instead of type="submit"
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

            <h3 className="text-lg font-semibold text-center">
              Crop your image
            </h3>

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
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCrop}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
              >
                Save
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
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      className="w-full border border-gray-300 focus:border-purple-500 rounded-lg px-4 py-3 outline-none transition"
      {...props}
    />
  </div>
);

export default StudentProfile;