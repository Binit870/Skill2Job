import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  ClipboardList,
  Sparkles,
  MessageSquare,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  GraduationCap,
} from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentSidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-gray-700 hover:bg-green-50 hover:text-gray-600";

  const activeClass =
    "bg-green-800 text-white font-semibold shadow-sm hover:!bg-green-900 hover:!text-white";

  const NAV_ITEMS = [
    { to: "/student-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/student/resume", icon: FileText, label: "My Resume" },
    { to: "/student/jobs", icon: Briefcase, label: "Find Jobs" },
    { to: "/student/my-applications", icon: ClipboardList, label: "My Applications" },
    
    { to: "/student/mock-interview", icon: MessageSquare, label: "Mock Interview" },
    { to: "/student/analyze", icon: TrendingUp, label: "Analytics" },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div
      className={`${
        !isMobile && collapsed ? "w-20" : "w-64"
      } h-full bg-white border-r border-gray-200 flex flex-col`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between border-b px-4">
        <NavLink
          to="/student-dashboard"
          onClick={handleNavClick}
          className="flex items-center gap-2"
        >
          {/* Logo */}
          <div className="bg-green-100 text-green-900 p-2 rounded-lg">
            <GraduationCap className="w-5 h-5" />
          </div>

          {/* Heading */}
          {(!collapsed || isMobile) && (
            <h2 className="text-xl font-bold text-green-900 tracking-tight">
              Skill<span className="text-green-500">2</span>Job
            </h2>
          )}
        </NavLink>

        {isMobile && (
          <button
            onClick={onMobileClose}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={isMobile ? onMobileClose : handleNavClick}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span>{label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="p-3 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div
        className={`hidden md:flex h-full relative transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-md z-10 hover:bg-green-50"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

        <SidebarContent />
      </div>

      {/* Mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          <div className="relative z-10">
            <SidebarContent isMobile />
          </div>
        </div>
      )}
    </>
  );
}