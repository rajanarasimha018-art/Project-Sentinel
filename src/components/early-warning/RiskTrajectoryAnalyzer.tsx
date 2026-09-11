import React from 'react';
import { AttentionQueueItem, HistoricalMonitoringCycleRecord } from '../../types/sentinel';
import { TrendingUp, Calendar, AlertOctagon, Activity, ChevronRight, Info } from 'lucide-react';

interface RiskTrajectoryAnalyzerProps {
  selectedProject: AttentionQueueItem;
  allProjects: AttentionQueueItem[];
  onSelectProject: (item: AttentionQueueItem) => void;
  onOpenProjectIntelligence: (item: AttentionQueueItem) => void;
  onViewExternalContext?: (item: AttentionQueueItem) => void;
}

export const RiskTrajectoryAnalyzer: React.FC<RiskTrajectoryAnalyzerProps> = ({
  selectedProject,
  allProjects,
  onSelectProject,
  onOpenProjectIntelligence,
  onViewExternalContext,
}) => {
  const cycles: HistoricalMonitoringCycleRecord[] = selectedProject.historicalCycles || [];

  // Deterministic trajectory calculations from loaded records [CALCULATED]
  const totalScheduleShift = cycles.reduce((acc, c) => acc + (c.scheduleShiftMonths || 0), 0);
  const latestCycle = cycles[cycles.length - 1];
  const earliestCycle = cycles[0];

  const initialDelta = earliestCycle ? earliestCycle.physicalProgressDeltaPct : 0;
  const recentDelta = latestCycle ? latestCycle.physicalProgressDeltaPct : 0;
  const isDecelerating = recentDelta < initialDelta;

  return (
    <section 
      className="operational-panel" 
      style={{ marginBottom: 'var(--space-lg)' }}
      aria-label="Risk Change and Trajectory Analyzer"
    >
      {/* Panel Header with Strict Headline Requirement */}
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} style={{ color: 'var(--admin-blue-800)' }} />
            <span style={{ letterSpacing: '0.02em', fontSize: '13px' }}>
              RISK CHANGE &amp; LONGITUDINAL TRAJECTORY
            </span>
            <span 
              style={{
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: 'var(--admin-blue-50)',
                color: 'var(--admin-blue-800)',
                padding: '2px 8px',
                borderRadius: '2px',
                border: '1px solid var(--admin-blue-100)'
              }}
            >
              "Risk is a change over time — not just a score."
            </span>
          </div>
          <div className="panel-subtitle">
            Temporal change analysis across 4 loaded reporting cycles: physical progress velocity, schedule revision events, and expenditure trajectory.
          </div>
        </div>

        {/* Project Selector Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
            Inspect Project Trajectory:
          </label>
          <select 
            className="filter-select"
            value={selectedProject.project.id}
            onChange={(e) => {
              const found = allProjects.find((p) => p.project.id === e.target.value);
              if (found) onSelectProject(found);
            }}
            style={{ fontWeight: 600, maxWidth: '280px' }}
          >
            {allProjects.map((p) => (
              <option key={p.project.id} value={p.project.id}>
                {p.project.code} — {p.project.name.substring(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Project Summary Sub-bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '10px 16px',
          backgroundColor: 'var(--bg-subtle)',
          borderBottom: '1px solid var(--border-hairline)',
          fontSize: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {selectedProject.project.name}
          </span>
          <span className="mono-num" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
            [{selectedProject.project.code}]
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Agency: <strong>{selectedProject.project.implementingAgency}</strong>
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Sanctioned Outlay: <strong>₹{selectedProject.project.sanctionedCostCr.toLocaleString()} Cr</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onViewExternalContext && (
            <button
              onClick={() => onViewExternalContext(selectedProject)}
              className="btn-operational btn-secondary-action"
              style={{ fontSize: '11px', padding: '3px 8px', color: 'var(--admin-blue-700)' }}
              title="Inspect geographic and external conditions context"
            >
              <span>VIEW EXTERNAL CONTEXT →</span>
            </button>
          )}
          <button
            onClick={() => onOpenProjectIntelligence(selectedProject)}
            className="btn-operational btn-secondary-action"
            style={{ fontSize: '11px', padding: '3px 8px' }}
            title="Open forensic dossier in Project Intelligence"
          >
            <span>Open Forensic Dossier</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Trajectory Grid: 4-Cycle Longitudinal Indicator Comparison */}
      <div style={{ padding: '16px' }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          {cycles.map((c, idx) => {
            const isLatest = idx === cycles.length - 1;
            const hasShift = c.scheduleShiftMonths > 0;
            return (
              <div 
                key={c.cycleId}
                style={{
                  backgroundColor: isLatest ? 'var(--bg-paper-tint)' : 'var(--bg-surface)',
                  border: isLatest ? '1px solid var(--admin-blue-600)' : '1px solid var(--border-hairline)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: isLatest ? '0 0 0 1px var(--admin-blue-600)' : 'none'
                }}
              >
                {/* Cycle Name & Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '6px' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: isLatest ? 'var(--admin-blue-700)' : 'var(--text-muted)' }}>
                      {c.reportingPeriod}
                    </span>
                    {isLatest && (
                      <span style={{ marginLeft: '4px', fontSize: '9px', backgroundColor: 'var(--admin-blue-100)', color: 'var(--admin-blue-900)', padding: '1px 4px', borderRadius: '2px' }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {c.reportingDate}
                  </span>
                </div>

                {/* Metric 1: Physical Progress Trajectory */}
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    PHYSICAL PROGRESS [SOURCE]
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span className="mono-num" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {c.physicalProgressPct.toFixed(1)}%
                    </span>
                    <span 
                      className="mono-num" 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 600,
                        color: c.physicalProgressDeltaPct < 3.0 ? 'var(--risk-critical-text)' : 'var(--admin-blue-700)'
                      }}
                    >
                      +{c.physicalProgressDeltaPct.toFixed(1)}% Δ
                    </span>
                  </div>
                </div>

                {/* Metric 2: Expenditure Trajectory */}
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    EXPENDITURE [SOURCE]
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span className="mono-num" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      ₹{c.cumulativeExpenditureCr.toLocaleString()} Cr
                    </span>
                    <span className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      (+₹{c.expenditureDeltaCr} Cr)
                    </span>
                  </div>
                </div>

                {/* Metric 3: Schedule Revision Event */}
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    SCHEDULE REVISION [SOURCE + CALC]
                  </div>
                  {hasShift ? (
                    <div 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: 600, 
                        color: 'var(--risk-critical-text)',
                        backgroundColor: 'var(--risk-critical-bg)',
                        padding: '3px 6px',
                        borderRadius: '2px',
                        border: '1px solid var(--risk-critical-border)'
                      }}
                    >
                      ⚠ +{c.scheduleShiftMonths} Months Added
                    </div>
                  ) : (
                    <div style={{ fontSize: '11px', color: 'var(--risk-low-text)', fontWeight: 500 }}>
                      ✓ No shift in cycle
                    </div>
                  )}
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Anticipated: {c.anticipatedCompletionDate}
                  </div>
                </div>

                {/* Metric 4: Cycle Field Remark */}
                <div style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '6px', marginTop: 'auto' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.35 }}>
                    "{c.cycleRemark}"
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trajectory Interpretation Summary Strip */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '10px 14px',
            backgroundColor: 'var(--bg-paper-tint)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-xs)',
            fontSize: '11px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              <strong>Trajectory Diagnosis:</strong>
            </span>
            <span style={{ color: isDecelerating ? 'var(--risk-high-text)' : 'var(--risk-low-text)', fontWeight: 600 }}>
              Physical Progress Rate: {isDecelerating ? 'Decelerating (-' + (initialDelta - recentDelta).toFixed(1) + '% pts)' : 'Consistent Pace'}
            </span>
            <span style={{ color: 'var(--border-medium)' }}>•</span>
            <span style={{ color: totalScheduleShift > 0 ? 'var(--risk-critical-text)' : 'var(--risk-low-text)', fontWeight: 600 }}>
              Cumulative Schedule Slippage: {totalScheduleShift > 0 ? `+${totalScheduleShift} Months Slipped Across 4 Cycles` : 'On Original Target'}
            </span>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
            [CALCULATED DETERMINISTICALLY FROM REPORTED QUARTERLY DPRs]
          </div>
        </div>
      </div>

      {/* Mandatory Methodology Note */}
      <div 
        style={{
          padding: '8px 16px',
          backgroundColor: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-hairline)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Info size={13} style={{ color: 'var(--admin-blue-700)', flexShrink: 0 }} />
        <span>
          <strong>Methodology Note:</strong> Observed trajectories are calculated from loaded reference records. Predictive model outputs remain under validation.
        </span>
      </div>
    </section>
  );
};
