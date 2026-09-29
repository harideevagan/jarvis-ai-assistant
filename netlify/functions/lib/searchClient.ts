// Server-side web search. Uses Tavily (LLM-friendly search API) by default;
// swap the implementation here if you prefer another provider — nothing
// outside this file needs to change.

const SEARCH_API_URL = process.env.SEARCH_API_URL || "https://api.tavily.com/search";
const SEARCH_API_KEY = process.env.SEARCH_API_KEY;

export type SearchResult = {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
};

export async function webSearch(query: string, maxResults = 5): Promise<SearchResult[]> {
  if (!SEARCH_API_KEY) {
    throw new Error("Search API key is not configured on the server.");
  }
  if (!query || query.trim().length === 0) {
    return [];
  }

  const res = await fetch(SEARCH_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: SEARCH_API_KEY,
      query,
      max_results: maxResults,
      include_answer: false,
    }),
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Search request failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const results = Array.isArray(data.results) ? data.results : [];

  return results.slice(0, maxResults).map((r: Record<string, unknown>) => ({
    title: String(r.title ?? "Untitled"),
    url: String(r.url ?? ""),
    snippet: String(r.content ?? r.snippet ?? "").slice(0, 600),
    publishedDate: r.published_date ? String(r.published_date) : undefined,
  }));
}
