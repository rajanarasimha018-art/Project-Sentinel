import React, { useState, useMemo } from 'react';
import { InterventionIssue, InterventionStatus, ResponsibleRole } from '../../types/sentinel';
import { 
  Search, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowRight, 
  ArrowDownRight, 
  Layers, 
  Check, 
  Clock, 
  FileText, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface InterventionAttentionQueueProps {
  issues: InterventionIssue[];
  selectedIssueId: string | null;
  onSelectIssue: (issue: InterventionIssue) => void;
  onAcknowledgeIssue: (issueId: string) => void;
  onOpenProjectIntelligence: (projectId: string) => void;
}

export const InterventionAttentionQueue: React.FC<InterventionAttentionQueueProps> = ({
  issues,
  selectedIssueId,
  onSelectIssue,
  onAcknowledgeIssue,
  onOpenProjectIntelligence,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filteredIssues = useMemo(() => {
    return issues.filter((item) => {
      const matchesSearch =
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.primaryDriver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.state.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
      const matchesRole = roleFilter === 'ALL' || item.responsibleRole === roleFilter;

      return matchesSearch && matchesStatus && matchesSeverity && matchesRole;
    });
  }, [issues, searchTerm, statusFilter, severityFilter, roleFilter]);

  const renderStatusBadge = (status: InterventionStatus) => {
    switch (status) {
      case 'NEW':
        return (
          <span 
            className="urgency-badge immediate_48h"
            style={{ fontWeight: 700, letterSpacing: '0.04em', fontSize: '10px' }}
          >
            NEW
          </span>
        );
      case 'ACKNOWLEDGED':
        return (
          <span 
            className="urgency-badge cycle_priority"
            style={{ fontWeight: 600, letterSpacing: '0.02em', fontSize: '10px' }}
          >
            ACKNOWLEDGED
          </span>
        );
      case 'UNDER REVIEW':
        return (
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 7px',
              borderRadius: '2px',
              fontSize: '10px',
              fontWeight: 600,
              backgroundColor: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe'
            }}
          >
            UNDER REVIEW
          </span>
        );
      case 'ESCALATED':
        return (
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 7px',
              borderRadius: '2px',
              fontSize: '10px',
              fontWeight: 700,
              backgroundColor: '#fdf2f8',
              color: '#9d174d',
              border: '1px solid #fbcfe8'
            }}
          >
            ▲ ESCALATED
          </span>
        );
      case 'RESOLVED':
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
          >
            ✓ RESOLVED
          </span>
        );
    }
  };

  const renderSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="risk-badge critical" style={{ fontSize: '10px', padding: '1px 6px' }}>CRITICAL</span>;
      case 'HIGH':
        return <span className="risk-badge high" style={{ fontSize: '10px', padding: '1px 6px' }}>HIGH</span>;
      case 'MEDIUM':
        return <span className="risk-badge medium" style={{ fontSize: '10px', padding: '1px 6px' }}>MEDIUM</span>;
      default:
        return <span className="risk-badge low" style={{ fontSize: '10px', padding: '1px 6px' }}>LOW</span>;
    }
  };

  const renderTrendIcon = (trend: string, delta: number) => {
    const formatted = delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2);
    if (delta >= 0.10) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--risk-critical-text)', fontWeight: 600, fontSize: '11px' }}>
          <ArrowUpRight size={13} strokeWidth={2.5} />
          <span className="mono-num">{formatted}</span>
        </div>
      );
    }
    if (delta > 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--risk-high-text)', fontWeight: 500, fontSize: '11px' }}>
          <ArrowUpRight size={13} />
          <span className="mono-num">{formatted}</span>
        </div>
      );
    }
    if (delta < 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--risk-low-text)', fontWeight: 500, fontSize: '11px' }}>
          <ArrowDownRight size={13} />
          <span className="mono-num">{formatted}</span>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-muted)', fontSize: '11px' }}>
        <ArrowRight size={13} />
        <span className="mono-num">{formatted}</span>
      </div>
    );
  };

  return (
    <section 
      className="operational-panel" 
      style={{ marginBottom: 'var(--space-lg)' }}
      aria-label="Intervention Attention Queue"
    >
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <Layers size={16} style={{ color: 'var(--admin-blue-800)' }} />
            <span>INTERVENTION ATTENTION QUEUE</span>
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
              {filteredIssues.length} of {issues.length} Active Records
            </span>
          </div>
          <div className="panel-subtitle">
            “Which risk signals require human attention now?” Prioritized register of infrastructure bottlenecks requiring officer triage.
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
          >
            STATE TRANSITIONS: ENFORCED
          </span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="queue-controls-bar">
        <div className="queue-filters">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} style={{ position: 'absolute', left: '8px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '26px', minWidth: '220px' }}
              placeholder="Search issue, project, officer, driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Intervention States</option>
            <option value="NEW">New Only</option>
            <option value="ACKNOWLEDGED">Acknowledged Only</option>
            <option value="UNDER REVIEW">Under Review Only</option>
            <option value="ESCALATED">Escalated Only</option>
            <option value="RESOLVED">Resolved Only</option>
          </select>

          {/* Severity Filter */}
          <select 
            className="filter-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Role Filter */}
          <select 
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Responsible Roles</option>
            <option value="Portfolio Officer">Portfolio Officer</option>
            <option value="Project Authority">Project Authority</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Department/Nodal Officer">Department/Nodal Officer</option>
            <option value="Field Officer">Field Officer</option>
            <option value="Auditor/Reviewer">Auditor/Reviewer</option>
          </select>
        </div>

        {(searchTerm || statusFilter !== 'ALL' || severityFilter !== 'ALL' || roleFilter !== 'ALL') && (
          <button 
            className="btn-operational btn-secondary-action"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
              setSeverityFilter('ALL');
              setRoleFilter('ALL');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Operational Queue Table */}
      <div className="operational-table-wrap">
        <table className="operational-table" aria-label="Intervention Queue">
          <thead>
            <tr>
              <th style={{ width: '21%' }}>
                <span>PROJECT &amp; CODE</span>
                <span className="table-header-provenance">[SOURCE]</span>
              </th>
              <th style={{ width: '18%' }}>
                <span>RISK / ISSUE SIGNAL</span>
                <span className="table-header-provenance" style={{ color: '#b45309', fontWeight: 600 }}>[SIMULATED]</span>
              </th>
              <th style={{ width: '11%' }}>
                <span>SEVERITY</span>
                <span className="table-header-provenance">[PROTOTYPE MODEL]</span>
              </th>
              <th style={{ width: '7%' }}>
                <span>TREND</span>
                <span className="table-header-provenance">[VELOCITY]</span>
              </th>
              <th style={{ width: '12%' }}>
                <span>RESPONSIBLE ROLE</span>
                <span className="table-header-provenance">[SIMULATED ROLE]</span>
              </th>
              <th style={{ width: '10%' }}>
                <span>STATE</span>
                <span className="table-header-provenance">[TRANSITION]</span>
              </th>
              <th style={{ width: '9%' }}>
                <span>LAST UPDATE</span>
                <span className="table-header-provenance">[SESSION LOG]</span>
              </th>
              <th style={{ width: '12%', textAlign: 'right' }}>
                <span>ACTION</span>
                <span className="table-header-provenance">[DECISION]</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No intervention cases matching current filter parameters.
                </td>
              </tr>
            ) : (
              filteredIssues.map((item) => {
                const isSelected = selectedIssueId === item.id;
                return (
                  <tr 
                    key={item.id}
                    className={isSelected ? 'selected-row' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectIssue(item)}
                    title="Click row to open detailed engineering & government case file"
                  >
                    {/* 1. PROJECT */}
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', lineHeight: 1.3 }}>
                        {item.projectName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {item.projectCode}
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          {item.sector}
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {item.state}
                        </span>
                      </div>
                    </td>

                    {/* 2. RISK / ISSUE SIGNAL */}
                    <td>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {item.primaryDriver}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <span 
                          className="mono-num"
                          style={{ 
                            fontSize: '9px', 
                            color: 'var(--text-muted)', 
                            backgroundColor: 'var(--bg-subtle)',
                            padding: '1px 4px',
                            borderRadius: '2px'
                          }}
                        >
                          {item.primaryDriverFieldRef}
                        </span>
                        <span style={{ fontSize: '9px', color: '#b45309', fontWeight: 600 }}>
                          [SIMULATED]
                        </span>
                      </div>
                    </td>

                    {/* 3. SEVERITY */}
                    <td>
                      <div>{renderSeverityBadge(item.severity)}</div>
                      <div style={{ fontSize: '8.5px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.2 }}>
                        [PROTOTYPE MODEL] Risk classification — validation in progress
                      </div>
                    </td>

                    {/* 4. TREND */}
                    <td>
                      {renderTrendIcon(item.trend, item.trendDelta)}
                    </td>

                    {/* 5. RESPONSIBLE ROLE */}
                    <td>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.responsibleRole}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.25 }}>
                        {item.assignedTo}
                      </div>
                    </td>

                    {/* 6. CURRENT STATE */}
                    <td>
                      <div>{renderStatusBadge(item.status)}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '3px' }}>
                        Due: <strong>{item.reviewDue}</strong>
                      </div>
                    </td>

                    {/* 7. LAST UPDATED */}
                    <td>
                      <div className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {item.updatedAt}
                      </div>
                    </td>

                    {/* 8. ACTION BUTTONS */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', alignItems: 'center' }}>
                        {/* Inline Acknowledge Shortcut for NEW items */}
                        {item.status === 'NEW' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAcknowledgeIssue(item.id);
                            }}
                            className="btn-operational btn-secondary-action"
                            style={{ fontSize: '10px', padding: '3px 6px', color: 'var(--admin-blue-700)' }}
                            title="Acknowledge issue immediately"
                          >
                            <Check size={11} />
                            <span>Ack</span>
                          </button>
                        )}

                        {/* Open Case File Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectIssue(item);
                          }}
                          className={`btn-operational ${item.status === 'NEW' || item.severity === 'CRITICAL' ? 'btn-primary-action' : 'btn-secondary-action'}`}
                          style={{ fontSize: '11px', padding: '4px 8px', whiteSpace: 'nowrap' }}
                          title="Open detailed case file"
                        >
                          <span>Review Case</span>
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
          💡 <em>Tip: Selecting any case above opens Screen 2 (Case File &amp; Escalation Detail).</em>
        </div>
        <div>
          Audit-ready session log — prototype.
        </div>
      </div>
    </section>
  );
};
