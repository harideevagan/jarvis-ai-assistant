import { profile } from "../data/harideevagan";
import Reveal from "../components/Reveal";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Reveal>
        <h1 className="page-title">
          About <span className="gradient-text">{profile.name}</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{profile.summary}</p>
      </Reveal>

      <Reveal>
        <h2 className="section-title">Expertise</h2>
        <div className="flex flex-wrap gap-2">
          {profile.expertise.map((e) => (
            <span key={e} className="chip">
              {e}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <h2 className="section-title">Odoo Experience</h2>
        <div className="flex flex-wrap gap-2">
          {profile.odooExperience.map((e) => (
            <span key={e} className="chip">
              {e}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <h2 className="section-title">Awards</h2>
        <ul className="card-lift p-5 list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1">
          {profile.awards.map((a) => (
            <li key={a.name}>
              {a.name} ({a.period})
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
