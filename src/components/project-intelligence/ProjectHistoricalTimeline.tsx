import React from 'react';
import { HistoricalMonitoringCycleRecord } from '../../types/sentinel';
import { History, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProjectHistoricalTimelineProps {
  cycles: HistoricalMonitoringCycleRecord[];
}

export const ProjectHistoricalTimeline: React.FC<ProjectHistoricalTimelineProps> = ({ cycles }) => {
  return (
    <div className="operational-panel" style={{ marginBottom: 'var(--space-lg)' }}>
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <History size={15} style={{ color: 'var(--admin-blue-800)' }} />
            <span>LONGITUDINAL MONITORING TIMELINE — WHAT CHANGED BETWEEN CYCLES?</span>
          </div>
          <div className="panel-subtitle">
            Cycle-by-cycle physical progress gains, expenditure disbursements, and schedule postponement events
          </div>
        </div>

        <div className="panel-actions">
          <span 
            className="demo-layer-pill" 
            style={{ fontSize: '9px', background: '#fff', border: '1px solid var(--border-medium)', color: '#475569' }}
          >
            [LONGITUDINAL CYCLE LOGS]
          </span>
        </div>
      </div>

      <div className="operational-table-wrap">
        <table className="operational-table">
          <thead>
            <tr>
              <th style={{ width: '16%' }}>Monitoring Cycle</th>
              <th style={{ width: '12%' }}>Physical Progress</th>
              <th style={{ width: '15%' }}>Cumulative Spend</th>
              <th style={{ width: '16%' }}>Anticipated COD</th>
              <th style={{ width: '15%' }}>Anticipated Cost</th>
              <th style={{ width: '26%' }}>Observed Change / Milestone Note</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((c, idx) => {
              const isCurrent = idx === cycles.length - 1;
              return (
                <tr 
                  key={c.cycleId}
                  style={{ backgroundColor: isCurrent ? '#f8fafc' : 'inherit' }}
                >
                  {/* Cycle & Date */}
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {c.reportingPeriod}
                    </div>
                    <div className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      As of {c.reportingDate}
                    </div>
                    {isCurrent && (
                      <span 
                        style={{ 
                          fontSize: '8.5px', 
                          fontWeight: 700, 
                          color: 'var(--admin-blue-800)', 
                          backgroundColor: '#dbeafe', 
                          padding: '1px 5px', 
                          borderRadius: '2px', 
                          marginTop: '2px', 
                          display: 'inline-block' 
                        }}
                      >
                        CURRENT ACTIVE CYCLE
                      </span>
                    )}
                  </td>

                  {/* Physical Progress */}
                  <td>
                    <div className="mono-num" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '13px' }}>
                      {c.physicalProgressPct}%
                    </div>
                    <div style={{ fontSize: '10px', color: '#166534' }}>
                      +{c.physicalProgressDeltaPct}% added
                    </div>
                  </td>

                  {/* Spend */}
                  <td>
                    <div className="mono-num" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      ₹{c.cumulativeExpenditureCr.toLocaleString()} Cr
                    </div>
                    <div className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      +₹{c.expenditureDeltaCr.toLocaleString()} Cr disbursed
                    </div>
                  </td>

                  {/* COD & Schedule Shift */}
                  <td>
                    <div className="mono-num" style={{ fontWeight: 600, color: c.scheduleShiftMonths > 0 ? 'var(--risk-high-text)' : 'inherit' }}>
                      {c.anticipatedCompletionDate}
                    </div>
                    {c.scheduleShiftMonths > 0 ? (
                      <div style={{ fontSize: '10px', color: 'var(--risk-critical-text)', fontWeight: 600 }}>
                        &rarr; Postponed +{c.scheduleShiftMonths} mo
                      </div>
                    ) : (
                      <div style={{ fontSize: '10px', color: 'var(--risk-low-text)' }}>
                        No schedule shift
                      </div>
                    )}
                  </td>

                  {/* Cost Revision */}
                  <td>
                    <div className="mono-num" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      ₹{c.anticipatedCostCr.toLocaleString()} Cr
                    </div>
                    {c.costRevisionDeltaCr > 0 ? (
                      <div className="mono-num" style={{ fontSize: '10px', color: 'var(--risk-critical-text)' }}>
                        +₹{c.costRevisionDeltaCr.toLocaleString()} Cr escalation
                      </div>
                    ) : (
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Baseline steady
                      </div>
                    )}
                  </td>

                  {/* Change Remark */}
                  <td>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {c.cycleRemark}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
