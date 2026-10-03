import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../services/authService";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import AuthField from "../components/auth/AuthField";

const PANEL = {
  eyebrow: "Almost done",
  heading: "Choose a new password to get back into your account.",
  points: [
    "Use at least 8 characters",
    "Avoid reusing an old password",
    "You'll be signed in right after",
  ],
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setError(true);
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setMessage("Password updated successfully");
      setError(false);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed. The link may have expired.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell panel={PANEL}>
      <h1 className="font-display text-2xl font-bold text-ink leading-snug">Reset password</h1>
      <p className="text-sm text-ink/50 mt-1.5 mb-8">Enter your new password below.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="New password"
          icon={Lock}
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showToggle
          visible={showPassword}
          onToggleVisible={() => setShowPassword((v) => !v)}
          minLength={8}
        />

        <AuthField
          label="Confirm password"
          icon={Lock}
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showToggle
          visible={showConfirmPassword}
          onToggleVisible={() => setShowConfirmPassword((v) => !v)}
          minLength={8}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-pine text-white text-sm font-semibold py-3 hover:bg-moss transition-colors disabled:opacity-60"
        >
          {loading ? "Resetting…" : "Reset password"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {message && (
        <p
          className={`flex items-center justify-center gap-1.5 text-sm mt-4 text-center font-medium ${
            error ? "text-red-500" : "text-pine"
          }`}
        >
          {!error && <CheckCircle2 className="w-4 h-4" />}
          {message}
        </p>
      )}

      <p className="text-sm text-ink/50 mt-6 text-center">
        Back to{" "}
        <Link to="/login" className="text-pine font-semibold hover:text-moss">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
