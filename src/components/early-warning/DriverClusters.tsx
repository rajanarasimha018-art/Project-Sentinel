import React, { useState } from 'react';
import { DRIVER_CLUSTERS_DATA } from '../../data/earlyWarningData';
import { AttentionQueueItem, DriverClusterItem } from '../../types/sentinel';
import { GitPullRequest, ExternalLink, ChevronRight, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface DriverClustersProps {
  allProjects: AttentionQueueItem[];
  onSelectProject: (item: AttentionQueueItem) => void;
  onOpenEvidence?: (projectId?: string) => void;
}

export const DriverClusters: React.FC<DriverClustersProps> = ({
  allProjects,
  onSelectProject,
  onOpenEvidence,
}) => {
  const [selectedClusterId, setSelectedClusterId] = useState<string>(DRIVER_CLUSTERS_DATA[0].id);

  const selectedCluster = DRIVER_CLUSTERS_DATA.find((c) => c.id === selectedClusterId) || DRIVER_CLUSTERS_DATA[0];

  return (
    <section 
      className="operational-panel" 
      style={{ marginBottom: 'var(--space-lg)' }}
      aria-label="Causal Driver Clusters"
    >
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <GitPullRequest size={16} style={{ color: 'var(--admin-blue-800)' }} />
            <span>CROSS-PORTFOLIO DRIVER CLUSTERS</span>
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
              5 Active Categories Identified
            </span>
          </div>
          <div className="panel-subtitle">
            Systemic impediment patterns observed across multiple projects. 
            Rooted in empirical PAIMANA monitoring records rather than black-box models.
          </div>
        </div>

        <div className="panel-actions">
          <span 
            className="demo-layer-pill" 
            style={{ 
              fontSize: '10px', 
              backgroundColor: '#fff', 
              border: '1px solid var(--border-medium)', 
              color: 'var(--text-secondary)' 
            }}
            title="Mapped to PAIMANA schema milestone impediment fields"
          >
            [FIELD EVIDENCE MAPPINGS]
          </span>
        </div>
      </div>

      {/* Driver Cluster Selector Tabs */}
      <div 
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-hairline)',
          backgroundColor: 'var(--bg-subtle)',
          overflowX: 'auto'
        }}
      >
        {DRIVER_CLUSTERS_DATA.map((cluster) => {
          const isSelected = cluster.id === selectedClusterId;
          return (
            <button
              key={cluster.id}
              onClick={() => setSelectedClusterId(cluster.id)}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderBottom: isSelected ? '2px solid var(--admin-blue-700)' : '2px solid transparent',
                backgroundColor: isSelected ? 'var(--bg-surface)' : 'transparent',
                color: isSelected ? 'var(--admin-blue-900)' : 'var(--text-secondary)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{cluster.categoryLabel}</span>
              <span 
                className="mono-num"
                style={{
                  fontSize: '10px',
                  padding: '1px 5px',
                  borderRadius: '2px',
                  backgroundColor: isSelected ? 'var(--admin-blue-100)' : 'var(--bg-muted)',
                  color: isSelected ? 'var(--admin-blue-900)' : 'var(--text-muted)'
                }}
              >
                {cluster.affectedProjects.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Driver Detailed Specification (Credibility Standard) */}
      <div style={{ padding: '16px' }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px'
          }}
        >
          {/* Left: Structured Evidence Specification */}
          <div 
            style={{
              backgroundColor: 'var(--bg-paper-tint)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                OBSERVED SIGNAL [SOURCE + CALC]
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '3px', lineHeight: 1.4, fontWeight: 500 }}>
                {selectedCluster.observedSignal}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                EVIDENCE / FIELD MAPPING [PAIMANA DATA SCHEMA]
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '3px' }}>
                <span 
                  className="mono-num"
                  style={{ 
                    fontSize: '11px', 
                    color: 'var(--admin-blue-900)', 
                    backgroundColor: 'var(--bg-surface)',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    border: '1px solid var(--border-hairline)',
                    display: 'inline-block'
                  }}
                >
                  {selectedCluster.evidenceFieldMapping}
                </span>

                {onOpenEvidence && (
                  <button
                    onClick={() => {
                      const firstProj = selectedCluster.affectedProjects[0]?.projectId;
                      onOpenEvidence(firstProj);
                    }}
                    className="btn-operational btn-secondary-action"
                    style={{ fontSize: '10px', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--admin-blue-800)' }}
                    title="Inspect related evidence records in Evidence Register"
                  >
                    <FileText size={11} />
                    <span>Evidence Register →</span>
                  </button>
                )}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                INTERPRETATION STATUS [MODEL VALIDATION CAVEAT]
              </div>
              <div style={{ fontSize: '11px', color: '#b45309', marginTop: '3px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={12} style={{ color: '#d97706' }} />
                <span>{selectedCluster.interpretationStatus}</span>
              </div>
            </div>
          </div>

          {/* Right: Affected Infrastructure Projects */}
          <div 
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)',
              padding: '14px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                PROJECTS EXPOSED TO THIS SIGNAL ({selectedCluster.affectedProjects.length})
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Click to inspect dossier
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedCluster.affectedProjects.map((p) => {
                const fullItem = allProjects.find((item) => item.project.id === p.projectId);
                return (
                  <div
                    key={p.projectId}
                    onClick={() => {
                      if (fullItem) onSelectProject(fullItem);
                    }}
                    style={{
                      padding: '8px 10px',
                      backgroundColor: 'var(--bg-paper-tint)',
                      border: '1px solid var(--border-hairline)',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'border-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--admin-blue-600)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-hairline)';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>
                        {p.projectName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>
                        {p.specificFinding}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-blue-700)', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}>
                      <span>Dossier</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-hairline)', paddingTop: '8px' }}>
          * <strong>Methodology Guarantee:</strong> ProjectSentinel avoids arbitrary percentage weight allocations (e.g. 42%, 34%) for drivers without an empirically calibrated model. Driver associations reflect verified data schema mappings and site observation logs.
        </div>
      </div>
    </section>
  );
};
