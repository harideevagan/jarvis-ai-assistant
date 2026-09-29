// Small shared helpers: CORS, basic input limits, and a best-effort
// in-memory rate limiter. Serverless instances are short-lived and
// horizontally scaled, so this is a speed bump against casual abuse, not
// a substitute for an edge-level rate limiter — add one (Netlify's own,
// or Cloudflare) in front for real production traffic.

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...corsHeaders },
    body: JSON.stringify(body),
  };
}

const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

export function isValidMessage(message: unknown): message is string {
  return typeof message === "string" && message.trim().length > 0 && message.length <= 4000;
}
