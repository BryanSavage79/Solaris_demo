import React from 'react';
import type { RuleProfile, RuleResult } from '../core/types';

interface Props {
  profile: RuleProfile;
  ruleResults: RuleResult[];
}

export const ComplianceMappingTable: React.FC<Props> = ({ profile, ruleResults }) => {
  return (
    <div className="compliance-mapping">
      <h2 className="section-title">Compliance Mapping</h2>
      <table className="mapping-table">
        <thead>
          <tr>
            <th>Rule ID</th>
            <th>Description</th>
            <th>Regulation</th>
            <th>Article</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {profile.rules.map(rule => {
            const result = ruleResults.find(r => r.ruleId === rule.id);
            const status = result?.status ?? 'UNKNOWN';
            return (
              <tr key={rule.id} className={`mapping-row mapping-row--${status.toLowerCase()}`}>
                <td className="mono mapping-rule-id">{rule.id}</td>
                <td className="mapping-desc">{rule.description ?? '—'}</td>
                <td className="mapping-regulation">{rule.regulation ?? '—'}</td>
                <td className="mapping-article mono">{rule.article ?? '—'}</td>
                <td>
                  <span className={`rule-badge ${status === 'PASS' ? 'badge-pass' : 'badge-fail'}`}>
                    {status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
