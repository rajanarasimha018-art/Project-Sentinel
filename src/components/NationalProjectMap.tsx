import React, { useState } from 'react';
import { AttentionQueueItem } from '../types/sentinel';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';

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

  // SVG dimensions for India Map projection
  // Coordinates mapping roughly: Lat (8°N to 37°N) -> Y, Lng (68°E to 97°E) -> X
  const mapWidth = 520;
  const mapHeight = 440;

  const projectToMap = (lat: number, lng: number): [number, number] => {
    // Mercator approximation tailored for India bounding box [68.0 to 97.0 Lng, 8.0 to 37.0 Lat]
    const minLng = 68.0;
    const maxLng = 97.5;
    const minLat = 8.0;
    const maxLat = 37.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * (mapWidth - 80) + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * (mapHeight - 70) + 30;

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
            Geographic concentration of high-priority &amp; escalated infrastructure assets
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
            Projection: Survey of India Engineering Reference Grid (Sub-Regional Corridors)
          </span>
          <div style={{ display: 'flex', gap: '10px', fontSize: '10px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-critical-bar)' }}></span>
              Critical
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-high-bar)' }}></span>
              High Risk
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-medium-bar)' }}></span>
              Medium
            </span>
          </div>
        </div>

        {/* SVG Map Container */}
        <div style={{ width: '100%', backgroundColor: '#fcfdfd', border: '1px solid var(--border-hairline)', borderRadius: '2px', position: 'relative' }}>
          <svg 
            viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            {/* Grid coordinates background lines */}
            <g stroke="#edf2f7" strokeWidth="0.75" strokeDasharray="4,4">
              <line x1="40" y1="120" x2="480" y2="120" />
              <line x1="40" y1="220" x2="480" y2="220" />
              <line x1="40" y1="320" x2="480" y2="320" />
              <line x1="140" y1="20" x2="140" y2="420" />
              <line x1="240" y1="20" x2="240" y2="420" />
              <line x1="340" y1="20" x2="340" y2="420" />
            </g>

            {/* Restrained Outline of Indian Subcontinent & Major Corridors */}
            <path
              d="M 170 45 L 210 50 L 235 75 L 260 100 L 290 120 L 330 135 L 360 140 L 410 145 L 430 165 L 420 190 L 390 195 L 350 200 L 335 220 L 315 260 L 290 300 L 260 350 L 235 390 L 225 415 L 220 395 L 205 350 L 175 300 L 150 270 L 125 250 L 115 210 L 95 200 L 80 185 L 110 160 L 140 120 L 155 75 Z"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />

            {/* Major Multi-modal Freight & Highway Corridors */}
            {/* Western DFC line */}
            <path
              d="M 180 140 L 150 230 L 135 270"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            >
              <title>Western Freight Corridor</title>
            </path>
            {/* Eastern DFC line */}
            <path
              d="M 185 145 L 270 200 L 335 230"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            >
              <title>Eastern Freight Corridor</title>
            </path>
            {/* Golden Quadrilateral North-South spine */}
            <path
              d="M 180 120 L 220 220 L 210 330 L 225 400"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1"
            />

            {/* Regional Labels */}
            <text x="130" y="80" fontSize="8" fill="#94a3b8" fontFamily="var(--font-mono)">NORTHERN HIMALAYAN</text>
            <text x="70" y="240" fontSize="8" fill="#94a3b8" fontFamily="var(--font-mono)">WESTERN CORRIDOR</text>
            <text x="320" y="235" fontSize="8" fill="#94a3b8" fontFamily="var(--font-mono)">EASTERN INDUSTRIAL</text>
            <text x="210" y="340" fontSize="8" fill="#94a3b8" fontFamily="var(--font-mono)">SOUTHERN PENINSULA</text>

            {/* Interactive Project Nodes */}
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
                  {/* Outer pulse circle for Critical alerts */}
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

                  {/* Highlight ring if selected */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="14"
                      fill="none"
                      stroke="var(--admin-blue-800)"
                      strokeWidth="2"
                    />
                  )}

                  {/* Primary Node Pin */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6 : isHovered ? 6 : 4.5}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Short node code tag */}
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

          {/* Tooltip Card on Hover */}
          {hoveredProject && (
            <div 
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(2px)',
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
                  {hoveredProject.project.implementingAgency} • {hoveredProject.project.state} • Cost: ₹{hoveredProject.project.sanctionedCostCr.toLocaleString()} Cr
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`risk-badge ${hoveredProject.riskLevel.toLowerCase()}`}>
                  {(hoveredProject.riskScore * 100).toFixed(0)}/100 {hoveredProject.riskLevel}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--admin-blue-700)', fontWeight: 600 }}>
                  Click to inspect &rarr;
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
