import type { ComplianceEvent } from '../core/types';

export interface DemoStep {
  title: string;
  description: string;
  events: ComplianceEvent[];
  profile: 'EU_DPP_2026' | 'DRAFT_EU_DPP_2027';
  actorRegistry: 'standard' | 'withUnauth';
}

const genesisEvents: ComplianceEvent[] = [
  {
    id: 'evt-001',
    eventType: 'CREATED',
    timestamp: '2024-01-15T08:00:00Z',
    actor: '0xAUTH_MANUFACTURER',
    data: { productId: 'SOL-PANEL-X1', batchId: 'BATCH-2024-001' },
  },
  {
    id: 'evt-002',
    eventType: 'MATERIAL_DECLARED',
    timestamp: '2024-01-15T09:00:00Z',
    actor: '0xAUTH_MANUFACTURER',
    data: { countryOfOrigin: 'Portugal', materials: ['silicon', 'aluminum'], weight: 22.5 },
  },
];

const violationEvents: ComplianceEvent[] = [
  ...genesisEvents,
  {
    id: 'evt-003-violation',
    eventType: 'REPAIRED',
    timestamp: '2024-03-10T14:00:00Z',
    actor: '0xUNAUTH_ACTOR',
    data: { repairType: 'cell-replacement', technicianId: 'UNKNOWN-99' },
  },
];

const remediationEvents: ComplianceEvent[] = [
  ...genesisEvents,
  {
    id: 'evt-003-remediated',
    eventType: 'REPAIRED',
    timestamp: '2024-03-12T10:00:00Z',
    actor: '0xAUTH_REPAIR',
    data: { repairType: 'cell-replacement', technicianId: 'TECH-007', certificationId: 'CERT-EU-2024' },
  },
];

const fullLifecycleEvents: ComplianceEvent[] = [
  {
    id: 'evt-001',
    eventType: 'CREATED',
    timestamp: '2024-01-15T08:00:00Z',
    actor: '0xAUTH_MANUFACTURER',
    data: { productId: 'SOL-PANEL-X1', batchId: 'BATCH-2024-001' },
  },
  {
    id: 'evt-002',
    eventType: 'MATERIAL_DECLARED',
    timestamp: '2024-01-15T09:00:00Z',
    actor: '0xAUTH_MANUFACTURER',
    data: { countryOfOrigin: 'Portugal', materials: ['silicon', 'aluminum'], weight: 22.5 },
  },
  {
    id: 'evt-003',
    eventType: 'TRANSFERRED',
    timestamp: '2024-02-01T10:00:00Z',
    actor: '0xAUTH_DISTRIBUTOR',
    data: { fromOwner: '0xAUTH_MANUFACTURER', toOwner: '0xAUTH_DISTRIBUTOR', txRef: 'TX-2024-0201-A' },
  },
  {
    id: 'evt-004',
    eventType: 'REPAIRED',
    timestamp: '2024-03-12T10:00:00Z',
    actor: '0xAUTH_REPAIR',
    data: { repairType: 'cell-replacement', technicianId: 'TECH-007', certificationId: 'CERT-EU-2024' },
  },
  {
    id: 'evt-005',
    eventType: 'RECYCLED',
    timestamp: '2024-06-20T14:00:00Z',
    actor: '0xAUTH_RECYCLER',
    data: { facilityId: 'RECYCLE-FACILITY-PT-01', method: 'certified-ewaste', txRef: 'TX-2024-0620-B' },
  },
];

export const demoSteps: DemoStep[] = [
  {
    title: 'Step 1 — Genesis',
    description: 'Product created and materials declared with country of origin. Evaluating against EU DPP 2026 baseline profile.',
    events: genesisEvents,
    profile: 'EU_DPP_2026',
    actorRegistry: 'standard',
  },
  {
    title: 'Step 2 — Compliance Violation',
    description: 'An unauthorized actor performed a repair without the REPAIR_PROVIDER role. This violates CERTIFIED_REPAIR rule.',
    events: violationEvents,
    profile: 'EU_DPP_2026',
    actorRegistry: 'standard',
  },
  {
    title: 'Step 3 — Remediation',
    description: 'Repair re-attested by a certified repair provider. All EU DPP 2026 rules now satisfied.',
    events: remediationEvents,
    profile: 'EU_DPP_2026',
    actorRegistry: 'standard',
  },
  {
    title: 'Step 4 — Draft 2027 Simulation',
    description: 'Evaluating remediated product against the stricter Draft 2027 profile, which requires an end-of-life RECYCLED event.',
    events: remediationEvents,
    profile: 'DRAFT_EU_DPP_2027',
    actorRegistry: 'standard',
  },
  {
    title: 'Step 5 — Full Lifecycle',
    description: 'Complete product passport: created, materials declared, ownership transferred, certified repair, and end-of-life recycling. Passes all Draft 2027 requirements.',
    events: fullLifecycleEvents,
    profile: 'DRAFT_EU_DPP_2027',
    actorRegistry: 'standard',
  },
];
