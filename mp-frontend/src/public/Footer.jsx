import { Link } from "react-router-dom";
import { GraduationCap, Twitter, Linkedin, Github, Instagram, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const footerLinks = [
  {
    heading: "Platform",
    links: [
      { label: "About", to: "/about" },
      { label: "Features", to: "/features" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    heading: "Job Seekers",
    links: [
      { label: "Find Jobs", to: "/student/jobs" },
      { label: "Build Resume", to: "/student/resume" },
      { label: "Mock Interview", to: "/student/mock-interview" },
      { label: "Mock Assessment", to: "/student/mock-assesment" },
    ],
  },
  {
    heading: "Recruiters",
    links: [
      { label: "Post a Job", to: "/recruiter/post-job" },
      { label: "My Jobs", to: "/recruiter/my-jobs" },
      { label: "Candidates", to: "/recruiter/candidates-applications" },
      { label: "Dashboard", to: "/recruiter-dashboard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Sign Up", to: "/signup" },
    ],
  },
];

const socials = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    toast.success("You're subscribed! 🎉");
  };

  return (
    <footer className="bg-white text-green-400">


      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-green-800 font-bold text-lg tracking-tight">
                Skill<span className="text-green-500">2</span>Job
              </span>
            </Link>
            <p className="text-sm text-green-500 leading-relaxed max-w-xs">
              A skill-first hiring platform that connects talent with the right opportunities through AI-powered matching.
            </p>
            <div className="flex gap-3 mt-5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors group">
                  <Icon className="w-3.5 h-3.5 text-green-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading} className="col-span-1">
              <h4 className="text-green-800 text-xs font-bold uppercase tracking-widest mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}
                      className="text-sm text-gray-500 hover:text-green-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Skill2Job. All rights reserved.</span>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-gray-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-400 transition">Terms of Service</Link>
            <Link to="/contact" className="hover:text-gray-400 transition">Support</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}