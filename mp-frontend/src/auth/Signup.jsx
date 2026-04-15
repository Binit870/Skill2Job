import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaBriefcase, FaUserTie, FaGraduationCap, FaArrowRight,
  FaSearch, FaFileAlt, FaStar, FaHandshake,
  FaChartLine, FaLaptopCode, FaMedal,
  FaBuilding, FaRocket, FaClipboardList,
} from "react-icons/fa";

/* Orbiting bubbles */
const BUBBLES = [
  { Icon: FaGraduationCap, top: "10%", left: "55%", size: 46, delay: "0s" },
  { Icon: FaFileAlt, top: "25%", right: "5%", size: 40, delay: "0.4s" },
  { Icon: FaChartLine, top: "53%", right: "4%", size: 46, delay: "0.8s" },
  { Icon: FaHandshake, bottom: "16%", left: "50%", size: 42, delay: "1.2s" },
  { Icon: FaStar, bottom: "25%", left: "7%", size: 48, delay: "1.6s" },
  { Icon: FaSearch, top: "37%", left: "5%", size: 38, delay: "2.0s" },
];

/* Background scattered icons */
const BG_ICONS = [
  { Icon: FaRocket, size: 80, style: { top: "5%", left: "5%", transform: "rotate(-15deg)" } },
  { Icon: FaLaptopCode, size: 88, style: { top: "5%", right: "6%", transform: "rotate(10deg)" } },
  { Icon: FaMedal, size: 68, style: { bottom: "8%", left: "6%", transform: "rotate(20deg)" } },
  { Icon: FaClipboardList, size: 72, style: { bottom: "6%", right: "5%", transform: "rotate(-10deg)" } },
  { Icon: FaBuilding, size: 60, style: { top: "44%", left: "3%", transform: "rotate(-5deg)" } },
  { Icon: FaUserTie, size: 62, style: { top: "43%", right: "3%", transform: "rotate(8deg)" } },
];

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(form.name, form.email, form.password, form.role);
      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate(res.user.role === "student" ? "/student/profile" : "/recruiter/profile");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card auth-card-signup">

        {/* ══════════════ LEFT: Illustration ══════════════ */}
        <div className="auth-illus-side">

          {/* Large faint background icons */}
          {BG_ICONS.map(({ Icon, size, style }, i) => (
            <div key={i} className="auth-bg-icon" style={{ fontSize: size, ...style }}>
              <Icon />
            </div>
          ))}

          {/* Big glow circle */}
          <div className="auth-circle">
            <div className="auth-center-icon">
              <FaRocket />
            </div>
          </div>

          {/* Orbiting bubbles */}
          {BUBBLES.map(({ Icon, top, left, right, bottom, size, delay }, i) => (
            <div
              key={i}
              className="auth-bubble"
              style={{
                top, left, right, bottom,
                width: size, height: size,
                animationDelay: delay,
              }}
            >
              <Icon style={{ fontSize: size * 0.42 }} />
            </div>
          ))}

          {/* Bottom tagline */}
          <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1.5">
            <span className="text-white/60 text-[11px] font-medium tracking-widest uppercase">
              Connect. Grow. Succeed.
            </span>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`rounded-full bg-white transition-all ${i === 1 ? "w-5 h-1.5" : "w-1.5 h-1.5 opacity-30"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════ RIGHT: Form ══════════════ */}
        <div className="auth-form-side">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <FaBriefcase className="text-white text-sm" />
            </div>
            <span className="font-extrabold text-gray-800 text-lg tracking-tight">Skill2Job</span>
          </div>

          <h2 className="text-[22px] font-bold text-gray-800 leading-snug">
            Create your Account
          </h2>
          <p className="text-xs text-gray-400 mt-1 mb-6">
            Join thousands of job seekers and recruiters today.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
              <div className="auth-input-wrap">
                <FaUser className="auth-input-icon" />
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="auth-input-base"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
              <div className="auth-input-wrap">
                <FaEnvelope className="auth-input-icon" />
                <input
                  type="email"
                  required
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="auth-input-base"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
              <div className="auth-input-wrap">
                <FaLock className="auth-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="auth-input-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition text-xs"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Role Toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">I am a</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "student" })}
                  className={`auth-role-btn ${form.role === "student" ? "active" : ""}`}
                >
                  <FaGraduationCap className="text-sm" />
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "recruiter" })}
                  className={`auth-role-btn ${form.role === "recruiter" ? "active" : ""}`}
                >
                  <FaUserTie className="text-sm" />
                  Recruiter
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button type="submit" className="auth-btn-primary">
                Create Account
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-400 mt-5 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-emerald-600 font-semibold cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Signup;