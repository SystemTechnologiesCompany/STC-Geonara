# Research submissions

Account update: publishing and private account actions now require Google sign-in. Research moderation uses Google admin emails; the old admin-key sign-in is disabled. See [Google-only accounts](GOOGLE_LOGIN.md) for current setup and identity rules.

Research discovery displays approved member submissions, replacing the sample catalogue on that page. Members submit a title, authors, abstract, topic, year, and an uploaded PDF and/or HTTPS publication link. Both topic dropdowns include all 28 Earth science fields represented in the dictionary, translated into English, French, and Arabic. New submissions must select one of those fields. Search, topic filters, and saved publications apply to published submissions.

Google accounts identify submitters. “My submissions” is private to that Google account and available across devices after sign-in. Authors listed on a manuscript remain user-supplied attribution.

Run `npm start` and open http://localhost:5500. Configure the Google Client ID and research administrator Google emails as described in [Google-only accounts](GOOGLE_LOGIN.md). Submitted research remains private until an authorized Google administrator approves it.

Records persist in `.data/research.json` with serialized atomic writes. PDFs are limited to 10 MiB, checked for PDF header/end markers, and stored separately under generated UUID names in `.data/research-pdfs`. These checks are format checks, not malware scanning. Downloads are served as attachments with a sandbox policy and nosniff. Pending/rejected files can only be downloaded by the submitting browser or an authenticated admin; approved files become publicly downloadable. PDF bytes never appear in feed JSON. A failed record save removes its newly written attachment.

Pending/rejected records and ownership hashes never appear in the public feed. No client-supplied status or role can publish a submission. Links must use HTTPS and cannot contain credentials. Links are never fetched by the server. Login/submission rate limits, field limits, origin checks, review-state checks, and capacity limits are enforced. Back up both the metadata and PDF directory together.

API: GET/POST `/api/research`; GET `/api/research/mine`; GET/POST/DELETE `/api/research/session`; GET/POST `/api/research/review`; GET/HEAD `/api/research/:id/pdf`. Submission JSON optionally includes `pdf: {name, base64}`; at least a PDF or URL is required. Static hosting alone cannot run these endpoints. A public rollout still needs persistent server storage, HTTPS, backups, and verified accounts if identity assurance is required.
