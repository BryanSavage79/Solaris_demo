import { describe, it, expect } from 'vitest';
import { evaluate } from '../src/core/evaluator';
import { actorRegistry } from '../src/registry/actors';
import { euDppV1 } from '../src/registry/profiles/eu-dpp-v1';
import { draft2027 } from '../src/registry/profiles/draft-2027';
import { demoSteps } from '../src/data/demoEvents';

describe('Compliance Engine', () => {
  it('Genesis step returns PASS', () => {
    const step = demoSteps[0];
    const result = evaluate(step.events, euDppV1, actorRegistry);
    expect(result.status).toBe('PASS');
  });

  it('Violation step returns FAIL with actor role failReason', () => {
    const step = demoSteps[1];
    const result = evaluate(step.events, euDppV1, actorRegistry);
    expect(result.status).toBe('FAIL');
    const failedRule = result.ruleResults.find(r => r.status === 'FAIL');
    expect(failedRule).toBeDefined();
    expect(failedRule?.failReason).toMatch(/0xUNAUTH_ACTOR/);
    expect(failedRule?.failReason).toMatch(/REPAIR_PROVIDER/);
  });

  it('Remediation step returns PASS', () => {
    const step = demoSteps[2];
    const result = evaluate(step.events, euDppV1, actorRegistry);
    expect(result.status).toBe('PASS');
  });

  it('Draft 2027 simulation returns FAIL for missing RECYCLED event', () => {
    const step = demoSteps[3];
    const result = evaluate(step.events, draft2027, actorRegistry);
    expect(result.status).toBe('FAIL');
    const eolRule = result.ruleResults.find(r => r.ruleId === 'END_OF_LIFE_REQUIRED');
    expect(eolRule?.status).toBe('FAIL');
    expect(eolRule?.failReason).toMatch(/RECYCLED/);
  });

  it('reportHash is deterministic for identical inputs', () => {
    const step = demoSteps[0];
    const r1 = evaluate(step.events, euDppV1, actorRegistry);
    const r2 = evaluate(step.events, euDppV1, actorRegistry);
    expect(r1.reportHash).toBe(r2.reportHash);
  });

  it('reportHash differs for different inputs', () => {
    const r1 = evaluate(demoSteps[0].events, euDppV1, actorRegistry);
    const r2 = evaluate(demoSteps[1].events, euDppV1, actorRegistry);
    expect(r1.reportHash).not.toBe(r2.reportHash);
  });

  it('History A + Profile B = deterministic Result C', () => {
    const step = demoSteps[2];
    const r1 = evaluate(step.events, euDppV1, actorRegistry);
    const r2 = evaluate([...step.events].reverse(), euDppV1, actorRegistry);
    expect(r1.reportHash).toBe(r2.reportHash);
    expect(r1.status).toBe(r2.status);
  });
});
