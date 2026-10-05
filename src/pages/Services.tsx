import { Link } from "react-router-dom";
import { services } from "../data/services";

export default function Services() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="page-title">Services</h1>
      <p className="measure text-lg mb-8">
        Tell Jarvis about your business and what you need, and it can help scope the right solution. Or
        write to Hari directly.
      </p>
      <ul className="grid sm:grid-cols-2 sm:gap-x-10 border-t border-line">
        {services.map((s) => (
          <li key={s} className="py-3 border-b border-line">
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <Link to="/ai" className="btn-primary">
          Ask Jarvis about a project
        </Link>
        <Link to="/contact" className="btn-ghost">
          Contact Hari directly
        </Link>
      </div>
    </div>
  );
}
