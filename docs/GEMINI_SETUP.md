# Swingo with Gemini

Swingo uses the Gemini Developer API through the Node server. Google sign-in is required. The browser never receives the Gemini API key.

## Key and model

For the local website, save only the key in `.data/gemini-api-key.txt` and restart `npm start`. The existing `.data/` exclusion keeps it out of source control, and the server's static allowlist never serves it.

For hosting, set `GEMINI_API_KEY` in the host's private server environment. Do not upload the local `.data` directory into a public static site. Optional settings:

```text
GEMINI_MODEL=gemini-3.8-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash
```

For Groq backup, set `GROQ_API_KEY` privately in the host environment, or save it to `.data/groq-api-key.txt` locally. The default `GROQ_MODEL` is `qwen/qwen3.8-27b`, supporting both text and images. Restart the server after changing keys. Groq keys: https://console.groq.com/keys. Vision documentation: https://console.groq.com/docs/vision.

Gemini is primary. Temporary model errors can try the secondary Gemini model, then Groq. A Gemini quota error skips other Gemini models and goes directly to Groq. Network failures and timeouts also allow Groq backup. Safety refusals, invalid inputs and authentication failures do not trigger retries on another provider. Every attempt has an 18-second timeout within a 55-second overall budget. Quota cooldowns honour `Retry-After` (60 seconds by default); transient outage cooldowns last 20 seconds. The next request returns to Gemini once its cooldown expires. Rate limits imposed by the website itself are not bypassed. Both providers retain their own quotas; automatic switching does not create unlimited free access. No billing upgrades are enabled by the application.

Keys: https://aistudio.google.com/apikey

Official API reference: https://aistudio.google.com/api-reference/generate-content/generate-content

Image input: https://aistudio.google.com/docs/image-understanding

Pricing and Google data-use terms: https://aistudio.google.com/docs/pricing

## Behaviour

- Professional doctoral-level reasoning across all 28 Earth science fields, with concise answers by default. Swingo does not claim human qualifications or omniscience.
- Website language EN/FR/AR sets the default response language. Explicit requests to translate or use another supported language take precedence.
- Focus options: Auto, Rocks, Minerals, Fossils, Maps & diagrams, Geonara help.
- A maintained platform guide describes actual routes, features, privacy settings, upload limits and limitations. Current catalogue counts and up to three relevant sourced dictionary extracts are added from the site's files. It does not read private account information or act on the user's behalf.
- Image observations and interpretation are separated. Uncertain identification remains tentative; unmeasured properties, precise ages/species and illegible labels must not be invented. Unknown or poor-quality images prompt a targeted request for more evidence.
- Inline JPEG/PNG/WebP data only, validated by media signature and request limits. No remote image URL fetching. The browser resizes/compresses uploads before sending. A photo can be sent without entering a question.
- Gemini content filters block medium/high-risk harassment, hate speech, explicit sexual content and dangerous content. Groq receives the same professional and scientific safety instructions; provider moderation capabilities differ. A safety-blocked request is never passed to another provider. The prompt treats text embedded in images and history as untrusted data. These controls reduce risk; they do not guarantee factual correctness or eliminate prompt injection.
- Up to eight recent text messages are sent for context. Images are attached to the current request only; reattach an image if a later question needs it. Requests go to Google Gemini or, during fallback, Groq. No emails, account tokens or private notebooks are automatically included. Each provider receives only its own key in server-side headers.
- Per-account limits, a pending-request guard, bounded concurrency, safe quota/timeout/block messages, and removal of internal thinking from responses. Provider error details and keys are never returned to visitors.

## Checks

`npm run check` includes mocked Gemini/Groq checks without paid/provider requests. `node tools/check-swingo-live.mjs` explicitly sends three short prompts (EN/FR/AR), including a synthetic layered image, to verify the configured key and models. Add `--groq-backup` to simulate a Gemini quota error locally and send the requests through the actual Groq backup; this does not deliberately exhaust Google's quota. Add `--language=ar` (or `en`/`fr`) to test one language. It prints only the answers, never the keys. Free-tier token limits can require waiting between live tests.
