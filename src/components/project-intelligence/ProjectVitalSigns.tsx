import React from 'react';
import { AttentionQueueItem } from '../../types/sentinel';

interface ProjectVitalSignsProps {
  projectItem: AttentionQueueItem;
}

export const ProjectVitalSigns: React.FC<ProjectVitalSignsProps> = ({ projectItem }) => {
  const { project } = projectItem;

  // Exact calculated indicators
  const costVarianceCr = project.anticipatedCostCr - project.sanctionedCostCr;
  const costVariancePct = Number(((costVarianceCr / project.sanctionedCostCr) * 100).toFixed(1));

  // Date variance in months approximation
  const origDate = new Date(project.originalCompletionDate);
  const antDate = new Date(project.anticipatedCompletionDate);
  const diffMonths = Math.max(
    0,
    Math.round((antDate.getTime() - origDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  );

  return (
    <div className="operational-panel" style={{ marginBottom: 'var(--space-lg)' }}>
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <span>MEASURABLE VITAL SIGNS &amp; SCHEDULE / FINANCIAL VARIANCE</span>
          </div>
          <div className="panel-subtitle">
            Source-supported indicators extracted from official PAIMANA reference submission
          </div>
        </div>
        <div className="panel-actions">
          <span 
            className="demo-layer-pill" 
            style={{ fontSize: '9px', background: '#fff', border: '1px solid var(--border-medium)', color: '#475569' }}
          >
            [SOURCE-DERIVED &amp; CALCULATED METRICS]
          </span>
        </div>
      </div>

      <div 
        style={{ 
          padding: '16px 20px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px',
          backgroundColor: '#fafbfc'
        }}
      >
        {/* 1. Physical Progress */}
        <div style={{ padding: '12px', background: '#fff', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Physical Progress
            </span>
            <span style={{ fontSize: '8.5px', fontFamily: 'var(--font-mono)', color: 'var(--admin-blue-700)', fontWeight: 600 }}>
              [SOURCE]
            </span>
          </div>
          <div className="mono-num" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {project.physicalProgressPct}%
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Reported site completion milestone
          </div>
        </div>

        {/* 2. Cumulative Expenditure & Financial Progress */}
        <div style={{ padding: '12px', background: '#fff', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Cumulative Spend
            </span>
            <span style={{ fontSize: '8.5px', fontFamily: 'var(--font-mono)', color: 'var(--admin-blue-700)', fontWeight: 600 }}>
              [SOURCE]
            </span>
          </div>
          <div className="mono-num" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            ₹{project.cumulativeExpenditureCr.toLocaleString()} Cr
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Financial progress: <strong className="mono-num">{project.financialProgressPct}%</strong> of sanctioned
          </div>
        </div>

        {/* 3. Cost Variance */}
        <div style={{ padding: '12px', background: '#fff', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Cost Variance
            </span>
            <span style={{ fontSize: '8.5px', fontFamily: 'var(--font-mono)', color: '#166534', fontWeight: 600 }}>
              [CALCULATED]
            </span>
          </div>
          <div 
            className="mono-num" 
            style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: costVarianceCr > 0 ? 'var(--risk-critical-text)' : 'var(--risk-low-text)' 
            }}
          >
            {costVarianceCr > 0 ? `+₹${costVarianceCr.toLocaleString()} Cr` : '₹0 Cr'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {costVarianceCr > 0 ? (
              <span>Sanctioned: ₹{project.sanctionedCostCr.toLocaleString()} Cr &rarr; Ant: ₹{project.anticipatedCostCr.toLocaleString()} Cr ({costVariancePct > 0 ? `+${costVariancePct}%` : '0%'})</span>
            ) : (
              <span>Within sanctioned estimate of ₹{project.sanctionedCostCr.toLocaleString()} Cr</span>
            )}
          </div>
        </div>

        {/* 4. Observed Schedule Variance */}
        <div style={{ padding: '12px', background: '#fff', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Observed Schedule Slip
            </span>
            <span style={{ fontSize: '8.5px', fontFamily: 'var(--font-mono)', color: '#166534', fontWeight: 600 }}>
              [CALCULATED]
            </span>
          </div>
          <div 
            className="mono-num" 
            style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: diffMonths > 0 ? 'var(--risk-high-text)' : 'var(--risk-low-text)' 
            }}
          >
            {diffMonths > 0 ? `+${diffMonths} Months` : 'On Schedule'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Original COD: <span className="mono-num">{project.originalCompletionDate}</span> &rarr; Current: <span className="mono-num">{project.anticipatedCompletionDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
