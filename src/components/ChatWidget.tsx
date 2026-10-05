import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Markdown, { markdownToSpeech } from "./Markdown";
import { Check, Copy, Globe, Mic, Plus, Refresh, Send, Share, Speaker, Stop } from "./Icons";

type Role = "user" | "assistant";
type Message = {
  id: string;
  role: Role;
  content: string;
  // Friendly local replies (slow server, rate limit). Never sent to the server.
  isNotice?: boolean;
  retry?: boolean;
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

const SUGGESTIONS = [
  "What does Hari build?",
  "I need an Odoo module",
  "I already have a quote from another company",
];

const NOTICES = [
  'That one is too big for my small server. Hari can build almost anything, but the server budget is another story. Try a shorter question, like "How does an Odoo project work?" or "What does Hari build?"',
  "My server just ran out of breath. Hari knows a lot, but he also keeps a small budget, so I only get a small server. Ask me something smaller and I will be quick.",
  "Too heavy for my small server. The good news is that Hari's knowledge is big. The bad news is that the budget is small. Send a shorter question, or ask Hari directly on the Contact page.",
];
const RATE_NOTICE = "You are sending messages very fast. Wait a few seconds and try again.";

const MAX_TEXTAREA_PX = 120; // about five lines at 16px / 1.5

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function reducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export default function ChatWidget({ className = "" }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("Auto-detect");
  const [langOpen, setLangOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const lastNoticeRef = useRef(-1);

  useEffect(() => {
    if (messages.length === 0) return;
    endRef.current?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "end" });
  }, [messages, loading]);

  // Grow the textarea with its content, up to about five lines.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_PX)}px`;
  }, [input]);

  // Keep the composer above the on-screen keyboard on browsers that
  // shrink the visual viewport instead of the layout viewport (iOS Safari).
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const root = document.documentElement;
    const update = () => root.style.setProperty("--vvh", `${vv.height}px`);
    update();
    vv.addEventListener("resize", update);
    return () => {
      vv.removeEventListener("resize", update);
      root.style.removeProperty("--vvh");
    };
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLangOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen]);

  function pickNotice(): string {
    let i = Math.floor(Math.random() * NOTICES.length);
    if (i === lastNoticeRef.current) i = (i + 1 + Math.floor(Math.random() * (NOTICES.length - 1))) % NOTICES.length;
    lastNoticeRef.current = i;
    return NOTICES[i];
  }

  function addNotice(content: string, retry: boolean) {
    setMessages((prev) => [...prev, { id: uid(), role: "assistant", content, isNotice: true, retry }]);
  }

  async function sendMessage(text: string, base: Message[] = messages) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: uid(), role: "user", content: trimmed };
    const history = base.filter((m) => !m.isNotice).map((m) => ({ role: m.role, content: m.content }));
    setMessages([...base, userMsg]);
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

      if (res.status === 429) {
        addNotice(RATE_NOTICE, false);
        return;
      }
      const data = await res.json().catch(() => null);
      if (data === null || data.code === "timeout" || [408, 502, 504].includes(res.status)) {
        addNotice(pickNotice(), true);
        return;
      }
      if (!res.ok || typeof data.reply !== "string") {
        throw new Error("Jarvis could not answer that. Please send it again.");
      }

      const assistantMsg: Message = {
        id: uid(),
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      if (err instanceof TypeError) {
        addNotice(pickNotice(), true);
      } else {
        setError((err as Error).message || "Jarvis could not answer that. Please send it again.");
      }
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
    const idx = messages.map((m) => m.id).lastIndexOf(lastUser.id);
    sendMessage(lastUser.content, messages.slice(0, idx));
  }

  function clearChat() {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    setMessages([]);
    setError(null);
  }

  function flashCopied(id: string) {
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
  }

  function copyMessage(msg: Message) {
    navigator.clipboard
      ?.writeText(msg.content)
      .then(() => flashCopied(msg.id))
      .catch(() => {});
  }

  function shareMessage(msg: Message) {
    if (navigator.share) {
      navigator.share({ title: "Jarvis", text: msg.content }).catch(() => {});
    } else {
      copyMessage(msg);
    }
  }

  function toggleListen() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("This browser can't take voice input. Type your message instead.");
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
      setError("This browser can't read replies aloud.");
      return;
    }
    if (speakingId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(markdownToSpeech(msg.content));
    utter.onend = () => setSpeakingId(null);
    setSpeakingId(msg.id);
    window.speechSynthesis.speak(utter);
  }

  const composer = (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-1 rounded-full bg-white border border-line pl-5 pr-1.5 py-1.5 focus-within:border-indigo focus-within:ring-2 focus-within:ring-indigo"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
          }
        }}
        rows={1}
        placeholder="Write a message"
        aria-label="Write a message"
        className="flex-1 min-w-0 resize-none bg-transparent py-2.5 text-base leading-6 text-ink placeholder:text-muted focus:outline-none"
        style={{ maxHeight: MAX_TEXTAREA_PX }}
      />
      <button
        type="button"
        onClick={toggleListen}
        aria-label={listening ? "Stop voice input" : "Voice input"}
        aria-pressed={listening}
        className={`h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-full hover:bg-bubble ${
          listening ? "text-turmeric" : "text-muted"
        }`}
      >
        <Mic size={22} />
      </button>
      <button
        type="submit"
        disabled={loading || !input.trim()}
        aria-label="Send message"
        className="h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-full bg-indigo text-white hover:bg-[#263380] disabled:bg-line disabled:text-muted"
      >
        <Send size={22} />
      </button>
    </form>
  );

  const toolbar = (
    <div className="flex justify-end gap-1 px-2 pt-1" ref={langRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setLangOpen((o) => !o)}
          aria-label={`Reply language: ${language}`}
          aria-haspopup="true"
          aria-expanded={langOpen}
          className="icon-btn"
        >
          <Globe size={22} />
        </button>
        {langOpen && (
          <ul className="absolute right-0 top-full z-30 mt-1 w-52 max-h-[60vh] overflow-y-auto rounded-ui border border-line bg-white py-1">
            {LANGUAGES.map((lng) => (
              <li key={lng}>
                <button
                  type="button"
                  aria-current={lng === language}
                  onClick={() => {
                    setLanguage(lng);
                    setLangOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-2 px-4 min-h-[44px] text-left text-base text-ink hover:bg-bubble"
                >
                  <span>{lng}</span>
                  {lng === language && <Check size={20} className="text-indigo" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="button" onClick={clearChat} aria-label="New chat" className="icon-btn">
        <Plus size={22} />
      </button>
    </div>
  );

  const empty = messages.length === 0 && !loading;
  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant" && !m.isNotice)?.id;

  const errorBox = error && (
    <p role="alert" className="text-base text-ink border-l-2 border-ink pl-3 my-3 max-w-[68ch]">
      {error}
    </p>
  );

  return (
    <div
      className={`flex flex-col ${className}`}
      style={{ minHeight: "calc(var(--vvh, 100dvh) - 3.5rem)" }}
    >
      {toolbar}

      {empty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-10 composer-wrap">
          <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-center">
            Hello. What are you working on?
          </h2>
          <div className="mt-5 flex flex-col items-center">
            <Suggestions onPick={sendMessage} />
          </div>
          <div className="w-full max-w-[720px] mt-6">{composer}</div>
          {errorBox}
        </div>
      ) : (
        <>
          <div className="flex-1 w-full max-w-[720px] mx-auto px-4 pt-4">
            {messages.map((msg) =>
              msg.role === "user" ? (
                <div key={msg.id} className="msg-in flex justify-end py-3">
                  <p className="max-w-[85%] rounded-ui bg-bubble px-4 py-2.5 whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              ) : msg.isNotice ? (
                <div key={msg.id} className="msg-in py-3">
                  <p className="max-w-[68ch]">{renderNotice(msg.content)}</p>
                  {msg.retry && msg.id === messages[messages.length - 1].id && !loading && (
                    <div className="mt-2">
                      <Suggestions onPick={sendMessage} />
                      <button
                        type="button"
                        onClick={regenerate}
                        className="min-h-[44px] px-2 -ml-2 text-base text-indigo underline underline-offset-4"
                      >
                        Try again
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div key={msg.id} className="msg-in reply py-3">
                  <div className="max-w-[68ch]">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                  <div className="reply-actions -ml-3 flex">
                    <button
                      type="button"
                      onClick={() => copyMessage(msg)}
                      aria-label={copiedId === msg.id ? "Copied" : "Copy reply"}
                      className="icon-btn"
                    >
                      {copiedId === msg.id ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSpeak(msg)}
                      aria-label={speakingId === msg.id ? "Stop listening" : "Listen to reply"}
                      className="icon-btn"
                    >
                      {speakingId === msg.id ? <Stop size={20} /> : <Speaker size={20} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => shareMessage(msg)}
                      aria-label="Share reply"
                      className="icon-btn"
                    >
                      <Share size={20} />
                    </button>
                    {msg.id === lastAssistantId && !loading && (
                      <button type="button" onClick={regenerate} aria-label="Regenerate reply" className="icon-btn">
                        <Refresh size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ),
            )}

            {loading && (
              <div className="flex items-center gap-1.5 py-5 text-muted" role="status" aria-label="Jarvis is writing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}

            {errorBox}
            <div ref={endRef} style={{ scrollMarginBottom: "6rem" }} />
          </div>

          <div className="sticky bottom-0 bg-page composer-wrap">
            <div className="w-full max-w-[720px] mx-auto px-4 pt-2 pb-3">{composer}</div>
          </div>
        </>
      )}
    </div>
  );
}

function Suggestions({ onPick }: { onPick: (text: string) => void }) {
  return (
    <ul className="flex flex-col items-start empty:hidden">
      {SUGGESTIONS.map((s) => (
        <li key={s}>
          <button
            type="button"
            onClick={() => onPick(s)}
            className="min-h-[44px] px-2 -ml-2 text-base text-muted hover:text-ink hover:underline underline-offset-4 text-left"
          >
            {s}
          </button>
        </li>
      ))}
    </ul>
  );
}

function renderNotice(text: string) {
  const parts = text.split("Contact page");
  if (parts.length === 1) return text;
  return (
    <>
      {parts[0]}
      <Link to="/contact" className="link">
        Contact page
      </Link>
      {parts[1]}
    </>
  );
}
