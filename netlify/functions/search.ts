import type { Handler } from "@netlify/functions";
import { webSearch } from "./lib/searchClient";
import { corsHeaders, jsonResponse, isRateLimited } from "./lib/security";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const ip = event.headers["x-nf-client-connection-ip"] || "unknown";
  if (isRateLimited(`search:${ip}`)) {
    return jsonResponse(429, { error: "Too many requests. Please slow down." });
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const query = String(payload.query || "").slice(0, 300);
    if (!query.trim()) {
      return jsonResponse(400, { error: "A search query is required." });
    }
    const results = await webSearch(query, payload.maxResults || 5);
    return jsonResponse(200, { results });
  } catch (err) {
    return jsonResponse(500, { error: (err as Error).message || "Search failed." });
  }
};
