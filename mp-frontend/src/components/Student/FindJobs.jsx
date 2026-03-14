import { useEffect, useState } from "react";
import axios from "axios";
import JobDetails from "./JobDetails";

const JOB_TYPES = ["All", "Full-Time", "Part-Time", "Internship", "Remote"];

const typeStyles = {
  "Full-Time":  "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "Part-Time":  "bg-purple-100 text-purple-700 border border-purple-200",
  "Internship": "bg-yellow-100 text-yellow-700 border border-yellow-200",
  "Remote":     "bg-teal-100 text-teal-700 border border-teal-200",
};

const deadlineInfo = (deadline) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (days < 0) return null;
  if (days <= 3) return { label: `${days}d left`, cls: "bg-red-100 text-red-600 border border-red-200" };
  if (days <= 7) return { label: `${days}d left`, cls: "bg-yellow-100 text-yellow-600 border border-yellow-200" };
  return { label: `${days}d left`, cls: "bg-green-100 text-green-600 border border-green-200" };
};

/* Skeleton */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
    <div className="flex gap-4">
      <div className="w-[52px] h-[52px] rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 flex flex-col gap-3">
        <div className="h-4 w-1/2 rounded-md bg-gray-200" />
        <div className="h-3 w-1/3 rounded-md bg-gray-200" />
        <div className="flex gap-2 mt-1">
          <div className="h-3 w-16 rounded-md bg-gray-200" />
          <div className="h-3 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  </div>
);

export default function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.jobs)
          ? raw.jobs
          : Array.isArray(raw?.data)
          ? raw.data
          : [];

        setJobs(list);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) => {
    const matchType = filter === "All" || j.jobType === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      j.title?.toLowerCase().includes(q) ||
      j.company?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q) ||
      j.skills?.some((s) => s.toLowerCase().includes(q));

    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Topbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-8 py-[18px] flex items-center justify-between">
        <span className="text-[22px] font-extrabold text-gray-900 tracking-tight">Find Jobs</span>
        <span className="text-[13px] font-medium text-gray-600 bg-gray-100 border border-gray-200 px-[14px] py-[5px] rounded-full">
          {loading ? "Loading…" : `${filtered.length} listing${filtered.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 px-8 py-4 border-b border-gray-200 bg-white">
        <input
          className="flex-1 min-w-[200px] max-w-xs px-[14px] py-2 rounded-full border border-gray-300 bg-white text-gray-800 text-[13px] placeholder-gray-400 outline-none focus:border-blue-500 transition-colors"
          placeholder="🔍  Search title, company, skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {JOB_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-[7px] rounded-full text-[13px] font-medium border transition-all ${
              filter === t
                ? "bg-blue-600 border-blue-600 text-white shadow-md"
                : "border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 bg-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="max-w-[860px] mx-auto px-8 py-6 flex flex-col gap-[14px]">

        {loading ? (
          [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)

        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">🔭</div>
            <div className="text-base font-semibold text-gray-600">No jobs found</div>
            <div className="text-[13.5px] text-gray-400 mt-1.5">Try adjusting your search or filter</div>
          </div>

        ) : (
          filtered.map((job, idx) => {
            const dl = deadlineInfo(job.deadline);
            const isSelected = selectedJob?._id === job._id;

            return (
              <div
                key={job._id}
                onClick={() => setSelectedJob(job)}
                className={`relative bg-white rounded-2xl p-[22px] cursor-pointer
                  border transition-all duration-200 overflow-hidden
                  hover:-translate-y-0.5 hover:shadow-lg
                  hover:border-blue-400
                  ${
                    isSelected
                      ? "border-blue-500 shadow-md"
                      : "border-gray-200"
                  }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex gap-[18px] items-start">

                  <img
                    src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={job.company}
                    className="w-[52px] h-[52px] rounded-xl border border-gray-200 object-cover bg-gray-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">

                    <span className={`inline-block text-[11px] font-bold uppercase tracking-[0.05em] px-[9px] py-[3px] rounded-[6px] mb-2 ${typeStyles[job.jobType] || typeStyles["Full-Time"]}`}>
                      {job.jobType}
                    </span>

                    <div className="text-base font-bold text-gray-900 truncate leading-snug">{job.title}</div>
                    <div className="text-[13.5px] text-gray-600 font-medium mt-[3px]">{job.company}</div>

                    <div className="flex flex-wrap gap-[14px] mt-3">
                      <span className="text-[12.5px] text-gray-600 font-medium">📍 {job.location}</span>
                      <span className="text-[12.5px] text-gray-600 font-medium">
                        🧑‍💻 {job.experienceMin}{job.experienceMax ? `–${job.experienceMax}` : "+"} yrs
                      </span>
                      {job.vacancies > 1 && (
                        <span className="text-[12.5px] text-gray-600 font-medium">
                          👥 {job.vacancies} openings
                        </span>
                      )}
                    </div>

                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.slice(0, 4).map((s, i) => (
                          <span key={i} className="text-[11.5px] font-semibold px-2.5 py-[3px] rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="text-[11.5px] text-gray-500 self-center">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-[14px] pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">
                          {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                        {dl && (
                          <span className={`text-xs font-semibold px-2.5 py-[3px] rounded-full ${dl.cls}`}>
                            {dl.label}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {(job.salaryMin || job.salaryMax) && (
                          <span className="text-[13px] font-bold text-green-700 bg-green-100 border border-green-200 px-3 py-1 rounded-full">
                            ₹{job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : "?"}–₹{job.salaryMax ? `${(job.salaryMax / 1000).toFixed(0)}k` : "?"}
                          </span>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                          className="px-[18px] py-[7px] rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-500 transition-all border-none"
                        >
                          View →
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedJob && (
        <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}