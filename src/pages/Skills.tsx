import { skillGroups } from "../data/skills";

export default function Skills() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Skills</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {skillGroups.map((g) => (
          <div key={g.group} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="font-semibold mb-3">{g.group}</h2>
            <div className="flex flex-wrap gap-2">
              {g.items.map((item) => (
                <span key={item} className="text-xs rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
