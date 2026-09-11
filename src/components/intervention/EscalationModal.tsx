import React, { useState } from 'react';
import { InterventionIssue, ResponsibleRole } from '../../types/sentinel';
import { AlertOctagon, X, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface EscalationModalProps {
  isOpen: boolean;
  issue: InterventionIssue;
  onClose: () => void;
  onConfirmEscalate: (
    issueId: string,
    proposedLevel: string,
    escalationReason: string,
    officerNote: string,
    actorRole: ResponsibleRole
  ) => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  issue,
  onClose,
  onConfirmEscalate,
}) => {
  const [proposedLevel, setProposedLevel] = useState<string>(issue.escalationLevel || 'Ministry / Apex Review');
  const [escalationReason, setEscalationReason] = useState<string>(
    'Critical path bottleneck exceeds project-level administrative authority. Apex inter-ministerial coordination required.'
  );
  const [officerNote, setOfficerNote] = useState<string>('');
  const [actorRole, setActorRole] = useState<ResponsibleRole>(issue.responsibleRole || 'Portfolio Officer');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNote.trim()) {
      alert('Please enter an officer review note explaining the escalation rationale.');
      return;
    }
    onConfirmEscalate(issue.id, proposedLevel, escalationReason, officerNote, actorRole);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-medium)',
          maxWidth: '620px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          style={{
            padding: '14px 20px',
            backgroundColor: 'var(--risk-critical-bg)',
            borderBottom: '1px solid var(--risk-critical-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--risk-critical-text)' }}>
            <AlertOctagon size={18} />
            <span style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.04em' }}>
              ESCALATION PROTOCOL — ADMINISTRATIVE INITIATION
            </span>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {/* Issue Summary Context */}
          <div 
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--bg-paper-tint)',
              border: '1px solid var(--border-hairline)',
              borderRadius: '2px',
              marginBottom: '16px'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Project: <strong style={{ color: 'var(--text-primary)' }}>{issue.projectName}</strong> ({issue.projectCode})
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
              Signal: {issue.primaryDriver}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--risk-critical-text)', marginTop: '2px', fontWeight: 500 }}>
              Current State: {issue.status} • Severity: {issue.severity}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              [PROTOTYPE MODEL] Risk classification — validation in progress
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Proposed Escalation Level */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                PROPOSED ESCALATION TIER
              </label>
              <select 
                className="filter-select"
                value={proposedLevel}
                onChange={(e) => setProposedLevel(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="Ministry / Apex Review">Ministry / Apex Review (Cabinet Secretariat / PMG)</option>
                <option value="Railway Board Technical Review">Railway Board Technical Review (Member Infrastructure)</option>
                <option value="State Chief Secretary Joint Committee">State Chief Secretary Joint Committee (Inter-Agency Coordination)</option>
                <option value="Ministry of Ports & Shipping Review">Ministry of Ports &amp; Shipping Review</option>
                <option value="State Urban Development Review">State Urban Development Department</option>
                <option value="Regulatory Signoff Directorate">Regulatory Authority Directorate (DGCA / PESO / CERC)</option>
              </select>
            </div>

            {/* Acting Officer Role */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                ESCALATING OFFICER ROLE
              </label>
              <select 
                className="filter-select"
                value={actorRole}
                onChange={(e) => setActorRole(e.target.value as ResponsibleRole)}
                style={{ width: '100%' }}
              >
                <option value="Portfolio Officer">Portfolio Officer</option>
                <option value="Project Authority">Project Authority</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Department/Nodal Officer">Department/Nodal Officer</option>
                <option value="Field Officer">Field Officer</option>
                <option value="Auditor/Reviewer">Auditor/Reviewer</option>
              </select>
            </div>

            {/* Escalation Rationale */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                ESCALATION RATIONALE
              </label>
              <input 
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
              />
            </div>

            {/* Officer Note */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                OFFICER REVIEW NOTE / SUPPORTING JUSTIFICATION <span style={{ color: 'var(--risk-critical-text)' }}>*</span>
              </label>
              <textarea 
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-xs)',
                  fontFamily: 'var(--font-editorial)',
                  fontSize: '12px',
                  lineHeight: 1.4,
                  resize: 'vertical'
                }}
                placeholder="Enter engineering justification, evidence reference, or statutory impediment context..."
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                required
              />
            </div>

            {/* Supporting Evidence Reference */}
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              <strong>Supporting Evidence Referenced: </strong>
              <span>{issue.evidenceSummary}</span>
            </div>

            {/* Prototype Disclaimer */}
            <div 
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-hairline)',
                borderRadius: '2px',
                fontSize: '11px',
                color: 'var(--text-muted)',
                lineHeight: 1.35
              }}
            >
              ⚠ <strong>Administrative Protocol Notice:</strong> This action updates the internal ProjectSentinel monitoring record to <strong>ESCALATED</strong> and logs an entry in the Audit-ready session log — prototype. It does not transmit external statutory orders to real government ministries.
            </div>
          </div>

          {/* Modal Actions */}
          <div 
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px',
              paddingTop: '14px',
              borderTop: '1px solid var(--border-hairline)'
            }}
          >
            <button 
              type="button" 
              onClick={onClose}
              className="btn-operational btn-secondary-action"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-operational btn-primary-action"
              style={{ backgroundColor: 'var(--risk-critical-bar)', borderColor: 'var(--risk-critical-bar)' }}
            >
              <ArrowUpRight size={13} />
              <span>Confirm &amp; Record Escalation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
