import { Link } from "react-router-dom";
import { services } from "../data/services";
import Reveal from "../components/Reveal";

export default function Services() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Reveal>
        <h1 className="page-title">
          Services
        </h1>
        <p className="text-lg text-slate-600 mb-10">
          Tell Jarvis about your business and requirements, and it can help scope the right solution — or
          reach out directly below.
        </p>
      </Reveal>
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((s, i) => (
          <Reveal key={s} delay={(i % 2) * 0.08}>
            <div className="card-lift px-5 py-4 text-sm h-full">{s}</div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/ai" className="btn-primary">
            Ask Jarvis about a project
          </Link>
          <Link to="/contact" className="btn-ghost">
            Contact directly
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
