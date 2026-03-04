import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import {
  Building2,
  Globe,
  Briefcase,
  MapPin,
  FileText,
  Image as ImageIcon,
  Save,
  Trash2
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";

const RecruiterEditProfile = () => {

  const { refreshUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    industry: "",
    companyLocation: "",
    companyLogo: "",
  });

  const [loading, setLoading] = useState(false);

  // Image states
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

      await refreshUser(); // 🔥 THIS FIXES NAVBAR UPDATE

      toast.success("Company profile updated successfully 🚀");

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
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Edit Company Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="flex items-center gap-2 mb-2 font-medium text-gray-600">
              <ImageIcon size={18} /> Upload Company Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {!croppedImage && form.companyLogo && (
            <div className="flex justify-center">
              <img
                src={`http://localhost:5000${form.companyLogo}`}
                alt="Company Logo"
                className="w-28 h-28 rounded-xl object-cover border-4 border-indigo-500 shadow-md"
              />
            </div>
          )}

          {croppedImage && (
            <div className="flex flex-col items-center space-y-3">
              <img
                src={URL.createObjectURL(croppedImage)}
                alt="Preview"
                className="w-28 h-28 rounded-xl object-cover border-4 border-indigo-500 shadow-md"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="flex items-center gap-1 text-red-500 text-sm"
              >
                <Trash2 size={16} /> Remove Logo
              </button>
            </div>
          )}

          <InputField icon={Building2} name="companyName" placeholder="Company Name" />
          <InputField icon={Globe} name="companyWebsite" placeholder="Company Website" />
          <InputField icon={Briefcase} name="industry" placeholder="Industry" />
          <InputField icon={MapPin} name="companyLocation" placeholder="Company Location" />

          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea
              name="companyDescription"
              value={form.companyDescription}
              onChange={handleChange}
              placeholder="Company Description"
              rows="4"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-200 disabled:opacity-50"
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

export default RecruiterEditProfile;