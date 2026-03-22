import { useEffect, useState } from "react";
import axios from "axios";
import { 
  MapPin, Briefcase, IndianRupee
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function MyJobs() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem("token");

  /* =========================
      FETCH MY JOBS
  ========================= */

  const fetchJobs = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/jobs/recruiter/my-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setJobs(res.data.jobs || []);

    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* =========================
        APPLY JOB
  ========================= */

  const handleApply = async (jobId) => {
    try {

      const res = await axios.post(
        `http://localhost:5000/api/applications/apply/${jobId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(res.data.message || "Applied Successfully!");

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  /* =========================
        EDIT JOB
  ========================= */

  const handleEditClick = (job) => {

    setEditingId(job._id);

    setEditData({
      title: job.title,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax
    });

  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (id) => {

    try {

      const res = await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        editData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setJobs(
        jobs.map(job => job._id === id ? res.data.job : job)
      );

      setEditingId(null);

      toast.success("Job updated!");

    } catch (error) {
      toast.error("Update failed");
    }

  };

  /* =========================
        DELETE JOB
  ========================= */

  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure?")) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/jobs/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setJobs(jobs.filter(job => job._id !== id));

      toast.success("Job deleted");

    } catch (error) {
      toast.error("Delete failed");
    }

  };

  /* =========================
        LOADING
  ========================= */

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-blue-600 animate-pulse text-xl">
        Loading Jobs...
      </div>
    );
  }

  /* =========================
        UI
  ========================= */

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold mb-6">
          My Posted Jobs
        </h2>

        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border">
            No jobs posted yet.
          </div>
        ) : (

          jobs.map((job) => (

            <div
              key={job._id}
              className="bg-white p-6 rounded-xl shadow mb-6"
            >

              {editingId === job._id ? (

                <div className="space-y-4">

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Job Title
                    </label>
                    <input
                      name="title"
                      value={editData.title}
                      onChange={handleChange}
                      className="border p-2 w-full rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <input
                      name="location"
                      value={editData.location}
                      onChange={handleChange}
                      className="border p-2 w-full rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Minimum Salary
                    </label>
                    <input
                      name="salaryMin"
                      type="number"
                      value={editData.salaryMin}
                      onChange={handleChange}
                      className="border p-2 w-full rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Maximum Salary
                    </label>
                    <input
                      name="salaryMax"
                      type="number"
                      value={editData.salaryMax}
                      onChange={handleChange}
                      className="border p-2 w-full rounded"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">

                    <button
                      onClick={() => handleUpdate(job._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              ) : (

                <>
                  <h3 className="text-xl font-bold">
                    {job.title}
                  </h3>

                  <p className="text-gray-600">
                    {job.company}
                  </p>

                  <div className="flex gap-6 mt-3 text-sm text-gray-500">

                    <span className="flex items-center gap-1">
                      <MapPin size={16}/> {job.location}
                    </span>

                    <span className="flex items-center gap-1">
                      <Briefcase size={16}/> {job.jobType}
                    </span>

                    <span className="flex items-center gap-1">
                      <IndianRupee size={16}/> {job.salaryMin} - {job.salaryMax}
                    </span>

                  </div>

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() => handleApply(job._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Apply
                    </button>

                    <button
                      onClick={() => handleEditClick(job)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(job._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>

                  </div>
                </>

              )}

            </div>

          ))

        )}

      </div>

    </div>
  );
}