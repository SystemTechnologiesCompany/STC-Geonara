# Petroleum geology collection

Expanded on 8 November 2026 from three entries under the petroleum filter to **500 defined concepts across 14 topic groups**. There are **478 new dictionary records**; 22 existing records are reused and also included in Petroleum Geology. The full dictionary now contains **5,175 concepts**.

The topic groups cover:

1. Petroleum systems
2. Organic geochemistry and maturation
3. Basins and reservoir architecture
4. Migration, traps, and seals
5. Petrophysics and pore systems
6. Reservoir fluids, contacts, and pressure
7. Well logs, cores, and formation evaluation
8. Seismic interpretation and exploration
9. Well testing, modeling, and recovery
10. Unconventional resources and geomechanics
11. Resources, volumes, and uncertainty
12. Stratigraphy and reservoir diagenesis
13. Hydrocarbons and fluid chemistry
14. Development and subsurface stewardship

## Editorial scope

The new explanations are original, concise STC Geonara educational definitions. They are not copied from a commercial glossary or attributed to an agency as agency-authored text. This is broad coverage of petroleum geoscience and its closely related technical fields, rather than a finite inventory of every industry term, proprietary method, regional usage, or engineering detail.

Definitions distinguish frequently confused concepts: oil shale and tight oil; original volumes and recoverable resources; reserves and prospective resources; pyrolysis production index and well productivity index; free-water level and an interpreted oil-water contact; laboratory Tmax and geological temperature; and wetting preference and fluid saturation. Maturity windows are described without universal temperature cutoffs. Resource probability definitions specify exceedance probabilities and their evaluation assumptions.

Existing exact-name matches retain their established definitions, translations, source credits, IDs, and original discipline. The Petroleum Geology membership is added separately. Context-dependent terms receive distinct scoped records where the existing definition has another meaning: source-rock TOC rather than water-sample TOC, petroleum biomarkers rather than medical biomarkers, sediment compaction rather than waste compaction, clay exchange capacity, and petroleum bitumen. New records have English definitions; selected key names are also provided in French and Arabic. The established EN fallback badge remains visible where translated definitions are unavailable. Aliases include common abbreviations such as TOC, Ro, MICP, STOIIP, WAG, SCAL, and SAGD. Swingo prioritizes an exact matching name or alias within the selected discipline before falling back to the full dictionary.

## Reference reading

The following primary references were consulted for scientific terminology and distinctions. The collection's authored definitions are maintained separately from those publications.

- USGS, [Petroleum System Definition and Classification Scheme](https://pubs.usgs.gov/bul/1912/report.pdf): system elements, processes, and extent.
- USGS, [New Albany Shale petroleum-system glossary](https://pubs.usgs.gov/of/2003/ofr-03-037/htmltext/glossary.htm): source evaluation, petroleum-system terminology, and pyrolysis indices.
- USGS, [FORSPAN Model Users Guide](https://pubs.usgs.gov/of/2003/ofr-03-354/ofr-03-354.html): total petroleum systems, assessment units, and continuous accumulations.
- USGS, [Source Rock Geochemistry](https://pubs.usgs.gov/of/1989/0488/report.pdf): S1/S2/S3, Tmax, and hydrogen index.
- USGS, [Vitrinite reflectance analysis](https://www.usgs.gov/publications/vitrinite-reflectance-analysis): origin and use of the vitrinite maturity indicator.
- USGS, [Source Rock Properties Used in Petroleum System Models](https://pubs.usgs.gov/of/2012/1046/report/OF12-1046.pdf): source richness and initial generation potential.
- U.S. Department of Energy, [Enhanced Oil Recovery](https://www.energy.gov/hgeo/enhanced-oil-recovery): thermal, gas, and chemical recovery mechanisms.
- U.S. Department of Energy, [Oil & Gas Geologic Endowment](https://www.energy.gov/sites/default/files/2022-10/1-1_Oil_and_Gas_Geologic_Endowment_Paper.pdf): geological framework and reserve/resource distinctions.
- EIA, [Natural gas explained](https://www.eia.gov/energyexplained/natural-gas/): natural-gas composition, liquids, and wet/dry terminology.
- EIA, [Crude oil reserve table definitions](https://www.eia.gov/dnav/pet/TblDefs/pet_crd_npres_tbldef2.asp): reservoir and proved-reserve interpretation.
- EPA, [Seismic Reflection](https://www.epa.gov/environmental-geophysics/seismic-reflection): active-source reflection methods.
- SLB, [Defining Wettability](https://www.slb.com/resource-library/oilfield-review/defining-series/defining-wettability): wetting preference, saturation, drainage, and imbibition distinctions.

## Maintenance

Edit `tools/dictionary-petroleum.mjs`, then run `node tools/build-earth-dictionary.mjs` and `npm run check`. Every row contains an explicit preferred name and substantive definition, with optional aliases and translated names. No templated definition expansion is used. Topic names are indexed for search. Shared records use additional discipline memberships, so filtering by their original discipline continues to work.

Checks require at least 500 petroleum entries, every curated preferred name reachable in the petroleum filter, coverage of all 14 groups, no repeated preferred names, preservation of shared disciplines, and correct acronym lookup in both search and Swingo. The source dropdown remains removed.
