import React, { useState } from 'react';
import { InterventionIssue, InterventionStatus, ResponsibleRole } from '../../types/sentinel';
import { EscalationModal } from './EscalationModal';
import { ResolutionModal } from './ResolutionModal';
import { 
  FileText, 
  CheckSquare, 
  AlertOctagon, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  ExternalLink, 
  UserCheck, 
  HelpCircle, 
  Calendar, 
  ShieldAlert, 
  Layers,
  ArrowLeft
} from 'lucide-react';

interface IssueDetailPanelProps {
  issue: InterventionIssue;
  onAcknowledge: (issueId: string) => void;
  onAssign: (
    issueId: string, 
    role: ResponsibleRole, 
    assignedTo: string, 
    reviewDue: string, 
    officerNote: string
  ) => void;
  onEscalate: (
    issueId: string, 
    proposedLevel: string, 
    escalationReason: string, 
    officerNote: string, 
    actorRole: ResponsibleRole
  ) => void;
  onResolve: (
    issueId: string, 
    resolutionNote: string, 
    evidenceReference: string, 
    resolvedByRole: ResponsibleRole
  ) => void;
  onOpenProjectIntelligence: (projectId: string) => void;
  onNavigateToEarlyWarning: (projectId: string) => void;
  onOpenEvidence?: (evidenceId: string) => void;
  onBackToQueue: () => void;
}

