import React from 'react';
import { ActionGuidance } from '../../types/sentinel';
import { AlertOctagon, Send, Download, CheckSquare, Clock } from 'lucide-react';

interface ProjectActionProtocolProps {
  actionGuidance: ActionGuidance;
  projectName: string;
  onActionTriggered?: (actionName: string, projectName: string) => void;
  onOpenIntervention?: () => void;
}

export const ProjectActionProtocol: React.FC<ProjectActionProtocolProps> = ({
  actionGuidance,
  projectName,
  onActionTriggered,
  onOpenIntervention,
}) => {
  const handleAction = (name: string) => {
    if (onActionTriggered) onActionTriggered(name, projectName);
  };

  return (
    <div className="operational-panel" style={{ marginBottom: 'var(--space-lg)' }}>
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <CheckSquare size={15} style={{ color: 'var(--admin-blue-800)' }} />
            <span>OPERATIONAL REVIEW TARGET &amp; INTERVENTION PROTOCOL</span>
          </div>
          <div className="panel-subtitle">
            “What may happen and what should be reviewed next?” — Targeted administrative action pathway
          </div>
        </div>

        <div className="panel-actions">
          <span 
            className="demo-layer-pill" 
            style={{ fontSize: '9px', background: '#fff', border: '1px solid var(--border-medium)', color: '#475569' }}
          >
            DECISION WORKFLOW PROTOCOL
          </span>
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left: What May Happen (Critical Path Bottleneck) */}
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>
            What May Happen (Critical Path Bottleneck)
          </div>

          <div style={{ padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '2px', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', color: 'var(--admin-blue-800)', fontWeight: 600, textTransform: 'uppercase' }}>
              Next Critical Path Milestone:
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--admin-blue-900)', marginTop: '2px' }}>
              {actionGuidance.criticalPathMilestone}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--admin-blue-800)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              <span>Illustrative scenario: <strong className="mono-num">+{actionGuidance.projectedStallDays} days</strong> if the identified bottleneck persists</span>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            <strong>Decision Support — For Officer Review:</strong>
            <p style={{ marginTop: '3px' }}>{actionGuidance.recommendedDecision}</p>
            <p style={{ marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Final action remains with the competent authority.
            </p>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <strong>Statutory / Contractual Check: </strong>
            <span>{actionGuidance.statutoryNextStep}</span>
          </div>
        </div>

        {/* Right: Who Should Act & Administrative Triggers */}
        <div style={{ borderLeft: '1px solid var(--border-hairline)', paddingLeft: '20px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>
            Who Should Act &amp; Escalation Tier
          </div>

          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Competent Authority:</span>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1px' }}>
              {actionGuidance.competentAuthority}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--admin-blue-800)', fontWeight: 600, marginTop: '2px' }}>
              Tier: {actionGuidance.escalationLevel}
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Mandated Field Officers (SPOCs):</span>
            <ul style={{ paddingLeft: '16px', marginTop: '3px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              {actionGuidance.fieldOfficers.map((officer, idx) => (
                <li key={idx}>{officer}</li>
              ))}
            </ul>
          </div>

          {/* Action Trigger Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleAction('Flag for Inter-Ministerial Review')}
                className="btn-operational btn-primary-action"
                style={{ flex: 1, padding: '7px 10px' }}
              >
                <AlertOctagon size={12} />
                <span>Flag for Apex Review</span>
              </button>
              <button
                onClick={() => handleAction('Issue Clarification Notice')}
                className="btn-operational btn-secondary-action"
                style={{ flex: 1, padding: '7px 10px' }}
              >
                <Send size={12} />
                <span>Issue Notice</span>
              </button>
            </div>

            <button
              onClick={() => handleAction('Generate Project Review Dossier')}
              className="btn-operational btn-secondary-action"
              style={{ width: '100%', padding: '6px 10px' }}
            >
              <Download size={12} />
              <span>Download Project Review Dossier (PDF Brief)</span>
            </button>

            {onOpenIntervention && (
              <button
                onClick={onOpenIntervention}
                className="btn-operational btn-secondary-action"
                style={{ width: '100%', padding: '7px 10px', color: 'var(--admin-blue-900)', backgroundColor: 'var(--admin-blue-50)', borderColor: 'var(--admin-blue-100)', fontWeight: 600 }}
                title="Navigate to Intervention & Escalation module for this project"
              >
                <CheckSquare size={12} />
                <span>Open Related Action in Intervention &amp; Escalation</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
