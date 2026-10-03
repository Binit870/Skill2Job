import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import logo from "../assets/logo.png";

const footerLinks = [
  {
    heading: "Platform",
    links: [
      { label: "About", to: "/about" },
      { label: "Features", to: "/features" },
      { label: "How it works", to: "/how-it-works" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    heading: "Job seekers",
    links: [
      { label: "Find jobs", to: "/student/jobs" },
      { label: "Build resume", to: "/student/resume" },
      { label: "Mock interview", to: "/student/mock-interview" },
    ],
  },
  {
    heading: "Recruiters",
    links: [
      { label: "Post a job", to: "/recruiter/post-job" },
      { label: "Candidates", to: "/recruiter/candidates-applications" },
      { label: "Dashboard", to: "/recruiter-dashboard" },
    ],
  },
];

// These destinations require an account — send signed-out visitors to sign up instead
const authRequiredLinks = new Set([
  "Find jobs", "Build resume", "Mock interview",
  "Post a job", "Candidates", "Dashboard",
]);

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src={logo} alt="" className="w-7 h-7 object-contain" />
              <span className="font-display font-bold text-lg tracking-tight text-white">
                Skill2Career
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-5">
              A skill-first hiring platform connecting job-ready talent with roles that
              actually fit — backed by real ML scoring, not keyword guesswork.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="tel:+919876543210" className="flex items-center gap-2 hover:text-white transition-colors w-fit">
                <Phone className="w-4 h-4" strokeWidth={1.75} />
                +91 98765 43210
              </a>
              <a href="mailto:careers@Skill2Career.com" className="flex items-center gap-2 hover:text-white transition-colors w-fit">
                <Mail className="w-4 h-4" strokeWidth={1.75} />
                careers@Skill2Career.com
              </a>
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white/40 text-xs font-display font-semibold uppercase tracking-widest mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => {
                  const targetPath = authRequiredLinks.has(link.label) ? "/signup" : link.to;
                  return (
                    <li key={link.label}>
                      <Link to={targetPath} className="text-sm hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center text-xs text-white/40">
          <span>© {new Date().getFullYear()} Skill2Career. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
