export interface ProductEvent {
  type: "MINTED" | "ACTIVATED" | "TRANSFERRED" | "DEACTIVATED";
  timestamp: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  status: "Active" | "Inactive" | "Transferred";
  events: ProductEvent[];
}
