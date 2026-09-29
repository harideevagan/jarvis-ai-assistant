import { skillGroups } from "../data/skills";
import Reveal from "../components/Reveal";

export default function Skills() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Reveal>
        <h1 className="page-title mb-10">
          <span className="gradient-text">Skills</span>
        </h1>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2">
        {skillGroups.map((g, i) => (
          <Reveal key={g.group} delay={(i % 2) * 0.1}>
            <div className="card-lift p-6 h-full">
              <h2 className="font-semibold text-lg mb-3">{g.group}</h2>
              <div className="flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
