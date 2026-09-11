import React from 'react';
import { AttentionQueueItem } from '../../types/sentinel';
import { ArrowLeft, ChevronRight, Building2, MapPin, Tag } from 'lucide-react';

interface ProjectHeaderProps {
  projectItem: AttentionQueueItem;
  allProjects: AttentionQueueItem[];
  onSelectProject: (item: AttentionQueueItem) => void;
  onBackToCockpit: () => void;
  onOpenExternalConditions?: (projectId: string) => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectItem,
  allProjects,
  onSelectProject,
  onBackToCockpit,
  onOpenExternalConditions,
}) => {
  const { project } = projectItem;

  return (
    <div className="operational-panel" style={{ marginBottom: 'var(--space-lg)' }}>
      {/* Top Breadcrumb & Return Nav */}
      <div 
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#fafbfc', 
          borderBottom: '1px solid var(--border-hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onBackToCockpit}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--admin-blue-700)', 
              cursor: 'pointer',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 4px',
              borderRadius: '2px'
            }}
          >
            <ArrowLeft size={12} />
            <span>National Cockpit</span>
          </button>
          <ChevronRight size={11} color="var(--border-strong)" />
          <span>Projects</span>
          <ChevronRight size={11} color="var(--border-strong)" />
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {project.code}
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Switch Project:</span>
          <select
            className="filter-select"
            value={project.id}
            onChange={(e) => {
              const found = allProjects.find((p) => p.project.id === e.target.value);
              if (found) onSelectProject(found);
            }}
            style={{ fontSize: '11px', padding: '3px 8px' }}
          >
            {allProjects.map((p) => (
              <option key={p.project.id} value={p.project.id}>
                {p.project.code} — {p.project.name.substring(0, 36)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Project Identity Strip */}
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: '320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span 
              className="mono-num" 
              style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', background: 'var(--bg-muted)', padding: '2px 6px', borderRadius: '2px' }}
            >
              {project.code}
            </span>
            <span className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              Sanctioned: {project.sanctionedDate}
            </span>
            <span style={{ color: 'var(--border-medium)' }}>•</span>
            <span 
              className="demo-layer-pill" 
              style={{ fontSize: '9px', background: '#fff', border: '1px solid var(--border-medium)', color: '#475569' }}
            >
              [SOURCE-DERIVED METADATA]
            </span>
          </div>

          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '6px' }}>
            {project.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={13} color="var(--admin-blue-800)" />
              <strong>{project.implementingAgency}</strong> ({project.ministry})
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} color="var(--text-muted)" />
              <span>{project.state} • {project.region}</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={12} color="var(--text-muted)" />
              <span>{project.sector}</span>
            </span>
          </div>
        </div>

        {/* Nodal Authority & Risk Badge */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Prototype Risk Index:</span>
            <span className={`risk-badge ${projectItem.riskLevel.toLowerCase()}`} style={{ fontSize: '12px', padding: '3px 8px' }}>
              {(projectItem.riskScore * 100).toFixed(0)}/100 {projectItem.riskLevel}
            </span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Nodal Authority: <strong style={{ color: 'var(--text-secondary)' }}>{projectItem.actionGuidance.competentAuthority}</strong>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Reporting Reference Cycle: {project.lastReportingPeriod}
          </div>
          {onOpenExternalConditions && (
            <button
              onClick={() => onOpenExternalConditions(project.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--admin-blue-800)',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '2px',
                padding: '4px 9px',
                cursor: 'pointer',
                marginTop: '4px',
              }}
            >
              <span>VIEW LOCATION &amp; EXTERNAL CONDITIONS →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
