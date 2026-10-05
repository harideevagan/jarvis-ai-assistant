import { projects } from "../data/harideevagan";

export default function Projects() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="page-title mb-8">Projects</h1>
      <div className="border-t border-line">
        {projects.map((p) => (
          <section key={p.title} className="py-6 border-b border-line sm:grid sm:grid-cols-[1fr_2fr] sm:gap-8">
            <h2 className="section-title">{p.title}</h2>
            <ul className="mt-3 sm:mt-0 list-disc pl-5 space-y-1 measure">
              {p.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
