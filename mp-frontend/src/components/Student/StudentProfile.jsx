import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StudentProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    college: "",
    branch: "",
    graduationYear: "",
    cgpa: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);

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
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.put(
        "http://localhost:5000/api/profile/student",
        {
          ...form,
          skills: form.skills.split(",").map((s) => s.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Profile updated successfully!");
      navigate("/student-dashboard");

    } catch (error) {
      toast.error("Failed to update profile");
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

          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="College" name="college" value={form.college} onChange={handleChange} />
          <Input label="Branch" name="branch" value={form.branch} onChange={handleChange} />
          <Input label="Graduation Year" name="graduationYear" value={form.graduationYear} onChange={handleChange} />
          <Input label="CGPA" name="cgpa" value={form.cgpa} onChange={handleChange} />
          <Input label="Skills (comma separated)" name="skills" value={form.skills} onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      required
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
      {...props}
    />
  </div>
);

export default StudentProfile;
