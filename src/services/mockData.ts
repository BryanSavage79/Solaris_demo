import type { Product, ProductEvent, Contract } from '../types';

export const mockProduct: Product = {
  id: 'prod-001',
  name: 'Alpine Trek Jacket',
  sku: 'ATJ-2024-BLU-L',
  description:
    'Premium all-weather jacket with reinforced stitching, waterproof shell, and thermal lining. Designed for extreme outdoor conditions.',
  imageUrl: '/demo-assets/jacket.png',
  price: 289.99,
  currency: 'USD',
  category: 'Outerwear',
  manufacturer: 'Solaris Apparel Co.',
  contractId: 'contract-001',
  currentStatus: 'in_transit',
};

export const mockEvents: ProductEvent[] = [
  {
    id: 'evt-001',
    timestamp: '2024-01-15T08:00:00Z',
    type: 'contract_created',
    description: 'Smart contract created and signed by both parties.',
    actor: 'System',
    status: 'pending',
  },
  {
    id: 'evt-002',
    timestamp: '2024-01-16T09:30:00Z',
    type: 'manufacturing_complete',
    description: 'Item manufactured and quality-checked at production facility.',
    location: 'Portland, OR',
    actor: 'Solaris Apparel Co.',
    status: 'pending',
  },
  {
    id: 'evt-003',
    timestamp: '2024-01-17T14:00:00Z',
    type: 'shipment_initiated',
    description: 'Package picked up by carrier and entered logistics network.',
    location: 'Portland, OR',
    actor: 'FastShip Logistics',
    status: 'in_transit',
  },
  {
    id: 'evt-004',
    timestamp: '2024-01-18T10:15:00Z',
    type: 'checkpoint_reached',
    description: 'Package scanned at regional distribution hub.',
    location: 'Salt Lake City, UT',
    actor: 'FastShip Logistics',
    status: 'in_transit',
  },
];

export const mockContract: Contract = {
  id: 'contract-001',
  productId: 'prod-001',
  buyer: 'Outdoor Adventures LLC',
  seller: 'Solaris Apparel Co.',
  status: 'active',
  value: 289.99,
  currency: 'USD',
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2024-01-18T10:15:00Z',
  terms:
    'Delivery within 5 business days. Full refund guaranteed if item not received within 10 days.',
};
