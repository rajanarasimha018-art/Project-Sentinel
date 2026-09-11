import os
import sys
import re
from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')
source_dir = 'data/raw/source'

files = [
    'FlashReport_August_2025.pdf',
    'FlashReport_September_2025.pdf',
    'FlashReport_October_2025.pdf',
    'FlashReport_November_2025.pdf',
    'FlashReport_December_2025.pdf',
    'FlashReport_January_2026.pdf',
    'FlashReport_February_2026.pdf',
    'FlashReport_March_2026.pdf',
    'FlashReport_April2026.pdf',
    'FlashReport_May2026.pdf',
    'FlashReport_June_2026.pdf',
    'FlashReport_July_2026.pdf'
]

for f in files:
    path = os.path.join(source_dir, f)
    reader = PdfReader(path)
    total_pages = len(reader.pages)
    
    # 1. Find Table 4 separator page
    t4_sep_page = None
    t4_title = ""
    next_sep_page = None
    next_title = ""
    
    for idx, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        # Check if separator page (usually short text with "Table 4: ...")
        m = re.search(r'Table\s*4\s*:\s*([^\n]+)', text, re.IGNORECASE)
        if m and idx >= 2 and len(text.strip().split('\n')) < 15:
            t4_sep_page = idx + 1
            t4_title = m.group(1).strip()
            break
            
    if t4_sep_page:
        # Find next table separator page
        for idx in range(t4_sep_page, total_pages):
            text = reader.pages[idx].extract_text() or ""
            m = re.search(r'Table\s*[56]\s*:\s*([^\n]+)', text, re.IGNORECASE)
            if m and len(text.strip().split('\n')) < 15:
                next_sep_page = idx + 1
                next_title = m.group(0).strip()
                break
                
    end_page = (next_sep_page - 1) if next_sep_page else total_pages
    data_pages = list(range(t4_sep_page + 1, end_page + 1)) if t4_sep_page else []
    
    print(f"\n================ {f} ================", flush=True)
    print(f"Total Pages: {total_pages} | T4 Sep Page: {t4_sep_page} ({t4_title}) | Next Sep Page: {next_sep_page} ({next_title})", flush=True)
    print(f"Table 4 Data Pages: {data_pages[0] if data_pages else None} to {data_pages[-1] if data_pages else None} (Count: {len(data_pages)})", flush=True)
    
    # Inspect first data page
    if data_pages:
        first_page_txt = reader.pages[data_pages[0] - 1].extract_text() or ""
        lines = [l.strip() for l in first_page_txt.split('\n') if l.strip()]
        print("  Header lines (first data page):", lines[:6], flush=True)
        
        # Check serial numbers across data pages
        sl_nums = []
        for p in data_pages:
            txt = reader.pages[p - 1].extract_text() or ""
            # Match project codes like (612786) or (701107)
            codes = re.findall(r'\(([0-9]{5,7})\)', txt)
            # Find sl nums
            # In table, serial numbers appear as numbers on their own lines or before project name
            sl_matches = re.findall(r'(?:^|\n)([0-9]{1,4})\n[^\n]+\n\([^\n]+\)\n\([0-9]{5,7}\)', txt)
            if sl_matches:
                sl_nums.extend([int(x) for x in sl_matches])
        print(f"  Sample detected Sl.Nos: min={min(sl_nums) if sl_nums else 'none'}, max={max(sl_nums) if sl_nums else 'none'}, count={len(sl_nums)}", flush=True)
