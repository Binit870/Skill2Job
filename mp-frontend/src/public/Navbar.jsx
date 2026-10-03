import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-shadow ${scrolled ? "shadow-[0_1px_0_0_theme(colors.mist)]" : ""
        } bg-paper/90 backdrop-blur-md`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logo} alt="" className="h-7 w-7 object-contain" />
          <span className="font-display font-bold text-lg tracking-tight text-ink">
            Skill2Career
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${active
                    ? "text-pine bg-pine/8"
                    : "text-ink/65 hover:text-ink hover:bg-ink/5"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="px-4 py-2 rounded-full text-sm font-medium text-ink/75 hover:text-ink transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-pine text-white text-sm font-semibold hover:bg-moss transition-colors"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-2 -mr-2 rounded-full hover:bg-ink/5 transition-colors"
        >
          {menuOpen ? <X className="w-5 h-5 text-ink" /> : <Menu className="w-5 h-5 text-ink" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-mist bg-paper px-5 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-ink/75 hover:text-ink hover:bg-ink/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3 mt-2 border-t border-mist">
            <Link
              to="/login"
              className="flex-1 text-center px-4 py-2.5 rounded-full border border-mist text-ink text-sm font-medium hover:bg-ink/5 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="flex-1 text-center px-4 py-2.5 rounded-full bg-pine text-white text-sm font-semibold hover:bg-moss transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
