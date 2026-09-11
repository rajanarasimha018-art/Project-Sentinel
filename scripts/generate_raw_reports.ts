import fs from 'fs';
import path from 'path';

/**
 * Script to generate the 8 validation TEST FIXTURE reports
 * (August 2025 through March 2026) for pipeline verification.
 *
 * PROVENANCE & INTEGRITY COMPLIANCE:
 * - All records are explicitly labeled: provenance = '[SIMULATED]'
 * - All records have source_status = 'TEST_FIXTURE'
 * - Preserved separately in data/raw/fixtures/
 * - NEVER labeled as [SOURCE] or used for ML training
 */

const FIXTURES_DIR = path.resolve('data/raw/fixtures');
if (!fs.existsSync(FIXTURES_DIR)) {
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });
}

interface MonthlySpec {
  reportId: string;
  monthName: string;
  reportMonth: string;
  reportDate: string;
  publicationDate: string;
}

const MONTHS: MonthlySpec[] = [
  { reportId: 'FIXTURE-PAIMANA-2025-08', monthName: 'August 2025', reportMonth: '2025-08-01', reportDate: '2025-08-31', publicationDate: '2025-09-15' },
  { reportId: 'FIXTURE-PAIMANA-2025-09', monthName: 'September 2025', reportMonth: '2025-09-01', reportDate: '2025-09-30', publicationDate: '2025-10-15' },
  { reportId: 'FIXTURE-PAIMANA-2025-10', monthName: 'October 2025', reportMonth: '2025-10-01', reportDate: '2025-10-31', publicationDate: '2025-11-15' },
  { reportId: 'FIXTURE-PAIMANA-2025-11', monthName: 'November 2025', reportMonth: '2025-11-01', reportDate: '2025-11-30', publicationDate: '2025-12-15' },
  { reportId: 'FIXTURE-PAIMANA-2025-12', monthName: 'December 2025', reportMonth: '2025-12-01', reportDate: '2025-12-31', publicationDate: '2026-01-15' },
  { reportId: 'FIXTURE-PAIMANA-2026-01', monthName: 'January 2026', reportMonth: '2026-01-01', reportDate: '2026-01-31', publicationDate: '2026-02-15' },
  { reportId: 'FIXTURE-PAIMANA-2026-02', monthName: 'February 2026', reportMonth: '2026-02-01', reportDate: '2026-02-28', publicationDate: '2026-03-15' },
  { reportId: 'FIXTURE-PAIMANA-2026-03', monthName: 'March 2026', reportMonth: '2026-03-01', reportDate: '2026-03-31', publicationDate: '2026-04-15' },
];

interface ProjectTimelineBase {
  canonicalId: string;
  sourceCode: string;
  name: string;
  agency: string;
  ministry: string;
  sector: string;
  state: string;
  sanctionDate: string;
  origCompDate: string;
  sanctionedCost: number;
  baseAntCost: number;
  baseExp: number;
  basePhys: number;
  baseFin: number;
  baseAntCompDate: string;
  impedimentCategory: string;
  impedimentSummary: string;
  page: number;
  section: string;
}

