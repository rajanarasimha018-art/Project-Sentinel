import os
import sys
import re
import json
from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')

MONTH_CONFIG = [
    {'month': '2025-08-01', 'file': 'FlashReport_August_2025.pdf', 'start': 37, 'end': 66, 'title': 'All Ongoing Projects', 'expected': 800},
    {'month': '2025-09-01', 'file': 'FlashReport_September_2025.pdf', 'start': 35, 'end': 36, 'title': 'Newly Added Projects', 'expected': 34},
    {'month': '2025-10-01', 'file': 'FlashReport_October_2025.pdf', 'start': 35, 'end': 36, 'title': 'Newly Added Projects', 'expected': 35},
    {'month': '2025-11-01', 'file': 'FlashReport_November_2025.pdf', 'start': 35, 'end': 36, 'title': 'Newly Added Projects', 'expected': 21},
    {'month': '2025-12-01', 'file': 'FlashReport_December_2025.pdf', 'start': 38, 'end': 38, 'title': 'Newly Added Projects', 'expected': 20},
    {'month': '2026-01-01', 'file': 'FlashReport_January_2026.pdf', 'start': 38, 'end': 47, 'title': 'Newly Added Projects', 'expected': 203},
    {'month': '2026-02-01', 'file': 'FlashReport_February_2026.pdf', 'start': 38, 'end': 50, 'title': 'Newly Added Projects', 'expected': 268},
    {'month': '2026-03-01', 'file': 'FlashReport_March_2026.pdf', 'start': 39, 'end': 39, 'title': 'Newly Added Projects', 'expected': 12},
    {'month': '2026-04-01', 'file': 'FlashReport_April2026.pdf', 'start': 37, 'end': 39, 'title': 'Newly Added Projects', 'expected': 55},
    {'month': '2026-05-01', 'file': 'FlashReport_May2026.pdf', 'start': 37, 'end': 38, 'title': 'Newly Added Projects', 'expected': 35},
    {'month': '2026-06-01', 'file': 'FlashReport_June_2026.pdf', 'start': 44, 'end': 44, 'title': 'Newly Added Projects', 'expected': 17},
    {'month': '2026-07-01', 'file': 'FlashReport_July_2026.pdf', 'start': 39, 'end': 40, 'title': 'Newly Added Projects', 'expected': 36}
]

def clean_agency(raw_agency):
    agency = raw_agency.strip()
    # remove outer parens if present
    if agency.startswith('(') and agency.endswith(')'):
        agency = agency[1:-1].strip()
    return agency

def clean_state(raw_state):
    s = re.sub(r'\s+', ' ', raw_state).strip()
    return s

def parse_date_val(val_str):
    if not val_str:
        return None
    val_str = val_str.strip(' ()-')
    if not val_str or val_str.upper() in ['NA', 'N.A.', 'NIL', '-', '']:
        return None
    # match MM/YYYY
    m = re.match(r'^(\d{1,2})/(\d{4})$', val_str)
    if m:
        month = int(m.group(1))
        year = int(m.group(2))
        return f"{year:04d}-{month:02d}-01"
    # match MM/YY
    m = re.match(r'^(\d{1,2})/(\d{2})$', val_str)
    if m:
        month = int(m.group(1))
        year = 2000 + int(m.group(2))
        return f"{year:04d}-{month:02d}-01"
    return None

def parse_num_val(val_str):
    if not val_str:
        return None
    val_str = val_str.strip(' ()-')
    if not val_str or val_str.upper() in ['NA', 'N.A.', 'NIL', '-', '']:
        return None
    try:
        cleaned = re.sub(r'[^0-9.]', '', val_str)
        if not cleaned:
            return None
        return float(cleaned)
    except:
        return None

# Let's inspect how records can be sliced on each page
print("Parser test module loaded.")
