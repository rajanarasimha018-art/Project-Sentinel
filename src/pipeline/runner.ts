/**
 * PAIMANA Canonical Pipeline Runner & Source Provenance Auditor
 * Reference: SIH 2026 Problem Statement SIH26103
 * Canonical Data Contract: paimana_data_contract_aug2025_mar2026.yaml
 *
 * PROVENANCE & INTEGRITY AUDIT REQUIREMENT:
 * 1. Checks data/raw/source/ for authentic MoSPI PAIMANA monthly PDF reports.
 *    If no PDFs exist, halts at the source-ingestion boundary and reports 0
 *    verified source records. Never synthesizes replacement data as [SOURCE].
 * 2. Processes data/raw/fixtures/ separately as TEST FIXTURES ([SIMULATED]),
 *    verifying normalization, identity resolution, and contract validation engines.
 * 3. Enforces strict machine-readable source-status classification:
 *    - SOURCE_VERIFIED
 *    - TEST_FIXTURE
 *    - UNRESOLVED
 *    - NOT_CONNECTED
 */

import fs from 'fs';
import path from 'path';
import type { 
  RawPaimanaReport, 
  CanonicalProjectMonthlyRecord, 
  CanonicalProvenance,
  IdentityResolutionResult,
  UnresolvedIdentityItem,
  ExtractionStatsByMonth,
  CanonicalProjectStatus,
  DataQualityTier,
  SourceStatus
} from './types.ts';
import { 
  normalizeDate, 
  normalizeReportMonth, 
  normalizeCurrency, 
  normalizePercentage,
  calculateTimeOverrunMonths 
} from './normalizer.ts';
import { 
  resolveProjectIdentity, 
  CANONICAL_PROJECT_REGISTRY 
} from './identityResolver.ts';
import { ContractValidator } from './validator.ts';
import { PaimanaPdfExtractor } from './pdfExtractor.ts';

const CONTRACT_ID = 'PAIMANA-CONTRACT-AUG2025-MAR2026-V1';
const RAW_SOURCE_DIR = path.resolve('data/raw/source');
const RAW_FIXTURES_DIR = path.resolve('data/raw/fixtures');
const PROCESSED_DIR = path.resolve('data/processed');
const VALIDATION_DIR = path.resolve('data/validation');

