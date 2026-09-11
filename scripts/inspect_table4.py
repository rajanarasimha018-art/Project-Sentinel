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
    
    # Check table of contents on page 2 (index 1)
    toc_text = reader.pages[1].extract_text() if total_pages > 1 else ""
    table4_toc_match = re.search(r'Table\s*4[^\n]*\n?([^\n]*)', toc_text, re.IGNORECASE)
    
    # Scan pages from back to find Table 4 pages
    table4_start = None
    table4_end = None
    max_sl = 0
    
    for idx, page in enumerate(reader.pages):
        text = page.extract_text()
        if 'All Ongoing Projects' in text:
            if table4_start is None:
                table4_start = idx + 1
            table4_end = idx + 1
            # Look for serial numbers at start of line
            sl_matches = re.findall(r'\n([0-9]{1,4})\n[^\n]+(?:\([A-Za-z0-9\s/\[\]\-&,.]+\))', text)
            for m in sl_matches:
                val = int(m)
                if val > max_sl and val < 5000:
                    max_sl = val
                    
    print(f"File: {f} | Pages: {total_pages} | Table 4: p.{table4_start} to p.{table4_end} | Max Sl.No: {max_sl}", flush=True)