const BASE_PROJECTS: ProjectTimelineBase[] = [
  {
    canonicalId: 'PRJ-NHAI-842',
    sourceCode: 'NHAI/MUM-VAD/EXP-PKG2',
    name: 'Vadodara–Mumbai Expressway Phase-II (Km 26 to Km 89)',
    agency: 'National Highways Authority of India (NHAI)',
    ministry: 'Ministry of Road Transport and Highways (MoRTH)',
    sector: 'Highways & Roads',
    state: 'Maharashtra',
    sanctionDate: '15/03/2020',
    origCompDate: '31/12/2024',
    sanctionedCost: 8740.0,
    baseAntCost: 10450.0,
    baseExp: 5900.0,
    basePhys: 53.0,
    baseFin: 58.0,
    baseAntCompDate: '2026-04-30',
    impedimentCategory: 'STATUTORY_CLEARANCES',
    impedimentSummary: 'Stage-II forest clearance recommendation pending for 24.2 km eco-sensitive corridor',
    page: 14,
    section: 'Table 2.1: National Highways Development Project Overview',
  },
  {
    canonicalId: 'PRJ-RVNL-319',
    sourceCode: 'RVNL/NR/RK-RAIL-125',
    name: 'Rishikesh–Karnaprayag New Broad Gauge Rail Link (125 Km)',
    agency: 'Rail Vikas Nigam Limited (RVNL)',
    ministry: 'Ministry of Railways (MoR)',
    sector: 'Railways & Metros',
    state: 'Uttarakhand',
    sanctionDate: '01/11/2015',
    origCompDate: '31/12/2024',
    sanctionedCost: 16216.0,
    baseAntCost: 20400.0,
    baseExp: 11800.0,
    basePhys: 63.5,
    baseFin: 66.0,
    baseAntCompDate: '2026-12-31',
    impedimentCategory: 'GEOLOGICAL',
    impedimentSummary: 'Main Central Thrust shear zone deformation in Tunnel 7 requiring NATM reprofiling',
    page: 28,
    section: 'Table 2.3: Major Railway Broad Gauge Link Projects',
  },
  {
    canonicalId: 'PRJ-DFCC-104',
    sourceCode: 'DFCC/EDFC/SON-DNK-538',
    name: 'Eastern Dedicated Freight Corridor: Sonnagar–Dankuni (538 Km)',
    agency: 'Dedicated Freight Corridor Corporation of India (DFCCIL)',
    ministry: 'Ministry of Railways (MoR)',
    sector: 'Railways & Metros',
    state: 'West Bengal & Bihar',
    sanctionDate: '10/08/2016',
    origCompDate: '31/03/2023',
    sanctionedCost: 14980.0,
    baseAntCost: 18200.0,
    baseExp: 4900.0,
    basePhys: 32.0,
    baseFin: 35.5,
    baseAntCompDate: '2026-10-31',
    impedimentCategory: 'LAND_ACQUISITION',
    impedimentSummary: 'Discontinuous linear private land possession segments stalling continuous earthwork',
    page: 34,
    section: 'Table 2.4: Dedicated Freight Corridor Lines',
  },
  {
    canonicalId: 'PRJ-JNPA-215',
    sourceCode: 'JNPA/BMCT-TERM4/PH2',
    name: 'Jawaharlal Nehru Port Container Terminal-4 (Phase-II Expansion)',
    agency: 'Jawaharlal Nehru Port Authority (JNPA)',
    ministry: 'Ministry of Ports, Shipping and Waterways (MoPSW)',
    sector: 'Ports & Shipping',
    state: 'Maharashtra',
    sanctionDate: '18/06/2018',
    origCompDate: '31/10/2024',
    sanctionedCost: 3196.0,
    baseAntCost: 3840.0,
    baseExp: 2180.0,
    basePhys: 64.0,
    baseFin: 67.2,
    baseAntCompDate: '2026-06-30',
    impedimentCategory: 'CONTRACTOR_CAPACITY',
    impedimentSummary: 'Reclamation bund marine armor placement slowed by specialist dredge crane availability',
    page: 51,
    section: 'Table 2.7: Major Port Infrastructure Developments',
  },
  {
    canonicalId: 'PRJ-NTPC-608',
    sourceCode: 'NTPC/EAST/NK-STPP-3X660',
    name: 'North Karanpura Super Thermal Power Project (3x660 MW)',
    agency: 'NTPC Limited',
    ministry: 'Ministry of Power',
    sector: 'Power & Renewable',
    state: 'Jharkhand',
    sanctionDate: '25/04/2013',
    origCompDate: '31/03/2021',
    sanctionedCost: 14366.0,
    baseAntCost: 18950.0,
    baseExp: 14200.0,
    basePhys: 78.0,
    baseFin: 81.5,
    baseAntCompDate: '2026-08-31',
    impedimentCategory: 'STATUTORY_CLEARANCES',
    impedimentSummary: 'External water intake pipeline right-of-use approval pending district clearance',
    page: 63,
    section: 'Table 2.9: Central Power Generating Stations',
  },
  {
    canonicalId: 'PRJ-BMRCL-791',
    sourceCode: 'BMRCL/PH2A/ORR-SILK-KR',
    name: 'Bangalore Metro Phase-2A (ORR Line: Silk Board to KR Puram)',
    agency: 'Bangalore Metro Rail Corporation Limited (BMRCL)',
    ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
    sector: 'Railways & Metros',
    state: 'Karnataka',
    sanctionDate: '07/06/2021',
    origCompDate: '31/12/2024',
    sanctionedCost: 5994.0,
    baseAntCost: 6850.0,
    baseExp: 3100.0,
    basePhys: 44.0,
    baseFin: 49.0,
    baseAntCompDate: '2026-09-30',
    impedimentCategory: 'UTILITY_SHIFTING',
    impedimentSummary: 'High-tension underground power cabling and water pipeline shifting across 6 key junctions',
    page: 45,
    section: 'Table 2.5: Urban Metro Rail Networks',
  },
  {
    canonicalId: 'PRJ-POWER-303',
    sourceCode: 'PGCIL/GEC-II/RAJ-TRANS',
    name: 'Green Energy Corridor Inter-State Transmission Phase-II',
    agency: 'Power Grid Corporation of India Limited (POWERGRID)',
    ministry: 'Ministry of Power',
    sector: 'Power & Renewable',
    state: 'Rajasthan',
    sanctionDate: '12/01/2022',
    origCompDate: '31/03/2025',
    sanctionedCost: 4820.0,
    baseAntCost: 4950.0,
    baseExp: 3800.0,
    basePhys: 88.0,
    baseFin: 89.5,
    baseAntCompDate: '2025-11-30',
    impedimentCategory: 'NONE',
    impedimentSummary: 'Substation bays and 765 kV double-circuit tower foundations nearing completion',
    page: 69,
    section: 'Table 2.10: Inter-State Transmission Schemes',
  },
  {
    canonicalId: 'PRJ-IOCL-452',
    sourceCode: 'IOCL/PL/PRD-HYD-1212',
    name: 'Paradip–Hyderabad Petroleum Product Pipeline (1212 Km)',
    agency: 'Indian Oil Corporation Limited (IOCL)',
    ministry: 'Ministry of Petroleum and Natural Gas (MoPNG)',
    sector: 'Petroleum & Natural Gas',
    state: 'Odisha & Telangana',
    sanctionDate: '22/12/2017',
    origCompDate: '31/12/2023',
    sanctionedCost: 3338.0,
    baseAntCost: 3980.0,
    baseExp: 2650.0,
    basePhys: 72.0,
    baseFin: 74.0,
    baseAntCompDate: '2026-05-31',
    impedimentCategory: 'STATUTORY_CLEARANCES',
    impedimentSummary: 'River crossing horizontal directional drilling permissions under review by inland water authority',
    page: 78,
    section: 'Table 2.12: Cross-Country Pipeline Networks',
  },
  {
    canonicalId: 'PRJ-AAI-580',
    sourceCode: 'YIAPL/NOIDA-AIRPORT/PH1',
    name: 'Greenfield Airport Development: Jewar Noida (Phase-I)',
    agency: 'Yamuna International Airport Private Limited (YIAPL) / AAI',
    ministry: 'Ministry of Civil Aviation (MoCA)',
    sector: 'Civil Aviation',
    state: 'Uttar Pradesh',
    sanctionDate: '29/11/2019',
    origCompDate: '29/09/2024',
    sanctionedCost: 5730.0,
    baseAntCost: 6520.0,
    baseExp: 4200.0,
    basePhys: 76.0,
    baseFin: 78.5,
    baseAntCompDate: '2026-04-30',
    impedimentCategory: 'STATUTORY_CLEARANCES',
    impedimentSummary: 'Security vetting and calibration approvals for Cat-III ILS runway operations under progress',
    page: 84,
    section: 'Table 2.14: Civil Aviation Greenfield Projects',
  },
  {
    canonicalId: 'PRJ-NHAI-128',
    sourceCode: 'NHIDCL/JK/ZOJILA-TUNNEL-14K',
    name: 'Zojila Tunnel & Approaches (14.15 Km Road Tunnel)',
    agency: 'National Highways & Infrastructure Development Corporation (NHIDCL)',
    ministry: 'Ministry of Road Transport and Highways (MoRTH)',
    sector: 'Highways & Roads',
    state: 'Jammu & Kashmir / Ladakh',
    sanctionDate: '23/05/2018',
    origCompDate: '30/06/2026',
    sanctionedCost: 6808.0,
    baseAntCost: 7400.0,
    baseExp: 3300.0,
    basePhys: 48.0,
    baseFin: 51.0,
    baseAntCompDate: '2027-10-31',
    impedimentCategory: 'GEOLOGICAL',
    impedimentSummary: 'High-altitude sub-zero ingress water freezing and approach road avalanche protection works',
    page: 19,
    section: 'Table 2.1: National Highways Development Project Overview',
  },
];

