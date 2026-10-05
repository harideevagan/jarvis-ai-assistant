import { skillGroups } from "../data/skills";

export default function Skills() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="page-title mb-8">Skills</h1>
      <div className="border-t border-line">
        {skillGroups.map((g) => (
          <section key={g.group} className="py-6 border-b border-line sm:grid sm:grid-cols-[1fr_2fr] sm:gap-8">
            <h2 className="section-title">{g.group}</h2>
            <p className="mt-2 sm:mt-0 measure text-muted">{g.items.join(", ")}.</p>
          </section>
        ))}
      </div>
    </div>
  );
}
