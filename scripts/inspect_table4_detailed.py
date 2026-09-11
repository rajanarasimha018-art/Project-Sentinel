import os
import sys
import re
from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')
source_dir = 'data/raw/source'
files = sorted([f for f in os.listdir(source_dir) if f.endswith('.pdf')])

for f in files:
    path = os.path.join(source_dir, f)
    reader = PdfReader(path)
    total_pages = len(reader.pages)
    
    # Check Table of Contents on page 2 (index 1)
    toc_lines = reader.pages[1].extract_text().split('\n') if total_pages > 1 else []
    t4_toc = [l.strip() for l in toc_lines if 'Table 4' in l or 'Table-4' in l]
    t6_toc = [l.strip() for l in toc_lines if 'Table 6' in l or 'Table-6' in l]
    
    t4_pages = []
    t6_pages = []
    
    for idx, page in enumerate(reader.pages):
        if idx < 2:
            continue
        text = page.extract_text() or ""
        first_few_lines = "\n".join(text.split('\n')[:5])
        if re.search(r'Table[\s\-:]*4\b', first_few_lines, re.IGNORECASE):
            t4_pages.append(idx + 1)
        if re.search(r'Table[\s\-:]*6\b', first_few_lines, re.IGNORECASE):
            t6_pages.append(idx + 1)
            
    print(f"{f}:", flush=True)
    print(f"  Pages: {total_pages}", flush=True)
    print(f"  TOC T4: {t4_toc} | TOC T6: {t6_toc}", flush=True)
    if t4_pages:
        print(f"  T4 Header on pages: {min(t4_pages)} to {max(t4_pages)} (count: {len(t4_pages)})", flush=True)
    else:
        print(f"  T4 Header on pages: NONE FOUND", flush=True)
    if t6_pages:
        print(f"  T6 Header on pages: {min(t6_pages)} to {max(t6_pages)} (count: {len(t6_pages)})", flush=True)
    else:
        print(f"  T6 Header on pages: NONE FOUND", flush=True)