// Ensure output directories exist
[RAW_SOURCE_DIR, RAW_FIXTURES_DIR, PROCESSED_DIR, VALIDATION_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const TARGET_MONTHS = [
  '2025-08-01',
  '2025-09-01',
  '2025-10-01',
  '2025-11-01',
  '2025-12-01',
  '2026-01-01',
  '2026-02-01',
  '2026-03-01',
  '2026-04-01',
  '2026-05-01',
  '2026-06-01',
  '2026-07-01'
];

export async function runPaimanaPipeline() {
  console.log('================================================================');
  console.log('PROJECTSENTINEL — PAIMANA DATA CREDIBILITY AUDIT & PIPELINE');
  console.log(`Contract: ${CONTRACT_ID}`);
  console.log('Target Reporting Cycle: August 2025 through July 2026 (12 Months)');
  console.log('================================================================\n');

  // ==========================================================================
  // PART 1: SOURCE EXTRACTION AUDIT (data/raw/source/)
  // ==========================================================================
  console.log('--- PART 1: SOURCE EXTRACTION AUDIT (data/raw/source/) ---');
  const pdfExtractor = new PaimanaPdfExtractor(RAW_SOURCE_DIR);
  const pdfScanResult = pdfExtractor.discoverAndExtract();

  const sourceRecordsPerMonth: Record<string, number> = {};
  TARGET_MONTHS.forEach((m) => {
    sourceRecordsPerMonth[m] = 0;
  });

  const verifiedSourceRecords: CanonicalProjectMonthlyRecord[] = [];
  const sourceIdResults: IdentityResolutionResult[] = [];
  const sourceUnresolvedList: UnresolvedIdentityItem[] = [];
  const sourceMonthlyStats: ExtractionStatsByMonth[] = [];
  const sourceValidator = new ContractValidator();
  const sourceProjectsMap = new Map<string, any>();
  const sourcePagesAudit: Array<{ reportMonth: string; page: number; projectCode: string }> = [];

  let globalSourceIndex = 0;

  if (pdfScanResult.pdfFoundCount === 0) {
    console.log(`[SOURCE BOUNDARY REACHED]: ${pdfScanResult.statusMessage}`);
    console.log('Result: 0 PAIMANA PDF reports found in workspace.');
    console.log('Action: Halting at source-ingestion boundary.');
    console.log('Integrity Guarantee: 0 source observations manufactured. Dataset NOT claimed as model-ready.\n');
  } else {
    console.log(`Discovered ${pdfScanResult.pdfFoundCount} PDF source files. Processing Table 4 extractions...`);

    for (const report of pdfScanResult.extractedReports) {
      console.log(`Processing Authentic Source Report [${report.report_id}] ${report.canonical_month} (${report.records.length} records)...`);
      sourceRecordsPerMonth[report.canonical_month] = report.records.length;

      // Validate monthly count against expected count from the PDF table structure
      if (report.expected_records_count && report.records.length !== report.expected_records_count) {
        console.warn(`[COUNT MISMATCH] Month ${report.canonical_month}: Extracted ${report.records.length} rows, expected ${report.expected_records_count}`);
      }

      let tier1Count = 0;
      let tier2Count = 0;
      let tier3Count = 0;
      let unresolvedCount = 0;
      let sufficientCount = 0;
      let partialCount = 0;
      let insufficientCount = 0;

      for (let i = 0; i < report.records.length; i++) {
        globalSourceIndex++;
        const rawRec = report.records[i];

        // 1. Identity Resolution (Never use PDF serial number alone)
        const { result: idRes, canonicalDef } = resolveProjectIdentity(
          rawRec,
          report.report_id,
          globalSourceIndex
        );
        sourceIdResults.push(idRes);

        if (idRes.resolutionTier === 'TIER_1_EXACT_CODE') tier1Count++;
        else if (idRes.resolutionTier === 'TIER_2_NAME_AGENCY') tier2Count++;
        else if (idRes.resolutionTier === 'TIER_3_COMPOSITE') tier3Count++;
        else {
          unresolvedCount++;
          sourceUnresolvedList.push({
            reviewId: `REV-SRC-${report.canonical_month.replace(/-/g, '')}-${i + 1}`,
            sourceReport: report.source_filename || report.report_id,
            sourcePage: rawRec.source_page ?? null,
            sourceProjectCode: rawRec.source_project_code ?? null,
            projectName: rawRec.project_name,
            implementingAgency: rawRec.implementing_agency,
            sector: rawRec.sector,
            state: rawRec.state,
            reason: idRes.notes,
            actionRequired: 'Manual identity review required: project code missing or ambiguous entity attributes.',
          });
          continue; // Route ambiguous / unresolved entities away from verified canonical dataset
        }

        const canonicalId = idRes.resolvedCanonicalId!;
        const sanctionDate = normalizeDate(rawRec.sanction_date);
        const originalCompletion = normalizeDate(rawRec.original_completion_date);
        const anticipatedCompletion = normalizeDate(rawRec.anticipated_completion_date);
        const sanctionedCost = normalizeCurrency(rawRec.sanctioned_cost);
        const anticipatedCost = normalizeCurrency(rawRec.anticipated_cost) ?? sanctionedCost;
        const cumulativeExpenditure = normalizeCurrency(rawRec.cumulative_expenditure);
        const physicalProgress = normalizePercentage(rawRec.physical_progress);

        let costOverrunCr: number | null = null;
        let costOverrunPct: number | null = null;
        if (anticipatedCost !== null && sanctionedCost !== null) {
          const diff = anticipatedCost - sanctionedCost;
          costOverrunCr = Math.round(diff * 100) / 100;
          if (sanctionedCost > 0) {
            costOverrunPct = Math.round((diff / sanctionedCost) * 10000) / 100;
          }
        }

        let financialProgressPct: number | null = null;
        if (cumulativeExpenditure !== null && sanctionedCost !== null && sanctionedCost > 0) {
          financialProgressPct = Math.min(100.0, Math.round((cumulativeExpenditure / sanctionedCost) * 10000) / 100);
        }

        const timeOverrunMonths = calculateTimeOverrunMonths(originalCompletion, anticipatedCompletion);

        let projectStatus: CanonicalProjectStatus = 'UNKNOWN';
        if (physicalProgress !== null) {
          if (physicalProgress >= 100.0) projectStatus = 'COMPLETED';
          else if (anticipatedCompletion && originalCompletion && new Date(anticipatedCompletion) > new Date(originalCompletion)) projectStatus = 'DELAYED';
          else if (physicalProgress === 0.0 && cumulativeExpenditure === 0.0) projectStatus = 'STALLED';
          else projectStatus = 'ON_SCHEDULE';
        } else if (anticipatedCompletion && originalCompletion && new Date(anticipatedCompletion) > new Date(originalCompletion)) {
          projectStatus = 'DELAYED';
        } else {
          projectStatus = 'ON_SCHEDULE';
        }

        const missingFields: string[] = [];
        if (!rawRec.state) missingFields.push('state');
        if (sanctionDate === null) missingFields.push('sanction_date');
        if (originalCompletion === null) missingFields.push('original_completion_date');
        if (anticipatedCompletion === null) missingFields.push('anticipated_completion_date');
        if (physicalProgress === null) missingFields.push('physical_progress_pct');
        if (cumulativeExpenditure === null) missingFields.push('cumulative_expenditure_cr');

        let qualityTier: DataQualityTier = 'SUFFICIENT';
        if (missingFields.length > 3) {
          qualityTier = 'INSUFFICIENT';
          insufficientCount++;
        } else if (missingFields.length > 0) {
          qualityTier = 'PARTIAL';
          partialCount++;
        } else {
          sufficientCount++;
        }

        const canonicalRec: CanonicalProjectMonthlyRecord = {
          canonical_project_id: canonicalId,
          source_project_code: rawRec.source_project_code || null,
          project_name: rawRec.project_name,
          implementing_agency: rawRec.implementing_agency,
          ministry: rawRec.ministry,
          sector: rawRec.sector,
          state: rawRec.state || '',
          report_month: report.canonical_month,
          report_date: report.report_cutoff_date,
          sanction_date: sanctionDate,
          original_completion_date: originalCompletion,
          anticipated_completion_date: anticipatedCompletion,
          sanctioned_cost_cr: sanctionedCost,
          anticipated_cost_cr: anticipatedCost,
          cumulative_expenditure_cr: cumulativeExpenditure,
          cost_overrun_cr: costOverrunCr,
          cost_overrun_pct: costOverrunPct,
          physical_progress_pct: physicalProgress,
          financial_progress_pct: financialProgressPct,
          time_overrun_months: timeOverrunMonths,
          project_status: projectStatus,
          primary_impediment_category: null,
          primary_impediment_summary: null,
          source_status: 'SOURCE_VERIFIED',
          provenance: {
            source_report: report.source_filename || report.report_id,
            source_page: rawRec.source_page ?? null,
            source_section: rawRec.source_section,
            source_field: rawRec.source_field_ref,
            classification: '[SOURCE]',
          },
          data_quality_flags: {
            tier: qualityTier,
            missing_fields: missingFields,
            inconsistency_flags: [],
          },
        };

        const issues = sourceValidator.validateRecord(canonicalRec, report.publication_date);
        canonicalRec.data_quality_flags.inconsistency_flags = issues;

        verifiedSourceRecords.push(canonicalRec);

        if (rawRec.source_page && rawRec.source_project_code) {
          sourcePagesAudit.push({
            reportMonth: report.canonical_month,
            page: rawRec.source_page,
            projectCode: rawRec.source_project_code,
          });
        }

        if (!sourceProjectsMap.has(canonicalId)) {
          sourceProjectsMap.set(canonicalId, {
            canonical_project_id: canonicalId,
            source_project_code: rawRec.source_project_code,
            project_name: rawRec.project_name,
            implementing_agency: rawRec.implementing_agency,
            ministry: rawRec.ministry,
            sector: rawRec.sector,
            state: rawRec.state || '',
            observations_count: 0,
            first_observation_month: report.canonical_month,
            latest_observation_month: report.canonical_month,
            latest_physical_progress: physicalProgress,
            latest_sanctioned_cost_cr: sanctionedCost,
            latest_anticipated_cost_cr: anticipatedCost,
            source_status: 'SOURCE_VERIFIED',
          });
        }
        const projSummary = sourceProjectsMap.get(canonicalId);
        projSummary.observations_count++;
        projSummary.latest_observation_month = report.canonical_month;
        if (physicalProgress !== null) projSummary.latest_physical_progress = physicalProgress;
        if (sanctionedCost !== null) projSummary.latest_sanctioned_cost_cr = sanctionedCost;
        if (anticipatedCost !== null) projSummary.latest_anticipated_cost_cr = anticipatedCost;
      }

      sourceMonthlyStats.push({
        reportId: report.report_id,
        monthName: report.canonical_month,
        canonicalMonth: report.canonical_month,
        publishedDate: report.publication_date,
        sourceFilename: report.source_filename || report.report_id,
        recordsExtracted: report.records.length,
        recordsResolved: report.records.length - unresolvedCount,
        recordsUnresolved: unresolvedCount,
        tier1Matches: tier1Count,
        tier2Matches: tier2Count,
        tier3Matches: tier3Count,
        sufficientQualityCount: sufficientCount,
        partialQualityCount: partialCount,
        insufficientQualityCount: insufficientCount,
      });
    }

    // Longitudinal validation for multi-month projects
    const sourceByProject = new Map<string, CanonicalProjectMonthlyRecord[]>();
    for (const rec of verifiedSourceRecords) {
      if (!sourceByProject.has(rec.canonical_project_id)) {
        sourceByProject.set(rec.canonical_project_id, []);
      }
      sourceByProject.get(rec.canonical_project_id)!.push(rec);
    }
    for (const [_, obsList] of sourceByProject.entries()) {
      if (obsList.length > 1) {
        sourceValidator.validateLongitudinalContinuity(obsList);
      }
    }
  }

  // Generate verified source report
  const uniqueCanonicalSourceIds = Array.from(sourceProjectsMap.keys());
  const sourceValidationReport = sourceValidator.generateReport(CONTRACT_ID, verifiedSourceRecords.length);
  const sourceVerifiedReport = {
    contractId: CONTRACT_ID,
    timestamp: new Date().toISOString(),
    auditStatus: pdfScanResult.pdfFoundCount === 0 ? 'HALTED_AT_SOURCE_BOUNDARY' : 'SOURCE_VERIFIED',
    provenanceClassification: '[SOURCE]',
    sourceStatus: 'SOURCE_VERIFIED',
    limitationNote: pdfScanResult.pdfFoundCount === 0 
      ? 'No actual MoSPI PAIMANA monthly PDF documents were located in data/raw/source/. Pipeline strictly stopped at source boundary.'
      : 'Authentic source extraction completed from 12 official MoSPI PAIMANA Flash Report PDFs.',
    actualSourceRecordsExtractedPerMonth: sourceRecordsPerMonth,
    totalSourceRecordsExtracted: verifiedSourceRecords.length,
    actualPaimanaProjectCodesFound: Array.from(new Set(verifiedSourceRecords.map((r) => r.source_project_code).filter(Boolean))) as string[],
    uniqueCanonicalProjectIds: Array.from(sourceProjectsMap.keys()),
    multiMonthProjectContinuity: {
      continuousProjectsCount: Array.from(sourceProjectsMap.values()).filter((p: any) => p.observations_count > 1).length,
      projects: Array.from(sourceProjectsMap.values()).filter((p: any) => p.observations_count > 1),
    },
    unresolvedIdentities: sourceUnresolvedList,
    sourcePagesAvailableForAudit: sourcePagesAudit,
    validationSummary: {
      totalRecordsValidated: sourceValidationReport.totalRecordsValidated,
      passedCount: sourceValidationReport.passedCount,
      flaggedCount: sourceValidationReport.flaggedCount,
      criticalErrorsCount: sourceValidationReport.criticalErrorsCount,
      highSeverityCount: sourceValidationReport.highSeverityCount,
      mediumSeverityCount: sourceValidationReport.mediumSeverityCount,
    },
    validationIssues: sourceValidationReport.issues,
  };

  const sourceVerifiedRecordsPath = path.join(PROCESSED_DIR, 'canonical_monthly_records_source_verified.json');
  fs.writeFileSync(sourceVerifiedRecordsPath, JSON.stringify(verifiedSourceRecords, null, 2), 'utf-8');
  console.log(`✓ Generated: ${sourceVerifiedRecordsPath} (${verifiedSourceRecords.length} verified canonical records)`);

  const sourceProjectsMasterPath = path.join(PROCESSED_DIR, 'canonical_projects_master.json');
  fs.writeFileSync(sourceProjectsMasterPath, JSON.stringify(Array.from(sourceProjectsMap.values()), null, 2), 'utf-8');
  console.log(`✓ Generated: ${sourceProjectsMasterPath} (${sourceProjectsMap.size} unique canonical projects)`);

  const sourceVerifiedReportPath = path.join(VALIDATION_DIR, 'source_verified_validation_report.json');
  fs.writeFileSync(sourceVerifiedReportPath, JSON.stringify(sourceVerifiedReport, null, 2), 'utf-8');
  console.log(`✓ Generated: ${sourceVerifiedReportPath} (${sourceValidationReport.issues.length} validation findings)`);

  const sourceStatsPath = path.join(VALIDATION_DIR, 'source_extraction_statistics_by_month.json');
  fs.writeFileSync(sourceStatsPath, JSON.stringify(sourceMonthlyStats, null, 2), 'utf-8');
  console.log(`✓ Generated: ${sourceStatsPath}`);

  const sourceIdentityReportPath = path.join(VALIDATION_DIR, 'source_identity_resolution_report.json');
  const sourceIdentityPayload = {
    contractId: CONTRACT_ID,
    timestamp: new Date().toISOString(),
    totalExtractedRecords: sourceIdResults.length,
    resolvedCount: sourceIdResults.filter((r) => r.resolvedCanonicalId !== null).length,
    unresolvedCount: sourceUnresolvedList.length,
    resolutionBreakdown: {
      tier_1_exact_code: sourceIdResults.filter((r) => r.resolutionTier === 'TIER_1_EXACT_CODE').length,
      tier_2_name_agency: sourceIdResults.filter((r) => r.resolutionTier === 'TIER_2_NAME_AGENCY').length,
      tier_3_composite: sourceIdResults.filter((r) => r.resolutionTier === 'TIER_3_COMPOSITE').length,
      tier_4_manual_review: sourceUnresolvedList.length,
    },
    resolutions: sourceIdResults,
  };
  fs.writeFileSync(sourceIdentityReportPath, JSON.stringify(sourceIdentityPayload, null, 2), 'utf-8');
  console.log(`✓ Generated: ${sourceIdentityReportPath}`);

  const sourceUnresolvedPath = path.join(VALIDATION_DIR, 'source_unresolved_identity_review_list.json');
  fs.writeFileSync(sourceUnresolvedPath, JSON.stringify(sourceUnresolvedList, null, 2), 'utf-8');
  console.log(`✓ Generated: ${sourceUnresolvedPath} (${sourceUnresolvedList.length} items routed to review queue)`);

  // ==========================================================================
  // PART 2: VALIDATION TEST FIXTURES PROCESSING (data/raw/fixtures/)
  // ==========================================================================
  console.log('\n--- PART 2: VALIDATION TEST FIXTURE PROCESSING (data/raw/fixtures/) ---');
  const fixtureFiles = fs.readdirSync(RAW_FIXTURES_DIR)
    .filter((f) => f.startsWith('fixture_paimana_monthly_report_') && f.endsWith('.json'))
    .sort();

  if (fixtureFiles.length === 0) {
    console.log('No test fixture reports found in data/raw/fixtures/.');
  } else {
    console.log(`Discovered ${fixtureFiles.length} validation test fixture reports:`);
    fixtureFiles.forEach((f) => console.log(`  - ${f}`));
    console.log('');
  }

  const fixtureValidator = new ContractValidator();
  const allFixtureRecords: CanonicalProjectMonthlyRecord[] = [];
  const fixtureIdResults: IdentityResolutionResult[] = [];
  const fixtureUnresolvedList: UnresolvedIdentityItem[] = [];
  const fixtureMonthlyStats: ExtractionStatsByMonth[] = [];

  let globalFixtureIndex = 0;

  for (const filename of fixtureFiles) {
    const rawFilePath = path.join(RAW_FIXTURES_DIR, filename);
    const rawContent = fs.readFileSync(rawFilePath, 'utf-8');
    const report: RawPaimanaReport = JSON.parse(rawContent);

    console.log(`Processing Fixture [${report.report_id}] ${report.month_name}...`);

    const canonicalMonth = normalizeReportMonth(report.canonical_month);
    const reportCutoffDate = normalizeDate(report.report_cutoff_date) || report.report_cutoff_date;
    const publicationDate = normalizeDate(report.publication_date) || report.publication_date;

    let tier1Count = 0;
    let tier2Count = 0;
    let tier3Count = 0;
    let unresolvedCount = 0;
    let sufficientCount = 0;
    let partialCount = 0;
    let insufficientCount = 0;

    for (let i = 0; i < report.records.length; i++) {
      globalFixtureIndex++;
      const rawRec = report.records[i];

      // 1. Identity Resolution
      const { result: idRes, canonicalDef } = resolveProjectIdentity(
        rawRec,
        filename,
        globalFixtureIndex
      );
      fixtureIdResults.push(idRes);

      if (idRes.resolutionTier === 'TIER_1_EXACT_CODE') tier1Count++;
      else if (idRes.resolutionTier === 'TIER_2_NAME_AGENCY') tier2Count++;
      else if (idRes.resolutionTier === 'TIER_3_COMPOSITE') tier3Count++;
      else {
        unresolvedCount++;
        fixtureUnresolvedList.push({
          reviewId: `REV-${report.report_id}-${i + 1}`,
          sourceReport: filename,
          sourcePage: rawRec.source_page ?? null,
          sourceProjectCode: rawRec.source_project_code ?? null,
          projectName: rawRec.project_name,
          implementingAgency: rawRec.implementing_agency,
          sector: rawRec.sector,
          state: rawRec.state,
          reason: 'Ambiguous entity: non-unique name and agency without verified project code',
          actionRequired: 'Manual officer confirmation required before canonical registry promotion',
        });
      }

      if (!idRes.resolvedCanonicalId || !canonicalDef) {
        insufficientCount++;
        continue;
      }

      // 2. Normalization & Missing Value Enforcement
      const sanctionDate = normalizeDate(rawRec.sanction_date || rawRec.sanctionDate);
      const origCompDate = normalizeDate(rawRec.original_completion_date);
      const antCompDate = normalizeDate(rawRec.anticipated_completion_date);

      const sanctionedCostCr = normalizeCurrency(rawRec.sanctioned_cost);
      const anticipatedCostCr = normalizeCurrency(rawRec.anticipated_cost);
      const cumulativeExpCr = normalizeCurrency(rawRec.cumulative_expenditure);

      const physicalProgressPct = normalizePercentage(rawRec.physical_progress);
      const financialProgressPct = normalizePercentage(rawRec.financial_progress);

      const timeOverrunMonths = calculateTimeOverrunMonths(origCompDate, antCompDate);
      
      let costOverrunCr: number | null = null;
      let costOverrunPct: number | null = null;
      if (anticipatedCostCr !== null && sanctionedCostCr !== null) {
        costOverrunCr = Math.round((anticipatedCostCr - sanctionedCostCr) * 100) / 100;
        if (sanctionedCostCr > 0) {
          costOverrunPct = Math.round((costOverrunCr / sanctionedCostCr * 100) * 100) / 100;
        }
      }

      // Determine Missing Fields
      const missingFields: string[] = [];
      if (sanctionDate === null) missingFields.push('sanction_date');
      if (origCompDate === null) missingFields.push('original_completion_date');
      if (antCompDate === null) missingFields.push('anticipated_completion_date');
      if (sanctionedCostCr === null) missingFields.push('sanctioned_cost_cr');
      if (anticipatedCostCr === null) missingFields.push('anticipated_cost_cr');
      if (cumulativeExpCr === null) missingFields.push('cumulative_expenditure_cr');
      if (physicalProgressPct === null) missingFields.push('physical_progress_pct');
      if (financialProgressPct === null) missingFields.push('financial_progress_pct');

      let qualityTier: DataQualityTier = 'SUFFICIENT';
      if (missingFields.length > 3) qualityTier = 'INSUFFICIENT';
      else if (missingFields.length > 0) qualityTier = 'PARTIAL';

      if (qualityTier === 'SUFFICIENT') sufficientCount++;
      else if (qualityTier === 'PARTIAL') partialCount++;
      else insufficientCount++;

      // 3. Provenance Construction - Strictly marked [SIMULATED] and TEST_FIXTURE
      const provenance: CanonicalProvenance = {
        source_report: filename,
        source_page: rawRec.source_page ?? null,
        source_section: rawRec.source_section,
        source_field: rawRec.source_field_ref || 'TEST_FIXTURE_FIELD',
        classification: '[SIMULATED]',
      };

      const sourceStatus: SourceStatus = 'TEST_FIXTURE';

      // 4. Construct Canonical Record
      const canonicalRecord: CanonicalProjectMonthlyRecord = {
        canonical_project_id: idRes.resolvedCanonicalId,
        source_project_code: rawRec.source_project_code || null,
        project_name: canonicalDef.canonicalName,
        implementing_agency: canonicalDef.agency,
        ministry: rawRec.ministry,
        sector: canonicalDef.sector,
        state: canonicalDef.state,
        report_month: canonicalMonth,
        report_date: reportCutoffDate,
        sanction_date: sanctionDate,
        original_completion_date: origCompDate,
        anticipated_completion_date: antCompDate,
        sanctioned_cost_cr: sanctionedCostCr,
        anticipated_cost_cr: anticipatedCostCr,
        cumulative_expenditure_cr: cumulativeExpCr,
        cost_overrun_cr: costOverrunCr,
        cost_overrun_pct: costOverrunPct,
        physical_progress_pct: physicalProgressPct,
        financial_progress_pct: financialProgressPct,
        time_overrun_months: timeOverrunMonths,
        project_status: (rawRec.project_status as CanonicalProjectStatus) || 'DELAYED',
        primary_impediment_category: rawRec.primary_impediment_category || null,
        primary_impediment_summary: rawRec.primary_impediment_summary || null,
        source_status: sourceStatus,
        provenance,
        data_quality_flags: {
          tier: qualityTier,
          missing_fields: missingFields,
          inconsistency_flags: [],
        },
      };

      // 5. Contract Validation
      const inconsistencies = fixtureValidator.validateRecord(canonicalRecord, publicationDate);
      canonicalRecord.data_quality_flags.inconsistency_flags.push(...inconsistencies);

      allFixtureRecords.push(canonicalRecord);
    }

    fixtureMonthlyStats.push({
      reportId: report.report_id,
      monthName: report.month_name,
      canonicalMonth: report.canonical_month,
      publishedDate: report.publication_date,
      sourceFilename: filename,
      recordsExtracted: report.records.length,
      recordsResolved: report.records.length - unresolvedCount,
      recordsUnresolved: unresolvedCount,
      tier1Matches: tier1Count,
      tier2Matches: tier2Count,
      tier3Matches: tier3Count,
      sufficientQualityCount: sufficientCount,
      partialQualityCount: partialCount,
      insufficientQualityCount: insufficientCount,
    });
  }

  // Longitudinal validation across fixture records
  const fixtureByProject = new Map<string, CanonicalProjectMonthlyRecord[]>();
  for (const rec of allFixtureRecords) {
    if (!fixtureByProject.has(rec.canonical_project_id)) {
      fixtureByProject.set(rec.canonical_project_id, []);
    }
    fixtureByProject.get(rec.canonical_project_id)!.push(rec);
  }
  for (const [_, records] of fixtureByProject.entries()) {
    fixtureValidator.validateLongitudinalContinuity(records);
  }

  // Write Fixture Outputs
  const fixtureRecordsPath = path.join(PROCESSED_DIR, 'fixtures_monthly_records_aug2025_mar2026.json');
  fs.writeFileSync(fixtureRecordsPath, JSON.stringify(allFixtureRecords, null, 2), 'utf-8');
  console.log(`✓ Generated: ${fixtureRecordsPath} (${allFixtureRecords.length} fixture records)`);

  const fixtureProjectsMaster = CANONICAL_PROJECT_REGISTRY.map((def) => {
    const observations = allFixtureRecords.filter((r) => r.canonical_project_id === def.canonicalId);
    return {
      canonical_project_id: def.canonicalId,
      canonical_project_name: def.canonicalName,
      implementing_agency: def.agency,
      sector: def.sector,
      state: def.state,
      registered_source_codes: def.sourceCodes,
      observations_count: observations.length,
      first_observation_month: observations[0]?.report_month || null,
      latest_observation_month: observations[observations.length - 1]?.report_month || null,
      latest_physical_progress: observations[observations.length - 1]?.physical_progress_pct ?? null,
      latest_sanctioned_cost_cr: observations[observations.length - 1]?.sanctioned_cost_cr ?? null,
      latest_anticipated_cost_cr: observations[observations.length - 1]?.anticipated_cost_cr ?? null,
      fixture_status: 'TEST_FIXTURE',
    };
  });
  const fixtureProjectsPath = path.join(PROCESSED_DIR, 'fixtures_projects_master.json');
  fs.writeFileSync(fixtureProjectsPath, JSON.stringify(fixtureProjectsMaster, null, 2), 'utf-8');
  console.log(`✓ Generated: ${fixtureProjectsPath} (${fixtureProjectsMaster.length} fixture projects)`);

  const fixtureValidationReport = fixtureValidator.generateReport(CONTRACT_ID, allFixtureRecords.length);
  const fixtureValidationPath = path.join(VALIDATION_DIR, 'test_fixture_validation_report.json');
  fs.writeFileSync(fixtureValidationPath, JSON.stringify(fixtureValidationReport, null, 2), 'utf-8');
  console.log(`✓ Generated: ${fixtureValidationPath} (${fixtureValidationReport.issues.length} fixture validation issues caught)`);

  const fixtureIdentityReportPath = path.join(VALIDATION_DIR, 'test_fixture_identity_resolution_report.json');
  const fixtureIdentityPayload = {
    contractId: CONTRACT_ID,
    timestamp: new Date().toISOString(),
    totalExtractedRecords: fixtureIdResults.length,
    resolvedCount: fixtureIdResults.filter((r) => r.resolvedCanonicalId !== null).length,
    unresolvedCount: fixtureUnresolvedList.length,
    resolutionBreakdown: {
      tier_1_exact_code: fixtureIdResults.filter((r) => r.resolutionTier === 'TIER_1_EXACT_CODE').length,
      tier_2_name_agency: fixtureIdResults.filter((r) => r.resolutionTier === 'TIER_2_NAME_AGENCY').length,
      tier_3_composite: fixtureIdResults.filter((r) => r.resolutionTier === 'TIER_3_COMPOSITE').length,
      tier_4_manual_review: fixtureUnresolvedList.length,
    },
    resolutions: fixtureIdResults,
  };
  fs.writeFileSync(fixtureIdentityReportPath, JSON.stringify(fixtureIdentityPayload, null, 2), 'utf-8');
  console.log(`✓ Generated: ${fixtureIdentityReportPath}`);

  const fixtureStatsPath = path.join(VALIDATION_DIR, 'test_fixture_extraction_statistics_by_month.json');
  fs.writeFileSync(fixtureStatsPath, JSON.stringify(fixtureMonthlyStats, null, 2), 'utf-8');
  console.log(`✓ Generated: ${fixtureStatsPath}`);

  const fixtureUnresolvedPath = path.join(VALIDATION_DIR, 'test_fixture_unresolved_review_list.json');
  fs.writeFileSync(fixtureUnresolvedPath, JSON.stringify(fixtureUnresolvedList, null, 2), 'utf-8');
  console.log(`✓ Generated: ${fixtureUnresolvedPath} (${fixtureUnresolvedList.length} items routed to review queue)`);

  // ==========================================================================
  // PART 3: PROVENANCE AUDIT SUMMARY REPORT
  // ==========================================================================
  const provenanceAuditReport = {
    contractId: CONTRACT_ID,
    timestamp: new Date().toISOString(),
    auditSummary: {
      sourceExtractionStatus: pdfScanResult.pdfFoundCount === 0 ? 'HALTED_AT_SOURCE_BOUNDARY' : 'SOURCE_FOUND',
      actualPaimanaPdfsDiscovered: pdfScanResult.pdfFoundCount,
      actualVerifiedSourceObservations: verifiedSourceRecords.length,
      actualVerifiedUniqueProjects: uniqueCanonicalSourceIds.length,
      testFixtureObservations: allFixtureRecords.length + fixtureUnresolvedList.length,
      testFixtureResolvedRecords: allFixtureRecords.length,
      testFixtureUnresolvedRecords: fixtureUnresolvedList.length,
      testFixtureUniqueProjects: Array.from(fixtureByProject.keys()).length,
    },
    machineReadableStatusCounts: {
      SOURCE_VERIFIED: verifiedSourceRecords.length,
      TEST_FIXTURE: allFixtureRecords.length,
      UNRESOLVED: fixtureUnresolvedList.length,
      NOT_CONNECTED: 0,
    },
    strictClassificationRules: [
      'Authentic records must derive directly from official MoSPI PAIMANA PDFs with provenance = [SOURCE] and source_status = SOURCE_VERIFIED.',
      'All fixture records in data/raw/fixtures/ are synthetic and must strictly carry provenance = [SIMULATED] and source_status = TEST_FIXTURE.',
      'The November 2025 RRTS-82K contradiction is an injected validation test fixture (sanction 2019 vs completion 2018; progress 115%).',
      'Test fixtures must NOT be used for ML model training, evaluation, or source-derived UI claims.',
      'Never claim "113 source observations" or "14 unique projects" as real MoSPI data.',
    ],
    injectedContradictionDetails: {
      caseName: 'November 2025 Delhi-Meerut RRTS Injected Contradiction',
      sourceProjectCode: 'MRTS/DEL-MEERUT/RRTS-82K',
      classification: 'TEST_FIXTURE',
      provenance: '[SIMULATED]',
      issuesCaught: fixtureValidationReport.issues.filter((i) => i.canonicalProjectId === 'PRJ-NCRTC-82'),
    },
  };

  const auditReportPath = path.join(VALIDATION_DIR, 'data_provenance_audit_report.json');
  fs.writeFileSync(auditReportPath, JSON.stringify(provenanceAuditReport, null, 2), 'utf-8');
  console.log(`✓ Generated: ${auditReportPath}`);

  // Summary Table
  console.log('\n================================================================');
  console.log('PAIMANA DATA CREDIBILITY AUDIT SUMMARY');
  console.log('================================================================');
  console.log(`Authentic MoSPI PAIMANA PDFs Available:  ${pdfScanResult.pdfFoundCount}`);
  console.log(`Verified Source-Derived Observations:   ${verifiedSourceRecords.length}`);
  console.log(`Verified Unique Canonical Projects:     ${uniqueCanonicalSourceIds.length}`);
  console.log(`Source Ingestion Boundary Status:       ${pdfScanResult.pdfFoundCount === 0 ? 'HALTED (Zero replacement data)' : 'EXTRACTED'}`);
  console.log('----------------------------------------------------------------');
  console.log(`Validation Test Fixture Observations:   ${allFixtureRecords.length + fixtureUnresolvedList.length}`);
  console.log(`  - Test Fixture Resolved Records:      ${allFixtureRecords.length}`);
  console.log(`  - Test Fixture Unresolved (Tier 4):   ${fixtureUnresolvedList.length}`);
  console.log(`  - Test Fixture Unique Projects:       ${Array.from(fixtureByProject.keys()).length}`);
  console.log(`  - Injected November Contradictions:   ${provenanceAuditReport.injectedContradictionDetails.issuesCaught.length} issues captured`);
  console.log('----------------------------------------------------------------');
  console.log('Machine-Readable Status Breakdown:');
  console.log(`  - SOURCE_VERIFIED: ${provenanceAuditReport.machineReadableStatusCounts.SOURCE_VERIFIED}`);
  console.log(`  - TEST_FIXTURE:    ${provenanceAuditReport.machineReadableStatusCounts.TEST_FIXTURE}`);
  console.log(`  - UNRESOLVED:      ${provenanceAuditReport.machineReadableStatusCounts.UNRESOLVED}`);
  console.log(`  - NOT_CONNECTED:   ${provenanceAuditReport.machineReadableStatusCounts.NOT_CONNECTED}`);
  console.log('================================================================\n');

  return {
    sourceScan: pdfScanResult,
    verifiedSourceRecords,
    allFixtureRecords,
    provenanceAuditReport,
  };
}

// Direct execution entrypoint
runPaimanaPipeline().catch((err) => {
  console.error('Pipeline failed with error:', err);
  process.exit(1);
});
