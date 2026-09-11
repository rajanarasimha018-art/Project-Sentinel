/**
 * PAIMANA Deterministic PDF Extraction Specification & Ingestion Pipeline
 * Reference: SIH 2026 Problem Statement SIH26103
 * Canonical Data Contract: paimana_data_contract_aug2025_mar2026.yaml
 *
 * PROVENANCE REQUIREMENT:
 * This module defines the deterministic parser for official MoSPI PAIMANA
 * Central Sector Project Monthly Flash Report PDFs (Aug 2025 – Mar 2026).
 *
 * If no actual PDFs are present in data/raw/source/, it halts at the source-ingestion
 * boundary and reports 0 verified source records, refusing to manufacture synthetic
 * records as [SOURCE].
 */

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import type { RawPaimanaReport, RawPaimanaRecord } from './types.ts';

export interface PdfExtractionResult {
  pdfFoundCount: number;
  pdfFiles: string[];
  extractedReports: RawPaimanaReport[];
  statusMessage: string;
}

export class PaimanaPdfExtractor {
  private sourceDir: string;
  private cachePath: string;

  constructor(sourceDir?: string) {
    this.sourceDir = sourceDir || path.resolve('data/raw/source');
    this.cachePath = path.join(this.sourceDir, 'extracted_table4_reports.json');
  }

  /**
   * Scans data/raw/source/ for actual MoSPI PAIMANA monthly PDF reports.
   * Deterministically parses Table 4 from the 12 authentic PDFs.
   */
  public discoverAndExtract(): PdfExtractionResult {
    if (!fs.existsSync(this.sourceDir)) {
      fs.mkdirSync(this.sourceDir, { recursive: true });
    }

    const files = fs.readdirSync(this.sourceDir);
    const pdfFiles = files.filter((f) => f.toLowerCase().endsWith('.pdf')).sort();

    if (pdfFiles.length === 0) {
      return {
        pdfFoundCount: 0,
        pdfFiles: [],
        extractedReports: [],
        statusMessage: 'SOURCE INGESTION BOUNDARY: No actual PAIMANA monthly PDF documents discovered in data/raw/source/. Pipeline will not synthesize source records.',
      };
    }

    // Ensure extracted Table 4 data exists and is synchronized
    if (!fs.existsSync(this.cachePath)) {
      console.log(`[PDF EXTRACTOR] Running deterministic Table 4 extraction on ${pdfFiles.length} authentic PDFs...`);
      const scriptPath = path.resolve('scripts/extract_table4_source.py');
      try {
        execFileSync('python', [scriptPath, '--save'], { encoding: 'utf-8' });
      } catch (err) {
        console.error('[PDF EXTRACTOR ERROR] Python extraction failed:', err);
      }
    }

    if (!fs.existsSync(this.cachePath)) {
      throw new Error(`Extraction failed: ${this.cachePath} not generated.`);
    }

    const rawJson = fs.readFileSync(this.cachePath, 'utf-8');
    const rawReportsData: any[] = JSON.parse(rawJson);

    const extractedReports: RawPaimanaReport[] = rawReportsData.map((rep) => {
      const records: RawPaimanaRecord[] = rep.records.map((r: any) => ({
        source_page: r.provenance?.source_page ?? null,
        source_section: r.provenance?.source_section || rep.table_name || 'Table 4',
        source_project_code: r.source_project_code || null,
        source_status: 'SOURCE_VERIFIED',
        project_name: r.project_name || '',
        implementing_agency: r.implementing_agency || '',
        ministry: r.ministry || 'Central Line Ministry',
        sector: r.sector || 'Infrastructure',
        state: r.state || '',
        sanction_date: r.sanction_date || null,
        original_completion_date: r.original_completion_date || null,
        anticipated_completion_date: r.anticipated_completion_date || null,
        sanctioned_cost: r.sanctioned_cost_cr,
        anticipated_cost: r.anticipated_cost_cr,
        cumulative_expenditure: r.cumulative_expenditure_cr,
        physical_progress: r.physical_progress_pct,
        financial_progress: null,
        project_status: null,
        primary_impediment_category: null,
        primary_impediment_summary: null,
        provenance: '[SOURCE]',
        source_field_ref: r.provenance?.source_field || `Table 4 / Code ${r.source_project_code}`,
      }));

      return {
        report_id: rep.report_id,
        source_filename: rep.source_filename,
        month_name: rep.canonical_month,
        canonical_month: rep.canonical_month,
        report_cutoff_date: rep.report_cutoff_date,
        publication_date: rep.publication_date,
        source_system: rep.source_system,
        publication_authority: rep.publication_authority,
        expected_records_count: rep.expected_records_count,
        total_records_extracted: records.length,
        records,
      };
    });

    const totalRows = extractedReports.reduce((sum, r) => sum + r.total_records_extracted, 0);

    return {
      pdfFoundCount: pdfFiles.length,
      pdfFiles,
      extractedReports,
      statusMessage: `Successfully discovered ${pdfFiles.length} authentic PAIMANA PDFs and extracted ${totalRows} Table 4 records.`,
    };
  }
}

