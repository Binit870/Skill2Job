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
  Trash2
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";

const StudentEditProfile = () => {

  const { refreshUser } = useContext(AuthContext);

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
    setForm({ ...form, profileImage: "" });
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
        .forEach((skill) =>
          formData.append("skills[]", skill)
        );

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

      await refreshUser(); // 🔥 ensures navbar updates instantly

      toast.success("Profile updated successfully 🚀");

    } catch (error) {
      toast.error("Update failed. Try again.");
    } finally {
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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
          Edit Student Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="flex items-center gap-2 mb-2 font-medium text-gray-600">
              <ImageIcon size={18} /> Upload Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {!croppedImage && form.profileImage && (
            <div className="flex justify-center">
              <img
                src={`http://localhost:5000${form.profileImage}`}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-purple-500 shadow-md"
              />
            </div>
          )}

          {croppedImage && (
            <div className="flex flex-col items-center space-y-3">
              <img
                src={URL.createObjectURL(croppedImage)}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-purple-500 shadow-md"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="flex items-center gap-1 text-red-500 text-sm"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
          )}

          <InputField icon={Phone} name="phone" placeholder="Phone" />
          <InputField icon={GraduationCap} name="college" placeholder="College" />
          <InputField icon={BookOpen} name="branch" placeholder="Branch" />
          <InputField icon={Calendar} name="graduationYear" placeholder="Graduation Year" type="number" />
          <InputField icon={Star} name="cgpa" placeholder="CGPA" />
          <InputField icon={Code} name="skills" placeholder="Skills (comma separated)" />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>

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

export default StudentEditProfile;