export const IssueDetailPanel: React.FC<IssueDetailPanelProps> = ({
  issue,
  onAcknowledge,
  onAssign,
  onEscalate,
  onResolve,
  onOpenProjectIntelligence,
  onNavigateToEarlyWarning,
  onOpenEvidence,
  onBackToQueue,
}) => {
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  // Assignment form state
  const [assignedRole, setAssignedRole] = useState<ResponsibleRole>(issue.responsibleRole);
  const [assignedOfficer, setAssignedOfficer] = useState<string>(issue.assignedTo);
  const [reviewDue, setReviewDue] = useState<string>(issue.reviewDue);
  const [officerNote, setOfficerNote] = useState<string>(issue.officerNote);
  const [assignmentSavedMessage, setAssignmentSavedMessage] = useState<string | null>(null);

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(issue.id, assignedRole, assignedOfficer, reviewDue, officerNote);
    setAssignmentSavedMessage('Assignment parameters and officer review notes saved to session log.');
    setTimeout(() => setAssignmentSavedMessage(null), 4000);
  };

  const renderStatusBadge = (status: InterventionStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="urgency-badge immediate_48h" style={{ fontWeight: 700 }}>NEW</span>;
      case 'ACKNOWLEDGED':
        return <span className="urgency-badge cycle_priority">ACKNOWLEDGED</span>;
      case 'UNDER REVIEW':
        return (
          <span 
            style={{
              padding: '2px 8px',
              borderRadius: '2px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe'
            }}
          >
            UNDER REVIEW
          </span>
        );
      case 'ESCALATED':
        return (
          <span 
            style={{
              padding: '2px 8px',
              borderRadius: '2px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: '#fdf2f8',
              color: '#9d174d',
              border: '1px solid #fbcfe8'
            }}
          >
            ▲ ESCALATED
          </span>
        );
      case 'RESOLVED':
        return (
          <span 
            style={{
              padding: '2px 8px',
              borderRadius: '2px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: 'var(--risk-low-bg)',
              color: 'var(--risk-low-text)',
              border: '1px solid var(--risk-low-border)'
            }}
          >
            ✓ RESOLVED
          </span>
        );
    }
  };

  return (
    <div className="operational-panel" style={{ marginBottom: 'var(--space-lg)' }}>
      {/* Panel Top Header Bar */}
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onBackToQueue}
              className="btn-operational btn-secondary-action"
              style={{ padding: '3px 8px', fontSize: '11px', marginRight: '4px' }}
              title="Return to Attention Queue"
            >
              <ArrowLeft size={12} />
              <span>Queue</span>
            </button>
            <FileText size={16} style={{ color: 'var(--admin-blue-800)' }} />
            <span>CASE FILE #{issue.id.toUpperCase()}</span>
            <span 
              className="mono-num"
              style={{
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: 'var(--bg-muted)',
                padding: '1px 7px',
                borderRadius: '2px',
                color: 'var(--text-secondary)'
              }}
            >
              {issue.projectCode}
            </span>
          </div>
          <div className="panel-subtitle">
            Administrative investigation dossier and statutory intervention pathway for {issue.projectName}
          </div>
        </div>

        {/* State Transition Actions Top Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {issue.status === 'NEW' && (
            <button
              onClick={() => onAcknowledge(issue.id)}
              className="btn-operational btn-primary-action"
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              <CheckSquare size={13} />
              <span>Acknowledge Issue</span>
            </button>
          )}

          {(issue.status === 'ACKNOWLEDGED' || issue.status === 'UNDER REVIEW') && (
            <>
              <button
                onClick={() => setIsEscalateModalOpen(true)}
                className="btn-operational btn-secondary-action"
                style={{ fontSize: '11px', padding: '6px 12px', color: '#9d174d', borderColor: '#fbcfe8', backgroundColor: '#fdf2f8' }}
              >
                <ArrowUpRight size={13} />
                <span>Escalate Issue</span>
              </button>
              <button
                onClick={() => setIsResolveModalOpen(true)}
                className="btn-operational btn-primary-action"
                style={{ fontSize: '11px', padding: '6px 12px', backgroundColor: 'var(--risk-low-bar)', borderColor: 'var(--risk-low-bar)' }}
              >
                <CheckCircle2 size={13} />
                <span>Resolve Issue</span>
              </button>
            </>
          )}

          {issue.status === 'ESCALATED' && (
            <button
              onClick={() => setIsResolveModalOpen(true)}
              className="btn-operational btn-primary-action"
              style={{ fontSize: '11px', padding: '6px 12px', backgroundColor: 'var(--risk-low-bar)', borderColor: 'var(--risk-low-bar)' }}
            >
              <CheckCircle2 size={13} />
              <span>Record Resolution</span>
            </button>
          )}

          {issue.status === 'RESOLVED' && (
            <span 
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--risk-low-text)',
                backgroundColor: 'var(--risk-low-bg)',
                padding: '4px 10px',
                borderRadius: '2px',
                border: '1px solid var(--risk-low-border)'
              }}
            >
              ✓ Issue Formally Closed
            </span>
          )}
        </div>
      </div>

      {/* Main Case File Grid: 2 Columns */}
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '20px' }}>
        {/* Left Column: Context, Observed Signal, Why It Matters, Decision Support */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1. CONTEXT BLOCK */}
          <div 
            style={{
              padding: '14px',
              backgroundColor: 'var(--bg-paper-tint)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                  INFRASTRUCTURE PROJECT CONTEXT [SOURCE]
                </span>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                  {issue.projectName}
                </h3>
              </div>
              <div>{renderStatusBadge(issue.status)}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span>Code: <strong className="mono-num" style={{ color: 'var(--text-secondary)' }}>{issue.projectCode}</strong></span>
              <span>•</span>
              <span>Sector: <strong style={{ color: 'var(--text-secondary)' }}>{issue.sector}</strong></span>
              <span>•</span>
              <span>State: <strong style={{ color: 'var(--text-secondary)' }}>{issue.state}</strong></span>
              <span>•</span>
              <span>Severity: <strong style={{ color: 'var(--text-secondary)' }}>{issue.severity}</strong></span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <strong>[PROTOTYPE MODEL]</strong> Risk classification — validation in progress
            </div>

            {/* Deep Link Buttons Bar */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-hairline)' }}>
              <button
                onClick={() => onOpenProjectIntelligence(issue.projectId)}
                className="btn-operational btn-secondary-action"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                title="Navigate to single-project forensic dossier"
              >
                <ExternalLink size={12} />
                <span>Open Project Intelligence</span>
              </button>

              <button
                onClick={() => onNavigateToEarlyWarning(issue.projectId)}
                className="btn-operational btn-secondary-action"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                title="Inspect in Early Warning / Risk Monitor"
              >
                <Layers size={12} />
                <span>View Originating Early Warning</span>
              </button>
            </div>
          </div>

          {/* 2. OBSERVED SIGNAL */}
          <div 
            style={{
              padding: '14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--admin-blue-900)', letterSpacing: '0.04em' }}>
                OBSERVED EMPIRICAL SIGNAL
              </span>
              <span className="table-header-provenance" style={{ margin: 0, color: '#b45309', fontWeight: 600 }}>
                [SIMULATED]
              </span>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.45, fontWeight: 500 }}>
              {issue.observedSignal}
            </div>

            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px' }}>
              * Simulated demonstration observation for officer review testing; not an official MoSPI published record.
            </div>

            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PAIMANA Schema Ref:</span>
              <span 
                className="mono-num"
                style={{ 
                  fontSize: '10px', 
                  backgroundColor: 'var(--bg-subtle)', 
                  padding: '2px 6px', 
                  borderRadius: '2px', 
                  color: 'var(--admin-blue-900)' 
                }}
              >
                {issue.primaryDriverFieldRef}
              </span>
            </div>
          </div>

          {/* 3. WHY IT MATTERS */}
          <div 
            style={{
              padding: '14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#9a3412', letterSpacing: '0.04em' }}>
                WHY IT MATTERS (OPERATIONAL IMPACT)
              </span>
              <span className="table-header-provenance" style={{ margin: 0, color: '#b45309', fontWeight: 600 }}>
                [SIMULATED]
              </span>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {issue.whyItMatters}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-hairline)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                <strong>Supporting Evidence On Record: </strong>
                <span>{issue.evidenceSummary}</span>
              </div>
              {onOpenEvidence && issue.evidenceIds && issue.evidenceIds.length > 0 && (
                <button
                  onClick={() => onOpenEvidence(issue.evidenceIds[0])}
                  className="btn-operational btn-secondary-action"
                  style={{ fontSize: '10px', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--admin-blue-800)' }}
                  title="Inspect supporting evidence filing in Evidence Register"
                >
                  <FileText size={11} />
                  <span>Inspect Evidence Dossier →</span>
                </button>
              )}
            </div>
          </div>

          {/* 4. DECISION SUPPORT — FOR OFFICER REVIEW */}
          <div 
            style={{
              padding: '14px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <HelpCircle size={14} style={{ color: '#1e40af' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', letterSpacing: '0.03em' }}>
                DECISION SUPPORT — FOR OFFICER REVIEW
              </span>
            </div>

            <ul style={{ paddingLeft: '18px', fontSize: '11px', color: '#1e3a8a', lineHeight: 1.5, margin: '4px 0 0 0' }}>
              <li><strong>Verify latest milestone status:</strong> Confirm whether the contractor has submitted revised package schedules in the current review cycle.</li>
              <li><strong>Review supporting project records:</strong> Inspect verified DPR filings and regional liaison notes to confirm ground impediment boundaries.</li>
              <li><strong>Check active bottleneck status:</strong> Confirm whether statutory application or land acquisition deposit has been received by the competent authority.</li>
              <li><strong>Confirm responsible stakeholder:</strong> Ensure {issue.assignedTo} has ownership of the active review milestone.</li>
              <li><strong>Determine whether escalation is warranted:</strong> If resolution requires inter-departmental concurrence exceeding project authority, trigger apex escalation.</li>
            </ul>

            <div style={{ marginTop: '8px', fontSize: '10px', color: '#3b82f6', fontStyle: 'italic' }}>
              * Decision-support prompts only. Final administrative action and statutory orders remain with the competent authority.
            </div>
          </div>

          {/* If Resolved, Show Resolution Details */}
          {issue.status === 'RESOLVED' && issue.resolutionNote && (
            <div 
              style={{
                padding: '14px',
                backgroundColor: 'var(--risk-low-bg)',
                border: '1px solid var(--risk-low-border)',
                borderRadius: 'var(--radius-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--risk-low-text)', fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>
                <CheckCircle2 size={15} />
                <span>RESOLVED &amp; ARCHIVED CASE RECORD</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {issue.resolutionNote}
              </div>
              <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
                Resolved by: <strong>{issue.resolvedBy}</strong> on <span className="mono-num">{issue.resolvedAt}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Assignment & Ownership + Audit-Ready Action History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* ASSIGNMENT & OWNERSHIP FORM */}
          <div 
            style={{
              padding: '14px',
              backgroundColor: 'var(--bg-paper-tint)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <UserCheck size={15} style={{ color: 'var(--admin-blue-800)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                ASSIGNMENT &amp; RESPONSIBILITY
              </span>
            </div>

            {assignmentSavedMessage && (
              <div 
                style={{
                  padding: '6px 10px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  fontSize: '11px',
                  borderRadius: '2px',
                  marginBottom: '10px'
                }}
              >
                {assignmentSavedMessage}
              </div>
            )}

            <form onSubmit={handleSaveAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                  RESPONSIBLE ROLE
                </label>
                <select 
                  className="filter-select"
                  value={assignedRole}
                  onChange={(e) => setAssignedRole(e.target.value as ResponsibleRole)}
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

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                  ASSIGNED OFFICER / TEAM (SPOC)
                </label>
                <input 
                  type="text"
                  className="search-input"
                  style={{ width: '100%' }}
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  placeholder="e.g. Chief Project Manager RVNL"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                  REVIEW TARGET DUE DATE
                </label>
                <input 
                  type="text"
                  className="search-input"
                  style={{ width: '100%' }}
                  value={reviewDue}
                  onChange={(e) => setReviewDue(e.target.value)}
                  placeholder="e.g. 25-Mar-2026"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                  OFFICER LOG NOTES
                </label>
                <textarea 
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-editorial)',
                    fontSize: '11px',
                    lineHeight: 1.35,
                    resize: 'vertical'
                  }}
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  placeholder="Enter ongoing investigation notes..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  type="submit"
                  className="btn-operational btn-secondary-action"
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                >
                  Save Assignment &amp; Log
                </button>
              </div>
            </form>
          </div>

          {/* AUDIT-READY ACTION HISTORY TIMELINE */}
          <div 
            style={{
              padding: '14px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)',
              flex: 1
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                AUDIT-READY ACTION LOG ({issue.actionHistory.length})
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                Audit-ready session log — prototype
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {issue.actionHistory.map((act, index) => (
                <div 
                  key={act.id || index}
                  style={{
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-paper-tint)',
                    border: '1px solid var(--border-hairline)',
                    borderRadius: '2px',
                    fontSize: '11px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--admin-blue-900)' }}>
                      {act.action}
                    </span>
                    <span className="mono-num" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                      {act.timestamp}
                    </span>
                  </div>

                  <div style={{ color: 'var(--text-secondary)', lineHeight: 1.35, marginTop: '2px' }}>
                    {act.note}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '9px', color: 'var(--text-muted)' }}>
                    <span>Actor: <strong>{act.actorRole}</strong></span>
                    <span>State: <strong style={{ color: 'var(--text-secondary)' }}>{act.previousState} → {act.newState}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Modal */}
      <EscalationModal
        isOpen={isEscalateModalOpen}
        issue={issue}
        onClose={() => setIsEscalateModalOpen(false)}
        onConfirmEscalate={onEscalate}
      />

      {/* Resolution Modal */}
      <ResolutionModal
        isOpen={isResolveModalOpen}
        issue={issue}
        onClose={() => setIsResolveModalOpen(false)}
        onConfirmResolve={onResolve}
      />
    </div>
  );
};
