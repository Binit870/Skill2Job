import { useEffect, useState } from "react";
import { Bookmark, MapPin, ArrowRight, Users } from "lucide-react";
import API from "../../utils/api";
import JobDetails from "./JobDetails";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchSaved = async () => {
    try {
      const { data } = await API.get("/api/jobs/saved");
      setJobs((data.data || []).map((j) => ({ ...j, isSaved: true })));
    } catch (err) {
      console.error("Failed to load saved jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSaved(); }, []);

  const handleUnsave = async (jobId) => {
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
    try {
      await API.patch(`/api/jobs/${jobId}/save`);
    } catch (err) {
      console.error("Failed to unsave job:", err);
      fetchSaved(); // resync on failure
    }
  };

  return (
    <div className="bg-paper min-h-screen">
      <div className="bg-white border-b border-mist px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
            <Bookmark className="w-4 h-4 text-gold" fill="currentColor" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-ink leading-none tracking-tight">
              Saved Jobs
            </h1>
            <p className="text-[11px] text-ink/40 mt-0.5 font-medium">
              {loading ? "Loading…" : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-3">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-pine border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-ink/5 flex items-center justify-center mb-4">
              <Bookmark className="w-5 h-5 text-ink/35" strokeWidth={1.8} />
            </div>
            <h3 className="text-sm font-semibold text-ink/70">No saved jobs yet</h3>
            <p className="text-xs text-ink/40 mt-1 font-medium">
              Bookmark jobs while browsing to find them here later
            </p>
          </div>
        )}

        {!loading && jobs.map((job) => (
          <div
            key={job._id}
            onClick={() => setSelectedJob(job)}
            className="group relative bg-white rounded-2xl border border-mist cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-px hover:border-ink/10"
          >
            <div className="p-4 sm:p-5 flex gap-3 sm:gap-4 items-start">
              <img
                src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                alt={job.company}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-mist object-cover bg-paper/60 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] sm:text-base font-bold text-ink truncate leading-snug">
                  {job.title}
                </h3>
                <p className="text-xs text-ink/50 font-medium mt-0.5 truncate">{job.company}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-ink/40 font-medium">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> {job.location}
                    </span>
                  )}
                  {job.experienceMin !== undefined && (
                    <span className="flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" />
                      {job.experienceMin}{job.experienceMax ? `–${job.experienceMax}` : "+"} yrs
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); handleUnsave(job._id); }}
                  className="text-[11px] font-semibold text-ink/40 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-pine hover:bg-moss text-white text-xs font-semibold transition-colors"
                >
                  View <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedJob && (
        <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}
