import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEye, FaEyeSlash, FaBriefcase, FaEnvelope,
  FaLock, FaArrowRight, FaUserTie, FaSearch,
  FaFileAlt, FaStar, FaHandshake, FaChartLine,
  FaLaptopCode, FaMedal, FaBuilding, FaGraduationCap,
  FaRocket, FaClipboardList,
} from "react-icons/fa";

/* Orbiting bubbles — Skill2Job relevant icons */
const BUBBLES = [
  { Icon: FaRocket, top: "10%", left: "58%", size: 44, delay: "0s" },
  { Icon: FaChartLine, top: "27%", right: "5%", size: 40, delay: "0.5s" },
  { Icon: FaHandshake, top: "55%", right: "4%", size: 46, delay: "1.0s" },
  { Icon: FaFileAlt, bottom: "15%", left: "52%", size: 40, delay: "1.5s" },
  { Icon: FaGraduationCap, bottom: "25%", left: "7%", size: 48, delay: "2.0s" },
  { Icon: FaStar, top: "38%", left: "5%", size: 38, delay: "2.5s" },
];

/* Background scattered icons — large & faint */
const BG_ICONS = [
  { Icon: FaBuilding, size: 80, style: { top: "5%", left: "5%", transform: "rotate(-15deg)" } },
  { Icon: FaLaptopCode, size: 90, style: { top: "6%", right: "6%", transform: "rotate(10deg)" } },
  { Icon: FaMedal, size: 70, style: { bottom: "8%", left: "6%", transform: "rotate(20deg)" } },
  { Icon: FaClipboardList, size: 75, style: { bottom: "6%", right: "5%", transform: "rotate(-10deg)" } },
  { Icon: FaSearch, size: 60, style: { top: "45%", left: "3%", transform: "rotate(-5deg)" } },
  { Icon: FaUserTie, size: 65, style: { top: "44%", right: "3%", transform: "rotate(8deg)" } },
];

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(form.email, form.password);
      toast.success("Login successful!");
      navigate(user.role === "recruiter" ? "/recruiter-dashboard" : "/student-dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">

        {/* ══════════════ LEFT: Form ══════════════ */}
        <div className="auth-form-side">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <FaBriefcase className="text-white text-sm" />
            </div>
            <span className="font-extrabold text-gray-800 text-lg tracking-tight">Skill2Job</span>
          </div>

          {/* Heading */}
          <h2 className="text-[22px] font-bold text-gray-800 leading-snug">
            Sign In to your Account
          </h2>
          <p className="text-xs text-gray-400 mt-1 mb-7">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-500">Password</label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-emerald-600 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button type="submit" disabled={loading} className="auth-btn-primary">
                {loading ? "Signing in…" : "Sign In"}
                {!loading && <FaArrowRight className="text-xs" />}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-400 mt-6 text-center">
            Not registered yet?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-emerald-600 font-semibold cursor-pointer hover:underline"
            >
              Create an account
            </span>
          </p>
        </div>

        {/* ══════════════ RIGHT: Illustration ══════════════ */}
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
              <FaBriefcase />
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
            <span className="text-white text-[11px] font-medium tracking-widest uppercase">
              Your skills. Your future.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;