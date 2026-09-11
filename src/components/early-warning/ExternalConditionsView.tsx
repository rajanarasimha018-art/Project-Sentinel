import React, { useState } from 'react';
import { AttentionQueueItem } from '../../types/sentinel';
import { MOCK_EXTERNAL_CONDITIONS, getExternalConditionsForProject } from '../../data/gisExternalData';
import { 
  CloudRain, 
  Compass, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight, 
  Calendar, 
  Thermometer, 
  Droplets, 
  Wind, 
  Layers, 
  ArrowLeft,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ExternalConditionsViewProps {
  allProjects: AttentionQueueItem[];
  selectedProject: AttentionQueueItem;
  onSelectProject: (item: AttentionQueueItem) => void;
  onOpenProjectIntelligence: (item: AttentionQueueItem) => void;
  onOpenIntervention?: (projectId: string, issueId?: string) => void;
  onOpenEvidence?: (evidenceId?: string, projectId?: string) => void;
  onBackToRegister: () => void;
}

export const ExternalConditionsView: React.FC<ExternalConditionsViewProps> = ({
  allProjects,
  selectedProject,
  onSelectProject,
  onOpenProjectIntelligence,
  onOpenIntervention,
  onOpenEvidence,
  onBackToRegister,
}) => {
  const [activeProjectId, setActiveProjectId] = useState<string>(selectedProject.project.id);

  // Sync state if selectedProject prop changes
  const activeItem = allProjects.find((p) => p.project.id === activeProjectId) || selectedProject;
  const externalData = getExternalConditionsForProject(activeItem.project.id) || MOCK_EXTERNAL_CONDITIONS['prj-nhai-842'];

  const handleProjectSwitch = (newId: string) => {
    setActiveProjectId(newId);
    const found = allProjects.find((p) => p.project.id === newId);
    if (found) {
      onSelectProject(found);
    }
  };

  return (
    <div className="external-conditions-view" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* 1. Header & Institutional Mode Strip */}
      <div className="operational-panel" style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <button
                onClick={onBackToRegister}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '2px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={12} />
                <span>Return to Emerging Risk Register</span>
              </button>
              <span style={{ 
                fontSize: '10px', 
                fontFamily: 'var(--font-mono)', 
                fontWeight: 700, 
                padding: '2px 7px', 
                backgroundColor: '#eff6ff', 
                color: '#1e40af', 
                border: '1px solid #bfdbfe',
                borderRadius: '2px'
              }}>
                EARLY WARNING → EXTERNAL CONDITIONS
              </span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px 0', letterSpacing: '-0.02em' }}>
              EXTERNAL CONDITIONS
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Location and external-signal context for officer review • <em>“Could relevant external conditions increase exposure for this project or activity?”</em>
            </div>
          </div>

          {/* Project Selector & Direct Deep Links */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                Target Project:
              </span>
              <select
                value={activeItem.project.id}
                onChange={(e) => handleProjectSwitch(e.target.value)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '2px',
                  border: '1px solid var(--border-dark)',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-primary)',
                  maxWidth: '360px',
                }}
              >
                {allProjects.map((p) => (
                  <option key={p.project.id} value={p.project.id}>
                    {p.project.code} — {p.project.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => onOpenProjectIntelligence(activeItem)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--admin-blue-800)',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '2px',
                  padding: '3px 9px',
                  cursor: 'pointer',
                }}
              >
                <span>OPEN PROJECT INTELLIGENCE</span>
                <ChevronRight size={12} />
              </button>

              {externalData.relatedIssueId && onOpenIntervention && (
                <button
                  onClick={() => onOpenIntervention(activeItem.project.id, externalData.relatedIssueId)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#9a3412',
                    backgroundColor: '#fff7ed',
                    border: '1px solid #fed7aa',
                    borderRadius: '2px',
                    padding: '3px 9px',
                    cursor: 'pointer',
                  }}
                >
                  <AlertCircle size={11} />
                  <span>REVIEW RELATED INTERVENTION</span>
                </button>
              )}

              {externalData.relatedEvidenceId && onOpenEvidence && (
                <button
                  onClick={() => onOpenEvidence(externalData.relatedEvidenceId, activeItem.project.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#166534',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '2px',
                    padding: '3px 9px',
                    cursor: 'pointer',
                  }}
                >
                  <FileText size={11} />
                  <span>INSPECT SUPPORTING EVIDENCE</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mandatory Causation Boundary Banner */}
      <div 
        style={{ 
          backgroundColor: '#fffbeb', 
          border: '1px solid #fef3c7', 
          borderLeft: '4px solid #d97706', 
          borderRadius: '2px', 
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400e', fontWeight: 700, fontSize: '11.5px' }}>
            <AlertTriangle size={14} />
            <span>CAUSATION BOUNDARY PROTOCOL — MANDATORY DISCLOSURE</span>
          </div>
          <div style={{ fontSize: '11px', color: '#78350f', marginTop: '2px' }}>
            <strong>Potential weather exposure — causal impact not established.</strong> ProjectSentinel identifies schedule-window overlap as decision-support context. ProjectSentinel does not claim weather will cause a specific day delay or caused historical project delay until empirical causal methodology is validated.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', fontSize: '10px', flexShrink: 0 }}>
          <span style={{ padding: '2px 6px', backgroundColor: '#ffffff', border: '1px solid #fed7aa', color: '#9a3412', fontWeight: 600, borderRadius: '2px' }}>
            [CALCULATED] Window Overlap
          </span>
          <span style={{ padding: '2px 6px', backgroundColor: '#ffffff', border: '1px solid #fed7aa', color: '#9a3412', fontWeight: 600, borderRadius: '2px' }}>
            [PROTOTYPE MODEL] Validation in Progress
          </span>
        </div>
      </div>

      {/* 3. Main Grid: Screen 2 (Project Location Context) & Screen 3 (Weather Exposure Context) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 'var(--space-lg)' }}>
        
        {/* SCREEN 2 — PROJECT LOCATION CONTEXT */}
        <div className="operational-panel" style={{ height: '100%' }}>
          <div className="panel-header" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-hairline)' }}>
            <div className="panel-title-group">
              <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700 }}>
                <Compass size={14} style={{ color: 'var(--admin-blue-800)' }} />
                <span>PROJECT LOCATION CONTEXT</span>
              </div>
              <div className="panel-subtitle" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Official corridor alignment and spatial reference attributes
              </div>
            </div>

            <span style={{ 
              fontSize: '10px', 
              fontWeight: 700, 
              padding: '2px 6px', 
              backgroundColor: '#eff6ff', 
              color: '#1e40af', 
              borderRadius: '2px', 
              border: '1px solid #bfdbfe' 
            }}>
              [SOURCE] MoSPI PAIMANA
            </span>
          </div>

          <div className="panel-body" style={{ padding: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                  <td style={{ padding: '7px 4px', fontWeight: 600, color: 'var(--text-muted)', width: '38%' }}>
                    Project Name
                  </td>
                  <td style={{ padding: '7px 4px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {externalData.projectName}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                  <td style={{ padding: '7px 4px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Project ID
                  </td>
                  <td style={{ padding: '7px 4px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--admin-blue-900)' }}>
                    {externalData.projectCode}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                  <td style={{ padding: '7px 4px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Sector
                  </td>
                  <td style={{ padding: '7px 4px', color: 'var(--text-secondary)' }}>
                    {externalData.sector}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                  <td style={{ padding: '7px 4px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    State / Region
                  </td>
                  <td style={{ padding: '7px 4px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {externalData.stateRegion}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                  <td style={{ padding: '7px 4px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Project Location
                  </td>
                  <td style={{ padding: '7px 4px', color: 'var(--text-secondary)' }}>
                    {externalData.projectLocation}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                  <td style={{ padding: '7px 4px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Location Precision
                  </td>
                  <td style={{ padding: '7px 4px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#1e40af', fontWeight: 600 }}>
                    {externalData.locationPrecision}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-hairline)' }}>
                  <td style={{ padding: '7px 4px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Last Source Update
                  </td>
                  <td style={{ padding: '7px 4px', color: 'var(--text-secondary)' }}>
                    {externalData.lastSourceUpdate}
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: '7px 4px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Provenance
                  </td>
                  <td style={{ padding: '7px 4px' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      fontWeight: 700, 
                      padding: '2px 6px', 
                      backgroundColor: '#f0fdf4', 
                      color: '#166534', 
                      border: '1px solid #bbf7d0', 
                      borderRadius: '2px' 
                    }}>
                      [SOURCE] MoSPI PAIMANA Published Baseline
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Geographical Restraint Inset */}
            <div style={{ marginTop: '14px', padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <Layers size={12} />
                <span>Geographic Precision Note:</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Spatial positioning uses administrative district and corridor alignment points published in official project documents. Coordinates represent corridor centroids; exact construction GPS telemetry is neither connected nor implied.
              </div>
            </div>
          </div>
        </div>

        {/* SCREEN 3 — WEATHER EXPOSURE CONTEXT */}
        <div className="operational-panel" style={{ height: '100%' }}>
          <div className="panel-header" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-hairline)' }}>
            <div className="panel-title-group">
              <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: 700 }}>
                <CloudRain size={14} style={{ color: 'var(--admin-blue-800)' }} />
                <span>WEATHER EXPOSURE CONTEXT</span>
              </div>
              <div className="panel-subtitle" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Demonstration meteorological exposure variables for workflow review
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ 
                fontSize: '9.5px', 
                fontWeight: 700, 
                padding: '2px 6px', 
                backgroundColor: '#fef3c7', 
                color: '#92400e', 
                borderRadius: '2px', 
                border: '1px solid #fde68a' 
              }}>
                [SIMULATED] DEMO SCENARIO
              </span>
              <span style={{ 
                fontSize: '9.5px', 
                fontWeight: 700, 
                padding: '2px 6px', 
                backgroundColor: '#f1f5f9', 
                color: '#475569', 
                borderRadius: '2px', 
                border: '1px solid #cbd5e1' 
              }}>
                {externalData.weather.feedLabel}
              </span>
            </div>
          </div>

          <div className="panel-body" style={{ padding: '16px' }}>
            {/* Disclaimer pill */}
            <div style={{ 
              marginBottom: '12px', 
              padding: '8px 10px', 
              backgroundColor: '#f8fafc', 
              border: '1px solid var(--border-medium)', 
              borderRadius: '2px',
              fontSize: '10.5px',
              color: 'var(--text-secondary)'
            }}>
              <strong>Demonstration Feed Notice:</strong> {externalData.weather.provenanceLabel}. Values represent representative regional weather scenarios used to test officer review protocols. Weather data is not live, real-time, or connected to IMD sensor telemetry.
            </div>

            {/* Weather Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Droplets size={11} />
                  <span>Precipitation Prob.</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: externalData.weather.precipitationProbabilityPct > 50 ? '#dc2626' : 'var(--text-primary)', marginTop: '2px' }}>
                  {externalData.weather.precipitationProbabilityPct}%
                </div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                  {externalData.weather.precipitationProbabilityPct > 50 ? 'Elevated exposure' : 'Normal range'}
                </div>
              </div>

              <div style={{ padding: '10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CloudRain size={11} />
                  <span>Rainfall Intensity</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: externalData.weather.rainfallIntensityMmHr > 15 ? '#dc2626' : 'var(--text-primary)', marginTop: '2px' }}>
                  {externalData.weather.rainfallIntensityMmHr} <span style={{ fontSize: '11px', fontWeight: 500 }}>mm/hr</span>
                </div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                  Peak forecast rate
                </div>
              </div>

              <div style={{ padding: '10px', backgroundColor: '#f8fafc', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Thermometer size={11} />
                  <span>Temperature</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: externalData.weather.temperatureC < 0 || externalData.weather.temperatureC > 38 ? '#ea580c' : 'var(--text-primary)', marginTop: '2px' }}>
                  {externalData.weather.temperatureC}°C
                </div>
                <div style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                  Corridor ambient
                </div>
              </div>
            </div>

            {/* Context Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-hairline)' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Severe Weather Condition:</span>
                <span style={{ fontWeight: 700, color: '#9a3412', textAlign: 'right', maxWidth: '60%' }}>
                  {externalData.weather.severeCondition}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-hairline)' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Forecast Period:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {externalData.weather.forecastPeriod}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Forecast Timestamp:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {externalData.weather.forecastTimestamp}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SCREEN 4 — PROJECT ACTIVITY EXPOSURE */}
      <div className="operational-panel">
        <div className="panel-header" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-hairline)' }}>
          <div className="panel-title-group">
            <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }}>
              <ShieldCheck size={15} style={{ color: 'var(--admin-blue-800)' }} />
              <span>PROJECT ACTIVITY EXPOSURE</span>
            </div>
            <div className="panel-subtitle" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Deterministic schedule-window correlation against external environmental conditions
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 700, 
              padding: '2px 7px', 
              backgroundColor: '#eff6ff', 
              color: '#1e40af', 
              border: '1px solid #bfdbfe', 
              borderRadius: '2px' 
            }}>
              {externalData.activityExposure.deterministicOverlapLabel}
            </span>
          </div>
        </div>

        <div className="panel-body" style={{ padding: '16px 20px' }}>
          {/* Exact Structure demanded by Milestone 6 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            
            {/* Box 1: PROJECT ACTIVITY */}
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                PROJECT ACTIVITY [SIMULATED]
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                {externalData.activityExposure.projectActivity}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Milestone Ref: <span style={{ fontFamily: 'var(--font-mono)' }}>{externalData.activityExposure.milestoneId || 'N/A'}</span>
              </div>
            </div>

            {/* Box 2: EXTERNAL CONDITION */}
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                EXTERNAL CONDITION
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#9a3412', marginTop: '6px' }}>
                {externalData.activityExposure.externalCondition}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Simulated weather scenario parameter
              </div>
            </div>

            {/* Box 3: SCHEDULE OVERLAP */}
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-hairline)', borderRadius: '2px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                SCHEDULE OVERLAP [CALCULATED]
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--admin-blue-900)', marginTop: '6px' }}>
                {externalData.activityExposure.scheduleOverlap}
              </div>
              <div style={{ fontSize: '10px', color: '#1e40af', marginTop: '4px' }}>
                Deterministic calendar window check
              </div>
            </div>

            {/* Box 4: PROJECTSENTINEL CONTEXT & REVIEW STATUS */}
            <div style={{ padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '2px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1e40af', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                PROJECTSENTINEL CONTEXT
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--admin-blue-900)', marginTop: '4px' }}>
                {externalData.activityExposure.projectSentinelContext}
              </div>
              <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ 
                  fontSize: '10.5px', 
                  fontWeight: 700, 
                  color: '#9a3412', 
                  backgroundColor: '#fff7ed', 
                  border: '1px solid #fed7aa', 
                  padding: '2px 7px', 
                  borderRadius: '2px' 
                }}>
                  {externalData.activityExposure.reviewStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Causation Warning Note */}
          <div style={{ padding: '10px 14px', backgroundColor: '#fafafa', border: '1px solid var(--border-hairline)', borderRadius: '2px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <strong>Operational Context Boundary:</strong> {externalData.activityExposure.causationBoundaryNote}
            <div style={{ marginTop: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
              <em>{externalData.activityExposure.modelContributionLabel} Until external variables are empirically validated, weather conditions do not claim to improve ML prediction accuracy.</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
