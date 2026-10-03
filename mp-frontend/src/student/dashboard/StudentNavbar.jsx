import { LogOut, User, Search, ChevronDown, Menu } from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../../components/NotificationBell";

export default function StudentNavbar({ onMenuClick }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => { logout(); navigate("/"); };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full h-16 bg-white border-b border-mist flex items-center justify-between px-4 md:px-6 gap-4">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-ink/5 flex-shrink-0"
      >
        <Menu className="w-5 h-5 text-ink/70" />
      </button>

      <div className="relative flex-1 max-w-xs md:max-w-sm lg:w-1/3">
        <Search className="absolute left-3 top-3 w-4 h-4 text-ink/35" />
        <input
          type="text"
          placeholder="Search jobs, recruiters..."
          className="w-full pl-10 pr-4 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-pine/30 focus:border-pine text-sm text-ink placeholder:text-ink/40 transition-colors"
        />
      </div>

      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <div className="flex items-center gap-1">
          <NotificationBell />
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 cursor-pointer">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-pine flex items-center justify-center">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <span className="hidden sm:block text-sm font-medium text-ink/75">
            {user?.name || "Student"}
          </span>
          <ChevronDown className="w-4 h-4 text-ink/45" />
        </button>
        </div>

        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white border border-mist rounded-xl shadow-card py-2 z-50">
            <button onClick={() => navigate("/student/edit-profile")} className="w-full text-left px-4 py-2 hover:bg-pine/8 text-sm text-ink/75 hover:text-ink transition-colors">
              Edit Profile
            </button>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 transition-colors">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}