import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { MapPin, Briefcase, IndianRupee, Users, Calendar, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* =========================
      FETCH MY JOBS
  ========================= */
  const fetchJobs = async () => {
    try {
      const res = await api.get(
        "/api/jobs/recruiter/my-jobs",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(res.data.data || []);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  /* =========================
      CLOSE JOB
  ========================= */
  const handleClose = async (id) => {
    if (!window.confirm("Close this job posting? Candidates will no longer see it.")) return;
    try {
      const res = await api.patch(
        `/api/jobs/${id}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(jobs.map(job => job._id === id ? res.data.data : job));
      toast.success("Job closed successfully");
    } catch {
      toast.error("Failed to close job");
    }
  };

  /* =========================
      REOPEN JOB
  ========================= */
  const handleReopen = async (id) => {
    if (!window.confirm("Reopen this job? It will be visible to candidates again.")) return;
    try {
      const res = await api.patch(
        `/api/jobs/${id}/reopen`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(jobs.map(job => job._id === id ? res.data.data : job));
      toast.success("Job reopened successfully");
    } catch {
      toast.error("Failed to reopen job");
    }
  };

  /* =========================
      DELETE JOB
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this job? This cannot be undone.")) return;
    try {
      await api.delete(
        `/api/jobs/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(jobs.filter(job => job._id !== id));
      toast.success("Job deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =========================
      LOADING
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#60e618] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  /* =========================
      UI
  ========================= */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-green-200 px-4 py-5 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Posted Jobs</h1>
            <p className="text-gray-500 text-sm mt-1">
              {jobs.length} {jobs.length === 1 ? "listing" : "listings"} total
            </p>
          </div>
          <button
            onClick={() => navigate("/recruiter/post-job")}
            className="flex items-center gap-2 bg-[#359b05] hover:bg-[#2e6502] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm text-sm"
          >
            <PlusCircle size={18} />
            Post New Job
          </button>
        </div>
      </div>

      {/* ── Job Cards ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-20 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
              <Briefcase size={28} className="text-[#69e720]" />
            </div>
            <div className="text-center">
              <p className="text-gray-800 font-semibold text-lg">No jobs posted yet</p>
              <p className="text-gray-400 text-sm mt-1">Start by posting your first job listing</p>
            </div>
            <button
              onClick={() => navigate("/recruiter/post-job")}
              className="mt-2 bg-[#87ea2a] hover:bg-[#67db1f] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
            >
              Post a Job
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Status bar on top */}
                <div className={`h-1 w-full ${job.status === "Active" ? "bg-[#138808]" : "bg-red-600"}`} />

                <div className="p-5 md:p-6">

                  {/* Title + Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">{job.title}</h2>
                      <p className="text-gray-500 text-sm mt-0.5">{job.company}</p>
                    </div>
                    <span className={`self-start inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${job.status === "Active"
                        ? "bg-green-50 text-[#138808] ring-1 ring-green-200"
                        : "bg-red-100 text-red-500 ring-1 ring-red-200"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${job.status === "Active" ? "bg-[#138808]" : "bg-red-400"}`} />
                      {job.status}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 md:gap-5 mt-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} className="text-[#1e4203]" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase size={15} className="text-[#1e4203]" /> {job.jobType}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <IndianRupee size={15} className="text-[#1e4203]" />
                      {job.salaryMin && job.salaryMax
                        ? `${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}`
                        : "Not specified"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={15} className="text-[#1e4203]" />
                      {job.vacancies} {job.vacancies === 1 ? "vacancy" : "vacancies"}
                    </span>
                    {job.deadline && (
                      <span className="flex items-center gap-1.5">
                        <Calendar size={15} className="text-[#1e4203]" />
                        {new Date(job.deadline).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </span>
                    )}
                  </div>

                  {/* Skills */}
                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-green-50 text-[#2a4302] border border-green-200 text-xs font-medium px-2.5 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-gray-100 mt-5 pt-4">
                    <div className="flex flex-wrap gap-2">

                      {/* Edit */}
                      <button
                        onClick={() => navigate(`/recruiter/edit-job/${job._id}`)}
                        className="flex items-center gap-1.5 bg-[#078607] hover:bg-[#105503] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        Edit
                      </button>

                      {/* Close / Reopen toggle */}
                      {job.status === "Active" ? (
                        <button
                          onClick={() => handleClose(job._id)}
                          className="flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-200 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                          Close
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReopen(job._id)}
                          className="flex items-center gap-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 border border-green-200 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                          Reopen
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-500 border border-red-200 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        Delete
                      </button>

                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}