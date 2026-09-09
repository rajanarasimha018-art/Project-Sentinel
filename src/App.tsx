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
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('cockpit');
  const [selectedProject, setSelectedProject] = useState<AttentionQueueItem | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [actionNotification, setActionNotification] = useState<string | null>(null);

  const handleTabSelect = (tab: string) => {
    if (tab === 'cockpit') {
      setActiveTab(tab);
    } else {
      setActionNotification(`Navigation to [${tab.toUpperCase()}] is reserved for subsequent Round 2 milestones. National Cockpit is currently locked.`);
      setTimeout(() => setActionNotification(null), 4500);
    }
  };

  const handleActionTriggered = (actionName: string, projectName: string) => {
    setActionNotification(`[OFFICER ACTION RECORDED]: "${actionName}" initiated for ${projectName}. Audit entry logged under Session ID #PS-2026-Q3.`);
    setTimeout(() => setActionNotification(null), 5000);
  };

  return (
    <div className="app-root">
      {/* 1. Header & Operational Context */}
      <HeaderContext
        activeTab={activeTab}
        onTabSelect={handleTabSelect}
        datasetMode="PAIMANA REFERENCE LAYER (SIH26103)"
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

      {/* Main Cockpit Content */}
      <main className="cockpit-container">
        {/* 2. Portfolio Summary Strip */}
        <PortfolioSummary stats={MOCK_PORTFOLIO_SUMMARY} />

        {/* 3. Attention Queue — Primary Operational Area */}
        <AttentionQueue
          items={MOCK_ATTENTION_QUEUE}
          selectedItem={selectedProject}
          onSelectProject={(item) => setSelectedProject(item)}
        />

        {/* Mid-Cockpit Grid: Risk Analytics & Spatial Dispersion */}
        <div className="cockpit-grid-2col">
          {/* Left Column: Risk Distribution & Risk Trajectory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {/* 4. Risk Distribution */}
            <RiskDistribution
              distribution={MOCK_RISK_DISTRIBUTION}
              totalProjects={MOCK_PORTFOLIO_SUMMARY.monitoredProjectsCount}
            />

            {/* 5. Multi-Quarter Risk Trend Time-Series */}
            <RiskTrendChart trends={MOCK_QUARTERLY_TRENDS} />
          </div>

          {/* Right Column: 6. National Infrastructure Project Map */}
          <div>
            <NationalProjectMap
              items={MOCK_ATTENTION_QUEUE}
              selectedItem={selectedProject}
              onSelectProject={(item) => setSelectedProject(item)}
            />
          </div>
        </div>

        {/* Bottom Section: 7. Data Quality & Predictive Model Confidence */}
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <DataQualityConfidence summary={MOCK_DATA_QUALITY_SUMMARY} />
        </div>

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
            <strong>ProjectSentinel</strong> — Predictive Risk Intelligence and Monitoring for Infrastructure Projects.
            <span style={{ margin: '0 8px' }}>•</span>
            SIH 2026 Problem Statement <strong>SIH26103</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Data Boundary: <strong>Central Sector Projects &ge; ₹150 Cr</strong></span>
            <span>Audit Protocol: <strong>PAIMANA ETL Synchronized</strong></span>
            <button 
              onClick={() => setIsDataModalOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--admin-blue-700)', cursor: 'pointer', fontSize: '11px', textDecoration: 'underline' }}
            >
              Schema Architecture
            </button>
          </div>
        </footer>
      </main>

      {/* 8. Action Path Drawer (Slide-over Inspector for selected project) */}
      <ActionPathDrawer
        item={selectedProject}
        onClose={() => setSelectedProject(null)}
        onActionTriggered={handleActionTriggered}
      />

      {/* Data Architecture & Boundary Specification Modal */}
      <DataArchitectureModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </div>
  );
};
