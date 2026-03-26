import { useEffect, useState } from "react";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, TrendingUp } from "lucide-react";

export default function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
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

  // 📊 Stats
  const totalJobs = jobs.length;
  const totalApplications = applications.length;
  const shortlisted = applications.filter(a => a.status === "Shortlisted").length;
  const pending = applications.filter(a => a.status === "Pending").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
          <p className="text-gray-500">Overview of your hiring activity</p>
        </div>

        <button
          onClick={() => navigate("/recruiter/my-jobs")}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Briefcase size={16} /> Posted Jobs
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Jobs" value={totalJobs} icon={<Briefcase />} />
        <Card title="Applications" value={totalApplications} icon={<Users />} />
        <Card title="Shortlisted" value={shortlisted} icon={<TrendingUp />} />
        <Card title="Pending" value={pending} icon={<Users />} />
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-3 gap-4">

        <ActionCard
          title="Manage Jobs"
          desc="View, edit or delete your job posts"
          onClick={() => navigate("/recruiter/post-job")}
        />

        <ActionCard
          title="View Applications"
          desc="Review candidates and update status"
          onClick={() => navigate("/recruiter/candidates-applications")}
        />

        <ActionCard
          title="Profile"
          desc="Update your company information"
          onClick={() => navigate("/recruiter/edit-profile")}
        />

      </div>

      {/* RECENT APPLICATIONS */}
      <div className="mt-8 bg-white rounded-xl border p-5">
        <h2 className="text-lg font-bold mb-4">Recent Applications</h2>

        {applications.slice(0, 5).map((app) => {
          const user = app.applicant || app.applicantSnapshot || {};

          return (
            <div key={app._id} className="flex justify-between py-2 border-b">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{app.job?.title}</p>
              </div>
              <span className="text-sm">{app.status}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Card({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl border flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-xl font-bold">{value}</h2>
      </div>
      <div className="text-gray-400">{icon}</div>
    </div>
  );
}

function ActionCard({ title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-xl border cursor-pointer hover:shadow-md"
    >
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </div>
  );
}