export type EventType = 'CREATED' | 'MATERIAL_DECLARED' | 'REPAIRED' | 'RECYCLED' | 'TRANSFERRED';

export type SchemaVersion = 'dpp.v1';

export interface ComplianceEvent {
  id: string;
  eventType: EventType;
  timestamp: string;
  actor: string;
  data: Record<string, unknown>;
  signature?: string;
}

export interface Actor {
  address: string;
  name: string;
  roles: string[];
}

export type AssertClause =
  | { exists: { eventType: string; where?: FieldCondition[] } }
  | { forall: { eventType: string; predicate: PredicateClause[] } }
  | { count: { eventType: string; min?: number; max?: number } }
  | { sequence: { events: string[] } };

export interface FieldCondition {
  field: string;
  op: 'notEmpty' | 'equals' | 'greaterThan';
  value?: unknown;
}

export interface PredicateClause {
  attestedBy?: string;
}

export interface Rule {
  id: string;
  assert: AssertClause;
}

export interface RuleProfile {
  id: string;
  schema: SchemaVersion;
  version: string;
  rules: Rule[];
  scoring: { mode: 'all_required' | 'weighted' };
}

export interface EvidenceTrace {
  eventId: string;
  eventType: string;
  timestamp: string;
  reason: string;
}

export interface RuleResult {
  ruleId: string;
  status: 'PASS' | 'FAIL';
  trace: EvidenceTrace[];
  failReason?: string;
}

export interface EvaluationResult {
  status: 'PASS' | 'FAIL';
  reportHash: string;
  profileId: string;
  schema: SchemaVersion;
  ruleResults: RuleResult[];
  timestamp: string;
}
