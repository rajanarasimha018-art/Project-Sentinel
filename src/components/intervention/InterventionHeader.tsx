import React from 'react';
import { InterventionIssue } from '../../types/sentinel';
import { ShieldCheck, AlertCircle, ArrowUpRight, CheckCircle2, Clock, Layers, FileText, RotateCcw } from 'lucide-react';

interface InterventionHeaderProps {
  issues: InterventionIssue[];
  activeSubView: 'queue' | 'detail';
  onSubViewChange: (view: 'queue' | 'detail') => void;
  selectedIssue: InterventionIssue | null;
  onResetDemoState?: () => void;
}

export const InterventionHeader: React.FC<InterventionHeaderProps> = ({
  issues,
  activeSubView,
  onSubViewChange,
  selectedIssue,
  onResetDemoState,
}) => {
  const newCount = issues.filter((i) => i.status === 'NEW').length;
  const acknowledgedCount = issues.filter((i) => i.status === 'ACKNOWLEDGED').length;
  const underReviewCount = issues.filter((i) => i.status === 'UNDER REVIEW').length;
  const escalatedCount = issues.filter((i) => i.status === 'ESCALATED').length;
  const resolvedCount = issues.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="intervention-header-block" style={{ marginBottom: 'var(--space-lg)' }}>
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
            <strong>MONITOR → PREDICT → EXPLAIN → PRIORITIZE → ACT → AUDIT</strong>
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span>QUEUE STATE: <strong>{issues.length} Operational Case Records</strong></span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span>MODE: <strong>Administrative Decision Support (Officer in the Loop)</strong></span>
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
            [SOURCE: PAIMANA] + [SIMULATED] observations + [PROTOTYPE SESSION LOG]
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
            <ShieldCheck size={18} style={{ color: 'var(--admin-blue-800)' }} />
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
              Intervention &amp; Escalation
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
              MODULE 4
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
            “What should the responsible officer do about this emerging risk?” 
            Action triage, administrative role assignment, apex escalation pathways, and audit-ready resolution tracking.
          </p>
        </div>

        {/* Operational Status Counter Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {newCount > 0 && (
            <div 
              style={{
                padding: '4px 10px',
                backgroundColor: 'var(--risk-critical-bg)',
                border: '1px solid var(--risk-critical-border)',
                borderRadius: 'var(--radius-xs)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--risk-critical-text)' }}>NEW</div>
              <div className="mono-num" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--risk-critical-text)' }}>
                {newCount}
              </div>
            </div>
          )}

          {acknowledgedCount > 0 && (
            <div 
              style={{
                padding: '4px 10px',
                backgroundColor: 'var(--risk-high-bg)',
                border: '1px solid var(--risk-high-border)',
                borderRadius: 'var(--radius-xs)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--risk-high-text)' }}>ACKNOWLEDGED</div>
              <div className="mono-num" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--risk-high-text)' }}>
                {acknowledgedCount}
              </div>
            </div>
          )}

          {underReviewCount > 0 && (
            <div 
              style={{
                padding: '4px 10px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-xs)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#1e40af' }}>UNDER REVIEW</div>
              <div className="mono-num" style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af' }}>
                {underReviewCount}
              </div>
            </div>
          )}

          {escalatedCount > 0 && (
            <div 
              style={{
                padding: '4px 10px',
                backgroundColor: '#fdf2f8',
                border: '1px solid #fbcfe8',
                borderRadius: 'var(--radius-xs)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#9d174d' }}>ESCALATED</div>
              <div className="mono-num" style={{ fontSize: '13px', fontWeight: 700, color: '#9d174d' }}>
                {escalatedCount}
              </div>
            </div>
          )}

          {resolvedCount > 0 && (
            <div 
              style={{
                padding: '4px 10px',
                backgroundColor: 'var(--risk-low-bg)',
                border: '1px solid var(--risk-low-border)',
                borderRadius: 'var(--radius-xs)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--risk-low-text)' }}>RESOLVED</div>
              <div className="mono-num" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--risk-low-text)' }}>
                {resolvedCount}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Screen Navigation Tabs (Screen 1 vs Screen 2) + Reset Demo State */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          marginTop: 'var(--space-md)',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSubViewChange('queue')}
            className={`btn-operational ${activeSubView === 'queue' ? 'btn-primary-action' : 'btn-secondary-action'}`}
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            <Layers size={13} />
            <span>Screen 1: Attention Queue ({issues.length})</span>
          </button>

          <button
            onClick={() => onSubViewChange('detail')}
            className={`btn-operational ${activeSubView === 'detail' ? 'btn-primary-action' : 'btn-secondary-action'}`}
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            <FileText size={13} />
            <span>
              Screen 2: Issue Case File {selectedIssue ? `[${selectedIssue.projectCode}]` : ''}
            </span>
          </button>
        </div>

        {onResetDemoState && (
          <button
            onClick={onResetDemoState}
            className="btn-operational btn-secondary-action"
            title="Reset all intervention states, triage statuses, and notes back to the pristine initial seed distribution"
            style={{
              fontSize: '11px',
              padding: '5px 12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-medium)',
              backgroundColor: 'var(--bg-surface)'
            }}
          >
            <RotateCcw size={12} />
            <span>Reset Demo State</span>
          </button>
        )}
      </div>
    </div>
  );
};
