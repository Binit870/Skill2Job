import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEye,
  FaEyeSlash,
  FaBriefcase,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const loggedInUser = await login(form.email, form.password);

      toast.success("Login successful!");

      if (loggedInUser.role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#eef2f1] flex items-center justify-center px-4 py-10 overflow-hidden">

      {/* TOP RIGHT SHAPE */}
      <div className="absolute top-0 right-0 w-[240px] h-[180px] bg-[#f46b7b] rounded-bl-[80px] z-0"></div>

      {/* BOTTOM LEFT SHAPE */}
      <div className="absolute bottom-0 left-0 w-[260px] h-[170px] bg-[#f4c542] rounded-tr-[90px] z-0"></div>

      {/* SMALL GREEN ACCENT */}
      <div className="absolute top-[120px] left-[80px] w-10 h-10 bg-green-300 rounded-full opacity-80 z-0"></div>

      {/* SMALL RED ACCENT */}
      <div className="absolute bottom-[120px] right-[120px] w-8 h-8 bg-rose-300 rounded-full opacity-80 z-0"></div>

      {/* MAIN CARD */}
      <div className="relative z-10 w-full max-w-6xl bg-white rounded-[32px] shadow-[0_20px_80px_rgba(15,23,42,0.12)] overflow-hidden grid lg:grid-cols-2 min-h-[650px]">

        {/* LEFT SIDE - LOGIN */}
        <div className="flex items-center justify-center px-6 sm:px-10 lg:px-14 py-12 bg-white">
          <div className="w-full max-w-md text-center">

            {/* LOGO */}
            {/* <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
                <FaBriefcase />
                <span className="text-sm font-semibold">Skill2Job</span>
              </div>
            </div> */}

            {/* HEADING */}
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Sign In
            </h2>

            <p className="mt-3 text-slate-600 text-sm">
              Enter your details to continue
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5 mt-8 text-left">

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={form.email}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition"
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={form.password}
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none transition"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-sm hover:shadow-md"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <FaArrowRight />}
              </button>
            </form>

            {/* SIGNUP */}
            <p className="text-sm text-slate-600 mt-6">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-green-600 font-semibold cursor-pointer hover:underline"
              >
                Create account
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - WELCOME */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-400 text-white px-10 py-12 text-center overflow-hidden">
          
          {/* INTERNAL SHAPES */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-br-[60px]"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-lime-300/20 rounded-tl-[70px]"></div>

          <div className="relative z-10 max-w-sm">

            {/* LOGO */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                <FaBriefcase />
                <span className="font-semibold">Skill2Job</span>
              </div>
            </div>

            {/* HEADING */}
            <h1 className="text-4xl font-bold">
              Welcome Back!
            </h1>

            <p className="mt-4 text-white/90 text-sm leading-6">
              Login to continue your journey and explore opportunities
              tailored to your skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;