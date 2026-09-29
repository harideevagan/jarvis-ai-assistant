import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { contact } from "../data/contact";

export default function Layout({ children }: { children: ReactNode }) {
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

        </div>
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
            <Link to="/ai" className="text-slate-600 hover:text-slate-900">
              AI Assistant
            </Link>
            <Link to="/about" className="text-slate-600 hover:text-slate-900">
              About
            </Link>
            <Link to="/services" className="text-slate-600 hover:text-slate-900">
              Services
            </Link>
            <Link to="/projects" className="text-slate-600 hover:text-slate-900">
              Projects
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
