"""Build a definition-bearing Earth science glossary from open agency vocabularies.

GEMET: CC BY 4.0; USGS: public domain; NASA GCMD: cited open science keywords.
No terms without a substantive source definition are counted.
"""
from pathlib import Path
from collections import Counter
import xml.etree.ElementTree as ET
import gzip,json,re,unicodedata,hashlib,sys,html
sys.stdout.reconfigure(encoding='utf8')
root=Path(__file__).resolve().parent.parent
source=root/'docs/catalogue-sources'
S='{http://www.w3.org/2004/02/skos/core#}'
R='{http://www.w3.org/1999/02/22-rdf-syntax-ns#}'
L='{http://www.w3.org/XML/1998/namespace}lang'
def clean(value):
 value=html.unescape(value or '')
 value=re.sub(r'<br\s*/?>|</p>|</li>','\n',value,flags=re.I)
 value=re.sub(r'</?[a-z][^>]*>','',value,flags=re.I)
 return re.sub(r'\s+',' ',value).strip()
def key(value):return re.sub(r'[^\w]+',' ',unicodedata.normalize('NFKD',value).casefold()).strip()
def good(value):
 return len(value)>=40 and len(value.split())>=6 and not re.match(r'^(no definition|not available|n/?a|tbd|see also|see:)',value,re.I)
def title(value):
 # Preserve source spelling; all-capitals GCMD labels become readable sentence case.
 if not value.isupper():return value[:1].upper()+value[1:]
 result=value[:1].upper()+value[1:].lower()
 abbreviations={'CO2':'CO₂','CH4':'CH₄','N2O':'N₂O','NO2':'NO₂','SO2':'SO₂','CO':'CO','O2':'O₂','O3':'O₃','NOX':'NOₓ','NH4':'NH₄','CFC':'CFC','DMS':'DMS','PM2.5':'PM2.5','PM10':'PM10','GPS':'GPS','GIS':'GIS','NDVI':'NDVI','SAR':'SAR','LIDAR':'LiDAR','UV':'UV','PAR':'PAR','ENSO':'ENSO','SST':'SST','TIR':'TIR','NIR':'NIR','SWIR':'SWIR','PH':'pH'}
 for original,replacement in abbreviations.items():
  if re.search(r'(?<!\w)'+re.escape(original)+r'(?!\w)',value):result=re.sub(r'(?<!\w)'+re.escape(original)+r'(?!\w)',replacement,result,flags=re.I)
 return result
dictionary={}
def add(name,definitions,category,source_name,url,aliases=None):
 name={lang:clean(value) for lang,value in name.items() if clean(value)}
 definitions={lang:clean(value) for lang,value in definitions.items() if good(clean(value))}
 if not name.get('en') or not definitions.get('en'):return
 canonical=key(name['en'])
 if canonical in dictionary:
  current=dictionary[canonical]
  # Only merge translations for the same preferred term, never unrelated definitions.
  for lang,value in name.items():current['name'].setdefault(lang,title(value))
  current['aliases']=sorted(set(current['aliases']+[clean(v) for v in aliases or [] if clean(v)]))
  return
 dictionary[canonical]={'id':'concept-'+hashlib.sha256(canonical.encode()).hexdigest()[:16],'name':{lang:title(value) for lang,value in name.items()},'definition':definitions,'category':category,'source':source_name,'url':url,'aliases':sorted(set(clean(v) for v in aliases or [] if clean(v)))}

# GEMET provides editorially translated names and Arabic definitions.
gemet={};groups={}
with gzip.open(source/'gemet-full.rdf.gz','rb') as handle:
 for _,node in ET.iterparse(handle,events=['end']):
  uri=node.get(R+'about','')
  if not uri:continue
  if uri.startswith('concept/'):
   record=gemet.setdefault(uri,{'name':{},'definition':{},'parents':[],'aliases':[]})
   for child in node:
    lang=child.get(L)
    if child.tag in [S+'prefLabel',S+'definition'] and lang in ['en','fr','ar']:record['name' if child.tag==S+'prefLabel' else 'definition'][lang]=child.text or ''
    if child.tag==S+'altLabel' and lang in ['en','fr','ar']:record['aliases'].append(child.text or '')
    if child.tag==S+'broader':record['parents'].append(child.get(R+'resource'))
  elif uri.startswith('group/'):
   group=groups.setdefault(uri,{'name':{},'members':[]})
   for child in node:
    if child.tag==S+'prefLabel' and child.get(L) in ['en','fr','ar']:group['name'][child.get(L)]=child.text
    if child.tag==S+'member':group['members'].append(child.get(R+'resource'))
  node.clear()
group_categories=[('4856','Geology'),('4125','Hydrology'),('618','Atmospheric Science'),('4630','Geomorphology'),('893','Ecology'),('1349','Environmental Chemistry'),('6237','Geophysics'),('7956','Planetary Science'),('9117','Environmental Science'),('10118','Natural Resources'),('10114','Environmental Science'),('7243','Natural Hazards'),('234','Agriculture and Forestry'),('2711','Energy Resources'),('10111','Earth Sciences')]
for group_id,category in group_categories:
 for uri in groups.get('group/'+group_id,{}).get('members',[]):
  record=gemet.get(uri)
  if record:add(record['name'],record['definition'],category,'EEA GEMET','https://www.eionet.europa.eu/gemet/en/'+uri,record['aliases'])

