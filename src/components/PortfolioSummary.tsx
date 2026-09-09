import React from 'react';
import { PortfolioSummaryStats } from '../types/sentinel';

interface PortfolioSummaryProps {
  stats: PortfolioSummaryStats;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ stats }) => {
  // Format numbers into Indian Lakh Crores
  const formatCrores = (valCr: number) => {
    const lakhCr = (valCr / 100000).toFixed(2);
    return `₹${lakhCr} L Cr`;
  };

  return (
    <section className="portfolio-strip" aria-label="National Portfolio Key Indicators">
      {/* 1. Monitored Projects */}
      <div className="portfolio-indicator">
        <div className="indicator-label">Monitored Portfolio</div>
        <div className="indicator-value mono-num">{stats.monitoredProjectsCount.toLocaleString()}</div>
        <div className="indicator-sub">
          <span>Sanctioned Outlay:</span>
          <strong className="mono-num" style={{ color: 'var(--text-secondary)' }}>
            {formatCrores(stats.totalSanctionedOutlayCr)}
          </strong>
        </div>
      </div>

      {/* 2. Active Implementation */}
      <div className="portfolio-indicator">
        <div className="indicator-label">Active Execution</div>
        <div className="indicator-value mono-num">{stats.activeProjectsCount.toLocaleString()}</div>
        <div className="indicator-sub">
          <span>{((stats.activeProjectsCount / stats.monitoredProjectsCount) * 100).toFixed(1)}% of portfolio</span>
        </div>
      </div>

      {/* 3. Delayed Projects */}
      <div className="portfolio-indicator">
        <div className="indicator-label">Delayed Beyond Original</div>
        <div className="indicator-value mono-num" style={{ color: 'var(--risk-high-text)' }}>
          {stats.delayedBeyondOriginalScheduleCount}
        </div>
        <div className="indicator-sub">
          <span className="mono-num">{stats.delayedRatioPct}% rate</span>
          <span>•</span>
          <span>Critical Path Impact</span>
        </div>
      </div>

      {/* 4. At-Risk Projects (Critical + High) */}
      <div className="portfolio-indicator">
        <div className="indicator-label">Predictive Risk Alert</div>
        <div className="indicator-value mono-num" style={{ color: 'var(--risk-critical-text)' }}>
          {stats.criticalAndHighRiskCount}
        </div>
        <div className="indicator-sub">
          <span className="escalated">+{stats.escalatedThisCycleCount} escalated</span>
          <span>/</span>
          <span className="mitigated">-{stats.mitigatedThisCycleCount} mitigated</span>
        </div>
      </div>

      {/* 5. Cumulative Anticipated Cost Overrun */}
      <div className="portfolio-indicator">
        <div className="indicator-label">Anticipated Cost Overrun</div>
        <div className="indicator-value mono-num" style={{ color: 'var(--risk-critical-text)' }}>
          {formatCrores(stats.anticipatedCostOverrunCr)}
        </div>
        <div className="indicator-sub">
          <span className="mono-num">+{stats.costOverrunPct}% escalation</span>
          <span>above original</span>
        </div>
      </div>

      {/* 6. Accelerated / Recovery Priority */}
      <div className="portfolio-indicator">
        <div className="indicator-label">Critical Path Recovery</div>
        <div className="indicator-value mono-num" style={{ color: 'var(--risk-low-text)' }}>
          {stats.acceleratedMilestoneProjectsCount}
        </div>
        <div className="indicator-sub">
          <span>Tripartite Interventions Active</span>
        </div>
      </div>
    </section>
  );
};
