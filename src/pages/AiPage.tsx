import ChatWidget from "../components/ChatWidget";
import Reveal from "../components/Reveal";

export default function AiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Reveal>
        <h1 className="page-title">
          AI <span className="gradient-text">Assistant</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
          Jarvis can answer questions about Harideevagan's work, scope a project with you, and search the
          live web for anything current.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <ChatWidget />
      </Reveal>
    </div>
  );
}
