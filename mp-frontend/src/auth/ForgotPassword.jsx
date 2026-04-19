import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import {
  FaEnvelope, FaArrowRight, FaBriefcase,
  FaSearch, FaFileAlt, FaStar, FaHandshake,
  FaChartLine, FaLaptopCode, FaMedal,
  FaBuilding, FaRocket, FaClipboardList, FaUserTie,
} from "react-icons/fa";

const BUBBLES = [
  { Icon: FaEnvelope,   top: "10%",    left: "57%",  size: 44, delay: "0s"   },
  { Icon: FaChartLine,  top: "27%",    right: "5%",  size: 40, delay: "0.5s" },
  { Icon: FaHandshake,  top: "55%",    right: "4%",  size: 46, delay: "1.0s" },
  { Icon: FaFileAlt,    bottom: "15%", left: "52%",  size: 40, delay: "1.5s" },
  { Icon: FaStar,       bottom: "25%", left: "7%",   size: 48, delay: "2.0s" },
  { Icon: FaSearch,     top: "38%",    left: "5%",   size: 38, delay: "2.5s" },
];

const BG_ICONS = [
  { Icon: FaBuilding,      size: 80, style: { top: "5%",    left: "5%",   transform: "rotate(-15deg)" } },
  { Icon: FaLaptopCode,    size: 90, style: { top: "6%",    right: "6%",  transform: "rotate(10deg)"  } },
  { Icon: FaMedal,         size: 70, style: { bottom: "8%", left: "6%",   transform: "rotate(20deg)"  } },
  { Icon: FaClipboardList, size: 75, style: { bottom: "6%", right: "5%",  transform: "rotate(-10deg)" } },
  { Icon: FaRocket,        size: 60, style: { top: "45%",   left: "3%",   transform: "rotate(-5deg)"  } },
  { Icon: FaUserTie,       size: 65, style: { top: "44%",   right: "3%",  transform: "rotate(8deg)"   } },
];

export default function ForgotPassword() {
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMessage(res.data.message);
      setSuccess(true);
    } catch {
      setMessage("Something went wrong");
      setSuccess(false);
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
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-8 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <FaBriefcase className="text-white text-sm" />
            </div>
            <span className="font-extrabold text-gray-800 text-lg tracking-tight">Skill2Job</span>
          </div>

          <h2 className="text-[22px] font-bold text-gray-800 leading-snug">
            Forgot Password?
          </h2>
          <p className="text-xs text-gray-400 mt-1 mb-7">
            Enter your email to receive a reset link.
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input-base"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button disabled={loading} className="auth-btn-primary">
                {loading ? "Sending…" : "Send Reset Link"}
                {!loading && <FaArrowRight className="text-xs" />}
              </button>
            </div>
          </form>

          {/* Message */}
          {message && (
            <p className={`text-xs mt-4 text-center font-medium ${success ? "text-emerald-600" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <p className="text-xs text-gray-400 mt-6 text-center">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-emerald-600 font-semibold cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>
        </div>

        {/* ══════════════ RIGHT: Illustration ══════════════ */}
        <div className="auth-illus-side">

          {BG_ICONS.map(({ Icon, size, style }, i) => (
            <div key={i} className="auth-bg-icon" style={{ fontSize: size, ...style }}>
              <Icon />
            </div>
          ))}

          <div className="auth-circle">
            <div className="auth-center-icon">
              <FaEnvelope />
            </div>
          </div>

          {BUBBLES.map(({ Icon, top, left, right, bottom, size, delay }, i) => (
            <div
              key={i}
              className="auth-bubble"
              style={{ top, left, right, bottom, width: size, height: size, animationDelay: delay }}
            >
              <Icon style={{ fontSize: size * 0.42 }} />
            </div>
          ))}

          <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1.5">
            <span className="text-white/60 text-[11px] font-medium tracking-widest uppercase">
              We've got you covered.
            </span>
            
          </div>
        </div>

      </div>
    </div>
  );
}