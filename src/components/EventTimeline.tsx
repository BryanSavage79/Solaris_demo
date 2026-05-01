import React from 'react';
import { ProductEvent } from '../types';
import { StatusBadge } from './StatusBadge';

interface EventTimelineProps {
  events: ProductEvent[];
}

function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(iso));
}

function humanizeEventType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const EventTimeline: React.FC<EventTimelineProps> = ({ events }) => {
  if (events.length === 0) {
    return <p className="timeline__empty">No events recorded yet.</p>;
  }

  return (
    <ol className="timeline" aria-label="Product event timeline">
      {events.map((event, index) => {
        const isLatest = index === events.length - 1;
        return (
          <li
            key={event.id}
            className={`timeline__item${isLatest ? ' timeline__item--latest' : ''}`}
          >
            <div className="timeline__connector" aria-hidden="true">
              <span className="timeline__dot" />
              {index < events.length - 1 && <span className="timeline__line" />}
            </div>
            <div className="timeline__content">
              <div className="timeline__header">
                <span className="timeline__event-type">
                  {humanizeEventType(event.type)}
                </span>
                <StatusBadge status={event.status} />
              </div>
              <p className="timeline__description">{event.description}</p>
              <div className="timeline__meta">
                {event.location && (
                  <span className="timeline__location">📍 {event.location}</span>
                )}
                {event.actor && (
                  <span className="timeline__actor">👤 {event.actor}</span>
                )}
                <time
                  className="timeline__time"
                  dateTime={event.timestamp}
                >
                  🕐 {formatTimestamp(event.timestamp)}
                </time>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};
