export type EventType = "VERIFIED" | "PENDING" | "REJECTED" | "MINTED" | "ACTIVATED" | "TRANSFERRED";

export type ProductStatus = "Verified" | "Pending" | "Rejected" | "Active";

export interface ProductEvent {
  type: EventType;
  timestamp: number;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  status: ProductStatus;
  events: ProductEvent[];
}
