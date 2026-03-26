import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBriefcase,
  FaGlobe,
  FaUserTie,
  FaGraduationCap,
  FaArrowRight
} from "react-icons/fa";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(
        form.name,
        form.email,
        form.password,
        form.role
      );

      toast.success("Account created successfully!");

      const role = res.user.role;

      setTimeout(() => {
        if (role === "student") {
          navigate("/student/profile");
        } else {
          navigate("/recruiter/profile");
        }
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
     {/* LEFT SIDE */}
<div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-900 to-indigo-800 text-white">
  <div className="absolute inset-0 bg-black/10" />
  <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
  <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />

  <div className="relative z-10 flex flex-col justify-center h-full w-full px-10 xl:px-14 py-12">
    <div className="max-w-2xl mx-auto w-full text-center">
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/12 border border-white/20 backdrop-blur-md shadow-lg">
          <FaBriefcase className="text-xl text-white/90" />
          <span className="text-3xl xl:text-4xl font-semibold tracking-tight text-white">
            Skill2Job
          </span>
        </div>
      </div>

      <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-white max-w-xl mx-auto">
        Connecting skills with the right opportunities.
      </h1>

      <p className="mt-6 text-base xl:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
        Skill2Job bridges the gap between job seekers and recruiters by
        focusing on skills, potential, and real-world ability instead of
        only degrees. We help talented individuals stand out and help
        employers discover candidates who are truly job-ready.
      </p>
    </div>

    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
      <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <FaGraduationCap className="text-xl text-purple-200" />
          <h3 className="font-semibold text-lg">For Job Seekers</h3>
        </div>
        <p className="text-sm text-white/80 leading-6">
          Showcase your skills, projects, and strengths to unlock better
          career opportunities.
        </p>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-5">
        <div className="flex items-center gap-3 mb-3">
          <FaUserTie className="text-xl text-indigo-200" />
          <h3 className="font-semibold text-lg">For Recruiters</h3>
        </div>
        <p className="text-sm text-white/80 leading-6">
          Find the right candidates faster through skill-first hiring and
          smarter talent discovery.
        </p>
      </div>
    </div>
  </div>
</div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-6 py-8 sm:px-10">
        <div className="w-full max-w-lg">
          <div className="mb-6 text-center">
            <div className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 mb-4">
              <FaBriefcase />
              <span className="text-sm font-semibold">Skill2Job</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Create your account
            </h2>

            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-6">
              Join Skill2Job and start building your future through skills,
              talent, and opportunity.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>
              </div>

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
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition"
                    value={form.email}
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
                    placeholder="Create a secure password"
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* ROLE */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Account Type
                </label>
                <div className="relative">
                  <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    className="w-full appearance-none pl-12 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition"
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                  >
                    <option value="student">Job Seeker</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
              >
                Create Account
                <FaArrowRight className="text-sm" />
              </button>
            </form>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-sm text-center text-slate-600">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="font-semibold text-purple-700 hover:text-purple-800 hover:underline cursor-pointer"
                >
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;