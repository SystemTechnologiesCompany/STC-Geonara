const seedTerms=[
['Sedimentology','Earth Sciences','The study of sediments, their origin, transport, deposition and post-depositional evolution.'],
['Stratigraphy','Geology','The study of rock layers, their sequence, distribution, correlation and chronological relationships.'],
['Diagenesis','Sedimentology','Physical, chemical and biological changes that affect sediments after deposition and during lithification.'],
['Porosity','Petrology','The proportion of void space in a rock or sediment relative to its total bulk volume.'],
['Permeability','Petroleum Geology','The capacity of a porous material to transmit fluids through connected pore spaces.'],
['Facies','Sedimentology','A body of rock with distinctive lithological, sedimentological or palaeontological characteristics.'],
['Lithology','Petrology','The physical description of a rock, including mineral composition, grain size, texture and colour.'],
['Unconformity','Stratigraphy','A surface representing a gap in the geological record caused by erosion or non-deposition.'],
['Sequence Stratigraphy','Stratigraphy','The analysis of genetically related sedimentary strata bounded by surfaces of stratigraphic significance.'],
['Diapirism','Structural Geology','The upward movement of relatively mobile material through denser overlying rocks.'],
['Alluvial Fan','Geomorphology','A fan-shaped sedimentary body deposited where a confined flow exits a mountain front or valley.'],
['Carbonate Platform','Sedimentology','A broad depositional system dominated by carbonate production and accumulation.'],
['Clastic Sediment','Sedimentology','Sediment composed of fragments derived from pre-existing rocks or minerals.'],
['Source Rock','Petroleum Geology','An organic-rich rock capable of generating hydrocarbons under suitable thermal conditions.'],
['Reservoir Rock','Petroleum Geology','A rock with sufficient effective porosity and permeability to store and transmit fluids.']
];
const contacts=[];

function aiAnswer(q){let s=q.toLowerCase();if(/porosit|perméab|permeab|مسامي|نفاذ/.test(s))s+=' porosity';if(/stratigraph|طبقات|طباق/.test(s))s+=' stratigraphy';if(/faciès|سحن/.test(s))s+=' facies';if(/diagen|diagenèse|تصخر/.test(s))s+=' diagenesis';if(/altération|تجوية|بازلت/.test(s))s+=' weathering';if(s.includes('porosity')||s.includes('permeability'))return 'Porosity is the fraction of a rock’s bulk volume occupied by voids. Permeability describes how readily fluids can move through connected pores. They are related but not equivalent: a rock can have significant porosity yet low permeability when pore throats are narrow or poorly connected. This is a concise educational summary; real samples require petrophysical measurements.';if(s.includes('stratigraph'))return 'Core stratigraphic principles include superposition, original horizontality, lateral continuity, cross-cutting relationships and faunal succession. They help establish relative chronology and correlate geological units. Their application must account for deformation, unconformities and local geological context.';if(s.includes('facies'))return 'A sedimentary facies is a body of rock characterized by a distinctive combination of lithology, sedimentary structures, texture, fossils and other attributes. Facies analysis uses these characteristics to interpret depositional processes and environments. Interpretations should be supported by field relationships and stratigraphic context.';if(s.includes('diagen'))return 'Diagenesis comprises the physical, chemical and biological processes that modify sediments after deposition and during lithification. Common processes include compaction, cementation, dissolution and mineral transformation. Their effects influence porosity and permeability.';if(s.includes('basalt')||s.includes('weather'))return 'Silicate weathering involves chemical reactions between minerals, water and atmospheric or soil CO₂. The rate and products depend on mineralogy, grain size, temperature, water availability and solution chemistry. Quantifying its contribution requires mineralogical and geochemical measurements.';return 'Try a question about porosity, permeability, stratigraphy, facies, or diagenesis.'}

