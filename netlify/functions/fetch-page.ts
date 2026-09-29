import type { Handler } from "@netlify/functions";
import { fetchAndExtract } from "./lib/fetchPage";
import { corsHeaders, jsonResponse, isRateLimited } from "./lib/security";

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const ip = event.headers["x-nf-client-connection-ip"] || "unknown";
  if (isRateLimited(`fetch-page:${ip}`)) {
    return jsonResponse(429, { error: "Too many requests. Please slow down." });
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const url = String(payload.url || "");
    if (!url) {
      return jsonResponse(400, { error: "A url is required." });
    }
    const page = await fetchAndExtract(url);
    return jsonResponse(200, page);
  } catch (err) {
    return jsonResponse(500, { error: (err as Error).message || "Fetch failed." });
  }
};
