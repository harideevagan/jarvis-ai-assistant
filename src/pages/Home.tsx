import { Link } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import { profile } from "../data/harideevagan";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <section className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Ask Jarvis Anything</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          An AI assistant for {profile.name}'s technology, projects, services, and live web research.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {profile.titles.map((t) => (
            <span key={t} className="rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1">
              {t}
            </span>
          ))}
        </div>
      </section>

      <ChatWidget />

      <section className="mt-14 grid gap-6 sm:grid-cols-3 text-center">
        <Link to="/services" className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-brand-500 transition-colors">
          <div className="text-lg font-semibold">Services</div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Odoo ERP, AI/LLM systems, automation, and full-stack development.
          </p>
        </Link>
        <Link to="/projects" className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-brand-500 transition-colors">
          <div className="text-lg font-semibold">Projects</div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enterprise ERP suites, AI assistants, and cross-platform agents.
          </p>
        </Link>
        <Link to="/contact" className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-brand-500 transition-colors">
          <div className="text-lg font-semibold">Contact</div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ready to start a project? Get in touch with {profile.name}.
          </p>
        </Link>
      </section>
    </div>
  );
}