MONTHS.forEach((m, mIdx) => {
  const records: any[] = [];

  // 1. Process standard 10 reference projects with longitudinal evolution
  BASE_PROJECTS.forEach((p, pIdx) => {
    const physIncrement = +(0.6 + (pIdx % 3) * 0.3).toFixed(2);
    const expIncrement = +(80 + (pIdx * 25)).toFixed(2);
    
    let antCompDate = p.baseAntCompDate;
    let antCost = p.baseAntCost;
    let status = 'DELAYED';

    if (p.canonicalId === 'PRJ-POWER-303') {
      status = mIdx >= 3 ? 'COMPLETED' : 'ON_SCHEDULE';
      antCompDate = '2025-11-30';
    } else if (p.canonicalId === 'PRJ-NHAI-842') {
      if (mIdx >= 4) {
        antCompDate = '2026-10-31';
        antCost = 11420.0;
      }
    } else if (p.canonicalId === 'PRJ-RVNL-319') {
      if (mIdx >= 4) {
        antCompDate = '2027-03-31';
        antCost = 21890.0;
      }
    }

    const currentPhys = Math.min(100.0, +(p.basePhys + mIdx * physIncrement).toFixed(2));
    const currentExp = +(p.baseExp + mIdx * expIncrement).toFixed(2);
    const currentFin = Math.min(100.0, +(currentExp / antCost * 100).toFixed(2));

    records.push({
      source_page: p.page,
      source_section: p.section,
      source_project_code: p.sourceCode,
      source_status: 'TEST_FIXTURE',
      project_name: p.name,
      implementing_agency: p.agency,
      ministry: p.ministry,
      sector: p.sector,
      state: p.state,
      sanction_date: p.sanctionDate,
      original_completion_date: p.origCompDate,
      anticipated_completion_date: antCompDate,
      sanctioned_cost: p.sanctionedCost.toFixed(2),
      anticipated_cost: antCost.toFixed(2),
      cumulative_expenditure: currentExp.toFixed(2),
      physical_progress: `${currentPhys}%`,
      financial_progress: `${currentFin}%`,
      project_status: status,
      primary_impediment_category: p.impedimentCategory,
      primary_impediment_summary: p.impedimentSummary,
      provenance: '[SIMULATED]',
      source_field_ref: `TEST_FIXTURE_M${mIdx + 1}_REC_${pIdx + 1}`
    });
  });

  // 2. EDGE CASE: Project with Missing Code in later months
  records.push({
    source_page: 38,
    source_section: 'Table 2.4: Dedicated Freight Corridor Lines',
    source_project_code: mIdx < 3 ? 'DFCC/WDFC/REW-MAD-306' : null,
    source_status: 'TEST_FIXTURE',
    project_name: 'Western Dedicated Freight Corridor: Rewari–Madar Section (306 Km)',
    implementing_agency: 'Dedicated Freight Corridor Corporation of India (DFCCIL)',
    ministry: 'Ministry of Railways (MoR)',
    sector: 'Railways & Metros',
    state: 'Haryana & Rajasthan',
    sanctionDate: '05/03/2014',
    original_completion_date: '31/12/2021',
    anticipated_completion_date: '2026-06-30',
    sanctioned_cost: '5420.00',
    anticipated_cost: '6180.00',
    cumulative_expenditure: (3800.0 + mIdx * 65.0).toFixed(2),
    physical_progress: `${(78.5 + mIdx * 0.8).toFixed(1)}%`,
    financial_progress: `${(65.0 + mIdx * 0.9).toFixed(1)}%`,
    project_status: 'DELAYED',
    primary_impediment_category: 'CONTRACTOR_CAPACITY',
    primary_impediment_summary: 'Overhead electrification contractor equipment mobilization constraints',
    provenance: '[SIMULATED]',
    source_field_ref: `TEST_FIXTURE_M${mIdx + 1}_WDFC_REW`
  });

  // 3. EDGE CASE: Legitimate Missing Value
  records.push({
    source_page: 92,
    source_section: 'Table 2.16: Pipeline Stage Approvals',
    source_project_code: 'NHPC/HYDRO/DIBANG-2880MW',
    source_status: 'TEST_FIXTURE',
    project_name: 'Dibang Multipurpose Hydroelectric Project (2880 MW)',
    implementing_agency: 'NHPC Limited',
    ministry: 'Ministry of Power',
    sector: 'Power & Renewable',
    state: 'Arunachal Pradesh',
    sanctionDate: '27/02/2023',
    original_completion_date: null,
    anticipated_completion_date: null,
    sanctioned_cost: '31876.00',
    anticipated_cost: '31876.00',
    cumulative_expenditure: (1240.0 + mIdx * 20.0).toFixed(2),
    physical_progress: `${(4.2 + mIdx * 0.2).toFixed(1)}%`,
    financial_progress: `${(3.8 + mIdx * 0.1).toFixed(1)}%`,
    project_status: 'ON_SCHEDULE',
    primary_impediment_category: 'LAND_ACQUISITION',
    primary_impediment_summary: 'Community land compensation verification in progress',
    provenance: '[SIMULATED]',
    source_field_ref: `TEST_FIXTURE_M${mIdx + 1}_DIBANG`
  });

  // 4. EDGE CASE: Explicit Zero Progress
  records.push({
    source_page: 95,
    source_section: 'Table 2.17: Newly Sanctioned Projects (Zero Initial Progress)',
    source_project_code: 'SECI/SOLAR/LEH-RE-5000MW',
    source_status: 'TEST_FIXTURE',
    project_name: 'Pang Ultra Mega Solar Power Project (5000 MW with BESS)',
    implementing_agency: 'Solar Energy Corporation of India (SECI)',
    ministry: 'Ministry of Power',
    sector: 'Power & Renewable',
    state: 'Ladakh',
    sanctionDate: '15/07/2025',
    original_completion_date: '31/12/2028',
    anticipated_completion_date: '2028-12-31',
    sanctioned_cost: '20500.00',
    anticipated_cost: '20500.00',
    cumulative_expenditure: '0.00',
    physical_progress: '0.0%',
    financial_progress: '0.0%',
    project_status: 'ON_SCHEDULE',
    primary_impediment_category: 'NONE',
    primary_impediment_summary: 'Initial geotechnical site reconnaissance and transmission alignment survey',
    provenance: '[SIMULATED]',
    source_field_ref: `TEST_FIXTURE_M${mIdx + 1}_PANG_SOLAR`
  });

  // 5. EDGE CASE: In November 2025 (month 3), injected contradiction test fixture
  if (mIdx === 3) {
    records.push({
      source_page: 99,
      source_section: 'Table 2.19: Field Inspection Exception Reporting',
      source_project_code: 'MRTS/DEL-MEERUT/RRTS-82K',
      source_status: 'TEST_FIXTURE',
      project_name: 'Delhi–Ghaziabad–Meerut Regional Rapid Transit System (82.15 Km)',
      implementing_agency: 'National Capital Region Transport Corporation (NCRTC)',
      ministry: 'Ministry of Housing and Urban Affairs (MoHUA)',
      sector: 'Railways & Metros',
      state: 'Delhi & Uttar Pradesh',
      sanctionDate: '07/03/2019',
      original_completion_date: '31/03/2025',
      anticipated_completion_date: '2018-05-31', // Injected contradiction fixture
      sanctioned_cost: '30274.00',
      anticipated_cost: '30274.00',
      cumulative_expenditure: '21500.00',
      physical_progress: '115.0%', // Injected contradiction fixture
      financial_progress: '71.0%',
      project_status: 'DELAYED',
      primary_impediment_category: 'UTILITY_SHIFTING',
      primary_impediment_summary: 'Injected contradiction validation test fixture',
      provenance: '[SIMULATED]',
      source_field_ref: 'TEST_FIXTURE_INJECTED_CONTRADICTION'
    });
  }

  // 6. EDGE CASE: Ambiguous Identity (Routes to Manual Review Queue)
  records.push({
    source_page: 102,
    source_section: 'Table 2.20: Sub-Package Renewable Allocations',
    source_project_code: null,
    source_status: 'TEST_FIXTURE',
    project_name: 'Floating Solar PV Installation Package-A',
    implementing_agency: 'NTPC REL',
    ministry: 'Ministry of Power',
    sector: 'Power & Renewable',
    state: 'Madhya Pradesh',
    sanctionDate: '10/01/2024',
    original_completion_date: '30/06/2025',
    anticipated_completion_date: '2025-12-31',
    sanctioned_cost: '450.00',
    anticipated_cost: '495.00',
    cumulative_expenditure: '210.00',
    physical_progress: '45.0%',
    financial_progress: '42.4%',
    project_status: 'DELAYED',
    primary_impediment_category: 'CONTRACTOR_CAPACITY',
    primary_impediment_summary: 'Mooring anchoring gear awaiting delivery',
    provenance: '[SIMULATED]',
    source_field_ref: `TEST_FIXTURE_M${mIdx + 1}_AMBIGUOUS_SOLAR`
  });

  const reportPayload = {
    report_id: m.reportId,
    month_name: m.monthName,
    canonical_month: m.reportMonth,
    report_cutoff_date: m.reportDate,
    publication_date: m.publicationDate,
    data_category: 'VALIDATION_TEST_FIXTURE',
    source_status: 'TEST_FIXTURE',
    credibility_notice: 'TEST FIXTURE ONLY: Synthetic demonstration data for pipeline validation. NOT extracted from official MoSPI PDF reports.',
    total_records_extracted: records.length,
    records: records,
  };

  const filename = `fixture_paimana_monthly_report_${m.reportMonth.substring(0, 7).replace('-', '_')}.json`;
  const filePath = path.join(FIXTURES_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(reportPayload, null, 2), 'utf-8');
  console.log(`Wrote test fixture report: ${filename} (${records.length} records)`);
});

console.log('Successfully generated 8 validation test fixture reports in data/raw/fixtures/.');
