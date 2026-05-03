import type { Product } from "../types";

export const demoProducts: Product[] = [
  {
    id: "SOL-001",
    name: "Solaris Demo Jacket",
    brand: "Ascendii",
    status: "Active",
    events: [
      { type: "MINTED", timestamp: Date.now() - 500000 },
      { type: "ACTIVATED", timestamp: Date.now() - 400000 },
      { type: "TRANSFERRED", timestamp: Date.now() - 300000 }
    ]
  }
];
