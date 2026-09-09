import React, { useState, useMemo } from 'react';
import { 
  AttentionQueueItem, 
  UrgencyLevel 
} from '../types/sentinel';
import { 
  ArrowUpRight, 
  ArrowRight, 
  ArrowDownRight, 
  Search, 
  ChevronRight,
  ShieldAlert,
  Info
} from 'lucide-react';

interface AttentionQueueProps {
  items: AttentionQueueItem[];
  selectedItem: AttentionQueueItem | null;
  onSelectProject: (item: AttentionQueueItem) => void;
}

export const AttentionQueue: React.FC<AttentionQueueProps> = ({
  items,
  selectedItem,
  onSelectProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = 
        item.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project.implementingAgency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project.state.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSector = sectorFilter === 'ALL' || item.project.sector === sectorFilter;
      const matchesUrgency = urgencyFilter === 'ALL' || item.urgency === urgencyFilter;
      const matchesRisk = riskFilter === 'ALL' || item.riskLevel === riskFilter;

      return matchesSearch && matchesSector && matchesUrgency && matchesRisk;
    });
  }, [items, searchTerm, sectorFilter, urgencyFilter, riskFilter]);

  const renderTrendIcon = (trend: string, delta: number) => {
    const formattedDelta = delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2);
    switch (trend) {
      case 'INCREASING_FAST':
        return (
          <span className="trend-tag increasing_fast" title="Fast Escalating Risk Vector">
            <ArrowUpRight size={13} strokeWidth={2.5} />
            <span>{formattedDelta}</span>
          </span>
        );
      case 'INCREASING':
        return (
          <span className="trend-tag increasing" title="Escalating Risk Vector">
            <ArrowUpRight size={13} />
            <span>{formattedDelta}</span>
          </span>
        );
      case 'DECREASING':
        return (
          <span className="trend-tag decreasing" title="Mitigating Risk Vector">
            <ArrowDownRight size={13} />
            <span>{formattedDelta}</span>
          </span>
        );
      default:
        return (
          <span className="trend-tag stable" title="Stable Profile">
            <ArrowRight size={13} />
            <span>{formattedDelta}</span>
          </span>
        );
    }
  };

  const renderUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'IMMEDIATE_48H':
        return <span className="urgency-badge immediate_48h">Immediate (48h)</span>;
      case 'CYCLE_PRIORITY':
        return <span className="urgency-badge cycle_priority">Review This Cycle</span>;
      default:
        return <span className="urgency-badge scheduled_review">Scheduled Review</span>;
    }
  };

  const uniqueSectors = Array.from(new Set(items.map((i) => i.project.sector)));

  return (
    <section className="attention-queue-section operational-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <ShieldAlert size={16} style={{ color: 'var(--admin-blue-800)' }} />
            <span>ATTENTION QUEUE</span>
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
              {filteredItems.length} of {items.length} Active Records
            </span>
          </div>
          <div className="panel-subtitle">
            Projects prioritized by prototype risk score, recent report changes, and simulated operational case signals.
          </div>
        </div>

        <div className="panel-actions">
          <span 
            className="demo-layer-pill" 
            style={{ fontSize: '9px', backgroundColor: '#fff', border: '1px solid var(--border-medium)', color: '#475569' }}
            title="Signals and evidence documents are curated demo scenarios for testing review workflows"
          >
            SIGNALS: SIMULATED SCENARIOS
          </span>
        </div>
      </div>

      {/* Queue Controls Bar */}
      <div className="queue-controls-bar">
        <div className="queue-filters">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} style={{ position: 'absolute', left: '8px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '26px' }}
              placeholder="Search by project, agency, state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sector Selector */}
          <select 
            className="filter-select"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="ALL">All Sectors</option>
            {uniqueSectors.map((sector) => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>

          {/* Risk Level Selector */}
          <select 
            className="filter-select"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
            <option value="LOW">Low Only</option>
          </select>

          {/* Urgency Selector */}
          <select 
            className="filter-select"
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
          >
            <option value="ALL">All Urgency Windows</option>
            <option value="IMMEDIATE_48H">Immediate (48h)</option>
            <option value="CYCLE_PRIORITY">Review This Cycle</option>
            <option value="SCHEDULED_REVIEW">Scheduled Review</option>
          </select>
        </div>

        {(searchTerm || sectorFilter !== 'ALL' || riskFilter !== 'ALL' || urgencyFilter !== 'ALL') && (
          <button 
            className="btn-operational btn-secondary-action"
            onClick={() => {
              setSearchTerm('');
              setSectorFilter('ALL');
              setRiskFilter('ALL');
              setUrgencyFilter('ALL');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Operational Review Queue Table */}
      <div className="operational-table-wrap">
        <table className="operational-table" aria-label="Projects Attention Queue">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Project &amp; Code</th>
              <th style={{ width: '14%' }}>Agency &amp; Ministry</th>
              <th style={{ width: '12%' }}>Sector &amp; Location</th>
              <th style={{ width: '9%' }}>Risk Index</th>
              <th style={{ width: '7%' }}>Trend</th>
              <th style={{ width: '19%' }}>Primary Signal (Compact)</th>
              <th style={{ width: '13%' }}>Report Change</th>
              <th style={{ width: '8%' }}>Urgency</th>
              <th style={{ width: '9%', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No projects matching current filter parameters in this reference batch.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isSelected = selectedItem?.project.id === item.project.id;
                return (
                  <tr 
                    key={item.project.id}
                    className={isSelected ? 'selected-row' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectProject(item)}
                  >
                    {/* Project */}
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px', lineHeight: 1.3 }}>
                        {item.project.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {item.project.code}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>•</span>
                        <span className="mono-num" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          ₹{item.project.sanctionedCostCr.toLocaleString()} Cr
                        </span>
                      </div>
                    </td>

                    {/* Agency / Ministry */}
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {item.project.implementingAgency}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.project.ministry}
                      </div>
                    </td>

                    {/* Sector / Location */}
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
                        {item.project.sector}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.project.state}
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td>
                      <span className={`risk-badge ${item.riskLevel.toLowerCase()}`}>
                        <span>{(item.riskScore * 100).toFixed(0)}</span>
                        <span style={{ opacity: 0.7 }}>/100</span>
                        <span style={{ fontSize: '9px', marginLeft: '2px' }}>{item.riskLevel}</span>
                      </span>
                    </td>

                    {/* Risk Trend */}
                    <td>
                      {renderTrendIcon(item.trend, item.trendDelta)}
                    </td>

                    {/* Primary Signal (Compact) */}
                    <td>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.35, fontWeight: 500 }}>
                        {item.primarySignalCompact}
                      </div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        [Simulated Case Signal]
                      </div>
                    </td>

                    {/* Recent Change */}
                    <td>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                        {item.recentChangeCompact}
                      </div>
                    </td>

                    {/* Urgency */}
                    <td>
                      {renderUrgencyBadge(item.urgency)}
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(item);
                        }}
                        className={`btn-operational ${isSelected ? 'btn-primary-action' : 'btn-secondary-action'}`}
                        title="Inspect Risk Factors & Simulated Evidence Trail"
                      >
                        <span>{item.recommendedActionText}</span>
                        <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
