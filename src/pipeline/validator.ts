/**
 * PAIMANA Canonical Contract Validator
 * Reference: SIH 2026 Problem Statement SIH26103
 * Canonical Data Contract: paimana_data_contract_aug2025_mar2026.yaml
 *
 * GOVERNANCE PRINCIPLE:
 * Do NOT silently repair contradictory source data.
 * Flag it for review, record in audit logs, and retain original extracted source value.
 */

import type { CanonicalProjectMonthlyRecord, ValidationIssue, ValidationReport } from './types.ts';

export class ContractValidator {
  private issues: ValidationIssue[] = [];

  public clear(): void {
    this.issues = [];
  }

  public getIssues(): ValidationIssue[] {
    return [...this.issues];
  }

  /**
   * Validates a single canonical monthly record against contract rules.
   */
  public validateRecord(
    record: CanonicalProjectMonthlyRecord,
    publicationDateStr?: string
  ): string[] {
    const recordInconsistencies: string[] = [];

    // 1. VAL-SCHEMA-001: Schema Conformance
    if (!record.canonical_project_id) {
      this.addIssue({
        ruleId: 'VAL-SCHEMA-001',
        ruleName: 'Schema Conformance',
        severity: 'CRITICAL',
        canonicalProjectId: record.canonical_project_id || 'UNKNOWN',
        reportMonth: record.report_month,
        field: 'canonical_project_id',
        observedValue: null,
        message: 'Mandatory field canonical_project_id is missing',
      });
      recordInconsistencies.push('MISSING_CANONICAL_ID');
    }

    if (!record.project_name) {
      this.addIssue({
        ruleId: 'VAL-SCHEMA-001',
        ruleName: 'Schema Conformance',
        severity: 'CRITICAL',
        canonicalProjectId: record.canonical_project_id,
        reportMonth: record.report_month,
        field: 'project_name',
        observedValue: null,
        message: 'Mandatory field project_name is missing',
      });
      recordInconsistencies.push('MISSING_PROJECT_NAME');
    }

    // 2. VAL-ID-002: Identity Integrity
    if (record.canonical_project_id && !/^PRJ-[A-Z0-9]+-[0-9A-Z]+$/.test(record.canonical_project_id)) {
      this.addIssue({
        ruleId: 'VAL-ID-002',
        ruleName: 'Identity Integrity',
        severity: 'CRITICAL',
        canonicalProjectId: record.canonical_project_id,
        reportMonth: record.report_month,
        field: 'canonical_project_id',
        observedValue: record.canonical_project_id,
        message: `Canonical project ID does not match required format ^PRJ-[A-Z0-9]+-[0-9A-Z]+$`,
      });
      recordInconsistencies.push('INVALID_ID_FORMAT');
    }

    // 3. VAL-DATE-003: Chronological Sequence
    if (record.sanction_date && record.original_completion_date) {
      if (new Date(record.sanction_date) > new Date(record.original_completion_date)) {
        this.addIssue({
          ruleId: 'VAL-DATE-003',
          ruleName: 'Chronological Sequence',
          severity: 'HIGH',
          canonicalProjectId: record.canonical_project_id,
          reportMonth: record.report_month,
          field: 'original_completion_date',
          observedValue: `${record.sanction_date} > ${record.original_completion_date}`,
          message: `Sanction date (${record.sanction_date}) is after original completion date (${record.original_completion_date})`,
        });
        recordInconsistencies.push('SANCTION_AFTER_ORIGINAL_COMPLETION');
      }
    }

    if (record.sanction_date && record.anticipated_completion_date) {
      if (new Date(record.sanction_date) > new Date(record.anticipated_completion_date)) {
        this.addIssue({
          ruleId: 'VAL-DATE-003',
          ruleName: 'Chronological Sequence',
          severity: 'CRITICAL',
          canonicalProjectId: record.canonical_project_id,
          reportMonth: record.report_month,
          field: 'anticipated_completion_date',
          observedValue: `${record.sanction_date} > ${record.anticipated_completion_date}`,
          message: `Source Contradiction: Sanction date (${record.sanction_date}) is after anticipated completion date (${record.anticipated_completion_date})`,
        });
        recordInconsistencies.push('CONTRADICTION_ANTICIPATED_COMPLETION_PRIOR_TO_SANCTION');
      }
    }

    // 4. VAL-RANGE-004: Numeric Range Validity
    if (record.physical_progress_pct !== null) {
      if (record.physical_progress_pct < 0.0 || record.physical_progress_pct > 100.0) {
        this.addIssue({
          ruleId: 'VAL-RANGE-004',
          ruleName: 'Numeric Range Validity',
          severity: 'CRITICAL',
          canonicalProjectId: record.canonical_project_id,
          reportMonth: record.report_month,
          field: 'physical_progress_pct',
          observedValue: record.physical_progress_pct,
          message: `Physical progress (${record.physical_progress_pct}%) outside valid bounds [0.0, 100.0]`,
        });
        recordInconsistencies.push('PHYSICAL_PROGRESS_OUT_OF_BOUNDS');
      }
    }

    if (record.financial_progress_pct !== null) {
      if (record.financial_progress_pct < 0.0 || record.financial_progress_pct > 100.0) {
        this.addIssue({
          ruleId: 'VAL-RANGE-004',
          ruleName: 'Numeric Range Validity',
          severity: 'HIGH',
          canonicalProjectId: record.canonical_project_id,
          reportMonth: record.report_month,
          field: 'financial_progress_pct',
          observedValue: record.financial_progress_pct,
          message: `Financial progress (${record.financial_progress_pct}%) outside valid bounds [0.0, 100.0]`,
        });
        recordInconsistencies.push('FINANCIAL_PROGRESS_OUT_OF_BOUNDS');
      }
    }

    if (record.sanctioned_cost_cr !== null && record.sanctioned_cost_cr < 0.0) {
      this.addIssue({
        ruleId: 'VAL-RANGE-004',
        ruleName: 'Numeric Range Validity',
        severity: 'CRITICAL',
        canonicalProjectId: record.canonical_project_id,
        reportMonth: record.report_month,
        field: 'sanctioned_cost_cr',
        observedValue: record.sanctioned_cost_cr,
        message: `Sanctioned cost cannot be negative`,
      });
      recordInconsistencies.push('NEGATIVE_SANCTIONED_COST');
    }

    // 5. VAL-LOGIC-005: Logical Financial Consistency
    if (record.sanctioned_cost_cr !== null && record.anticipated_cost_cr !== null) {
      if (record.anticipated_cost_cr < record.sanctioned_cost_cr) {
        this.addIssue({
          ruleId: 'VAL-LOGIC-005',
          ruleName: 'Logical Financial Consistency',
          severity: 'MEDIUM',
          canonicalProjectId: record.canonical_project_id,
          reportMonth: record.report_month,
          field: 'anticipated_cost_cr',
          observedValue: `${record.anticipated_cost_cr} < ${record.sanctioned_cost_cr}`,
          message: `Anticipated cost is lower than sanctioned cost; verify if project scope was de-scoped`,
        });
        recordInconsistencies.push('ANTICIPATED_COST_BELOW_SANCTIONED');
      }
    }

    // 6. VAL-PROV-007: Provenance Traceability
    const isSource = record.source_status === 'SOURCE_VERIFIED';
    const isFixture = record.source_status === 'TEST_FIXTURE';

    if (!record.provenance || !record.provenance.source_report) {
      this.addIssue({
        ruleId: 'VAL-PROV-007',
        ruleName: 'Provenance Traceability',
        severity: 'CRITICAL',
        canonicalProjectId: record.canonical_project_id,
        reportMonth: record.report_month,
        field: 'provenance',
        observedValue: null,
        message: 'Record missing provenance information or source_report reference',
      });
      recordInconsistencies.push('MISSING_PROVENANCE');
    } else if (isSource && record.provenance.classification !== '[SOURCE]') {
      this.addIssue({
        ruleId: 'VAL-PROV-007',
        ruleName: 'Provenance Traceability',
        severity: 'CRITICAL',
        canonicalProjectId: record.canonical_project_id,
        reportMonth: record.report_month,
        field: 'provenance',
        observedValue: record.provenance?.classification,
        message: 'Verified source observation must have valid provenance classification [SOURCE]',
      });
      recordInconsistencies.push('INVALID_SOURCE_PROVENANCE_CLASSIFICATION');
    } else if (isFixture && record.provenance.classification !== '[SIMULATED]') {
      this.addIssue({
        ruleId: 'VAL-PROV-007',
        ruleName: 'Provenance Traceability',
        severity: 'CRITICAL',
        canonicalProjectId: record.canonical_project_id,
        reportMonth: record.report_month,
        field: 'provenance',
        observedValue: record.provenance?.classification,
        message: 'Validation test fixture observation must have provenance classification [SIMULATED], never [SOURCE]',
      });
      recordInconsistencies.push('INVALID_FIXTURE_PROVENANCE_CLASSIFICATION');
    }

    // 7. VAL-LEAK-008: Temporal Leakage Prevention
    if (publicationDateStr && record.report_date) {
      if (new Date(record.report_date) > new Date(publicationDateStr)) {
        this.addIssue({
          ruleId: 'VAL-LEAK-008',
          ruleName: 'Temporal Leakage Prevention',
          severity: 'CRITICAL',
          canonicalProjectId: record.canonical_project_id,
          reportMonth: record.report_month,
          field: 'report_date',
          observedValue: `${record.report_date} > ${publicationDateStr}`,
          message: `Temporal Leakage: Report cutoff date (${record.report_date}) exceeds publication cutoff (${publicationDateStr})`,
        });
        recordInconsistencies.push('TEMPORAL_LEAKAGE_DETECTED');
      }
    }

    return recordInconsistencies;
  }

