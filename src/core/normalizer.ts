import type { ComplianceEvent } from './types';

export const normalizeEvents = (events: ComplianceEvent[]): ComplianceEvent[] =>
  [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
