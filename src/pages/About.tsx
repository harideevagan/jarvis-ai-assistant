import { profile } from "../data/harideevagan";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">About {profile.name}</h1>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{profile.summary}</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Expertise</h2>
      <div className="flex flex-wrap gap-2">
        {profile.expertise.map((e) => (
          <span key={e} className="text-xs rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
            {e}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">Odoo Experience</h2>
      <div className="flex flex-wrap gap-2">
        {profile.odooExperience.map((e) => (
          <span key={e} className="text-xs rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
            {e}
          </span>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">Awards</h2>
      <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1">
        {profile.awards.map((a) => (
          <li key={a.name}>
            {a.name} ({a.period})
          </li>
        ))}
      </ul>
    </div>
  );
}
