import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { contact } from "../data/contact";

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
  { to: "/ai", label: "AI Assistant" },
  { to: "/contact", label: "Contact" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem("jarvis-theme") !== "light";
    } catch {
      return true;
    }
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("jarvis-theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  }, [dark]);

  return (
    <div className="relative isolate min-h-screen flex flex-col">
      <div className="bg-aurora" aria-hidden="true">
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
        <div className="aurora-blob b3" />
      </div>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/60 dark:bg-slate-950/50 border-b border-white/60 dark:border-white/10 shadow-[0_4px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.35)]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg font-display">
            <span className="logo-glow inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-white font-display">
              J
            </span>
            <span>
              JARVIS
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400 font-normal text-sm ml-2">
                Harideevagan's AI Assistant
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-1 hover:text-brand-500 transition-colors ${
                  location.pathname === link.to ? "text-brand-500" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400 shadow-[0_0_10px_rgba(91,124,250,0.9)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <button
            aria-label="Toggle dark mode"
            onClick={() => setDark((d) => !d)}
            className="rounded-full glass px-3 py-1.5 text-sm hover:scale-110 transition-transform"
          >
            {dark ? "🌙" : "☀️"}
          </button>
        </div>
        <nav className="md:hidden flex gap-4 overflow-x-auto px-4 pb-2 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="whitespace-nowrap text-slate-600 dark:text-slate-300">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-white/60 dark:border-white/10 backdrop-blur-xl bg-white/40 dark:bg-slate-950/40 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2">
          <div>
            <div className="font-bold text-lg font-display gradient-text inline-block">JARVIS</div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              AI Assistant created by Harideevagan M
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm sm:justify-end">
            <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-brand-500">
              About
            </Link>
            <Link to="/services" className="text-slate-600 dark:text-slate-300 hover:text-brand-500">
              Services
            </Link>
            <Link to="/projects" className="text-slate-600 dark:text-slate-300 hover:text-brand-500">
              Projects
            </Link>
            <Link to="/ai" className="text-slate-600 dark:text-slate-300 hover:text-brand-500">
              AI Assistant
            </Link>
            <Link to="/contact" className="text-slate-600 dark:text-slate-300 hover:text-brand-500">
              Contact
            </Link>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-300 hover:text-brand-500"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
