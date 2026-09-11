/**
 * ProjectSentinel — Early Warning / Risk Monitor Data Layer
 * Standard: SIH 2026 Problem Statement SIH26103
 * 
 * CREDIBILITY & TRANSPARENCY NOTICE:
 * - All calculations are derived reproducibly from MOCK_ATTENTION_QUEUE and PROJECT_HISTORICAL_CYCLES.
 * - Risk states are 'ProjectSentinel prototype risk states' (HIGH ATTENTION, EMERGING RISK, WATCH, STABLE)
 *   and do not purport to be official government classifications.
 * - Predictive interpretations are marked explicitly: 'Validation in progress on historical MoSPI project records.'
 */

import { AttentionQueueItem, DriverClusterItem, EarlyWarningRiskState } from '../types/sentinel';
import { MOCK_ATTENTION_QUEUE } from './mockPaimanaData';

export interface EarlyWarningRow {
  item: AttentionQueueItem;
  riskState: EarlyWarningRiskState;
  riskChangeText: string;
  riskChangeNumeric: number;
  scheduleSignal: string;
  scheduleShiftMonthsTotal: number;
  physicalDeltaRecentPct: number;
  expenditureDeltaRecentCr: number;
  divergenceText: string;
  isDivergenceFlagged: boolean;
  primaryDriverLabel: string;
  primaryDriverFieldRef: string;
  dataQualityTier: string;
  lastReportPeriod: string;
  actionLabel: string;
}

/**
 * Derives Early Warning records deterministically from the 10 loaded reference projects
 * [CALCULATED from loaded historical cycles]
 */
export const getEarlyWarningRows = (): EarlyWarningRow[] => {
  return MOCK_ATTENTION_QUEUE.map((item) => {
    const cycles = item.historicalCycles || [];
    const latestCycle = cycles[cycles.length - 1];

    // 1. Calculate cumulative schedule shift across loaded historical cycles [CALCULATED]
    const scheduleShiftMonthsTotal = cycles.reduce((acc, c) => acc + (c.scheduleShiftMonths || 0), 0);

    // 2. Physical and financial progress deltas in latest cycle [SOURCE-DERIVED]
    const physicalDeltaRecentPct = latestCycle ? latestCycle.physicalProgressDeltaPct : 0;
    const expenditureDeltaRecentCr = latestCycle ? latestCycle.expenditureDeltaCr : 0;

    // 3. Physical vs Financial Divergence detection [CALCULATED]
    // Flagged if physical progress in latest cycle is below 3.0% while quarterly expenditure exceeds ₹400 Cr
    const isDivergenceFlagged = physicalDeltaRecentPct < 3.0 && expenditureDeltaRecentCr >= 400;
    const divergenceText = isDivergenceFlagged
      ? `Phys +${physicalDeltaRecentPct.toFixed(1)}% vs Exp ₹${expenditureDeltaRecentCr} Cr (Divergence Flag)`
      : `Phys +${physicalDeltaRecentPct.toFixed(1)}% vs Exp ₹${expenditureDeltaRecentCr} Cr (Aligned)`;

    // 4. Determine Prototype Risk State based on prototype risk score and trend [PROTOTYPE MODEL]
    let riskState: EarlyWarningRiskState = 'STABLE';
    if (item.riskLevel === 'CRITICAL' || item.trend === 'INCREASING_FAST') {
      riskState = 'HIGH_ATTENTION';
    } else if (item.riskLevel === 'HIGH' || (item.trend === 'INCREASING' && item.riskScore >= 0.70)) {
      riskState = 'EMERGING_RISK';
    } else if (item.riskScore >= 0.60 || item.trend === 'INCREASING') {
      riskState = 'WATCH';
    } else {
      riskState = 'STABLE';
    }

    // 5. Schedule Signal description [SOURCE + CALCULATED]
    let scheduleSignal = '';
    if (scheduleShiftMonthsTotal > 0) {
      scheduleSignal = `+${scheduleShiftMonthsTotal} mo cumulative shift (Target: ${item.project.anticipatedCompletionDate})`;
    } else {
      scheduleSignal = `On original target schedule (${item.project.anticipatedCompletionDate})`;
    }

    // 6. Risk Change Text based on prototype model trend delta [PROTOTYPE MODEL]
    const sign = item.trendDelta > 0 ? '+' : '';
    const riskChangeNumeric = item.trendDelta;
    let riskChangeText = `${sign}${item.trendDelta.toFixed(2)}`;
    if (item.trend === 'INCREASING_FAST') {
      riskChangeText += ' (Accelerating)';
    } else if (item.trend === 'INCREASING') {
      riskChangeText += ' (Escalating)';
    } else if (item.trend === 'DECREASING') {
      riskChangeText += ' (Mitigating)';
    } else {
      riskChangeText += ' (Stable)';
    }

    // 7. Primary Driver category & PAIMANA field ref [SOURCE + SIMULATED]
    const primaryFactor = item.riskFactors && item.riskFactors.length > 0 ? item.riskFactors[0] : null;
    const primaryDriverLabel = primaryFactor ? primaryFactor.title : 'General Execution Monitoring';
    const primaryDriverFieldRef = primaryFactor ? primaryFactor.paimanaFieldRef : 'PAIMANA_GEN_SCHEDULE';

    // 8. Recommended Review Action
    let actionLabel = 'Review project';
    if (riskState === 'HIGH_ATTENTION') {
      actionLabel = 'Review project';
    } else if (riskState === 'EMERGING_RISK') {
      actionLabel = 'Inspect risk factors';
    } else if (riskState === 'WATCH') {
      actionLabel = 'Compare timeline';
    } else {
      actionLabel = 'View evidence';
    }

    return {
      item,
      riskState,
      riskChangeText,
      riskChangeNumeric,
      scheduleSignal,
      scheduleShiftMonthsTotal,
      physicalDeltaRecentPct,
      expenditureDeltaRecentCr,
      divergenceText,
      isDivergenceFlagged,
      primaryDriverLabel,
      primaryDriverFieldRef,
      dataQualityTier: item.project.dataQuality,
      lastReportPeriod: item.project.lastReportingPeriod,
      actionLabel,
    };
  });
};

