import React from 'react';
import { Shield, Database, HelpCircle } from 'lucide-react';

interface HeaderContextProps {
  activeTab: string;
  onTabSelect: (tab: string) => void;
  onToggleDatasetModal: () => void;
}

export const HeaderContext: React.FC<HeaderContextProps> = ({
  activeTab,
  onTabSelect,
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
      {/* Top operational metadata & small data status indicator */}
      <div className="header-topbar">
        <div className="header-topbar-left">
          <span className="topbar-tag">
            <span className="bullet" style={{ backgroundColor: '#2563eb' }}></span>
            SOURCE: <strong>MoSPI PAIMANA Reference Records</strong> (Oct–Dec 2025 Cycle)
          </span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span>DATA STATE: <strong>10 Loaded Reference Projects</strong></span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span>MODEL STATE: <strong>Validation in Progress</strong></span>
          <span style={{ color: 'var(--border-medium)' }}>|</span>
          <span>EXTERNAL FEEDS: <strong>Not Connected</strong></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={onToggleDatasetModal}
            className="demo-layer-pill" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: '#ffffff' }}
            title="Inspect Data Origins & Schema Specification"
          >
            <Database size={11} />
            <span>DATA ORIGIN SPECIFICATION</span>
          </button>
        </div>
      </div>

      {/* Main navigation & identity */}
      <div className="header-main">
        <div className="brand-section">
          <div className="brand-title">
            <Shield size={20} className="shield-icon" />
            <span>ProjectSentinel</span>
          </div>
          <div className="brand-scope">
            National Infrastructure Risk &amp; Monitoring Intelligence (SIH26103)
          </div>
        </div>

        <nav className="header-nav" aria-label="Operational Workflow Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabSelect(item.id)}
              className={`nav-link ${item.id === activeTab ? 'active' : ''} ${!item.active && item.id !== activeTab ? 'disabled' : ''}`}
              title={item.id !== 'cockpit' ? `${item.label} (Next Milestones)` : ''}
            >
              {item.label}
              {item.id !== 'cockpit' && (
                <span style={{ fontSize: '9px', marginLeft: '4px', opacity: 0.5 }}>R2</span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
