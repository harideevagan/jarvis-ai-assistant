import { projects } from "../data/harideevagan";

export default function Projects() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <div key={p.title} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="font-semibold text-lg mb-2">{p.title}</h2>
            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
              {p.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
