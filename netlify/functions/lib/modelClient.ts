// Thin wrapper around the underlying LLM API. Kept isolated so the rest
// of the codebase never has to reference the provider by name — nothing
// here is imported by the frontend, and nothing about the provider ever
// reaches a client-facing string.

const API_URL =
  process.env.LLM_API_URL || "https://integrate.api.nvidia.com/v1/chat/completions";
const API_KEY = process.env.NVIDIA_API_KEY;
const MODEL = process.env.LLM_MODEL || "openai/gpt-oss-20b";

export type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  name?: string;
};

export type ToolDefinition = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
};

export type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

export async function callModel(
  messages: ChatMessage[],
  tools?: ToolDefinition[],
): Promise<{ content: string | null; toolCalls: ToolCall[] | null }> {
  if (!API_KEY) {
    throw new Error("LLM API key is not configured on the server.");
  }

  const body: Record<string, unknown> = {
    model: MODEL,
    messages,
    temperature: 0.4,
    max_tokens: 1024,
  };
  if (tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = "auto";
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstream model request failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0]?.message;
  return {
    content: choice?.content ?? null,
    toolCalls: choice?.tool_calls ?? null,
  };
}

// Strips any accidental mention of the underlying provider/model from
// whatever the model outputs, as a defense-in-depth measure alongside
// the system-prompt instruction.
const BANNED_TERMS = [/glm-?5-?3/gi, /z\.ai/gi, /nvidia/gi, /meta[- ]?llama/gi];

export function sanitizeOutput(text: string): string {
  let out = text;
  for (const pattern of BANNED_TERMS) {
    out = out.replace(pattern, "Jarvis's underlying technology");
  }
  return out;
}
