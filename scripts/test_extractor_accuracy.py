import os
import sys
import re
import json
from pypdf import PdfReader

sys.stdout.reconfigure(encoding='utf-8')
source_dir = 'data/raw/source'

MONTH_INFO = [
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

def clean_agency_str(raw):
    raw = raw.strip()
    if raw.startswith('(') and raw.endswith(')'):
        raw = raw[1:-1].strip()
    return raw

def parse_date(s):
    if not s:
        return None
    s = s.strip(' ()-')
    if not s or s.upper() in ['NA', 'N.A.', 'NIL', '-', '']:
        return None
    m = re.match(r'^(\d{1,2})/(\d{4})$', s)
    if m:
        return f"{int(m.group(2)):04d}-{int(m.group(1)):02d}-01"
    m = re.match(r'^(\d{1,2})/(\d{2})$', s)
    if m:
        return f"{2000+int(m.group(2)):04d}-{int(m.group(1)):02d}-01"
    return None

def parse_num(s):
    if not s:
        return None
    s = s.strip(' ()-')
    if not s or s.upper() in ['NA', 'N.A.', 'NIL', '-', '']:
        return None
    try:
        c = re.sub(r'[^0-9.]', '', s)
        return float(c) if c else None
    except:
        return None

def parse_page_records(page_text, page_num, report_month, report_id, section_name, current_ministry, current_sector, is_august=False):
    # Find all project codes: (123456)
    code_matches = list(re.finditer(r'\(([0-9]{5,7})\)', page_text))
    if not code_matches:
        return [], current_ministry, current_sector
        
    records = []
    
    for i, m in enumerate(code_matches):
        code = m.group(1)
        start_idx = code_matches[i-1].end() if i > 0 else 0
        end_idx = code_matches[i+1].start() if i + 1 < len(code_matches) else len(page_text)
        
        before_text = page_text[start_idx:m.start()].strip()
        after_text = page_text[m.end():end_idx].strip()
        
        before_lines = [l.strip() for l in before_text.split('\n') if l.strip()]
        
        # Extract agency from end of before_lines
        agency_lines = []
        k = len(before_lines) - 1
        while k >= 0:
            l = before_lines[k]
            if l.endswith(')') and not agency_lines:
                agency_lines.insert(0, l)
                if l.startswith('('):
                    k -= 1
                    break
            elif agency_lines and not agency_lines[0].startswith('('):
                agency_lines.insert(0, l)
                if l.startswith('('):
                    k -= 1
                    break
            else:
                break
            k -= 1
            
        agency = ' '.join(agency_lines).strip()
        if agency.startswith('(') and agency.endswith(')'):
            agency = agency[1:-1].strip()
            
        rem_lines = before_lines[:k+1] if k >= -1 else []
        
        # In rem_lines, identify Ministry, Sector, and Sl.No
        # Header lines can contain Ministry, Sector, Page headers, Subtotals
        name_start_idx = 0
        sl_no = None
        for idx_r, line_r in enumerate(rem_lines):
            if re.match(r'^(?:Ministry|Department)\s+(?:of|for)\s+', line_r, re.IGNORECASE):
                current_ministry = line_r.strip()
                name_start_idx = idx_r + 1
            elif line_r in ['All Ongoing Projects', 'Newly Added Projects', 'AUGUST 2025', 'SEPTEMBER 2025', 'OCTOBER 2025', 'NOVEMBER 2025', 'DECEMBER 2025', 'JANUARY 2026', 'FEBRUARY 2026', 'MARCH 2026', 'APRIL 2026', 'MAY 2026', 'JUNE 2026', 'JULY 2026', 'Sl.No', 'Project Name (Agency) (Project Code)', 'State', 'Date of Approval', '(Start Date)', 'MM/YYYY', 'Orignal/Target DoC', '(Revised DoC)', 'Orignal Cost', 'Revised Cost', '(Revised Cost)', 'in Rs. Crore', 'Cumulative', 'Expenditure', 'Physical Progress', '(%)', '****'] or re.match(r'^Total\s*\(\d+\)', line_r, re.IGNORECASE) or re.match(r'^\d+(\.\d+)?$', line_r) and float(line_r) > 5000:
                name_start_idx = idx_r + 1
            elif idx_r == name_start_idx and len(line_r) < 50 and not re.search(r'\d', line_r) and not line_r.startswith('Page'):
                # Likely Sector header
                current_sector = line_r.strip()
                name_start_idx = idx_r + 1
                
        # Now at name_start_idx, check if the first line is pure digits (Sl.No)
        if name_start_idx < len(rem_lines) and re.match(r'^\d+$', rem_lines[name_start_idx]):
            val = int(rem_lines[name_start_idx])
            if val < 3000: # Valid serial number
                sl_no = val
                name_start_idx += 1
                
        project_name = ' '.join(rem_lines[name_start_idx:]).strip()

        # Parse AFTER text:
        # Stop after text at the next serial number or subtotal
        # If there is a next record, its serial number might be at the end of after_text
        # Or footer lines at the end of the page
        a_lines = [l.strip() for l in after_text.split('\n') if l.strip()]
        # Filter out footer
        filtered_a = []
        for l in a_lines:
            if 'Project Assessment' in l or 'PAIMANA' in l or l.startswith('Page ') or 'ipm.mospi.gov.in' in l or 'paimana-proj' in l:
                break
            filtered_a.append(l)
            
        # In filtered_a, extract State, Dates, Costs
        state = ""
        sanction_date_raw = None
        start_date_raw = None
        orig_doc_raw = None
        rev_doc_raw = None
        orig_cost_raw = None
        rev_cost_raw = None
        cum_exp_raw = None
        phys_prog_raw = None
        
        # State detection:
        idx_a = 0
        state_parts = []
        while idx_a < len(filtered_a):
            l = filtered_a[idx_a]
            # Check if this line contains date e.g. 'Andhra Pradesh 08/2024'
            m_date = re.search(r'\s+(\d{1,2}/\d{4})$', l)
            if m_date:
                state_parts.append(l[:m_date.start()].strip())
                sanction_date_raw = m_date.group(1)
                idx_a += 1
                break
            # Check if line is a standalone date or paren date or NA
            if re.match(r'^\d{1,2}/\d{2,4}$', l) or l == 'NA' or l.startswith('(') or l == '-':
                break
            state_parts.append(l)
            idx_a += 1
            if not l.startswith('Multi-States') and not l.startswith('(') and not l.endswith(','):
                # Standard single line state
                break
                
        state = ' '.join(state_parts).strip()
        
        # Remaining tokens in filtered_a from idx_a onwards:
        tokens = []
        for l in filtered_a[idx_a:]:
            # Check if we hit the next record's serial number or Total
            if re.match(r'^Total\s*\(\d+\)', l, re.IGNORECASE):
                break
            tokens.append(l)
            
        # Re-join tokens and extract parenthesized and unparenthesized groups
        # Notice in raw text, parens might be split across lines: '(', '01/2024', ')'
        token_str = ' '.join(tokens)
        token_str = re.sub(r'\(\s+', '(', token_str)
        token_str = re.sub(r'\s+\)', ')', token_str)
        
        # Extract items: dates, numbers, dashes
        items = re.findall(r'\([^\)]+\)|[^\s\(\)]+', token_str)
        
        # Separate dates from costs:
        # Dates have '/' or are '-'
        # Costs are numeric or '(-)'
        dates_list = []
        nums_list = []
        
        for it in items:
            it_clean = it.strip(' ()')
            if '/' in it_clean or it_clean.upper() == 'NA':
                dates_list.append(it)
            elif it in ['(-)', '-'] and len(dates_list) < 4:
                dates_list.append(it)
            elif re.match(r'^-?\d+(\.\d+)?$', it_clean) or it in ['(-)', '-']:
                nums_list.append(it)
                
        # If sanction_date was already extracted from state line:
        if sanction_date_raw:
            # dates_list corresponds to: start_date, orig_doc, rev_doc
            if len(dates_list) > 0: start_date_raw = dates_list[0]
            if len(dates_list) > 1: orig_doc_raw = dates_list[1]
            if len(dates_list) > 2: rev_doc_raw = dates_list[2]
        else:
            if len(dates_list) > 0: sanction_date_raw = dates_list[0]
            if len(dates_list) > 1: start_date_raw = dates_list[1]
            if len(dates_list) > 2: orig_doc_raw = dates_list[2]
            if len(dates_list) > 3: rev_doc_raw = dates_list[3]
            
        if len(nums_list) > 0: orig_cost_raw = nums_list[0]
        if len(nums_list) > 1: rev_cost_raw = nums_list[1]
        if is_august:
            if len(nums_list) > 2: cum_exp_raw = nums_list[2]
            if len(nums_list) > 3: phys_prog_raw = nums_list[3]
            
        # Normalize fields according to data contract
        sanction_date = parse_date(sanction_date_raw)
        original_completion_date = parse_date(orig_doc_raw)
        anticipated_completion_date = parse_date(rev_doc_raw)
        
        sanctioned_cost_cr = parse_num(orig_cost_raw)
        anticipated_cost_cr = parse_num(rev_cost_raw) if parse_num(rev_cost_raw) is not None else sanctioned_cost_cr
        cumulative_expenditure_cr = parse_num(cum_exp_raw)
        physical_progress_pct = parse_num(phys_prog_raw)
        
        # Calculate derived financial metrics
        cost_overrun_cr = None
        cost_overrun_pct = None
        if anticipated_cost_cr is not None and sanctioned_cost_cr is not None:
            diff = anticipated_cost_cr - sanctioned_cost_cr
            cost_overrun_cr = round(diff, 2)
            if sanctioned_cost_cr > 0:
                cost_overrun_pct = round((diff / sanctioned_cost_cr) * 100, 2)
                
        financial_progress_pct = None
        if cumulative_expenditure_cr is not None and sanctioned_cost_cr is not None and sanctioned_cost_cr > 0:
            financial_progress_pct = round(min(100.0, (cumulative_expenditure_cr / sanctioned_cost_cr) * 100), 2)
            
        # Project status determination
        project_status = 'UNKNOWN'
        if physical_progress_pct is not None:
            if physical_progress_pct >= 100.0:
                project_status = 'COMPLETED'
            elif anticipated_completion_date and original_completion_date and anticipated_completion_date > original_completion_date:
                project_status = 'DELAYED'
            elif physical_progress_pct == 0.0 and cumulative_expenditure_cr == 0.0:
                project_status = 'STALLED'
            else:
                project_status = 'ON_SCHEDULE'
        elif anticipated_completion_date and original_completion_date and anticipated_completion_date > original_completion_date:
            project_status = 'DELAYED'
        else:
            project_status = 'ON_SCHEDULE'

        rec = {
            'sl_no': sl_no,
            'source_project_code': code,
            'project_name': project_name,
            'implementing_agency': agency,
            'ministry': current_ministry,
            'sector': current_sector,
            'state': state,
            'report_month': report_month,
            'report_date': report_month,
            'sanction_date': sanction_date,
            'original_completion_date': original_completion_date,
            'anticipated_completion_date': anticipated_completion_date,
            'sanctioned_cost_cr': sanctioned_cost_cr,
            'anticipated_cost_cr': anticipated_cost_cr,
            'cumulative_expenditure_cr': cumulative_expenditure_cr,
            'cost_overrun_cr': cost_overrun_cr,
            'cost_overrun_pct': cost_overrun_pct,
            'physical_progress_pct': physical_progress_pct,
            'financial_progress_pct': financial_progress_pct,
            'project_status': project_status,
            'source_status': 'SOURCE_VERIFIED',
            'provenance': {
                'source_report': report_id,
                'source_page': page_num,
                'source_section': section_name,
                'source_field': f"Table 4 / Row {sl_no if sl_no else code}",
                'classification': '[SOURCE]'
            }
        }
        records.append(rec)
        
    return records, current_ministry, current_sector

print("Testing extraction on all 12 files...")
all_extracted_records = []
for cfg in MONTH_INFO:
    path = os.path.join(source_dir, cfg['file'])
    reader = PdfReader(path)
    current_min = "Central Line Ministry"
    current_sec = "Infrastructure"
    is_aug = (cfg['month'] == '2025-08-01')
    month_records = []
    for p in range(cfg['start'], cfg['end'] + 1):
        txt = reader.pages[p - 1].extract_text() or ""
        recs, current_min, current_sec = parse_page_records(
            txt, p, cfg['month'], f"MOSPI-{cfg['file'][:-4].upper()}", cfg['title'], current_min, current_sec, is_aug
        )
        month_records.extend(recs)
        
    print(f"[{cfg['month']}] Extracted: {len(month_records)} / Expected: {cfg['expected']} | Diff: {len(month_records) - cfg['expected']}")
    all_extracted_records.extend(month_records)

print(f"\nTOTAL EXTRACTED ACROSS 12 REPORTS: {len(all_extracted_records)}")

# Validation checks
empty_names = [r for r in all_extracted_records if not r['project_name']]
empty_agency = [r for r in all_extracted_records if not r['implementing_agency']]
empty_code = [r for r in all_extracted_records if not r['source_project_code']]
empty_state = [r for r in all_extracted_records if not r['state']]

print(f"Empty names: {len(empty_names)}")
print(f"Empty agencies: {len(empty_agency)}")
print(f"Empty codes: {len(empty_code)}")
print(f"Empty states: {len(empty_state)}")

print("\n--- Problematic records ---")
for r in all_extracted_records:
    if not r['project_name'] or not r['implementing_agency'] or not r['state']:
        print(f"Report: {r['provenance']['source_report']} p.{r['provenance']['source_page']} Code: {r['source_project_code']} Sl: {r['sl_no']} Name: '{r['project_name']}' Agency: '{r['implementing_agency']}' State: '{r['state']}'")


