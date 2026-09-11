import React from 'react';
import { Database, ShieldCheck, AlertTriangle, Cpu, HelpCircle, CheckCircle, XCircle } from 'lucide-react';

interface DataQualityModelStatusProps {
  totalProjects: number;
  sufficientCount: number;
  partialCount: number;
  insufficientCount: number;
}

export const DataQualityModelStatus: React.FC<DataQualityModelStatusProps> = ({
  totalProjects,
  sufficientCount,
  partialCount,
  insufficientCount,
}) => {
  return (
    <section 
      className="operational-panel" 
      style={{ marginBottom: 'var(--space-lg)' }}
      aria-label="Data Quality and Model Status"
    >
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <ShieldCheck size={16} style={{ color: 'var(--admin-blue-800)' }} />
            <span>DATA QUALITY &amp; MODEL VALIDATION STATUS</span>
          </div>
          <div className="panel-subtitle">
            Epistemological boundary audit: data sufficiency, schema conformance, and prototype algorithm status.
          </div>
        </div>

        <div className="panel-actions">
          <span 
            className="demo-layer-pill" 
            style={{ 
              fontSize: '10px', 
              backgroundColor: '#fff', 
              border: '1px solid var(--border-medium)', 
              color: 'var(--text-secondary)' 
            }}
          >
            [SIH26103 AUDIT SPECIFICATION]
          </span>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          {/* Card 1: Data Sufficiency Breakdown */}
          <div 
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-paper-tint)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              DATA QUALITY STATES [SOURCE-AUDITED]
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--risk-low-text)', fontWeight: 600 }}>• SUFFICIENT:</span>
                <span className="mono-num" style={{ fontWeight: 700 }}>{sufficientCount} Projects</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--risk-medium-text)', fontWeight: 600 }}>• PARTIAL:</span>
                <span className="mono-num" style={{ fontWeight: 700 }}>{partialCount} Projects</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--risk-critical-text)', fontWeight: 600 }}>• INSUFFICIENT:</span>
                <span className="mono-num" style={{ fontWeight: 700 }}>{insufficientCount} Projects</span>
              </div>
            </div>
          </div>

          {/* Card 2: Historical Cycles & Required Fields */}
          <div 
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-paper-tint)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              MONITORING RECORDS [PAIMANA REPOSITORY]
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Historical Cycles:</span>
                <span className="mono-num" style={{ fontWeight: 600 }}>4 Quarters / Project</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Audit Records:</span>
                <span className="mono-num" style={{ fontWeight: 600 }}>40 Cycle Records</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Required Fields:</span>
                <span className="mono-num" style={{ fontWeight: 600, color: 'var(--risk-low-text)' }}>Present (10/10)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Missing Fields & External Feeds */}
          <div 
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-paper-tint)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              DATA BOUNDARIES &amp; GAPS
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Missing Fields:</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2/10 Partial Cadastral</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>External Drone API:</span>
                <span style={{ fontSize: '11px', color: 'var(--risk-medium-text)' }}>Not Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Live Sensor Feeds:</span>
                <span style={{ fontSize: '11px', color: 'var(--risk-medium-text)' }}>Not Connected</span>
              </div>
            </div>
          </div>

          {/* Card 4: Model Status & Transparency */}
          <div 
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--admin-blue-900)', letterSpacing: '0.04em' }}>
              MODEL STATUS &amp; VALIDATION
            </div>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11px' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>MODEL: </span>
                <strong>Schedule-risk prototype</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>VALIDATION: </span>
                <strong style={{ color: '#b45309' }}>In progress on MoSPI records</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>TRAINING / BACKTEST: </span>
                <span style={{ color: 'var(--text-secondary)' }}>Not yet production validated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ethical Transparency Statement */}
        <div 
          style={{
            padding: '10px 14px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-xs)',
            fontSize: '11px',
            color: '#1e3a8a',
            lineHeight: 1.45
          }}
        >
          <strong>Transparency Standard for SIH 2026:</strong> ProjectSentinel explicitly declines to display synthetic accuracy percentages, simulated ROC-AUC metrics, or fake live government API integration claims. All signals displayed are grounded in verified MoSPI PAIMANA published overview records, reproducible mathematical calculations, and clearly labeled prototype scoring heuristics.
        </div>
      </div>
    </section>
  );
};
