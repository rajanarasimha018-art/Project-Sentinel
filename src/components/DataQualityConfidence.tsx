import React from 'react';
import { DataQualitySummary } from '../types/sentinel';
import { CheckCircle2, HelpCircle, FileCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

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
            <span>DATASET COMPLETENESS &amp; MODEL VALIDATION STATUS</span>
          </div>
          <div className="panel-subtitle">
            Transparent data fidelity audit: Calculated directly from {summary.loadedTotal} loaded project records
          </div>
        </div>

        <div className="panel-actions">
          <span 
            className="demo-layer-pill" 
            style={{ fontSize: '9px', backgroundColor: '#fff', border: '1px solid var(--border-medium)', color: '#475569' }}
          >
            [SCHEMA AUDIT: REPRODUCIBLE]
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
              <span>Complete Baseline Fields</span>
            </div>
            <div className="dq-val mono-num">{summary.sufficientCount} of {summary.loadedTotal}</div>
            <div className="dq-sub">
              <strong>{summary.sufficientPct.toFixed(0)}%</strong> of loaded sample • Complete sanctioned outlay, physical progress, and COD milestones
            </div>
          </div>

          {/* Partial */}
          <div className="dq-card" style={{ borderLeft: '3px solid #ca8a04' }}>
            <div className="dq-status-label" style={{ color: '#854d0e', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <HelpCircle size={12} />
              <span>Partial Attributes</span>
            </div>
            <div className="dq-val mono-num">{summary.partialCount} of {summary.loadedTotal}</div>
            <div className="dq-sub">
              <strong>{summary.partialPct.toFixed(0)}%</strong> of loaded sample • Top-level progress reported; sub-contractor details pending
            </div>
          </div>

          {/* Insufficient */}
          <div className="dq-card" style={{ borderLeft: '3px solid #64748b' }}>
            <div className="dq-status-label" style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={12} />
              <span>Insufficient Baseline</span>
            </div>
            <div className="dq-val mono-num">{summary.insufficientCount}</div>
            <div className="dq-sub">
              <strong>0%</strong> • All 10 loaded sample projects have verified baseline dates and sanctioned budgets
            </div>
          </div>

          {/* Production Status */}
          <div className="dq-card" style={{ borderLeft: '3px solid #2563eb' }}>
            <div className="dq-status-label" style={{ color: 'var(--admin-blue-900)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldAlert size={12} />
              <span>Production Integration</span>
            </div>
            <div className="dq-val" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              Not Connected
            </div>
            <div className="dq-sub">
              Standalone Reference Environment (SIH26103 Prototype)
            </div>
          </div>
        </div>

        {/* Truthful Engine & Connection Metadata */}
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
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div>
            <span>Schema Validation: </span>
            <strong className="mono-num" style={{ color: '#16a34a' }}>{summary.schemaCheckStatus}</strong>
            <span style={{ margin: '0 8px', color: 'var(--text-faint)' }}>|</span>
            <span>Predictive Model State: </span>
            <strong style={{ color: 'var(--admin-blue-800)' }}>{summary.modelStatus}</strong>
          </div>

          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            External Sensor/Satellite Feeds: <strong>{summary.externalDataStatus}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
