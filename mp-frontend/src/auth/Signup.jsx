import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock, ArrowRight, GraduationCap, Briefcase } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import AuthField from "../components/auth/AuthField";

const PANEL = {
  eyebrow: "Join Skill2Career",
  heading: "Turn your skills into the job you actually want.",
  points: [
    "Build an ATS-ready resume in minutes",
    "Practice with AI mock interviews and assessments",
    "Apply to roles matched to your skill set",
  ],
};

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await signup(form.name, form.email, form.password, form.role);
      toast.success("Account created successfully!");
      setTimeout(() => {
        navigate(res.user.role === "student" ? "/student/onboarding" : "/recruiter/profile");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell illustrationFirst panel={PANEL}>
      <h1 className="font-display text-2xl font-bold text-ink leading-snug">
        Create your account
      </h1>
      <p className="text-sm text-ink/50 mt-1.5 mb-7">
        Join thousands of job seekers and recruiters.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Full name"
          icon={User}
          placeholder="Enter your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <AuthField
          label="Email"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <AuthField
          label="Password"
          icon={Lock}
          placeholder="At least 8 characters"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          showToggle
          visible={showPassword}
          onToggleVisible={() => setShowPassword((v) => !v)}
          minLength={8}
          hint="Must be at least 8 characters."
        />

        <div>
          <label className="block text-xs font-semibold text-ink/60 mb-1.5">I am a</label>
          <div className="grid grid-cols-2 gap-3">
            <RoleButton
              icon={GraduationCap}
              label="Job seeker"
              active={form.role === "student"}
              onClick={() => setForm({ ...form, role: "student" })}
            />
            <RoleButton
              icon={Briefcase}
              label="Recruiter"
              active={form.role === "recruiter"}
              onClick={() => setForm({ ...form, role: "recruiter" })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-pine text-white text-sm font-semibold py-3 hover:bg-moss transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-sm text-ink/50 mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-pine font-semibold hover:text-moss">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};

function RoleButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-colors ${active
          ? "border-pine bg-pine/8 text-pine"
          : "border-mist text-ink/60 hover:border-ink/20 hover:text-ink"
        }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

export default Signup;
