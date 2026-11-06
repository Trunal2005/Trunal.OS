"""Lossless content selection + web encoding of verified existing UI captures.
Only crops/resizing/compression are performed; no UI element or result is edited.
Original repositories are read-only; source copies remain in ignored .local.
"""
from pathlib import Path
import hashlib
import json
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
STAGE = ROOT / '.local/project-media'
OUT = ROOT / 'public/project-media'
specs = [
 ('bi','dashboard',r'C:\projects\Business platform\Sem-5\frontend\test-results\ui-design-desktop-and-lapt-f2b83-able-with-no-browser-errors-chromium\-dashboard.png',None,(550,1550)),
 ('bi','dataset-manager',r'C:\projects\Business platform\Sem-5\frontend\test-results\ui-design-desktop-and-lapt-f2b83-able-with-no-browser-errors-chromium\-datasets.png',None,None),
 ('recovery','command-center',str(STAGE/'raw/recovery-command-center.png'),'docs/assets/command-center.png',None),
 ('recovery','analytics',str(STAGE/'raw/recovery-analytics.png'),'docs/assets/analytics.png',None),
 ('cybertwin','security-overview',r'C:\projects\CN project\docs\screenshots\overview.png','docs/screenshots/overview.png',960),
 ('cybertwin','network-replay',r'C:\projects\CN project\docs\screenshots\cn-observed-network.png','docs/screenshots/cn-observed-network.png',None),
 ('anumitra','action-desk',r'C:\projects\sih\Anumitra(SIH26262)\docs\evidence\operations-2026-10-30\full-3\overview-1440.png','docs/evidence/operations-2026-10-30/full-3/overview-1440.png',1000),
 ('anumitra','evc-planner',r'C:\projects\sih\Anumitra(SIH26262)\docs\evidence\operations-2026-10-30\full-3\operations\evc-after.png','docs/evidence/operations-2026-10-30/full-3/operations/evc-after.png',None),
 ('resume','upload-workspace',str(STAGE/'raw/resume-upload.png'),None,None),
]
records=[]
for project,name,source,repo_path,crop_height in specs:
    source=Path(source); raw=source.read_bytes()
    tree=json.loads((STAGE/f'{project}-tree.json').read_text(encoding='utf-8-sig'))
    blob=hashlib.sha1(f'blob {len(raw)}\0'.encode()+raw).hexdigest()
    if repo_path:
        expected=next(x['sha'] for x in tree['tree'] if x['path']==repo_path)
        assert blob==expected, f'Local bytes do not match committed screenshot: {source}'
    image=Image.open(source).convert('RGB')
    dest=OUT/project; dest.mkdir(parents=True,exist_ok=True)
    full=dest/f'{name}-full.webp';image.save(full,'WEBP',quality=92,method=6)
    crop_top,crop_bottom=crop_height if isinstance(crop_height,tuple) else (0,min(crop_height or image.height,image.height))
    preview=image.crop((0,crop_top,image.width,crop_bottom))
    preview.thumbnail((1200,1600),Image.Resampling.LANCZOS)
    preview.save(dest/f'{name}.webp','WEBP',quality=88,method=6)
    preview.save(dest/f'{name}.png','PNG',optimize=True)
    thumb=preview.copy();thumb.thumbnail((208,150),Image.Resampling.LANCZOS)
    thumb.save(dest/f'{name}-thumb.webp','WEBP',quality=82,method=6)
    records.append(dict(project=project,name=name,sourcePath=str(source),sourceRepoPath=repo_path,sourceRef=tree['sha'],sourceGitBlob=blob,sourceSha256=hashlib.sha256(raw).hexdigest(),originalSize=list(image.size),previewSize=list(preview.size),fullSize=list(image.size),previewCrop=f'original rectangle (0,{crop_top},{image.width},{crop_bottom}); complete original available in enlarge view' if crop_height else 'no crop',files=[dict(path=str(p.relative_to(ROOT)).replace('\\','/'),bytes=p.stat().st_size) for p in sorted(dest.glob(f'{name}*'))],privacy='Manually inspected: only synthetic/demo/role-alias data; no private contact, key, token or real customer records',publication='Local integration authorized by owner; public release still requires owner approval'))

# Preserve the requested portrait appearance while avoiding a ~962 KB header load.
portrait=Image.open(ROOT/'src/assets/trunal-portrait.png').convert('RGB')
portrait.thumbnail((144,192),Image.Resampling.LANCZOS)
portrait.save(ROOT/'src/assets/trunal-portrait.webp','WEBP',quality=88,method=6)
(STAGE/'asset-manifest.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
print(json.dumps([dict(project=r['project'],name=r['name'],preview=r['previewSize'],previewBytes=next(f['bytes'] for f in r['files'] if f['path'].endswith(f"/{r['name']}.webp"))) for r in records],indent=2))
