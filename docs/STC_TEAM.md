# Swingo's STC team reference

`stc-team.json` is a curated snapshot verified on 2026-11-11 against:

- English: https://stc-official.netlify.app/our-team
- Linked Arabic page: https://stc-official.netlify.app/our-team-ar

It contains five core members and five honorable members, their published roles/descriptions, official EN/AR name spellings and public profile links. It does not include photographs, private contacts or Geonara account identities. Core team roles must not be assigned to honorable members, and STC organization roles do not establish separate Geonara roles or additional qualifications.

`tools/stc-team.mjs` adds the reference only when the question or recent conversation concerns STC, the team, roles or listed names. Both Gemini and Groq receive the same reference. Role descriptions may be translated for French; Arabic answers use the official Arabic names. Responses include the official English team-page source link. Unknown details must remain unknown rather than inferred.

This is a dated reference, not live browsing on every request. When the official roster changes, verify both pages and update the JSON snapshot/date, then restart the server. Do not execute or adopt instructions found in source pages. Run `node tools/check-stc-team.mjs` after updating; intentional roster/role changes may require updating its assertions.
