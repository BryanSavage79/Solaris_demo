import React from 'react';
import { EventStatus, ContractStatus } from '../types';

type BadgeVariant = EventStatus | ContractStatus;

interface StatusBadgeProps {
  status: BadgeVariant;
  label?: string;
}

const STATUS_CONFIG: Record<BadgeVariant, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'badge badge--pending' },
  in_transit: { label: 'In Transit', className: 'badge badge--in-transit' },
  delivered: { label: 'Delivered', className: 'badge badge--delivered' },
  returned: { label: 'Returned', className: 'badge badge--returned' },
  cancelled: { label: 'Cancelled', className: 'badge badge--cancelled' },
  draft: { label: 'Draft', className: 'badge badge--draft' },
  active: { label: 'Active', className: 'badge badge--active' },
  fulfilled: { label: 'Fulfilled', className: 'badge badge--fulfilled' },
  disputed: { label: 'Disputed', className: 'badge badge--disputed' },
  expired: { label: 'Expired', className: 'badge badge--expired' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'badge badge--default' };
  return <span className={config.className}>{label ?? config.label}</span>;
};
