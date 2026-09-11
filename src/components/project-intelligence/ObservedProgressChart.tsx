import React, { useState } from 'react';
import { HistoricalMonitoringCycleRecord } from '../../types/sentinel';
import { TrendingUp, Info } from 'lucide-react';

interface ObservedProgressChartProps {
  cycles: HistoricalMonitoringCycleRecord[];
}

export const ObservedProgressChart: React.FC<ObservedProgressChartProps> = ({ cycles }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 580;
  const height = 180;
  const margin = { top: 25, right: 30, bottom: 35, left: 45 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales for progress % (0% to 100% or min/max with margin)
  const minVal = Math.max(0, Math.floor(Math.min(...cycles.map((c) => c.physicalProgressPct)) - 10));
  const maxVal = Math.min(100, Math.ceil(Math.max(...cycles.map((c) => c.physicalProgressPct)) + 15));

  const getX = (idx: number) => {
    return margin.left + (idx / (cycles.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    return margin.top + innerHeight - ratio * innerHeight;
  };

  const points = cycles.map((c, i) => `${getX(i)},${getY(c.physicalProgressPct)}`).join(' L ');
  const pathD = `M ${points}`;
  const areaD = `M ${getX(0)},${margin.top + innerHeight} L ${points} L ${getX(cycles.length - 1)},${margin.top + innerHeight} Z`;

  return (
    <div className="operational-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <TrendingUp size={15} style={{ color: 'var(--admin-blue-800)' }} />
            <span>OBSERVED PHYSICAL PROGRESS TRAJECTORY</span>
          </div>
          <div className="panel-subtitle">
            Measured site progress across cycles (Underlying planned curves omitted to prevent false S-curve modeling)
          </div>
        </div>

        <div className="panel-actions">
          <span 
            className="demo-layer-pill" 
            style={{ fontSize: '9px', background: '#fff', border: '1px solid var(--border-medium)', color: '#475569' }}
          >
            [OBSERVED PHYSICAL PROGRESS]
          </span>
        </div>
      </div>

      <div className="panel-body" style={{ padding: '14px 20px 10px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Physical Progress Gains (%) Over Longitudinal Monitoring Records
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Baseline Target COD: <strong className="mono-num">{cycles[0]?.anticipatedCompletionDate}</strong>
          </span>
        </div>

        {/* SVG Progress Chart */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            style={{ width: '100%', height: 'auto', display: 'block', userSelect: 'none' }}
          >
            {/* Grid horizontal lines */}
            {[minVal, Math.round((minVal + maxVal) / 2), maxVal].map((level) => {
              const y = getY(level);
              return (
                <g key={level}>
                  <line
                    x1={margin.left}
                    y1={y}
                    x2={width - margin.right}
                    y2={y}
                    stroke="var(--border-hairline)"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  <text
                    x={margin.left - 6}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="var(--text-muted)"
                    fontFamily="var(--font-mono)"
                  >
                    {level}%
                  </text>
                </g>
              );
            })}

            {/* Area fill */}
            <path
              d={areaD}
              fill="rgba(30, 64, 175, 0.06)"
            />

            {/* Line path */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--admin-blue-800)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Data Nodes */}
            {cycles.map((c, i) => {
              const cx = getX(i);
              const cy = getY(c.physicalProgressPct);
              const isHovered = hoveredIdx === i;
              const isLatest = i === cycles.length - 1;

              return (
                <g 
                  key={c.cycleId}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {isHovered && (
                    <line
                      x1={cx}
                      y1={margin.top}
                      x2={cx}
                      y2={margin.top + innerHeight}
                      stroke="var(--admin-blue-600)"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 5 : isLatest ? 4.5 : 3.5}
                    fill={isLatest ? 'var(--admin-blue-900)' : '#ffffff'}
                    stroke="var(--admin-blue-800)"
                    strokeWidth="2"
                  />

                  {/* Percentage label */}
                  <text
                    x={cx}
                    y={cy - 8}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="700"
                    fill="var(--text-primary)"
                    fontFamily="var(--font-mono)"
                  >
                    {c.physicalProgressPct}%
                  </text>

                  {/* X-axis label */}
                  <text
                    x={cx}
                    y={margin.top + innerHeight + 16}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight={isLatest ? '700' : '500'}
                    fill={isLatest ? 'var(--text-primary)' : 'var(--text-muted)'}
                    fontFamily="var(--font-mono)"
                  >
                    {c.reportingPeriod.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic hover footnote */}
        <div 
          style={{ 
            marginTop: '8px', 
            padding: '6px 10px', 
            backgroundColor: '#fafbfc', 
            border: '1px solid var(--border-hairline)', 
            borderRadius: '2px', 
            fontSize: '11px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {hoveredIdx !== null ? (
            <>
              <div>
                <strong>{cycles[hoveredIdx].reportingPeriod}</strong>: Physical progress reached <span className="mono-num"><strong>{cycles[hoveredIdx].physicalProgressPct}%</strong></span>
              </div>
              <div style={{ color: '#166534', fontWeight: 600 }}>
                +{cycles[hoveredIdx].physicalProgressDeltaPct}% gain during period
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={12} />
              <span>Hover over quarter nodes to inspect recorded cycle progress deltas.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
