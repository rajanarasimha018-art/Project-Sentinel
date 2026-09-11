import React from 'react';
import { AttentionQueueItem } from '../../types/sentinel';
import { ProjectHeader } from './ProjectHeader';
import { ProjectVitalSigns } from './ProjectVitalSigns';
import { ProjectHistoricalTimeline } from './ProjectHistoricalTimeline';
import { ObservedProgressChart } from './ObservedProgressChart';
import { RiskExplanation } from './RiskExplanation';
import { EvidenceProvenanceDossier } from './EvidenceProvenanceDossier';
import { ProjectActionProtocol } from './ProjectActionProtocol';

interface ProjectIntelligenceViewProps {
  projectItem: AttentionQueueItem;
  allProjects: AttentionQueueItem[];
  onSelectProject: (item: AttentionQueueItem) => void;
  onBackToCockpit: () => void;
  onActionTriggered?: (actionName: string, projectName: string) => void;
  onOpenIntervention?: (projectId: string) => void;
  onOpenEvidence?: (evidenceId?: string) => void;
  onOpenExternalConditions?: (projectId: string) => void;
}

export const ProjectIntelligenceView: React.FC<ProjectIntelligenceViewProps> = ({
  projectItem,
  allProjects,
  onSelectProject,
  onBackToCockpit,
  onActionTriggered,
  onOpenIntervention,
  onOpenEvidence,
  onOpenExternalConditions,
}) => {
  return (
    <div className="project-intelligence-view">
      {/* 1. Context & Identity */}
      <ProjectHeader
        projectItem={projectItem}
        allProjects={allProjects}
        onSelectProject={onSelectProject}
        onBackToCockpit={onBackToCockpit}
        onOpenExternalConditions={onOpenExternalConditions}
      />

      {/* 2. Current State & Measurable Vital Signs */}
      <ProjectVitalSigns projectItem={projectItem} />

      {/* 3. Longitudinal Monitoring Timeline (What Changed Between Cycles?) */}
      <ProjectHistoricalTimeline cycles={projectItem.historicalCycles} />

      {/* 4 & 5. Observed Progress Trajectory & Risk Explanation (2-Column Grid) */}
      <div className="cockpit-grid-2col" style={{ marginBottom: 'var(--space-lg)' }}>
        <div>
          <ObservedProgressChart cycles={projectItem.historicalCycles} />
        </div>
        <div>
          <RiskExplanation projectItem={projectItem} />
        </div>
      </div>

      {/* 6. Evidence Provenance Dossier */}
      <EvidenceProvenanceDossier 
        evidenceItems={projectItem.evidenceProvenance} 
        onOpenEvidence={onOpenEvidence}
      />

      {/* 7. Action & Intervention Decision Protocol */}
      <ProjectActionProtocol
        actionGuidance={projectItem.actionGuidance}
        projectName={projectItem.project.name}
        onActionTriggered={onActionTriggered}
        onOpenIntervention={onOpenIntervention ? () => onOpenIntervention(projectItem.project.id) : undefined}
      />
    </div>
  );
};
