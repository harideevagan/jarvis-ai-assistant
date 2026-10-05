import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { contact } from "../data/contact";

const builderLinks = [
  { href: "https://harideevagan.netlify.app/", label: "Portfolio" },
  { href: "https://chess-harideevagan.netlify.app/", label: "Chess game" },
  { href: "https://js-harideevagan.netlify.app/", label: "JavaScript guide" },
  { href: "https://python-harideevagan.netlify.app/", label: "Python guide" },
  { href: "https://html-css-harideevagan.netlify.app/", label: "HTML and CSS guide" },
  { href: "https://psql-sql-harideevagan.netlify.app/", label: "PostgreSQL and SQL guide" },
  { href: "https://ai-harideevagan.netlify.app/", label: "AI guide" },
  { href: "https://odoo-harideevagan.netlify.app/", label: "Odoo guide" },
];

const footerLinks = [
  { to: "/ai", label: "AI Assistant" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-page border-b border-line">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
          <Link to="/" className="inline-flex items-baseline gap-3 min-h-[44px] items-center">
            <span className="font-serif font-semibold text-xl text-ink">Jarvis</span>
            <span className="text-sm text-muted">Hari's assistant</span>
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line mt-16">
        <div className="max-w-5xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="font-serif font-semibold text-lg">Jarvis</div>
            <p className="text-muted mt-1">
              Built by{" "}
              <a href="https://harideevagan.netlify.app/" className="text-ink underline underline-offset-4">
                Hari Deevagan
              </a>
            </p>
            <ul className="flex flex-wrap gap-x-4 mt-2">
              {builderLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-flex items-center min-h-[44px] text-muted hover:text-ink hover:underline underline-offset-4">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-x-2">
            {footerLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="inline-flex items-center min-h-[44px] pr-4 text-ink hover:underline underline-offset-4">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] pr-4 text-ink hover:underline underline-offset-4"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