/**
 * Structured Driver Clusters across the portfolio
 * Standard: No arbitrary percentages. Clear mapping of Observed Signal, Evidence Field, and Status.
 */
export const DRIVER_CLUSTERS_DATA: DriverClusterItem[] = [
  {
    id: 'cluster-statutory',
    category: 'STATUTORY_ENVIRONMENTAL',
    categoryLabel: 'Statutory & Environmental Clearances',
    observedSignal: 'Completion-date revision coincides with reported Stage-II forest diversion or environmental appraisal pendency.',
    evidenceFieldMapping: 'PAIMANA schedule fields + PAIMANA_BL_STAT_CLR_STAGE2 / PAIMANA_ENV_SPCB_CONSENT',
    interpretationStatus: 'Prototype interpretation — validation in progress on historical MoSPI project records.',
    affectedProjects: [
      {
        projectId: 'prj-nhai-842',
        projectCode: 'PRJ-NHAI-842',
        projectName: 'Vadodara–Mumbai Expressway Phase-II',
        specificFinding: 'Stage-II Forest Clearance stalled for 24.2 km in eco-sensitive corridor; +8 mo COD shift.',
      },
      {
        projectId: 'prj-jnpa-215',
        projectCode: 'PRJ-JNPA-215',
        projectName: 'Vadhavan Mega All-Weather Deep Draft Port',
        specificFinding: 'Coastal regulation legal writ admitted for judicial review during early breakwater award.',
      },
      {
        projectId: 'prj-ntpc-608',
        projectCode: 'PRJ-NTPC-608',
        projectName: 'North Karanpura Super Thermal Power Project',
        specificFinding: 'Ash dyke water recirculation verification required by state board prior to Unit-3 trial run.',
      },
      {
        projectId: 'prj-iocl-452',
        projectCode: 'PRJ-IOCL-452',
        projectName: 'Paradip–Hyderabad Petroleum Product Pipeline',
        specificFinding: 'Terminal safety audit completed; awaiting PESO statutory operating license endorsement.',
      },
    ],
  },
  {
    id: 'cluster-contractor',
    category: 'CONTRACTOR_EXECUTION',
    categoryLabel: 'Contractor Capacity & Liquidity',
    observedSignal: 'Physical heading excavation rate deceleration coupled with reduced equipment mobilization on active packages.',
    evidenceFieldMapping: 'PAIMANA expenditure burn fields + PAIMANA_EXP_FIN_MOBILIZATION / PAIMANA_EQ_SPECIALIZED_ACTIVE',
    interpretationStatus: 'Prototype interpretation — validation in progress on historical MoSPI project records.',
    affectedProjects: [
      {
        projectId: 'prj-nhai-842',
        projectCode: 'PRJ-NHAI-842',
        projectName: 'Vadodara–Mumbai Expressway Phase-II',
        specificFinding: 'Concessionaire working capital deficit; subgrade paving slowed across Viaduct 4.',
      },
      {
        projectId: 'prj-rvnl-319',
        projectCode: 'PRJ-RVNL-319',
        projectName: 'Rishikesh–Karnaprayag New Broad Gauge Rail Link',
        specificFinding: 'Deep-drainage drilling equipment delayed; heading advance fell from 4.2m/day to 0.8m/day.',
      },
    ],
  },
  {
    id: 'cluster-land',
    category: 'LAND_ROW',
    categoryLabel: 'Land Acquisition & Right-of-Way Fragmentation',
    observedSignal: 'Discontinuous linear possession patches preventing linear heavy earthwork machinery mobilization.',
    evidenceFieldMapping: 'PAIMANA land status registers + PAIMANA_LA_POSSESSION_RATIO / PAIMANA_LA_SEC19_AWARDS',
    interpretationStatus: 'Prototype interpretation — validation in progress on historical MoSPI project records.',
    affectedProjects: [
      {
        projectId: 'prj-dfcc-104',
        projectCode: 'PRJ-DFCC-104',
        projectName: 'Eastern Dedicated Freight Corridor (Sonnagar–Dankuni)',
        specificFinding: 'Linear RoW divided into 48 discontinuous patches across 18.6 km; earthwork stalled.',
      },
      {
        projectId: 'prj-nhai-842',
        projectCode: 'PRJ-NHAI-842',
        projectName: 'Vadodara–Mumbai Expressway Phase-II',
        specificFinding: 'Residual linear RoW gaps across 3 revenue village patches under compensation arbitration.',
      },
    ],
  },
  {
    id: 'cluster-geological',
    category: 'GEOLOGICAL_TERRAIN',
    categoryLabel: 'Geological & Mountain Terrain Hazards',
    observedSignal: 'Unforeseen fault shear zone convergence or extreme sub-zero avalanche hazards requiring structural reprofiling.',
    evidenceFieldMapping: 'PAIMANA geotechnical logs + PAIMANA_GEO_RISK_INDEX / PAIMANA_CLIMATE_HAZARD_AVALANCHE',
    interpretationStatus: 'Prototype interpretation — validation in progress on historical MoSPI project records.',
    affectedProjects: [
      {
        projectId: 'prj-rvnl-319',
        projectCode: 'PRJ-RVNL-319',
        projectName: 'Rishikesh–Karnaprayag New Broad Gauge Rail Link',
        specificFinding: 'Main Central Thrust shear zone encountered in Tunnel-7; convergence pressure requires modified lattice girders.',
      },
      {
        projectId: 'prj-nhai-128',
        projectCode: 'PRJ-NHAI-128',
        projectName: 'Zojila Bi-Directional Tunnel Road',
        specificFinding: 'Winter avalanche protocol halts East portal; West portal double shift active under sensor telemetry.',
      },
    ],
  },
  {
    id: 'cluster-utility',
    category: 'UTILITY_INTERAGENCY',
    categoryLabel: 'Utility Relocation & Inter-Agency Coordination',
    observedSignal: 'High-tension electrical lines and gas pipeline relocation conflicts with municipal traffic moratorium windows.',
    evidenceFieldMapping: 'PAIMANA utility registers + PAIMANA_UTILITY_GAS_RELOC / Joint Engineering Minutes',
    interpretationStatus: 'Prototype interpretation — validation in progress on historical MoSPI project records.',
    affectedProjects: [
      {
        projectId: 'prj-bmrcl-791',
        projectCode: 'PRJ-BMRCL-791',
        projectName: 'Bengaluru Metro Phase-2A & 2B (Silk Board to Airport)',
        specificFinding: 'ORR high-pressure gas line relocation pending; night launching gantry window restricted to 4 hours.',
      },
    ],
  },
];
