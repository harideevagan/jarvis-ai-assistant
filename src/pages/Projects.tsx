import { projects } from "../data/harideevagan";
import Reveal from "../components/Reveal";

export default function Projects() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Reveal>
        <h1 className="page-title mb-10">
          Projects
        </h1>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 0.1}>
            <div className="card-lift p-6 h-full">
              <h2 className="font-semibold text-xl mb-3">{p.title}</h2>
              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