  /**
   * Validates longitudinal continuity across sequential monthly observations for a single project.
   */
  public validateLongitudinalContinuity(
    recordsForProject: CanonicalProjectMonthlyRecord[]
  ): void {
    // Sort chronologically by report_month
    const sorted = [...recordsForProject].sort(
      (a, b) => new Date(a.report_month).getTime() - new Date(b.report_month).getTime()
    );

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];

      // Check non-decreasing expenditure
      if (
        curr.cumulative_expenditure_cr !== null &&
        prev.cumulative_expenditure_cr !== null &&
        curr.cumulative_expenditure_cr < prev.cumulative_expenditure_cr
      ) {
        this.addIssue({
          ruleId: 'VAL-CONT-006',
          ruleName: 'Longitudinal Continuity',
          severity: 'HIGH',
          canonicalProjectId: curr.canonical_project_id,
          reportMonth: curr.report_month,
          field: 'cumulative_expenditure_cr',
          observedValue: `${curr.cumulative_expenditure_cr} < ${prev.cumulative_expenditure_cr}`,
          message: `Cumulative expenditure dropped from ₹${prev.cumulative_expenditure_cr} Cr in ${prev.report_month} to ₹${curr.cumulative_expenditure_cr} Cr in ${curr.report_month}`,
        });
        curr.data_quality_flags.inconsistency_flags.push('LONGITUDINAL_EXPENDITURE_DROP');
      }

