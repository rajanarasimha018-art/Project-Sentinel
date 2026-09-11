import React from 'react';
import { EvidenceProvenanceItem } from '../../types/sentinel';
import { FileText, ExternalLink, Link2Off, CheckCircle2 } from 'lucide-react';

interface EvidenceProvenanceDossierProps {
  evidenceItems: EvidenceProvenanceItem[];
  onOpenEvidence?: (evidenceId?: string) => void;
}

export const EvidenceProvenanceDossier: React.FC<EvidenceProvenanceDossierProps> = ({ 
  evidenceItems,
  onOpenEvidence
}) => {
  return (
    <div className="operational-panel" style={{ marginBottom: 'var(--space-lg)' }}>
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <FileText size={15} style={{ color: 'var(--admin-blue-800)' }} />
            <span>EVIDENCE PROVENANCE DOSSIER — DOCUMENT PROOF &amp; AUDIT TRAIL</span>
          </div>
          <div className="panel-subtitle">
            Provenance tracking of reported milestone filings, site inspections, and external feeds
          </div>
        </div>

        <div className="panel-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onOpenEvidence && (
            <button
              onClick={() => onOpenEvidence()}
              className="btn-operational btn-secondary-action"
              style={{ fontSize: '10px', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              title="Open full Evidence & Documents module"
            >
              <FileText size={11} />
              <span>Open Evidence Register →</span>
            </button>
          )}
          <span 
            className="demo-layer-pill" 
            style={{ fontSize: '9px', background: '#fff', border: '1px solid var(--border-medium)', color: '#475569' }}
          >
            PROVENANCE INTEGRITY FRAMEWORK
          </span>
        </div>
      </div>

      <div 
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#fafbfc', 
          borderBottom: '1px solid var(--border-hairline)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Provenance Note:</span>
        <span>All non-source records shown in this prototype are synthetic demonstration records.</span>
      </div>

      <div className="operational-table-wrap">
        <table className="operational-table">
          <thead>
            <tr>
              <th style={{ width: '23%' }}>Document / Record</th>
              <th style={{ width: '18%' }}>Provenance Source</th>
              <th style={{ width: '11%' }}>Reporting Period</th>
              <th style={{ width: '17%' }}>Project Association</th>
              <th style={{ width: '13%' }}>Availability Status</th>
              <th style={{ width: '9%' }}>Record Type</th>
              <th style={{ width: '9%', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {evidenceItems.map((ev) => {
              const isNotConnected = ev.availabilityStatus === 'NOT_CONNECTED';
              return (
                <tr key={ev.id}>
                  {/* Document Title */}
                  <td>
                    <div style={{ fontWeight: 600, color: isNotConnected ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {ev.documentTitle}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.35 }}>
                      {ev.summary}
                    </div>
                  </td>

                  {/* Provenance Source */}
                  <td>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {ev.provenanceSource}
                    </div>
                  </td>

                  {/* Period */}
                  <td>
                    <div className="mono-num" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {ev.reportingPeriod}
                    </div>
                  </td>

                  {/* Association */}
                  <td>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {ev.association}
                    </div>
                  </td>

                  {/* Availability */}
                  <td>
                    {isNotConnected ? (
                      <span 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          fontSize: '10px', 
                          fontWeight: 600, 
                          color: 'var(--text-muted)',
                          background: '#f1f5f9',
                          padding: '2px 6px',
                          borderRadius: '2px',
                          border: '1px solid #cbd5e1'
                        }}
                      >
                        <Link2Off size={10} />
                        <span>Evidence source not connected</span>
                      </span>
                    ) : (
                      <span 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          fontSize: '10px', 
                          fontWeight: 600, 
                          color: '#854d0e',
                          background: '#fefce8',
                          padding: '2px 6px',
                          borderRadius: '2px',
                          border: '1px solid #fef08a'
                        }}
                      >
                        <CheckCircle2 size={10} color="#ca8a04" />
                        <span>DEMO / SIMULATION RECORD</span>
                      </span>
                    )}
                  </td>

                  {/* Record Type */}
                  <td>
                    <span 
                      className="mono-num" 
                      style={{ fontSize: '9.5px', color: 'var(--text-muted)', background: 'var(--bg-muted)', padding: '2px 5px', borderRadius: '2px' }}
                    >
                      {ev.evidenceType.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Action Link to Evidence Module */}
                  <td style={{ textAlign: 'right' }}>
                    {onOpenEvidence && (
                      <button
                        onClick={() => onOpenEvidence()}
                        className="btn-operational btn-secondary-action"
                        style={{ fontSize: '10px', padding: '3px 7px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                        title="Open detailed filing in Evidence & Documents module"
                      >
                        <span>Inspect</span>
                        <ExternalLink size={10} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
