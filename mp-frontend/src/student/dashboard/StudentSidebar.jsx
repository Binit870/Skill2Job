import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
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
  Bookmark,
} from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/student-dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/student/resume", icon: FileText, label: "Resume Builder" },
  { to: "/student/jobs", icon: Briefcase, label: "Find Jobs" },
  { to: "/student/saved-jobs", icon: Bookmark, label: "Saved Jobs" },
  { to: "/student/my-applications", icon: ClipboardList, label: "My Applications" },
  { to: "/student/mock-interview", icon: MessageSquare, label: "Mock Interview" },
  { to: "/student/mock-assessment", icon: Sparkles, label: "Mock Assessment" },
  { to: "/student/analyze", icon: TrendingUp, label: "Analytics" },
];

const linkClass =
  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 text-ink/65 hover:bg-pine/8 hover:text-ink";

const activeClass =
  "bg-pine text-white font-semibold shadow-sm hover:!bg-pine hover:!text-white";

function SidebarContent({ collapsed, onMobileClose, handleLogout, isMobile = false }) {
  return (
    <div
      className={`${
        !isMobile && collapsed ? "w-20" : "w-64"
      } h-full bg-white border-r border-mist flex flex-col`}
    >
      <div className="h-16 flex items-center justify-between border-b border-mist px-4">
        <NavLink
          to="/student-dashboard"
          onClick={isMobile ? onMobileClose : undefined}
          className="flex items-center gap-2"
        >
          <div className="p-2 rounded-lg">
  <img
    src={logo}
    alt="Logo"
    className="w-7 h-7 object-contain"
  />
</div>
          {(!collapsed || isMobile) && (
            <h2 className="font-display text-xl font-bold text-ink tracking-tight">
              Skill<span className="text-gold">2</span>Job
            </h2>
          )}
        </NavLink>

        {isMobile && (
          <button onClick={onMobileClose} className="p-1 rounded-lg hover:bg-ink/5">
            <X className="w-5 h-5 text-ink/60" />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={isMobile ? onMobileClose : undefined}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : ""}`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span className="text-sm">{label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="p-3 border-t border-mist">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
          {(!collapsed || isMobile) && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}

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
    navigate("/");
  };

  return (
    <>
      {/* Desktop & Tablet */}
      <div
        className={`hidden md:flex h-full relative transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
        style={{ overflow: "visible" }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-white border border-mist rounded-full p-1 shadow-md z-10 hover:bg-pine/8 hover:text-pine transition-colors"
          style={{ zIndex: 50 }}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        <SidebarContent
          collapsed={collapsed}
          onMobileClose={onMobileClose}
          handleLogout={handleLogout}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <div className="relative z-10">
            <SidebarContent
              collapsed={false}
              isMobile
              onMobileClose={onMobileClose}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      )}
    </>
  );
}