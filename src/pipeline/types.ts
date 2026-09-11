/**
 * PAIMANA Canonical Pipeline Type Definitions
 * Reference: SIH 2026 Problem Statement SIH26103
 * Canonical Data Contract: paimana_data_contract_aug2025_mar2026.yaml
 */

export type ProvenanceClassification = 
  | '[SOURCE]' 
  | '[CALCULATED]' 
  | '[PROTOTYPE MODEL]' 
  | '[SIMULATED]' 
  | '[NOT CONNECTED]';

export type SourceStatus = 
  | 'SOURCE_VERIFIED' 
  | 'TEST_FIXTURE' 
  | 'UNRESOLVED' 
  | 'NOT_CONNECTED';

export type DataQualityTier = 'SUFFICIENT' | 'PARTIAL' | 'INSUFFICIENT';

export type CanonicalProjectStatus = 
  | 'ON_SCHEDULE' 
  | 'DELAYED' 
  | 'STALLED' 
  | 'COMPLETED' 
  | 'CRITICAL_DELAY' 
  | 'UNKNOWN';

export interface RawPaimanaRecord {
  source_page?: number | null;
  source_section: string;
  source_project_code?: string | null;
  source_status?: SourceStatus;
  project_name: string;
  implementing_agency: string;
  ministry: string;
  sector: string;
  state: string;
  sanction_date?: string | null;
  sanctionDate?: string | null;
  original_completion_date?: string | null;
  anticipated_completion_date?: string | null;
  sanctioned_cost?: string | number | null;
  anticipated_cost?: string | number | null;
  cumulative_expenditure?: string | number | null;
  physical_progress?: string | number | null;
  financial_progress?: string | number | null;
  project_status?: string | null;
  primary_impediment_category?: string | null;
  primary_impediment_summary?: string | null;
  provenance: string;
  source_field_ref: string;
}

export interface RawPaimanaReport {
  report_id: string;
  source_filename?: string;
  month_name: string;
  canonical_month: string;
  report_cutoff_date: string;
  publication_date: string;
  source_system: string;
  publication_authority: string;
  expected_records_count?: number;
  total_records_extracted: number;
  records: RawPaimanaRecord[];
}

export interface CanonicalProvenance {
  source_report: string;
  source_page: number | null;
  source_section: string;
  source_field: string;
  classification: ProvenanceClassification;
}

export interface DataQualityMetadata {
  tier: DataQualityTier;
  missing_fields: string[];
  inconsistency_flags: string[];
}

export interface CanonicalProjectMonthlyRecord {
  canonical_project_id: string;
  source_project_code: string | null;
  project_name: string;
  implementing_agency: string;
  ministry: string;
  sector: string;
  state: string;
  report_month: string; // YYYY-MM-01
  report_date: string;  // YYYY-MM-DD
  sanction_date: string | null; // YYYY-MM-DD
  original_completion_date: string | null; // YYYY-MM-DD
  anticipated_completion_date: string | null; // YYYY-MM-DD
  sanctioned_cost_cr: number | null; // ₹ Crore
  anticipated_cost_cr: number | null; // ₹ Crore
  cumulative_expenditure_cr: number | null; // ₹ Crore
  cost_overrun_cr: number | null; // ₹ Crore
  cost_overrun_pct: number | null; // %
  physical_progress_pct: number | null; // 0.0 to 100.0
  financial_progress_pct: number | null; // 0.0 to 100.0
  time_overrun_months: number | null;
  project_status: CanonicalProjectStatus;
  primary_impediment_category: string | null;
  primary_impediment_summary: string | null;
  source_status: SourceStatus;
  provenance: CanonicalProvenance;
  data_quality_flags: DataQualityMetadata;
}

export type IdentityResolutionTier = 
  | 'TIER_1_EXACT_CODE'
  | 'TIER_2_NAME_AGENCY'
  | 'TIER_3_COMPOSITE'
  | 'UNRESOLVED_MANUAL_REVIEW';

export interface IdentityResolutionResult {
  recordIndex: number;
  sourceReport: string;
  sourceProjectCode: string | null;
  sourceProjectName: string;
  sourceAgency: string;
  resolvedCanonicalId: string | null;
  resolutionTier: IdentityResolutionTier;
  confidenceScore: number;
  notes: string;
}

export interface ValidationIssue {
  ruleId: string;
  ruleName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  canonicalProjectId: string;
  reportMonth: string;
  field?: string;
  observedValue: any;
  message: string;
}

export interface ValidationReport {
  contractId: string;
  timestamp: string;
  totalRecordsValidated: number;
  passedCount: number;
  flaggedCount: number;
  criticalErrorsCount: number;
  highSeverityCount: number;
  mediumSeverityCount: number;
  issues: ValidationIssue[];
}

export interface ExtractionStatsByMonth {
  reportId: string;
  monthName: string;
  canonicalMonth: string;
  publishedDate: string;
  sourceFilename: string;
  recordsExtracted: number;
  recordsResolved: number;
  recordsUnresolved: number;
  tier1Matches: number;
  tier2Matches: number;
  tier3Matches: number;
  sufficientQualityCount: number;
  partialQualityCount: number;
  insufficientQualityCount: number;
}

export interface UnresolvedIdentityItem {
  reviewId: string;
  sourceReport: string;
  sourcePage: number | null;
  sourceProjectCode: string | null;
  projectName: string;
  implementingAgency: string;
  sector: string;
  state: string;
  reason: string;
  actionRequired: string;
}
