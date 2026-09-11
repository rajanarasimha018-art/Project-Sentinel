import React, { useState, useMemo } from 'react';
import { EvidenceRecord, EvidenceType, EvidenceProvenanceCategory } from '../../types/sentinel';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  ChevronRight, 
  Layers, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Link2Off,
  ShieldCheck,
  Building2,
  ArrowRight
} from 'lucide-react';

interface EvidenceRegisterProps {
  records: EvidenceRecord[];
  selectedRecordId: string;
  onSelectRecord: (record: EvidenceRecord) => void;
  onOpenProjectIntelligence: (projectId: string) => void;
  onOpenIntervention: (projectId: string, issueId?: string) => void;
}

export const EvidenceRegister: React.FC<EvidenceRegisterProps> = ({
  records,
  selectedRecordId,
  onSelectRecord,
  onOpenProjectIntelligence,
  onOpenIntervention,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [provenanceFilter, setProvenanceFilter] = useState<string>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');

  // Unique project list for dropdown
  const projectsList = useMemo(() => {
    const map = new Map<string, string>();
    records.forEach((r) => {
      map.set(r.projectId, `${r.projectCode} — ${r.projectName}`);
    });
    return Array.from(map.entries());
  }, [records]);

  // Filter logic
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Search term match
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(query);
        const matchesProject = r.projectName.toLowerCase().includes(query) || r.projectCode.toLowerCase().includes(query);
        const matchesRef = r.integrityReference.toLowerCase().includes(query);
        const matchesSource = r.source.toLowerCase().includes(query);
        const matchesMilestone = (r.milestoneTitle || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesProject && !matchesRef && !matchesSource && !matchesMilestone) {
          return false;
        }
      }

      // 2. Project filter
      if (projectFilter !== 'ALL' && r.projectId !== projectFilter) {
        return false;
      }

      // 3. Evidence Type filter
      if (typeFilter !== 'ALL' && r.evidenceType !== typeFilter) {
        return false;
      }

      // 4. Provenance filter
      if (provenanceFilter !== 'ALL' && r.provenance !== provenanceFilter) {
        return false;
      }

      // 5. Verification status filter
      if (verificationFilter !== 'ALL') {
        if (verificationFilter === 'SOURCE_VERIFIED') {
          if (r.provenance !== 'SOURCE') return false;
        } else if (verificationFilter === 'DEMO_VALIDATED') {
          if (r.provenance !== 'SIMULATED' || r.verificationStatus === 'FLAGGED_INCONSISTENCY' || r.verificationStatus === 'PENDING_CONFIRMATION') return false;
        } else if (verificationFilter === 'UNCONNECTED') {
          if (r.provenance !== 'NOT_CONNECTED' && r.verificationStatus !== 'UNCONNECTED') return false;
        } else if (r.verificationStatus !== verificationFilter) {
          return false;
        }
      }

      return true;
    });
  }, [records, searchTerm, projectFilter, typeFilter, provenanceFilter, verificationFilter]);

  // Provenance badge helper
  const renderProvenanceBadge = (provenance: EvidenceProvenanceCategory) => {
    switch (provenance) {
      case 'SOURCE':
        return (
          <span 
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 7px',
              backgroundColor: 'var(--risk-low-bg)',
              color: 'var(--risk-low-text)',
              border: '1px solid var(--risk-low-border)',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            [SOURCE]
          </span>
        );
      case 'SIMULATED':
        return (
          <span 
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 7px',
              backgroundColor: '#fffbeb',
              color: '#b45309',
              border: '1px solid #fde68a',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            [SIMULATED]
          </span>
        );
      case 'NOT_CONNECTED':
        return (
          <span 
            style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '2px 7px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-medium)',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            [NOT CONNECTED]
          </span>
        );
      default:
        return (
          <span 
            style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '2px 7px',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            [{provenance}]
          </span>
        );
    }
  };

  // Verification status helper
  const renderVerificationStatus = (
    status: EvidenceRecord['verificationStatus'],
    provenance: EvidenceProvenanceCategory
  ) => {
    if (provenance === 'NOT_CONNECTED' || status === 'UNCONNECTED') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: 'var(--text-muted)' }}>
          <Link2Off size={12} />
          <span>Unconnected</span>
        </span>
      );
    }
    if (status === 'FLAGGED_INCONSISTENCY') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: 'var(--risk-critical-text)', fontWeight: 600 }}>
          <AlertTriangle size={12} />
          <span>Inconsistency Flagged</span>
        </span>
      );
    }
    if (status === 'PENDING_CONFIRMATION') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: '#b45309', fontWeight: 600 }}>
          <Clock size={12} />
          <span>Pending Review</span>
        </span>
      );
    }
    if (provenance === 'SOURCE' || status === 'SOURCE_VERIFIED') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: 'var(--risk-low-text)', fontWeight: 600 }}>
          <CheckCircle2 size={12} />
          <span>Source verified</span>
        </span>
      );
    }
    // All synthetic demonstration records:
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: '#0369a1', fontWeight: 600 }}>
        <CheckCircle2 size={12} />
        <span>Demo-validated</span>
      </span>
    );
  };

  return (
    <section 
      className="operational-panel"
      style={{ marginBottom: 'var(--space-lg)' }}
      aria-label="Evidence & Documents Register"
    >
      {/* Panel Top Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <Layers size={16} style={{ color: 'var(--admin-blue-800)' }} />
            <span>OPERATIONAL EVIDENCE &amp; FILINGS REGISTER</span>
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
              {filteredRecords.length} of {records.length} Records
            </span>
          </div>
          <div className="panel-subtitle">
            “What evidence supports this risk warning and the officer’s review?” Official project filings, verified inspection logs, and simulation proof.
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
            PROVENANCE INTEGRITY: ENFORCED
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="queue-controls-bar">
        <div className="queue-filters" style={{ flexWrap: 'wrap', gap: '10px' }}>
          {/* Text Search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} style={{ position: 'absolute', left: '8px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '26px', minWidth: '240px' }}
              placeholder="Search title, reference, milestone, agency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Project Filter */}
          <select 
            className="filter-select"
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            style={{ maxWidth: '220px' }}
          >
            <option value="ALL">All Projects ({projectsList.length})</option>
            {projectsList.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>

          {/* Evidence Type Filter */}
          <select 
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Evidence Types</option>
            <option value="MONTHLY_DPR">Monthly DPR / PAIMANA</option>
            <option value="SITE_INSPECTION">Site Inspection Log</option>
            <option value="STATUTORY_NOC">Statutory NOC / Memo</option>
            <option value="FINANCIAL_AUDIT">Financial &amp; Technical Audit</option>
            <option value="DRONE_AERIAL">Drone / Remote Sensing</option>
            <option value="CONTRACTOR_NOTICE">Contractor Formal Notice</option>
          </select>

          {/* Provenance Filter */}
          <select 
            className="filter-select"
            value={provenanceFilter}
            onChange={(e) => setProvenanceFilter(e.target.value)}
          >
            <option value="ALL">All Provenance Types</option>
            <option value="SOURCE">[SOURCE] PAIMANA Records</option>
            <option value="SIMULATED">[SIMULATED] Demonstration Cases</option>
            <option value="NOT_CONNECTED">[NOT CONNECTED] External Feeds</option>
          </select>

          {/* Integrity / Verification Status */}
          <select 
            className="filter-select"
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
          >
            <option value="ALL">All Integrity Statuses</option>
            <option value="SOURCE_VERIFIED">Source verified</option>
            <option value="DEMO_VALIDATED">Demo-validated</option>
            <option value="FLAGGED_INCONSISTENCY">Inconsistency Flagged</option>
            <option value="PENDING_CONFIRMATION">Pending Review</option>
            <option value="UNCONNECTED">Unconnected</option>
          </select>
        </div>

        {(searchTerm || projectFilter !== 'ALL' || typeFilter !== 'ALL' || provenanceFilter !== 'ALL' || verificationFilter !== 'ALL') && (
          <button 
            className="btn-operational btn-secondary-action"
            onClick={() => {
              setSearchTerm('');
              setProjectFilter('ALL');
              setTypeFilter('ALL');
              setProvenanceFilter('ALL');
              setVerificationFilter('ALL');
            }}
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Operational Evidence Table */}
      <div className="operational-table-wrap">
        <table className="operational-table" aria-label="Evidence Register Table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>
                <span>RECORD &amp; REFERENCE</span>
                <span className="table-header-provenance">[FILING]</span>
              </th>
              <th style={{ width: '20%' }}>
                <span>PROJECT &amp; CODE</span>
                <span className="table-header-provenance">[SOURCE]</span>
              </th>
              <th style={{ width: '13%' }}>
                <span>RELATED INTERVENTION</span>
                <span className="table-header-provenance">[TRIAGE]</span>
              </th>
              <th style={{ width: '14%' }}>
                <span>RELATED MILESTONE</span>
                <span className="table-header-provenance">[CRITICAL PATH]</span>
              </th>
              <th style={{ width: '9%' }}>
                <span>PROVENANCE</span>
                <span className="table-header-provenance">[CATEGORY]</span>
              </th>
              <th style={{ width: '9%' }}>
                <span>INTEGRITY</span>
                <span className="table-header-provenance">[STATUS]</span>
              </th>
              <th style={{ width: '10%', textAlign: 'right' }}>
                <span>ACTION</span>
                <span className="table-header-provenance">[INSPECT]</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No evidence filings matching current filter parameters.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => {
                const isSelected = selectedRecordId === item.id;
                return (
                  <tr 
                    key={item.id}
                    className={isSelected ? 'selected-row' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectRecord(item)}
                    title="Click row to open detailed engineering evidence dossier"
                  >
                    {/* 1. RECORD & REFERENCE */}
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {item.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <span 
                          className="mono-num" 
                          style={{ 
                            fontSize: '9.5px', 
                            color: 'var(--text-muted)', 
                            backgroundColor: 'var(--bg-subtle)',
                            padding: '1px 5px',
                            borderRadius: '2px'
                          }}
                        >
                          {item.integrityReference}
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>•</span>
                        <span className="mono-num" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          {item.recordDate}
                        </span>
                      </div>
                    </td>

                    {/* 2. PROJECT */}
                    <td>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {item.projectName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {item.projectCode}
                        </span>
                      </div>
                    </td>

                    {/* 3. RELATED INTERVENTION */}
                    <td>
                      {item.issueId ? (
                        <div>
                          <span 
                            className="mono-num"
                            style={{ 
                              fontSize: '10.5px', 
                              fontWeight: 600, 
                              color: 'var(--admin-blue-900)',
                              backgroundColor: '#eff6ff',
                              padding: '2px 6px',
                              borderRadius: '2px',
                              border: '1px solid #bfdbfe',
                              display: 'inline-block'
                            }}
                          >
                            {item.issueId.toUpperCase()}
                          </span>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Signal: <strong className="mono-num">{item.riskSignalId || 'N/A'}</strong>
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          Portfolio Monitor
                        </span>
                      )}
                    </td>

                    {/* 4. RELATED MILESTONE */}
                    <td>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                        {item.milestoneTitle || 'General Project Milestone'}
                      </div>
                      <div 
                        className="mono-num" 
                        style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}
                      >
                        {item.evidenceType.replace('_', ' ')}
                      </div>
                    </td>

                    {/* 5. PROVENANCE */}
                    <td>
                      <div>{renderProvenanceBadge(item.provenance)}</div>
                      {item.isDemo && (
                        <div style={{ fontSize: '8.5px', color: '#b45309', marginTop: '2px', lineHeight: 1.2 }}>
                          DEMO / SIMULATION
                        </div>
                      )}
                    </td>

                    {/* 6. INTEGRITY STATUS */}
                    <td>
                      <div>{renderVerificationStatus(item.verificationStatus, item.provenance)}</div>
                    </td>

                    {/* 7. ACTIONS */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', alignItems: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord(item);
                          }}
                          className="btn-operational btn-primary-action"
                          style={{ fontSize: '11px', padding: '4px 8px', whiteSpace: 'nowrap' }}
                          title="Open detailed evidence dossier"
                        >
                          <span>Dossier</span>
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

      {/* Footer Info Strip */}
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
          💡 <em>Tip: Selecting any evidence record above opens Screen 2 (Evidence Detail Dossier with Observed vs Interpretation breakdown).</em>
        </div>
        <div>
          Evidence provenance &amp; workflow verification — ProjectSentinel
        </div>
      </div>
    </section>
  );
};
