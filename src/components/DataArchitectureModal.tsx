import React from 'react';
import { X, Database, CheckCircle2, GitBranch, Cpu, ShieldAlert } from 'lucide-react';

interface DataArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataArchitectureModal: React.FC<DataArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="action-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div 
        className="operational-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ width: '740px', maxWidth: '94vw', maxHeight: '88vh', overflowY: 'auto', margin: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
      >
        <div className="panel-header" style={{ padding: '14px 20px' }}>
          <div className="panel-title-group">
            <div className="panel-title">
              <Database size={16} style={{ color: 'var(--admin-blue-800)' }} />
              <span>PROJECTSENTINEL DATA ORIGIN &amp; CREDIBILITY CLASSIFICATION</span>
            </div>
            <div className="panel-subtitle">
              Strict isolation across Source Data, Calculated Analytics, Prototype Models, and Demonstration Scenarios
            </div>
          </div>
          <button onClick={onClose} className="drawer-close-btn">
            <X size={16} />
          </button>
        </div>

        <div className="panel-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Guiding principle callout */}
          <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', border: '1px solid var(--border-medium)', borderRadius: '2px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Integrity Standard (SIH26103):</strong><br />
            To maintain complete credibility, ProjectSentinel never presents simulated values as verified government telemetry. Every figure displayed on the National Cockpit belongs strictly to one of the five categories below.
          </div>

          {/* 5-Category Classification Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* 1. SOURCE-DERIVED */}
            <div style={{ padding: '12px', border: '1px solid var(--border-hairline)', borderRadius: '2px', backgroundColor: '#fafbfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-blue-800)' }}>
                <GitBranch size={13} />
                <span>1. Source-Derived Data</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                <strong>Origin: </strong>Official MoSPI published overview records and Central Sector Project flash reports.
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Includes: Project names, codes, sanction budgets, original COD, and implementing agencies.
              </div>
            </div>

            {/* 2. CALCULATED ANALYTICS */}
            <div style={{ padding: '12px', border: '1px solid var(--border-hairline)', borderRadius: '2px', backgroundColor: '#fafbfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#166534' }}>
                <CheckCircle2 size={13} />
                <span>2. Calculated Analytics</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                <strong>Origin: </strong>Reproducibly computed directly from the loaded workspace records.
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Includes: Delayed project counts (where anticipated &gt; original), total cost overrun (+₹21,911 Cr), and schema completeness rates.
              </div>
            </div>

            {/* 3. MODEL OUTPUTS */}
            <div style={{ padding: '12px', border: '1px solid var(--border-hairline)', borderRadius: '2px', backgroundColor: '#fafbfc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#9a3412' }}>
                <Cpu size={13} />
                <span>3. Model Outputs (Prototype)</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                <strong>Origin: </strong>Rule-based and heuristic schedule risk algorithm (Validation in Progress).
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Includes: Risk scores (0–1.00), urgency tiers, and direction delta vectors.
              </div>
            </div>

            {/* 4. DEMO / SIMULATION SCENARIOS */}
            <div style={{ padding: '12px', border: '1px solid #fed7aa', borderRadius: '2px', backgroundColor: '#fff7ed' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#9a3412' }}>
                <ShieldAlert size={13} />
                <span>4. Demo Scenarios / Simulations</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                <strong>Origin: </strong>Curated operational case studies demonstrating real-world ground impediments.
              </div>
              <div style={{ fontSize: '10px', color: '#9a3412', marginTop: '6px' }}>
                Includes: Factor narratives, drone survey mock entries, and field notes for validating officer workflows.
              </div>
            </div>

            {/* 5. EXTERNAL DATA */}
            <div style={{ gridColumn: 'span 2', padding: '10px 12px', border: '1px solid var(--border-hairline)', borderRadius: '2px', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                <span>5. External Data Feeds</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <strong>Status: Not Connected in Prototype. </strong>Live weather radar feeds, GIS satellite imagery APIs, and state revenue court feeds are isolated stubs awaiting subsequent development rounds.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button onClick={onClose} className="btn-operational btn-primary-action" style={{ padding: '6px 14px' }}>
              Close Origin Specification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
