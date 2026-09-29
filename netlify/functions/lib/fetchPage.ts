// Server-side page fetch + lightweight text extraction, so we never send
// a whole raw webpage to the model — just cleaned, relevant text.

const MAX_CHARS = 4000;

export async function fetchAndExtract(url: string): Promise<{ url: string; text: string }> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid URL.");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("Only http(s) URLs are allowed.");
  }

  const res = await fetch(parsed.toString(), {
    headers: { "User-Agent": "JarvisBot/1.0 (+https://harideevagan.netlify.app)" },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch page (${res.status}).`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
    throw new Error("Page is not text/HTML content.");
  }

  const html = await res.text();
  const text = extractText(html).slice(0, MAX_CHARS);
  return { url: parsed.toString(), text };
}

function extractText(html: string): string {
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|br|li|h[1-6]|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  cleaned = cleaned
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  cleaned = cleaned.replace(/[ \t]+/g, " ").replace(/\n{2,}/g, "\n").trim();

  return cleaned;
}
