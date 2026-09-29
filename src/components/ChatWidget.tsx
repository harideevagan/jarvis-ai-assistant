import { useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";
type Message = {
  id: string;
  role: Role;
  content: string;
};

const LANGUAGES = [
  "Auto-detect",
  "English",
  "Tamil",
  "Hindi",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Urdu",
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("Auto-detect");
  const [listening, setListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: uid(), role: "user", content: trimmed };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const languageHint =
        language !== "Auto-detect" ? `\n\n(Please respond in ${language}.)` : "";

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed + languageHint, history }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      const assistantMsg: Message = {
        id: uid(),
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError((err as Error).message || "JARVIS couldn't respond. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function regenerate() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages((prev) => {
      const idx = prev.map((m) => m.id).lastIndexOf(lastUser.id);
      return prev.slice(0, idx + 1);
    });
    sendMessage(lastUser.content);
  }

  function clearChat() {
    setMessages([]);
    setError(null);
  }

  function copyMessage(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  function shareMessage(text: string) {
    if (navigator.share) {
      navigator.share({ title: "JARVIS", text }).catch(() => {});
    } else {
      copyMessage(text);
    }
  }

  function toggleListen() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice input isn't supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function toggleSpeak(msg: Message) {
    if (!("speechSynthesis" in window)) {
      setError("Text-to-speech isn't supported in this browser.");
      return;
    }
    if (speakingId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(msg.content);
    utter.onend = () => setSpeakingId(null);
    setSpeakingId(msg.id);
    window.speechSynthesis.speak(utter);
  }

  return (
    <div className="flex flex-col h-[70vh] max-h-[720px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Ask Jarvis anything
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1"
            aria-label="Response language"
          >
            {LANGUAGES.map((lng) => (
              <option key={lng} value={lng}>
                {lng}
              </option>
            ))}
          </select>
          <button
            onClick={clearChat}
            className="text-xs rounded-md border border-slate-300 dark:border-slate-700 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            New conversation
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center mt-8">
            Ask about Harideevagan's projects, services, Odoo/AI work, or anything current — Jarvis
            can search the web when it needs to.
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm prose-chat whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-brand-500 text-white rounded-br-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm"
              }`}
            >
              <p>{msg.content}</p>

              {msg.role === "assistant" && (
                <div className="mt-2 flex gap-3 text-xs opacity-60">
                  <button onClick={() => copyMessage(msg.content)} className="hover:opacity-100">
                    Copy
                  </button>
                  <button onClick={() => toggleSpeak(msg)} className="hover:opacity-100">
                    {speakingId === msg.id ? "⏹ Stop" : "🔊 Listen"}
                  </button>
                  <button onClick={() => shareMessage(msg.content)} className="hover:opacity-100">
                    Share
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-500">
              Jarvis is thinking…
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-red-500 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 p-3">
        {messages.some((m) => m.role === "assistant") && !loading && (
          <button
            onClick={regenerate}
            className="mb-2 text-xs rounded-md border border-slate-300 dark:border-slate-700 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ↻ Regenerate
          </button>
        )}
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            rows={1}
            placeholder="Ask Jarvis anything..."
            className="flex-1 resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="button"
            onClick={toggleListen}
            aria-label="Voice input"
            className={`rounded-xl border px-3 py-2 text-sm ${
              listening
                ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30"
                : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            🎤
          </button>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
