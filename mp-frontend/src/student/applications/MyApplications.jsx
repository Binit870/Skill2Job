import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Briefcase, Clipboard } from "lucide-react";

import SkeletonCard    from "./SkeletonCard";
import WithdrawModal   from "./WithdrawModal";
import StatusTabs      from "./StatusTabs";
import ApplicationCard from "./ApplicationCard";

export default function MyApplications() {
  const [applications, setApplications]     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [tab, setTab]                       = useState("All");
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawing, setWithdrawing]       = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await API.get("/api/applications/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/api/applications/${withdrawTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications((prev) => prev.filter((a) => a._id !== withdrawTarget._id));
      setWithdrawTarget(null);
    } catch (e) {
      console.error(e);
    } finally {
      setWithdrawing(false);
    }
  };

  const counts = { All: applications.length };
  applications.forEach((a) => {
    counts[a.status] = (counts[a.status] || 0) + 1;
  });

  const filtered =
    tab === "All" ? applications : applications.filter((a) => a.status === tab);

  return (
    <div className="min-h-screen overflow-y-auto bg-white">

      {/* ── Topbar ── */}
      <div className="bg-white border-b border-mist px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-pine flex items-center justify-center shadow-sm shadow-pine/20">
            <Briefcase size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-base sm:text-lg font-bold text-ink tracking-tight leading-none">
              My Applications
            </h1>
            <p className="text-[11px] text-ink/40 mt-0.5 hidden sm:block">
              Track all your job applications
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-pine bg-pine/8 border border-pine/20 px-3 sm:px-3.5 py-1.5 rounded-full">
          {loading ? "—" : `${applications.length} total`}
        </span>
      </div>

      {/* ── Status Tabs ── */}
      <StatusTabs tab={tab} setTab={setTab} counts={counts} />

      {/* ── Cards ── */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-3">

        {loading ? (
          [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)

        ) : filtered.length === 0 ? (
          <div className="text-center py-20 sm:py-28 flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-pine/8 border border-pine/15 flex items-center justify-center mb-4">
              <Clipboard size={24} className="text-pine/50" />
            </div>
            <h3 className="text-base font-bold text-ink/70">
              {tab === "All" ? "No applications yet" : `No ${tab} applications`}
            </h3>
            <p className="text-sm text-ink/40 mt-1">
              {tab === "All"
                ? "Start applying for jobs to track them here"
                : "Switch to another tab"}
            </p>
          </div>

        ) : (
          filtered.map((app, idx) => (
            <ApplicationCard
              key={app._id}
              app={app}
              idx={idx}
              onWithdraw={setWithdrawTarget}
            />
          ))
        )}
      </div>

      {/* ── Withdraw Modal ── */}
      {withdrawTarget && (
        <WithdrawModal
          app={withdrawTarget}
          onConfirm={handleWithdraw}
          onClose={() => setWithdrawTarget(null)}
          loading={withdrawing}
        />
      )}
    </div>
  );
}
