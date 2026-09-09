import React from 'react';
import { DataQualitySummary } from '../types/sentinel';
import { CheckCircle2, AlertCircle, HelpCircle, FileCheck, ShieldAlert } from 'lucide-react';

interface DataQualityConfidenceProps {
  summary: DataQualitySummary;
}

export const DataQualityConfidence: React.FC<DataQualityConfidenceProps> = ({ summary }) => {
  return (
    <div className="operational-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <FileCheck size={15} style={{ color: 'var(--admin-blue-800)' }} />
            <span>DATA QUALITY &amp; PREDICTIVE MODEL CONFIDENCE ENGINE</span>
          </div>
          <div className="panel-subtitle">
            Algorithmic certainty verification: Preventing false operational confidence across portfolio data
          </div>
        </div>

        <div className="panel-actions">
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Calibration: <strong className="mono-num">{summary.confidenceEngineVersion}</strong>
          </span>
        </div>
      </div>

      <div className="panel-body">
        {/* 4-Column Data Quality Verification Grid */}
        <div className="dq-grid">
          {/* Sufficient */}
          <div className="dq-card" style={{ borderLeft: '3px solid #16a34a' }}>
            <div className="dq-status-label" style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} />
              <span>Sufficient Baseline</span>
            </div>
            <div className="dq-val mono-num">{summary.sufficientCount.toLocaleString()}</div>
            <div className="dq-sub">
              <strong>{summary.sufficientPct}%</strong> of portfolio • Full monthly DPR, financial escrow, &amp; drone telemetry
            </div>
          </div>

          {/* Partial */}
          <div className="dq-card" style={{ borderLeft: '3px solid #ca8a04' }}>
            <div className="dq-status-label" style={{ color: '#854d0e', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <HelpCircle size={12} />
              <span>Partial Reporting</span>
            </div>
            <div className="dq-val mono-num">{summary.partialCount}</div>
            <div className="dq-sub">
              <strong>{summary.partialPct}%</strong> of portfolio • Physical milestone logs synced; sub-vendor ledger pending
            </div>
          </div>

          {/* Insufficient */}
          <div className="dq-card" style={{ borderLeft: '3px solid #64748b' }}>
            <div className="dq-status-label" style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={12} />
              <span>Insufficient Baseline</span>
            </div>
            <div className="dq-val mono-num">{summary.insufficientCount}</div>
            <div className="dq-sub">
              <strong>{summary.insufficientPct}%</strong> of portfolio • Baseline survey undergoing CCEA revision
            </div>
          </div>

          {/* Validation Required */}
          <div className="dq-card" style={{ borderLeft: '3px solid #dc2626' }}>
            <div className="dq-status-label" style={{ color: '#991b1b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldAlert size={12} />
              <span>Discrepancy Flagged</span>
            </div>
            <div className="dq-val mono-num" style={{ color: '#991b1b' }}>{summary.validationRequiredCount}</div>
            <div className="dq-sub">
              <strong>{summary.validationRequiredPct}%</strong> • Inconsistency between contractor claim &amp; independent engineer log
            </div>
          </div>
        </div>

        {/* Audit Trail Context Footer */}
        <div 
          style={{ 
            marginTop: '12px', 
            padding: '8px 12px', 
            backgroundColor: '#fafbfc', 
            border: '1px solid var(--border-hairline)',
            borderRadius: '2px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <span>Automated ETL Audit Check: </span>
            <strong className="mono-num">{summary.lastAuditRun}</strong>
            <span style={{ margin: '0 8px', color: 'var(--text-faint)' }}>|</span>
            <span>Unresolved Ground Discrepancies: </span>
            <strong className="mono-num" style={{ color: 'var(--risk-critical-text)' }}>{summary.discrepancyCount} flags</strong>
          </div>

          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Compliance Standard: GFR Rule 130 &amp; MoSPI Quarterly Verification Code
          </span>
        </div>
      </div>
    </div>
  );
};
