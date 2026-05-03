import type { RuleProfile } from '../../core/types';

export const draft2027: RuleProfile = {
  id: 'DRAFT_EU_DPP_2027',
  version: '0.1.0-draft',
  rules: [
    {
      id: 'MANDATORY_ORIGIN',
      description: 'All material declarations must include a verified country of origin.',
      regulation: 'EU Battery Regulation 2023/1542',
      article: 'Art. 13 — Due Diligence Policy',
      assert: {
        exists: {
          eventType: 'MATERIAL_DECLARED',
          where: [{ field: 'data.countryOfOrigin', op: 'notEmpty' }],
        },
      },
    },
    {
      id: 'CERTIFIED_REPAIR',
      description: 'Every repair event must be attested by a certified repair provider.',
      regulation: 'EU Right to Repair Directive 2024/1799',
      article: 'Art. 5 — Spare Parts & Repair Obligations',
      assert: {
        forall: {
          eventType: 'REPAIRED',
          predicate: [{ attestedBy: 'REPAIR_PROVIDER' }],
        },
      },
    },
    {
      id: 'END_OF_LIFE_REQUIRED',
      description: 'Products must have a recorded end-of-life recycling event.',
      regulation: 'WEEE Directive 2012/19/EU (revised 2027)',
      article: 'Art. 11 — Collection & Treatment Targets',
      assert: {
        exists: { eventType: 'RECYCLED' },
      },
    },
  ],
  scoring: { mode: 'all_required' },
};
