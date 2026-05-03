import type { RuleProfile } from '../../core/types';

export const euDppV1: RuleProfile = {
  id: 'EU_DPP_2026',
  version: '1.0.0',
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
  ],
  scoring: { mode: 'all_required' },
};
