// Original concise educational explanations. Reference reading and scope: docs/PETROLEUM_DICTIONARY.md.
// Rows: preferred name | aliases separated by semicolons | definition | French name | Arabic name.
// Shared concepts retain their established definitions, IDs, and discipline memberships when merged.
const groups = [
['Petroleum systems', String.raw`
Petroleum geology||The study of how oil and natural gas form, move, accumulate, and remain preserved in the subsurface.|Géologie pétrolière|جيولوجيا البترول
Petroleum system|Hydrocarbon system|A connected geological system comprising a petroleum source and its related accumulations, together with the rocks, pathways, and processes required for generation, migration, trapping, and preservation.|Système pétrolier|النظام البترولي
Total petroleum system|TPS|A mapped system linking genetically related discovered and undiscovered petroleum to its source rocks and the geological elements and processes responsible for its occurrence.|Système pétrolier total|النظام البترولي الكلي
Petroleum system element||A rock component required for a working petroleum system, such as a source rock, reservoir, seal, or overburden.|Élément du système pétrolier|عنصر النظام البترولي
Petroleum system process||An event or transformation needed for an accumulation, including trap formation, hydrocarbon generation, expulsion, migration, and subsequent preservation.|Processus pétrolier|عملية النظام البترولي
Source rock||A sedimentary rock containing organic matter that can generate petroleum when its composition and burial history are suitable.|Roche mère|الصخر المصدري
Effective source rock||A source rock that has generated and expelled petroleum, contributing hydrocarbons to a petroleum system.|Roche mère effective|الصخر المصدري الفعال
Potential source rock||A rock with organic matter capable of generating petroleum if it experiences sufficient thermal maturation.|Roche mère potentielle|الصخر المصدري المحتمل
Spent source rock||A source rock whose capacity to generate additional petroleum has been substantially exhausted by previous maturation and generation.|Roche mère épuisée|الصخر المصدري المستنفد
Active source rock||A source rock currently generating petroleum under its present burial and thermal conditions.|Roche mère active|الصخر المصدري النشط
Source kitchen|Hydrocarbon kitchen;Generation kitchen|The area of a sedimentary basin where source rocks have reached conditions sufficient to generate substantial petroleum.|Cuisine pétrolière|مطبخ توليد البترول
Pod of active source rock||A connected volume of source rock that is generating petroleum and supplies genetically related shows and accumulations.
Overburden rock||Rock above a source or reservoir interval whose thickness and thermal properties help control burial, temperature, and effective stress.|Roche de couverture sus-jacente|صخور الحمل العلوي
Reservoir rock||A rock with pore space capable of storing hydrocarbons and sufficient connected pathways to permit their movement.|Roche réservoir|الصخر الخازن
Seal rock|Sealing rock|A rock whose pore structure and capillary properties restrict hydrocarbon escape from an accumulation.|Roche couverture|صخر الغطاء
Petroleum charge||The supply of oil or gas delivered to a reservoir or trap through generation, expulsion, and migration.|Charge pétrolière|الشحن البترولي
Charge access||The ability of migrating petroleum to reach a particular trap through connected migration pathways.
Charge efficiency||The proportion of petroleum generated or expelled from a source that ultimately reaches and remains in a target accumulation; the denominator must be specified.
Critical moment||The time that best represents the main generation, migration, and accumulation episode of a petroleum system.|Moment critique|اللحظة الحرجة
Petroleum system events chart||A diagram placing source, reservoir, seal, overburden, trap formation, and petroleum processes against geological time to evaluate their timing relationships.
Petroleum preservation||Retention of accumulated oil or gas after charging, despite later deformation, uplift, leakage, biodegradation, or thermal alteration.|Préservation des hydrocarbures|حفظ الهيدروكربونات
Petroleum system timing||The relative sequence of source maturation, migration, reservoir availability, sealing, and trap formation that determines whether petroleum can accumulate.
Petroleum system modeling|Basin and petroleum system modeling;BPSM|Numerical reconstruction of burial, temperature, source maturation, fluid generation, and migration through geological time.|Modélisation du système pétrolier|نمذجة النظام البترولي
Petroleum seep|Hydrocarbon seep;Oil seep|A natural escape of petroleum at the ground surface or seabed, indicating fluid movement from the subsurface.|Suintement pétrolier|الرشح البترولي
Hydrocarbon show|Oil show;Gas show|Evidence of oil or gas in drilling samples, fluids, or logs that indicates petroleum presence without establishing commercial producibility.|Indice d’hydrocarbures|مظهر هيدروكربوني
Oil-source correlation||Comparison of molecular and isotopic signatures to evaluate whether an oil was generated by a particular source rock.
Oil-oil correlation||Comparison of oils using geochemical characteristics to assess whether they share a source or geological history.
Petroleum family||A group of oils or gases interpreted to have a common origin from consistent molecular, isotopic, and geological evidence.
`],
['Organic geochemistry and maturation', String.raw`
Kerogen||The insoluble organic material in sedimentary rocks from which much thermogenic oil and gas are generated during burial heating.|Kérogène|الكيروجين
Type I kerogen||Hydrogen-rich organic matter commonly associated with algal material and many lake deposits, generally having strong oil-generating potential.
Type II kerogen||Organic matter commonly derived from marine plankton and microorganisms that can generate oil and, at greater maturity, gas.
Type III kerogen||Organic matter rich in terrestrial woody material that generally has greater gas-generating than oil-generating potential.
Type IV kerogen||Highly oxidized or reworked organic matter with little remaining capacity to generate petroleum.
Type II-S kerogen||Sulfur-rich Type II organic matter that may generate oil at lower thermal maturity than comparable low-sulfur kerogen.
Source-rock total organic carbon|TOC;Total organic carbon;Source-rock TOC|The organic carbon content of a rock, commonly reported as weight percent, used with organic type and maturity to evaluate source quality.|Carbone organique total des roches mères|الكربون العضوي الكلي في الصخور المصدرية
Organic richness||The concentration of organic material in a sediment or rock, commonly assessed through total organic carbon measurements.
Organic facies||A body of sediment or rock distinguished by the type, abundance, and preservation of its organic matter.
Organic matter preservation||Survival of biological material through deposition and early burial, influenced by oxygen exposure, sedimentation, biological activity, and mineral association.
Catagenesis||The thermal breakdown of sedimentary organic matter during burial that generates substantial petroleum between early diagenesis and more advanced maturation.|Catagenèse|التحول العضوي الحراري
Metagenesis||An advanced stage of organic maturation in which remaining kerogen and hydrocarbons become increasingly gas-prone and carbon-rich.|Métagenèse|التحول العضوي المتقدم
Thermal maturity||The degree of alteration of organic matter caused by its cumulative temperature and time history.|Maturité thermique|النضج الحراري
Immature source rock||A source rock whose organic matter has not yet experienced enough thermal alteration for substantial thermogenic petroleum generation.
Mature source rock||A source rock whose organic matter has reached conditions favorable for substantial generation of oil or gas.
Overmature source rock||A source rock heated beyond its principal oil-generating stage, often with limited remaining liquid-generating potential.
Oil window||The maturity interval over which a particular organic matter assemblage generates most of its oil; its temperature range depends on heating rate and kerogen chemistry.|Fenêtre à huile|نافذة توليد النفط
Gas window||The maturity interval in which gas generation is important, including gas from kerogen and cracking of previously generated petroleum.|Fenêtre à gaz|نافذة توليد الغاز
Hydrocarbon generation||The formation of petroleum through microbial processes or the thermal transformation of buried organic material.|Génération des hydrocarbures|توليد الهيدروكربونات
Thermogenic gas||Natural gas produced by thermal alteration of organic matter or by cracking of oil and heavier hydrocarbons.|Gaz thermogénique|الغاز الحراري المنشأ
Microbial gas|Biogenic gas|Gas generated by microorganisms, commonly methane formed in relatively low-temperature sedimentary environments.|Gaz microbien|الغاز الميكروبي
Oil cracking||Thermal breakdown of oil molecules into smaller hydrocarbons, commonly producing gas and a carbon-rich residue at advanced maturity.
Transformation ratio|TR|The modeled fraction of the initial petroleum-generating potential of organic matter that has been converted during maturation.
Generation kinetics||Mathematical descriptions of reaction rates used to model petroleum formation as a function of temperature, time, and organic composition.
Activation energy||The energy barrier associated with a chemical reaction; distributions of activation energies are used to represent complex kerogen breakdown.
Rock-Eval pyrolysis|Rock Eval|A programmed laboratory heating method that measures released hydrocarbons and carbon dioxide to help assess source richness, type, and maturity.|Pyrolyse Rock-Eval|التحلل الحراري روك إيفال
Rock-Eval S1|S1 pyrolysis|The free hydrocarbons released from a rock sample during the initial low-temperature stage of Rock-Eval analysis, commonly expressed in milligrams per gram of rock.
Rock-Eval S2|S2 pyrolysis|The hydrocarbons produced by thermal cracking during the main pyrolysis stage, used to estimate a rock's remaining generation potential.
Rock-Eval S3|S3 pyrolysis|The carbon dioxide measured in a defined pyrolysis interval, used with organic carbon content to evaluate oxygen-bearing organic material and possible mineral effects.
Rock-Eval Tmax|Tmax|The laboratory temperature at the maximum of the S2 hydrocarbon-release peak, used cautiously as an indicator of organic thermal maturity.
Hydrogen index|HI|A source-rock parameter calculated as 100 times S2 divided by TOC in weight percent, expressed as milligrams of hydrocarbons per gram of organic carbon.|Indice d’hydrogène|مؤشر الهيدروجين
Oxygen index|OI|A source-rock parameter calculated as 100 times S3 divided by TOC in weight percent, expressed as milligrams of carbon dioxide per gram of organic carbon.|Indice d’oxygène|مؤشر الأكسجين
Pyrolysis production index|Rock-Eval production index;S1/(S1+S2)|The ratio S1 divided by S1 plus S2, indicating free hydrocarbons relative to total measured pyrolysis hydrocarbon yield; migration and contamination can affect it.
Vitrinite reflectance|Ro;Ro percent;VRo|The proportion of incident light reflected by vitrinite under standardized microscopy conditions, widely used as a measure of thermal maturity.|Réflectance de la vitrinite|انعكاسية الفيترينيت
Thermal alteration index|TAI|An estimate of organic thermal maturity based on changes in the color of palynomorphs and other organic particles.
Conodont alteration index|CAI|An ordinal maturity indicator based on temperature-related color changes in conodont elements, useful for reconstructing thermal histories.
Van Krevelen diagram||A plot of atomic hydrogen-to-carbon against oxygen-to-carbon ratios used to describe organic matter type and maturation trends.
Modified Van Krevelen diagram||A plot using hydrogen and oxygen indices from pyrolysis as practical proxies for distinguishing organic matter types and maturity trends.
Petroleum biomarker|Biomarker;Molecular fossil|A molecular fossil retaining structural information about biological precursors, used in petroleum studies to investigate source, maturity, and alteration.|Biomarqueur pétrolier|الواسم الحيوي البترولي
Steranes||Steroid-derived hydrocarbons used with other geochemical evidence to investigate oil-source relationships, organic inputs, and maturity.
Hopanes||A family of mainly bacterial-derived molecular fossils used to characterize petroleum sources, maturity, and biodegradation.
Pristane/phytane ratio|Pr/Ph|The abundance ratio of two isoprenoid hydrocarbons used with other evidence to interpret organic inputs and depositional conditions.
Carbon isotope composition|Delta carbon 13;δ13C|The relative abundance of carbon-13 compared with carbon-12 against a reference standard, used to investigate organic sources and petroleum origins.
Gas chromatography|GC|A laboratory method that separates volatile compounds, allowing petroleum mixtures to be characterized by their component distributions.
Gas chromatography-mass spectrometry|GC-MS|An analytical method combining compound separation with mass spectra to identify petroleum constituents and molecular biomarkers.
SARA analysis||Separation of petroleum into saturates, aromatics, resins, and asphaltenes to characterize its broad compositional fractions.
Asphaltenes||A complex petroleum fraction defined operationally by its solubility behavior, whose precipitation can affect reservoir flow and production.
Solid bitumen||A solid organic residue occurring in rocks, commonly associated with altered or thermally evolved petroleum.
Pyrobitumen||An insoluble carbon-rich residue produced by severe thermal alteration or cracking of petroleum.
Petroleum biodegradation||Microbial alteration of hydrocarbons that can remove lighter compounds and increase the density and viscosity of remaining oil.|Biodégradation du pétrole|التحلل الحيوي للنفط
Water washing of petroleum||Alteration of petroleum through contact with moving water that preferentially dissolves and removes more water-soluble compounds.
`],
['Basins and reservoir architecture', String.raw`
Sedimentary basin||A region of long-term sediment accumulation produced by subsidence, providing the rock sequences in which many petroleum systems develop.|Bassin sédimentaire|الحوض الرسوبي
Basin analysis||Integrated reconstruction of a basin's stratigraphy, subsidence, sediment supply, tectonics, and thermal evolution.
Burial history||The depth through time of a rock interval, used with thermal history to evaluate compaction, maturity, and petroleum generation.|Histoire d’enfouissement|تاريخ الدفن
Thermal history||The temperature evolution of a rock or basin through time, governing organic maturation and many diagenetic processes.|Histoire thermique|التاريخ الحراري
Backstripping||A method for reconstructing basin subsidence by successively removing sediment loads and correcting for compaction, water depth, and other effects.
Decompaction||Reconstruction of a sediment layer's earlier thickness and porosity by reversing estimated burial compaction.
Heat flow||Thermal energy transmitted per unit area per unit time, used as a boundary condition in basin thermal models.
Geothermal gradient||The rate at which temperature changes with depth below the surface, often expressed in degrees per unit depth.|Gradient géothermique|التدرج الحراري الأرضي
Rift basin||A basin formed by crustal extension, commonly containing fault-bounded depocenters with distinctive source and reservoir distributions.
Passive-margin basin||A sedimentary basin on a continental margin developed after rifting, often characterized by thick sedimentary successions and long-term subsidence.
Foreland basin||A basin formed mainly by lithospheric flexure adjacent to a mountain belt under tectonic loading.
Intracratonic basin||A broad sedimentary basin within relatively stable continental crust, commonly recording prolonged subsidence and repeated sedimentation.
Pull-apart basin||A localized basin formed by extension between offset segments of a strike-slip fault system.
Salt tectonics|Halokinesis|Deformation driven by the mobility and density contrast of salt, capable of creating traps, migration pathways, and complex subsurface structures.|Tectonique salifère|التكتونية الملحية
Salt weld||A surface where a former salt layer or body has been removed or greatly thinned, bringing surrounding strata into close contact.
Salt diapir||A body of salt that has risen into overlying strata, deforming adjacent rocks and potentially creating hydrocarbon traps.
Growth fault||A fault that moves during sediment deposition, producing greater sediment thickness on its downthrown side.
Rollover anticline||A fold in the hanging wall of a curved normal fault, commonly developed during extension and capable of forming a structural trap.
Reservoir architecture||The spatial arrangement of reservoir bodies, internal layers, discontinuities, and connections that controls storage and fluid movement.|Architecture du réservoir|بنية المكمن
Reservoir heterogeneity||Variation in reservoir properties over space, including porosity, permeability, facies, fractures, and fluid distribution.|Hétérogénéité du réservoir|عدم تجانس المكمن
Reservoir connectivity||The degree to which reservoir volumes communicate through pathways that permit pressure transmission or fluid flow.
Reservoir compartmentalization||Division of a reservoir into partly or fully isolated volumes by faults, seals, stratigraphic barriers, or changes in rock properties.
Flow unit||A reservoir interval grouped by similar pore structure and fluid-flow behavior rather than by lithology alone.
Baffle||A relatively low-permeability feature that slows fluid communication without necessarily preventing it completely.
Flow barrier||A geological feature that substantially restricts fluid communication between adjacent reservoir volumes.
Net reservoir||The thickness or volume of rock meeting specified reservoir-quality criteria, whether or not it contains producible hydrocarbons.
Net pay||The thickness of reservoir meeting specified criteria for hydrocarbon saturation, rock quality, and potential economic production.|Épaisseur utile productive|السماكة المنتجة الصافية
Gross rock volume|GRV|The total bulk rock volume enclosed by the mapped limits of an accumulation before reservoir-quality or porosity adjustments.
Net-to-gross ratio|NTG;N/G|The proportion of a gross interval or rock volume classified as net reservoir or net pay under explicitly stated cutoffs.
Reservoir quality||The ability of a rock to store and transmit fluids, governed by pore volume, pore connectivity, mineralogy, and alteration.
Sandstone reservoir||A reservoir hosted mainly in sand-sized siliciclastic sediment, with flow controlled by intergranular pores, cementation, clay, and fractures.
Carbonate reservoir||A reservoir hosted mainly in limestone or dolostone, often having complex pore systems modified by dissolution, cementation, and fracturing.
Fractured reservoir||A reservoir in which natural fractures provide a substantial part of fluid storage or flow capacity.
Basement reservoir||A hydrocarbon-bearing reservoir in crystalline or metamorphic basement where fractures, weathering, or dissolution provide storage and flow pathways.
Turbidite reservoir||A reservoir formed from deposits of sediment gravity flows, often with channelized or lobate sandstone bodies and variable connectivity.
Reef reservoir||A reservoir associated with a carbonate buildup constructed or influenced by organisms, commonly modified by diagenesis and surrounding facies.
Channel reservoir||A reservoir hosted in channel deposits whose geometry, internal stacking, and mud-filled boundaries influence fluid connectivity.
`],
['Migration, traps, and seals', String.raw`
Hydrocarbon expulsion||The release of generated oil or gas from source rock into adjacent migration pathways.|Expulsion des hydrocarbures|طرد الهيدروكربونات
Primary migration||The movement of petroleum out of the source rock where it formed.|Migration primaire|الهجرة الأولية
Secondary migration||Movement of expelled petroleum through carrier rocks or fractures toward traps, reservoirs, or surface seeps.|Migration secondaire|الهجرة الثانوية
Remigration|Tertiary migration|Movement of petroleum from an earlier accumulation into another location following leakage, structural change, or renewed fluid movement.
Carrier bed||A permeable rock layer through which petroleum migrates between a source and an accumulation.|Couche conductrice|الطبقة الناقلة
Migration pathway||A connected route through permeable beds, faults, fractures, or other features along which petroleum can move.
Migration fairway||A regional corridor in which geological structure and carrier connectivity focus petroleum movement.
Buoyancy pressure||The pressure difference arising from density contrast between fluids over a vertical interval, helping drive hydrocarbons upward through water-bearing rock.
Hydrocarbon trap||A geological configuration that retains petroleum because reservoir geometry and sealing conditions obstruct further migration.|Piège à hydrocarbures|المصيدة الهيدروكربونية
Structural trap||A trap created primarily by deformation, such as folding, faulting, or salt movement.|Piège structural|المصيدة التركيبية
Stratigraphic trap||A trap formed primarily by changes in rock type, depositional geometry, or stratigraphic truncation rather than structural closure.|Piège stratigraphique|المصيدة الطباقية
Combination trap||A hydrocarbon trap whose effectiveness depends on both structural geometry and stratigraphic changes.|Piège mixte|المصيدة المركبة
Anticlinal trap||A trap in an upward-arched reservoir layer where a seal prevents buoyant hydrocarbons from escaping above the fold crest.
Fault trap||A trap in which fault displacement or fault-zone material provides part of the boundary retaining hydrocarbons.
Pinch-out trap||A stratigraphic trap where a porous reservoir layer thins and terminates against less permeable rock.
Unconformity trap||A trap associated with erosion or nondeposition, where reservoir rocks are truncated or overlain by sealing strata.
Diagenetic trap||A trap produced by changes in reservoir properties through processes such as cementation, dissolution, or mineral replacement.
Hydrodynamic trap||An accumulation whose geometry or retention is significantly influenced by flowing formation water and its hydraulic gradient.
Trap closure||The geometrically enclosed portion of a reservoir structure above its spill point, which may provide space for hydrocarbon accumulation.|Fermeture du piège|انغلاق المصيدة
Spill point||The lowest point on a trap boundary at which additional buoyant hydrocarbons can escape into an adjacent migration route.|Point de débordement|نقطة الانسكاب
Spill-fill migration||A charging process in which a trap fills to its spill point before excess hydrocarbons migrate onward to another trap.
Hydrocarbon column||The vertical thickness of hydrocarbons retained in an accumulation, limited by trap geometry, charge, and seal capacity.
Fill-to-spill||The condition in which an accumulation has filled its available geometric closure to the spill point.
Top seal||The rock above a reservoir that restricts upward escape of accumulated hydrocarbons.|Couverture supérieure|الغطاء العلوي
Lateral seal||A geological boundary that restricts sideways escape of hydrocarbons from a reservoir.
Fault seal||The ability of a fault zone or juxtaposed low-permeability rock to restrict hydrocarbon movement across a fault.
Juxtaposition seal||A seal created where fault displacement places a permeable reservoir against a less permeable rock unit.
Shale smear||Clay-rich material drawn along a fault from shale beds during deformation, potentially reducing cross-fault flow.
Shale gouge ratio|SGR|An estimate of the proportion of clay-rich material moved past a point on a fault, used as one indicator of fault-sealing behavior.
Capillary entry pressure|Threshold pressure;Displacement pressure|The pressure difference needed for a nonwetting fluid to enter the largest connected pore throats of a rock initially occupied by a wetting fluid.
Seal capacity||The pressure difference or hydrocarbon-column height that a seal can retain before capillary leakage or mechanical failure.
Seal breach||Loss of sealing effectiveness through fracturing, fault reactivation, erosion, or another process that permits petroleum escape.
Trap integrity||The ability of a trap and its seals to retain hydrocarbons through geological events and pressure changes.
`],
['Petrophysics and pore systems', String.raw`
Petrophysics||The study of rock properties and their interactions with contained fluids, especially storage, flow, and responses to subsurface measurements.|Pétrophysique|البتروفيزياء
Porosity||The fraction of a rock's bulk volume occupied by pores, including connected and isolated voids unless otherwise specified.|Porosité|المسامية
Total porosity||The proportion of total rock volume occupied by all pore spaces, including pores that do not contribute to fluid flow.
Effective porosity||The pore-volume fraction considered connected and available for fluid storage or movement under the definition used in an interpretation.
Primary porosity||Pore space inherited from the original deposition or formation of a rock, before later alteration substantially modifies it.
Secondary porosity||Pore space formed after deposition or rock formation through processes such as dissolution, dolomitization, or fracturing.
Intergranular porosity||Pore space located between the grains of a sediment or rock.
Intragranular porosity||Pore space occurring within individual sedimentary grains, fossils, or mineral aggregates.
Vuggy porosity||Pore space in cavities larger than typical interparticle pores, commonly produced by dissolution in carbonate rocks.
Moldic porosity||Pore space preserving the shape of grains or fossils that were selectively dissolved.
Fracture porosity||The fraction of rock volume occupied by fractures, which may greatly influence flow even when their storage volume is small.
Microporosity||Pore space within very small pores, with the size boundary depending on the measurement method and scientific context.
Pore throat||A narrow connection between larger pores that strongly influences fluid entry, capillary pressure, and permeability.
Pore-size distribution||The statistical distribution of pore dimensions in a rock, helping characterize storage, capillary behavior, and fluid accessibility.
Pore-throat distribution||The distribution of constriction sizes connecting pores, commonly evaluated using injection or imaging measurements.
Permeability||The ability of a porous material to transmit fluid through its connected pore network.|Perméabilité|النفاذية
Absolute permeability||The permeability of a rock measured when its connected pores are occupied by a single fluid phase.
Effective permeability||The permeability to one fluid when other fluid phases are also present in the pore space.
Relative permeability||The ratio of a phase's effective permeability to a specified reference permeability, describing its mobility in multiphase flow.|Perméabilité relative|النفاذية النسبية
Permeability anisotropy||Variation of permeability with direction, commonly resulting from bedding, aligned pores, fractures, or other directional fabrics.
Horizontal permeability|Kh|Permeability measured or modeled parallel to the chosen horizontal reference plane, often approximately parallel to reservoir bedding.
Vertical permeability|Kv|Permeability measured or modeled in the vertical direction, important for cross-layer communication and gravity segregation.
Darcy||A unit of permeability approximately equal to 9.869233 × 10⁻¹³ square metres.
Millidarcy|mD|A unit of permeability equal to one thousandth of a darcy, commonly used for reservoir rocks.
Fluid saturation||The fraction of the considered pore volume occupied by a particular fluid phase.|Saturation en fluide|تشبع الموائع
Water saturation|Sw|The fraction of pore volume occupied by water, defined consistently with the porosity model used in an interpretation.|Saturation en eau|التشبع المائي
Oil saturation|So|The fraction of the considered pore volume occupied by liquid oil.
Gas saturation|Sg|The fraction of the considered pore volume occupied by a gas phase.
Irreducible water saturation|Swi;Swirr|The water saturation below which water cannot be displaced further by a specified process under stated conditions.
Residual oil saturation|Sor|The oil saturation remaining after a specified displacement process, with the value depending on rock, fluids, and displacement history.
Critical gas saturation|Sgc|The gas saturation above which the gas phase first becomes mobile under specified reservoir conditions.
Wettability||The preference of a solid surface to contact one fluid rather than another when both fluids are present.|Mouillabilité|قابلية البلل
Water-wet rock||A rock whose pore surfaces preferentially contact water rather than the competing oil phase under stated conditions.
Oil-wet rock||A rock whose pore surfaces preferentially contact oil rather than water under stated conditions.
Mixed wettability||A condition in which different pore surfaces in the same rock have different preferences for contact with oil or water.
Contact angle||The angle at a solid-fluid-fluid contact used, with a stated measurement convention, to characterize wetting behavior.
Capillary pressure||The pressure difference between nonwetting and wetting fluid phases across a curved interface in a pore system.|Pression capillaire|الضغط الشعري
Drainage displacement||A displacement process in which a nonwetting fluid enters pore space and reduces the saturation of the wetting fluid.
Imbibition||A displacement process in which the wetting-fluid saturation increases, either spontaneously or under an imposed pressure difference.
Capillary hysteresis||Dependence of capillary pressure or saturation relationships on the previous sequence of drainage and imbibition.
Mercury injection capillary pressure|MICP|A laboratory method that forces mercury into a dried sample to characterize accessible pore-throat sizes and capillary-entry behavior.
Leverett J-function||A dimensionless scaling of capillary pressure using permeability, porosity, interfacial tension, and contact angle to compare related rock types.
Formation factor|F|The ratio of the electrical resistivity of a fully brine-saturated rock to the resistivity of its brine under the specified measurement conditions.
Archie's law|Archie equation|An empirical relationship linking resistivity to porosity and water saturation, most applicable to clean rocks with electrically nonconductive grains.
Cementation exponent|Archie m exponent|The exponent describing how formation factor varies with porosity in an Archie-type electrical model.
Saturation exponent|Archie n exponent|The exponent describing how resistivity index changes with water saturation in an Archie-type electrical model.
Shale volume|Vsh|The estimated fraction of a formation occupied by shale, derived from logs or other measurements using an explicit shale model.
Clay cation exchange capacity|CEC;Cation exchange capacity|The capacity of clay-bearing material to exchange positively charged ions, relevant to clay-related electrical conduction and shaly-reservoir interpretation.
Bound water||Water held by clay surfaces or small pores strongly enough to have restricted mobility under the conditions considered.
Free fluid index|FFI|An NMR-derived estimate of the pore-volume fraction assigned to relatively mobile fluids using a selected relaxation-time cutoff.
`],
['Reservoir fluids, contacts, and pressure', String.raw`
Crude oil||A naturally occurring liquid mixture dominated by hydrocarbons, with composition and physical properties that vary among accumulations.|Pétrole brut|النفط الخام
Natural gas||A naturally occurring gas mixture dominated by methane, often containing other hydrocarbons and nonhydrocarbon components.|Gaz naturel|الغاز الطبيعي
Associated gas||Natural gas occurring with oil, either dissolved in the oil or present as a separate gas cap.
Nonassociated gas||Natural gas occurring in an accumulation without a substantial oil leg.
Gas condensate||A hydrocarbon fluid that can release liquid condensate as pressure and temperature change during reservoir depletion or surface production.|Gaz à condensat|غاز المكثفات
Retrograde condensation||The formation of liquid from a gas-condensate mixture as pressure decreases through its dew point at a suitable reservoir temperature.
Condensate banking||Accumulation of liquid condensate near a producing well after pressure falls below the dew point, potentially reducing gas mobility.
Dry gas||A gas with little recoverable hydrocarbon liquid under the stated production or processing conditions; processed pipeline gas is also commonly called dry gas.
Wet gas||Natural gas containing appreciable heavier hydrocarbons that can be recovered as liquids during processing; raw gas may also contain water vapor.
Natural gas liquids|NGL|Hydrocarbons such as ethane, propane, butanes, and pentanes recovered as liquids from natural gas under appropriate processing conditions.
Heavy oil||Crude oil of relatively high density and viscosity, with classification limits depending on the standard and application.
Extra-heavy oil||Very dense crude oil, commonly defined using an API gravity below 10 degrees, with viscosity depending strongly on composition and temperature.
Petroleum bitumen|Bitumen;Natural bitumen|A highly viscous or solid petroleum material whose precise definition depends on geological, analytical, or industrial context.
Sweet gas||Natural gas with little hydrogen sulfide relative to a specified quality or processing criterion.
Sour gas||Natural gas containing hydrogen sulfide, commonly requiring treatment and special handling because of its toxicity and corrosive potential.
API gravity|Degrees API|A petroleum density scale calculated as 141.5 divided by specific gravity at 60°F, minus 131.5; higher values indicate lower density.|Densité API|الكثافة بدرجات API
Fluid viscosity||A measure of a fluid's resistance to deformation and flow, strongly influenced by temperature and fluid composition.
Fluid compressibility||The fractional change in fluid volume per unit pressure change at specified temperature and composition.
Pressure-volume-temperature analysis|PVT analysis|Laboratory characterization of how reservoir-fluid volume, phases, and properties change with pressure and temperature.|Analyse PVT|تحليل الضغط والحجم والحرارة
Bubble-point pressure|Bubble point;Pb|The pressure at which the first gas bubble appears from an initially single-phase liquid as pressure is reduced at fixed temperature.
Dew-point pressure|Dew point;Pd|The pressure at which the first liquid appears from an initially single-phase gas mixture along a specified temperature path.
Phase envelope||The boundary in pressure-temperature space separating single-phase and multiphase states for a mixture of specified composition.
Critical point||The pressure and temperature at which liquid and vapor phases of a given composition become indistinguishable.
Oil formation volume factor|Bo|The volume of reservoir oil including dissolved gas at reservoir conditions divided by the corresponding stock-tank oil volume.
Gas formation volume factor|Bg|The volume occupied by gas at reservoir conditions divided by its volume at specified standard conditions.
Solution gas-oil ratio|Rs|The volume of gas dissolved in reservoir oil, expressed at standard conditions, per unit stock-tank oil volume.
Producing gas-oil ratio|GOR|The measured volume of produced gas divided by produced oil volume, with both volumes reported at specified reference conditions.
Gas deviation factor|Z factor;Gas compressibility factor|A dimensionless factor describing departure of a real gas from ideal-gas pressure-volume-temperature behavior.
Oil-water contact|OWC|A boundary identified between predominantly oil-bearing and predominantly water-bearing reservoir intervals, according to the measurement or saturation criterion used.|Contact huile-eau|تماس النفط والماء
Gas-oil contact|GOC|The boundary separating a free-gas accumulation from the underlying oil-bearing interval in a reservoir.|Contact gaz-huile|تماس الغاز والنفط
Gas-water contact|GWC|The boundary between gas-bearing and water-bearing intervals where no intervening oil leg is present.|Contact gaz-eau|تماس الغاز والماء
Free-water level|FWL|The level at which oil-water capillary pressure is zero, used as a reference for interpreting saturation-height relationships.
Transition zone||The vertical interval over which fluid saturations change progressively because of capillary forces, pore-size variation, and gravity.
Gas cap||A free-gas zone overlying an oil leg, whose expansion may provide energy during production.
Oil leg||The oil-bearing interval between an overlying gas zone and an underlying water-bearing zone in an accumulation.
Formation water|Connate formation water|Water present in a subsurface rock formation, whose salinity and composition reflect its geological and fluid-flow history.
Hydrostatic pressure||Fluid pressure produced by the weight of a connected fluid column under static conditions.
Pore pressure|Formation pressure|The pressure of fluids occupying the pore space of a rock, distinguished from the stresses carried by its solid framework.
Overpressure||Pore pressure exceeding the chosen normal hydrostatic reference at the same depth.
Underpressure||Pore pressure below the chosen normal hydrostatic reference at the same depth.
Effective stress||The stress acting on a rock framework after accounting for pore-fluid pressure using an appropriate effective-stress relationship.
Pressure gradient||The rate of fluid-pressure change with distance or depth, used to interpret fluid densities, contacts, and compartmentalization.
`],
['Well logs, cores, and formation evaluation', String.raw`
Formation evaluation||Integrated interpretation of well measurements and samples to determine lithology, reservoir quality, fluids, and potential producibility.|Évaluation des formations|تقييم التكوينات
Well logging||Recording measurements against depth or time in a borehole to characterize rocks, fluids, and well conditions.|Diagraphie|تسجيل الآبار
Wireline logging||Acquisition of borehole measurements using instruments conveyed on a cable, commonly after a drilling interval is completed.
Logging while drilling|LWD|Acquisition of formation measurements by instruments in the drilling assembly while the borehole is being drilled.
Measurement while drilling|MWD|Measurement and transmission of drilling-related information, especially borehole direction and inclination, using instruments in the drilling assembly.
Gamma-ray log|GR log|A record of natural gamma radiation from formations, commonly used with other logs to interpret lithology and shale content.
Spectral gamma-ray log||A record separating contributions from potassium, uranium, and thorium to help interpret mineralogy and radioactive source-rock intervals.
Resistivity log||A depth record of formation electrical resistivity used with other information to evaluate fluids, invasion, and rock properties.
Density log||A record of formation bulk density inferred from gamma-ray interactions, commonly used to estimate porosity with appropriate matrix and fluid assumptions.
Neutron porosity log||A measurement sensitive mainly to hydrogen concentration, interpreted as porosity after accounting for lithology, fluids, and environmental effects.
Sonic log|Acoustic log|A record of acoustic-wave travel time through formations, used to investigate porosity, mechanical properties, and seismic velocities.
Spontaneous potential log|SP log|A record of naturally occurring electrical potential differences in a borehole, useful for identifying permeable beds under suitable conditions.
Caliper log||A measurement of borehole diameter or shape used to identify washouts and support corrections to other logging measurements.
Borehole image log||A high-resolution oriented representation of the borehole wall used to identify bedding, fractures, and other structures.
Nuclear magnetic resonance log|NMR log|A measurement of hydrogen-nuclei relaxation behavior used to characterize porosity, pore environments, and fluid mobility.
NMR T2 distribution||The distribution of transverse relaxation times inferred from NMR measurements, related to pore-fluid environments and pore geometry.
Pulsed-neutron log||A cased-hole or open-hole measurement using pulsed neutron interactions to investigate formation composition or fluid saturation.
Mud logging||Monitoring drilling returns, cuttings, and gas at the surface to identify lithology, hydrocarbon shows, and drilling-related changes.
Drill cuttings||Rock fragments brought to the surface by circulating drilling fluid and examined to identify penetrated formations and possible hydrocarbon shows.
Mud-gas chromatography||Separation and measurement of hydrocarbons extracted from drilling mud to evaluate gas shows and compositional changes.
Core sample||A relatively intact rock sample recovered from a borehole for direct examination and laboratory measurement.
Conventional core||A continuous cylindrical rock sample cut using a coring assembly, preserving more geological context than isolated sidewall samples.
Sidewall core||A small rock sample collected from the borehole wall at a selected depth.
Routine core analysis|RCAL|Laboratory measurements commonly including porosity, permeability, grain density, and fluid saturation on recovered rock samples.
Special core analysis|SCAL|Laboratory measurements of advanced rock-fluid behavior, such as relative permeability, capillary pressure, wettability, and electrical properties.
Core-log integration||Calibration and joint interpretation of core observations and well logs to build a consistent geological and petrophysical model.
Depth matching||Alignment of measurements or samples onto a consistent depth reference before comparison and interpretation.
Mud-filtrate invasion||Entry of the liquid component of drilling mud into a permeable formation under a pressure difference.
Flushed zone||The near-borehole region where invading mud filtrate has substantially displaced the original movable formation fluids.
Mud cake||A filter layer deposited on the borehole wall as drilling-fluid liquid enters a permeable formation.
Formation tester||A downhole instrument used to measure formation pressure, collect fluids, or perform small-scale flow tests.
Formation fluid sampling||Collection of subsurface fluids for compositional and physical analysis, with attention to contamination and pressure preservation.
Pressure mobility||A formation-test estimate related to permeability divided by fluid viscosity, describing the ease of flow into a test probe.
Net-pay cutoff||A specified threshold in porosity, saturation, permeability, or other properties used to classify an interval as net pay.
Gas crossover||A separation or crossover between density- and neutron-derived porosity responses that can indicate gas when lithology and borehole effects are accounted for.
`],
['Seismic interpretation and exploration', String.raw`
Petroleum exploration||The integrated geological, geochemical, and geophysical search for oil and gas accumulations that may justify drilling.
Exploration play|Petroleum play|A group of potential or known accumulations sharing important geological controls, such as reservoir, trap style, source, or charge history.|Thème d’exploration|نطاق استكشافي
Play fairway||The mapped area where the geological conditions required for a particular exploration play are interpreted to be favorable.
Exploration lead||A preliminary indication of a possible accumulation that requires further work before it can be defined as a drillable prospect.
Exploration prospect||A sufficiently defined potential accumulation that can be evaluated for drilling, including its geometry, resources, and geological chance of success.|Prospect d’exploration|هدف استكشافي
Geological chance of success|GCoS;Pg|The estimated probability that a prospect contains a specified geological accumulation, based on the required source, charge, reservoir, trap, and seal conditions.
Common risk segment||A mapped area assigned broadly similar geological risk for a particular play element, such as charge access or reservoir presence.
Dry hole||A well that does not discover a commercially producible hydrocarbon accumulation under the applicable evaluation conditions.
Discovery well||A well that establishes a previously unknown hydrocarbon accumulation or productive reservoir.
Appraisal well|Delineation well|A well drilled to reduce uncertainty about a discovered accumulation's extent, properties, contacts, or potential productivity.
Wildcat well||An exploration well drilled to test a previously unproven accumulation or geological target.
Reflection seismic survey||A geophysical survey using reflected acoustic energy to image subsurface contrasts and interpret geological structure and stratigraphy.
Two-dimensional seismic|2D seismic|Seismic acquisition and interpretation along individual survey lines, producing vertical sections through the subsurface.
Three-dimensional seismic|3D seismic|Seismic acquisition over an area to produce a volume of subsurface reflection information.
Time-lapse seismic|4D seismic|Comparison of repeated seismic surveys to detect changes related to reservoir pressure, fluid saturation, or other time-dependent conditions.
Seismic horizon||A picked reflection event interpreted to track a geological boundary or approximately equivalent surface through seismic data.
Seismic time map||A map of reflection travel time to an interpreted horizon, requiring velocity information for conversion to depth.
Depth conversion||Transformation of seismic travel times into estimated depths using an appropriate subsurface velocity model.
Well tie||Correlation of well-based geological and acoustic information with seismic reflections to constrain interpretation at a borehole.
Synthetic seismogram||A modeled seismic trace constructed from a reflectivity series and a wavelet, commonly derived using well-log information.
Checkshot survey||A borehole seismic measurement of travel times to known depths used to constrain time-depth relationships.
Vertical seismic profile|VSP|A seismic survey with receivers in a borehole that records wavefields for velocity estimation, imaging, and well-to-seismic calibration.
Acoustic impedance||The product of rock bulk density and compressional-wave velocity, whose contrasts generate normal-incidence seismic reflections.
Seismic inversion||Estimation of subsurface properties, such as impedance, from seismic observations using a model and stated assumptions.
Amplitude variation with offset|AVO;Amplitude versus offset|Changes in reflection amplitude with source-receiver offset, analyzed to constrain elastic contrasts and sometimes fluid effects.
Amplitude variation with angle|AVA|Variation in reflection amplitude with incidence angle, used to investigate elastic contrasts across a boundary.
Direct hydrocarbon indicator|DHI|A seismic feature potentially caused by hydrocarbons, requiring geological calibration because nonhydrocarbon conditions can produce similar responses.
Bright spot||An unusually strong seismic amplitude that may indicate a fluid or lithological contrast but does not by itself prove hydrocarbons.
Flat spot||A relatively level reflection cutting across reservoir structure that may represent a fluid contact when supported by other evidence.
Seismic tuning||Interference of reflections from closely spaced boundaries that changes apparent amplitude and limits separate resolution of thin beds.
Seismic attribute||A quantity derived from seismic data, such as amplitude, coherence, or frequency, used to highlight geological or reservoir patterns.
Seismic coherence||A measure of trace-to-trace similarity used to highlight discontinuities such as faults, channels, and stratigraphic edges.
Amplitude extraction||Sampling seismic amplitudes along or around an interpreted horizon to investigate lateral variation and possible reservoir-related patterns.
Rock physics||The study and modeling of relationships between rock composition, pore structure, fluids, and measured physical properties.
Fluid substitution||Modeling how a rock's elastic properties would change if its pore fluids were replaced under specified assumptions.
Gassmann's equations|Gassmann fluid substitution|Relations connecting drained rock-frame, mineral, and fluid properties to saturated bulk modulus under low-frequency and pore-equilibration assumptions.
`],
['Well testing, modeling, and recovery', String.raw`
Drill-stem test|DST|A temporary downhole flow and pressure test used to evaluate formation fluids, pressure, and productive potential.
Well test||A controlled measurement of well flow and pressure behavior used to estimate reservoir or well performance.
Pressure transient analysis|PTA|Interpretation of time-dependent well pressure responses to infer reservoir flow properties, boundaries, and near-well effects.
Pressure buildup test||A test that measures pressure recovery after a producing well is shut in.
Pressure drawdown test||A test that records pressure decline while a well produces under a specified flow program.
Interference test||A test measuring pressure response in one well to a rate change in another to evaluate reservoir communication.
Skin factor||A dimensionless representation of additional near-well pressure loss or gain relative to an idealized reference flow model.
Productivity index|Well productivity index;J index|The liquid production rate divided by the pressure drawdown under specified conditions, used to characterize well deliverability.
Injectivity index||The injection rate divided by the pressure increase required to inject fluid, defined for specified well and reservoir conditions.
Deliverability||The production capacity of a well under specified pressure and operating conditions, especially used for gas wells.
Formation damage||A reduction in near-well flow capacity caused by processes such as solids invasion, clay swelling, precipitation, or fluid incompatibility.
Reservoir simulation||Numerical modeling of fluid flow and related changes in a reservoir to evaluate development and production scenarios.
Static reservoir model||A three-dimensional representation of reservoir geometry and rock properties before dynamic flow behavior is simulated.
Dynamic reservoir model||A reservoir model including fluids, pressure, flow equations, and well operations to simulate behavior through time.
History matching||Adjustment of uncertain model parameters within defensible bounds to reproduce observed reservoir pressures and production behavior.
Upscaling||Conversion of fine-scale reservoir properties into effective properties suitable for a coarser simulation grid.
Geostatistical modeling||Use of spatial statistics and geological constraints to model property distributions and uncertainty between observations.
Variogram||A function describing how spatial variability changes with separation distance and direction, used in geostatistical reservoir models.
Material balance||A conservation-based calculation linking reservoir fluid withdrawal, expansion, influx, and injection to estimate volumes or performance.
Recovery factor|RF|The fraction of initially present petroleum expected to be or already recovered under a specified development and economic scenario.
Primary recovery||Petroleum production driven by natural reservoir energy, with artificial lift used when necessary to bring fluids to the surface.
Secondary recovery||Recovery that supplements natural reservoir energy, commonly by injecting water or gas to maintain pressure and displace hydrocarbons.
Enhanced oil recovery|EOR|Recovery methods that alter fluid or rock-fluid behavior, commonly through thermal, gas, or chemical processes, to mobilize additional oil.
Solution-gas drive||A reservoir drive mechanism in which gas released from oil during pressure decline expands and helps move fluids toward wells.
Gas-cap drive||A reservoir drive mechanism in which expansion of an existing gas cap supplies energy to displace oil.
Water drive||A reservoir drive mechanism in which aquifer influx supplies energy and replaces some of the produced fluid volume.
Gravity drainage||Movement and segregation of reservoir fluids under density differences, potentially aiding recovery toward appropriately positioned wells.
Compaction drive||Reservoir energy and fluid displacement produced partly by pore-volume reduction as effective stress increases during depletion.
Waterflooding||Injection of water into a reservoir to support pressure and displace oil toward producing wells.
Gas injection||Injection of gas for pressure support, displacement, or compositional effects that can improve petroleum recovery.
Miscible displacement||A displacement process in which injected and reservoir fluids become mutually soluble under the relevant pressure, temperature, and composition conditions.
Minimum miscibility pressure|MMP|The lowest pressure at which a specified injection gas and oil can develop miscibility under a defined displacement mechanism and temperature.
Carbon dioxide flooding|CO2-EOR;CO₂ flooding|Injection of carbon dioxide to improve oil recovery through displacement and effects such as swelling, viscosity reduction, or miscibility.
Water-alternating-gas injection|WAG|Alternating water and gas injection to combine gas displacement effects with improved mobility control and reservoir sweep.
Polymer flooding||Injection of polymer-thickened water to improve the mobility ratio and distribution of a waterflood.
Surfactant flooding||Injection of surface-active chemicals to reduce oil-water interfacial tension and help mobilize trapped oil.
Steam flooding||Injection of steam to heat a reservoir, lower oil viscosity, and promote displacement toward producers.
Steam-assisted gravity drainage|SAGD|A thermal recovery method commonly using paired horizontal wells so injected steam heats viscous oil that drains toward a lower producer.
Cyclic steam stimulation|CSS;Huff and puff|A thermal method alternating steam injection, a soak period, and production in the same well.
In-situ combustion||A thermal recovery process that generates heat within the reservoir by controlled combustion of part of its hydrocarbons.
Mobility ratio||The ratio of displacing-fluid mobility to displaced-fluid mobility, with mobility defined as effective permeability divided by viscosity.
Sweep efficiency||The fraction of a target reservoir volume contacted by an injected displacement fluid under the defined recovery process.
Displacement efficiency||The fraction of oil removed from the portion of reservoir contacted by the displacing fluid.
Viscous fingering||Unstable penetration of a more mobile fluid into a less mobile fluid, causing uneven displacement and early breakthrough.
Water coning||Upward distortion of an underlying water zone toward a producing well because of the local pressure field.
Gas coning||Downward distortion of an overlying gas zone toward a producing well because of the local pressure field.
Breakthrough||The first significant arrival of an injected or unwanted fluid at a producing well or monitoring location.
Water cut||The water volume divided by total produced liquid volume, measured under specified conditions.
Voidage replacement ratio|VRR|The injected reservoir-volume equivalent divided by the produced reservoir-volume equivalent over a stated period.
Decline-curve analysis|DCA|Analysis of production-rate trends to estimate future performance under stated assumptions about operations and reservoir behavior.
Estimated ultimate recovery|EUR|The total petroleum volume expected to be recovered over the life of a well or accumulation under a stated scenario.
`],
['Unconventional resources and geomechanics', String.raw`
Conventional accumulation||A discrete petroleum accumulation commonly concentrated by migration into a trap and bounded by identifiable geological or fluid limits.
Continuous accumulation||A regionally extensive petroleum occurrence not adequately represented as separate buoyancy-trapped fields, commonly assessed using areas and well-performance distributions.
Unconventional resource||Petroleum requiring specialized assessment or recovery approaches because of its occurrence, fluid properties, or low reservoir deliverability.
Shale gas||Natural gas produced from fine-grained, generally low-permeability rocks in which organic matter, pores, and fractures contribute to storage.
Tight gas||Natural gas in low-permeability reservoirs that commonly requires stimulation for commercially useful well rates.
Tight oil||Liquid petroleum in low-permeability reservoirs, commonly developed with horizontal wells and hydraulic fracturing.
Oil shale||A fine-grained rock rich in organic matter that can yield liquid hydrocarbons when heated, distinct from oil already present in a tight reservoir.
Oil sands|Tar sands|Sediments containing viscous petroleum or bitumen, commonly requiring thermal, mining, or other specialized recovery methods.
Coalbed methane|CBM;Coal seam gas;CSG|Methane stored largely by adsorption in coal, with production commonly involving pressure reduction through water removal.
Gas hydrate||A crystalline solid in which water cages contain gas molecules, commonly methane, stable under suitable high-pressure and low-temperature conditions.
Adsorbed gas||Gas molecules held on solid surfaces by surface forces, important for storage in coal and organic-rich rocks.
Free gas||Gas occupying pore or fracture space as a separate fluid phase rather than being dissolved in liquid or adsorbed on a surface.
Langmuir isotherm||An empirical relationship describing gas adsorption as a function of pressure at fixed temperature, commonly parameterized by adsorption capacity and characteristic pressure.
Desorption||Release of molecules from a solid surface, including methane leaving coal or organic matter as pressure falls.
Gas-in-place partitioning||Separation of estimated gas storage into components such as free, adsorbed, and dissolved gas to avoid omissions or double counting.
Sweet spot||An area where a favorable combination of geology, reservoir properties, fluids, and development conditions produces comparatively attractive performance.
Geomechanics||The study of rock deformation, stress, and failure, used to evaluate well stability, fractures, compaction, and reservoir integrity.
Minimum horizontal stress|Shmin|The smaller of the two horizontal principal stresses, important in evaluating fracture orientation and opening pressure.
Maximum horizontal stress|SHmax|The larger of the two horizontal principal stresses, used with other stresses to characterize the subsurface stress state.
Fracture gradient||A pressure-per-depth measure associated with fracture initiation or propagation under specified formation and testing conditions.
Natural fracture||A crack formed by geological processes before drilling or stimulation, potentially influencing reservoir permeability and mechanical behavior.
Hydraulic fracturing||Creation or extension of fractures by injecting fluid at sufficient pressure to increase connected flow capacity in a target formation.
Proppant||Solid particles placed in a hydraulic fracture to help maintain a conductive opening after injection pressure is reduced.
Stimulated reservoir volume|SRV|An interpreted volume affected by stimulation, whose extent does not by itself establish that all enclosed rock contributes to production.
Fracture conductivity||The product of fracture permeability and effective fracture width, describing its capacity to transmit fluid along the fracture.
Microseismic monitoring||Recording small seismic events to investigate deformation and fracture-related activity during subsurface operations.
Dual-porosity model||A model representing interacting storage systems, commonly low-permeability matrix blocks and a more conductive fracture network.
Dual-permeability model||A model allowing flow within two interacting media as well as transfer between them, often representing matrix and fractures.
Pressure-dependent permeability||Permeability that changes as pore pressure and effective stress alter pore or fracture geometry.
`],
['Resources, volumes, and uncertainty', String.raw`
Petroleum resources||Petroleum quantities estimated to occur in discovered or undiscovered accumulations, classified by discovery, recoverability, and commercial maturity.
Petroleum reserves||Discovered petroleum quantities expected to be commercially recoverable by defined projects under specified conditions as of an evaluation date.
Proved reserves|1P;P1 reserves|Commercially recoverable reserves estimated with reasonable certainty under the applicable reporting framework; probabilistic 1P estimates commonly use at least 90 percent exceedance probability.
Probable reserves|P2 reserves|Additional reserves less certain than proved reserves, with the proved-plus-probable estimate commonly representing a 50 percent exceedance level in probabilistic evaluations.
Possible reserves|P3 reserves|Additional reserves less certain than probable reserves, with the combined proved-plus-probable-plus-possible estimate commonly using a 10 percent exceedance level.
Proved plus probable reserves|2P|The combined proved and probable reserve estimate, commonly associated with a median recoverable volume under probabilistic evaluation.
Proved plus probable plus possible reserves|3P|The combined proved, probable, and possible reserve estimate, representing a higher-volume, less-certain recoverable case.
Contingent resources||Potentially recoverable petroleum in known accumulations that is not currently commercial because one or more development contingencies remain.
Prospective resources||Potentially recoverable petroleum estimated in accumulations that have not yet been discovered.
Technically recoverable resources||Petroleum estimated recoverable using available technology, without requiring that recovery be economic under current conditions.
Economically recoverable resources||The portion of technically recoverable petroleum estimated to be profitable under specified prices, costs, technology, and operating assumptions.
Original oil in place|OOIP;STOIIP;Stock-tank oil initially in place|The oil initially contained in an accumulation before production, commonly expressed as equivalent stock-tank volume.
Original gas in place|OGIP;GIIP;Gas initially in place|The gas initially contained in an accumulation before production, reported at specified reference conditions.
Hydrocarbon pore volume|HCPV|The pore volume occupied by hydrocarbons, commonly estimated from bulk volume, net fraction, porosity, and hydrocarbon saturation.
Volumetric resource estimation||Calculation of petroleum volumes from mapped rock volume, reservoir fraction, porosity, fluid saturation, and fluid-volume conversion factors.
Assessment unit|AU|A mapped part of a petroleum system containing accumulations or potential accumulation areas that can be evaluated using a consistent geological assessment approach.
Geological risk||The possibility that one or more geological requirements for the specified accumulation or development outcome are absent or inadequate.
Resource uncertainty||The range of plausible petroleum quantities arising from incomplete knowledge, variability, and alternative geological or development interpretations.
Deterministic resource estimate||A volume estimate calculated using selected input values or discrete scenarios rather than a full probability distribution.
Probabilistic resource estimate||A volume estimate represented by a probability distribution that combines uncertain inputs with their dependencies.
Monte Carlo simulation||Repeated sampling of uncertain inputs to estimate a distribution of possible outcomes, subject to the chosen models and correlations.
P90 resource estimate||A volume estimate that has a 90 percent probability of being equaled or exceeded within the stated model and conditioning assumptions.
P50 resource estimate||A median volume estimate with a 50 percent probability of being equaled or exceeded within the stated model.
P10 resource estimate||A volume estimate that has a 10 percent probability of being equaled or exceeded within the stated model, commonly representing a high-volume case.
Risked resources||Resources adjusted for specified probabilities, such as discovery or development, with the included risks and calculation basis stated explicitly.
Unrisked resources||Estimated resources before applying specified discovery or development probabilities, commonly conditional on the interpreted accumulation being present.
Sensitivity analysis||Evaluation of how changes in uncertain inputs or assumptions alter estimated volumes, risks, or development outcomes.
`],
['Stratigraphy and reservoir diagenesis', String.raw`
Stratigraphy||The study of rock layers, their succession, relationships, distribution, and interpretation through geological time.|Stratigraphie|علم الطبقات
Sequence stratigraphy||Interpretation of sedimentary successions using genetically related packages and bounding surfaces associated with changes in accommodation and sediment supply.|Stratigraphie séquentielle|الطباقية التتابعية
Sedimentology||The study of sediment origin, transport, deposition, and subsequent modification, used to predict source, reservoir, and seal distributions.|Sédimentologie|علم الرسوبيات
Facies||A body of rock or sediment distinguished by characteristics that reflect its formation and depositional or biological conditions.|Faciès|السحنة
Depositional environment||The physical, chemical, and biological setting in which sediment accumulates, influencing reservoir geometry and source-rock or seal development.
Facies association||A group of related facies that together help identify a depositional setting or sedimentary process assemblage.
Electrofacies||A set of similar well-log responses interpreted to represent a rock or reservoir class, calibrated where possible against geological observations.
Accommodation space||The space available for sediment to accumulate, controlled by subsidence, relative water level, and sedimentary processes.
Sequence boundary||A stratigraphic surface separating depositional sequences, commonly associated with erosion, nondeposition, or a basinward shift in deposition.
Maximum flooding surface|MFS|A stratigraphic surface associated with the most landward extent of marine flooding within a transgressive-regressive cycle.
Transgressive systems tract|TST|A set of genetically related deposits accumulated during an overall landward shift of depositional environments.
Highstand systems tract|HST|A depositional package commonly formed after maximum flooding as sediment supply produces aggradation and progradation under relatively high accommodation.
Lowstand systems tract|LST|A depositional package associated with relatively low accommodation and commonly basinward-positioned sediment accumulation within a sequence framework.
Reservoir correlation||Matching reservoir intervals between wells or datasets using stratigraphy, logs, fossils, seismic information, and geological context.
Biostratigraphy||Subdivision and correlation of strata using their fossil content, providing age and environmental constraints for subsurface interpretation.
Chemostratigraphy||Subdivision and correlation of strata using systematic variations in chemical composition or isotopic signatures.
Diagenesis||Physical, chemical, and biological changes affecting sediments after deposition and before conditions conventionally assigned to metamorphism.|Diagenèse|التحور الرسوبي
Cementation||Precipitation of minerals in pore space that binds sediment grains and commonly reduces pore volume and connectivity.
Sediment compaction|Compaction;Rock compaction|Reduction of sediment or rock volume through grain rearrangement, deformation, or dissolution under increasing effective stress.
Mechanical compaction||Reduction in pore volume caused by grain rearrangement, bending, crushing, or deformation rather than mineral dissolution.
Chemical compaction||Reduction in rock volume associated with stress-related mineral dissolution and transfer of dissolved material.
Pressure solution||Dissolution at stressed grain contacts followed by transport of dissolved material, contributing to compaction and cement formation.
Stylolite||An irregular dissolution surface with interlocking peaks and seams, commonly formed by pressure solution and potentially affecting reservoir flow.
Dissolution porosity||Secondary pore space created when minerals are removed by fluids, potentially enhancing storage or connectivity.
Dolomitization||Replacement or transformation of calcium-carbonate material into dolomite, potentially changing pore structure and reservoir quality.
Dedolomitization||Replacement or alteration of dolomite by calcite, commonly involving fluid-rock reactions that modify carbonate pore systems.
Quartz overgrowth||Authigenic quartz cement growing in crystallographic continuity with detrital quartz grains, commonly reducing sandstone porosity.
Authigenic clay||Clay formed within a sediment or rock after deposition, potentially lining or blocking reservoir pores and affecting electrical behavior.
Pore-lining clay||Clay coating pore or grain surfaces, potentially preserving some pore volume while reducing effective pore-throat size.
Pore-filling cement||Mineral material precipitated within pores that reduces available storage volume and can obstruct connected flow pathways.
Carbonate dissolution||Removal of carbonate minerals by reactive fluids, creating or enlarging pores under suitable geochemical conditions.
Karst reservoir||A carbonate reservoir whose storage and flow architecture is strongly influenced by dissolution features such as cavities and enlarged fractures.
Burial diagenesis||Post-depositional mineralogical and textural changes occurring during burial, driven by temperature, stress, and fluid-rock reactions.
Meteoric diagenesis||Alteration by fluids derived mainly from precipitation, commonly associated with dissolution and cementation during exposure or shallow circulation.
Diagenetic history||The interpreted sequence of post-depositional alterations affecting a rock, used to explain the evolution of reservoir quality.
Paragenetic sequence||The relative order of mineral growth, dissolution, fracturing, and other events inferred from their textural relationships.
Reservoir quality prediction||Forecasting storage and flow properties by combining depositional architecture, burial history, mineralogy, and diagenetic processes.
Capillary-bound water||Water retained in small pores or pore corners by capillary forces and relatively immobile under the pressure conditions considered.
Saturation-height function||A relationship describing fluid saturation as a function of height above a fluid reference level for specified rock and fluid properties.
`],
['Hydrocarbons and fluid chemistry', String.raw`
Hydrocarbon||An organic compound composed only of carbon and hydrogen, with many such compounds forming the principal constituents of petroleum.|Hydrocarbure|الهيدروكربون
Alkanes|Paraffins|Saturated acyclic hydrocarbons whose molecules contain only single carbon-carbon bonds, including methane and many constituents of oil and gas.
Cycloalkanes|Naphthenes|Saturated hydrocarbons containing carbon rings, forming one of the major molecular groups in crude oil.
Aromatic hydrocarbons||Hydrocarbons containing aromatic ring systems, forming a petroleum fraction with characteristic chemical and physical behavior.
Methane|CH4;CH₄|The simplest alkane, with one carbon and four hydrogen atoms, and the dominant hydrocarbon in most natural gas accumulations.
Ethane|C2H6;C₂H₆|A two-carbon alkane commonly present in natural gas and recovered among natural gas liquids.
Propane|C3H8;C₃H₈|A three-carbon alkane occurring in natural gas and petroleum liquids, readily liquefied under moderate pressure at suitable temperatures.
Butanes|C4 hydrocarbons|Four-carbon alkanes occurring as normal and branched isomers, commonly recovered from natural gas or petroleum processing.
Pentanes plus|C5+|A grouped petroleum fraction containing pentanes and heavier hydrocarbons, with the precise upper composition depending on the reporting method.
Normal alkanes|n-alkanes|Straight-chain saturated hydrocarbons whose abundance patterns help characterize petroleum composition and alteration.
Isoprenoids||Compounds with carbon skeletons related to isoprene building units, including pristane and phytane used in petroleum geochemistry.
Resins in petroleum||A relatively polar, heavy fraction of petroleum separated operationally in compositional analysis, influencing fluid stability and surface interactions.
Wax precipitation||Formation of solid paraffin-rich crystals as petroleum conditions change, potentially obstructing pores, tubing, and flowlines.
Asphaltene precipitation||Separation of asphaltene-rich solids from petroleum after changes in pressure, temperature, or composition destabilize the fluid.
Hydrogen sulfide|H2S;H₂S|A toxic sulfur-containing gas that may occur naturally in petroleum systems and influences fluid quality, corrosion, and handling requirements.
Thermochemical sulfate reduction|TSR|High-temperature reactions between sulfate and organic compounds that can consume hydrocarbons and generate hydrogen sulfide in suitable geological settings.
Bacterial sulfate reduction|BSR|Microbial reduction of sulfate that can produce sulfide and alter reservoir or formation-water chemistry.
Formation-water salinity||The concentration of dissolved salts in subsurface water, affecting fluid density, electrical resistivity, and rock-fluid reactions.
Brine incompatibility||A tendency for mixed waters to precipitate minerals or otherwise react adversely because of differences in dissolved composition.
Mineral scale||A deposit of precipitated minerals formed when fluid conditions or mixing produce supersaturation, potentially restricting well or formation flow.
Interfacial tension|IFT|The force per unit length, or equivalent energy per unit area, associated with the boundary between two fluid phases.
`],
['Development and subsurface stewardship', String.raw`
Field development plan|FDP|An integrated plan for wells, facilities, reservoir management, and monitoring based on a discovered field's geology, resources, and development objectives.
Development well||A well drilled within a known accumulation to produce petroleum, inject fluids, or support the development strategy.
Horizontal well||A well with a section drilled approximately parallel to the target reservoir, increasing contact with the productive interval.
Geosteering||Adjustment of a well trajectory using geological and measurement information to keep the borehole within a target interval.
Well completion||The arrangement of equipment and reservoir connections that prepares a drilled well for controlled production or injection.
Perforation||An opening made through casing and cement to connect a wellbore with a selected formation interval.
Zonal isolation||Separation of formation intervals in a well to prevent unwanted communication and allow controlled production, injection, or abandonment.
Artificial lift||Equipment or methods that supply energy to help move reservoir fluids to the surface when natural well flow is insufficient.
Produced water||Water brought to the surface with oil or gas production, potentially containing dissolved salts, hydrocarbons, and treatment chemicals.
Flowback||Fluid returning to the surface after a treatment such as hydraulic fracturing, potentially mixed with formation water and hydrocarbons.
Well integrity||The ability of a well's barriers to contain fluids and prevent unintended movement throughout its operating and abandonment life.
Caprock integrity||The ability of a sealing rock to limit fluid escape under the pressure, temperature, chemical, and mechanical conditions considered.
Fault reactivation||Renewed slip on an existing fault when changes in stress or pore pressure make movement possible.
Reservoir compaction||Reduction in reservoir bulk or pore volume as the rock framework deforms, often associated with pressure depletion.
Production-induced subsidence||Surface lowering caused partly by compaction of depleted subsurface reservoirs or surrounding formations.
Induced seismicity||Seismic events influenced by human activities that alter stress or pore pressure, including some subsurface injection and withdrawal operations.
Methane leakage||Unintended escape of methane from geological pathways, wells, equipment, or infrastructure into surrounding environments.
Geological carbon storage||Long-term placement of carbon dioxide in suitable subsurface formations, requiring evaluation of capacity, injectivity, containment, and monitoring.
Depleted reservoir||A previously productive accumulation whose pressure or recoverable petroleum has been substantially reduced by withdrawal.
Area of review||A defined region evaluated for potential effects and migration pathways around an injection project under the applicable technical or regulatory framework.
Well abandonment||Permanent closure of a well using barriers designed to isolate formations and prevent unintended fluid movement.
`]
];

export const petroleumEntries=groups.flatMap(([topic,rows])=>rows.trim().split('\n').map((row,index)=>{
 const [name,aliases,definition,fr,ar]=row.split('|');
 if(!name||!definition||definition.length<40)throw Error(`Invalid petroleum entry: ${topic}, row ${index+1}`);
 return {name:{en:name,...fr?{fr}:{},...ar?{ar}:{}},aliases:aliases?aliases.split(';'):[],definition:{en:definition},topic};
}));
export const petroleumTopics=groups.map(([name])=>name);
