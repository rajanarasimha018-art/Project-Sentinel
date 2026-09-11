import os
import sys
import re
import json
from pypdf import PdfReader

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

# Directory containing the authentic source PDFs
SOURCE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'raw', 'source'))

# The 12 authentic MoSPI PAIMANA monthly reports (August 2025 through July 2026)
MONTH_CONFIGS = [
    {
        'month': '2025-08-01',
        'file': 'FlashReport_August_2025.pdf',
        'start': 37,
        'end': 66,
        'title': 'Table 4: All Ongoing Projects',
        'expected': 800,
        'cutoff': '2025-08-31',
        'published': '2025-09-15',
        'is_all_ongoing': True
    },
    {
        'month': '2025-09-01',
        'file': 'FlashReport_September_2025.pdf',
        'start': 35,
        'end': 36,
        'title': 'Table 4: Newly Added Projects',
        'expected': 34,
        'cutoff': '2025-09-30',
        'published': '2025-10-15',
        'is_all_ongoing': False
    },
    {
        'month': '2025-10-01',
        'file': 'FlashReport_October_2025.pdf',
        'start': 35,
        'end': 36,
        'title': 'Table 4: Newly Added Projects',
        'expected': 35,
        'cutoff': '2025-10-31',
        'published': '2025-11-15',
        'is_all_ongoing': False
    },
    {
        'month': '2025-11-01',
        'file': 'FlashReport_November_2025.pdf',
        'start': 35,
        'end': 36,
        'title': 'Table 4: Newly Added Projects',
        'expected': 21,
        'cutoff': '2025-11-30',
        'published': '2025-12-15',
        'is_all_ongoing': False
    },
    {
        'month': '2025-12-01',
        'file': 'FlashReport_December_2025.pdf',
        'start': 38,
        'end': 38,
        'title': 'Table 4: Newly Added Projects',
        'expected': 20,
        'cutoff': '2025-12-31',
        'published': '2026-01-15',
        'is_all_ongoing': False
    },
    {
        'month': '2026-01-01',
        'file': 'FlashReport_January_2026.pdf',
        'start': 38,
        'end': 47,
        'title': 'Table 4: Newly Added Projects',
        'expected': 203,
        'cutoff': '2026-01-31',
        'published': '2026-02-15',
        'is_all_ongoing': False
    },
    {
        'month': '2026-02-01',
        'file': 'FlashReport_February_2026.pdf',
        'start': 38,
        'end': 50,
        'title': 'Table 4: Newly Added Projects',
        'expected': 268,
        'cutoff': '2026-02-28',
        'published': '2026-03-15',
        'is_all_ongoing': False
    },
    {
        'month': '2026-03-01',
        'file': 'FlashReport_March_2026.pdf',
        'start': 39,
        'end': 39,
        'title': 'Table 4: Newly Added Projects',
        'expected': 12,
        'cutoff': '2026-03-31',
        'published': '2026-04-15',
        'is_all_ongoing': False
    },
    {
        'month': '2026-04-01',
        'file': 'FlashReport_April2026.pdf',
        'start': 37,
        'end': 39,
        'title': 'Table 4: Newly Added Projects',
        'expected': 55,
        'cutoff': '2026-04-30',
        'published': '2026-05-15',
        'is_all_ongoing': False
    },
    {
        'month': '2026-05-01',
        'file': 'FlashReport_May2026.pdf',
        'start': 37,
        'end': 38,
        'title': 'Table 4: Newly Added Projects',
        'expected': 35,
        'cutoff': '2026-05-31',
        'published': '2026-06-15',
        'is_all_ongoing': False
    },
    {
        'month': '2026-06-01',
        'file': 'FlashReport_June_2026.pdf',
        'start': 44,
        'end': 44,
        'title': 'Table 4: Newly Added Projects',
        'expected': 17,
        'cutoff': '2026-06-30',
        'published': '2026-07-15',
        'is_all_ongoing': False
    },
    {
        'month': '2026-07-01',
        'file': 'FlashReport_July_2026.pdf',
        'start': 39,
        'end': 40,
        'title': 'Table 4: Newly Added Projects',
        'expected': 36,
        'cutoff': '2026-07-31',
        'published': '2026-08-15',
        'is_all_ongoing': False
    }
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

def parse_page_records(page_text, page_num, report_month, report_id, section_name, current_ministry, current_sector, is_all_ongoing=False):
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
        
        # In rem_lines, look backwards to find project name and Sl.No
        name_lines = []
        sl_no = None
        j = len(rem_lines) - 1
        while j >= 0:
            line = rem_lines[j]
            if re.match(r'^\d+$', line) and int(line) < 3000:
                if name_lines and any(c.isalpha() for c in ' '.join(name_lines)):
                    sl_no = int(line)
                    j -= 1
                    break
            name_lines.insert(0, line)
            j -= 1
            
        # Check remaining lines before project name for Ministry/Sector updates
        header_lines = rem_lines[:j + 1]
        for h in header_lines:
            if re.match(r'^(?:Ministry|Department)\s+(?:of|for)\s+', h, re.IGNORECASE):
                current_ministry = h.strip()
            elif h not in [
                'All Ongoing Projects', 'Newly Added Projects', 'AUGUST 2025', 'SEPTEMBER 2025', 
                'OCTOBER 2025', 'NOVEMBER 2025', 'DECEMBER 2025', 'JANUARY 2026', 'FEBRUARY 2026', 
                'MARCH 2026', 'APRIL 2026', 'MAY 2026', 'JUNE 2026', 'JULY 2026', 'Sl.No', 
                'Project Name (Agency) (Project Code)', 'State', 'Date of Approval', '(Start Date)', 
                'MM/YYYY', 'Orignal/Target DoC', '(Revised DoC)', 'Orignal Cost', 'Revised Cost', 
                '(Revised Cost)', 'in Rs. Crore', 'Cumulative', 'Expenditure', 'Physical Progress', 
                '(%)', '****'
            ] and not re.match(r'^Total\s*\(\d+\)', h, re.IGNORECASE) and not re.match(r'^\d+(\.\d+)?$', h) and len(h) < 50 and not h.startswith('Page'):
                current_sector = h.strip()
                
        project_name = ' '.join(name_lines).strip()

        # Parse AFTER text:
        a_lines = [l.strip() for l in after_text.split('\n') if l.strip()]
        filtered_a = []
        for l in a_lines:
            if 'Project Assessment' in l or 'PAIMANA' in l or l.startswith('Page ') or 'ipm.mospi.gov.in' in l or 'paimana-proj' in l:
                break
            filtered_a.append(l)
            
        state = ""
        sanction_date_raw = None
        start_date_raw = None
        orig_doc_raw = None
        rev_doc_raw = None
        orig_cost_raw = None
        rev_cost_raw = None
        cum_exp_raw = None
        phys_prog_raw = None
        
        # Extract State and Approval Date
        idx_a = 0
        state_parts = []
        while idx_a < len(filtered_a):
            l = filtered_a[idx_a]
            m_date = re.search(r'\s+(\d{1,2}/\d{4})$', l)
            if m_date:
                state_parts.append(l[:m_date.start()].strip())
                sanction_date_raw = m_date.group(1)
                idx_a += 1
                break
            if re.match(r'^\d{1,2}/\d{2,4}$', l) or l == 'NA' or l.startswith('(') or l == '-':
                break
            state_parts.append(l)
            idx_a += 1
            if not l.startswith('Multi-States') and not l.startswith('(') and not l.endswith(','):
                break
                
        state = ' '.join(state_parts).strip()
        
        tokens = []
        for l in filtered_a[idx_a:]:
            if re.match(r'^Total\s*\(\d+\)', l, re.IGNORECASE):
                break
            tokens.append(l)
            
        token_str = ' '.join(tokens)
        token_str = re.sub(r'\(\s+', '(', token_str)
        token_str = re.sub(r'\s+\)', ')', token_str)
        
        items = re.findall(r'\([^\)]+\)|[^\s\(\)]+', token_str)
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
                
        if sanction_date_raw:
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
        if is_all_ongoing:
            if len(nums_list) > 2: cum_exp_raw = nums_list[2]
            if len(nums_list) > 3: phys_prog_raw = nums_list[3]
            
        sanction_date = parse_date(sanction_date_raw)
        original_completion_date = parse_date(orig_doc_raw)
        anticipated_completion_date = parse_date(rev_doc_raw)
        
        sanctioned_cost_cr = parse_num(orig_cost_raw)
        anticipated_cost_cr = parse_num(rev_cost_raw) if parse_num(rev_cost_raw) is not None else sanctioned_cost_cr
        cumulative_expenditure_cr = parse_num(cum_exp_raw)
        physical_progress_pct = parse_num(phys_prog_raw)
        
        rec = {
            'sl_no': sl_no,
            'source_project_code': code,
            'project_name': project_name,
            'implementing_agency': agency,
            'ministry': current_ministry,
            'sector': current_sector,
            'state': state if state else None,
            'report_month': report_month,
            'report_date': report_month,
            'sanction_date': sanction_date,
            'original_completion_date': original_completion_date,
            'anticipated_completion_date': anticipated_completion_date,
            'sanctioned_cost_cr': sanctioned_cost_cr,
            'anticipated_cost_cr': anticipated_cost_cr,
            'cumulative_expenditure_cr': cumulative_expenditure_cr,
            'physical_progress_pct': physical_progress_pct,
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

def extract_all_reports(source_dir=SOURCE_DIR):
    reports = []
    
    for cfg in MONTH_CONFIGS:
        pdf_path = os.path.join(source_dir, cfg['file'])
        if not os.path.exists(pdf_path):
            continue
            
        reader = PdfReader(pdf_path)
        current_min = "Central Line Ministry"
        current_sec = "Infrastructure"
        
        report_records = []
        for p in range(cfg['start'], cfg['end'] + 1):
            txt = reader.pages[p - 1].extract_text() or ""
            recs, current_min, current_sec = parse_page_records(
                txt, p, cfg['month'], f"MOSPI-{cfg['file'][:-4].upper()}", cfg['title'], current_min, current_sec, cfg['is_all_ongoing']
            )
            report_records.extend(recs)
            
        report_obj = {
            'report_id': f"MOSPI-SOURCE-{cfg['file'][:-4].upper()}",
            'source_filename': cfg['file'],
            'month_name': cfg['month'],
            'canonical_month': cfg['month'],
            'report_cutoff_date': cfg['cutoff'],
            'publication_date': cfg['published'],
            'source_system': 'MoSPI IPMD Central Sector Projects Flash Report PDF',
            'publication_authority': 'Ministry of Statistics and Programme Implementation (MoSPI)',
            'table_name': cfg['title'],
            'expected_records_count': cfg['expected'],
            'total_records_extracted': len(report_records),
            'records': report_records
        }
        reports.append(report_obj)
        
    return reports

if __name__ == '__main__':
    cache_path = os.path.join(SOURCE_DIR, 'extracted_table4_reports.json')
    if len(sys.argv) > 1 and sys.argv[1] == '--json':
        reports = extract_all_reports()
        print(json.dumps(reports, indent=2))
    elif len(sys.argv) > 1 and sys.argv[1] == '--save':
        reports = extract_all_reports()
        with open(cache_path, 'w', encoding='utf-8') as f:
            json.dump(reports, f, indent=2)
        total_recs = sum(r['total_records_extracted'] for r in reports)
        print(f"Extracted and saved {total_recs} records to {cache_path}")
    else:
        reports = extract_all_reports()
        total_recs = sum(r['total_records_extracted'] for r in reports)
        print(f"Detected and parsed {len(reports)} authentic PAIMANA PDFs.")
        for r in reports:
            print(f"  {r['canonical_month']}: {r['total_records_extracted']} / {r['expected_records_count']} rows (from {r['source_filename']})")
        print(f"Total authentic records extracted: {total_recs}")
        # Always write cache file for fast deterministic access
        with open(cache_path, 'w', encoding='utf-8') as f:
            json.dump(reports, f, indent=2)

