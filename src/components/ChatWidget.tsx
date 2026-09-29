import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
    <div className="flex flex-col h-[75vh] max-h-[760px] rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200">
        <div className="text-sm font-medium text-slate-500">Ask Jarvis anything</div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-600"
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
            className="text-xs rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100"
          >
            New conversation
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-sm text-slate-500 text-center mt-16 px-6">
            Ask about Harideevagan's projects, services, Odoo/AI work, or anything else — Jarvis is
            happy to help.
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={msg.role === "assistant" ? "bg-slate-50" : "bg-white"}
            >
              <div className="max-w-3xl mx-auto flex gap-4 px-4 py-5">
                <Avatar role={msg.role} />
                <div className="flex-1 min-w-0 text-[15px] leading-relaxed text-slate-800 prose-chat whitespace-pre-wrap">
                  <p>{msg.content}</p>

                  {msg.role === "assistant" && (
                    <div className="mt-2 flex gap-3 text-xs text-slate-400">
                      <button onClick={() => copyMessage(msg.content)} className="hover:text-slate-700">
                        Copy
                      </button>
                      <button onClick={() => toggleSpeak(msg)} className="hover:text-slate-700">
                        {speakingId === msg.id ? "⏹ Stop" : "🔊 Listen"}
                      </button>
                      <button onClick={() => shareMessage(msg.content)} className="hover:text-slate-700">
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="bg-slate-50" role="status" aria-label="Jarvis is thinking">
            <div className="max-w-3xl mx-auto flex gap-4 px-4 py-5">
              <Avatar role="assistant" />
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-2">
        <div className="max-w-3xl mx-auto">
          {messages.some((m) => m.role === "assistant") && !loading && (
            <button
              onClick={regenerate}
              className="mb-2 text-xs rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
            >
              ↻ Regenerate
            </button>
          )}
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-1 rounded-3xl border border-slate-300 bg-white pl-4 pr-2 py-2 shadow-sm focus-within:border-slate-400"
          >
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
              placeholder="Message Jarvis"
              className="flex-1 resize-none bg-transparent py-1.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none max-h-40"
            />
            <button
              type="button"
              onClick={toggleListen}
              aria-label="Voice input"
              className={`h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors ${
                listening ? "mic-listening" : ""
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="h-9 w-9 shrink-0 inline-flex items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Avatar({ role }: { role: Role }) {
  return role === "assistant" ? (
    <div className="h-8 w-8 shrink-0 rounded-full bg-slate-900 text-white text-sm font-semibold font-display inline-flex items-center justify-center">
      J
    </div>
  ) : (
    <div className="h-8 w-8 shrink-0 rounded-full bg-slate-200 text-slate-600 inline-flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0z" />
      </svg>
    </div>
  );
}
