import type { RuleProfile } from '../../core/types';

export const euDppV1: RuleProfile = {
  id: 'EU_DPP_2026',
  schema: 'dpp.v1',
  version: '1.0.0',
  rules: [
    {
      id: 'MANDATORY_ORIGIN',
      assert: {
        exists: {
          eventType: 'MATERIAL_DECLARED',
          where: [{ field: 'data.countryOfOrigin', op: 'notEmpty' }],
        },
      },
    },
    {
      id: 'CERTIFIED_REPAIR',
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
