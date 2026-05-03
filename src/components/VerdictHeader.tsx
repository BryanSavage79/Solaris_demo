import React from 'react';
import type { EvaluationResult } from '../core/types';

interface Props {
  result: EvaluationResult;
}

export const VerdictHeader: React.FC<Props> = ({ result }) => {
  const pass = result.status === 'PASS';
  return (
    <div className={`verdict-header ${pass ? 'verdict-pass' : 'verdict-fail'}`}>
      <div className={`verdict-badge ${pass ? 'badge-pass' : 'badge-fail'}`}>
        {result.status}
      </div>
      <div className="verdict-details">
        <div className="verdict-profile">
          <span className="label">Profile</span>
          <span className="value">{result.profileId}</span>
          <span className="schema-version-badge">schema v{result.profileVersion}</span>
        </div>
        <div className="verdict-schema">
          <span className="label">Schema</span>
          <span className="value mono">{result.schema}</span>
        </div>
        <div className="verdict-hash">
          <span className="label">Report Hash</span>
          <span className="value mono">{result.reportHash}</span>
        </div>
        <div className="verdict-time">
          <span className="label">Evaluated</span>
          <span className="value mono">{new Date(result.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
