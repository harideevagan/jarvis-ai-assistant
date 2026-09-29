import ChatWidget from "../components/ChatWidget";

export default function AiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Jarvis can answer questions about Harideevagan's work, scope a project with you, and search the
        live web for anything current.
      </p>
      <ChatWidget />
    </div>
  );
}
