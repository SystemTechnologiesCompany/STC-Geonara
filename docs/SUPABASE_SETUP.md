# Connect STC Geonara to Supabase

The integration is prepared but is **not connected to a live project yet**. No Supabase project has been supplied or created in this session. Local account/database behavior remains available until Supabase is configured. Node 22 or newer is required.

## 1. Create your project

Open https://supabase.com/dashboard, sign in, and create a project named **STC Geonara** in your organisation. Choose your preferred region. Set the database password yourself and keep it private. Wait for the project to finish provisioning.

In the project's Connect dialog or Settings → API Keys, copy the **Project URL** and **publishable key** (`sb_publishable_…`). A legacy `anon` key also works. These are sufficient for this integration. **Do not send a database password, secret key, service-role key, Google client secret, or access token in chat.** The application explicitly rejects secret/service-role keys.

## 2. Create the database and upload buckets

Open the project's SQL Editor. Paste and run the contents of `supabase/migrations/202611100001_geonara.sql` once, in this new project. It creates profiles, posts, comments, hearts, media metadata, research, admin rules, two private storage buckets, and row-level access policies.

Then apply `supabase/migrations/202611100002_members.sql` once. It adds member search, public profile projections, following, and opt-in shared notebooks. Next apply `supabase/migrations/202611100003_short_member_ids.sql` to assign permanent `STC-XXXXXX` member IDs. For an existing project, apply only migrations not already installed.

To grant research-review rights to your own Google email, run this separately with your actual email:

```sql
insert into public.geonara_admins(email)
values (lower('YOUR_GOOGLE_EMAIL'))
on conflict (email) do nothing;
```

Accounts cannot grant themselves admin status. Anonymous database reads and file downloads are blocked. Approved research and published media are readable by signed-in Google members; pending research remains private to its owner and admins.

## 3. Enable Google only

In Supabase Authentication → Sign In / Providers, enable **Google** and disable Email and other providers. Supabase requires your own Google Web OAuth Client ID **and Client Secret**. Enter the secret only in the Supabase Dashboard.

In Google Cloud, configure your OAuth consent screen and a Web application client. Add the callback URL shown in Supabase, typically `https://YOUR_PROJECT.supabase.co/auth/v1/callback`, to Google's authorized redirect URIs. This differs from the site's local callback. Configure Google testing users if your consent screen is in testing mode.

In Supabase Authentication → URL Configuration, set Site URL to `http://localhost:5500` for development and add these Redirect URLs:

```text
http://localhost:5500/api/auth/callback
http://127.0.0.1:5500/api/auth/callback
```

When deploying, set the actual HTTPS website origin and add its exact `/api/auth/callback` URL. The website still needs its Node server; static-only Netlify hosting cannot run its existing `/api` endpoints. No deployment or hosting change was made here.

## 4. Save the project connection

From the STC Geonara folder, run:

```powershell
node tools/configure-supabase.mjs --url "https://YOUR_PROJECT.supabase.co" --key "YOUR_PUBLISHABLE_KEY"
node tools/check-supabase-connection.mjs
npm start
```

Alternatively set `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (or `SUPABASE_ANON_KEY`), and `SITE_URL` in the server environment. The helper writes only `.data/supabase.json`, excluded from version control and static serving. `.env` is not automatically loaded. No service-role key is needed.

Open http://localhost:5500 and choose Google sign-in. Logged-out visitors retain landing-page-only access. After sign-in, accounts, saved research, posts, comments, hearts, submissions and uploads use Supabase. Bulk scientific catalogues remain packaged reference data, served only to signed-in members.

## What is connected

Google OAuth uses server-side PKCE. The browser holds a random HttpOnly session cookie; Supabase access and refresh tokens remain encrypted on the server. The default encryption key is generated privately in `.data/supabase-session-key.txt`; keep that file and `.data/supabase-sessions.json` together across local restarts. Production should use a persistent private data directory or set `SUPABASE_SESSION_KEY` to a stable random 64-character hex key in its secret environment. Never expose these files publicly. Sign-out revokes the current Supabase session and the local cookie.

Database and storage requests use the member's verified access token and the publishable key, so RLS also applies to server requests. Atomic database functions publish a post with its attachments and review a pending research submission. Files use private buckets; server-authorized short-lived signed links are proxied without exposing tokens to the page, with video byte ranges and PDF attachment headers preserved.

The previous `.data` files are left untouched. Existing local users/content are **not automatically copied or assigned to new Supabase account IDs**. Field notebook drafts use account-specific browser storage. Members can import an earlier browser notebook explicitly, then publish a shared snapshot to Supabase if they choose. Chat/message caches and scientific reference datasets are not converted to Supabase tables.

## Validation

`npm run check` includes actual SQL execution in a local PostgreSQL engine, RLS ownership/anonymous-read tests, private upload/PDF access, admin review, unique hearts, and mocked server-side OAuth/session tests. These do not prove a live project's provider settings, credentials, network access or storage streaming. Run the connection checker and complete a real Google login after configuring your project.

Official references: [Google provider](https://supabase.com/docs/guides/auth/social-sign-in/auth-google), [PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow), [private storage](https://supabase.com/docs/guides/storage/buckets/fundamentals), [RLS](https://supabase.com/docs/guides/storage/security/access-control), [API keys](https://supabase.com/docs/guides/getting-started/api-keys).
