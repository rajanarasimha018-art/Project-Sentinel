import React from 'react';
import { ShieldCheck, RefreshCw, Database } from 'lucide-react';

interface HeaderContextProps {
  activeTab: string;
  onTabSelect: (tab: string) => void;
  datasetMode: string;
  onToggleDatasetModal: () => void;
}

export const HeaderContext: React.FC<HeaderContextProps> = ({
  activeTab,
  onTabSelect,
  datasetMode,
  onToggleDatasetModal
}) => {
  const navItems = [
    { id: 'cockpit', label: 'Cockpit', active: true },
    { id: 'projects', label: 'Projects', active: false },
    { id: 'early-warning', label: 'Early Warning', active: false },
    { id: 'intervention', label: 'Intervention', active: false },
    { id: 'evidence', label: 'Evidence', active: false },
    { id: 'administration', label: 'Administration', active: false },
  ];

  return (
    <header className="site-header">
      {/* Top operational metadata bar */}
      <div className="header-topbar">
        <div className="header-topbar-left">
          <span className="topbar-tag">
            <span className="bullet"></span>
            PAIMANA Batch Sync: 09-Feb-2026 06:00 IST
          </span>
          <span>|</span>
          <span>Reporting Period: FY 2025-26 Q3 Review Cycle</span>
          <span>|</span>
          <span>Scope: Central Sector Projects &ge; ₹150 Cr (MoSPI)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onToggleDatasetModal}
            className="demo-layer-pill" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
            title="Inspect Data Boundary & PAIMANA ETL Schema Reference"
          >
            <Database size={11} />
            <span>{datasetMode}</span>
          </button>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            System Integrity: <strong style={{ color: '#16a34a' }}>VERIFIED</strong>
          </span>
        </div>
      </div>

      {/* Main navigation & identity */}
      <div className="header-main">
        <div className="brand-section">
          <div className="brand-title">
            <ShieldCheck size={22} className="shield-icon" />
            <span>ProjectSentinel</span>
          </div>
          <div className="brand-scope">
            National Infrastructure Risk & Monitoring Intelligence
          </div>
        </div>

        <nav className="header-nav" aria-label="Operational Workflow Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabSelect(item.id)}
              className={`nav-link ${item.id === activeTab ? 'active' : ''} ${!item.active && item.id !== activeTab ? 'disabled' : ''}`}
              title={item.id !== 'cockpit' ? `${item.label} (Scheduled for Round 2 Next Milestones)` : ''}
            >
              {item.label}
              {item.id !== 'cockpit' && (
                <span style={{ fontSize: '9px', marginLeft: '4px', opacity: 0.6 }}>R2</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
