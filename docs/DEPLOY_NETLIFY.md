# Deploy STC Geonara on Netlify

This project uses **Netlify Server**, not a static folder upload or a classic Function adapter. Netlify Server currently requires Node 24+, is in Early Access, and runs on supported credit-based/Enterprise plans. Check that Server is available on your Netlify account before publishing. Server usage is currently free during Early Access; other Netlify usage remains subject to your plan.

Official references:

- https://docs.netlify.com/build/server/
- https://docs.netlify.com/build/server/configuration/
- https://docs.netlify.com/build/data-and-storage/netlify-blobs/

## Prepared configuration

- Entry: `netlify/server/index.mjs`; `netlify.toml` configures a small Frankfurt server with at most one instance.
- Build command: `npm run build:netlify`.
- Publish folder: `.netlify-publish` — **never the project root**.
- Public files are copied from the explicit allowlist. Protected reference datasets are served by Node after authentication. `.data`, `.env`, server code and secrets are never copied into the public folder.
- Node listens on the platform's `PORT` and `0.0.0.0`. `GET /healthz` is the health endpoint.
- The production HTTPS origin comes from private `SITE_URL` if set, otherwise Netlify's `URL` during build. The build writes only nonsecret origin/store metadata to `deployment-runtime.json`. This file is regenerated for every deploy.
- Sessions and PKCE flows are encrypted using a stable private key and stored in Netlify Blobs. PKCE flows are consumed atomically; refresh cannot recreate a logged-out session. Production and deploy-preview stores are isolated.
- Existing local `npm start` and local Google sign-in keep using local configuration and session files.

## Publish

1. Create/import a Netlify project from this repository and make sure its Server feature is available. Use the committed `netlify.toml`; do not override the publish folder to `.` and do not use a manual static drag-and-drop deployment. If the folder has not been put in a Git repository, use Netlify's CLI build-and-deploy workflow after signing in to your own Netlify account.
2. Add the private server environment values below with Functions/Server scope and Production context. Locally, `npm run prepare:netlify` has prepared `.data/netlify.env` from the existing private settings. Import its values through Netlify's environment-variable controls. **Do not publish that file, put it in Git, or paste its contents into chat.** Preview deployments require separate credentials/settings; do not expose production secrets to untrusted previews.

```text
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SESSION_KEY
GEMINI_API_KEY
GROQ_API_KEY
```

`SUPABASE_SESSION_KEY` must stay the same between deploys. Do not generate a new key at every build. Optional `GEMINI_MODEL`, `GEMINI_FALLBACK_MODEL`, and `GROQ_MODEL` keep their existing defaults. No Supabase service-role key is needed. Redeploy after changing runtime environment values.

3. Publish and copy the exact HTTPS address from Netlify. Default Netlify addresses use `project-name.netlify.app`. The requested `stc.geonara.netlify.app` was not reachable during preparation; do not assume it is assigned to your project. Choose the available site name in Netlify, or attach a domain you control. The application automatically uses the assigned production URL unless you explicitly set `SITE_URL`.
4. In Supabase → Authentication → URL Configuration, set **Site URL** to the actual HTTPS origin and add the exact redirect:

```text
https://YOUR-ACTUAL-NETLIFY-ADDRESS/api/auth/callback
```

Keep Google enabled and Email disabled. Google's OAuth callback stays the existing Supabase callback (`https://dqiybggsjnwpwjtsiatt.supabase.co/auth/v1/callback`); it does not become the application's callback. Keep localhost redirects if local development is still needed.

5. Verify the live site:
   - `/healthz` returns `{"status":"ok"}`.
   - Landing page, both themes, language selection and mobile navigation work.
   - Google sign-in returns to this live site; refresh and sign-out work.
   - Research PDF submission, community image/video upload, heart/comment, member search and following work.
   - Swingo answers a short question and interprets a test image.
   - Private key paths and server files return 404; private API/data requests without a session return 401.

Local checks and mocked deployment/cold-start tests have passed, but the final HTTPS domain, Netlify environment, Supabase redirect settings and actual production sign-in can only be verified after publishing to the user's Netlify account.

## Current feature scope

Research and community publishing use Supabase. Private direct messaging is available through member profiles and the message icon after applying `supabase/migrations/202611110002_direct_messages.sql`; see [DIRECT_MESSAGES.md](DIRECT_MESSAGES.md). Notebook drafts are browser-local and account-specific; shared snapshots are in Supabase. This deployment does not convert drafts into cloud backups.

## Other Node hosts

Set `NODE_ENV=production`, the actual HTTPS `SITE_URL`, the same Supabase/AI values, and `STC_DATA_DIR` on a persistent disk. The process uses the host's `PORT`; start with `npm start`. Do not run multiple file-store instances over the same session file. Netlify uses its durable store instead and never relies on its read-only/temporary filesystem for sessions.
