import { ProductEvent, EventStatus } from '../types';
import { mockEvents } from './mockData';

let events: ProductEvent[] = [...mockEvents];

const EVENT_TYPES: Array<{ type: string; description: string; location?: string }> = [
  {
    type: 'checkpoint_reached',
    description: 'Package scanned at regional distribution hub.',
    location: 'Denver, CO',
  },
  {
    type: 'checkpoint_reached',
    description: 'Package arrived at destination facility.',
    location: 'Austin, TX',
  },
  {
    type: 'out_for_delivery',
    description: 'Package out for final delivery to recipient.',
    location: 'Austin, TX',
  },
  {
    type: 'delivered',
    description: 'Package successfully delivered and signed for by recipient.',
    location: 'Austin, TX',
  },
];

let simulationStep = 0;

/**
 * Returns all tracked events for the current product.
 */
export function getEvents(): ProductEvent[] {
  return [...events];
}

/**
 * Simulates the next event in the product journey.
 * Returns the newly added event, or null if the journey is complete.
 */
export function simulateNextEvent(): ProductEvent | null {
  if (simulationStep >= EVENT_TYPES.length) {
    return null;
  }

  const template = EVENT_TYPES[simulationStep];
  simulationStep += 1;

  const lastStatus = events[events.length - 1]?.status ?? 'pending';
  let newStatus: EventStatus = lastStatus;

  if (template.type === 'delivered') {
    newStatus = 'delivered';
  } else if (template.type === 'out_for_delivery' || template.type === 'checkpoint_reached') {
    newStatus = 'in_transit';
  }

  const newEvent: ProductEvent = {
    id: `evt-${String(events.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    type: template.type,
    description: template.description,
    location: template.location,
    actor: 'FastShip Logistics',
    status: newStatus,
  };

  events = [...events, newEvent];
  return newEvent;
}

/**
 * Returns true if there are more events to simulate.
 */
export function hasMoreEvents(): boolean {
  return simulationStep < EVENT_TYPES.length;
}

/**
 * Resets the event simulation back to the initial state.
 */
export function resetEvents(): void {
  events = [...mockEvents];
  simulationStep = 0;
}
