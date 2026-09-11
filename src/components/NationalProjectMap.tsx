import React, { useState } from 'react';
import { AttentionQueueItem } from '../types/sentinel';
import { MapPin, ExternalLink, ShieldAlert, Layers } from 'lucide-react';

interface NationalProjectMapProps {
  items: AttentionQueueItem[];
  selectedItem: AttentionQueueItem | null;
  onSelectProject: (item: AttentionQueueItem) => void;
}

export const NationalProjectMap: React.FC<NationalProjectMapProps> = ({
  items,
  selectedItem,
  onSelectProject,
}) => {
  const [hoveredProject, setHoveredProject] = useState<AttentionQueueItem | null>(null);
  const [activeSectorFilter, setActiveSectorFilter] = useState<string>('ALL');

  const mapWidth = 560;
  const mapHeight = 500;

  // Calibrated geographic Mercator projection for India bounding box [68.0°E to 97.5°E, 8.0°N to 37.5°N]
  const projectToMap = (lat: number, lng: number): [number, number] => {
    const minLng = 68.0;
    const maxLng = 97.5;
    const minLat = 8.0;
    const maxLat = 37.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 100) + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (mapHeight - 90) + 45;

    return [x, y];
  };

  const filteredProjects = activeSectorFilter === 'ALL'
    ? items
    : items.filter((i) => i.project.sector === activeSectorFilter);

  // Derive risk state according to Milestone 6 specification
  const getRiskStateCategory = (item: AttentionQueueItem): 'HIGH_INCREASING' | 'MEDIUM_STABLE' | 'LOW_DECREASING' | 'INSUFFICIENT' => {
    if (item.project.dataQuality === 'INSUFFICIENT') return 'INSUFFICIENT';
    if (item.riskLevel === 'CRITICAL' || (item.riskLevel === 'HIGH' && (item.trend === 'INCREASING' || item.trend === 'INCREASING_FAST'))) {
      return 'HIGH_INCREASING';
    }
    if (item.riskLevel === 'MEDIUM' || (item.riskLevel === 'HIGH' && item.trend === 'STABLE')) {
      return 'MEDIUM_STABLE';
    }
    return 'LOW_DECREASING';
  };

  const getMarkerColor = (state: 'HIGH_INCREASING' | 'MEDIUM_STABLE' | 'LOW_DECREASING' | 'INSUFFICIENT') => {
    switch (state) {
      case 'HIGH_INCREASING':
        return '#dc2626'; // High/Critical red
      case 'MEDIUM_STABLE':
        return '#d97706'; // Medium amber
      case 'LOW_DECREASING':
        return '#16a34a'; // Low green
      case 'INSUFFICIENT':
      default:
        return '#64748b'; // Insufficient slate
    }
  };

  // Counts for exact legend
  const highIncreasingCount = items.filter((i) => getRiskStateCategory(i) === 'HIGH_INCREASING').length;
  const mediumStableCount = items.filter((i) => getRiskStateCategory(i) === 'MEDIUM_STABLE').length;
  const lowDecreasingCount = items.filter((i) => getRiskStateCategory(i) === 'LOW_DECREASING').length;
  const insufficientCount = items.filter((i) => getRiskStateCategory(i) === 'INSUFFICIENT').length;

  return (
    <div className="operational-panel" style={{ height: '100%' }}>
      {/* Panel Header */}
      <div className="panel-header" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-hairline)' }}>
        <div className="panel-title-group">
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em' }}>
            <MapPin size={15} style={{ color: 'var(--admin-blue-800)' }} />
            <span>NATIONAL INFRASTRUCTURE RISK MAP</span>
          </div>
          <div className="panel-subtitle" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Portfolio location context for projects requiring attention • Purpose: “Where are projects requiring attention?”
          </div>
        </div>

        <div className="panel-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            className="filter-select"
            value={activeSectorFilter}
            onChange={(e) => setActiveSectorFilter(e.target.value)}
            style={{ fontSize: '11px', padding: '3px 8px', border: '1px solid var(--border-medium)', borderRadius: '2px', backgroundColor: '#ffffff' }}
          >
            <option value="ALL">All Sectors ({items.length})</option>
            <option value="Highways & Roads">Highways & Roads</option>
            <option value="Railways & Metros">Railways & Metros</option>
            <option value="Power & Renewable">Power & Renewable</option>
            <option value="Ports & Shipping">Ports & Shipping</option>
            <option value="Petroleum & Natural Gas">Petroleum & Gas</option>
            <option value="Civil Aviation">Civil Aviation</option>
          </select>
        </div>
      </div>

      <div className="panel-body" style={{ position: 'relative', padding: '12px 16px' }}>
        {/* Sub-bar with Provenance & Precision Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '10.5px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              padding: '2px 6px', 
              borderRadius: '2px', 
              backgroundColor: '#eff6ff', 
              color: '#1e40af', 
              fontWeight: 600, 
              border: '1px solid #bfdbfe' 
            }}>
              [SOURCE] Project location / PAIMANA reference data
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              LOCATION PRECISION: REGIONAL REFERENCE
            </span>
          </div>

          <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
            10 Loaded Portfolio Assets
          </div>
        </div>

        {/* SVG Map Container */}
        <div style={{ 
          width: '100%', 
          backgroundColor: '#fbfcfd', 
          border: '1px solid var(--border-hairline)', 
          borderRadius: '3px', 
          position: 'relative',
          overflow: 'hidden'
        }}>
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {/* Coordinate Grid Guidelines */}
            <g stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3">
              <line x1="40" y1="120" x2="520" y2="120" />
              <line x1="40" y1="240" x2="520" y2="240" />
              <line x1="40" y1="360" x2="520" y2="360" />
              <line x1="160" y1="20" x2="160" y2="480" />
              <line x1="280" y1="20" x2="280" y2="480" />
              <line x1="400" y1="20" x2="400" y2="480" />
            </g>

            {/* Recognizable Cartographic Geographic Outline of India */}
            <path
              d="
                M 175 42
                C 185 32, 210 32, 220 50
                C 230 62, 240 72, 245 90
                C 250 108, 280 120, 310 130
                C 335 138, 375 146, 410 148
                C 440 150, 480 156, 500 170
                C 518 180, 522 196, 510 208
                C 492 218, 465 212, 448 224
                C 425 234, 400 224, 388 240
                C 376 256, 370 282, 352 304
                C 335 326, 312 360, 290 392
                C 272 420, 255 450, 242 472
                C 232 455, 220 422, 210 390
                C 192 342, 175 310, 152 288
                C 135 272, 118 264, 90 260
                C 68 256, 62 238, 78 228
                C 95 216, 112 206, 118 190
                C 125 168, 130 152, 142 126
                C 152 100, 162 68, 175 42
                Z
              "
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />

            {/* Regional Corridors (Restrained Cartographic Reference) */}
            <path
              d="M 140 272 Q 235 285 352 304"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            <path
              d="M 245 90 Q 315 190 388 240"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {/* Western & Eastern Freight Corridors (Reference Lines) */}
            <path
              d="M 205 145 L 160 268 L 152 295"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            >
              <title>Western Dedicated Freight Corridor (WDFC)</title>
            </path>
            <path
              d="M 210 150 L 310 215 L 378 248"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            >
              <title>Eastern Dedicated Freight Corridor (EDFC)</title>
            </path>

            {/* Regional Geographic Labels */}
            <text x="180" y="70" fontSize="8.5" fill="#94a3b8" fontFamily="var(--font-mono)">NORTHERN HIMALAYAN</text>
            <text x="85" y="250" fontSize="8.5" fill="#94a3b8" fontFamily="var(--font-mono)">WESTERN CORRIDOR</text>
            <text x="370" y="230" fontSize="8.5" fill="#94a3b8" fontFamily="var(--font-mono)">EASTERN INDUSTRIAL</text>
            <text x="240" y="385" fontSize="8.5" fill="#94a3b8" fontFamily="var(--font-mono)">SOUTHERN PENINSULA</text>

            {/* Interactive Project Markers */}
            {filteredProjects.map((item) => {
              const [cx, cy] = projectToMap(item.project.coordinates[0], item.project.coordinates[1]);
              const isSelected = selectedItem?.project.id === item.project.id;
              const isHovered = hoveredProject?.project.id === item.project.id;
              const riskCategory = getRiskStateCategory(item);
              const markerColor = getMarkerColor(riskCategory);

              return (
                <g
                  key={item.project.id}
                  onClick={() => onSelectProject(item)}
                  onMouseEnter={() => setHoveredProject(item)}
                  onMouseLeave={() => setHoveredProject(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Subtle Pulse Halo for High / Increasing Risk Markers */}
                  {riskCategory === 'HIGH_INCREASING' && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected || isHovered ? 14 : 10}
                      fill="none"
                      stroke={markerColor}
                      strokeWidth="1.2"
                      opacity="0.35"
                    />
                  )}

                  {/* Active Selection Ring */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="14"
                      fill="none"
                      stroke="var(--admin-blue-800)"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Primary Node Pin */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6.5 : isHovered ? 6 : 4.5}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Project Code Label */}
                  <text
                    x={cx + 8}
                    y={cy + 3.5}
                    fontSize="9"
                    fontWeight={isSelected ? '700' : '600'}
                    fill={isSelected ? 'var(--admin-blue-900)' : '#334155'}
                    fontFamily="var(--font-mono)"
                  >
                    {item.project.code.replace('PRJ-', '')}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover / Selected Project Card */}
          {hoveredProject && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid var(--border-medium)',
                borderRadius: '3px',
                padding: '10px 14px',
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 25,
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--admin-blue-900)' }}>
                    {hoveredProject.project.code}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {hoveredProject.project.name}
                  </span>
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span>State/Region: <strong>{hoveredProject.project.state} ({hoveredProject.project.region})</strong></span>
                  <span>Sector: <strong>{hoveredProject.project.sector}</strong></span>
                  <span>Status: <strong>Physical {hoveredProject.project.physicalProgressPct}%</strong></span>
                  <span>Last Source Update: <strong>{hoveredProject.project.lastReportingPeriod}</strong></span>
                </div>
                <div style={{ fontSize: '9.5px', color: '#1e40af', marginTop: '3px' }}>
                  [SOURCE] MoSPI PAIMANA Reference Data • LOCATION PRECISION: REGIONAL REFERENCE
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '2px',
                      backgroundColor: getMarkerColor(getRiskStateCategory(hoveredProject)),
                      color: '#ffffff',
                    }}
                  >
                    {(hoveredProject.riskScore * 100).toFixed(0)}/100 {hoveredProject.riskLevel}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {hoveredProject.trend}
                  </span>
                </div>
                <button
                  onClick={() => onSelectProject(hoveredProject)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--admin-blue-800)',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '2px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                  }}
                >
                  <span>Inspect Project Intelligence</span>
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Exact Legend & Risk State Definitions */}
        <div style={{ 
          marginTop: '12px', 
          padding: '10px 12px', 
          backgroundColor: '#f8fafc', 
          border: '1px solid var(--border-hairline)', 
          borderRadius: '2px' 
        }}>
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={12} />
            <span>PORTFOLIO RISK STATES &amp; LEGEND</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', fontSize: '10.5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#dc2626', flexShrink: 0 }}></span>
              <span><strong>HIGH / INCREASING</strong> ({highIncreasingCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d97706', flexShrink: 0 }}></span>
              <span><strong>MEDIUM / STABLE</strong> ({mediumStableCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16a34a', flexShrink: 0 }}></span>
              <span><strong>LOW / DECREASING</strong> ({lowDecreasingCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#64748b', flexShrink: 0 }}></span>
              <span><strong>INSUFFICIENT DATA</strong> ({insufficientCount})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
