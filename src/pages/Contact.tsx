import { useState } from "react";
import { contact } from "../data/contact";
import Reveal from "../components/Reveal";

const initialForm = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  service: "",
  description: "",
  timeline: "",
  budget: "",
};

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join("&");
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function update<K extends keyof typeof initialForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "jarvis-leads", ...form }),
      });
      setStatus("sent");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Reveal>
      <h1 className="page-title">
        Contact Harideevagan
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Share a few details about your project, or reach out directly.
      </p>
      </Reveal>

      <Reveal delay={0.1}>
      <div className="flex flex-wrap gap-3 mb-10">
        <a
          href={`mailto:${contact.email}`}
          className="btn-primary"
        >
          ✉️ Email Hari
        </a>
        <a
          href={contact.phoneHref}
          className="btn-ghost"
        >
          📞 Call Hari
        </a>
        <a
          href={contact.website}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          🌐 Visit Website
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          in LinkedIn
        </a>
      </div>
      </Reveal>

      <Reveal delay={0.15}>
      {status === "sent" ? (
        <div className="rounded-xl border border-green-300 bg-green-50 p-6 text-sm">
          Thanks — your details have been sent. Harideevagan will follow up with you personally.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card-lift hover:!translate-y-0 p-6 grid gap-4 sm:grid-cols-2">
          <Field label="Name" value={form.name} onChange={(v) => update("name", v)} required />
          <Field label="Company" value={form.company} onChange={(v) => update("company", v)} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
          <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
          <Field label="Country" value={form.country} onChange={(v) => update("country", v)} />
          <Field label="Required service" value={form.service} onChange={(v) => update("service", v)} />
          <Field label="Expected timeline" value={form.timeline} onChange={(v) => update("timeline", v)} />
          <Field label="Approximate budget" value={form.budget} onChange={(v) => update("budget", v)} />
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Project description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            {status === "error" && (
              <span className="text-sm text-red-500">Something went wrong — please email directly instead.</span>
            )}
          </div>
        </form>
      )}
      </Reveal>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300/80 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
    </div>
  );
}
