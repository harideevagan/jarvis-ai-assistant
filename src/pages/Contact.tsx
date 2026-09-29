import { useState } from "react";
import { contact } from "../data/contact";

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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact Harideevagan</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        Share a few details about your project, or reach out directly.
      </p>

      <div className="flex flex-wrap gap-3 mb-10">
        <a
          href={`mailto:${contact.email}`}
          className="rounded-lg bg-brand-500 text-white px-4 py-2 text-sm font-medium hover:bg-brand-600"
        >
          ✉️ Email Hari
        </a>
        <a
          href={contact.phoneHref}
          className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium"
        >
          📞 Call Hari
        </a>
        <a
          href={contact.website}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium"
        >
          🌐 Visit Website
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium"
        >
          in LinkedIn
        </a>
      </div>

      {status === "sent" ? (
        <div className="rounded-xl border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-6 text-sm">
          Thanks — your details have been sent. Harideevagan will follow up with you personally.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
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
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-lg bg-brand-500 text-white px-5 py-2.5 text-sm font-medium hover:bg-brand-600 disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            {status === "error" && (
              <span className="text-sm text-red-500">Something went wrong — please email directly instead.</span>
            )}
          </div>
        </form>
      )}
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
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm"
      />
    </div>
  );
}
