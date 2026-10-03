import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import AuthField from "../components/auth/AuthField";

const PANEL = {
  eyebrow: "Welcome back",
  heading: "Pick up right where your career progress left off.",
  points: [
    "Track every application status in one place",
    "Resume ATS score and history saved to your profile",
    "Personalized job matches based on your skills",
  ],
};

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
      setTimeout(() => {
        navigate(user.role === "recruiter" ? "/recruiter-dashboard" : "/student-dashboard");
      }, 100);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell panel={PANEL}>
      <h1 className="font-display text-2xl font-bold text-ink leading-snug">
        Sign in to your account
      </h1>
      <p className="text-sm text-ink/50 mt-1.5 mb-8">Welcome back — enter your details.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          showToggle
          visible={showPassword}
          onToggleVisible={() => setShowPassword((v) => !v)}
          labelAction={
            <Link to="/forgot-password" className="text-xs font-medium text-pine hover:text-moss">
              Forgot password?
            </Link>
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-pine text-white text-sm font-semibold py-3 hover:bg-moss transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-sm text-ink/50 mt-7 text-center">
        Not registered yet?{" "}
        <Link to="/signup" className="text-pine font-semibold hover:text-moss">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
};

export default Login;
