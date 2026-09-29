import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ChatWidget from "../components/ChatWidget";
import Reveal from "../components/Reveal";
import { profile } from "../data/harideevagan";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
      <section className="relative text-center max-w-3xl mx-auto mb-14">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="hero-orb -top-10 left-1/4 h-64 w-64 bg-indigo-500/40 dark:bg-indigo-500/30" />
          <div
            className="hero-orb top-10 right-1/4 h-56 w-56 bg-sky-400/40 dark:bg-sky-500/25"
            style={{ animationDelay: "-6s" }}
          />
          <div
            className="hero-orb top-24 left-1/2 h-48 w-48 bg-violet-500/30 dark:bg-violet-500/25"
            style={{ animationDelay: "-12s" }}
          />
        </div>
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.12 }}>
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05]"
          >
            <span className="gradient-text">Ask Jarvis Anything</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-6 text-lg text-slate-600 dark:text-slate-300"
          >
            An AI assistant for {profile.name}'s technology, projects, services, and live web research.
          </motion.p>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-7 flex flex-wrap justify-center gap-2"
          >
            {profile.titles.map((t) => (
              <span key={t} className="chip text-slate-600 dark:text-slate-300">
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <Reveal>
        <ChatWidget />
      </Reveal>

      <section className="mt-20 grid gap-6 sm:grid-cols-3 text-center">
        {[
          { to: "/services", title: "Services", body: "Odoo ERP, AI/LLM systems, automation, and full-stack development." },
          { to: "/projects", title: "Projects", body: "Enterprise ERP suites, AI assistants, and cross-platform agents." },
          { to: "/contact", title: "Contact", body: `Ready to start a project? Get in touch with ${profile.name}.` },
        ].map((c, i) => (
          <Reveal key={c.to} delay={i * 0.1}>
            <Link to={c.to} className="card-lift block p-6 h-full">
              <div className="text-xl font-semibold font-display">{c.title}</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{c.body}</p>
            </Link>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
