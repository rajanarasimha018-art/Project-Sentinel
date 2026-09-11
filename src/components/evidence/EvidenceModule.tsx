import React, { useState, useEffect } from 'react';
import { EvidenceRecord } from '../../types/sentinel';
import { MASTER_EVIDENCE_RECORDS, getEvidenceById } from '../../data/evidenceData';
import { EvidenceHeader } from './EvidenceHeader';
import { EvidenceRegister } from './EvidenceRegister';
import { EvidenceDetailPanel } from './EvidenceDetailPanel';

interface EvidenceModuleProps {
  initialSelectedEvidenceId?: string | null;
  initialSelectedProjectId?: string | null;
  onOpenProjectIntelligence: (projectId: string) => void;
  onOpenIntervention: (projectId: string, issueId?: string) => void;
}

export const EvidenceModule: React.FC<EvidenceModuleProps> = ({
  initialSelectedEvidenceId,
  initialSelectedProjectId,
  onOpenProjectIntelligence,
  onOpenIntervention,
}) => {
  const [records] = useState<EvidenceRecord[]>(MASTER_EVIDENCE_RECORDS);
  const [activeSubView, setActiveSubView] = useState<'register' | 'detail'>('register');

  // Initial selected record
  const [selectedRecordId, setSelectedRecordId] = useState<string>(() => {
    if (initialSelectedEvidenceId) {
      const match = MASTER_EVIDENCE_RECORDS.find((r) => r.id === initialSelectedEvidenceId);
      if (match) return match.id;
    }
    if (initialSelectedProjectId) {
      const match = MASTER_EVIDENCE_RECORDS.find((r) => r.projectId === initialSelectedProjectId);
      if (match) return match.id;
    }
    return MASTER_EVIDENCE_RECORDS[0].id;
  });

  // Watch prop changes for deep linking
  useEffect(() => {
    if (initialSelectedEvidenceId) {
      const match = MASTER_EVIDENCE_RECORDS.find((r) => r.id === initialSelectedEvidenceId);
      if (match) {
        setSelectedRecordId(match.id);
        setActiveSubView('detail');
      }
    } else if (initialSelectedProjectId) {
      const match = MASTER_EVIDENCE_RECORDS.find((r) => r.projectId === initialSelectedProjectId);
      if (match) {
        setSelectedRecordId(match.id);
      }
    }
  }, [initialSelectedEvidenceId, initialSelectedProjectId]);

  const selectedRecord = getEvidenceById(selectedRecordId) || records[0];

  return (
    <div className="evidence-module" style={{ marginTop: 'var(--space-lg)' }}>
      {/* Evidence Module Header */}
      <EvidenceHeader
        records={records}
        activeSubView={activeSubView}
        onSubViewChange={setActiveSubView}
        selectedRecord={selectedRecord}
      />

      {/* Screen 1: Evidence Register */}
      {activeSubView === 'register' && (
        <EvidenceRegister
          records={records}
          selectedRecordId={selectedRecordId}
          onSelectRecord={(rec) => {
            setSelectedRecordId(rec.id);
            setActiveSubView('detail');
          }}
          onOpenProjectIntelligence={onOpenProjectIntelligence}
          onOpenIntervention={onOpenIntervention}
        />
      )}

      {/* Screen 2: Evidence Detail / Dossier */}
      {activeSubView === 'detail' && selectedRecord && (
        <EvidenceDetailPanel
          record={selectedRecord}
          onBackToRegister={() => setActiveSubView('register')}
          onOpenProjectIntelligence={onOpenProjectIntelligence}
          onOpenIntervention={onOpenIntervention}
        />
      )}
    </div>
  );
};
