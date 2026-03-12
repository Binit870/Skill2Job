import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import {
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Star,
  Code,
  Image as ImageIcon,
  Save,
  Trash2,
  User,
  Mail,
  FileText,
  Upload
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";

const StudentEditProfile = () => {

  const { refreshUser } = useContext(AuthContext);

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
    resume: "",
  });

  const [loading, setLoading] = useState(false);

  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeName, setResumeName] = useState("");

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
        resume: user.resume || "",
      });

      if (user.resume) {
        const fileName = user.resume.split("/").pop();
        setResumeName(fileName);
      }

    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

    await new Promise((resolve) => image.onload = resolve);

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

      form.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .forEach((skill) => {
          formData.append("skills[]", skill);
        });

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

      toast.success("Profile updated successfully 🚀");

    } catch (error) {
      toast.error("Update failed. Try again.");
    }
    finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, name, placeholder, type = "text" }) => (

    <div className="relative">

      <Icon className="absolute left-3 top-3 text-gray-400" size={18} />

      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
      />

    </div>

  );

  return (

    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex justify-center items-start p-10">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-3xl p-10 border border-gray-100">

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Edit Profile
          </h2>
          <p className="text-gray-500 text-sm">
            Update your personal and academic details
          </p>
        </div>

        {/* Profile Image */}

        <div className="flex flex-col items-center mb-8">

          {!croppedImage && form.profileImage && (
            <img
              src={form.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg"
            />
          )}

          {croppedImage && (
            <img
              src={URL.createObjectURL(croppedImage)}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg"
            />
          )}

          <label className="mt-4 cursor-pointer flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition">

            <ImageIcon size={16} />
            Change Photo

            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />

          </label>

        </div>

        {/* Resume Section */}

        <div className="bg-gray-50 border rounded-xl p-6 mb-8">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <FileText className="text-indigo-600" />

              <div>
                <p className="font-medium text-gray-800">
                  Resume
                </p>

                {resumeName && (
                  <p className="text-xs text-gray-500">
                    {resumeName}
                  </p>
                )}

                {form.resume && (
                  <a
                    href={form.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    View Uploaded Resume
                  </a>
                )}

              </div>

            </div>

            <label className="cursor-pointer flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">

              <Upload size={16} />
              Upload

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setResumeFile(file);
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />

            </label>

          </div>

        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <InputField icon={User} name="name" placeholder="Full Name" />
          <InputField icon={Mail} name="email" placeholder="Email" type="email" />
          <InputField icon={Phone} name="phone" placeholder="Phone Number" />
          <InputField icon={GraduationCap} name="college" placeholder="College Name" />
          <InputField icon={BookOpen} name="branch" placeholder="Branch" />
          <InputField icon={Calendar} name="graduationYear" placeholder="Graduation Year" type="number" />
          <InputField icon={Star} name="cgpa" placeholder="CGPA" />
          <InputField icon={Code} name="skills" placeholder="Skills (comma separated)" />

          <div className="md:col-span-2 pt-4">

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium shadow-lg transition disabled:opacity-50"
            >

              <Save size={18} />
              {loading ? "Saving..." : "Update Profile"}

            </button>

          </div>

        </form>

      </div>

      {cropModalOpen && (

        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-2xl w-[420px] shadow-xl space-y-4">

            <h3 className="text-lg font-semibold text-center">
              Crop Profile Image
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
                onClick={() => setCropModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveCrop}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg"
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

export default StudentEditProfile;