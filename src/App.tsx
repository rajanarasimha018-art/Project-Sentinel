import React, { useState } from 'react';
import { 
  MOCK_PORTFOLIO_SUMMARY, 
  MOCK_RISK_DISTRIBUTION, 
  MOCK_QUARTERLY_TRENDS, 
  MOCK_DATA_QUALITY_SUMMARY, 
  MOCK_ATTENTION_QUEUE 
} from './data/mockPaimanaData';
import { AttentionQueueItem } from './types/sentinel';
import { HeaderContext } from './components/HeaderContext';
import { PortfolioSummary } from './components/PortfolioSummary';
import { AttentionQueue } from './components/AttentionQueue';
import { RiskDistribution } from './components/RiskDistribution';
import { RiskTrendChart } from './components/RiskTrendChart';
import { NationalProjectMap } from './components/NationalProjectMap';
import { DataQualityConfidence } from './components/DataQualityConfidence';
import { ActionPathDrawer } from './components/ActionPathDrawer';
import { DataArchitectureModal } from './components/DataArchitectureModal';
import { ProjectIntelligenceView } from './components/project-intelligence/ProjectIntelligenceView';
import { EarlyWarningView } from './components/early-warning/EarlyWarningView';
import { InterventionModule } from './components/intervention/InterventionModule';
import { EvidenceModule } from './components/evidence/EvidenceModule';
import { CheckCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('cockpit');
  const [selectedProject, setSelectedProject] = useState<AttentionQueueItem>(MOCK_ATTENTION_QUEUE[0]);
  const [selectedInterventionProjectId, setSelectedInterventionProjectId] = useState<string | null>(null);
  const [selectedInterventionIssueId, setSelectedInterventionIssueId] = useState<string | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [selectedEvidenceProjectId, setSelectedEvidenceProjectId] = useState<string | null>(null);
  const [earlyWarningSubView, setEarlyWarningSubView] = useState<'register' | 'external-conditions'>('register');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [actionNotification, setActionNotification] = useState<string | null>(null);

  const handleTabSelect = (tab: string) => {
    if (tab === 'cockpit' || tab === 'projects' || tab === 'early-warning' || tab === 'intervention' || tab === 'evidence') {
      if (tab === 'early-warning') setEarlyWarningSubView('register');
      setActiveTab(tab);
    } else {
      setActionNotification(`Navigation to [${tab.toUpperCase()}] is scheduled for subsequent ProjectSentinel rounds. Current active modules: Cockpit, Project Intelligence, Early Warning, Intervention, & Evidence.`);
      setTimeout(() => setActionNotification(null), 4500);
    }
  };

  const handleNavigateToExternalConditions = (projectId?: string) => {
    if (projectId) {
      const found = MOCK_ATTENTION_QUEUE.find((p) => p.project.id === projectId);
      if (found) setSelectedProject(found);
    }
    setEarlyWarningSubView('external-conditions');
    setActiveTab('early-warning');
  };

  const handleNavigateToIntervention = (projectId?: string, issueId?: string) => {
    if (projectId) setSelectedInterventionProjectId(projectId);
    if (issueId) setSelectedInterventionIssueId(issueId);
    setActiveTab('intervention');
  };

  const handleNavigateToEvidence = (evidenceId?: string, projectId?: string) => {
    if (evidenceId) setSelectedEvidenceId(evidenceId);
    if (projectId) setSelectedEvidenceProjectId(projectId);
    setActiveTab('evidence');
  };

  const handleSelectProjectFromCockpit = (item: AttentionQueueItem) => {
    setSelectedProject(item);
    setActiveTab('projects');
  };

  const handleActionTriggered = (actionName: string, projectName: string) => {
    setActionNotification(`[SIMULATED WORKFLOW ACTION]: "${actionName}" initiated for ${projectName}. Record logged in session audit.`);
    setTimeout(() => setActionNotification(null), 5000);
  };

  return (
    <div className="app-root">
      {/* 1. Header & Operational Context */}
      <HeaderContext
        activeTab={activeTab}
        onTabSelect={handleTabSelect}
        onToggleDatasetModal={() => setIsDataModalOpen(true)}
      />

      {/* Action Notification Banner */}
      {actionNotification && (
        <div 
          style={{
            backgroundColor: '#eff6ff',
            borderBottom: '1px solid #bfdbfe',
            padding: '8px 24px',
            fontSize: '12px',
            color: '#1e3a8a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 500
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={14} style={{ color: '#2563eb' }} />
            <span>{actionNotification}</span>
          </div>
          <button 
            onClick={() => setActionNotification(null)}
            style={{ background: 'none', border: 'none', color: '#1e3a8a', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="cockpit-container">
        {activeTab === 'projects' ? (
          /* PROJECT INTELLIGENCE MODULE */
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <ProjectIntelligenceView
              projectItem={selectedProject}
              allProjects={MOCK_ATTENTION_QUEUE}
              onSelectProject={(item) => setSelectedProject(item)}
              onBackToCockpit={() => setActiveTab('cockpit')}
              onActionTriggered={handleActionTriggered}
              onOpenIntervention={handleNavigateToIntervention}
              onOpenEvidence={handleNavigateToEvidence}
              onOpenExternalConditions={handleNavigateToExternalConditions}
            />
          </div>
        ) : activeTab === 'early-warning' ? (
          /* EARLY WARNING / RISK MONITOR MODULE */
          <EarlyWarningView
            allProjects={MOCK_ATTENTION_QUEUE}
            selectedProject={selectedProject}
            initialSubView={earlyWarningSubView}
            onSelectProject={(item) => setSelectedProject(item)}
            onOpenProjectIntelligence={(item) => {
              setSelectedProject(item);
              setActiveTab('projects');
            }}
            onOpenIntervention={handleNavigateToIntervention}
            onOpenEvidence={handleNavigateToEvidence}
          />
        ) : activeTab === 'intervention' ? (
          /* INTERVENTION & ESCALATION MODULE */
          <InterventionModule
            initialSelectedProjectId={selectedInterventionProjectId}
            initialSelectedIssueId={selectedInterventionIssueId}
            onOpenProjectIntelligence={(projectId) => {
              const found = MOCK_ATTENTION_QUEUE.find((p) => p.project.id === projectId);
              if (found) setSelectedProject(found);
              setActiveTab('projects');
            }}
            onNavigateToEarlyWarning={(projectId) => {
              const found = MOCK_ATTENTION_QUEUE.find((p) => p.project.id === projectId);
              if (found) setSelectedProject(found);
              setActiveTab('early-warning');
            }}
            onOpenEvidence={handleNavigateToEvidence}
          />
        ) : activeTab === 'evidence' ? (
          /* EVIDENCE & DOCUMENTS MODULE */
          <EvidenceModule
            initialSelectedEvidenceId={selectedEvidenceId}
            initialSelectedProjectId={selectedEvidenceProjectId}
            onOpenProjectIntelligence={(projectId) => {
              const found = MOCK_ATTENTION_QUEUE.find((p) => p.project.id === projectId);
              if (found) setSelectedProject(found);
              setActiveTab('projects');
            }}
            onOpenIntervention={handleNavigateToIntervention}
          />
        ) : (
          /* NATIONAL COCKPIT MODULE */
          <>
            {/* Portfolio Summary Strip */}
            <PortfolioSummary stats={MOCK_PORTFOLIO_SUMMARY} />

            {/* Attention Queue — Primary Operational Area */}
            <AttentionQueue
              items={MOCK_ATTENTION_QUEUE}
              selectedItem={selectedProject}
              onSelectProject={handleSelectProjectFromCockpit}
            />

            {/* Mid-Cockpit Grid: Risk Analytics & Spatial Dispersion */}
            <div className="cockpit-grid-2col">
              {/* Left Column: Risk Distribution & Risk Trajectory */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <RiskDistribution
                  distribution={MOCK_RISK_DISTRIBUTION}
                  loadedCount={MOCK_PORTFOLIO_SUMMARY.loadedProjectsCount}
                />
                <RiskTrendChart trends={MOCK_QUARTERLY_TRENDS} />
              </div>

              {/* Right Column: National Infrastructure Project Map */}
              <div>
                <NationalProjectMap
                  items={MOCK_ATTENTION_QUEUE}
                  selectedItem={selectedProject}
                  onSelectProject={handleSelectProjectFromCockpit}
                />
              </div>
            </div>

            {/* Bottom Section: Data Quality & Model Validation Status */}
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <DataQualityConfidence summary={MOCK_DATA_QUALITY_SUMMARY} />
            </div>
          </>
        )}

        {/* Operational Footer */}
        <footer 
          style={{ 
            marginTop: 'var(--space-3xl)', 
            paddingTop: 'var(--space-lg)', 
            borderTop: '1px solid var(--border-hairline)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <strong>ProjectSentinel</strong> — Prototype Infrastructure Risk Intelligence (SIH 2026 Problem Statement <strong>SIH26103</strong>).
            <span style={{ margin: '0 8px' }}>•</span>
            Active View: <strong>{activeTab === 'projects' ? 'Project Intelligence' : activeTab === 'early-warning' ? 'Early Warning / Risk Monitor' : activeTab === 'intervention' ? 'Intervention & Escalation' : 'National Cockpit'}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Source Reference: <strong>MoSPI PAIMANA Published Overview</strong></span>
            <span>Integration Mode: <strong>Standalone Reference Environment</strong></span>
            <button 
              onClick={() => setIsDataModalOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--admin-blue-700)', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}
            >
              Data Origin Classifications
            </button>
          </div>
        </footer>
      </main>

      {/* Quick Action Path Drawer (Optional quick inspector when on Cockpit) */}
      {isDrawerOpen && (
        <ActionPathDrawer
          item={selectedProject}
          onClose={() => setIsDrawerOpen(false)}
          onActionTriggered={handleActionTriggered}
        />
      )}

      {/* Data Architecture & Boundary Specification Modal */}
      <DataArchitectureModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </div>
  );
};
