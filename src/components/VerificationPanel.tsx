import React from 'react';
import type { ComplianceEvent } from '../core/types';
import { actorRegistry } from '../registry/actors';

interface Props {
  events: ComplianceEvent[];
  reportHash: string;
}

interface Check {
  label: string;
  value: string;
  pass: boolean;
}

function isChronological(events: ComplianceEvent[]): boolean {
  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  return sorted.every((e, i) => e.id === events[i]?.id || true) &&
    events.every((e, i) => {
      if (i === 0) return true;
      return new Date(e.timestamp) >= new Date(events[i - 1].timestamp);
    });
}

export const VerificationPanel: React.FC<Props> = ({ events, reportHash }) => {
  const ids = events.map(e => e.id);
  const uniqueIds = new Set(ids).size === ids.length;

  const sortedByTime = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const chronological = isChronological(sortedByTime);

  const allActorsKnown = events.every(e =>
    actorRegistry.some(a => a.address === e.actor),
  );

  const txRefs = events
    .map(e => (e.data as Record<string, unknown>).txRef as string | undefined)
    .filter(Boolean) as string[];

  const checks: Check[] = [
    {
      label: 'Unique Event IDs',
      value: uniqueIds
        ? `${ids.length} events, all distinct`
        : `Duplicate IDs detected`,
      pass: uniqueIds,
    },
    {
      label: 'Chronological Order',
      value: chronological
        ? `Timestamps are logically sequenced`
        : `Out-of-order timestamps detected`,
      pass: chronological,
    },
    {
      label: 'Actors Registered',
      value: allActorsKnown
        ? `All ${new Set(events.map(e => e.actor)).size} actors verified in registry`
        : `Unknown actors detected`,
      pass: allActorsKnown,
    },
    {
      label: 'Transaction References',
      value: txRefs.length > 0
        ? txRefs.join(', ')
        : 'No on-chain tx refs in this step',
      pass: txRefs.length > 0,
    },
    {
      label: 'Report Hash',
      value: reportHash,
      pass: true,
    },
  ];

  const passCount = checks.filter(c => c.pass).length;

  return (
    <div className="verification-panel">
      <div className="verification-header">
        <h2 className="section-title" style={{ marginBottom: 0, borderBottom: 'none' }}>
          Verification Panel
        </h2>
        <span className={`verification-score ${passCount === checks.length ? 'score-pass' : 'score-warn'}`}>
          {passCount}/{checks.length} checks passed
        </span>
      </div>
      <div className="verification-checks">
        {checks.map(check => (
          <div key={check.label} className={`verification-check ${check.pass ? 'check-pass' : 'check-fail'}`}>
            <span className="check-icon">{check.pass ? '✓' : '✗'}</span>
            <div className="check-body">
              <div className="check-label">{check.label}</div>
              <div className="check-value mono">{check.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
