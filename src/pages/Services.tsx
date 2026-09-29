import { Link } from "react-router-dom";
import { services } from "../data/services";

export default function Services() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Services</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Tell Jarvis about your business and requirements, and it can help scope the right solution — or
        reach out directly below.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <div
            key={s}
            className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm"
          >
            {s}
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <Link to="/ai" className="rounded-lg bg-brand-500 text-white px-4 py-2 text-sm font-medium hover:bg-brand-600">
          Ask Jarvis about a project
        </Link>
        <Link to="/contact" className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium">
          Contact directly
        </Link>
      </div>
    </div>
  );
}
