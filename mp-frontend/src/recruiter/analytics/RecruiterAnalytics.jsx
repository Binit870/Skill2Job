import { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, Cell,
} from "recharts";
import {
  BarChart3, TrendingUp, Clock, Target, Briefcase, Users,
  Trophy, ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const FUNNEL_ORDER = ["Pending", "Reviewed", "Shortlisted", "Rejected", "Hired"];
const FUNNEL_COLORS = {
  Pending: "#9a9e96",
  Reviewed: "#3b82f6",
  Shortlisted: "#C99A3B",
  Rejected: "#ef4444",
  Hired: "#0E6B52",
};

function StatCard({ icon: Icon, label, value, accent = "pine" }) {
  const styles = {
    pine: { bg: "bg-pine/8", text: "text-pine" },
    gold: { bg: "bg-gold/10", text: "text-gold" },
  }[accent];
  return (
    <div className="bg-white rounded-2xl border border-mist shadow-card p-5 flex items-center gap-3.5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.bg}`}>
        <Icon className={`w-4.5 h-4.5 ${styles.text}`} size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink/45 font-medium truncate">{label}</p>
        <p className="text-xl font-bold text-ink leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default function RecruiterAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/api/recruiter/analytics/overview");
        setData(data.data);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="w-8 h-8 border-2 border-pine border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-ink/40 text-sm">
        Couldn't load analytics right now.
      </div>
    );
  }

  const funnelData = FUNNEL_ORDER.map((status) => ({ status, count: data.funnel[status] || 0 }));
  const trendData = (data.trend || []).map((t) => ({
    date: new Date(t._id).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    count: t.count,
  }));

  return (
    <div className="min-h-screen bg-paper/60 p-3 md:p-6">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-mist shadow-card px-6 py-5">
          <p className="text-xs font-semibold text-pine tracking-widest uppercase mb-1">
            Hiring Analytics
          </p>
          <h1 className="font-display text-2xl font-bold text-ink leading-tight">
            Your hiring performance
          </h1>
          <p className="text-sm text-ink/40 mt-0.5">
            Across {data.jobs.total} job{data.jobs.total !== 1 ? "s" : ""} · {data.totalApplications} total applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={Briefcase} label="Active Jobs" value={data.jobs.active} accent="pine" />
          <StatCard icon={Users} label="Total Applications" value={data.totalApplications} accent="pine" />
          <StatCard icon={Trophy} label="Hire Rate" value={`${data.hireRate}%`} accent="gold" />
          <StatCard
            icon={Clock}
            label="Avg. Time to Hire"
            value={data.avgTimeToHireDays !== null ? `${data.avgTimeToHireDays}d` : "—"}
            accent="pine"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Funnel */}
          <div className="bg-white rounded-2xl border border-mist shadow-card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-4 h-4 text-pine" />
              <h2 className="font-display text-sm font-bold text-ink">Application Funnel</h2>
            </div>
            {data.totalApplications === 0 ? (
              <p className="text-sm text-ink/40 text-center py-10">No applications yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={funnelData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid horizontal={false} stroke="#E7E4DA" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9a9e96" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="status" type="category" width={80} tick={{ fontSize: 12, fill: "#2B322D" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #E7E4DA", fontSize: 12 }}
                    cursor={{ fill: "rgba(14,107,82,0.06)" }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {funnelData.map((entry) => (
                      <Cell key={entry.status} fill={FUNNEL_COLORS[entry.status]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Trend */}
          <div className="bg-white rounded-2xl border border-mist shadow-card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-pine" />
              <h2 className="font-display text-sm font-bold text-ink">Applications — Last 30 Days</h2>
            </div>
            {trendData.length === 0 ? (
              <p className="text-sm text-ink/40 text-center py-10">No recent activity</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trendData}>
                  <CartesianGrid vertical={false} stroke="#E7E4DA" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9a9e96" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9a9e96" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7E4DA", fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke="#0E6B52" strokeWidth={2.5} dot={{ r: 3, fill: "#0E6B52" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top jobs */}
        <div className="bg-white rounded-2xl border border-mist shadow-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 sm:px-6 py-4 border-b border-mist">
            <BarChart3 className="w-4 h-4 text-pine" />
            <h2 className="font-display text-sm font-bold text-ink">Top Performing Jobs</h2>
          </div>
          {data.topJobs.length === 0 ? (
            <p className="text-sm text-ink/40 text-center py-10">No jobs posted yet</p>
          ) : (
            <div className="divide-y divide-mist">
              {data.topJobs.map((job) => (
                <button
                  key={job._id}
                  onClick={() => navigate("/recruiter/my-jobs")}
                  className="w-full flex items-center justify-between px-5 sm:px-6 py-3.5 hover:bg-ink/5 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{job.title}</p>
                    <p className="text-xs text-ink/40 mt-0.5">
                      {job.views || 0} views · {job.applications || 0} applications
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${job.status === "Active" ? "bg-pine/8 text-pine border-pine/20" : "bg-ink/5 text-ink/50 border-mist"}`}>
                      {job.status}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-ink/25" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
