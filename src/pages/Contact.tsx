import { useState } from "react";
import { contact } from "../data/contact";
import { Link, Linkedin, Mail, Phone } from "../components/Icons";

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
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="page-title">Contact Harideevagan</h1>
      <p className="measure text-lg mb-8">
        Share a few details about your project, or reach out directly.
      </p>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-12">
        <a href={`mailto:${contact.email}`} className="btn-primary">
          <Mail size={20} />
          Email Hari
        </a>
        <a href={contact.phoneHref} className="btn-ghost">
          <Phone size={20} />
          Call Hari
        </a>
        <a href={contact.website} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <Link size={20} />
          Visit website
        </a>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <Linkedin size={20} />
          LinkedIn
        </a>
      </div>

      {status === "sent" ? (
        <p role="status" className="measure border-l-2 border-indigo pl-4">
          Your details are sent. Hari will reply to you personally.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="border-t border-line pt-8 grid gap-5 sm:grid-cols-2">
          <Field label="Name" value={form.name} onChange={(v) => update("name", v)} required />
          <Field label="Company" value={form.company} onChange={(v) => update("company", v)} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
          <Field label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
          <Field label="Country" value={form.country} onChange={(v) => update("country", v)} />
          <Field label="Required service" value={form.service} onChange={(v) => update("service", v)} />
          <Field label="Expected timeline" value={form.timeline} onChange={(v) => update("timeline", v)} />
          <Field label="Approximate budget" value={form.budget} onChange={(v) => update("budget", v)} />
          <div className="sm:col-span-2">
            <label className="block font-medium mb-1" htmlFor="f-description">
              Project description
            </label>
            <textarea
              id="f-description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={5}
              className="field"
            />
          </div>
          <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3">
            <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-50">
              {status === "sending" ? "Sending" : "Send"}
            </button>
            {status === "error" && (
              <span role="alert" className="measure">
                The form did not send. Please email Hari directly.
              </span>
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
  const id = `f-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label className="block font-medium mb-1" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </div>
  );
}
