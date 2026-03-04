import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UploadCloud,
  FileText,
  PlusCircle,
  Edit,
  Trash2,
  Eye, // 👈 VIEW ICON ADD KIYA
} from "lucide-react";

const MyResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingResume, setExistingResume] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/resume",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data) {
        setExistingResume(res.data);
      }
    } catch (err) {
      console.log("No resume found");
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/resume/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Resume analyzed successfully 🚀");
      navigate("/student/analyze", { state: res.data });
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:5000/api/resume", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setExistingResume(null);
      toast.success("Resume deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl">

        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          Resume Center
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Manage, analyze, and build your professional resume
        </p>

        {/* Existing Resume Section */}
        {existingResume ? (
          <div className="border rounded-xl p-6 mb-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="text-indigo-600" />
                <div>
                  <p className="font-semibold">Your Resume</p>
                  <p className="text-sm text-gray-500">
                    {existingResume.fileName || existingResume.fullName || "Uploaded Resume"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {/* 👇 VIEW ICON ADD KIYA */}
                <button
                  onClick={() => navigate("/student/resume-view", { state: { resume: existingResume } })}
                  className="flex items-center gap-1 text-green-600 hover:text-green-800"
                  title="View Resume"
                >
                  <Eye size={18} />
                </button>

                <button
                  onClick={() => navigate("/student/resume-builder")}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  title="Edit Resume"
                >
                  <Edit size={16} /> Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800"
                  title="Delete Resume"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-3">
              You don't have a resume yet.
            </p>

            <button
              onClick={() => navigate("/student/resume-builder")}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg mx-auto hover:bg-green-700"
            >
              <PlusCircle size={18} />
              Create Resume
            </button>
          </div>
        )}

        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 transition mb-6">
          <label className="cursor-pointer block">
            <input
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />

            <UploadCloud size={40} className="mx-auto text-indigo-600 mb-3" />

            {file ? (
              <div>
                <p className="font-semibold text-green-600">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  Click to change file
                </p>
              </div>
            ) : (
              <>
                <p className="font-medium">
                  Drag & Drop your resume here
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse (PDF only)
                </p>
              </>
            )}
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Analyzing Resume..." : "Upload & Analyze"}
        </button>

        {loading && (
          <p className="text-center text-sm text-gray-500 mt-3">
            Processing your resume... ⏳
          </p>
        )}
      </div>
    </div>
  );
};

export default MyResume;