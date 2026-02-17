import { useEffect, useState } from "react";
import axios from "axios";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/jobs/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/jobs/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (job) => {
    setEditingId(job._id);
    setEditData({
      ...job,
      skills: job.skills?.join(", ") || "",
      contactEmail: job.contact?.email || "",
    });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const updatedPayload = {
        ...editData,
        experienceMin: Number(editData.experienceMin),
        experienceMax: editData.experienceMax
          ? Number(editData.experienceMax)
          : undefined,
        salaryMin: editData.salaryMin
          ? Number(editData.salaryMin)
          : undefined,
        salaryMax: editData.salaryMax
          ? Number(editData.salaryMax)
          : undefined,
        vacancies: Number(editData.vacancies),
        skills: editData.skills
          .split(",")
          .map((s) => s.trim()),
        contact: {
          email: editData.contactEmail,
        },
      };

      const res = await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        updatedPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setJobs(
        jobs.map((job) =>
          job._id === id ? res.data : job
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) return <p className="p-6">Loading jobs...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold mb-8">My Posted Jobs</h2>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white shadow-md rounded-xl p-6 border">
            {editingId === job._id ? (
              <>
                <input name="title" value={editData.title} onChange={handleChange} className="border p-2 w-full mb-2" />
                <input name="company" value={editData.company} onChange={handleChange} className="border p-2 w-full mb-2" />
                <input name="companyWebsite" value={editData.companyWebsite || ""} onChange={handleChange} className="border p-2 w-full mb-2" />
                <textarea name="companyDescription" value={editData.companyDescription || ""} onChange={handleChange} className="border p-2 w-full mb-2" />
                <input name="location" value={editData.location} onChange={handleChange} className="border p-2 w-full mb-2" />

                <select name="jobType" value={editData.jobType} onChange={handleChange} className="border p-2 w-full mb-2">
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Remote</option>
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <input type="number" name="experienceMin" value={editData.experienceMin} onChange={handleChange} className="border p-2 mb-2" />
                  <input type="number" name="experienceMax" value={editData.experienceMax || ""} onChange={handleChange} className="border p-2 mb-2" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input type="number" name="salaryMin" value={editData.salaryMin || ""} onChange={handleChange} className="border p-2 mb-2" />
                  <input type="number" name="salaryMax" value={editData.salaryMax || ""} onChange={handleChange} className="border p-2 mb-2" />
                </div>

                <input type="number" name="vacancies" value={editData.vacancies} onChange={handleChange} className="border p-2 w-full mb-2" />

                <input type="date" name="deadline" value={editData.deadline ? editData.deadline.substring(0,10) : ""} onChange={handleChange} className="border p-2 w-full mb-2" />

                <input name="skills" value={editData.skills} onChange={handleChange} className="border p-2 w-full mb-2" />

                <textarea name="description" value={editData.description} onChange={handleChange} className="border p-2 w-full mb-2" />

                <input name="contactEmail" value={editData.contactEmail} onChange={handleChange} className="border p-2 w-full mb-2" />

                <select name="status" value={editData.status} onChange={handleChange} className="border p-2 w-full mb-4">
                  <option>Active</option>
                  <option>Closed</option>
                </select>

                <button
                  onClick={() => handleUpdate(job._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded mr-2"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Website:</strong> {job.companyWebsite}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Experience:</strong> {job.experienceMin} - {job.experienceMax || "+"} years</p>
                <p><strong>Salary:</strong> ₹{job.salaryMin} - ₹{job.salaryMax}</p>
                <p><strong>Vacancies:</strong> {job.vacancies}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <p><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}</p>
                <p><strong>Skills:</strong> {job.skills?.join(", ")}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Contact:</strong> {job.contact?.email}</p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleEditClick(job)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
