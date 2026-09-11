# ProjectSentinel — Data Credibility & Source Provenance Architecture
**Reference**: Smart India Hackathon (SIH 2026) — Problem Statement SIH26103  
**Data Contract**: `PAIMANA-CONTRACT-AUG2025-MAR2026-V1`  
**Audit Date**: September 2026

---

## 1. Executive Summary & Provenance Audit Finding

Prior to using any dataset for machine learning (ML) model training, evaluation, or factual claims in the ProjectSentinel user interface, a strict source-provenance audit of the repository was conducted.

### Audit Result:
- **Authentic MoSPI PAIMANA Monthly PDFs in Workspace**: **0**
- **Verified Source-Derived Records Extracted**: **0**
- **Verified Unique Canonical Projects**: **0**
- **Source Ingestion Boundary Status**: **HALTED AT BOUNDARY**
- **Test Fixture Observations**: **113** (105 resolved into canonical records, 8 routed to manual review queue)
- **Test Fixture Unique Projects**: **13 resolved + 1 unresolved**

> [!IMPORTANT]
> **Zero Replacement Data Guarantee**: In accordance with SIH26103 governance guidelines, the ingestion pipeline **does not manufacture synthetic source records** to artificially satisfy sample counts. Because authentic MoSPI PAIMANA monthly PDF reports were not provided in the runtime workspace, the pipeline strictly halts at the source-ingestion boundary. **No claims of "113 source observations" or "14 unique projects" are made as real MoSPI data.**

---

## 2. Source Data vs. Validation Test Fixtures Classification

| Category | Storage Path | Provenance Label | Machine-Readable `source_status` | Permitted Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Authentic Source Data** | `data/raw/source/` | `[SOURCE]` | `SOURCE_VERIFIED` | Production ML training, baseline calibration, official dashboard metrics |
| **Validation Test Fixtures** | `data/raw/fixtures/` | `[SIMULATED]` | `TEST_FIXTURE` | Algorithm verification, schema testing, identity resolution tests, edge-case validation |
| **Ambiguous Entities** | `data/validation/test_fixture_unresolved_review_list.json` | `[SIMULATED]` | `UNRESOLVED` | Testing officer manual review workflows (Tier 4 review queue) |

---

## 3. Directory Structure

```text
data/
├── contracts/
│   └── paimana_data_contract_aug2025_mar2026.yaml  # Canonical specification & validation rules
├── raw/
│   ├── source/                                      # RESERVED STRICTLY for authentic MoSPI PAIMANA PDFs & extractions (Currently 0 PDFs)
│   └── fixtures/                                    # Validation test fixtures (8 monthly JSON reports, Aug 2025 – Mar 2026)
│       ├── fixture_paimana_monthly_report_2025_08.json
│       ├── fixture_paimana_monthly_report_2025_09.json
│       ├── fixture_paimana_monthly_report_2025_10.json
│       ├── fixture_paimana_monthly_report_2025_11.json  # Contains injected contradiction test fixture
│       ├── fixture_paimana_monthly_report_2025_12.json
│       ├── fixture_paimana_monthly_report_2026_01.json
│       ├── fixture_paimana_monthly_report_2026_02.json
│       └── fixture_paimana_monthly_report_2026_03.json
├── processed/
│   ├── canonical_monthly_records_source_verified.json # 0 verified source records (clean empty state)
│   ├── fixtures_monthly_records_aug2025_mar2026.json   # 105 resolved test fixture records
│   └── fixtures_projects_master.json                  # 14 project definitions for fixture validation
├── validation/
│   ├── source_verified_validation_report.json         # Source extraction audit report (documents boundary halt)
│   ├── test_fixture_validation_report.json            # Contract validator findings on test fixtures
│   ├── test_fixture_identity_resolution_report.json   # 4-tier resolution audit on test fixtures
│   ├── test_fixture_extraction_statistics_by_month.json # Month-by-month fixture extraction stats
│   ├── test_fixture_unresolved_review_list.json       # Tier 4 manual review queue items (8 monthly instances)
│   └── data_provenance_audit_report.json              # High-level provenance comparison & status breakdown
└── README_DATA_PROVENANCE.md                          # This provenance disclosure document
```

---

## 4. Machine-Readable `source_status` Taxonomy

Every record processed by ProjectSentinel includes a mandatory machine-readable field: `source_status`.

1. **`SOURCE_VERIFIED`**:
   - The record was extracted directly from an authentic published MoSPI PAIMANA Flash Report PDF.
   - Carries `provenance.classification = '[SOURCE]'`.
   - Retains exact source audit coordinates: `source_report`, `source_page`, `source_section`, `source_project_code`, and `source_field`.
2. **`TEST_FIXTURE`**:
   - The record was synthetically generated to test normalization, identity resolution, or contract validation logic.
   - Carries `provenance.classification = '[SIMULATED]'`.
   - Strictly forbidden from being fed to machine learning algorithms or presented as empirical fact.
3. **`UNRESOLVED`**:
   - The record was ingested but failed automated identity resolution (Tier 1, 2, and 3).
   - Routed to the manual review queue awaiting officer confirmation.
4. **`NOT_CONNECTED`**:
   - External data or placeholder context that has not been matched or linked to any canonical project.

---

## 5. Specific Test Fixture Disclosures

### A. The November 2025 Injected Contradiction
- **Project**: Delhi–Ghaziabad–Meerut RRTS (`MRTS/DEL-MEERUT/RRTS-82K` / `PRJ-NCRTC-82`)
- **Report Month**: November 2025 (`fixture_paimana_monthly_report_2025_11.json`)
- **Injected Inconsistencies**:
  1. Chronological contradiction: Anticipated completion date (`2018-05-31`) is prior to sanction date (`2019-03-07`).
  2. Range contradiction: Physical progress reported as `115.0%` (violates upper bound of `100.0%`).
- **Validation Engine Behavior**: The contract validator successfully intercepted and flagged both contradictions (`VAL-DATE-003` and `VAL-RANGE-004`) without silently coercing the values.
- **Classification**: Treated strictly as a **TEST FIXTURE**. Unless independently located in an authentic MoSPI PDF, it must never be cited as an official government discrepancy.

### B. Tier 4 Ambiguous Entity Fixture
- **Project**: `Floating Solar PV Installation Package-A` by `NTPC REL`
- **Purpose**: Tests that non-unique project titles lacking verified source codes do not falsely map into existing canonical IDs.
- **Result**: Successfully routed all 8 monthly instances into `test_fixture_unresolved_review_list.json`.

---

## 6. Deterministic PDF Extraction Specification

The pipeline includes a deterministic PDF extraction blueprint in [`src/pipeline/pdfExtractor.ts`](file:///c:/Users/rajan/OneDrive/Desktop/Project-Sendel/src/pipeline/pdfExtractor.ts).

When authentic MoSPI PAIMANA PDF reports (August 2025 through March 2026) are placed into `data/raw/source/`, running:
```bash
npm run pipeline:paimana
```
will automatically:
1. Detect each monthly PDF document.
2. Extract project tables deterministically.
3. Map columns directly into canonical schemas with `provenance: '[SOURCE]'` and `source_status: 'SOURCE_VERIFIED'`.
4. Populate `canonical_monthly_records_source_verified.json` and generate an updated `source_verified_validation_report.json`.

Until those authentic PDFs are supplied, the repository remains in a verifiable, honest state: **0 source records claimed, 0 false metrics produced**.
