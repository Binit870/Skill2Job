import { LogOut, User, Search, ChevronDown } from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RecruiterNavbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-6">
      
      {/* Search Bar */}
      <div className="relative w-1/3">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search candidates, jobs..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Profile Section */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {user?.company || "Recruiter"}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg py-2">
            <button
              onClick={() => navigate("/recruiter-dashboard/profile")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
