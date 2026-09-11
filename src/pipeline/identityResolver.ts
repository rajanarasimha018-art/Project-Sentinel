/**
 * PAIMANA Stable Project Identity Resolver
 * Reference: SIH 2026 Problem Statement SIH26103
 * Canonical Data Contract: paimana_data_contract_aug2025_mar2026.yaml
 *
 * GOVERNANCE RULES:
 * NEVER use:
 * - PDF serial number
 * - row number
 * - page number
 * - month-local sequence
 *
 * PRIORITY ORDER:
 * Tier 1: Verified PAIMANA project code (exact match)
 * Tier 2: Normalized project name + implementing agency
 * Tier 3: Normalized project name + implementing agency + sector / state
 * Tier 4: Manual review queue for ambiguous or unconfident matches
 */

import type { RawPaimanaRecord, IdentityResolutionResult, UnresolvedIdentityItem } from './types.ts';

export interface CanonicalProjectDefinition {
  canonicalId: string;
  sourceCodes: string[];
  canonicalName: string;
  normalizedNameAliases: string[];
  agency: string;
  normalizedAgencyAliases: string[];
  sector: string;
  state: string;
}

// Canonical Registry of Known Projects
export const CANONICAL_PROJECT_REGISTRY: CanonicalProjectDefinition[] = [
  {
    canonicalId: 'PRJ-NHAI-842',
    sourceCodes: ['NHAI/MUM-VAD/EXP-PKG2', 'PRJ-NHAI-842'],
    canonicalName: 'Vadodara–Mumbai Expressway Phase-II (Km 26 to Km 89)',
    normalizedNameAliases: [
      'vadodara mumbai expressway phase ii km 26 to km 89',
      'vadodara mumbai expressway phase 2',
      'vadodara mumbai expressway pkg 2',
    ],
    agency: 'National Highways Authority of India (NHAI)',
    normalizedAgencyAliases: ['nhai', 'national highways authority of india'],
    sector: 'Highways & Roads',
    state: 'Maharashtra',
  },
  {
    canonicalId: 'PRJ-RVNL-319',
    sourceCodes: ['RVNL/NR/RK-RAIL-125', 'PRJ-RVNL-319'],
    canonicalName: 'Rishikesh–Karnaprayag New Broad Gauge Rail Link (125 Km)',
    normalizedNameAliases: [
      'rishikesh karnaprayag new broad gauge rail link 125 km',
      'rishikesh karnaprayag rail link',
      'rishikesh karanprayag rail project',
    ],
    agency: 'Rail Vikas Nigam Limited (RVNL)',
    normalizedAgencyAliases: ['rvnl', 'rail vikas nigam limited', 'rail vikas nigam ltd'],
    sector: 'Railways & Metros',
    state: 'Uttarakhand',
  },
  {
    canonicalId: 'PRJ-DFCC-104',
    sourceCodes: ['DFCC/EDFC/SON-DNK-538', 'PRJ-DFCC-104'],
    canonicalName: 'Eastern Dedicated Freight Corridor: Sonnagar–Dankuni (538 Km)',
    normalizedNameAliases: [
      'eastern dedicated freight corridor sonnagar dankuni 538 km',
      'edfc sonnagar dankuni section',
      'sonnagar dankuni freight corridor',
    ],
    agency: 'Dedicated Freight Corridor Corporation of India (DFCCIL)',
    normalizedAgencyAliases: ['dfccil', 'dfcc', 'dedicated freight corridor corporation of india'],
    sector: 'Railways & Metros',
    state: 'West Bengal & Bihar',
  },
  {
    canonicalId: 'PRJ-JNPA-215',
    sourceCodes: ['JNPA/BMCT-TERM4/PH2', 'PRJ-JNPA-215'],
    canonicalName: 'Jawaharlal Nehru Port Container Terminal-4 (Phase-II Expansion)',
    normalizedNameAliases: [
      'jawaharlal nehru port container terminal 4 phase ii expansion',
      'jnpa container terminal 4 phase 2',
      'bmct terminal 4 phase 2',
    ],
    agency: 'Jawaharlal Nehru Port Authority (JNPA)',
    normalizedAgencyAliases: ['jnpa', 'jnpt', 'jawaharlal nehru port authority'],
    sector: 'Ports & Shipping',
    state: 'Maharashtra',
  },
  {
    canonicalId: 'PRJ-NTPC-608',
    sourceCodes: ['NTPC/EAST/NK-STPP-3X660', 'PRJ-NTPC-608'],
    canonicalName: 'North Karanpura Super Thermal Power Project (3x660 MW)',
    normalizedNameAliases: [
      'north karanpura super thermal power project 3x660 mw',
      'north karanpura stpp',
      'ntpc north karanpura thermal power',
    ],
    agency: 'NTPC Limited',
    normalizedAgencyAliases: ['ntpc', 'ntpc limited', 'ntpc ltd'],
    sector: 'Power & Renewable',
    state: 'Jharkhand',
  },
  {
    canonicalId: 'PRJ-BMRCL-791',
    sourceCodes: ['BMRCL/PH2A/ORR-SILK-KR', 'PRJ-BMRCL-791'],
    canonicalName: 'Bangalore Metro Phase-2A (ORR Line: Silk Board to KR Puram)',
    normalizedNameAliases: [
      'bangalore metro phase 2a orr line silk board to kr puram',
      'bmrcl phase 2a outer ring road line',
      'bangalore metro orr silk board kr puram',
    ],
    agency: 'Bangalore Metro Rail Corporation Limited (BMRCL)',
    normalizedAgencyAliases: ['bmrcl', 'bangalore metro rail corporation limited', 'bangalore metro'],
    sector: 'Railways & Metros',
    state: 'Karnataka',
  },
  {
    canonicalId: 'PRJ-POWER-303',
    sourceCodes: ['PGCIL/GEC-II/RAJ-TRANS', 'PRJ-POWER-303'],
    canonicalName: 'Green Energy Corridor Inter-State Transmission Phase-II',
    normalizedNameAliases: [
      'green energy corridor inter state transmission phase ii',
      'gec phase 2 rajasthan transmission',
      'powergrid green energy corridor 2',
    ],
    agency: 'Power Grid Corporation of India Limited (POWERGRID)',
    normalizedAgencyAliases: ['powergrid', 'pgcil', 'power grid corporation of india limited'],
    sector: 'Power & Renewable',
    state: 'Rajasthan',
  },
  {
    canonicalId: 'PRJ-IOCL-452',
    sourceCodes: ['IOCL/PL/PRD-HYD-1212', 'PRJ-IOCL-452'],
    canonicalName: 'Paradip–Hyderabad Petroleum Product Pipeline (1212 Km)',
    normalizedNameAliases: [
      'paradip hyderabad petroleum product pipeline 1212 km',
      'paradip hyderabad product pipeline',
      'iocl paradip hyderabad pipeline 1212km',
    ],
    agency: 'Indian Oil Corporation Limited (IOCL)',
    normalizedAgencyAliases: ['iocl', 'indian oil', 'indian oil corporation limited'],
    sector: 'Petroleum & Natural Gas',
    state: 'Odisha & Telangana',
  },
  {
    canonicalId: 'PRJ-AAI-580',
    sourceCodes: ['YIAPL/NOIDA-AIRPORT/PH1', 'PRJ-AAI-580'],
    canonicalName: 'Greenfield Airport Development: Jewar Noida (Phase-I)',
    normalizedNameAliases: [
      'greenfield airport development jewar noida phase i',
      'jewar noida international airport phase 1',
      'noida greenfield airport jewar',
    ],
    agency: 'Yamuna International Airport Private Limited (YIAPL) / AAI',
    normalizedAgencyAliases: ['yiapl', 'aai', 'yamuna international airport', 'airports authority of india'],
    sector: 'Civil Aviation',
    state: 'Uttar Pradesh',
  },
  {
    canonicalId: 'PRJ-NHAI-128',
    sourceCodes: ['NHIDCL/JK/ZOJILA-TUNNEL-14K', 'PRJ-NHAI-128'],
    canonicalName: 'Zojila Tunnel & Approaches (14.15 Km Road Tunnel)',
    normalizedNameAliases: [
      'zojila tunnel approaches 14 15 km road tunnel',
      'zojila tunnel 14 km road tunnel',
      'nhidcl zojila pass tunnel',
    ],
    agency: 'National Highways & Infrastructure Development Corporation (NHIDCL)',
    normalizedAgencyAliases: ['nhidcl', 'national highways and infrastructure development corporation'],
    sector: 'Highways & Roads',
    state: 'Jammu & Kashmir / Ladakh',
  },
  {
    canonicalId: 'PRJ-DFCC-306',
    sourceCodes: ['DFCC/WDFC/REW-MAD-306'],
    canonicalName: 'Western Dedicated Freight Corridor: Rewari–Madar Section (306 Km)',
    normalizedNameAliases: [
      'western dedicated freight corridor rewari madar section 306 km',
      'wdfc rewari madar section',
      'rewari madar freight corridor',
    ],
    agency: 'Dedicated Freight Corridor Corporation of India (DFCCIL)',
    normalizedAgencyAliases: ['dfccil', 'dfcc', 'dedicated freight corridor corporation of india'],
    sector: 'Railways & Metros',
    state: 'Haryana & Rajasthan',
  },
  {
    canonicalId: 'PRJ-NHPC-2880',
    sourceCodes: ['NHPC/HYDRO/DIBANG-2880MW'],
    canonicalName: 'Dibang Multipurpose Hydroelectric Project (2880 MW)',
    normalizedNameAliases: [
      'dibang multipurpose hydroelectric project 2880 mw',
      'dibang hydro electric project',
      'nhpc dibang multipurpose',
    ],
    agency: 'NHPC Limited',
    normalizedAgencyAliases: ['nhpc', 'nhpc limited', 'nhpc ltd'],
    sector: 'Power & Renewable',
    state: 'Arunachal Pradesh',
  },
  {
    canonicalId: 'PRJ-SECI-5000',
    sourceCodes: ['SECI/SOLAR/LEH-RE-5000MW'],
    canonicalName: 'Pang Ultra Mega Solar Power Project (5000 MW with BESS)',
    normalizedNameAliases: [
      'pang ultra mega solar power project 5000 mw with bess',
      'pang solar power project ladakh',
      'seci pang leh solar project',
    ],
    agency: 'Solar Energy Corporation of India (SECI)',
    normalizedAgencyAliases: ['seci', 'solar energy corporation of india'],
    sector: 'Power & Renewable',
    state: 'Ladakh',
  },
  {
    canonicalId: 'PRJ-NCRTC-82',
    sourceCodes: ['MRTS/DEL-MEERUT/RRTS-82K'],
    canonicalName: 'Delhi–Ghaziabad–Meerut Regional Rapid Transit System (82.15 Km)',
    normalizedNameAliases: [
      'delhi ghaziabad meerut regional rapid transit system 82 15 km',
      'delhi meerut rrts',
      'ncrtc delhi ghaziabad meerut',
    ],
    agency: 'National Capital Region Transport Corporation (NCRTC)',
    normalizedAgencyAliases: ['ncrtc', 'national capital region transport corporation'],
    sector: 'Railways & Metros',
    state: 'Delhi & Uttar Pradesh',
  },
];

