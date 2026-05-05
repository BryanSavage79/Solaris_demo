// ── Velocore X1 TraceLayer Demo Seed Data ─────────────────────────────
// Scenario: Premium running shoe, Vietnam → EU supply chain
// Source: Ascendii TraceLayer demo seed (tracelayer-seed.sql)
// This file is frontend-only demo data; no backend dependency.

// ── Types ──────────────────────────────────────────────────────────────

export type ActorType =
  | 'manufacturer'
  | 'brand'
  | 'distributor'
  | 'retailer'
  | 'repairer'
  | 'recycler'
  | 'regulator';

export interface Actor {
  id: string;
  name: string;
  type: ActorType;
  country_code: string;
  verified: boolean;
  onchain_handle: string | null;
}

export interface MaterialComponent {
  material: string;
  pct: number;
  origin: string;
}

export interface SubstanceCheck {
  substance: string;
  present: boolean;
  tested: boolean;
  test_ref: string;
}

export interface SparePart {
  part: string;
  available_until: string;
  part_number: string;
}

export interface ProductClass {
  id: string;
  brand_id: string;
  name: string;
  category: string;
  gtin: string;
  sku: string;
  description: string;
  material_composition: MaterialComponent[];
  substances_of_concern: SubstanceCheck[];
  country_of_origin: string;
  fiber_origin: string;
  repairability_score: number;
  spare_parts: SparePart[];
  recycled_content_pct: number;
  assets_3d_url: string;
  care_instructions: string;
  circularity_notes: string;
  ce_marking: boolean;
  eu_doc_of_conformity: string;
  dpp_profile: string;
  created_at: string;
  updated_at: string;
}

export interface ProductInstance {
  id: string;
  class_id: string;
  manufacturer_id: string;
  serial_number: string;
  batch_number: string;
  data_carrier_type: string;
  data_carrier_id: string;
  lifecycle_state: string;
  current_actor_id: string;
  warehouse_code: string;
  pallet_id: string;
  carbon_footprint_kg: number;
  owner_handle: string;
  owner_wallet: string;
  activated_at: string;
  warranty_expires: string;
  created_at: string;
  updated_at: string;
}

export interface LifecycleEvent {
  id: string;
  instance_id: string;
  actor_id: string | null;
  event_type: string;
  from_state: string | null;
  to_state: string;
  location_code: string;
  metadata: Record<string, unknown>;
  onchain_tx: string | null;
  created_at: string;
}

export type AccessTier = 'public' | 'professional' | 'regulator';

export interface DppAccessEntry {
  id: string;
  instance_id: string;
  accessor_id: string | null;
  access_tier: AccessTier;
  carrier_scan: string;
  ip_region: string;
  created_at: string;
}

// ── Actors ─────────────────────────────────────────────────────────────

export const actors: Actor[] = [
  {
    id: 'actor_mfr_vn_apex',
    name: 'Apex Footwear Manufacturing Co.',
    type: 'manufacturer',
    country_code: 'VN',
    verified: true,
    onchain_handle: 'apex.footwear',
  },
  {
    id: 'actor_brand_eu_stridecore',
    name: 'Stridecore Athletic Europe BV',
    type: 'brand',
    country_code: 'NL',
    verified: true,
    onchain_handle: 'stridecore.eu',
  },
  {
    id: 'actor_dist_nl_europort',
    name: 'Europort Logistics BV',
    type: 'distributor',
    country_code: 'NL',
    verified: true,
    onchain_handle: 'europort.logistics',
  },
  {
    id: 'actor_retail_nl_amsterdam',
    name: 'Stridecore Amsterdam Flagship',
    type: 'retailer',
    country_code: 'NL',
    verified: true,
    onchain_handle: 'stridecore.ams',
  },
  {
    id: 'actor_repair_nl_solefix',
    name: 'SoleFix Certified Repair — Amsterdam',
    type: 'repairer',
    country_code: 'NL',
    verified: true,
    onchain_handle: 'solefix.repair',
  },
  {
    id: 'actor_recycle_nl_loopmat',
    name: 'Loopmat Circular Textiles BV',
    type: 'recycler',
    country_code: 'NL',
    verified: true,
    onchain_handle: 'loopmat.circular',
  },
  {
    id: 'actor_reg_eu_ecodesign',
    name: 'European Commission — ESPR Market Surveillance',
    type: 'regulator',
    country_code: 'BE',
    verified: true,
    onchain_handle: null,
  },
];

