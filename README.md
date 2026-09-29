# JARVIS — Harideevagan's AI Assistant

A production-ready website + AI assistant built with React, Vite, TypeScript and Netlify
Functions. JARVIS answers questions about Harideevagan's work, acts as a friendly sales
assistant when a visitor shows interest, and can search the live web when needed —
all without ever revealing the underlying AI model or provider.

## 1. Install

```bash
npm install
```

## 2. Configure secrets

Copy `.env.example` to `.env` and fill in:

- `NVIDIA_API_KEY` — key for your LLM backend (OpenAI-compatible chat completions API).
- `SEARCH_API_KEY` — key for the web search provider (Tavily by default).

**Never commit `.env` or put these keys in frontend code.** In production, set the same
variables in Netlify: Site settings → Environment variables.

## 3. Run locally

```bash
npm install -g netlify-cli   # once
netlify dev
```

This runs the Vite dev server and the Netlify Functions together (`chat`, `search`,
`fetch-page`) so the chat widget works end to end.

## 4. Build & deploy

```bash
npm run build
```

Push to a Git provider and connect the repo in Netlify, or deploy directly:

```bash
netlify deploy --prod
```

Netlify reads `netlify.toml` automatically (build command, functions folder, redirects).

## Where things live

| What | Where |
|---|---|
| Assistant's identity, personality, tools | `netlify/functions/lib/knowledge.ts` |
| **Sales / discount strategy** | `src/data/salesPolicy.ts` (frontend reference) and mirrored in `netlify/functions/lib/knowledge.ts` under "Competitor price-matching strategy" |
| Profile / projects / services / skills | `src/data/*.ts` |
| LLM API call | `netlify/functions/lib/modelClient.ts` |
| Web search | `netlify/functions/lib/searchClient.ts` |
| Page fetch + text extraction | `netlify/functions/lib/fetchPage.ts` |
| Chat orchestration (tool-calling loop) | `netlify/functions/chat.ts` |
| Lead capture form | `src/pages/Contact.tsx` (submits via Netlify Forms — leads appear in Netlify's Forms dashboard) |

### Adjusting the sales / discount policy

Everything about how JARVIS handles pricing conversations is in one place:
`netlify/functions/lib/knowledge.ts`, under **"Competitor price-matching strategy"**.
By default it's configured as:

> If a visitor already has a quotation from another company for a comparable
> service, JARVIS may offer to match it at **50%** of that quoted price, as an
> introductory offer — after confirming the scope is comparable, and always framed
> as subject to Harideevagan's final confirmation.

To change the discount percentage or the conditions around it, edit the
`offerPercentOfCompetitorQuote` value and the prompt text in that file — nothing
else needs to change.

## Security notes

- All API keys stay server-side in Netlify Functions; the browser only ever talks to
  `/api/chat`, `/api/search`, `/api/fetch-page`.
- Basic per-IP rate limiting and input-size limits are built in
  (`netlify/functions/lib/security.ts`). For real production traffic, also add
  Netlify's own rate limiting or a WAF in front.
- The system prompt explicitly forbids revealing the underlying model/provider, and
  `sanitizeOutput()` in `modelClient.ts` strips any accidental mention as a second
  layer of defense.
- Do not commit `.env` or paste API keys into any file that gets pushed to Git.

## Features included

- Multi-page site (Home, About, Services, Projects, Skills, Contact, AI, Blog)
- Chat widget: voice input (Web Speech API), text-to-speech, copy/regenerate/share/clear,
  language selector, dark/light mode
- Automatic language detection & reply-in-kind (11 Indian + English languages) via the
  system prompt
- Live web search with a visible "Web research used" sources section
- Lead capture form wired to Netlify Forms
- SEO: meta tags, Open Graph/Twitter cards, canonical URL, JSON-LD (Person, WebSite,
  SoftwareApplication), `sitemap.xml`, `robots.txt`
