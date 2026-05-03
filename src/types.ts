export type EventType = "VERIFIED" | "PENDING" | "REJECTED";

export type ProductStatus = "Verified" | "Pending" | "Rejected";

export interface ProductEvent {
  type: EventType;
  timestamp: number;
}

export interface Product {
  id: string;
  name: string;
  status: ProductStatus;
  events: ProductEvent[];
}
