import type { Handler } from "@netlify/functions";
import { callModel, sanitizeOutput, type ChatMessage } from "./lib/modelClient";
import { buildSystemPrompt } from "./lib/knowledge";
import { corsHeaders, jsonResponse, isRateLimited, isValidMessage } from "./lib/security";

const MAX_HISTORY_MESSAGES = 6;

type IncomingMessage = { role: "user" | "assistant"; content: string };

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const ip = event.headers["x-nf-client-connection-ip"] || "unknown";
  if (isRateLimited(`chat:${ip}`)) {
    return jsonResponse(429, { error: "Too many requests. Please slow down and try again shortly." });
  }

  let payload: { message?: string; history?: IncomingMessage[] };
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body." });
  }

  const { message, history = [] } = payload;
  if (!isValidMessage(message)) {
    return jsonResponse(400, { error: "A non-empty message (max 4000 characters) is required." });
  }
  if (!Array.isArray(history) || history.length > 50) {
    return jsonResponse(400, { error: "Invalid conversation history." });
  }

  const trimmedHistory = history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && isValidMessage(m.content))
    .slice(-MAX_HISTORY_MESSAGES);

  const messages: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt() },
    ...trimmedHistory.map((m) => ({ role: m.role, content: m.content }) as ChatMessage),
    { role: "user", content: message! },
  ];

  try {
    const result = await callModel(messages);
    const reply = sanitizeOutput(result.content || "I'm not able to generate a response right now.");
    return jsonResponse(200, { reply });
  } catch (err) {
    const name = (err as Error).name;
    if (name === "TimeoutError" || name === "AbortError") {
      return jsonResponse(504, { code: "timeout" });
    }
    return jsonResponse(500, { code: "error" });
  }
};
