import { Link } from "react-router-dom";
import { Briefcase, Home, Info, Star, Settings, Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="Skill2Job Logo"
          className="h-7 w-7 object-contain"
        />

        <h1 className="text-xl font-bold text-green-600">Skill2Job</h1>
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium text-sm">
        <Link to="/" className="flex items-center gap-1 hover:text-green-600 transition"><Home size={15} />Home</Link>
        <Link to="/about" className="flex items-center gap-1 hover:text-green-600 transition"><Info size={15} />About</Link>
        <Link to="/features" className="flex items-center gap-1 hover:text-green-600 transition"><Star size={15} />Features</Link>
        <Link to="/how-it-works" className="flex items-center gap-1 hover:text-green-600 transition"><Settings size={15} />How It Works</Link>
        <Link to="/contact" className="flex items-center gap-1 hover:text-green-600 transition"><Phone size={15} />Contact</Link>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center gap-3">
        <Link to="/login" className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition text-sm font-medium">
          Sign In
        </Link>
        <Link to="/signup" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
          Get Started
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
        {menuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg px-6 py-4 flex flex-col gap-3 z-50">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 py-2 border-b border-gray-50"><Home size={15} />Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 py-2 border-b border-gray-50"><Info size={15} />About</Link>
          <Link to="/features" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 py-2 border-b border-gray-50"><Star size={15} />Features</Link>
          <Link to="/how-it-works" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 py-2 border-b border-gray-50"><Settings size={15} />How It Works</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-gray-700 hover:text-green-600 py-2 border-b border-gray-50"><Phone size={15} />Contact</Link>
          <div className="flex gap-3 pt-2">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition text-sm font-medium">
              Sign In
            </Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;