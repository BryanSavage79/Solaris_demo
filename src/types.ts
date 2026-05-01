// Core domain types for the Solaris demo

export type EventStatus = 'pending' | 'in_transit' | 'delivered' | 'returned' | 'cancelled';

export type ContractStatus = 'draft' | 'active' | 'fulfilled' | 'disputed' | 'expired';

export interface ProductEvent {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  location?: string;
  actor?: string;
  status: EventStatus;
}

export interface Contract {
  id: string;
  productId: string;
  buyer: string;
  seller: string;
  status: ContractStatus;
  value: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  terms: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  price: number;
  currency: string;
  category: string;
  manufacturer: string;
  contractId: string;
  currentStatus: EventStatus;
}
