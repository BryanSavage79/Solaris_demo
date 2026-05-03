import type { Actor } from '../core/types';

export const actorRegistry: Actor[] = [
  { address: '0xAUTH_MANUFACTURER', name: 'Solaris Manufacturing Co.', roles: ['MANUFACTURER'] },
  { address: '0xAUTH_REPAIR', name: 'Certified Repair Hub', roles: ['REPAIR_PROVIDER'] },
  { address: '0xUNAUTH_ACTOR', name: 'Unknown Actor', roles: [] },
];

export const getActor = (address: string): Actor | undefined =>
  actorRegistry.find(a => a.address === address);

export const hasRole = (address: string, role: string, registry: Actor[]): boolean =>
  registry.find(a => a.address === address)?.roles.includes(role) ?? false;
