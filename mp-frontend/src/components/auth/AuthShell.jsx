import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import logo from "../../assets/logo.png";

/**
 * Shared shell for all four auth pages (Login, Signup, Forgot/Reset Password).
 * `illustrationFirst` flips which side the value-prop panel sits on, matching
 * the original Login (form left) vs Signup (form right) arrangement.
 */
export default function AuthShell({ illustrationFirst = false, panel, children }) {
  return (
    <div className="min-h-dvh w-full bg-paper flex flex-col items-center justify-center px-4 py-8 sm:py-10">
      <div className="w-full max-w-[1000px] mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-[0_1px_2px_rgba(13,21,18,0.04),0_24px_64px_-16px_rgba(13,21,18,0.16)] overflow-hidden grid md:grid-cols-2">
        {illustrationFirst && <IllustrationPanel {...panel} />}

        <div className="flex flex-col justify-center px-8 py-10 sm:px-12 sm:py-12">
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <img src={logo} alt="" className="h-8 w-8 object-contain" />
            <span className="font-display font-bold text-lg tracking-tight text-ink">
              Skill2Career
            </span>
          </Link>

          {children}
        </div>

        {!illustrationFirst && <IllustrationPanel {...panel} />}
      </div>
    </div>
  );
}

function IllustrationPanel({ eyebrow, heading, points = [] }) {
  return (
    <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-pine to-moss px-10 py-12 overflow-hidden">
      {/* Subtle structural texture — quiet dot grid, not decoration for its own sake */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative">
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gold/90 mb-4">
          {eyebrow}
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
          {heading}
        </h2>
      </div>

      <ul className="relative space-y-3.5">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm text-white/85">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/90">
              <Check className="h-2.5 w-2.5 text-moss" strokeWidth={3} />
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
