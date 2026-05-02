import type { RuleProfile } from '../../core/types';

export const draft2027: RuleProfile = {
  id: 'DRAFT_EU_DPP_2027',
  version: '0.1.0-draft',
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
    {
      id: 'END_OF_LIFE_REQUIRED',
      assert: {
        exists: { eventType: 'RECYCLED' },
      },
    },
  ],
  scoring: { mode: 'all_required' },
};
