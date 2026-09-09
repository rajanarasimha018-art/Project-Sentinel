import React, { useEffect } from 'react';
import { AttentionQueueItem } from '../types/sentinel';
import { 
  X, 
  AlertOctagon, 
  FileText, 
  Crosshair, 
  Users, 
  CheckSquare, 
  ArrowRight, 
  Download,
  Send,
  Building2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface ActionPathDrawerProps {
  item: AttentionQueueItem | null;
  onClose: () => void;
  onActionTriggered?: (actionName: string, projectName: string) => void;
}

export const ActionPathDrawer: React.FC<ActionPathDrawerProps> = ({
  item,
  onClose,
  onActionTriggered
}) => {
  // Handle ESC key to dismiss drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const { project, riskFactors, evidence, actionGuidance } = item;

  const handleAction = (actionName: string) => {
    if (onActionTriggered) {
      onActionTriggered(actionName, project.name);
    }
  };

  return (
    <div className="action-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="action-drawer" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="drawer-project-code">{project.code}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>•</span>
              <span className={`risk-badge ${item.riskLevel.toLowerCase()}`}>
                {(item.riskScore * 100).toFixed(0)}/100 {item.riskLevel}
              </span>
            </div>
            <h2 className="drawer-project-name">{project.name}</h2>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={12} />
              <span>{project.implementingAgency}</span>
              <span>•</span>
              <span>{project.state}</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="drawer-close-btn"
            aria-label="Close Action Path Inspector"
            title="Close Inspector (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Project Financial & Schedule Metadata Strip */}
        <div 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#f8fafc', 
            borderBottom: '1px solid var(--border-hairline)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            fontSize: '11px'
          }}
        >
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Sanctioned Cost</div>
            <strong className="mono-num">₹{project.sanctionedCostCr.toLocaleString()} Cr</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Anticipated Outturn</div>
            <strong className="mono-num" style={{ color: project.anticipatedCostCr > project.sanctionedCostCr ? 'var(--risk-high-text)' : 'inherit' }}>
              ₹{project.anticipatedCostCr.toLocaleString()} Cr
            </strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Physical Progress</div>
            <strong className="mono-num">{project.physicalProgressPct}%</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Target COD</div>
            <strong className="mono-num">{project.anticipatedCompletionDate}</strong>
          </div>
        </div>

        {/* 5-Step Operational Action Path */}
        <div className="drawer-body">
          {/* STEP 1: Current State & Risk Detected */}
          <div className="path-step">
            <div className="path-step-num">Step 01 • Risk Detected</div>
            <div className="path-step-title">Risk Severity &amp; Model Confidence Assessment</div>
            <div className="path-step-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className={`risk-badge ${item.riskLevel.toLowerCase()}`} style={{ fontSize: '12px', padding: '3px 8px' }}>
                  Risk Index: {(item.riskScore * 100).toFixed(1)}/100 ({item.riskLevel})
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Confidence: <strong className="mono-num" style={{ color: '#166534' }}>{item.modelConfidencePct}%</strong>
                </span>
              </div>
              <p>
                <strong>Primary Signal: </strong>{item.primarySignal}
              </p>
              <p style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
                <strong>Recent Delta: </strong>{item.recentChange}
              </p>
            </div>
          </div>

          {/* STEP 2: Why? (Root Risk Factors Breakdown) */}
          <div className="path-step">
            <div className="path-step-num">Step 02 • Why Is It Becoming Risky?</div>
            <div className="path-step-title">Attributed Ground Risk Factors</div>
            <div className="path-step-content">
              {riskFactors.map((factor) => (
                <div key={factor.id} style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#fafbfc', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '12px' }}>
                      {factor.title}
                    </span>
                    <span className="mono-num" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--risk-critical-text)' }}>
                      {factor.weightPct}% contribution
                    </span>
                  </div>

                  <div className="factor-bar-track">
                    <div 
                      className="factor-bar-fill" 
                      style={{ 
                        width: `${factor.weightPct}%`,
                        backgroundColor: factor.severity === 'CRITICAL' ? 'var(--risk-critical-bar)' : 'var(--risk-high-bar)'
                      }} 
                    />
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '5px' }}>
                    {factor.groundObservation}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    PAIMANA Telemetry Tag: {factor.paimanaFieldRef}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: What Evidence? */}
          <div className="path-step">
            <div className="path-step-num">Step 03 • What Evidence?</div>
            <div className="path-step-title">Linked Supporting Submissions &amp; Audits</div>
            <div className="path-step-content">
              {evidence.map((ev) => (
                <div key={ev.id} className="evidence-box">
                  <div className="evidence-header">
                    <span>{ev.documentTitle}</span>
                    <span 
                      style={{ 
                        fontSize: '9px', 
                        padding: '1px 5px', 
                        borderRadius: '2px',
                        backgroundColor: ev.verificationStatus === 'VERIFIED' ? '#dcfce7' : '#fee2e2',
                        color: ev.verificationStatus === 'VERIFIED' ? '#166534' : '#991b1b',
                        fontWeight: 700
                      }}
                    >
                      {ev.verificationStatus}
                    </span>
                  </div>
                  <div className="evidence-meta">
                    Authority: {ev.issuingAuthority} • Recorded Date: {ev.date}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {ev.summary}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 4: What Should Be Reviewed? */}
          <div className="path-step">
            <div className="path-step-num">Step 04 • What Should Be Reviewed?</div>
            <div className="path-step-title">Critical Path Bottleneck &amp; Decision Framework</div>
            <div className="path-step-content">
              <div style={{ padding: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '2px' }}>
                <div style={{ fontSize: '11px', color: 'var(--admin-blue-900)', fontWeight: 600 }}>
                  Immediate Critical Path Focus:
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a8a', marginTop: '2px' }}>
                  {actionGuidance.criticalPathMilestone}
                </div>
                <div style={{ fontSize: '11px', color: '#1e40af', marginTop: '4px' }}>
                  Estimated Schedule Slippage: <strong className="mono-num">+{actionGuidance.projectedStallDays} days</strong> if unaddressed
                </div>
              </div>

              <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <strong>Recommended Operational Decision:</strong>
                <p style={{ marginTop: '3px', lineHeight: 1.45 }}>{actionGuidance.recommendedDecision}</p>
              </div>

              <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <strong>Mandatory Statutory Next Step: </strong>
                <span>{actionGuidance.statutoryNextStep}</span>
              </div>
            </div>
          </div>

          {/* STEP 5: Who Should Act? */}
          <div className="path-step">
            <div className="path-step-num">Step 05 • Who Should Act?</div>
            <div className="path-step-title">Designated Competent Authority &amp; Field Officers</div>
            <div className="path-step-content">
              <div style={{ marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Competent Escalation Authority:
                </span>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '12px' }}>
                  {actionGuidance.competentAuthority}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--admin-blue-800)', fontWeight: 600, marginTop: '2px' }}>
                  Level: {actionGuidance.escalationLevel}
                </div>
              </div>

              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Mandated Field Officers (SPOCs):
                </span>
                <ul style={{ paddingLeft: '16px', marginTop: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {actionGuidance.fieldOfficers.map((officer, idx) => (
                    <li key={idx}>{officer}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons for Officers */}
          <div 
            style={{ 
              marginTop: '10px', 
              paddingTop: '16px', 
              borderTop: '1px solid var(--border-hairline)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Execute Direct Operational Actions:
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleAction('Flag for PRAGATI / Apex Agenda')}
                className="btn-operational btn-primary-action"
                style={{ flex: 1, padding: '8px 12px' }}
              >
                <AlertOctagon size={13} />
                <span>Flag for PRAGATI / Apex Agenda</span>
              </button>

              <button 
                onClick={() => handleAction('Issue Formal Clarification Notice')}
                className="btn-operational btn-secondary-action"
                style={{ flex: 1, padding: '8px 12px' }}
              >
                <Send size={13} />
                <span>Issue Clarification Notice</span>
              </button>
            </div>

            <button 
              onClick={() => handleAction('Generate Operational Briefing Memo')}
              className="btn-operational btn-secondary-action"
              style={{ width: '100%', padding: '7px 12px' }}
            >
              <Download size={13} />
              <span>Download Project Review Dossier (PDF Brief)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
