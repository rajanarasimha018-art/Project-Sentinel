/**
 * ProjectSentinel Domain Data Types
 * Reference Standard: SIH 2026 Problem Statement SIH26103
 * Integration Target: PAIMANA (MoSPI Central Sector Projects >= 150 Cr)
 */

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_DATA';
export type RiskTrendDirection = 'INCREASING_FAST' | 'INCREASING' | 'STABLE' | 'DECREASING';
export type UrgencyLevel = 'IMMEDIATE_48H' | 'CYCLE_PRIORITY' | 'SCHEDULED_REVIEW';
export type DataQualityTier = 'SUFFICIENT' | 'PARTIAL' | 'INSUFFICIENT' | 'VALIDATION_REQUIRED';

export type InfrastructureSector = 
  | 'Highways & Roads'
  | 'Railways & Metros'
  | 'Power & Renewable'
  | 'Petroleum & Natural Gas'
  | 'Ports & Shipping'
  | 'Civil Aviation'
  | 'Urban Development & Water';

export interface ProjectEntity {
  id: string;
  code: string;
  name: string;
  sector: InfrastructureSector;
  ministry: string;
  implementingAgency: string;
  state: string;
  region: string;
  coordinates: [number, number]; // [lat, lng]
  sanctionedDate: string;
  originalCompletionDate: string;
  anticipatedCompletionDate: string;
  sanctionedCostCr: number;
  anticipatedCostCr: number;
  cumulativeExpenditureCr: number;
  physicalProgressPct: number;
  financialProgressPct: number;
  dataQuality: DataQualityTier;
  dataQualityNotes: string;
  lastReportingDate: string;
}

export interface RiskFactor {
  id: string;
  category: 'LAND_ACQUISITION' | 'CONTRACTOR_CAPACITY' | 'STATUTORY_CLEARANCES' | 'GEOLOGICAL' | 'FINANCIAL_FLOW' | 'UTILITY_SHIFTING';
  title: string;
  weightPct: number;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  groundObservation: string;
  paimanaFieldRef: string;
}

export interface EvidenceRecord {
  id: string;
  type: 'DPR_SUBMISSION' | 'DRONE_SURVEY' | 'STATE_NOC' | 'EXPENSE_AUDIT' | 'CONTRACTOR_NOTICE' | 'INSPECTION_NOTE';
  documentTitle: string;
  date: string;
  issuingAuthority: string;
  summary: string;
  verificationStatus: 'VERIFIED' | 'FLAGGED_INCONSISTENCY' | 'PENDING_CONFIRMATION';
}

export interface ActionGuidance {
  criticalPathMilestone: string;
  projectedStallDays: number;
  competentAuthority: string;
  fieldOfficers: string[];
  recommendedDecision: string;
  statutoryNextStep: string;
  escalationLevel: 'Apex Level (Cabinet Secretariat / PRAGATI)' | 'Ministry Level (Secretary / Review Committee)' | 'Executive Level (Project Director / District Magistrate)';
}

export interface AttentionQueueItem {
  project: ProjectEntity;
  riskScore: number; // 0.00 to 1.00
  riskLevel: RiskLevel;
  trend: RiskTrendDirection;
  trendDelta: number; // e.g. +0.14
  primarySignal: string;
  recentChange: string;
  urgency: UrgencyLevel;
  recommendedActionText: string;
  modelConfidencePct: number;
  riskFactors: RiskFactor[];
  evidence: EvidenceRecord[];
  actionGuidance: ActionGuidance;
}

export interface PortfolioSummaryStats {
  monitoredProjectsCount: number;
  activeProjectsCount: number;
  delayedBeyondOriginalScheduleCount: number;
  delayedRatioPct: number;
  criticalAndHighRiskCount: number;
  escalatedThisCycleCount: number;
  mitigatedThisCycleCount: number;
  totalSanctionedOutlayCr: number;
  anticipatedCostOverrunCr: number;
  costOverrunPct: number;
  acceleratedMilestoneProjectsCount: number;
}

export interface RiskDistributionData {
  bySeverity: {
    critical: { count: number; pct: number };
    high: { count: number; pct: number };
    medium: { count: number; pct: number };
    low: { count: number; pct: number };
    insufficientData: { count: number; pct: number };
  };
  byTrend: {
    increasing: { count: number; pct: number };
    stable: { count: number; pct: number };
    decreasing: { count: number; pct: number };
  };
}

export interface QuarterlyTrendPoint {
  cycle: string;
  quarterLabel: string;
  portfolioAvgRiskIndex: number;
  criticalHighCount: number;
  delayedCount: number;
  resolvedCount: number;
  benchmarkTarget: number;
}

export interface DataQualitySummary {
  sufficientCount: number;
  sufficientPct: number;
  partialCount: number;
  partialPct: number;
  insufficientCount: number;
  insufficientPct: number;
  validationRequiredCount: number;
  validationRequiredPct: number;
  lastAuditRun: string;
  confidenceEngineVersion: string;
  discrepancyCount: number;
}
