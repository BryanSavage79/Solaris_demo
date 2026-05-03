import type { Actor, AssertClause, ComplianceEvent, EvaluationResult, RuleProfile, RuleResult } from './types';
import { normalizeEvents } from './normalizer';
import { countPredicate, existsPredicate, forallPredicate } from './predicates';

function computeHash(profileId: string, events: ComplianceEvent[]): string {
  const sorted = [...events].map(e => e.id).sort().join(',');
  const raw = profileId + ':' + sorted;
  return btoa(raw);
}

function evaluateRule(
  events: ComplianceEvent[],
  assert: AssertClause,
  actors: Actor[],
): { status: 'PASS' | 'FAIL'; trace: import('./types').EvidenceTrace[]; failReason?: string } {
  if ('exists' in assert) {
    const r = existsPredicate(events, assert.exists, actors);
    return { status: r.pass ? 'PASS' : 'FAIL', trace: r.trace, failReason: r.failReason };
  }
  if ('forall' in assert) {
    const r = forallPredicate(events, assert.forall, actors);
    return { status: r.pass ? 'PASS' : 'FAIL', trace: r.trace, failReason: r.failReason };
  }
  if ('count' in assert) {
    const r = countPredicate(events, assert.count);
    return { status: r.pass ? 'PASS' : 'FAIL', trace: r.trace, failReason: r.failReason };
  }
  return { status: 'FAIL', trace: [], failReason: 'Unsupported assert clause' };
}

export function evaluate(
  events: ComplianceEvent[],
  profile: RuleProfile,
  actors: Actor[],
): EvaluationResult {
  const normalized = normalizeEvents(events);
  const ruleResults: RuleResult[] = profile.rules.map(rule => {
    const { status, trace, failReason } = evaluateRule(normalized, rule.assert, actors);
    return { ruleId: rule.id, status, trace, failReason };
  });
  const overallPass = ruleResults.every(r => r.status === 'PASS');
  return {
    status: overallPass ? 'PASS' : 'FAIL',
    reportHash: computeHash(profile.id, normalized),
    profileId: profile.id,
    ruleResults,
    timestamp: new Date().toISOString(),
  };
}
