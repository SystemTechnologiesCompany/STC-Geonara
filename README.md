# STC Geonara

A refreshed, responsive Earth science website with Swingo AI.

## Open the website

Double-click `index.html`, or run `npm start` and visit http://127.0.0.1:5500. Node.js 18 or newer is needed for the local server. No installation is required. The explorer, timeline, notebook, and curated Swingo answers work without API keys. Run the server for community discussions; live Swingo responses require a server-side key. The website can run directly from its files; optional Google Fonts fall back to system fonts when offline.

## What works

- Animated terrain hero with pointer-following ripples and stronger waves while pressing, responsive navigation, custom vector artwork, and reduced-motion support.
- Floating liquid-glass navbar with responsive dropdown navigation and active-page pills.
- Circular theme transition: dark mode expands from the switch and contracts back into it when returning to light mode. Reduced-motion preferences and browsers without view transitions use an immediate switch.
- Liquid-glass tool cards with pointer-following highlights, gentle tilt, staggered entrances, and reduced-motion support.
- English, French, and Arabic language selector beside the dark mode switch, saved language/theme choices, and Arabic RTL layouts.
- Localized forms, catalogue examples, dictionary definitions, and prepared assistant responses. User-entered text is preserved.
- Dictionary with 5,175 defined concepts across 28 disciplines, including 500 petroleum geology concepts covering 14 topic groups. Multilingual search, discipline/alphabet filters, pagination, and full-definition readers. Source-provided French and Arabic translations are retained; unavailable translations display the English definition with an EN badge. See `docs/DICTIONARY.md` and `docs/PETROLEUM_DICTIONARY.md`.
- Eight research topic cards with search, topic filters, and saved collections.
- Full reference catalogues with 6,252 IMA mineral species and 3,668 BGS rock/sediment names, plus the illustrated field guide. Search, alphabetical/status filters, comparisons, pagination, and field-note links. See `docs/REFERENCE_SOURCES.md`.
- Complete international geological hierarchy with 189 units, including individual ages and eleven subepochs, uncertainty values, search, rank filtering, and expandable parent/child relationships.
- Field notebook with photos, dates, locations, coordinates, editing, delete/undo, and JSON import/export.
- Server-backed community questions and discoveries, search, filters, replies, and session ownership.
- Swingo AI catalogue explanations and comparisons, conversation history, and a server integration for live text/image questions. See `docs/DISCOVERY.md` for setup.
- Fictional-contact messaging preview and editable local profile.
- Red unread counters on the Messages icon and conversation list, with per-chat read status and an incoming-message integration hook. See `docs/MESSAGING.md`.
- Local profile picture selection (JPG, PNG, WebP up to 10 MB), centered 256 px previews, removal, and matching navbar avatar.
- Sixteen themed preset avatars, a saved random default for new local profiles, and a multilingual avatar picker with a “Surprise me” option. Uploaded photos take priority; choosing an avatar replaces the photo.
- Consistent glass utility buttons, keyboard navigation, labelled forms, live feedback, safe text rendering, and local storage fallbacks.

## Current limits

This remains a local interactive prototype. It does not provide production account authentication, live research retrieval, or private message delivery. The notebook uses browser IndexedDB; community posts persist in a local server JSON file. Live AI requires the owner to configure a server-side provider key. Research cards describe educational topics rather than verified publications. Dictionary definitions and translations need scientific editorial review. The interface supports English, French, and Arabic, with right-to-left Arabic layouts. Interface and educational-content translations are local; no automatic translation service is used.

No personal passwords are collected. Profile details, private message previews, saved records, and assistant conversations are stored in this browser. Community discussions are shared through the local server. Live Swingo requests send the question, recent conversation context, and any attached image to OpenAI. Reset them from Your workspace when needed.

## Project structure

- `index.html`, `styles.css`, `app.js`, `data.js`, `i18n.js`, `terrain.js`, `messages.js`, `avatars.js`: active website, translations, terrain, messaging, and preset avatar catalogue.
- `assets/`: local logo, icons, terrain artwork, and adapted preset avatars. Original supplied SVGs remain in the project root.
- `tools/`: dependency-free local server, asset generator, and content checks.
- `docs/PROJECT_REVIEW.md`: review of the supplied project and remaining implementation work.
- `docs/source/`: original Word specifications and a searchable text extraction.
- `archive/`: original ZIP, original dashboard, and extracted interactive prototype.

## Validation

Run `npm run check` to check JavaScript syntax, data integrity, assistant examples, and required assets. Import newly supplied avatar SVGs with `node tools/import-avatars.mjs` (duplicate files are skipped and existing choices retain their IDs). Regenerate the terrain asset with `node tools/generate-terrain.mjs`.

The server only serves the active website files and assets, rather than exposing the specification documents or archives.