// ── Product class ──────────────────────────────────────────────────────

export const velocoreX1Class: ProductClass = {
  id: 'class_sc_velocore_x1',
  brand_id: 'actor_brand_eu_stridecore',
  name: 'Velocore X1 Performance Runner',
  category: 'textile',
  gtin: '5901234123457',
  sku: 'SC-VCX1-EU-42',
  description:
    'Lightweight performance running shoe with bio-based foam midsole and recycled upper. Designed for EU market DPP compliance from first production run.',
  material_composition: [
    { material: 'Recycled Polyester (Upper mesh)', pct: 42, origin: 'TW' },
    { material: 'Bio-based EVA Foam (Midsole)',    pct: 28, origin: 'VN' },
    { material: 'Natural Rubber (Outsole)',         pct: 18, origin: 'TH' },
    { material: 'Recycled Nylon (Lining)',          pct: 8,  origin: 'TW' },
    { material: 'TPU Overlay (Heel counter)',       pct: 4,  origin: 'CN' },
  ],
  substances_of_concern: [
    { substance: 'Dimethylformamide (DMF)', present: false, tested: true, test_ref: 'SGS-EU-2025-448821' },
    { substance: 'Chromium VI',             present: false, tested: true, test_ref: 'SGS-EU-2025-448822' },
    { substance: 'Azo Dyes',               present: false, tested: true, test_ref: 'SGS-EU-2025-448823' },
    { substance: 'PFAS',                   present: false, tested: true, test_ref: 'SGS-EU-2025-448824' },
  ],
  country_of_origin: 'VN',
  fiber_origin: 'TW',
  repairability_score: 7.8,
  spare_parts: [
    { part: 'Outsole unit',     available_until: '2032-12-31', part_number: 'SC-VCX1-OUT' },
    { part: 'Insole (OrthoFit)', available_until: '2032-12-31', part_number: 'SC-VCX1-INS' },
    { part: 'Lace set',         available_until: '2033-12-31', part_number: 'SC-VCX1-LAC' },
    { part: 'Heel counter TPU', available_until: '2031-12-31', part_number: 'SC-VCX1-HLC' },
  ],
  recycled_content_pct: 68.5,
  assets_3d_url: 'https://assets.ascendiiuniverse.com/models/sc-velocore-x1.glb',
  care_instructions:
    'Spot clean with damp cloth. Do not machine wash. Air dry only. Remove insole before cleaning.',
  circularity_notes:
    'Return to any Stridecore retailer for free take-back. Upper mesh is fiber-to-fiber recyclable via Loopmat Circular Textiles programme. Outsole rubber reclaimed for track surfacing.',
  ce_marking: true,
  eu_doc_of_conformity:
    'https://compliance.stridecore.eu/doc/vcx1-eu-doc-conformity-2025.pdf',
  dpp_profile: 'textile',
  created_at: '2025-03-01T06:00:00Z',
  updated_at: '2025-03-01T06:00:00Z',
};

// ── Product instance ───────────────────────────────────────────────────

export const velocoreX1Instance: ProductInstance = {
  id: 'inst_vcx1_00012345',
  class_id: 'class_sc_velocore_x1',
  manufacturer_id: 'actor_mfr_vn_apex',
  serial_number: 'VCX1-EU-00012345',
  batch_number: 'BATCH-VN-2025-0312-A',
  data_carrier_type: 'nfc',
  data_carrier_id: 'NFC-TAG-EU-8F3A2C1D',
  lifecycle_state: 'active_digital_twin',
  current_actor_id: 'actor_retail_nl_amsterdam',
  warehouse_code: 'RTM-EU-W7',
  pallet_id: 'PLT-2025-0318-042',
  carbon_footprint_kg: 3.82,
  owner_handle: 'marco.runs',
  owner_wallet: '0x4f8B2a9E3C1d7F6A0bC5e8D2f3A4B1C9E7D6F2A0',
  activated_at: '2025-04-14T16:23:11Z',
  warranty_expires: '2027-04-14T00:00:00Z',
  created_at: '2025-03-12T08:15:00Z',
  updated_at: '2025-04-14T16:23:11Z',
};

