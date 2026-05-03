import type { Actor, AssertClause, ComplianceEvent, EvidenceTrace, FieldCondition } from './types';
import { hasRole } from '../registry/actors';

export interface PredicateResult {
  pass: boolean;
  trace: EvidenceTrace[];
  failReason?: string;
}

function resolveField(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function checkFieldCondition(event: ComplianceEvent, cond: FieldCondition): boolean {
  const root: Record<string, unknown> = { ...event, data: event.data };
  const val = resolveField(root, cond.field);
  switch (cond.op) {
    case 'notEmpty':
      return val !== undefined && val !== null && val !== '';
    case 'equals':
      return val === cond.value;
    case 'greaterThan':
      return typeof val === 'number' && typeof cond.value === 'number' && val > cond.value;
  }
}

export function existsPredicate(
  events: ComplianceEvent[],
  clause: Extract<AssertClause, { exists: unknown }>['exists'],
  _actors: Actor[],
): PredicateResult {
  const matching = events.filter(e => e.eventType === clause.eventType);
  if (matching.length === 0) {
    return {
      pass: false,
      trace: [],
      failReason: `No event of type ${clause.eventType} found`,
    };
  }
  if (!clause.where || clause.where.length === 0) {
    const trace: EvidenceTrace[] = matching.map(e => ({
      eventId: e.id,
      eventType: e.eventType,
      timestamp: e.timestamp,
      reason: `Event of type ${e.eventType} exists`,
    }));
    return { pass: true, trace };
  }
  const qualified = matching.filter(e => clause.where!.every(cond => checkFieldCondition(e, cond)));
  if (qualified.length === 0) {
    return {
      pass: false,
      trace: matching.map(e => ({
        eventId: e.id,
        eventType: e.eventType,
        timestamp: e.timestamp,
        reason: `Event found but field conditions not satisfied`,
      })),
      failReason: `No ${clause.eventType} event satisfies field conditions: ${clause.where.map(c => c.field).join(', ')}`,
    };
  }
  return {
    pass: true,
    trace: qualified.map(e => ({
      eventId: e.id,
      eventType: e.eventType,
      timestamp: e.timestamp,
      reason: `Satisfies all field conditions`,
    })),
  };
}

export function forallPredicate(
  events: ComplianceEvent[],
  clause: Extract<AssertClause, { forall: unknown }>['forall'],
  actors: Actor[],
): PredicateResult {
  const matching = events.filter(e => e.eventType === clause.eventType);
  if (matching.length === 0) {
    return { pass: true, trace: [] };
  }
  const trace: EvidenceTrace[] = [];
  let allPass = true;
  let failReason: string | undefined;
  for (const event of matching) {
    for (const pred of clause.predicate) {
      if (pred.attestedBy) {
        const ok = hasRole(event.actor, pred.attestedBy, actors);
        trace.push({
          eventId: event.id,
          eventType: event.eventType,
          timestamp: event.timestamp,
          reason: ok
            ? `Actor ${event.actor} has role ${pred.attestedBy}`
            : `Actor ${event.actor} lacks required role ${pred.attestedBy}`,
        });
        if (!ok) {
          allPass = false;
          failReason = `Actor ${event.actor} does not have required role ${pred.attestedBy}`;
        }
      }
    }
  }
  return { pass: allPass, trace, failReason };
}

export function countPredicate(
  events: ComplianceEvent[],
  clause: Extract<AssertClause, { count: unknown }>['count'],
): PredicateResult {
  const matching = events.filter(e => e.eventType === clause.eventType);
  const n = matching.length;
  const minOk = clause.min === undefined || n >= clause.min;
  const maxOk = clause.max === undefined || n <= clause.max;
  const pass = minOk && maxOk;
  return {
    pass,
    trace: matching.map(e => ({
      eventId: e.id,
      eventType: e.eventType,
      timestamp: e.timestamp,
      reason: `Counted event of type ${e.eventType}`,
    })),
    failReason: pass
      ? undefined
      : `Count ${n} for ${clause.eventType} is out of bounds [${clause.min ?? 0}, ${clause.max ?? '∞'}]`,
  };
}