/**
 * Standardize text for robust comparison
 */
function cleanText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractAgencyAcronym(agencyStr: string): string {
  if (!agencyStr) return 'MOSPI';
  const bracketMatch = agencyStr.match(/\[([A-Za-z0-9\-_]+)\]/);
  if (bracketMatch) {
    const code = bracketMatch[1].replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (code) return code;
  }
  const parenMatch = agencyStr.match(/\(([A-Za-z0-9\-_]+)\)/);
  if (parenMatch) {
    const code = parenMatch[1].replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (code) return code;
  }
  const upperWords = agencyStr.match(/\b[A-Z0-9]{2,8}\b/g);
  if (upperWords && upperWords.length > 0) {
    return upperWords[0];
  }
  const initials = agencyStr
    .split(/\s+/)
    .filter((w) => w.length > 0 && /^[A-Za-z0-9]/.test(w))
    .map((w) => w[0].toUpperCase())
    .join('')
    .slice(0, 6);
  return initials || 'MOSPI';
}

/**
 * Resolves a raw report observation to a canonical project identity.
 * Strictly enforces hierarchy and refuses sequence numbers.
 */
export function resolveProjectIdentity(
  raw: RawPaimanaRecord,
  sourceReport: string,
  recordIndex: number
): { result: IdentityResolutionResult; canonicalDef: CanonicalProjectDefinition | null } {
  const rawCode = raw.source_project_code ? raw.source_project_code.trim() : null;
  const rawName = raw.project_name ? raw.project_name.trim() : '';
  const rawAgency = raw.implementing_agency ? raw.implementing_agency.trim() : '';
  const cleanedName = cleanText(rawName);
  const cleanedAgency = cleanText(rawAgency);

  // --------------------------------------------------------------------------
  // TIER 1A: Exact Verified Registry Match (Fixtures / Static Registry)
  // --------------------------------------------------------------------------
  if (rawCode) {
    const codeMatch = CANONICAL_PROJECT_REGISTRY.find((def) =>
      def.sourceCodes.some((sc) => sc.toUpperCase() === rawCode.toUpperCase()) ||
      def.canonicalId.toUpperCase() === rawCode.toUpperCase()
    );

    if (codeMatch) {
      return {
        result: {
          recordIndex,
          sourceReport,
          sourceProjectCode: rawCode,
          sourceProjectName: rawName,
          sourceAgency: rawAgency,
          resolvedCanonicalId: codeMatch.canonicalId,
          resolutionTier: 'TIER_1_EXACT_CODE',
          confidenceScore: 1.0,
          notes: `Exact verified source code match [${rawCode}] -> ${codeMatch.canonicalId}`,
        },
        canonicalDef: codeMatch,
      };
    }

    // --------------------------------------------------------------------------
    // TIER 1B: Authentic MoSPI PAIMANA Source Project Code Resolution
    // Never collapse distinct authentic projects with official codes into fixture projects
    // --------------------------------------------------------------------------
    if (/^\d{5,7}$/.test(rawCode)) {
      const agencyCode = extractAgencyAcronym(rawAgency);
      const canonicalId = `PRJ-${agencyCode}-${rawCode}`;
      if (/^PRJ-[A-Z0-9]+-[0-9A-Z]+$/.test(canonicalId)) {
        const generatedDef: CanonicalProjectDefinition = {
          canonicalId,
          sourceCodes: [rawCode],
          canonicalName: rawName,
          normalizedNameAliases: [cleanedName],
          agency: rawAgency,
          normalizedAgencyAliases: [cleanedAgency],
          sector: raw.sector || 'Infrastructure',
          state: raw.state || 'India',
        };
        return {
          result: {
            recordIndex,
            sourceReport,
            sourceProjectCode: rawCode,
            sourceProjectName: rawName,
            sourceAgency: rawAgency,
            resolvedCanonicalId: canonicalId,
            resolutionTier: 'TIER_1_EXACT_CODE',
            confidenceScore: 1.0,
            notes: `Exact verified MoSPI source code match [${rawCode}] -> ${canonicalId}`,
          },
          canonicalDef: generatedDef,
        };
      }
    }
  }

  // --------------------------------------------------------------------------
  // TIER 2: Normalized Project Name + Implementing Agency Match
  // --------------------------------------------------------------------------
  if (cleanedName && cleanedAgency) {
    const nameAgencyMatches = CANONICAL_PROJECT_REGISTRY.filter((def) => {
      const agencyMatches = def.normalizedAgencyAliases.some((alias) =>
        cleanedAgency.includes(alias) || alias.includes(cleanedAgency)
      );
      if (!agencyMatches) return false;

      const nameMatches = def.normalizedNameAliases.some((alias) => {
        const cleanedAlias = cleanText(alias);
        return cleanedName.includes(cleanedAlias) || cleanedAlias.includes(cleanedName);
      });

      return nameMatches;
    });

    if (nameAgencyMatches.length === 1) {
      const match = nameAgencyMatches[0];
      return {
        result: {
          recordIndex,
          sourceReport,
          sourceProjectCode: rawCode,
          sourceProjectName: rawName,
          sourceAgency: rawAgency,
          resolvedCanonicalId: match.canonicalId,
          resolutionTier: 'TIER_2_NAME_AGENCY',
          confidenceScore: 0.95,
          notes: `Resolved via Tier-2 Name + Agency match (Code absent/unmatched) -> ${match.canonicalId}`,
        },
        canonicalDef: match,
      };
    }
  }

  // --------------------------------------------------------------------------
  // TIER 3: Composite Name + Agency + Sector / Location Match
  // --------------------------------------------------------------------------
  const compositeMatches = CANONICAL_PROJECT_REGISTRY.filter((def) => {
    const agencyMatches = def.normalizedAgencyAliases.some((alias) =>
      cleanedAgency.includes(alias) || alias.includes(cleanedAgency)
    );
    if (!agencyMatches) return false;

    const sectorMatch = def.sector.toLowerCase() === (raw.sector || '').toLowerCase();
    const stateMatch = def.state.toLowerCase().includes((raw.state || '').toLowerCase());
    if (!sectorMatch && !stateMatch) return false;

    const nameKeywords = cleanedName.split(' ').filter((w) => w.length > 3);
    const sharedKeywordsCount = def.normalizedNameAliases.reduce((maxCount, alias) => {
      const count = nameKeywords.filter((kw) => alias.includes(kw)).length;
      return Math.max(maxCount, count);
    }, 0);

    return sharedKeywordsCount >= 2;
  });

  if (compositeMatches.length === 1) {
    const match = compositeMatches[0];
    return {
      result: {
        recordIndex,
        sourceReport,
        sourceProjectCode: rawCode,
        sourceProjectName: rawName,
        sourceAgency: rawAgency,
        resolvedCanonicalId: match.canonicalId,
        resolutionTier: 'TIER_3_COMPOSITE',
        confidenceScore: 0.88,
        notes: `Resolved via Tier-3 Composite Sector/State context -> ${match.canonicalId}`,
      },
      canonicalDef: match,
    };
  }

  // --------------------------------------------------------------------------
  // TIER 4: Manual Review Queue for Ambiguous or Unresolved Entities
  // --------------------------------------------------------------------------
  return {
    result: {
      recordIndex,
      sourceReport,
      sourceProjectCode: rawCode,
      sourceProjectName: rawName,
      sourceAgency: rawAgency,
      resolvedCanonicalId: null,
      resolutionTier: 'UNRESOLVED_MANUAL_REVIEW',
      confidenceScore: 0.0,
      notes: `Ambiguous entity: multiple candidates or insufficient distinctiveness for auto-resolution`,
    },
    canonicalDef: null,
  };
}
