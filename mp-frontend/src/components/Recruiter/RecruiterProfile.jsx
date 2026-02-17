import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RecruiterProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
    industry: "",
    companyLocation: "",
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
        companyName: user.companyName || "",
        companyWebsite: user.companyWebsite || "",
        companyDescription: user.companyDescription || "",
        industry: user.industry || "",
        companyLocation: user.companyLocation || "",
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
        "http://localhost:5000/api/profile/recruiter",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Company profile updated!");
      navigate("/recruiter-dashboard");

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
          Company Profile Setup
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input label="Company Name" name="companyName" value={form.companyName} onChange={handleChange} />
          <Input label="Company Website" name="companyWebsite" value={form.companyWebsite} onChange={handleChange} />
          <Input label="Industry" name="industry" value={form.industry} onChange={handleChange} />
          <Input label="Location" name="companyLocation" value={form.companyLocation} onChange={handleChange} />

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Company Description
            </label>
            <textarea
              required
              name="companyDescription"
              value={form.companyDescription}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
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
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      {...props}
    />
  </div>
);

export default RecruiterProfile;
