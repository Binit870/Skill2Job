import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cropper from "react-easy-crop";
import { AuthContext } from "../../context/AuthContext";

const StudentProfile = () => {
  const navigate = useNavigate();
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

    } catch (error) {
      console.error(error);
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

      await refreshUser(); // 🔥 updates navbar instantly

      toast.success("Profile updated!");
      navigate("/student-dashboard");

    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Existing Image */}
          {!croppedImage && form.profileImage && (
            <div className="flex justify-center">
              <img
                src={`http://localhost:5000${form.profileImage}`}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
              />
            </div>
          )}

          {/* Cropped Preview */}
          {croppedImage && (
            <div className="flex flex-col items-center space-y-3">
              <img
                src={URL.createObjectURL(croppedImage)}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-4 py-1 bg-red-500 text-white rounded-full text-sm"
              >
                Remove Image
              </button>
            </div>
          )}

          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="College" name="college" value={form.college} onChange={handleChange} />
          <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} />
          <Input label="Graduation Year" name="graduationYear" value={form.graduationYear} onChange={handleChange} />
          <Input label="CGPA" name="cgpa" value={form.cgpa} onChange={handleChange} />
          <Input label="Skills (comma separated)" name="skills" value={form.skills} onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg"
          >
            {loading ? "Saving..." : "Save & Continue"}
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

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      required
      className="w-full border rounded-lg px-4 py-2"
      {...props}
    />
  </div>
);

export default StudentProfile;