import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BarChart,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function RecruiterSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100";

  const activeClass = "bg-black text-white";

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-full bg-white border-r transition-all duration-300 flex flex-col relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-white border rounded-full p-1 shadow-md z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Top Section — EXACT SAME HEIGHT AS NAVBAR */}
      <div className="h-16 flex items-center justify-center border-b">

        {!collapsed ? (
          <h2 className="text-2xl font-bold text-blue-600">
            Skill2Job
          </h2>
        ) : (
          <span className="text-2xl font-bold text-blue-600">S</span>
        )}
      </div>

      {/* Navigation Section */}
      <div className="flex-1 flex flex-col gap-2 px-3 py-4">
        <NavLink
          to="/recruiter-dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/recruiter/post-job"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Briefcase className="w-5 h-5" />
          {!collapsed && <span>Post Job</span>}
        </NavLink>

        <NavLink
          to="/recruiter-dashboard/candidates"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <Users className="w-5 h-5" />
          {!collapsed && <span>Candidates</span>}
        </NavLink>

        <NavLink
          to="/recruiter-dashboard/analytics"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <BarChart className="w-5 h-5" />
          {!collapsed && <span>Analytics</span>}
        </NavLink>
      </div>

      {/* Divider Before Logout */}
      <div className="border-t"></div>

      {/* Logout Footer */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-50 text-red-500 transition"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
