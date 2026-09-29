import type { Handler } from "@netlify/functions";
import { callModel, sanitizeOutput, type ChatMessage, type ToolDefinition } from "./lib/modelClient";
import { webSearch, type SearchResult } from "./lib/searchClient";
import { buildSystemPrompt } from "./lib/knowledge";
import { corsHeaders, jsonResponse, isRateLimited, isValidMessage } from "./lib/security";

const MAX_HISTORY_MESSAGES = 12;
const MAX_TOOL_ROUNDS = 2;

const tools: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "web_search",
      description:
        "Search the live web for current information. Use this for anything that could have changed recently: current events, current software versions, current prices, current news, or recent information about Harideevagan not already known.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The search query." },
        },
        required: ["query"],
      },
    },
  },
];

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

  const allSources: SearchResult[] = [];
  let usedWebSearch = false;

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const result = await callModel(messages, tools);

      if (result.toolCalls && result.toolCalls.length > 0) {
        // Record the assistant's tool-call turn, then execute each tool.
        messages.push({
          role: "assistant",
          content: result.content || "",
        });

        for (const call of result.toolCalls) {
          if (call.function.name === "web_search") {
            usedWebSearch = true;
            let args: { query?: string } = {};
            try {
              args = JSON.parse(call.function.arguments || "{}");
            } catch {
              args = {};
            }
            const query = String(args.query || message).slice(0, 300);

            let results: SearchResult[] = [];
            try {
              results = await webSearch(query, 5);
              allSources.push(...results);
            } catch (searchErr) {
              messages.push({
                role: "tool",
                tool_call_id: call.id,
                name: call.function.name,
                content: `Search failed: ${(searchErr as Error).message}`,
              });
              continue;
            }

            const summarized = results
              .map((r, i) => `${i + 1}. ${r.title} (${r.url})\n${r.snippet}`)
              .join("\n\n");

            messages.push({
              role: "tool",
              tool_call_id: call.id,
              name: call.function.name,
              content: summarized || "No results found.",
            });
          } else {
            messages.push({
              role: "tool",
              tool_call_id: call.id,
              name: call.function.name,
              content: "Unknown tool.",
            });
          }
        }
        // Loop again so the model can read tool results and respond.
        continue;
      }

      // No tool call: this is the final answer.
      const finalText = sanitizeOutput(result.content || "I'm not able to generate a response right now.");

      const uniqueSources = dedupeSources(allSources);

      return jsonResponse(200, {
        reply: finalText,
        usedWebSearch,
        sources: uniqueSources,
      });
    }

    return jsonResponse(200, {
      reply:
        "I gathered some information but I'm having trouble finalizing an answer right now — could you try rephrasing your question?",
      usedWebSearch,
      sources: dedupeSources(allSources),
    });
  } catch (err) {
    return jsonResponse(500, { error: (err as Error).message || "JARVIS ran into an error." });
  }
};

function dedupeSources(sources: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  const out: SearchResult[] = [];
  for (const s of sources) {
    if (!s.url || seen.has(s.url)) continue;
    seen.add(s.url);
    out.push(s);
  }
  return out.slice(0, 6);
}
