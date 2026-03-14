import { useEffect, useState } from "react";
import axios from "axios";
import JobDetails from "./JobDetails";

/* ── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&family=Literata:ital,wght@0,400;0,500;1,400&display=swap');

  * { box-sizing: border-box; }

  .fj-root {
    min-height: 100vh;
    background: #0d0f14;
    font-family: 'Cabinet Grotesk', sans-serif;
    color: #e2e8f0;
    padding: 0;
  }

  /* Topbar */
  .fj-topbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(13,15,20,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 18px 32px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .fj-topbar-title {
    font-size: 22px; font-weight: 800; color: #f8fafc; letter-spacing: -0.02em;
  }
  .fj-topbar-count {
    font-size: 13px; color: #64748b; font-weight: 500;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 5px 14px; border-radius: 20px;
  }

  /* Filter bar */
  .fj-filters {
    padding: 16px 32px;
    display: flex; gap: 10px; flex-wrap: wrap;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    background: #0d0f14;
  }
  .fj-filter-btn {
    padding: 7px 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);
    background: transparent; color: #94a3b8; font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s;
  }
  .fj-filter-btn:hover { border-color: #3b82f6; color: #93c5fd; }
  .fj-filter-btn.active {
    background: #1d4ed8; border-color: #1d4ed8; color: #fff;
    box-shadow: 0 0 16px rgba(29,78,216,0.35);
  }
  .fj-search {
    flex: 1; min-width: 200px; max-width: 320px;
    padding: 8px 14px; border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: #e2e8f0; font-family: 'Cabinet Grotesk', sans-serif; font-size: 13px;
    outline: none; transition: border-color 0.18s;
  }
  .fj-search::placeholder { color: #475569; }
  .fj-search:focus { border-color: #3b82f6; }

  /* Job list */
  .fj-list {
    padding: 24px 32px;
    display: flex; flex-direction: column; gap: 14px;
    max-width: 860px; margin: 0 auto;
  }

  /* Job card */
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fj-card {
    background: #141720;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 22px 24px;
    cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
    animation: cardIn 0.35s ease both;
    position: relative; overflow: hidden;
  }
  .fj-card::before {
    content: '';
    position: absolute; inset: 0; border-radius: 16px;
    background: linear-gradient(135deg, rgba(59,130,246,0.04), transparent);
    opacity: 0; transition: opacity 0.2s;
  }
  .fj-card:hover {
    border-color: rgba(59,130,246,0.4);
    box-shadow: 0 4px 32px rgba(29,78,216,0.12);
    transform: translateY(-2px);
  }
  .fj-card:hover::before { opacity: 1; }
  .fj-card.selected {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.15), 0 4px 32px rgba(29,78,216,0.2);
  }

  .fj-card-inner { display: flex; gap: 18px; align-items: flex-start; }

  /* Logo */
  .fj-logo {
    width: 52px; height: 52px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1); object-fit: cover;
    background: #1e2330; flex-shrink: 0;
  }

  /* Card body */
  .fj-card-body { flex: 1; min-width: 0; }
  .fj-card-title {
    font-size: 16px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.01em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .fj-card-company { font-size: 13.5px; color: #64748b; margin-top: 3px; font-weight: 500; }

  .fj-meta {
    display: flex; flex-wrap: wrap; gap: 14px; margin-top: 12px;
  }
  .fj-meta-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 12.5px; color: #64748b; font-weight: 500;
  }
  .fj-meta-item svg { opacity: 0.7; }

  /* Skills */
  .fj-skills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
  .fj-skill {
    padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600;
    background: rgba(59,130,246,0.08); color: #93c5fd;
    border: 1px solid rgba(59,130,246,0.15);
  }
  .fj-skill-more { font-size: 11.5px; color: #475569; padding: 3px 0; align-self: center; }

  /* Footer */
  .fj-card-footer {
    display: flex; align-items: center; justify-content: space-between; margin-top: 14px;
    padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);
  }
  .fj-footer-left { display: flex; gap: 16px; align-items: center; }
  .fj-posted { font-size: 12px; color: #475569; }
  .fj-deadline {
    font-size: 12px; font-weight: 600;
    padding: 3px 10px; border-radius: 20px;
  }
  .fj-deadline.urgent { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
  .fj-deadline.soon   { background: rgba(234,179,8,0.1); color: #fbbf24; border: 1px solid rgba(234,179,8,0.2); }
  .fj-deadline.ok     { background: rgba(34,197,94,0.1); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }

  .fj-salary {
    font-size: 13px; font-weight: 700; color: #4ade80;
    background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.15);
    padding: 4px 12px; border-radius: 20px;
  }

  .fj-view-btn {
    padding: 7px 18px; border-radius: 8px; border: none;
    background: #1d4ed8; color: #fff; font-family: 'Cabinet Grotesk', sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.18s; box-shadow: 0 2px 10px rgba(29,78,216,0.25);
  }
  .fj-view-btn:hover { background: #2563eb; box-shadow: 0 4px 18px rgba(29,78,216,0.4); transform: translateY(-1px); }

  /* Job type badge */
  .fj-type {
    display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; padding: 3px 9px; border-radius: 6px; margin-bottom: 8px;
  }
  .fj-type-full     { background: rgba(99,102,241,0.12); color: #a5b4fc; border: 1px solid rgba(99,102,241,0.2); }
  .fj-type-part     { background: rgba(168,85,247,0.12); color: #c4b5fd; border: 1px solid rgba(168,85,247,0.2); }
  .fj-type-intern   { background: rgba(234,179,8,0.12);  color: #fde68a; border: 1px solid rgba(234,179,8,0.2); }
  .fj-type-remote   { background: rgba(20,184,166,0.12); color: #5eead4; border: 1px solid rgba(20,184,166,0.2); }

  /* Empty */
  .fj-empty {
    text-align: center; padding: 80px 20px; color: #475569;
  }
  .fj-empty-icon { font-size: 48px; margin-bottom: 16px; }
  .fj-empty-text { font-size: 16px; font-weight: 600; color: #64748b; }
  .fj-empty-sub  { font-size: 13.5px; color: #334155; margin-top: 6px; }

  /* Loading */
  @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
  .fj-skeleton {
    background: linear-gradient(90deg, #1a1e2a 25%, #1e2330 50%, #1a1e2a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 8px;
  }
  @keyframes shimmer {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
`;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const typeClass = (t) => {
  if (t === "Full-Time") return "fj-type-full";
  if (t === "Part-Time") return "fj-type-part";
  if (t === "Internship") return "fj-type-intern";
  if (t === "Remote") return "fj-type-remote";
  return "fj-type-full";
};

const deadlineInfo = (deadline) => {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  if (days <= 3) return { label: `${days}d left`, cls: "urgent" };
  if (days <= 7) return { label: `${days}d left`, cls: "soon" };
  return { label: `${days}d left`, cls: "ok" };
};

const MetaIcon = ({ type }) => {
  if (type === "type") return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  if (type === "loc") return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  if (type === "exp") return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  return null;
};

/* ── Skeleton Card ───────────────────────────────────────────────────────── */
const SkeletonCard = ({ delay }) => (
  <div className="fj-card" style={{ animationDelay: `${delay}ms`, cursor: "default" }}>
    <div className="fj-card-inner">
      <div className="fj-skeleton" style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="fj-skeleton" style={{ height: 16, width: "55%", borderRadius: 6 }} />
        <div className="fj-skeleton" style={{ height: 13, width: "35%", borderRadius: 6 }} />
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          {[70, 90, 80].map((w, i) => (
            <div key={i} className="fj-skeleton" style={{ height: 12, width: w, borderRadius: 6 }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ── Main ────────────────────────────────────────────────────────────────── */
const JOB_TYPES = ["All", "Full-Time", "Part-Time", "Internship", "Remote"];

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
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
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
    <>
      <style>{styles}</style>
      <div className="fj-root">

        {/* Topbar */}
        <div className="fj-topbar">
          <span className="fj-topbar-title">Find Jobs</span>
          <span className="fj-topbar-count">
            {loading ? "Loading…" : `${filtered.length} listing${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Filters */}
        <div className="fj-filters">
          <input
            className="fj-search"
            placeholder="🔍  Search title, company, skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {JOB_TYPES.map((t) => (
            <button
              key={t}
              className={`fj-filter-btn${filter === t ? " active" : ""}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="fj-list">
          {loading ? (
            [0, 1, 2, 3].map((i) => <SkeletonCard key={i} delay={i * 80} />)
          ) : filtered.length === 0 ? (
            <div className="fj-empty">
              <div className="fj-empty-icon">🔭</div>
              <div className="fj-empty-text">No jobs found</div>
              <div className="fj-empty-sub">Try adjusting your search or filter</div>
            </div>
          ) : (
            filtered.map((job, idx) => {
              const dl = deadlineInfo(job.deadline);
              return (
                <div
                  key={job._id}
                  className={`fj-card${selectedJob?._id === job._id ? " selected" : ""}`}
                  style={{ animationDelay: `${idx * 55}ms` }}
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="fj-card-inner">
                    <img
                      src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                      alt={job.company}
                      className="fj-logo"
                    />

                    <div className="fj-card-body">
                      <div className={`fj-type ${typeClass(job.jobType)}`}>{job.jobType}</div>
                      <div className="fj-card-title">{job.title}</div>
                      <div className="fj-card-company">{job.company}</div>

                      <div className="fj-meta">
                        <span className="fj-meta-item">
                          <MetaIcon type="loc" />{job.location}
                        </span>
                        <span className="fj-meta-item">
                          <MetaIcon type="exp" />
                          {job.experienceMin}{job.experienceMax ? `–${job.experienceMax}` : "+"} yrs
                        </span>
                        {job.vacancies > 1 && (
                          <span className="fj-meta-item">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {job.vacancies} openings
                          </span>
                        )}
                      </div>

                      {job.skills?.length > 0 && (
                        <div className="fj-skills">
                          {job.skills.slice(0, 4).map((s, i) => (
                            <span key={i} className="fj-skill">{s}</span>
                          ))}
                          {job.skills.length > 4 && (
                            <span className="fj-skill-more">+{job.skills.length - 4} more</span>
                          )}
                        </div>
                      )}

                      <div className="fj-card-footer">
                        <div className="fj-footer-left">
                          <span className="fj-posted">
                            {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                          {dl && (
                            <span className={`fj-deadline ${dl.cls}`}>{dl.label}</span>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {(job.salaryMin || job.salaryMax) && (
                            <span className="fj-salary">
                              ₹{job.salaryMin ? `${(job.salaryMin / 1000).toFixed(0)}k` : "?"} – ₹{job.salaryMax ? `${(job.salaryMax / 1000).toFixed(0)}k` : "?"}
                            </span>
                          )}
                          <button
                            className="fj-view-btn"
                            onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
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
      </div>

      {/* Job Details Drawer */}
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </>
  );
}