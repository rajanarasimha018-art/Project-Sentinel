import React from 'react';
import { AttentionQueueItem } from '../../types/sentinel';
import { HelpCircle, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface RiskExplanationProps {
  projectItem: AttentionQueueItem;
}

export const RiskExplanation: React.FC<RiskExplanationProps> = ({ projectItem }) => {
  const { riskFactors } = projectItem;

  // 6 standard infrastructure implementation dimensions
  const allDimensions = [
    { key: 'STATUTORY_CLEARANCES', label: 'Statutory & Environmental Clearances' },
    { key: 'CONTRACTOR_CAPACITY', label: 'Contractor Execution & Equipment Deployment' },
    { key: 'LAND_ACQUISITION', label: 'Land Acquisition & Right-of-Way (RoW)' },
    { key: 'GEOLOGICAL', label: 'Geological, Terrain & Climate Ingress' },
    { key: 'UTILITY_SHIFTING', label: 'Utility Relocation & Multi-Agency Coordination' },
    { key: 'FINANCIAL_FLOW', label: 'Financial Flow, Escrow & Billing Disbursal' },
  ];

  return (
    <div className="operational-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="panel-title">
            <ShieldAlert size={15} style={{ color: 'var(--admin-blue-800)' }} />
            <span>RISK DRIVERS &amp; EXPLANATION</span>
          </div>
          <div className="panel-subtitle">
            “Why is this project becoming risky?” — Root implementation bottleneck attribution
          </div>
        </div>

        <div className="panel-actions">
          <span 
            className="demo-layer-pill" 
            style={{ fontSize: '9px', background: '#fff', border: '1px solid var(--border-medium)', color: '#475569' }}
          >
            PROTOTYPE ATTRIBUTION — VALIDATION IN PROGRESS
          </span>
        </div>
      </div>

      <div className="panel-body" style={{ padding: '16px 20px' }}>
        {/* Methodological Signal Distinction Strip */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '8px', 
            marginBottom: '12px', 
            fontSize: '11px' 
          }}
        >
          <div style={{ padding: '6px 9px', backgroundColor: '#f8fafc', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
              1. Observed Signal
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '10.5px' }}>
              Factual project reporting entries &amp; physical progress filings.
            </span>
          </div>
          <div style={{ padding: '6px 9px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '2px' }}>
            <span style={{ fontWeight: 700, color: 'var(--admin-blue-900)', display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
              2. Prototype Interpretation
            </span>
            <span style={{ color: 'var(--admin-blue-800)', fontSize: '10.5px' }}>
              Heuristic bottleneck mapping &amp; indicative risk weighting.
            </span>
          </div>
          <div style={{ padding: '6px 9px', backgroundColor: '#fefce8', border: '1px solid #fef08a', borderRadius: '2px' }}>
            <span style={{ fontWeight: 700, color: '#854d0e', display: 'block', textTransform: 'uppercase', fontSize: '10px' }}>
              3. Validated Model Contribution
            </span>
            <span style={{ color: '#713f12', fontSize: '10.5px' }}>
              Pending validation on historical MoSPI dataset; not validated ML attribution.
            </span>
          </div>
        </div>

        {/* Guardrail explanation notice */}
        <div 
          style={{ 
            padding: '8px 12px', 
            backgroundColor: '#fafbfc', 
            border: '1px solid var(--border-hairline)', 
            borderRadius: '2px', 
            fontSize: '11px',
            color: 'var(--text-secondary)',
            marginBottom: '14px',
            lineHeight: 1.45
          }}
        >
          <strong>Methodological Note: </strong>
          Factor percentages shown below reflect prototype attribution heuristics under validation. They must not be interpreted as validated machine-learning feature attributions. Production statistical models are currently undergoing historical calibration against MoSPI completion outcomes.
        </div>

        {/* 6 Implementation Dimensions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {allDimensions.map((dim) => {
            const matchedFactor = riskFactors.find((rf) => rf.category === dim.key);

            if (matchedFactor) {
              return (
                <div 
                  key={dim.key} 
                  style={{ 
                    padding: '10px 12px', 
                    border: '1px solid var(--border-hairline)', 
                    borderRadius: '2px', 
                    backgroundColor: '#fff' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span 
                        style={{ 
                          width: '7px', 
                          height: '7px', 
                          borderRadius: '50%', 
                          backgroundColor: matchedFactor.severity === 'CRITICAL' ? 'var(--risk-critical-bar)' : 'var(--risk-high-bar)' 
                        }} 
                      />
                      <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                        {dim.label}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono-num" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--risk-critical-text)' }}>
                        {matchedFactor.weightPct}% contribution
                      </span>
                      <span 
                        style={{ 
                          fontSize: '9px', 
                          color: '#854d0e', 
                          backgroundColor: '#fefce8', 
                          border: '1px solid #fef08a', 
                          padding: '1px 5px', 
                          borderRadius: '2px', 
                          fontFamily: 'var(--font-mono)' 
                        }}
                      >
                        [SIMULATED] Prototype attribution — validation in progress
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                    <strong>Observed Signal ({matchedFactor.title}): </strong>
                    {matchedFactor.groundObservation}
                  </div>

                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    Source Field Mapping: {matchedFactor.paimanaFieldRef}
                  </div>
                </div>
              );
            }

            // Dimension not present in source
            return (
              <div 
                key={dim.key}
                style={{ 
                  padding: '8px 12px', 
                  border: '1px dashed var(--border-hairline)', 
                  borderRadius: '2px', 
                  backgroundColor: '#fcfdfd',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {dim.label}
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Not available in current source dataset
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
