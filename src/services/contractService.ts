import type { Contract, ContractStatus } from '../types';
import { mockContract } from './mockData';

let contract: Contract = { ...mockContract };

/**
 * Returns the current contract for the demo product.
 */
export function getContract(): Contract {
  return { ...contract };
}

/**
 * Updates the contract status based on the latest product event status.
 * Maps delivery milestones to corresponding contract states.
 */
export function syncContractStatus(deliveryStatus: string): ContractStatus {
  let newStatus: ContractStatus;

  switch (deliveryStatus) {
    case 'pending':
      newStatus = 'active';
      break;
    case 'in_transit':
      newStatus = 'active';
      break;
    case 'delivered':
      newStatus = 'fulfilled';
      break;
    case 'returned':
      newStatus = 'disputed';
      break;
    case 'cancelled':
      newStatus = 'expired';
      break;
    default:
      newStatus = 'active';
  }

  contract = {
    ...contract,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  return newStatus;
}

/**
 * Resets the contract to its initial mock state.
 */
export function resetContract(): void {
  contract = { ...mockContract };
}
