import React, { useState } from 'react';
import type { RuleResult } from '../core/types';

interface Props {
  ruleResults: RuleResult[];
}

export const RuleList: React.FC<Props> = ({ ruleResults }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (ruleId: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(ruleId)) next.delete(ruleId);
      else next.add(ruleId);
      return next;
    });
  };

  return (
    <div className="rule-list">
      <h2 className="section-title">Rule Evaluation</h2>
      {ruleResults.map(rule => (
        <div
          key={rule.ruleId}
          className={`rule-row ${rule.status === 'PASS' ? 'rule-pass' : 'rule-fail'}`}
        >
          <div className="rule-header" onClick={() => toggle(rule.ruleId)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && toggle(rule.ruleId)}>
            <span className={`rule-status-dot ${rule.status === 'PASS' ? 'dot-pass' : 'dot-fail'}`} />
            <span className="rule-id">{rule.ruleId}</span>
            <span className={`rule-badge ${rule.status === 'PASS' ? 'badge-pass' : 'badge-fail'}`}>{rule.status}</span>
            <span className="rule-expand">{expanded.has(rule.ruleId) ? '▲' : '▼'}</span>
          </div>
          {expanded.has(rule.ruleId) && (
            <div className="rule-detail">
              {rule.failReason && (
                <div className="fail-reason">
                  <span className="fail-icon">⚠</span> {rule.failReason}
                </div>
              )}
              {rule.trace.length === 0 ? (
                <div className="no-trace">No evidence trace (vacuously true)</div>
              ) : (
                <table className="trace-table">
                  <thead>
                    <tr>
                      <th>Event ID</th>
                      <th>Type</th>
                      <th>Timestamp</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rule.trace.map((t, i) => (
                      <tr key={i}>
                        <td className="mono">{t.eventId}</td>
                        <td>{t.eventType}</td>
                        <td className="mono">{t.timestamp}</td>
                        <td>{t.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
