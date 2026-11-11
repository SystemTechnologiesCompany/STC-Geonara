# Fossils in Palaeontology

Open Dictionary, choose Palaeontology, then Fossils. Concepts remains a separate tab with the existing definitions. The fossil catalogue supports name search, 27 broad group filters, genus/species filters, 24-record pagination, full details, and comparison of two taxa across classification, recorded age bounds, intervals, occurrence counts, diet, life habit, mobility, and environment. Selection persists across search and pagination and can be removed individually or cleared.

## Coverage and provenance

The 2026-11-10 Paleobiology Database snapshot contains **245,414 accepted taxa with recorded occurrences: 71,857 genera and 173,557 species**. The import queries all Life, ranks genus and species, accepted status, and minimum age zero, then keeps records with positive occurrence counts. Both extinct and extant taxa represented in the fossil-record database are included. This is a PBDB snapshot, not a claim to catalogue every fossil species ever named or every fossil specimen. Names, ranks and classifications follow PBDB and can change after taxonomic revision.

Source query is retained in `fossil-meta.js`; `tools/import-fossils.mjs` is the reproducible importer. Its raw 124 MB response is cached in ignored `.cache/fossils-pbdb.json`. Generated assets total about 54 MB: a compact searchable name index plus 26 alphabetical detail chunks. The catalogue loads only when its tab is opened, and details are loaded for the visible page and comparison. Ordinary dictionary pages do not download this catalogue. All data is packaged locally and uses script loading, so double-clicking index.html works without a server or live API.

PBDB API documentation: https://paleobiodb.org/data1.2/taxa/list_doc.html . Record links lead to the original PBDB taxon. Brief morphological group notes are original paraphrases based on the linked British Geological Survey fossil guides, not copied species descriptions. Decorative line symbols are category motifs, not specimen photographs.

## Scientific interpretation

Each description is composed from the actual taxon name, rank, family and broad group. Taxon-specific ecological characteristics are retained from PBDB; those may be inherited from higher taxa in the source database and are not newly measured specimen properties. Missing fields are labelled “Not recorded.” Ages use `firstapp_max_ma` (`fea`) and `lastapp_min_ma` (`lla`): the outer bounds of recorded occurrences, **not exact origination/extinction dates**. Historic records, broad age assignments and outliers can widen them. The catalogue does not silently replace these with textbook ranges.

Classification groups are convenient browsing categories derived from the source lineage; “Other” groups retain unusual or incompletely classified taxa. Only groups with verified morphological notes show those notes, labelled as group characteristics. Species-level diagnostic descriptions or images are not invented. UI controls and generated descriptions are localized in English, French and Arabic; scientific names and source ecology vocabulary are retained verbatim.

Run `node tools/import-fossils.mjs` to rebuild from the retained response. To intentionally retrieve a new snapshot, first archive or remove that single cache file, then rerun the importer. Run `npm run check` for provenance/count consistency, complete detail coverage, scientific field handling, search/filter logic, comparison properties, translations and direct-file compatibility.
