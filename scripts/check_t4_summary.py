import os
import sys
import re
from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')
source_dir = 'data/raw/source'

MONTH_FILES = [
    ('2025-08-01', 'FlashReport_August_2025.pdf'),
    ('2025-09-01', 'FlashReport_September_2025.pdf'),
    ('2025-10-01', 'FlashReport_October_2025.pdf'),
    ('2025-11-01', 'FlashReport_November_2025.pdf'),
    ('2025-12-01', 'FlashReport_December_2025.pdf'),
    ('2026-01-01', 'FlashReport_January_2026.pdf'),
    ('2026-02-01', 'FlashReport_February_2026.pdf'),
    ('2026-03-01', 'FlashReport_March_2026.pdf'),
    ('2026-04-01', 'FlashReport_April2026.pdf'),
    ('2026-05-01', 'FlashReport_May2026.pdf'),
    ('2026-06-01', 'FlashReport_June_2026.pdf'),
    ('2026-07-01', 'FlashReport_July_2026.pdf')
]

for month, fname in MONTH_FILES:
    path = os.path.join(source_dir, fname)
    reader = PdfReader(path)
    total_pages = len(reader.pages)
    
    # Locate Table 4 separator
    t4_sep = None
    t4_title = ""
    next_sep = None
    
    for idx, p in enumerate(reader.pages):
        txt = p.extract_text() or ""
        m = re.search(r'Table\s*4\s*:\s*([^\n]+)', txt, re.IGNORECASE)
        if m and idx >= 2 and len(txt.strip().split('\n')) < 20:
            t4_sep = idx + 1
            t4_title = m.group(1).strip()
            break
            
    if t4_sep:
        for idx in range(t4_sep, total_pages):
            txt = reader.pages[idx].extract_text() or ""
            m = re.search(r'Table\s*[56]\s*:\s*([^\n]+)', txt, re.IGNORECASE)
            if m and len(txt.strip().split('\n')) < 20:
                next_sep = idx + 1
                break
                
    end_page = (next_sep - 1) if next_sep else total_pages
    data_pages = list(range(t4_sep + 1, end_page + 1)) if t4_sep else []
    
    # Count occurrences of (PROJECT_CODE) inside Table 4 data pages
    codes_with_pages = []
    for p in data_pages:
        txt = reader.pages[p - 1].extract_text() or ""
        # Look for code lines like (612786) or (701107)
        matches = re.findall(r'\(([0-9]{5,7})\)', txt)
        for c in matches:
            codes_with_pages.append((p, c))
            
    print(f"[{month}] {fname}:")
    print(f"  T4 Title: '{t4_title}' | Sep Page: {t4_sep} | Data Pages: {data_pages[0] if data_pages else 'N/A'}-{data_pages[-1] if data_pages else 'N/A'} ({len(data_pages)} pages)")
    print(f"  Detected Project Codes: {len(codes_with_pages)} codes (unique: {len(set(c[1] for c in codes_with_pages))})")
