import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import AuthShell from "../components/auth/AuthShell";
import AuthField from "../components/auth/AuthField";

const PANEL = {
  eyebrow: "Account recovery",
  heading: "We've got you covered — reset your password in a few clicks.",
  points: [
    "A secure reset link expires in 1 hour",
    "Your account data stays untouched",
    "Back to job hunting in under a minute",
  ],
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMessage(res.data.message);
      setSuccess(true);
    } catch {
      setMessage("Something went wrong. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell panel={PANEL}>
      <h1 className="font-display text-2xl font-bold text-ink leading-snug">Forgot password?</h1>
      <p className="text-sm text-ink/50 mt-1.5 mb-8">
        Enter your email and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          label="Email"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-pine text-white text-sm font-semibold py-3 hover:bg-moss transition-colors disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      {message && (
        <p
          className={`flex items-center justify-center gap-1.5 text-sm mt-4 text-center font-medium ${
            success ? "text-pine" : "text-red-500"
          }`}
        >
          {success && <CheckCircle2 className="w-4 h-4" />}
          {message}
        </p>
      )}

      <p className="text-sm text-ink/50 mt-6 text-center">
        Remember your password?{" "}
        <Link to="/login" className="text-pine font-semibold hover:text-moss">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
