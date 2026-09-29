import Reveal from "../components/Reveal";

export default function Blog() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Reveal>
        <h1 className="page-title">
          Blog
        </h1>
        <p className="text-lg text-slate-600">
          Posts about Odoo ERP, AI engineering, and automation are on the way. Ask Jarvis in the meantime —
          it can answer most of what would go here.
        </p>
      </Reveal>
    </div>
  );
}
