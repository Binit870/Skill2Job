import { Link } from "react-router-dom";

const footerLinks = [
  {
    heading: "PLATFORM",
    links: [
      { label: "About", to: "/about" },
      { label: "Features", to: "/features" },
      { label: "How It Works", to: "/how-it-works" },
    ],
  },
  {
    heading: "JOB SEEKERS",
    links: [
      { label: "Find Jobs", to: "/student/jobs" },      // will be overridden
      { label: "Build Resume", to: "/student/resume" }, // will be overridden
      { label: "Mock Interview", to: "/student/mock-interview" }, // will be overridden
    ],
  },
  {
    heading: "RECRUITERS",
    links: [
      { label: "Post a Job", to: "/recruiter/post-job" },          // will be overridden
      { label: "Candidates", to: "/recruiter/candidates-applications" }, // will be overridden
      { label: "Dashboard", to: "/recruiter-dashboard" },          // will be overridden
    ],
  },
  {
    heading: "CONTACT",
    links: [],
    phone: "+91 98765 43210",
    email: "careers@skill2job.com",
  },
];

// Links that should redirect to login/signup page
const authRequiredLinks = new Set([
  "Find Jobs", "Build Resume", "Mock Interview",
  "Post a Job", "Candidates", "Dashboard"
]);

export default function Footer() {
  return (
    <footer className="bg-green-50 border-t border-green-100">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
          
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img 
                src="/src/assets/logo.png" 
                alt="Skill2Job Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold';
                  fallback.textContent = 'S';
                  e.target.parentNode?.appendChild(fallback);
                }}
              />
              <span className="font-bold text-lg tracking-tight">
                <span className="text-green-800">Skill</span>
                <span className="text-green-500">2</span>
                <span className="text-green-800">Job</span>
              </span>
            </Link>
            <p className="text-sm text-black leading-relaxed max-w-xs">
              A skill-first hiring platform that connects talent with the right opportunities through AI-powered matching.
            </p>
          </div>

          {/* All link columns */}
          {footerLinks.map((col) => (
            <div key={col.heading}>
              <h4 className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3 md:mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2 md:space-y-2.5">
                {col.links.map((link) => {
                  // If this link requires authentication, send to /signup, otherwise use original to
                  const targetPath = authRequiredLinks.has(link.label) ? "/signup" : link.to;
                  return (
                    <li key={link.label}>
                      <Link
                        to={targetPath}
                        className="text-sm text-black hover:text-green-600 transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                {col.phone && (
                  <>
                    <li className="pt-1">
                      <a
                        href={`tel:${col.phone}`}
                        className="text-sm text-black hover:text-green-600 transition-colors duration-200 flex items-center gap-1.5"
                      >
                        <img src="/src/assets/phone.png" alt="phone" className="w-4 h-4" />
                        {col.phone}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`mailto:${col.email}`}
                        className="text-sm text-black hover:text-green-600 transition-colors duration-200 flex items-center gap-1.5"
                      >
                        <img src="/src/assets/email.png" alt="email" className="w-4 h-4" />
                        {col.email}
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-green-100 bg-green-50/80">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-black">
            <span>© {new Date().getFullYear()} Skill2Job. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}