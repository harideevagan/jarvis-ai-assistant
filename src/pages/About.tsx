import { profile } from "../data/harideevagan";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="page-title">About {profile.name}</h1>
      <p className="measure text-lg">{profile.summary}</p>

      <section className="mt-10 pt-6 border-t border-line">
        <h2 className="section-title mb-3">Expertise</h2>
        <p className="measure text-muted">{profile.expertise.join(", ")}.</p>
      </section>

      <section className="mt-10 pt-6 border-t border-line">
        <h2 className="section-title mb-3">Odoo experience</h2>
        <p className="measure text-muted">{profile.odooExperience.join(", ")}.</p>
      </section>

      <section className="mt-10 pt-6 border-t border-line">
        <h2 className="section-title mb-3">Awards</h2>
        <ul className="measure space-y-1">
          {profile.awards.map((a) => (
            <li key={a.name}>
              {a.name}, {a.period}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
