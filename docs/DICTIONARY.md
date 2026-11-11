# Earth science dictionary

The active dictionary contains **5,175 concepts with English definitions across 28 disciplines**, including **500 concepts reachable under Petroleum Geology**. The original 15 concepts and their translations remain available. The collection includes geology, hydrology, geophysics, oceans, climate, atmosphere, soils, ecology, remote sensing, natural hazards, and related fields. See [petroleum collection scope and references](PETROLEUM_DICTIONARY.md).

## Sources and attribution

Source snapshots retrieved on 8 November 2026 are retained in `docs/catalogue-sources/`.

- **European Environment Agency, GEMET 4.2.3**, licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). [Official RDF downloads](https://www.eionet.europa.eu/gemet/en/exports/rdf/latest). Preferred names, definitions, and available French/Arabic translations are preserved. Whitespace, HTML formatting, and uppercase labels are normalized for display.
- **US Geological Survey, USGS Thesaurus**. The RDF identifies the vocabulary as public domain. [Official RDF](https://apps.usgs.gov/thesaurus/download/USGSThesaurus.rdf). Scientific terms with substantive scope notes are included; institutional and product branches are excluded.
- **NASA Global Change Master Directory (GCMD), Science Keywords, version 25.1**. [Official science keyword service](https://gcmd.earthdata.nasa.gov/kms/concepts/concept_scheme/sciencekeywords?format=rdf&page_num=1&page_size=2000). NASA GCMD Science Keywords supply definitions across Earth system disciplines. Citation: NASA Global Change Master Directory (GCMD), Science Keywords, version 25.1, accessed 8 November 2026. [GCMD community guide](https://www.earthdata.nasa.gov/sites/default/files/imported/KeywordsCommunityGuide_Baseline_v1_SIGNED_FINAL.pdf).
- **STC Geonara**: the original 15 entries, plus concise authored definitions and translations for essential concepts. These are identified separately from agency definitions. The authored “Geoid characteristics” entry replaces a misleading imported description with an equipotential-surface definition. Essential concepts and this correction are maintained in `tools/dictionary-essentials.mjs`.

Every imported record retains its originating source and official concept URL. Preferred English names are deduplicated after normalization, with GEMET taking priority over USGS and NASA. This is an interdisciplinary glossary, not a claim to enumerate every scientific term.

## Definitions and translations

Only records with substantive English definitions are counted; empty entries, redirect-only text, and placeholders are excluded. No generated naming combinations or template definitions are used to inflate the total. Some closely related source concepts legitimately share definitions.

The interface supports English, French, and Arabic. Search covers available names, synonyms, definitions, and localized disciplines. Source-provided translated definitions are used when present. French and Arabic definition coverage is partial: an **EN** badge identifies an English fallback, including in the full-definition reader. Translated names alone do not imply a translated definition.

## Website behavior

Metadata loads with the site; the larger definition collection loads only when the dictionary or its Swingo lookup is used. Cards show 24 concepts per page, definition previews, full-definition readers, translated names, and credits. Filters combine search, discipline, and initial letter. Exact concept-name matches rank before definition-only matches. Swingo can retrieve definitions from this same collection when its existing curated answers do not match.

## Rebuild and validate

Run from the project root using Python 3 and Node.js 18 or newer:

```text
python tools/import-earth-dictionary.py
node tools/build-earth-dictionary.mjs
npm run check
```

The importer reads the retained source snapshots into `assets/reference/earth-dictionary.json`. The builder merges preserved original entries and authored essentials, then writes `earth-dictionary-meta.js` and `earth-dictionary-data.js`. `earth-dictionary.js` provides the display and search behavior. Checks cover counts, substantive definitions, unique names and IDs, disciplinary coverage, multilingual matching and fallback, safe source links, search ranking, and Swingo retrieval.
