# Discovery tools

The new sections are linked from Discover in the navbar and the home page. No quizzes, scores, or badges were added.

## Rock and mineral explorer

The separate illustrated field guide contains twelve specimens with multilingual formation notes, textures, identification clues, and stylized vector illustrations. Search in English, French, or Arabic; filter by rock/mineral or group; compare up to two specimens. Details link directly to a new field observation or a Swingo question. Mineral hardness is a property of minerals; a dash is shown for whole rocks, which have variable mineral compositions. Illustrations are schematic, not identification photographs.

Reference sources:

- [NPS minerals](https://www.nps.gov/subjects/geology/minerals.htm) and [Mohs hardness](https://home.nps.gov/articles/mohs-hardness-scale.htm).
- [NPS igneous rocks](https://www.nps.gov/subjects/geology/igneous.htm), [sedimentary rocks](https://www.nps.gov/subjects/geology/sedimentary.htm), and [metamorphic rocks](https://www.nps.gov/subjects/geology/metamorphic.htm).
- [USGS rock/mineral distinction](https://www.usgs.gov/faqs/what-difference-between-a-rock-and-a-mineral).

## Geological timeline

The full hierarchy contains 189 international units, including individual ages and eleven subepochs. Search by name, filter by rank, expand or collapse branches, and inspect parent/child relationships, exact boundaries, approximate values, and uncertainties. The former six-interval summaries remain as geological context in the detail panel. See `REFERENCE_SOURCES.md` for data provenance, coverage, licensing, and the current ICS cross-check.

## Field notebook

Observations are stored in IndexedDB (`stc_geonara_field`, `observations` store). Each contains a title, date, optional specimen, location, paired coordinates, notes, and one photograph. Photos are resized with their aspect ratio preserved to a maximum 1200 px edge. They are never sent to the server automatically. Edits persist; deletion is a soft delete and offers Undo. Export writes active records to JSON. Import validates the entire file, rejects unsafe image URLs and invalid coordinates, and adds records with fresh IDs without overwriting existing observations.

Notebook data belongs to this browser and origin. Export it before clearing browser storage or moving to another device. The profile reset button retains its previous scope and does not erase the notebook.

## Community discussions

Run `npm start`; static file hosting alone cannot serve these endpoints:

- `GET /api/discussions`: list discussions and replies.
- `POST /api/discussions`: create a question or discovery.
- `POST /api/discussions/:id/replies`: add a reply.
- `DELETE /api/discussions/:id`: delete the current session's discussion.

The local Node server persists discussions in `.data/community.json` through serialized, atomic writes. Browser sessions use a random HttpOnly, SameSite cookie. Only hashes of session tokens are stored. Display names and preset avatars come from the editable profile; they are not verified identities. There are no invented member posts or fake engagement counts. Open views refresh every 15 seconds without replacing a reply being drafted. Search, question/discovery filters, replies, and ownership checks are implemented. Network errors remain visible and retryable.

This is an anonymous local community backend, not production account authentication or a public service. The preview remains bound to `127.0.0.1`. A public launch needs real identity, moderation/reporting, deployment, durable hosted storage, and backups. Existing private Messages remain a separate preview; community posts do not claim to deliver private messages.

## Swingo AI

Catalogue questions, two-specimen comparisons, geological intervals, and existing concept explanations work without a key. They use the site's curated data and link to their educational sources.

The server implements Gemini text and image requests. Configure `GEMINI_API_KEY` in the server environment or `.data/gemini-api-key.txt`, then restart `npm start`. See [GEMINI_SETUP.md](GEMINI_SETUP.md) for models, focus options, safety filters and checks. Never add a real key to website JavaScript, browser storage, source control or screenshots.

`GET /api/status` reports availability without revealing credentials. Authenticated `POST /api/swingo` forwards the question, up to eight recent text messages, selected language/focus and an explicitly attached image to Google Gemini. Requests use bounded output, a shared timeout, per-account rate limits and a concurrent-request guard. Replies render as escaped text. Private notebook photos are never attached automatically. Image interpretations remain tentative rather than definitive identifications.

No AI key was configured during development, so live provider access could not be verified. Automated checks use an injected mock provider to verify the real server's request/response handling, including image inputs, without incurring charges. Unknown questions and images show a setup message when no key is present; they are not presented as generated answers.

## Checks

`npm run check` covers existing features plus catalogue consistency, translations, timeline continuity, notebook import validation, real HTTP discussion creation/replies/ownership/persistence/origin checks, and mocked live text/image AI. Browser checks cover specimen comparisons, linking a specimen to a note, photo preparation, saved notes, editing, delete/undo, JSON export, timeline navigation, mobile RTL layout, the community form, and curated Swingo comparisons.
