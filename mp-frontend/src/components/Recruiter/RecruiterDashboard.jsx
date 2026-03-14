import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Briefcase,
  TrendingUp,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */
const mockCandidates = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    matchScore: 94,
    cgpa: 3.8,
    experience: "2 years",
    skills: ["React", "TypeScript", "Node.js"],
    status: "shortlisted",
  },
  {
    id: 2,
    name: "Michael Johnson",
    email: "m.johnson@email.com",
    matchScore: 88,
    cgpa: 3.6,
    experience: "3 years",
    skills: ["Python", "Django", "PostgreSQL"],
    status: "pending",
  },
  {
    id: 3,
    name: "Emily Williams",
    email: "e.williams@email.com",
    matchScore: 82,
    cgpa: 3.9,
    experience: "1 year",
    skills: ["React", "Next.js", "Tailwind"],
    status: "interviewed",
  },
];

/* ---------------- BUTTON ---------------- */
function Button({ children, className = "", variant = "primary", ...props }) {
  const styles = {
    primary: "bg-black text-white hover:bg-black/90",
    outline: "border border-gray-300 hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- STATUS BADGE ---------------- */
function StatusBadge({ status }) {
  const map = {
    shortlisted: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    interviewed: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

/* ---------------- PAGE ---------------- */

  export default function RecruiterDashboard() {
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState("matchScore");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sorted = [...mockCandidates]
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];

      if (sortKey === "experience") {
        av = parseInt(a.experience);
        bv = parseInt(b.experience);
      }

      return sortOrder === "asc" ? av - bv : bv - av;
    });

  const SortIcon = ({ col }) =>
    sortKey === col ? (
      sortOrder === "asc" ? (
        <ChevronUp size={16} />
      ) : (
        <ChevronDown size={16} />
      )
    ) : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* HEADER */}
<div className="flex justify-between items-center mb-6">
  <div>
    <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
    <p className="text-gray-600">
      Manage candidates and hiring pipeline
    </p>
  </div>

  <Button onClick={() => navigate("/recruiter/my-jobs")}>
    <Briefcase size={16} /> Posted Jobs
  </Button>
</div>


      {/* SEARCH */}
      <div className="flex gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="pl-9 pr-4 py-2 border rounded-lg w-64"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter size={16} />
        </Button>
        <Button variant="outline">
          <Download size={16} /> Export
        </Button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                ["name", "Candidate"],
                ["matchScore", "Match"],
                ["cgpa", "CGPA"],
                ["experience", "Experience"],
              ].map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="p-3 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon col={key} />
                  </div>
                </th>
              ))}
              <th className="p-3">Skills</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((c, i) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.email}</div>
                </td>

                <td className="p-3 font-semibold">{c.matchScore}%</td>
                <td className="p-3">{c.cgpa}</td>
                <td className="p-3">{c.experience}</td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {c.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 text-xs bg-gray-200 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-3">
                  <StatusBadge status={c.status} />
                </td>

                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost">
                      <Eye size={16} />
                    </Button>
                    <Button variant="ghost">
                      <FileText size={16} />
                    </Button>
                    <Button variant="ghost">
                      <Calendar size={16} />
                    </Button>
                    <Button variant="ghost">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
