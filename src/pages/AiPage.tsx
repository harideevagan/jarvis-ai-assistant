import ChatWidget from "../components/ChatWidget";

export default function AiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-3 pb-6">
      <h1 className="sr-only">AI Assistant</h1>
      <ChatWidget className="min-h-[calc(100dvh-9rem)]" />
    </div>
  );
}
