import os
import sys
from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')
source_dir = 'data/raw/source'
files = sorted([f for f in os.listdir(source_dir) if f.endswith('.pdf')])

print(f"Total PDFs found: {len(files)}", flush=True)
for f in files:
    path = os.path.join(source_dir, f)
    reader = PdfReader(path)
    total_pages = len(reader.pages)
    
    # Check page 1 & 2 for title and month
    p1 = reader.pages[0].extract_text()
    p2 = reader.pages[1].extract_text() if total_pages > 1 else ""
    
    # Find month from text
    lines = [line.strip() for line in (p1 + "\n" + p2).split("\n") if line.strip()]
    month_line = lines[0] if lines else "UNKNOWN"
    for line in lines[:10]:
        if any(m in line.upper() for m in ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']):
            month_line = line
            break
            
    print(f"File: {f} | Pages: {total_pages} | Month header: {month_line}", flush=True)
