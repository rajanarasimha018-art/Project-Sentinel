import React from 'react';
import { AlertTriangle, Database, Activity, GitBranch } from 'lucide-react';

interface EarlyWarningHeaderProps {
  totalProjectsCount: number;
  highAttentionCount: number;
  emergingRiskCount: number;
}

export const EarlyWarningHeader: React.FC<EarlyWarningHeaderProps> = ({
  totalProjectsCount,
  highAttentionCount,
  emergingRiskCount,
}) => {
  return (
    <div className="early-warning-header-block" style={{ marginBottom: 'var(--space-lg)' }}>
      {/* Top Provenance & Methodology Strip */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span>
            <span>SOURCE:</span>
            <strong>MoSPI PAIMANA Reference Records</strong>
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Database size={12} style={{ color: 'var(--text-muted)' }} />
            <span>DATA STATE:</span>
            <strong>{totalProjectsCount} Loaded Reference Projects</strong>
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Activity size={12} style={{ color: '#d97706' }} />
            <span>MODEL STATE:</span>
            <strong>Validation in Progress on MoSPI Records</strong>
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
            <GitBranch size={12} />
            <span>EXTERNAL FEEDS:</span>
            <span>Not Connected (Standalone Baseline)</span>
          </span>
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
            SIH26103 MONITORING INTELLIGENCE
          </span>
        </div>
      </div>

      {/* Main Title & Operational Description */}
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
            <AlertTriangle size={18} style={{ color: '#b45309' }} />
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
              Early Warning / Risk Monitor
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
              MODULE 3
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
            Detecting emerging project deterioration before it becomes an operational delay. 
            Monitors longitudinal trajectories, schedule revision velocity, and expenditure divergence across reporting cycles.
          </p>
        </div>

        {/* Operational Context Counters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--risk-critical-bg)',
              border: '1px solid var(--risk-critical-border)',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'right'
            }}
          >
            <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--risk-critical-text)', letterSpacing: '0.04em' }}>
              HIGH ATTENTION
            </div>
            <div className="mono-num" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--risk-critical-text)' }}>
              {highAttentionCount} Projects
            </div>
          </div>

          <div 
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--risk-high-bg)',
              border: '1px solid var(--risk-high-border)',
              borderRadius: 'var(--radius-xs)',
              textAlign: 'right'
            }}
          >
            <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--risk-high-text)', letterSpacing: '0.04em' }}>
              EMERGING RISK
            </div>
            <div className="mono-num" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--risk-high-text)' }}>
              {emergingRiskCount} Projects
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
