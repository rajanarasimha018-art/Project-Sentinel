import React from 'react';
import { PortfolioSummaryStats } from '../types/sentinel';

interface PortfolioSummaryProps {
  stats: PortfolioSummaryStats;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ stats }) => {
  return (
    <section className="portfolio-strip" aria-label="National Portfolio Key Indicators">
      {/* 1. Loaded Workspace Records */}
      <div className="portfolio-indicator">
        <div className="indicator-label" title="Representative projects loaded in local engine">
          <span>Loaded Sample Records</span>
        </div>
        <div className="indicator-value mono-num">{stats.loadedProjectsCount}</div>
        <div className="indicator-sub">
          <span>Sanctioned Outlay: </span>
          <strong className="mono-num" style={{ color: 'var(--text-secondary)' }}>
            ₹{stats.loadedSanctionedOutlayCr.toLocaleString()} Cr
          </strong>
        </div>
      </div>

      {/* 2. Delayed Beyond Original Schedule (Sample Calculation) */}
      <div className="portfolio-indicator">
        <div className="indicator-label" title="Calculated from anticipated completion date > original completion date">
          <span>Delayed Schedule [Sample Calculation]</span>
        </div>
        <div className="indicator-value mono-num" style={{ color: 'var(--risk-high-text)' }}>
          {stats.loadedDelayedCount} / {stats.loadedProjectsCount}
        </div>
        <div className="indicator-sub">
          <span className="mono-num">{stats.loadedDelayedRatioPct.toFixed(0)}%</span>
          <span>of loaded sample records</span>
        </div>
      </div>

      {/* 3. Prototype Risk Signals */}
      <div className="portfolio-indicator">
        <div className="indicator-label" title="Output of current Prototype Schedule Risk scoring">
          <span>Prototype Risk Signals</span>
        </div>
        <div className="indicator-value mono-num" style={{ color: 'var(--risk-critical-text)' }}>
          {stats.loadedAtRiskCount}
        </div>
        <div className="indicator-sub">
          <span>Generated from sample data • validation pending</span>
        </div>
      </div>

      {/* 4. Sample Cost Variance (Calculated) */}
      <div className="portfolio-indicator">
        <div className="indicator-label" title="Sum of Anticipated Cost minus Sanctioned Cost across loaded sample">
          <span>Sample Cost Variance [Calculated]</span>
        </div>
        <div className="indicator-value mono-num" style={{ color: 'var(--risk-critical-text)' }}>
          +₹{stats.loadedCostVarianceCr.toLocaleString()} Cr
        </div>
        <div className="indicator-sub">
          <span>Calculated from loaded sample records • not a model forecast</span>
        </div>
      </div>

      {/* 5. Schema-Compatible Sample */}
      <div className="portfolio-indicator">
        <div className="indicator-label" title="Schema conformity check across loaded records">
          <span>Schema-Compatible Sample</span>
        </div>
        <div className="indicator-value mono-num" style={{ color: 'var(--risk-low-text)' }}>
          {stats.schemaCompatibleCount} / {stats.loadedProjectsCount}
        </div>
        <div className="indicator-sub">
          <span>Sample records conform to DPR schema</span>
        </div>
      </div>
    </section>
  );
};