      // Check physical progress non-decreasing
      if (
        curr.physical_progress_pct !== null &&
        prev.physical_progress_pct !== null &&
        curr.physical_progress_pct < prev.physical_progress_pct
      ) {
        this.addIssue({
          ruleId: 'VAL-CONT-006',
          ruleName: 'Longitudinal Continuity',
          severity: 'HIGH',
          canonicalProjectId: curr.canonical_project_id,
          reportMonth: curr.report_month,
          field: 'physical_progress_pct',
          observedValue: `${curr.physical_progress_pct}% < ${prev.physical_progress_pct}%`,
          message: `Physical progress regressed from ${prev.physical_progress_pct}% in ${prev.report_month} to ${curr.physical_progress_pct}% in ${curr.report_month}`,
        });
        curr.data_quality_flags.inconsistency_flags.push('LONGITUDINAL_PROGRESS_REGRESSION');
      }
    }
  }

  public generateReport(contractId: string, totalRecords: number): ValidationReport {
    const critical = this.issues.filter((i) => i.severity === 'CRITICAL').length;
    const high = this.issues.filter((i) => i.severity === 'HIGH').length;
    const medium = this.issues.filter((i) => i.severity === 'MEDIUM').length;
    const flagged = this.issues.length;

    return {
      contractId,
      timestamp: new Date().toISOString(),
      totalRecordsValidated: totalRecords,
      passedCount: totalRecords - flagged,
      flaggedCount: flagged,
      criticalErrorsCount: critical,
      highSeverityCount: high,
      mediumSeverityCount: medium,
      issues: this.issues,
    };
  }

  private addIssue(issue: ValidationIssue): void {
    this.issues.push(issue);
  }
}
