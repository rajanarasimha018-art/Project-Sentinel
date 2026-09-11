import React, { useState } from 'react';
import { InterventionIssue, ResponsibleRole } from '../../types/sentinel';
import { CheckCircle2, X, FileCheck, ShieldCheck } from 'lucide-react';

interface ResolutionModalProps {
  isOpen: boolean;
  issue: InterventionIssue;
  onClose: () => void;
  onConfirmResolve: (
    issueId: string,
    resolutionNote: string,
    evidenceReference: string,
    resolvedByRole: ResponsibleRole
  ) => void;
}

export const ResolutionModal: React.FC<ResolutionModalProps> = ({
  isOpen,
  issue,
  onClose,
  onConfirmResolve,
}) => {
  const [resolutionNote, setResolutionNote] = useState<string>('');
  const [evidenceReference, setEvidenceReference] = useState<string>(
    issue.evidenceSummary || 'Official Site Inspection Signoff Memo'
  );
  const [resolvedByRole, setResolvedByRole] = useState<ResponsibleRole>(
    issue.responsibleRole || 'Project Authority'
  );
  const [isVerifiedCheck, setIsVerifiedCheck] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNote.trim()) {
      alert('A substantive resolution note is required to close this issue.');
      return;
    }
    if (!evidenceReference.trim()) {
      alert('Please specify the supporting evidence document or inspection reference.');
      return;
    }
    if (!isVerifiedCheck) {
      alert('Please confirm that physical or statutory verification has occurred.');
      return;
    }

    onConfirmResolve(issue.id, resolutionNote, evidenceReference, resolvedByRole);
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
            backgroundColor: 'var(--risk-low-bg)',
            borderBottom: '1px solid var(--risk-low-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--risk-low-text)' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.04em' }}>
              ISSUE RESOLUTION &amp; AUDIT CLOSURE
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
              Resolving Signal: {issue.primaryDriver}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Current State: <strong>{issue.status}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Resolving Authority Role */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                RESOLVING OFFICER ROLE <span style={{ color: 'var(--risk-critical-text)' }}>*</span>
              </label>
              <select 
                className="filter-select"
                value={resolvedByRole}
                onChange={(e) => setResolvedByRole(e.target.value as ResponsibleRole)}
                style={{ width: '100%' }}
              >
                <option value="Project Authority">Project Authority (CMD / Director Infra)</option>
                <option value="Portfolio Officer">Portfolio Officer (Central Monitoring Cell)</option>
                <option value="Project Manager">Project Manager (Chief Project Manager)</option>
                <option value="Department/Nodal Officer">Department/Nodal Officer (Ministry Division Head)</option>
                <option value="Field Officer">Field Officer (Executive Engineer / SPOC)</option>
                <option value="Auditor/Reviewer">Auditor/Reviewer (Independent Engineer)</option>
              </select>
            </div>

            {/* Resolution Note */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                SUBSTANTIVE RESOLUTION NOTE <span style={{ color: 'var(--risk-critical-text)' }}>*</span>
              </label>
              <textarea 
                rows={4}
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
                placeholder="Explain how the clearance was granted, contractor funds disbursed, land RoW handed over, or technical bottleneck resolved..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                required
              />
            </div>

            {/* Resolution Evidence / Document Reference */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                EVIDENCE / STATUTORY DOCUMENT REFERENCE <span style={{ color: 'var(--risk-critical-text)' }}>*</span>
              </label>
              <input 
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="e.g. State Forest Advisory Board Sanction Memo #SF-2026/842"
                value={evidenceReference}
                onChange={(e) => setEvidenceReference(e.target.value)}
                required
              />
            </div>

            {/* Verification Checkbox */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-hairline)',
                borderRadius: '2px'
              }}
            >
              <input 
                type="checkbox"
                id="resolve-audit-check"
                checked={isVerifiedCheck}
                onChange={(e) => setIsVerifiedCheck(e.target.checked)}
                style={{ marginTop: '2px', cursor: 'pointer' }}
              />
              <label htmlFor="resolve-audit-check" style={{ fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.4, cursor: 'pointer' }}>
                <strong>Audit Confirmation:</strong> I confirm that supporting documentation has been verified in project records and the critical bottleneck is formally addressed.
              </label>
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
              style={{ backgroundColor: 'var(--risk-low-bar)', borderColor: 'var(--risk-low-bar)' }}
            >
              <FileCheck size={13} />
              <span>Record Resolution &amp; Archive</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