// ── Lifecycle events (chronological) ──────────────────────────────────

export const lifecycleEvents: LifecycleEvent[] = [
  {
    id: 'evt_001_produced',
    instance_id: 'inst_vcx1_00012345',
    actor_id: 'actor_mfr_vn_apex',
    event_type: 'produced',
    from_state: null,
    to_state: 'in_production',
    location_code: '8819548Bffffffff',
    metadata: { factory: 'Apex HCM Plant 3', line: 'L-07', shift: 'morning', batch_size: 2400 },
    onchain_tx: null,
    created_at: '2025-03-12T08:15:00Z',
  },
  {
    id: 'evt_002_qc',
    instance_id: 'inst_vcx1_00012345',
    actor_id: 'actor_mfr_vn_apex',
    event_type: 'quality_check',
    from_state: 'in_production',
    to_state: 'in_production',
    location_code: '8819548Bffffffff',
    metadata: {
      result: 'pass',
      inspector_id: 'QC-VN-0091',
      checks: ['sole_bond', 'stitch_integrity', 'colorfast', 'reach_substances', 'weight_tolerance'],
      report_ref: 'QC-2025-0312-12345',
    },
    onchain_tx: null,
    created_at: '2025-03-12T14:40:00Z',
  },
  {
    id: 'evt_003_shipped',
    instance_id: 'inst_vcx1_00012345',
    actor_id: 'actor_mfr_vn_apex',
    event_type: 'shipped',
    from_state: 'in_production',
    to_state: 'in_transit',
    location_code: '8819548Bffffffff',
    metadata: {
      carrier: 'Maersk Line',
      vessel: 'Maersk Eindhoven',
      container: 'MRKU3421887',
      port_origin: 'Cat Lai, Ho Chi Minh City',
      port_destination: 'Rotterdam ECT Delta',
      incoterm: 'CIF',
    },
    onchain_tx: null,
    created_at: '2025-03-18T07:00:00Z',
  },
  {
    id: 'evt_004_scan_sg',
    instance_id: 'inst_vcx1_00012345',
    actor_id: 'actor_dist_nl_europort',
    event_type: 'checkpoint_scan',
    from_state: 'in_transit',
    to_state: 'in_transit',
    location_code: '8765512Bffffffff',
    metadata: { port: 'Singapore PSA Tanjong Pagar', scan_type: 'customs_transit', customs_ref: 'SG-TT-2025-9912' },
    onchain_tx: null,
    created_at: '2025-03-24T11:22:00Z',
  },
  {
    id: 'evt_005_received',
    instance_id: 'inst_vcx1_00012345',
    actor_id: 'actor_dist_nl_europort',
    event_type: 'received_inventory',
    from_state: 'in_transit',
    to_state: 'in_inventory',
    location_code: '881F2AB3ffffffff',
    metadata: {
      warehouse: 'RTM-EU-W7',
      bay: 'B-14',
      pallet: 'PLT-2025-0318-042',
      customs_cleared: true,
      customs_ref: 'EU-IMP-NL-2025-441982',
      dpp_verified: true,
    },
    onchain_tx: null,
    created_at: '2025-04-02T09:15:00Z',
  },
  {
    id: 'evt_006_shipped_retail',
    instance_id: 'inst_vcx1_00012345',
    actor_id: 'actor_dist_nl_europort',
    event_type: 'shipped',
    from_state: 'in_inventory',
    to_state: 'in_transit',
    location_code: '881F2AB3ffffffff',
    metadata: {
      carrier: 'DHL Supply Chain NL',
      tracking: 'DHL-EU-00348821977',
      destination_store: 'Stridecore Amsterdam — P.C. Hooftstraat 94',
    },
    onchain_tx: null,
    created_at: '2025-04-08T13:00:00Z',
  },
  {
    id: 'evt_007_received_retail',
    instance_id: 'inst_vcx1_00012345',
    actor_id: 'actor_retail_nl_amsterdam',
    event_type: 'received_inventory',
    from_state: 'in_transit',
    to_state: 'in_inventory',
    location_code: '881F287Bffffffff',
    metadata: { store: 'Stridecore AMS Flagship', shelf_location: 'Zone-C-R3', display_ready: true },
    onchain_tx: null,
    created_at: '2025-04-09T10:30:00Z',
  },
  {
    id: 'evt_008_sold',
    instance_id: 'inst_vcx1_00012345',
    actor_id: 'actor_retail_nl_amsterdam',
    event_type: 'sold',
    from_state: 'in_inventory',
    to_state: 'sold_pending_activation',
    location_code: '881F287Bffffffff',
    metadata: {
      pos_terminal: 'AMS-POS-04',
      transaction_ref: 'TXN-AMS-20250414-8821',
      payment_method: 'card',
      price_eur: 189.95,
      vat_rate: 0.21,
    },
    onchain_tx: null,
    created_at: '2025-04-14T15:58:44Z',
  },
  {
    id: 'evt_009_activated',
    instance_id: 'inst_vcx1_00012345',
    actor_id: null,
    event_type: 'consumer_activation',
    from_state: 'sold_pending_activation',
    to_state: 'active_digital_twin',
    location_code: '881F287Bffffffff',
    metadata: {
      handle: 'marco.runs',
      wallet: '0x4f8B2a9E3C1d7F6A0bC5e8D2f3A4B1C9E7D6F2A0',
      activation_method: 'nfc_scan',
      device: 'iPhone 15 Pro',
      warranty_registered: true,
      circularity_enrolled: true,
    },
    onchain_tx: '0x7a3f9c2e1b8d4f6a0c5e7b2d9f1a3c8e5b7d2f4a6c1e9b3d5f7a2c4e6b8d1f3a',
    created_at: '2025-04-14T16:23:11Z',
  },
];

