import React, { useState, useMemo } from 'react';
import { EarlyWarningRow } from '../../data/earlyWarningData';
import { AttentionQueueItem, EarlyWarningRiskState } from '../../types/sentinel';
import { 
  ArrowUpRight, 
  ArrowRight, 
  ArrowDownRight, 
  Search, 
  ChevronRight, 
  Filter, 
  Layers, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface EmergingRiskRegisterProps {
  rows: EarlyWarningRow[];
  selectedItem: AttentionQueueItem | null;
  onSelectProject: (item: AttentionQueueItem) => void;
  onInspectTrajectory: (item: AttentionQueueItem) => void;
  onOpenIntervention?: (projectId: string) => void;
  onViewExternalContext?: (item: AttentionQueueItem) => void;
}

export const EmergingRiskRegister: React.FC<EmergingRiskRegisterProps> = ({
  rows,
  selectedItem,
  onSelectProject,
  onInspectTrajectory,
  onOpenIntervention,
  onViewExternalContext,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  const uniqueSectors = useMemo(() => {
    return Array.from(new Set(rows.map((r) => r.item.project.sector)));
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        r.item.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.item.project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.item.project.implementingAgency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.item.project.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.primaryDriverLabel.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesState = stateFilter === 'ALL' || r.riskState === stateFilter;
      const matchesSector = sectorFilter === 'ALL' || r.item.project.sector === sectorFilter;

      return matchesSearch && matchesState && matchesSector;
    });
  }, [rows, searchTerm, stateFilter, sectorFilter]);

  const renderRiskStateBadge = (state: EarlyWarningRiskState) => {
    switch (state) {
      case 'HIGH_ATTENTION':
        return (
          <span 
            className="urgency-badge immediate_48h"
            style={{ fontWeight: 600, letterSpacing: '0.02em', fontSize: '10px' }}
            title="ProjectSentinel prototype risk state: Rapid acceleration or critical milestone jeopardy"
          >
            HIGH ATTENTION
          </span>
        );
      case 'EMERGING_RISK':
        return (
          <span 
            className="urgency-badge cycle_priority"
            style={{ fontWeight: 600, letterSpacing: '0.02em', fontSize: '10px' }}
            title="ProjectSentinel prototype risk state: Emerging latent deterioration or clearance stall"
          >
            EMERGING RISK
          </span>
        );
      case 'WATCH':
        return (
          <span 
            className="urgency-badge scheduled_review"
            style={{ fontWeight: 600, letterSpacing: '0.02em', fontSize: '10px' }}
            title="ProjectSentinel prototype risk state: Elevated baseline with steady execution watch"
          >
            WATCH
          </span>
        );
      case 'STABLE':
        return (
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 7px',
              borderRadius: '2px',
              fontSize: '10px',
              fontWeight: 600,
              backgroundColor: 'var(--risk-low-bg)',
              color: 'var(--risk-low-text)',
              border: '1px solid var(--risk-low-border)'
            }}
            title="ProjectSentinel prototype risk state: Controlled trajectory or de-escalating variance"
          >
            STABLE
          </span>
        );
    }
  };

  const renderRiskChangeIcon = (delta: number, changeText: string) => {
    if (delta >= 0.10) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--risk-critical-text)', fontWeight: 600 }}>
          <ArrowUpRight size={14} strokeWidth={2.5} />
          <span className="mono-num" style={{ fontSize: '11px' }}>{changeText}</span>
        </div>
      );
    }
    if (delta > 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--risk-high-text)', fontWeight: 500 }}>
          <ArrowUpRight size={14} strokeWidth={2} />
          <span className="mono-num" style={{ fontSize: '11px' }}>{changeText}</span>
        </div>
      );
    }
    if (delta < 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--risk-low-text)', fontWeight: 500 }}>
          <ArrowDownRight size={14} strokeWidth={2} />
          <span className="mono-num" style={{ fontSize: '11px' }}>{changeText}</span>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
        <ArrowRight size={14} />
        <span className="mono-num" style={{ fontSize: '11px' }}>{changeText}</span>
      </div>
    );
  };

  return (
    <section 
      className="operational-panel" 
      style={{ marginBottom: 'var(--space-lg)' }}
      aria-label="Emerging Risk Register"
    >
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <Layers size={16} style={{ color: 'var(--admin-blue-800)' }} />
            <span>EMERGING RISK REGISTER</span>
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
              {filteredRows.length} of {rows.length} Monitored Projects
            </span>
          </div>
          <div className="panel-subtitle">
            Longitudinal indicator change and schedule risk velocity.
            <span style={{ marginLeft: '4px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
              (Classifications reflect ProjectSentinel prototype risk states — not official MoSPI statutory designations)
            </span>
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
            title="Schedule shifts and physical trajectories are calculated directly from loaded PAIMANA monitoring cycles"
          >
            [CALCULATED FROM HISTORICAL RECORDS]
          </span>
        </div>
      </div>

      {/* Filter and Query Bar */}
      <div className="queue-controls-bar">
        <div className="queue-filters">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} style={{ position: 'absolute', left: '8px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '26px', minWidth: '220px' }}
              placeholder="Search project, agency, state, or driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Risk State Selector */}
          <select 
            className="filter-select"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="ALL">All Prototype Risk States</option>
            <option value="HIGH_ATTENTION">High Attention Only</option>
            <option value="EMERGING_RISK">Emerging Risk Only</option>
            <option value="WATCH">Watch Only</option>
            <option value="STABLE">Stable Only</option>
          </select>

          {/* Sector Selector */}
          <select 
            className="filter-select"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="ALL">All Sectors</option>
            {uniqueSectors.map((sec) => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>
        </div>

        {(searchTerm || stateFilter !== 'ALL' || sectorFilter !== 'ALL') && (
          <button 
            className="btn-operational btn-secondary-action"
            onClick={() => {
              setSearchTerm('');
              setStateFilter('ALL');
              setSectorFilter('ALL');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Analytical Table Surface */}
      <div className="operational-table-wrap">
        <table className="operational-table" aria-label="Emerging Risk Table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>
                <span>PROJECT</span>
                <span className="table-header-provenance">[SOURCE]</span>
              </th>
              <th style={{ width: '11%' }}>
                <span>RISK STATE</span>
                <span className="table-header-provenance">[PROTOTYPE]</span>
              </th>
              <th style={{ width: '12%' }}>
                <span>RISK CHANGE</span>
                <span className="table-header-provenance">[PROTOTYPE]</span>
              </th>
              <th style={{ width: '15%' }}>
                <span>SCHEDULE SIGNAL</span>
                <span className="table-header-provenance">[SOURCE + CALC]</span>
              </th>
              <th style={{ width: '16%' }}>
                <span>PHYSICAL / FINANCIAL DIVERGENCE</span>
                <span className="table-header-provenance">[CALCULATED]</span>
              </th>
              <th style={{ width: '13%' }}>
                <span>PRIMARY DRIVER</span>
                <span className="table-header-provenance">[FIELD MAP]</span>
              </th>
              <th style={{ width: '6%' }}>
                <span>DATA</span>
                <span className="table-header-provenance">[TIER]</span>
              </th>
              <th style={{ width: '7%' }}>
                <span>ACTION</span>
                <span className="table-header-provenance">[REVIEW]</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No monitored infrastructure projects matching current filter parameters.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                const isSelected = selectedItem?.project.id === row.item.project.id;
                return (
                  <tr 
                    key={row.item.project.id}
                    className={isSelected ? 'selected-row' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onInspectTrajectory(row.item)}
                    title="Click row to inspect longitudinal indicator trajectories"
                  >
                    {/* 1. PROJECT */}
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', lineHeight: 1.3 }}>
                        {row.item.project.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {row.item.project.code}
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          {row.item.project.implementingAgency}
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {row.item.project.state}
                        </span>
                      </div>
                    </td>

                    {/* 2. RISK STATE */}
                    <td>
                      <div>{renderRiskStateBadge(row.riskState)}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '3px' }}>
                        Score: <strong>{(row.item.riskScore * 100).toFixed(0)}/100</strong>
                      </div>
                    </td>

                    {/* 3. RISK CHANGE */}
                    <td>
                      {renderRiskChangeIcon(row.riskChangeNumeric, row.riskChangeText)}
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Q2 → Q3 Delta
                      </div>
                    </td>

                    {/* 4. SCHEDULE SIGNAL */}
                    <td>
                      <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.35 }}>
                        {row.scheduleSignal}
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Original: {row.item.project.originalCompletionDate}
                      </div>
                    </td>

                    {/* 5. PHYSICAL / FINANCIAL DIVERGENCE */}
                    <td>
                      <div 
                        style={{ 
                          fontSize: '11px', 
                          lineHeight: 1.35, 
                          fontWeight: row.isDivergenceFlagged ? 600 : 400,
                          color: row.isDivergenceFlagged ? 'var(--risk-critical-text)' : 'var(--text-secondary)'
                        }}
                      >
                        {row.divergenceText}
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Cumulative: {row.item.project.physicalProgressPct.toFixed(1)}% Phys / ₹{row.item.project.cumulativeExpenditureCr.toLocaleString()} Cr Exp
                      </div>
                    </td>

                    {/* 6. PRIMARY DRIVER */}
                    <td>
                      <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.3 }}>
                        {row.primaryDriverLabel}
                      </div>
                      <div 
                        className="mono-num"
                        style={{ 
                          fontSize: '9px', 
                          color: 'var(--text-muted)', 
                          marginTop: '2px',
                          display: 'inline-block',
                          backgroundColor: 'var(--bg-subtle)',
                          padding: '1px 4px',
                          borderRadius: '2px'
                        }}
                      >
                        {row.primaryDriverFieldRef}
                      </div>
                    </td>

                    {/* 7. DATA QUALITY */}
                    <td>
                      <span 
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: row.dataQualityTier === 'SUFFICIENT' ? 'var(--risk-low-text)' : 'var(--risk-medium-text)',
                          backgroundColor: row.dataQualityTier === 'SUFFICIENT' ? 'var(--risk-low-bg)' : 'var(--risk-medium-bg)',
                          padding: '1px 5px',
                          borderRadius: '2px',
                          border: `1px solid ${row.dataQualityTier === 'SUFFICIENT' ? 'var(--risk-low-border)' : 'var(--risk-medium-border)'}`
                        }}
                      >
                        {row.dataQualityTier}
                      </span>
                    </td>

                    {/* 8. ACTION */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', alignItems: 'center' }}>
                        {onViewExternalContext && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewExternalContext(row.item);
                            }}
                            className="btn-operational btn-secondary-action"
                            style={{ fontSize: '10px', padding: '3px 7px', whiteSpace: 'nowrap', color: 'var(--admin-blue-700)' }}
                            title="Inspect geographic and external conditions context"
                          >
                            <span>VIEW EXTERNAL CONTEXT →</span>
                          </button>
                        )}
                        {onOpenIntervention && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenIntervention(row.item.project.id);
                            }}
                            className="btn-operational btn-secondary-action"
                            style={{ fontSize: '10px', padding: '3px 7px', whiteSpace: 'nowrap', color: 'var(--admin-blue-700)' }}
                            title="Review intervention case file"
                          >
                            <span>Review intervention</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProject(row.item);
                          }}
                          className={`btn-operational ${row.riskState === 'HIGH_ATTENTION' ? 'btn-primary-action' : 'btn-secondary-action'}`}
                          style={{ fontSize: '11px', padding: '4px 8px', whiteSpace: 'nowrap' }}
                          title="Open Project Intelligence Forensic Dossier"
                        >
                          <span>{row.actionLabel}</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div 
        style={{ 
          padding: '8px 14px', 
          backgroundColor: 'var(--bg-subtle)', 
          borderTop: '1px solid var(--border-hairline)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div>
          💡 <em>Tip: Click any project row above to inspect its longitudinal trajectory graph across 4 monitoring cycles below.</em>
        </div>
        <div>
          <strong>Note:</strong> Early Warning metrics prioritize rate of change over static severity.
        </div>
      </div>
    </section>
  );
};
