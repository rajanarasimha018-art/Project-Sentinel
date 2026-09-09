import React, { useState } from 'react';
import { QuarterlyTrendPoint } from '../types/sentinel';
import { Activity, Info } from 'lucide-react';

interface RiskTrendChartProps {
  trends: QuarterlyTrendPoint[];
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ trends }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions & margins
  const width = 580;
  const height = 190;
  const margin = { top: 20, right: 30, bottom: 35, left: 45 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales
  const minRisk = 0.25;
  const maxRisk = 0.55;

  const getX = (index: number) => {
    return margin.left + (index / (trends.length - 1)) * innerWidth;
  };

  const getY = (value: number) => {
    const clamped = Math.max(minRisk, Math.min(maxRisk, value));
    const ratio = (clamped - minRisk) / (maxRisk - minRisk);
    return margin.top + innerHeight - ratio * innerHeight;
  };

  // Generate SVG path for portfolio risk curve
  const points = trends.map((d, i) => `${getX(i)},${getY(d.portfolioAvgRiskIndex)}`).join(' L ');
  const pathD = `M ${points}`;

  // Area under curve
  const areaD = `M ${getX(0)},${margin.top + innerHeight} L ${points} L ${getX(trends.length - 1)},${margin.top + innerHeight} Z`;

  // Benchmark line
  const benchmarkY = getY(0.33);

  return (
    <div className="operational-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <Activity size={15} style={{ color: 'var(--admin-blue-800)' }} />
            <span>PORTFOLIO RISK TRAJECTORY (MULTI-QUARTER)</span>
          </div>
          <div className="panel-subtitle">
            “Risk is not just a number. Risk is a change over time.”
          </div>
        </div>

        <div className="panel-actions">
          <span 
            className="demo-layer-pill" 
            style={{ fontSize: '9px', backgroundColor: '#fff', color: '#475569' }}
            title="Calibrated sample baseline representing MoSPI quarterly trend patterns"
          >
            [SAMPLE MODEL CALIBRATION]
          </span>
        </div>
      </div>

      <div className="panel-body" style={{ padding: '14px var(--space-lg) 10px var(--space-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Aggregate Risk Index &amp; Critical Volume Over 6 Monitoring Cycles
          </div>
          <div style={{ display: 'flex', gap: '14px', fontSize: '10px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '2px', backgroundColor: 'var(--admin-blue-800)', display: 'inline-block' }}></span>
              Portfolio Risk Index
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '2px', backgroundColor: '#94a3b8', strokeDasharray: '2,2', display: 'inline-block' }}></span>
              Benchmark Target (0.33)
            </span>
          </div>
        </div>

        {/* SVG Time-Series Chart */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg 
            viewBox={`0 0 ${width} ${height}`} 
            style={{ width: '100%', height: 'auto', display: 'block', userSelect: 'none' }}
          >
            {/* Grid horizontal lines */}
            {[0.3, 0.4, 0.5].map((level) => {
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
                    {level.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Benchmark target line */}
            <line
              x1={margin.left}
              y1={benchmarkY}
              x2={width - margin.right}
              y2={benchmarkY}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="4,3"
            />

            {/* Shaded Area under Curve */}
            <path
              d={areaD}
              fill="rgba(30, 64, 175, 0.05)"
            />

            {/* Risk Index Line */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--admin-blue-800)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Data Points & Tooltips */}
            {trends.map((point, index) => {
              const cx = getX(index);
              const cy = getY(point.portfolioAvgRiskIndex);
              const isHovered = hoveredIndex === index;
              const isCurrent = index === trends.length - 1;

              return (
                <g 
                  key={point.cycle}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Vertical Guide Line when hovered */}
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

                  {/* Circle Node */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 5 : isCurrent ? 4 : 3}
                    fill={isCurrent ? 'var(--risk-critical-bar)' : 'var(--admin-blue-800)'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* X-axis label */}
                  <text
                    x={cx}
                    y={margin.top + innerHeight + 15}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight={isCurrent ? '700' : '500'}
                    fill={isCurrent ? 'var(--text-primary)' : 'var(--text-muted)'}
                    fontFamily="var(--font-mono)"
                  >
                    {point.cycle.replace(' FY', '\'')}
                  </text>

                  {/* Value callout on current node */}
                  {isCurrent && (
                    <text
                      x={cx}
                      y={cy - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill="var(--risk-critical-text)"
                      fontFamily="var(--font-mono)"
                    >
                      {point.portfolioAvgRiskIndex.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover inspector strip */}
        <div 
          style={{ 
            marginTop: '6px', 
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
          {hoveredIndex !== null ? (
            <>
              <div>
                <strong>{trends[hoveredIndex].cycle}</strong> ({trends[hoveredIndex].quarterLabel})
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span>Risk Index: <strong className="mono-num">{trends[hoveredIndex].portfolioAvgRiskIndex.toFixed(2)}</strong></span>
                <span>Critical Projects: <strong className="mono-num" style={{ color: 'var(--risk-critical-text)' }}>{trends[hoveredIndex].criticalHighCount}</strong></span>
                <span>Mitigations: <strong className="mono-num" style={{ color: 'var(--risk-low-text)' }}>{trends[hoveredIndex].resolvedCount}</strong></span>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={12} />
              <span>Hover over quarter nodes to inspect historical risk transitions and resolution velocity.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
