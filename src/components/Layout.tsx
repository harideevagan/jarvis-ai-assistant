import type { ReactNode } from "react";
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
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg font-display">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white font-display">
              J
            </span>
            <span>
              JARVIS
              <span className="hidden sm:inline text-slate-500 font-normal text-sm ml-2">
                Harideevagan's AI Assistant
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-1 hover:text-slate-900 transition-colors ${
                  location.pathname === link.to ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-slate-900"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

        </div>
        <nav className="md:hidden flex gap-4 overflow-x-auto px-4 pb-2 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="whitespace-nowrap text-slate-600">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white mt-20">
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2">
          <div>
            <div className="font-bold text-lg font-display">JARVIS</div>
            <p className="text-sm text-slate-500 mt-1">
              AI Assistant created by Harideevagan M
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm sm:justify-end">
            <Link to="/about" className="text-slate-600 hover:text-slate-900">
              About
            </Link>
            <Link to="/services" className="text-slate-600 hover:text-slate-900">
              Services
            </Link>
            <Link to="/projects" className="text-slate-600 hover:text-slate-900">
              Projects
            </Link>
            <Link to="/ai" className="text-slate-600 hover:text-slate-900">
              AI Assistant
            </Link>
            <Link to="/contact" className="text-slate-600 hover:text-slate-900">
              Contact
            </Link>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-slate-900"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