# USGS supplies core geology, methods, and process vocabulary; exclude administration
# and generic publication/product types from the dictionary's concept count.
usgs={}
for node in ET.parse(source/'usgs-earth-science.rdf').getroot():
 uri=node.get(R+'about','');name=node.findtext(S+'prefLabel')
 if name:usgs[uri]={'name':name,'definition':node.findtext(S+'scopeNote') or '', 'parents':[child.get(R+'resource') for child in node.findall(S+'broader')],'aliases':[child.text for child in node.findall(S+'altLabel')]}
def ancestors(records,uri,seen=None):
 seen=set() if seen is None else seen
 if uri in seen:return []
 seen.add(uri);record=records.get(uri,{})
 return [record.get('name','')]+[value for parent in record.get('parents',[]) for value in ancestors(records,parent,seen)]
def discipline(text,default='Earth Sciences'):
 text=text.lower()
 for pattern,category in [(r'soil|pedolog','Soil Science'),(r'climat','Climate Science'),(r'palaeo|paleo|fossil','Palaeontology'),(r'cryosph|glaci|snow|ice sheet|permafrost','Cryosphere'),(r'ocean|marine|sea floor|seafloor','Oceanography'),(r'hydrolog|groundwater|watershed|aquifer|river|lake','Hydrology'),(r'atmospher|meteorolog|weather','Atmospheric Science'),(r'seismo|seismic|geophys|gravimetr|gravity|geomagnet|geoid|ellipsoid','Geophysics'),(r'stratigraph','Stratigraphy'),(r'sediment','Sedimentology'),(r'petrolog|igneous|metamorph','Petrology'),(r'mineral','Mineralogy'),(r'geochem|isotop','Geochemistry'),(r'geomorph|erosion|landform','Geomorphology'),(r'geolog|tecton|volcan','Geology'),(r'remote sensing|spectral|cartograph|mapping|geographic information','Remote Sensing and GIS'),(r'ecolog|ecosystem|biospher|biodiversity','Ecology')]:
  if re.search(pattern,text):return category
 return default
for uri,record in usgs.items():
 path=ancestors(usgs,uri)
 if not any(value in path for value in ['sciences','topics','methods']):continue
 if any(value in path for value in ['institutional structures and activities','product types']):continue
 add({'en':record['name']},{'en':record['definition']},discipline(' '.join(path)),'USGS Thesaurus',uri,record['aliases'])

# NASA's science hierarchy adds climate, ocean, land, atmosphere, and cryosphere
# variables. Services, administration, taxonomic lists, and human dimensions are excluded.
nasa={}
for filename in ['gcmd-science.rdf','gcmd-science-2.rdf']:
 for node in ET.parse(source/filename).getroot().findall(S+'Concept'):
  uri=node.get(R+'about');nasa[uri]={'name':node.findtext(S+'prefLabel') or '', 'definition':node.findtext(S+'definition') or '', 'parents':[child.get(R+'resource') for child in node.findall(S+'broader')],'aliases':[child.text for child in node.findall(S+'altLabel')]}
topic_categories={'ATMOSPHERE':'Atmospheric Science','SOLID EARTH':'Geology','OCEANS':'Oceanography','LAND SURFACE':'Geomorphology','BIOSPHERE':'Ecology','CLIMATE INDICATORS':'Climate Science','TERRESTRIAL HYDROSPHERE':'Hydrology','CRYOSPHERE':'Cryosphere','SPECTRAL/ENGINEERING':'Remote Sensing and GIS','PALEOCLIMATE':'Palaeoclimatology','SUN-EARTH INTERACTIONS':'Space and Solar Physics'}
for uri,record in nasa.items():
 path=ancestors(nasa,uri)
 if 'EARTH SCIENCE' not in path:continue
 index=path.index('EARTH SCIENCE');topic=path[index-1] if index else ''
 if topic not in topic_categories:continue
 add({'en':record['name']},{'en':record['definition']},discipline(' '.join(path),topic_categories[topic]),'NASA GCMD','https://gcmd.earthdata.nasa.gov/KeywordViewer/scheme/sciencekeywords/'+uri,record['aliases'])

records=sorted(dictionary.values(),key=lambda row:key(row['name']['en']))
assert len(records)>1500
assert len({key(row['name']['en']) for row in records})==len(records)
assert all(good(row['definition']['en']) for row in records)
payload={'retrieved':'2026-11-08','sources':['GEMET 4.2.3 / CC BY 4.0','USGS Thesaurus / public domain','NASA GCMD Science Keywords 25.1'],'records':records}
(root/'assets/reference/earth-dictionary.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf8')
print(json.dumps({'concepts':len(records),'sources':Counter(row['source'] for row in records),'categories':Counter(row['category'] for row in records),'definitionLanguages':Counter(lang for row in records for lang in row['definition'])},ensure_ascii=False),flush=True)
