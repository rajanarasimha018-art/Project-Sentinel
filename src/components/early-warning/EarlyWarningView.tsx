import React, { useState, useMemo, useEffect } from 'react';
import { AttentionQueueItem } from '../../types/sentinel';
import { getEarlyWarningRows } from '../../data/earlyWarningData';
import { EarlyWarningHeader } from './EarlyWarningHeader';
import { EmergingRiskRegister } from './EmergingRiskRegister';
import { RiskTrajectoryAnalyzer } from './RiskTrajectoryAnalyzer';
import { DriverClusters } from './DriverClusters';
import { DataQualityModelStatus } from './DataQualityModelStatus';
import { ExternalConditionsView } from './ExternalConditionsView';
import { Activity, CloudRain, ListFilter } from 'lucide-react';

interface EarlyWarningViewProps {
  allProjects: AttentionQueueItem[];
  selectedProject: AttentionQueueItem;
  initialSubView?: 'register' | 'external-conditions';
  onSelectProject: (item: AttentionQueueItem) => void;
  onOpenProjectIntelligence: (item: AttentionQueueItem) => void;
  onOpenIntervention?: (projectId: string, issueId?: string) => void;
  onOpenEvidence?: (evidenceId?: string, projectId?: string) => void;
}

export const EarlyWarningView: React.FC<EarlyWarningViewProps> = ({
  allProjects,
  selectedProject,
  initialSubView = 'register',
  onSelectProject,
  onOpenProjectIntelligence,
  onOpenIntervention,
  onOpenEvidence,
}) => {
  const [subView, setSubView] = useState<'register' | 'external-conditions'>(initialSubView);
  const [trajectoryProject, setTrajectoryProject] = useState<AttentionQueueItem>(selectedProject);

  useEffect(() => {
    if (initialSubView) {
      setSubView(initialSubView);
    }
  }, [initialSubView]);

  useEffect(() => {
    setTrajectoryProject(selectedProject);
  }, [selectedProject]);

  const rows = useMemo(() => getEarlyWarningRows(), []);

  // Counts calculated deterministically from rows
  const highAttentionCount = rows.filter((r) => r.riskState === 'HIGH_ATTENTION').length;
  const emergingRiskCount = rows.filter((r) => r.riskState === 'EMERGING_RISK').length;

  const sufficientCount = allProjects.filter((p) => p.project.dataQuality === 'SUFFICIENT').length;
  const partialCount = allProjects.filter((p) => p.project.dataQuality === 'PARTIAL').length;
  const insufficientCount = allProjects.filter((p) => p.project.dataQuality === 'INSUFFICIENT').length;

  const handleInspectTrajectory = (item: AttentionQueueItem) => {
    setTrajectoryProject(item);
  };

  const handleViewExternalContext = (item: AttentionQueueItem) => {
    setTrajectoryProject(item);
    onSelectProject(item);
    setSubView('external-conditions');
  };

  return (
    <div className="early-warning-view" style={{ marginTop: 'var(--space-lg)' }}>
      {/* A. EARLY WARNING HEADER & PROVENANCE STRIP */}
      <EarlyWarningHeader
        totalProjectsCount={allProjects.length}
        highAttentionCount={highAttentionCount}
        emergingRiskCount={emergingRiskCount}
      />

      {/* Sub-View Navigation Modes */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-md)',
          borderBottom: '1px solid var(--border-hairline)',
          paddingBottom: '8px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSubView('register')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: subView === 'register' ? 'var(--admin-blue-900)' : '#ffffff',
              color: subView === 'register' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: subView === 'register' ? 'var(--admin-blue-900)' : 'var(--border-medium)',
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            <ListFilter size={13} />
            <span>EMERGING RISK REGISTER &amp; TRAJECTORY</span>
          </button>

          <button
            onClick={() => setSubView('external-conditions')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: subView === 'external-conditions' ? 'var(--admin-blue-900)' : '#ffffff',
              color: subView === 'external-conditions' ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: subView === 'external-conditions' ? 'var(--admin-blue-900)' : 'var(--border-medium)',
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            <CloudRain size={13} />
            <span>EXTERNAL CONDITIONS &amp; WEATHER CONTEXT</span>
            <span style={{ 
              fontSize: '9px', 
              padding: '1px 5px', 
              borderRadius: '2px', 
              backgroundColor: subView === 'external-conditions' ? 'rgba(255,255,255,0.2)' : '#eff6ff', 
              color: subView === 'external-conditions' ? '#ffffff' : '#1e40af',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              M6
            </span>
          </button>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {subView === 'register' 
            ? 'Longitudinal and cross-cycle deterioration signals' 
            : 'Spatial corridor exposure and schedule-window overlap (Causal impact not established)'}
        </div>
      </div>

      {subView === 'external-conditions' ? (
        /* EXTERNAL CONDITIONS VIEW (Milestone 6: Screen 2, 3, 4) */
        <ExternalConditionsView
          allProjects={allProjects}
          selectedProject={trajectoryProject}
          onSelectProject={(item) => {
            setTrajectoryProject(item);
            onSelectProject(item);
          }}
          onOpenProjectIntelligence={onOpenProjectIntelligence}
          onOpenIntervention={onOpenIntervention}
          onOpenEvidence={onOpenEvidence}
          onBackToRegister={() => setSubView('register')}
        />
      ) : (
        /* STANDARD EARLY WARNING SECTIONS */
        <>
          {/* B. EMERGING RISK REGISTER */}
          <EmergingRiskRegister
            rows={rows}
            selectedItem={trajectoryProject}
            onSelectProject={(item) => {
              onSelectProject(item);
              onOpenProjectIntelligence(item);
            }}
            onInspectTrajectory={handleInspectTrajectory}
            onOpenIntervention={onOpenIntervention ? (id) => onOpenIntervention(id) : undefined}
            onViewExternalContext={handleViewExternalContext}
          />

          {/* C. RISK CHANGE / TRAJECTORY */}
          <RiskTrajectoryAnalyzer
            selectedProject={trajectoryProject}
            allProjects={allProjects}
            onSelectProject={handleInspectTrajectory}
            onOpenProjectIntelligence={onOpenProjectIntelligence}
            onViewExternalContext={handleViewExternalContext}
          />

          {/* D. DRIVER CLUSTERS */}
          <DriverClusters
            allProjects={allProjects}
            onSelectProject={(item) => {
              onSelectProject(item);
              onOpenProjectIntelligence(item);
            }}
            onOpenEvidence={onOpenEvidence}
          />

          {/* E. DATA QUALITY & MODEL STATUS */}
          <DataQualityModelStatus
            totalProjects={allProjects.length}
            sufficientCount={sufficientCount}
            partialCount={partialCount}
            insufficientCount={insufficientCount}
          />
        </>
      )}
    </div>
  );
};
