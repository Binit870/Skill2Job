import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEye,
  FaEyeSlash,
  FaBriefcase,
  FaEnvelope,
  FaLock,
  FaArrowRight
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
      toast.error(
        error.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
     {/* LEFT SIDE */}
<div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-300 via-green-400 to-lime-300 text-slate-900">
  <div className="absolute inset-0 bg-white/10" />
  <div className="absolute -top-24 -left-24 w-72 h-72 bg-green-500/20 rounded-full blur-3xl" />
  <div className="absolute bottom-0 right-0 w-80 h-80 bg-lime-400/20 rounded-full blur-3xl" />

  <div className="relative z-10 flex flex-col justify-center h-full w-full px-10 xl:px-14 py-12">
    <div className="max-w-2xl mx-auto w-full text-center">

      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/50 border border-white/60 backdrop-blur-md shadow-lg">
          <FaBriefcase className="text-xl text-emerald-700" />
          <span className="text-3xl xl:text-4xl font-semibold tracking-tight text-emerald-900">
            Skill2Job
          </span>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-slate-900 max-w-xl mx-auto">
        Welcome back to your professional network.
      </h1>

      {/* Description */}
      <p className="mt-6 text-base xl:text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto">
        Sign in to access your dashboard, manage opportunities, and continue
        building meaningful connections based on skills, talent, and career potential.
      </p>

    </div>
  </div>
</div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
  <div className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 mb-4">
    <FaBriefcase />
    <span className="text-sm font-semibold">Skill2Job</span>
  </div>

  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
    Sign in
  </h2>

  <p className="mt-3 text-slate-600 text-sm sm:text-base leading-6">
    Enter your details to continue to your account.
  </p>
</div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="Enter your email address"
                    value={form.email}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
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
      className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition"
      onChange={(e) =>
        setForm({ ...form, password: e.target.value })
      }
    />

    <button
      type="button"
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>

  <div className="flex justify-end mt-2">
    <button
      type="button"
      onClick={() => navigate("/forgot-password")}
      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
    >
      Forgot password?
    </button>
  </div>
</div>

              

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <FaArrowRight className="text-sm" />}
              </button>
            </form>

            {/* GOOGLE LOGIN */}
            {/* <div className="mt-6">
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="mx-3 text-slate-400 text-sm">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button className="w-full border border-slate-300 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition">
                Continue with Google
              </button>
            </div> */}

            {/* SIGNUP */}
            <p className="text-sm text-center text-slate-600 mt-6">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;