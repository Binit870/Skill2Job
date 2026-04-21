import { useEffect, useState } from "react";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, TrendingUp, Plus, ChevronRight } from "lucide-react";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        const h = { Authorization: `Bearer ${token}` };
        const [jobsRes, appsRes] = await Promise.all([
          API.get("/api/jobs/recruiter/my-jobs", { headers: h }),
          API.get("/api/applications/recruiter", { headers: h }),
        ]);
        setJobs(jobsRes.data.data || []);
        setApplications(appsRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalJobs = jobs.length;
  const totalApplications = applications.length;
  const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
  const pending = applications.filter((a) => a.status === "Pending").length;

  const statusStyle = (status) => {
    if (status === "Shortlisted")
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (status === "Rejected")
      return "bg-red-50 text-red-600 border border-red-200";
    return "bg-gray-100 text-gray-500 border border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#0f4c35] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* HEADER */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 sm:px-7 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-[#0f4c35] tracking-widest uppercase mb-1">
              Recruiter Dashboard
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Hiring Overview</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Manage your jobs and candidates</p>
          </div>
          <button
            onClick={() => navigate("/recruiter/post-job")}
            className="self-start sm:self-auto flex items-center gap-2 bg-[#0f4c35] hover:bg-[#0a3525] active:scale-95 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Plus size={15} />
            Post a Job
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard title="Total Jobs" value={totalJobs} icon={Briefcase} />
          <StatCard title="Applications" value={totalApplications} icon={Users} />
          <StatCard title="Shortlisted" value={shortlisted} icon={TrendingUp} highlight />
          <StatCard title="Pending Review" value={pending} icon={Users} />
        </div>

        {/* QUICK ACTIONS */}
        <div>
          <h2 className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <ActionCard
              title="Manage Jobs"
              desc="View, edit or close your postings"
              icon={Briefcase}
              onClick={() => navigate("/recruiter/my-jobs")}
            />
            <ActionCard
              title="View Applications"
              desc="Review candidates and update status"
              icon={Users}
              onClick={() => navigate("/recruiter/candidates-applications")}
            />
            <ActionCard
              title="Company Profile"
              desc="Update your company information"
              icon={TrendingUp}
              onClick={() => navigate("/recruiter/edit-profile")}
            />
          </div>
        </div>

        {/* RECENT APPLICATIONS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 sm:px-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm sm:text-base font-semibold text-gray-800">Recent Applications</h2>
            <button
              onClick={() => navigate("/recruiter/candidates-applications")}
              className="text-xs text-[#0f4c35] font-semibold hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight size={13} />
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-400">
              No applications yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {applications.slice(0, 5).map((app) => {
                const user = app.applicant || app.applicantSnapshot || {};
                return (
                  <div
                    key={app._id}
                    className="flex items-center justify-between px-5 sm:px-6 py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f0f7f4] text-[#0f4c35] flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">
                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{app.job?.title || "—"}</p>
                      </div>
                    </div>
                    <span
                      className={`ml-3 shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full ${statusStyle(app.status)}`}
                    >
                      {app.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, highlight }) {
  return (
    <div
      className={`rounded-2xl border shadow-sm p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow duration-200 ${
        highlight ? "bg-[#0f4c35] border-[#0a3525]" : "bg-white border-gray-100"
      }`}
    >
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
          highlight ? "bg-white/10" : "bg-[#f0f7f4]"
        }`}
      >
        <Icon size={17} className={highlight ? "text-white" : "text-[#0f4c35]"} />
      </div>
      <div>
        <p className={`text-[11px] sm:text-xs font-medium ${highlight ? "text-green-200" : "text-gray-400"}`}>
          {title}
        </p>
        <p className={`text-xl sm:text-2xl font-bold leading-tight ${highlight ? "text-white" : "text-gray-900"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon: Icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 cursor-pointer hover:shadow-md hover:border-gray-200 active:scale-[0.98] transition-all duration-200 group flex items-center gap-4"
    >
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#f0f7f4] flex items-center justify-center shrink-0 group-hover:bg-[#0f4c35] transition-colors duration-200">
        <Icon size={17} className="text-[#0f4c35] group-hover:text-white transition-colors duration-200" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#0f4c35] transition-colors truncate">
          {title}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{desc}</p>
      </div>
      <ChevronRight
        size={14}
        className="text-gray-300 group-hover:text-[#0f4c35] shrink-0 transition-colors"
      />
    </div>
  );
}