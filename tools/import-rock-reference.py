"""Extract factual BGS rock names/codes; source definitions are not republished."""
from pathlib import Path
import json,sys
root=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(root/'.cache/catalogue-python'))
import xlrd
sheet=xlrd.open_workbook(str(root/'docs/catalogue-sources/bgs-rocks.xls')).sheet_by_index(0)
headings=sheet.row_values(0)
rows=[dict(zip(headings,sheet.row_values(i))) for i in range(1,sheet.nrows)]
records=[{'code':row['CODE'],'name':row['DESCRIPTION'].split(' - ')[0].strip(),'type':'Composite name' if row['SOURCE_CODE']=='RC' else 'Root name','status':row['STATUS'],'rcsStatus':row['RCS_STATUS']} for row in rows if row['SOURCE_CODE']!='RD']
assert len(records)==3668
payload={'source':'https://webservices.bgs.ac.uk/data/services/vocabulary/1.0/vocabularies/DIC_ROCK_ALL.xls','credit':'British Geological Survey © UKRI, 2026. BGS Rock Classification Scheme, DIC_ROCK_ALL.','records':records}
(root/'assets/reference/rocks.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf8')
print(f'Imported {len(records)} names. Administrative dummy codes excluded.')
