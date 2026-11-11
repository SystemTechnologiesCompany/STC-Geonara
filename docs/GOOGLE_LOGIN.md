# Google-only accounts

Google is the only account sign-in method. There are no passwords, email-code logins, or alternative provider buttons. The supplied root `google.svg` is used for the navigation entry and the unconfigured Google button; once configured, the official Google Identity Services button handles sign-in. Logged-out visitors can only view the landing page and Google sign-in. Every other page requires a verified Google account, including reading dictionaries, fossils, research, Community, the notebook, messages, and Swingo. All non-auth API endpoints reject anonymous requests. Full dictionary data, reference datasets and fossil chunks are served only to authenticated sessions; reference scripts load after sign-in.

## Activate Google sign-in

No Google Web Client ID has been supplied yet. The site correctly shows that sign-in is unavailable until setup is complete. A live Google login has therefore not been tested.

1. Open [Google Cloud Console credentials](https://console.cloud.google.com/apis/credentials), choose/create your project, and configure its Google Auth Platform branding/audience.
2. Create an OAuth client with application type **Web application**. Add `http://localhost:5500` and `http://127.0.0.1:5500` as authorized JavaScript origins. Add the actual HTTPS origin when deploying. Origins have no path or trailing slash. Configure testing users if the Google project remains in testing mode.
3. Copy its **Client ID**, ending in `.apps.googleusercontent.com`, into `.data/google-client-id.txt`, or set `GOOGLE_CLIENT_ID` in the server environment. This flow does not require a client secret. Do not use a different application's client ID.
4. Put the Google email addresses allowed to review research in `.data/google-admin-emails.txt`, separated by commas, or set `GOOGLE_ADMIN_EMAILS`. A visitor cannot choose or change their own admin role. The previous research admin-key login is disabled.
5. Restart with `npm start`, then use a normal Chrome/Edge browser at `http://localhost:5500/#login`. Google sign-in requires the server and an authorized origin; double-clicking index.html cannot authenticate. Embedded browsers may be restricted by Google.

The server reads the two optional `.data` configuration files if environment values are absent. It does not automatically load `.env`. Google setup may require the project owner to accept Google terms or publish/verify the consent screen; those external steps have not been performed.

## Accounts and persistence

Google Identity Services returns a credential with a server-issued, cookie-bound ten-minute nonce. The server uses Google's official `google-auth-library` to verify the signature and audience, then checks issuer, expiry, verified email, subject and nonce. Nonces are single-use. Google subjects, rather than user-supplied names/emails or editable browser IDs, establish account identity.

The server issues a new seven-day random HttpOnly, SameSite=Strict session cookie. Only its SHA-256 hash is persisted, in `.data/accounts.json`, alongside account profiles and saved research. No Google credential is put into localStorage or stored on the server. Sign-out revokes the session; sessions survive a restart until expiration or sign-out. HTTPS connections receive Secure cookies. A production reverse proxy should forward traffic over TLS to Node or apply Secure cookie handling at its trusted boundary; do not expose this loopback preview server directly.

Profiles and saved research sync across devices after Google sign-in. Browser chat/message caches are separated by account ID. Field-notebook observations remain in the existing browser-local IndexedDB. Older anonymous posts remain readable but are not silently assigned to whichever account next signs in. Newly created posts, likes, staged media and research use the verified account ID; incoming client author/avatar/role fields do not establish identity or admin access. Community author names and avatars are taken from the server profile.

Configuration/session endpoints: GET `/api/auth/session`, POST `/api/auth/google`, POST `/api/auth/logout`, PATCH `/api/auth/profile`. Research review uses the same Google session and the server's email allowlist. There is no separate admin password/key session.

Automated checks inject token verification results to exercise invalid claims, replay protection, session flags and persistence, logout, account ownership across devices, profile synchronization, forged-author rejection, admin restrictions, and anonymous-write rejection. Actual Google signature verification is delegated to the official library; a real Google account login still needs the project's Client ID and authorized origins.

Sources: [Google setup](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid), [server verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token), [button API](https://developers.google.com/identity/gsi/web/reference/js-reference).
