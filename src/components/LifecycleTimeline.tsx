import React from 'react';
import type { ComplianceEvent, RuleResult } from '../core/types';

interface Props {
  events: ComplianceEvent[];
  ruleResults: RuleResult[];
}

type StageStatus = 'complete' | 'violation' | 'required' | 'pending';

interface Stage {
  eventType: string;
  label: string;
  icon: string;
  ruleId?: string;
}

const STAGES: Stage[] = [
  { eventType: 'CREATED', label: 'Product Created', icon: '🏭' },
  { eventType: 'MATERIAL_DECLARED', label: 'Materials Declared', icon: '📋', ruleId: 'MANDATORY_ORIGIN' },
  { eventType: 'TRANSFERRED', label: 'Ownership Transferred', icon: '🔄' },
  { eventType: 'REPAIRED', label: 'Repaired', icon: '🔧', ruleId: 'CERTIFIED_REPAIR' },
  { eventType: 'RECYCLED', label: 'Recycled', icon: '♻️', ruleId: 'END_OF_LIFE_REQUIRED' },
];

function getStageStatus(
  stage: Stage,
  events: ComplianceEvent[],
  ruleResults: RuleResult[],
): StageStatus {
  const present = events.some(e => e.eventType === stage.eventType);
  const rule = stage.ruleId ? ruleResults.find(r => r.ruleId === stage.ruleId) : undefined;

  if (present) {
    return rule && rule.status === 'FAIL' ? 'violation' : 'complete';
  }
  // Event is absent — check if a rule requires it and is failing
  return rule && rule.status === 'FAIL' ? 'required' : 'pending';
}

const STATUS_LABELS: Record<StageStatus, string> = {
  complete: 'Complete',
  violation: 'Violation',
  required: 'Required',
  pending: 'Pending',
};

export const LifecycleTimeline: React.FC<Props> = ({ events, ruleResults }) => {
  return (
    <div className="lifecycle-timeline">
      <h2 className="section-title">Product Lifecycle</h2>
      <div className="lifecycle-stages">
        {STAGES.map((stage, idx) => {
          const status = getStageStatus(stage, events, ruleResults);
          return (
            <React.Fragment key={stage.eventType}>
              <div className={`lifecycle-stage lifecycle-stage--${status}`}>
                <div className="lifecycle-stage-icon">{stage.icon}</div>
                <div className="lifecycle-stage-label">{stage.label}</div>
                <div className={`lifecycle-stage-badge lifecycle-stage-badge--${status}`}>
                  {STATUS_LABELS[status]}
                </div>
              </div>
              {idx < STAGES.length - 1 && (
                <div className={`lifecycle-connector lifecycle-connector--${status}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
