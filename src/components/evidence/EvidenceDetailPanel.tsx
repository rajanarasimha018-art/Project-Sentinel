import React from 'react';
import { EvidenceRecord, EvidenceProvenanceCategory } from '../../types/sentinel';
import { 
  FileText, 
  ArrowLeft, 
  ExternalLink, 
  ShieldAlert, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Clock, 
  Link2Off,
  Scale,
  Calendar,
  Tag,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface EvidenceDetailPanelProps {
  record: EvidenceRecord;
  onBackToRegister: () => void;
  onOpenProjectIntelligence: (projectId: string) => void;
  onOpenIntervention: (projectId: string, issueId?: string) => void;
}

export const EvidenceDetailPanel: React.FC<EvidenceDetailPanelProps> = ({
  record,
  onBackToRegister,
  onOpenProjectIntelligence,
  onOpenIntervention,
}) => {
  // Provenance badge helper
  const renderProvenanceBadge = (provenance: EvidenceProvenanceCategory) => {
    switch (provenance) {
      case 'SOURCE':
        return (
          <span 
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              backgroundColor: 'var(--risk-low-bg)',
              color: 'var(--risk-low-text)',
              border: '1px solid var(--risk-low-border)',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            [SOURCE] Published MoSPI PAIMANA
          </span>
        );
      case 'SIMULATED':
        return (
          <span 
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              backgroundColor: '#fffbeb',
              color: '#b45309',
              border: '1px solid #fde68a',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            [SIMULATED] Demonstration Scenario
          </span>
        );
      case 'NOT_CONNECTED':
        return (
          <span 
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 8px',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-medium)',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)'
            }}
          >
            [NOT CONNECTED] External Telemetry
          </span>
        );
      default:
        return (
          <span 
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 8px',
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

  return (
    <div className="operational-panel" style={{ marginBottom: 'var(--space-lg)' }}>
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onBackToRegister}
              className="btn-operational btn-secondary-action"
              style={{ padding: '3px 8px', fontSize: '11px', marginRight: '4px' }}
              title="Return to Evidence Register"
            >
              <ArrowLeft size={12} />
              <span>Register</span>
            </button>
            <FileText size={16} style={{ color: 'var(--admin-blue-800)' }} />
            <span>EVIDENCE RECORD DOSSIER #{record.id.toUpperCase()}</span>
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
              {record.integrityReference}
            </span>
          </div>
          <div className="panel-subtitle">
            Operational evidence review dossier for {record.projectName}
          </div>
        </div>

        {/* Top Right Action Deep Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onOpenProjectIntelligence(record.projectId)}
            className="btn-operational btn-secondary-action"
            style={{ fontSize: '11px', padding: '5px 10px' }}
            title="Open Project Intelligence dossier"
          >
            <ExternalLink size={12} />
            <span>Project Intelligence</span>
          </button>

          {record.issueId && (
            <button
              onClick={() => onOpenIntervention(record.projectId, record.issueId)}
              className="btn-operational btn-primary-action"
              style={{ fontSize: '11px', padding: '5px 12px' }}
              title="Inspect related intervention case"
            >
              <Scale size={12} />
              <span>Open Intervention Case</span>
            </button>
          )}
        </div>
      </div>

      {/* DEMO / SIMULATION SAFETY BANNER */}
      {record.isDemo ? (
        <div 
          style={{
            margin: '16px 20px 0 20px',
            padding: '12px 16px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <ShieldAlert size={20} style={{ color: '#b45309', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span 
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: '#b45309',
                  color: '#fff',
                  padding: '1px 6px',
                  borderRadius: '2px',
                  letterSpacing: '0.04em'
                }}
              >
                DEMO / SIMULATION
              </span>
              <strong style={{ fontSize: '12px', color: '#92400e' }}>
                Synthetic Demonstration Record — Not an Official Government Document
              </strong>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '11.5px', color: '#78350f', lineHeight: 1.4 }}>
              This record is curated strictly to demonstrate the officer investigation, geotechnical/statutory validation, and resolution workflows.
              It does not represent an official gazette notification, signed ministry order, or public MoSPI PAIMANA filing.
            </p>
          </div>
        </div>
      ) : record.provenance === 'NOT_CONNECTED' ? (
        <div 
          style={{
            margin: '16px 20px 0 20px',
            padding: '12px 16px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <Link2Off size={18} style={{ color: 'var(--text-muted)' }} />
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            <strong>External Data Feed Endpoint Not Connected:</strong> This record outlines the live telemetry schema specification. External sensor/drone APIs are not connected in the standalone reference environment.
          </div>
        </div>
      ) : (
        <div 
          style={{
            margin: '16px 20px 0 20px',
            padding: '10px 16px',
            backgroundColor: 'var(--risk-low-bg)',
            border: '1px solid var(--risk-low-border)',
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <ShieldCheck size={18} style={{ color: 'var(--risk-low-text)' }} />
          <div style={{ fontSize: '11.5px', color: 'var(--risk-low-text)' }}>
            <strong>Official Source Record:</strong> Mapped directly from published MoSPI PAIMANA central sector project monitoring databases (Oct–Dec 2025 Cycle).
          </div>
        </div>
      )}

      {/* Main Dossier Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Document Title & Identification Strip */}
        <div 
          style={{
            padding: '16px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-xs)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                RECORD TITLE &amp; ISSUING SOURCE
              </span>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                {record.title}
              </h2>
            </div>
            <div>{renderProvenanceBadge(record.provenance)}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '11px', paddingTop: '10px', borderTop: '1px solid var(--border-hairline)' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Project Identity [SOURCE]</span>
              <strong style={{ color: 'var(--text-primary)' }}>{record.projectName}</strong>
              <div className="mono-num" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{record.projectCode}</div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Issuing Authority / Source</span>
              <strong style={{ color: 'var(--text-primary)' }}>{record.source}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Record Filing Date</span>
              <strong className="mono-num" style={{ color: 'var(--text-primary)' }}>{record.recordDate}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>Integrity Status</span>
              <strong style={{ color: record.provenance === 'SOURCE' ? 'var(--risk-low-text)' : record.provenance === 'NOT_CONNECTED' ? 'var(--text-muted)' : '#0369a1' }}>
                {record.provenance === 'SOURCE' 
                  ? 'Source verified' 
                  : record.provenance === 'NOT_CONNECTED' 
                    ? 'Unconnected' 
                    : record.verificationStatus === 'FLAGGED_INCONSISTENCY' 
                      ? 'Inconsistency Flagged' 
                      : record.verificationStatus === 'PENDING_CONFIRMATION' 
                        ? 'Pending Review' 
                        : 'Demo-validated'}
              </strong>
              <div className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{record.integrityReference}</div>
            </div>
          </div>
        </div>

        {/* Association & Cross-Module Context Matrix */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
          }}
        >
          {/* Linked Critical Path Milestone */}
          <div 
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-paper-tint)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>
              CRITICAL PATH MILESTONE [SOURCE]
            </span>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.35 }}>
              {record.milestoneTitle || 'Overall Project Delivery Baseline'}
            </div>
            <div className="mono-num" style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Milestone Ref: {record.milestoneId || 'N/A'}
            </div>
          </div>

          {/* Linked Emerging Risk Signal */}
          <div 
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-paper-tint)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>
              EARLY WARNING RISK SIGNAL [PROTOTYPE MODEL]
            </span>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
              Signal Ref: <span className="mono-num">{record.riskSignalId || 'Portfolio Baseline Signal'}</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Risk classification — validation in progress
            </div>
          </div>

          {/* Linked Intervention Case */}
          <div 
            style={{
              padding: '12px',
              backgroundColor: 'var(--bg-paper-tint)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)'
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>
              INTERVENTION CASE FILE [SIMULATED]
            </span>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-blue-900)', marginTop: '4px' }}>
              {record.issueId ? (
                <button
                  onClick={() => onOpenIntervention(record.projectId, record.issueId)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--admin-blue-900)',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Case #{record.issueId.toUpperCase()} →
                </button>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>No active escalation issue</span>
              )}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Triage &amp; administrative role workflow
            </div>
          </div>
        </div>

        {/* STRICT SPLIT: OBSERVED / SOURCE INFORMATION vs PROJECTSENTINEL INTERPRETATION */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '16px',
          }}
        >
          {/* LEFT: OBSERVED / SOURCE INFORMATION */}
          <div 
            style={{
              padding: '16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--admin-blue-900)', letterSpacing: '0.04em' }}>
                1. OBSERVED / SOURCE INFORMATION
              </span>
              <span 
                style={{ 
                  fontSize: '9.5px', 
                  fontWeight: 700, 
                  color: record.provenance === 'SOURCE' ? 'var(--risk-low-text)' : '#b45309',
                  backgroundColor: record.provenance === 'SOURCE' ? 'var(--risk-low-bg)' : '#fffbeb',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  border: `1px solid ${record.provenance === 'SOURCE' ? 'var(--risk-low-border)' : '#fde68a'}`
                }}
              >
                {record.provenanceLabel}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5, fontWeight: 500 }}>
              {record.observedContent}
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '6px', paddingTop: '8px', borderTop: '1px solid var(--border-hairline)' }}>
              <strong>Context Summary: </strong>
              <span>{record.description}</span>
            </div>

            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 'auto', paddingTop: '10px' }}>
              * Factual ground parameters documented in project filing or site log.
            </div>
          </div>

          {/* RIGHT: PROJECTSENTINEL INTERPRETATION */}
          <div 
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e3a8a', letterSpacing: '0.04em' }}>
                2. PROJECTSENTINEL INTERPRETATION
              </span>
              <span 
                style={{ 
                  fontSize: '9.5px', 
                  fontWeight: 600, 
                  color: '#1e40af', 
                  backgroundColor: '#eff6ff',
                  padding: '2px 6px',
                  borderRadius: '2px',
                  border: '1px solid #bfdbfe'
                }}
              >
                [CALCULATED / PROTOTYPE MODEL]
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#1e293b', lineHeight: 1.5 }}>
              {record.interpretation}
            </div>

            {/* Supported Action Summary */}
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '2px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                SUPPORTED DECISION &amp; TRIAGE PROTOCOL
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                This evidence verifies the critical path impediment and justifies the assigned officer conducting field verification or initiating apex escalation.
              </div>
            </div>

            <div style={{ fontSize: '10px', color: '#64748b', fontStyle: 'italic', marginTop: 'auto', paddingTop: '10px' }}>
              * Analytical model synthesis — validation in progress. Final decision authority rests with designated officials.
            </div>
          </div>
        </div>

        {/* Bottom Actions Toolbar */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-hairline)',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <button
            onClick={onBackToRegister}
            className="btn-operational btn-secondary-action"
            style={{ fontSize: '11px', padding: '6px 14px' }}
          >
            <ArrowLeft size={13} />
            <span>Return to Evidence Register</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onOpenProjectIntelligence(record.projectId)}
              className="btn-operational btn-secondary-action"
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              <ExternalLink size={13} />
              <span>Inspect Project in Project Intelligence</span>
            </button>

            {record.issueId && (
              <button
                onClick={() => onOpenIntervention(record.projectId, record.issueId)}
                className="btn-operational btn-primary-action"
                style={{ fontSize: '11px', padding: '6px 14px' }}
              >
                <Scale size={13} />
                <span>Open Related Intervention Case File</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
