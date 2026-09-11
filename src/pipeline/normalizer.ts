/**
 * PAIMANA Canonical Normalizer
 * Reference: SIH 2026 Problem Statement SIH26103
 * Strict adherence to Canonical Data Contract normalization rules.
 */

const MONTH_MAP: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
};

/**
 * Normalizes dates to canonical ISO 8601 (YYYY-MM-DD).
 * Supports: DD/MM/YYYY, DD-MMM-YYYY, YYYY-MM-DD, DD.MM.YYYY
 * Returns null if input is null, undefined, or empty.
 */
export function normalizeDate(rawDate: string | null | undefined): string | null {
  if (!rawDate || typeof rawDate !== 'string') return null;
  const trimmed = rawDate.trim();
  if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'n/a' || trimmed === '-') {
    return null;
  }

  // Case 1: Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Case 2: DD/MM/YYYY or DD-MM-YYYY
  const slashMatch = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, '0');
    const month = slashMatch[2].padStart(2, '0');
    const year = slashMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Case 3: DD-MMM-YYYY (e.g., 15-Mar-2020 or 15/Mar/2020)
  const textMonthMatch = trimmed.match(/^(\d{1,2})[\/\-\s]([A-Za-z]{3})[\/\-\s](\d{4})$/);
  if (textMonthMatch) {
    const day = textMonthMatch[1].padStart(2, '0');
    const monthKey = textMonthMatch[2].toLowerCase();
    const month = MONTH_MAP[monthKey];
    const year = textMonthMatch[3];
    if (month) {
      return `${year}-${month}-${day}`;
    }
  }

  // Case 4: DD.MM.YYYY
  const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotMatch) {
    const day = dotMatch[1].padStart(2, '0');
    const month = dotMatch[2].padStart(2, '0');
    const year = dotMatch[3];
    return `${year}-${month}-${day}`;
  }

  return null;
}

/**
 * Normalizes report month to canonical YYYY-MM-01 format.
 */
export function normalizeReportMonth(rawMonth: string): string {
  if (!rawMonth) return '1970-01-01';
  const trimmed = rawMonth.trim();

  // If already YYYY-MM-01
  if (/^\d{4}-\d{2}-01$/.test(trimmed)) {
    return trimmed;
  }

  // If YYYY-MM
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return `${trimmed}-01`;
  }

  // If "August 2025" or "Aug 2025"
  const textMatch = trimmed.match(/^([A-Za-z]+)[\s\-](\d{4})$/);
  if (textMatch) {
    const monthSub = textMatch[1].substring(0, 3).toLowerCase();
    const monthNum = MONTH_MAP[monthSub];
    const year = textMatch[2];
    if (monthNum) {
      return `${year}-${monthNum}-01`;
    }
  }

  return trimmed;
}

/**
 * Normalizes monetary figures to ₹ Crore float.
 * STRICT MISSING VALUE RULE:
 * - Missing / null / undefined / "N/A" -> returns null (NEVER coerced to zero).
 * - Explicit source 0 or "0.00" -> returns 0.00.
 */
export function normalizeCurrency(rawVal: any): number | null {
  if (rawVal === null || rawVal === undefined) return null;
  if (typeof rawVal === 'number') {
    if (isNaN(rawVal)) return null;
    return Math.round(rawVal * 100) / 100;
  }

  if (typeof rawVal === 'string') {
    const trimmed = rawVal.trim();
    if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'n/a' || trimmed === '-') {
      return null;
    }

    // Explicit check for zero representations
    if (/^0+(\.0+)?$/.test(trimmed.replace(/[₹,\s]/g, ''))) {
      return 0.0;
    }

    // Clean currency symbols, commas, spaces, "Cr", "Crore"
    let cleaned = trimmed.replace(/[₹,]/g, '').replace(/cr(ore)?/i, '').trim();
    
    // Scale if explicitly labeled as Lakh
    let multiplier = 1.0;
    if (/lakh/i.test(cleaned)) {
      multiplier = 0.01;
      cleaned = cleaned.replace(/lakh/i, '').trim();
    }

    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return null;
    return Math.round(parsed * multiplier * 100) / 100;
  }

  return null;
}

/**
 * Normalizes physical and financial progress to 0.0 - 100.0 float.
 * STRICT MISSING VALUE RULE:
 * - Missing / null / undefined / "N/A" -> returns null.
 * - Explicit source 0% or "0.0" -> returns 0.0.
 */
export function normalizePercentage(rawVal: any): number | null {
  if (rawVal === null || rawVal === undefined) return null;
  if (typeof rawVal === 'number') {
    if (isNaN(rawVal)) return null;
    return Math.round(rawVal * 100) / 100;
  }

  if (typeof rawVal === 'string') {
    const trimmed = rawVal.trim();
    if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'n/a' || trimmed === '-') {
      return null;
    }

    // Explicit check for 0%
    if (/^0+(\.0+)?%?$/.test(trimmed)) {
      return 0.0;
    }

    const cleaned = trimmed.replace(/%/g, '').trim();
    const parsed = parseFloat(cleaned);
    if (isNaN(parsed)) return null;
    return Math.round(parsed * 100) / 100;
  }

  return null;
}

/**
 * Calculates deterministic time overrun in months between original and anticipated dates.
 * [CALCULATED]
 */
export function calculateTimeOverrunMonths(origDateStr: string | null, antDateStr: string | null): number | null {
  if (!origDateStr || !antDateStr) return null;
  try {
    const orig = new Date(origDateStr);
    const ant = new Date(antDateStr);
    if (isNaN(orig.getTime()) || isNaN(ant.getTime())) return null;

    if (ant <= orig) return 0;

    const yearDiff = ant.getFullYear() - orig.getFullYear();
    const monthDiff = ant.getMonth() - orig.getMonth();
    return Math.max(0, yearDiff * 12 + monthDiff);
  } catch {
    return null;
  }
}
