import type { Product, ProductStatus, EventType } from "../types";

export const simulateEvent = (product: Product): Product => {
  const nextEvent: EventType = "VERIFIED";
  const nextStatus: ProductStatus = "Verified";

  return {
    ...product,
    status: nextStatus,
    events: [
      ...product.events,
      { type: nextEvent, timestamp: Date.now() }
    ]
  };
};
