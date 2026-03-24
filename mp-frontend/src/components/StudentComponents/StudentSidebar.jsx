import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Briefcase,
  TrendingUp, ChevronLeft, ChevronRight, LogOut, X,
} from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentSidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Auto-collapse on tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    if (window.innerWidth < 768) onMobileClose?.();
  };

const linkClass =
  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:text-gray-900";

const activeClass = "bg-black text-white hover:!bg-black hover:!text-white font-semibold";

  const sidebarContent = (
    <div className={`${collapsed ? "w-20" : "w-64"} h-full bg-white border-r transition-all duration-300 flex flex-col relative`}>
      {/* Toggle Button — hidden on mobile */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex absolute -right-3 top-6 bg-white border rounded-full p-1 shadow-md z-10"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Header */}
      <div className="h-16 flex items-center justify-between border-b px-4">
        {!collapsed ? (
          <h2 className="text-2xl font-bold text-blue-600">Skill2Job</h2>
        ) : (
          <span className="text-2xl font-bold text-blue-600">S</span>
        )}
        {/* Close button for mobile */}
        <button onClick={onMobileClose} className="md:hidden p-1 rounded-lg hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col gap-2 px-3 py-4">
        {[
          { to: "/student-dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
          { to: "/student/resume", icon: <FileText className="w-5 h-5" />, label: "My Resume" },
          { to: "/student/jobs", icon: <Briefcase className="w-5 h-5" />, label: "Find Jobs" },
          { to: "/student/my-applications", icon: <Briefcase className="w-5 h-5" />, label: "My Applications" },
          { to: "/student/jobs/recommend", icon: <Briefcase className="w-5 h-5" />, label: "Recommended Jobs" },
          { to: "/student/mock-interview", icon: <Briefcase className="w-5 h-5" />, label: "Mock Interview" },
          { to: "/student/analyze", icon: <TrendingUp className="w-5 h-5" />, label: "Analytics" },
        ].map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
          >
            {icon}
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="border-t" />
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

  return (
    <>
      {/* Desktop & Tablet: static sidebar */}
      <div className="hidden md:flex h-full">
        {sidebarContent}
      </div>

      {/* Mobile: overlay drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          {/* Drawer */}
          <div className="relative z-10 w-64 h-full">
            {/* Force expanded on mobile */}
            <div className="w-64 h-full bg-white border-r flex flex-col">
              <div className="h-16 flex items-center justify-between border-b px-4">
                <h2 className="text-2xl font-bold text-blue-600">Skill2Job</h2>
                <button onClick={onMobileClose} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-2 px-3 py-4">
                {[
                  { to: "/student-dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
                  { to: "/student/resume", icon: <FileText className="w-5 h-5" />, label: "My Resume" },
                  { to: "/student/jobs", icon: <Briefcase className="w-5 h-5" />, label: "Find Jobs" },
                  { to: "/student/my-applications", icon: <Briefcase className="w-5 h-5" />, label: "My Applications" },
                  { to: "/student/jobs/recommend", icon: <Briefcase className="w-5 h-5" />, label: "Recommended Jobs" },
                  { to: "/student/mock-interview", icon: <Briefcase className="w-5 h-5" />, label: "Mock Interview" },
                  { to: "/student/analyze", icon: <TrendingUp className="w-5 h-5" />, label: "Analytics" },
                ].map(({ to, icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onMobileClose}
                    className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}
                  >
                    {icon}
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
              <div className="border-t" />
              <div className="p-3">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-50 text-red-500 transition">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}