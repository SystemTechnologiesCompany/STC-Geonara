# Complete reference datasets

Snapshot retrieved 8 November 2026. The interface uses locally bundled data and works without a remote catalogue service. Search results are paged at 30 records; original scientific names remain searchable across interface languages. English/French timescale labels follow the source where supplied. Major Arabic interval names and all controls are localized; scientific names without an Arabic equivalent retain their international spelling.

## Geological time: 189 units

The [ICS digital chart](https://github.com/i-c-stratigraphy/chart/blob/main/chart.ttl), linked from the [official ICS supplementary page](https://stratigraphy.org/supplementary), supplies 178 unique dated units. The importer supports multiple ranks on one unit: Pridoli is both an epoch and an age, and appears once in the hierarchy while matching both filters.

The [official 2026/06 chart](https://stratigraphy.org/ICSchart/ChronostratChart2026-06.pdf) supplies eleven further ratified subepochs/subseries: three each for the Holocene, Pleistocene, and Miocene, and two for the Pliocene. Their boundaries are taken from their component ages; those ages are nested under the appropriate subepoch. This produces 189 unique units, from the Precambrian supereon through individual stages/ages. Formal unnamed placeholders remain represented. Regional time divisions outside the international chart are not added as invented global units.

Two inconsistencies in the downloaded RDF are reconciled against the official PDF: Ludlow ends at 422.7 Ma, and Aquitanian begins at 23.04 Ma. Chronological adjacency and complete parent coverage are checked. Early/Middle/Late labels are expanded from source identifiers where the RDF omits a readable label. Boundary uncertainty and approximate ages are retained. The Hadean begins at the chart's formal 4567 Ma; this differs from the approximate 4.54-billion-year age of Earth used by the home-page hero.

Attribution: Cohen, K.M., Harper, D.A.T., Gibbard, P.L. and Car, N. (2025), *The ICS international chronostratigraphic chart this decade*, Episodes 48:105–115, with the ICS 2026/06 chart and downloaded digital updates. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Source colours are retained, with muted backgrounds in the interface. The selector is a hierarchical reference, not a proportionally scaled time-axis graphic.

## Minerals: 6,252 species

Source: IMA-CNMNC, Marco Pasero and contributors, [The New IMA List of Minerals, November 2026](https://cnmnc.units.it/files/editor/IMA_Master_List_(2026-11).pdf), distributed through the [official CNMNC website](https://cnmnc.units.it/).

The entire 6,252-species list is imported: international name, approved formula, IMA status, number/year, type-locality country, and source page. PDF positions distinguish subscripts from superscripts. Record IDs are stable hashes of names. Approved, grandfathered, redefined, renamed, and questionable statuses retain the source distinctions. A reference record is not a claim that hardness, texture, photographs, or formation data have been supplied for every species; these richer fields remain available in the separate illustrated field guide.

The source and derived mineral records are licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Changes: extraction into structured records; Unicode formula formatting; stable IDs; pagination/search and field-note integration. Retain the attribution and share-alike terms when redistributing these mineral records. These terms apply to the mineral dataset, not independently authored website code.

## Rocks and sediments: 3,668 names

Source: British Geological Survey © UKRI, 2026, [DIC_ROCK_ALL](https://webapps.bgs.ac.uk/data/vocabularies/dictionary.cfm?name=DIC_ROCK_ALL), [downloaded vocabulary](https://webservices.bgs.ac.uk/data/services/vocabulary/1.0/vocabularies/DIC_ROCK_ALL.xls). The BGS [vocabulary repository](https://github.com/BritishGeologicalSurvey/vocabularies) and [linked-data portal](https://vocab.bgs.ac.uk/v) document the Open Government Licence terms for the BGS vocabularies. Attribution is retained in the interface and here; see [OGL 3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

This is the complete non-administrative set in that download: 3,022 root-name entries and 646 composite names, including 223 historical/obsolete codes. Nine administrative dummy codes are excluded. Rock-name, name-type, current/obsolete status, and original BGS code are preserved; long source definitions and staff metadata are not republished. Rock names can be qualified and combined indefinitely, so this reference defines its coverage by the named classification scheme rather than claiming every possible regional name or mixture.

## Rebuild and checks

Raw source files live in `docs/catalogue-sources`. Browser assets are `catalogue-data.js` and `timescale-data.js`; structured reference records live in `assets/reference`.

1. Run `tools/import-mineral-reference.py` with Python and `pdfplumber` to extract the IMA PDF.
2. Run `tools/import-rock-reference.py` with Python and `xlrd` to extract the BGS XLS. The development reader was installed in `.cache/catalogue-python`; no package is needed by the website at runtime.
3. Run `node tools/build-reference-data.mjs` to generate the browser assets.
4. Run `npm run check` to validate record totals, stable IDs, tree reachability, age filtering, formulas, chronology, notebook selection, and translations.

Reference specimens can be selected from either full index and added to a field observation. The field-note editor includes the chosen reference entry without putting thousands of choices into a native dropdown. Swingo's curated reference answers recognize exact names and timescale units; live model access still requires the server-side provider key described in `DISCOVERY.md`.