// ── DPP access log ─────────────────────────────────────────────────────

export const dppAccessLog: DppAccessEntry[] = [
  {
    id: 'access_001_public',
    instance_id: 'inst_vcx1_00012345',
    accessor_id: null,
    access_tier: 'public',
    carrier_scan: 'NFC-TAG-EU-8F3A2C1D',
    ip_region: 'NL',
    created_at: '2025-04-14T16:23:05Z',
  },
  {
    id: 'access_002_public',
    instance_id: 'inst_vcx1_00012345',
    accessor_id: null,
    access_tier: 'public',
    carrier_scan: 'NFC-TAG-EU-8F3A2C1D',
    ip_region: 'NL',
    created_at: '2025-05-02T10:11:33Z',
  },
  {
    id: 'access_003_professional',
    instance_id: 'inst_vcx1_00012345',
    accessor_id: 'actor_repair_nl_solefix',
    access_tier: 'professional',
    carrier_scan: 'NFC-TAG-EU-8F3A2C1D',
    ip_region: 'NL',
    created_at: '2025-06-18T09:44:21Z',
  },
  {
    id: 'access_004_regulator',
    instance_id: 'inst_vcx1_00012345',
    accessor_id: 'actor_reg_eu_ecodesign',
    access_tier: 'regulator',
    carrier_scan: 'NFC-TAG-EU-8F3A2C1D',
    ip_region: 'BE',
    created_at: '2025-07-03T14:02:55Z',
  },
];

// ── Derived helpers ────────────────────────────────────────────────────

/** Reverse-chronological lifecycle events (most recent first) */
export const lifecycleEventsDesc = [...lifecycleEvents].reverse();

/** Actor lookup map by id */
export const actorById: Record<string, Actor> = Object.fromEntries(
  actors.map(a => [a.id, a])
);

/** Count actors by type */
export const actorCountByType: Record<ActorType, number> = actors.reduce(
  (acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + 1;
    return acc;
  },
  {} as Record<ActorType, number>
);

/** DPP access counts by tier */
export const dppAccessCounts: Record<AccessTier, number> = dppAccessLog.reduce(
  (acc, e) => {
    acc[e.access_tier] = (acc[e.access_tier] ?? 0) + 1;
    return acc;
  },
  {} as Record<AccessTier, number>
);

/** Human-readable label for a lifecycle event */
export function eventLabel(event_type: string): string {
  const map: Record<string, string> = {
    produced: 'Produced',
    quality_check: 'Quality Check',
    shipped: 'Shipped',
    checkpoint_scan: 'Checkpoint Scan',
    received_inventory: 'Received — Inventory',
    sold: 'Sold at POS',
    consumer_activation: 'Consumer Activation',
  };
  return map[event_type] ?? event_type;
}
