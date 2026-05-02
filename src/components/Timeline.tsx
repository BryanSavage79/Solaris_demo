import React from 'react';
import type { ComplianceEvent, EvidenceTrace } from '../core/types';

interface Props {
  events: ComplianceEvent[];
  traces: EvidenceTrace[];
}

export const Timeline: React.FC<Props> = ({ events, traces }) => {
  const criticalIds = new Set(traces.map(t => t.eventId));

  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <div className="timeline">
      <h2 className="section-title">Event Timeline</h2>
      <div className="timeline-list">
        {sorted.map(event => {
          const isCritical = criticalIds.has(event.id);
          return (
            <div key={event.id} className={`timeline-item ${isCritical ? 'timeline-critical' : ''}`}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-event-type">{event.eventType}</div>
                <div className="timeline-event-id mono">{event.id}</div>
                <div className="timeline-actor mono">{event.actor}</div>
                <div className="timeline-ts mono">{event.timestamp}</div>
                {isCritical && <span className="critical-badge">Compliance-Critical</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
