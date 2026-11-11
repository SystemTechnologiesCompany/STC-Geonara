"""Import factual species records from the IMA-CNMNC master list.

The generated data retains attribution and CC BY-SA 3.0 licensing.
Run with the bundled Python runtime (pdfplumber is required).
"""
from pathlib import Path
import json,re,sys,unicodedata
import pdfplumber
sys.stdout.reconfigure(encoding='utf-8')
root=Path(__file__).resolve().parent.parent
records=[]
sub=str.maketrans('0123456789+-','₀₁₂₃₄₅₆₇₈₉₊₋')
sup=str.maketrans('0123456789+-','⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻')
with pdfplumber.open(root/'docs/catalogue-sources/ima-master-2026-11.pdf') as pdf:
 for page_index,page in enumerate(pdf.pages[2:],2):
  words=page.extract_words(x_tolerance=1,y_tolerance=2)
  anchors=sorted([w for w in words if 360<w['x0']<395 and w['top']>25 and w['text'] in ['A','G','Rd','Rn','Q']],key=lambda w:w['top'])
  for index,anchor in enumerate(anchors):
   low=(anchors[index-1]['top']+anchor['top'])/2 if index else (49.8 if page_index==2 else 20)
   high=(anchor['top']+anchors[index+1]['top'])/2 if index+1<len(anchors) else 580
   name_words=sorted([w for w in words if w['x0']<166 and low<=w['top']<high],key=lambda w:(round(w['top']/3),w['x0']))
   name=''.join(w['text'] for w in name_words).strip()
   if not name:raise ValueError(f'Missing mineral name at page {page_index+1}')
   chars=sorted([c for c in page.chars if 167<=c['x0']<359 and low<=c['top']<high and not c['text'].isspace()],key=lambda c:(round(c['x0'],1),c['top']))
   formula=''
   for char in chars:
    value=char['text']
    if char['size']<7:
     value=value.translate(sub if char['top']>anchor['top']+1 else sup)
    formula+=value
   country_words=sorted([w for w in words if 438<=w['x0']<505 and low<=w['top']<high],key=lambda w:(round(w['top']/3),w['x0']))
   year_words=sorted([w for w in words if 395<=w['x0']<438 and abs(w['top']-anchor['top'])<5],key=lambda w:w['x0'])
   records.append({'name':unicodedata.normalize('NFC',name),'formula':formula,'status':anchor['text'],'year':' '.join(w['text'] for w in year_words),'country':' '.join(w['text'] for w in country_words),'page':page_index+1})
  page.close()
  if (page_index+1)%40==0:print(f'Processed page {page_index+1}: {len(records)} species',flush=True)
names=[row['name'] for row in records]
assert len(records)==6252, f'Expected 6252 species, found {len(records)}'
assert len(set(names))==len(names), 'Duplicate species after extraction'
output=root/'assets/reference'
output.mkdir(parents=True,exist_ok=True)
payload={'source':'https://cnmnc.units.it/files/editor/IMA_Master_List_(2026-11).pdf','version':'November 2026','license':'CC BY-SA 3.0','credit':'IMA-CNMNC; The New IMA List of Minerals, compiled by Marco Pasero and contributors.','records':records}
(output/'minerals.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(f'Imported {len(records)} mineral species.',flush=True)
