import React from 'react';
import { RiskDistributionData } from '../types/sentinel';
import { PieChart, TrendingUp } from 'lucide-react';

interface RiskDistributionProps {
  distribution: RiskDistributionData;
  totalProjects: number;
}

export const RiskDistribution: React.FC<RiskDistributionProps> = ({
  distribution,
  totalProjects
}) => {
  const { bySeverity, byTrend } = distribution;

  return (
    <div className="operational-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <PieChart size={15} style={{ color: 'var(--admin-blue-800)' }} />
            <span>PORTFOLIO RISK DISTRIBUTION</span>
          </div>
          <div className="panel-subtitle">
            Condition breakdown across {totalProjects.toLocaleString()} central sector projects
          </div>
        </div>
      </div>

      <div className="panel-body">
        {/* Risk Severity Distribution Bar */}
        <div style={{ marginBottom: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          By Severity Classification
        </div>

        <div className="dist-stack-bar" title="Portfolio Severity Distribution">
          <div 
            className="dist-segment" 
            style={{ width: `${bySeverity.critical.pct}%`, backgroundColor: 'var(--risk-critical-bar)' }}
            title={`Critical: ${bySeverity.critical.count} (${bySeverity.critical.pct}%)`}
          />
          <div 
            className="dist-segment" 
            style={{ width: `${bySeverity.high.pct}%`, backgroundColor: 'var(--risk-high-bar)' }}
            title={`High: ${bySeverity.high.count} (${bySeverity.high.pct}%)`}
          />
          <div 
            className="dist-segment" 
            style={{ width: `${bySeverity.medium.pct}%`, backgroundColor: 'var(--risk-medium-bar)' }}
            title={`Medium: ${bySeverity.medium.count} (${bySeverity.medium.pct}%)`}
          />
          <div 
            className="dist-segment" 
            style={{ width: `${bySeverity.low.pct}%`, backgroundColor: 'var(--risk-low-bar)' }}
            title={`Low: ${bySeverity.low.count} (${bySeverity.low.pct}%)`}
          />
          <div 
            className="dist-segment" 
            style={{ width: `${bySeverity.insufficientData.pct}%`, backgroundColor: 'var(--risk-insufficient-bar)' }}
            title={`Insufficient Data: ${bySeverity.insufficientData.count} (${bySeverity.insufficientData.pct}%)`}
          />
        </div>

        {/* Severity Legend Grid */}
        <div className="dist-legend-grid">
          <div className="dist-legend-item">
            <span>
              <span className="dist-color-dot" style={{ backgroundColor: 'var(--risk-critical-bar)' }}></span>
              Critical Risk
            </span>
            <strong className="mono-num" style={{ color: 'var(--risk-critical-text)' }}>
              {bySeverity.critical.count} ({bySeverity.critical.pct}%)
            </strong>
          </div>

          <div className="dist-legend-item">
            <span>
              <span className="dist-color-dot" style={{ backgroundColor: 'var(--risk-high-bar)' }}></span>
              High Risk
            </span>
            <strong className="mono-num" style={{ color: 'var(--risk-high-text)' }}>
              {bySeverity.high.count} ({bySeverity.high.pct}%)
            </strong>
          </div>

          <div className="dist-legend-item">
            <span>
              <span className="dist-color-dot" style={{ backgroundColor: 'var(--risk-medium-bar)' }}></span>
              Medium Risk
            </span>
            <strong className="mono-num" style={{ color: 'var(--risk-medium-text)' }}>
              {bySeverity.medium.count} ({bySeverity.medium.pct}%)
            </strong>
          </div>

          <div className="dist-legend-item">
            <span>
              <span className="dist-color-dot" style={{ backgroundColor: 'var(--risk-low-bar)' }}></span>
              Low / On Track
            </span>
            <strong className="mono-num" style={{ color: 'var(--risk-low-text)' }}>
              {bySeverity.low.count} ({bySeverity.low.pct}%)
            </strong>
          </div>

          <div className="dist-legend-item" style={{ gridColumn: 'span 2' }}>
            <span>
              <span className="dist-color-dot" style={{ backgroundColor: 'var(--risk-insufficient-bar)' }}></span>
              Insufficient Data (Uncalibrated Baseline)
            </span>
            <strong className="mono-num" style={{ color: 'var(--risk-insufficient-text)' }}>
              {bySeverity.insufficientData.count} ({bySeverity.insufficientData.pct}%)
            </strong>
          </div>
        </div>

        {/* Risk Trend Dynamics Section */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-hairline)' }}>
          <div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={13} style={{ color: 'var(--text-muted)' }} />
            <span>Directional Risk Dynamics (This Review Cycle)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '2px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#991b1b', fontWeight: 700 }}>
                Escalating
              </div>
              <div className="mono-num" style={{ fontSize: '15px', fontWeight: 700, color: '#991b1b', marginTop: '2px' }}>
                {byTrend.increasing.count}
              </div>
              <div style={{ fontSize: '10px', color: '#7f1d1d' }}>
                {byTrend.increasing.pct}% of total
              </div>
            </div>

            <div style={{ padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '2px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#475569', fontWeight: 700 }}>
                Stable
              </div>
              <div className="mono-num" style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                {byTrend.stable.count}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                {byTrend.stable.pct}% of total
              </div>
            </div>

            <div style={{ padding: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '2px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#166534', fontWeight: 700 }}>
                Mitigating
              </div>
              <div className="mono-num" style={{ fontSize: '15px', fontWeight: 700, color: '#166534', marginTop: '2px' }}>
                {byTrend.decreasing.count}
              </div>
              <div style={{ fontSize: '10px', color: '#15803d' }}>
                {byTrend.decreasing.pct}% of total
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
