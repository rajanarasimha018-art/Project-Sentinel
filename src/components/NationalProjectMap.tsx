import React, { useState } from 'react';
import { AttentionQueueItem } from '../types/sentinel';
import { Compass } from 'lucide-react';

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

  const mapWidth = 520;
  const mapHeight = 470;

  // Accurate Mercator projection mapping calibrated for India's bounding box [68.0°E to 97.5°E, 8.0°N to 37.5°N]
  const projectToMap = (lat: number, lng: number): [number, number] => {
    const minLng = 68.0;
    const maxLng = 97.5;
    const minLat = 8.0;
    const maxLat = 37.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 90) + 45;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (mapHeight - 80) + 35;

    return [x, y];
  };

  const filteredProjects = activeSectorFilter === 'ALL' 
    ? items 
    : items.filter(i => i.project.sector === activeSectorFilter);

  const getMarkerColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'var(--risk-critical-bar)';
      case 'HIGH': return 'var(--risk-high-bar)';
      case 'MEDIUM': return 'var(--risk-medium-bar)';
      case 'LOW': return 'var(--risk-low-bar)';
      default: return 'var(--risk-insufficient-bar)';
    }
  };

  return (
    <div className="operational-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <Compass size={15} style={{ color: 'var(--admin-blue-800)' }} />
            <span>NATIONAL INFRASTRUCTURE SPATIAL DISPERSION</span>
          </div>
          <div className="panel-subtitle">
            Geographic location of 10 loaded reference projects across major corridors
          </div>
        </div>

        <div className="panel-actions">
          <select 
            className="filter-select"
            value={activeSectorFilter}
            onChange={(e) => setActiveSectorFilter(e.target.value)}
            style={{ fontSize: '11px', padding: '3px 6px' }}
          >
            <option value="ALL">All Sectors</option>
            <option value="Highways & Roads">Highways</option>
            <option value="Railways & Metros">Railways</option>
            <option value="Power & Renewable">Power</option>
            <option value="Ports & Shipping">Ports</option>
          </select>
        </div>
      </div>

      <div className="panel-body" style={{ position: 'relative', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Supporting Context Layer • National Corridor Geometry
          </span>
          <div style={{ display: 'flex', gap: '10px', fontSize: '10px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-critical-bar)' }}></span>
              Critical (2)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-high-bar)' }}></span>
              High (4)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-medium-bar)' }}></span>
              Med/Low (4)
            </span>
          </div>
        </div>

        {/* SVG Map Container */}
        <div style={{ width: '100%', backgroundColor: '#fcfdfd', border: '1px solid var(--border-hairline)', borderRadius: '2px', position: 'relative' }}>
          <svg 
            viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {/* Coordinate Grid Guidelines */}
            <g stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3">
              <line x1="40" y1="120" x2="480" y2="120" />
              <line x1="40" y1="240" x2="480" y2="240" />
              <line x1="40" y1="360" x2="480" y2="360" />
              <line x1="160" y1="20" x2="160" y2="440" />
              <line x1="280" y1="20" x2="280" y2="440" />
              <line x1="400" y1="20" x2="400" y2="440" />
            </g>

            {/* Recognizable Geographic Outline of India */}
            <path
              d="
                M 152 40
                C 160 30, 185 30, 195 48
                C 205 60, 215 70, 220 88
                C 225 105, 250 115, 275 125
                C 295 132, 330 140, 360 142
                C 385 144, 420 148, 440 160
                C 455 170, 460 185, 450 195
                C 435 205, 410 200, 395 210
                C 375 220, 355 210, 345 225
                C 335 240, 330 265, 315 285
                C 300 305, 280 335, 260 365
                C 245 390, 230 420, 218 440
                C 210 425, 200 395, 190 365
                C 175 320, 160 290, 140 270
                C 125 255, 110 248, 85 245
                C 65 242, 60 225, 75 215
                C 90 205, 105 195, 110 180
                C 115 160, 120 145, 130 120
                C 138 95, 142 65, 152 40
                Z
              "
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />

            {/* Regional State Separation Lines (Restrained Cartographic Reference) */}
            {/* North-South separation */}
            <path
              d="M 125 255 Q 210 265 315 285"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            {/* Eastern Corridor line */}
            <path
              d="M 220 88 Q 280 180 345 225"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="2,2"
            />

            {/* Multi-modal Freight & Highway Corridors */}
            <path
              d="M 180 135 L 140 250 L 135 275"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            >
              <title>Western Dedicated Freight Corridor (WDFC)</title>
            </path>
            <path
              d="M 185 140 L 275 200 L 335 230"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            >
              <title>Eastern Dedicated Freight Corridor (EDFC)</title>
            </path>

            {/* Regional Geographical Labels */}
            <text x="160" y="65" fontSize="8" fill="#94a3b8" fontFamily="var(--font-mono)">NORTHERN HIMALAYAN</text>
            <text x="75" y="235" fontSize="8" fill="#94a3b8" fontFamily="var(--font-mono)">WESTERN CORRIDOR</text>
            <text x="330" y="215" fontSize="8" fill="#94a3b8" fontFamily="var(--font-mono)">EASTERN INDUSTRIAL</text>
            <text x="215" y="360" fontSize="8" fill="#94a3b8" fontFamily="var(--font-mono)">SOUTHERN PENINSULA</text>

            {/* Interactive Project Pins */}
            {filteredProjects.map((item) => {
              const [cx, cy] = projectToMap(item.project.coordinates[0], item.project.coordinates[1]);
              const isSelected = selectedItem?.project.id === item.project.id;
              const isHovered = hoveredProject?.project.id === item.project.id;
              const markerColor = getMarkerColor(item.riskLevel);

              return (
                <g 
                  key={item.project.id}
                  onClick={() => onSelectProject(item)}
                  onMouseEnter={() => setHoveredProject(item)}
                  onMouseLeave={() => setHoveredProject(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer pulse for Critical items */}
                  {item.riskLevel === 'CRITICAL' && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected || isHovered ? 12 : 9}
                      fill="none"
                      stroke={markerColor}
                      strokeWidth="1"
                      opacity="0.4"
                    />
                  )}

                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="13"
                      fill="none"
                      stroke="var(--admin-blue-800)"
                      strokeWidth="2"
                    />
                  )}

                  {/* Node Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6 : isHovered ? 5.5 : 4}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Project Code Label */}
                  <text
                    x={cx + 7}
                    y={cy + 3}
                    fontSize="8.5"
                    fontWeight={isSelected ? '700' : '500'}
                    fill={isSelected ? 'var(--admin-blue-900)' : 'var(--text-secondary)'}
                    fontFamily="var(--font-mono)"
                  >
                    {item.project.code.replace('PRJ-', '')}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Card */}
          {hoveredProject && (
            <div 
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '1px solid var(--border-medium)',
                borderRadius: '2px',
                padding: '8px 12px',
                fontSize: '11px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 20
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {hoveredProject.project.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {hoveredProject.project.implementingAgency} • {hoveredProject.project.state} • Sanctioned: ₹{hoveredProject.project.sanctionedCostCr.toLocaleString()} Cr
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`risk-badge ${hoveredProject.riskLevel.toLowerCase()}`}>
                  {(hoveredProject.riskScore * 100).toFixed(0)}/100 {hoveredProject.riskLevel}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--admin-blue-700)', fontWeight: 600 }}>
                  Inspect &rarr;
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
