import React from 'react';
import type { ComplianceEvent, EvaluationResult, RuleProfile } from '../core/types';

interface Props {
  events: ComplianceEvent[];
  profile: RuleProfile;
  verdict: EvaluationResult;
}

export const AuditExport: React.FC<Props> = ({ events, profile, verdict }) => {
  const handleExport = () => {
    const payload = {
      events,
      profile,
      verdict,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-${profile.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="audit-export">
      <button className="export-btn" onClick={handleExport}>
        ⬇ Export Audit Report (JSON)
      </button>
    </div>
  );
};
