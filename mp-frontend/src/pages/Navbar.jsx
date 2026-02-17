import { Link, useLocation } from "react-router-dom";

const Navbar = () => {

  return (
    <nav className="w-full bg-white shadow-md px-8 py-4 flex items-center justify-between">
      
      {/* Left - Logo + Name */}
      <div className="flex items-center gap-3">
        <img 
          src="/logo.png" 
          alt="Skill2Job Logo" 
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-2xl font-bold text-blue-600">
          Skill2Job
        </h1>
      </div>

      {/* Middle - Navigation Links */}
      <div className="flex items-center gap-8 text-gray-700 font-medium">
        <Link to="/" className="hover:text-blue-600 transition">
          Home
        </Link>
        <Link to="/student-dashboard" className="hover:text-blue-600 transition">
          Student
        </Link>
        <Link to="/recruiter-dashboard" className="hover:text-blue-600 transition">
          Recruiter
        </Link>
      </div>

      {/* Right - Auth Buttons */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
        >
          Sign In
        </Link>

        <Link
          to="/signup"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
