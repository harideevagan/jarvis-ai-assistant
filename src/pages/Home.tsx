import { Link } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import { profile } from "../data/harideevagan";

const sections = [
  {
    to: "/services",
    title: "Services",
    body: "Odoo ERP, AI and LLM systems, automation, and full-stack development.",
    cta: "See services",
  },
  {
    to: "/projects",
    title: "Projects",
    body: "Enterprise ERP suites, AI assistants, and cross-platform agents.",
    cta: "See projects",
  },
  {
    to: "/contact",
    title: "Contact",
    body: `Have a project in mind? Write to ${profile.name}.`,
    cta: "Get in touch",
  },
];

export default function Home() {
  return (
    <div>
      <div className="max-w-5xl mx-auto">
        <h1 className="sr-only">Jarvis, Hari's assistant</h1>
        <ChatWidget />
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-16">
        <p className="text-muted measure">{profile.titles.join(", ")}.</p>
        <div className="mt-6 border-t border-line">
          {sections.map((s) => (
            <section key={s.to} className="py-6 border-b border-line sm:grid sm:grid-cols-[1fr_2fr] sm:gap-8">
              <h2 className="section-title">{s.title}</h2>
              <div className="mt-2 sm:mt-0">
                <p className="measure">{s.body}</p>
                <Link to={s.to} className="link inline-flex items-center min-h-[44px]">
                  {s.cta}
                </Link>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
