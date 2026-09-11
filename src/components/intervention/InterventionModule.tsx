import React, { useState } from 'react';
import { InterventionIssue, InterventionStatus, ResponsibleRole, ActionEvent } from '../../types/sentinel';
import { INITIAL_INTERVENTION_ISSUES, getFreshInitialInterventionIssues } from '../../data/interventionData';
import { InterventionHeader } from './InterventionHeader';
import { InterventionAttentionQueue } from './InterventionAttentionQueue';
import { IssueDetailPanel } from './IssueDetailPanel';

interface InterventionModuleProps {
  initialSelectedProjectId?: string | null;
  initialSelectedIssueId?: string | null;
  onOpenProjectIntelligence: (projectId: string) => void;
  onNavigateToEarlyWarning: (projectId: string) => void;
  onOpenEvidence?: (evidenceId: string) => void;
}

export const InterventionModule: React.FC<InterventionModuleProps> = ({
  initialSelectedProjectId,
  initialSelectedIssueId,
  onOpenProjectIntelligence,
  onNavigateToEarlyWarning,
  onOpenEvidence,
}) => {
  const [issues, setIssues] = useState<InterventionIssue[]>(() => {
    return getFreshInitialInterventionIssues();
  });

  const [activeSubView, setActiveSubView] = useState<'queue' | 'detail'>('queue');

  // Find initial selected issue
  const [selectedIssueId, setSelectedIssueId] = useState<string>(() => {
    if (initialSelectedIssueId) {
      const found = INITIAL_INTERVENTION_ISSUES.find((i) => i.id === initialSelectedIssueId);
      if (found) return found.id;
    }
    if (initialSelectedProjectId) {
      const found = INITIAL_INTERVENTION_ISSUES.find((i) => i.projectId === initialSelectedProjectId);
      if (found) return found.id;
    }
    return INITIAL_INTERVENTION_ISSUES[0].id;
  });

  // Explicit demo state reset to clean seed state
  const handleResetDemoState = () => {
    const freshIssues = getFreshInitialInterventionIssues();
    setIssues(freshIssues);
    setSelectedIssueId(freshIssues[0].id);
    setActiveSubView('queue');
  };

  // If initial props change (e.g. user clicked "Review intervention" from Early Warning)
  React.useEffect(() => {
    if (initialSelectedIssueId) {
      setSelectedIssueId(initialSelectedIssueId);
      setActiveSubView('detail');
    } else if (initialSelectedProjectId) {
      const match = issues.find((i) => i.projectId === initialSelectedProjectId);
      if (match) {
        setSelectedIssueId(match.id);
        setActiveSubView('detail');
      }
    }
  }, [initialSelectedIssueId, initialSelectedProjectId]);

  const selectedIssue = issues.find((i) => i.id === selectedIssueId) || issues[0];

  const getFormattedTimestamp = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${mins} IST`;
  };

  // State Transition Handlers
  const handleAcknowledge = (issueId: string) => {
    const timestamp = getFormattedTimestamp();
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        const newAction: ActionEvent = {
          id: `act-${iss.id}-${Date.now()}`,
          issueId: iss.id,
          action: 'Officer Acknowledgment',
          actorRole: 'Portfolio Officer',
          timestamp,
          note: 'Issue formally acknowledged in the review queue. Triage priority confirmed.',
          previousState: iss.status,
          newState: 'ACKNOWLEDGED',
        };
        return {
          ...iss,
          status: 'ACKNOWLEDGED',
          updatedAt: timestamp,
          actionHistory: [newAction, ...iss.actionHistory],
        };
      })
    );
  };

  const handleAssign = (
    issueId: string,
    role: ResponsibleRole,
    assignedTo: string,
    reviewDue: string,
    officerNote: string
  ) => {
    const timestamp = getFormattedTimestamp();
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        const previousState = iss.status;
        const newState: InterventionStatus = iss.status === 'ACKNOWLEDGED' ? 'UNDER REVIEW' : iss.status;
        const newAction: ActionEvent = {
          id: `act-${iss.id}-${Date.now()}`,
          issueId: iss.id,
          action: 'Assignment & Review Parameters Updated',
          actorRole: role,
          timestamp,
          note: `Assigned to ${assignedTo}. Target review date: ${reviewDue}. Notes logged: "${officerNote || 'Parameters updated'}"`,
          previousState,
          newState,
        };
        return {
          ...iss,
          responsibleRole: role,
          assignedTo,
          reviewDue,
          officerNote,
          status: newState,
          updatedAt: timestamp,
          actionHistory: [newAction, ...iss.actionHistory],
        };
      })
    );
  };

  const handleEscalate = (
    issueId: string,
    proposedLevel: string,
    escalationReason: string,
    officerNote: string,
    actorRole: ResponsibleRole
  ) => {
    const timestamp = getFormattedTimestamp();
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        const previousState = iss.status;
        const newAction: ActionEvent = {
          id: `act-${iss.id}-${Date.now()}`,
          issueId: iss.id,
          action: `Escalation Initiated: ${proposedLevel}`,
          actorRole,
          timestamp,
          note: `Escalation reason: "${escalationReason}". Officer justification: "${officerNote}"`,
          previousState,
          newState: 'ESCALATED',
        };
        return {
          ...iss,
          status: 'ESCALATED',
          escalationLevel: proposedLevel,
          updatedAt: timestamp,
          actionHistory: [newAction, ...iss.actionHistory],
        };
      })
    );
  };

  const handleResolve = (
    issueId: string,
    resolutionNote: string,
    evidenceReference: string,
    resolvedByRole: ResponsibleRole
  ) => {
    const timestamp = getFormattedTimestamp();
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id !== issueId) return iss;
        const previousState = iss.status;
        const newAction: ActionEvent = {
          id: `act-${iss.id}-${Date.now()}`,
          issueId: iss.id,
          action: 'Resolution & Audit Closure',
          actorRole: resolvedByRole,
          timestamp,
          note: `Substantive resolution recorded: "${resolutionNote}". Evidence ref: ${evidenceReference}`,
          previousState,
          newState: 'RESOLVED',
        };
        return {
          ...iss,
          status: 'RESOLVED',
          resolutionNote,
          resolvedBy: resolvedByRole,
          resolvedAt: timestamp,
          updatedAt: timestamp,
          actionHistory: [newAction, ...iss.actionHistory],
        };
      })
    );
  };

  return (
    <div className="intervention-module" style={{ marginTop: 'var(--space-lg)' }}>
      {/* Module Header */}
      <InterventionHeader
        issues={issues}
        activeSubView={activeSubView}
        onSubViewChange={setActiveSubView}
        selectedIssue={selectedIssue}
        onResetDemoState={handleResetDemoState}
      />

      {/* Screen 1: Attention Queue */}
      {activeSubView === 'queue' && (
        <InterventionAttentionQueue
          issues={issues}
          selectedIssueId={selectedIssueId}
          onSelectIssue={(issue) => {
            setSelectedIssueId(issue.id);
            setActiveSubView('detail');
          }}
          onAcknowledgeIssue={handleAcknowledge}
          onOpenProjectIntelligence={onOpenProjectIntelligence}
        />
      )}

      {/* Screen 2: Focused Case File Detail */}
      {activeSubView === 'detail' && selectedIssue && (
        <IssueDetailPanel
          issue={selectedIssue}
          onAcknowledge={handleAcknowledge}
          onAssign={handleAssign}
          onEscalate={handleEscalate}
          onResolve={handleResolve}
          onOpenProjectIntelligence={onOpenProjectIntelligence}
          onNavigateToEarlyWarning={onNavigateToEarlyWarning}
          onOpenEvidence={onOpenEvidence}
          onBackToQueue={() => setActiveSubView('queue')}
        />
      )}
    </div>
  );
};
