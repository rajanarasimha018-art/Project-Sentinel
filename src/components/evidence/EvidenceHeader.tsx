import React from 'react';
import { EvidenceRecord } from '../../types/sentinel';
import { FileCheck, Layers, FileText, Database, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EvidenceHeaderProps {
  records: EvidenceRecord[];
  activeSubView: 'register' | 'detail';
  onSubViewChange: (view: 'register' | 'detail') => void;
  selectedRecord: EvidenceRecord | null;
}

export const EvidenceHeader: React.FC<EvidenceHeaderProps> = ({
  records,
  activeSubView,
  onSubViewChange,
  selectedRecord,
}) => {
  const sourceCount = records.filter((r) => r.provenance === 'SOURCE').length;
  const simulatedCount = records.filter((r) => r.provenance === 'SIMULATED').length;
  const unconnectCount = records.filter((r) => r.provenance === 'NOT_CONNECTED').length;

  return (
    <div className="evidence-header-block" style={{ marginBottom: 'var(--space-lg)' }}>
      {/* Top Provenance & Workflow Strip */}
      <div 
        className="ew-provenance-strip"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '8px 14px',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-xs)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span>
            <span>WORKFLOW:</span>
            <strong>MONITOR → PREDICT → EXPLAIN → PRIORITIZE → ACT → AUDIT → EVIDENCE PROOF</strong>
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span>EVIDENCE REGISTER: <strong>{records.length} Document &amp; Field Records</strong></span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span>MODE: <strong>Evidence &amp; Provenance Review</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            className="provenance-chip"
            style={{
              fontSize: '10px',
              padding: '2px 7px',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: '2px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)'
            }}
          >
            [SOURCE: PAIMANA] + [SIMULATED] demo filings + [NOT CONNECTED] feeds
          </span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div 
        className="ew-title-bar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: 'var(--space-md)',
          borderBottom: '1px solid var(--border-hairline)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck size={18} style={{ color: 'var(--admin-blue-800)' }} />
            <h1 
              style={{ 
                fontSize: '18px', 
                fontWeight: 700, 
                letterSpacing: '0.04em', 
                color: 'var(--text-primary)',
                margin: 0,
                textTransform: 'uppercase'
              }}
            >
              Evidence &amp; Documents
            </h1>
            <span 
              style={{
                fontSize: '11px',
                padding: '1px 6px',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: '2px',
                fontWeight: 600
              }}
            >
              MODULE 5
            </span>
          </div>
          <p 
            style={{ 
              margin: '4px 0 0 0', 
              fontSize: '13px', 
              color: 'var(--text-secondary)',
              maxWidth: '820px',
              lineHeight: 1.4
            }}
          >
            “What evidence supports this risk warning and the officer’s review?” 
            Operational register of source-derived PAIMANA records and clearly labelled demonstration evidence used to test ProjectSentinel workflows.
          </p>
        </div>

        {/* Provenance Counter Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div 
            style={{
              padding: '4px 10px',
              backgroundColor: 'var(--bg-paper-tint)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL RECORDS</div>
            <div className="mono-num" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {records.length}
            </div>
          </div>

          <div 
            style={{
              padding: '4px 10px',
              backgroundColor: 'var(--risk-low-bg)',
              border: '1px solid var(--risk-low-border)',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--risk-low-text)' }}>[SOURCE] PAIMANA</div>
            <div className="mono-num" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--risk-low-text)' }}>
              {sourceCount}
            </div>
          </div>

          <div 
            style={{
              padding: '4px 10px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fde68a',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#b45309' }}>[SIMULATED] DEMO</div>
            <div className="mono-num" style={{ fontSize: '13px', fontWeight: 700, color: '#b45309' }}>
              {simulatedCount}
            </div>
          </div>

          {unconnectCount > 0 && (
            <div 
              style={{
                padding: '4px 10px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-xs)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)' }}>[NOT CONNECTED]</div>
              <div className="mono-num" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>
                {unconnectCount}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Screen Navigation Tabs (Screen 1 vs Screen 2) */}
      <div 
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: 'var(--space-md)',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => onSubViewChange('register')}
          className={`btn-operational ${activeSubView === 'register' ? 'btn-primary-action' : 'btn-secondary-action'}`}
          style={{ fontSize: '12px', padding: '6px 14px' }}
        >
          <Layers size={13} />
          <span>Screen 1: Evidence Register ({records.length})</span>
        </button>

        <button
          onClick={() => onSubViewChange('detail')}
          className={`btn-operational ${activeSubView === 'detail' ? 'btn-primary-action' : 'btn-secondary-action'}`}
          style={{ fontSize: '12px', padding: '6px 14px' }}
        >
          <FileText size={13} />
          <span>
            Screen 2: Evidence Detail / Dossier {selectedRecord ? `[${selectedRecord.id.toUpperCase()}]` : ''}
          </span>
        </button>
      </div>
    </div>
  );
};
