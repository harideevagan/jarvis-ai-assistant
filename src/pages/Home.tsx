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
      <section className="text-center max-w-3xl mx-auto mb-14">
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.12 }}>
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900"
          >
            Ask Jarvis Anything
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-6 text-lg text-slate-600"
          >
            An AI assistant for {profile.name}'s technology, projects, services, and live web research.
          </motion.p>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-7 flex flex-wrap justify-center gap-2"
          >
            {profile.titles.map((t) => (
              <span key={t} className="chip text-slate-600">
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
              <p className="text-sm text-slate-500 mt-2">{c.body}</p>
            </Link>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
