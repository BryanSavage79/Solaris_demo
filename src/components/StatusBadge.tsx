import type { ProductStatus } from "../types";

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "status-badge status-badge--active" },
  inactive: { label: "Inactive", className: "status-badge status-badge--inactive" },
  out_of_stock: { label: "Out of Stock", className: "status-badge status-badge--out-of-stock" },
};

export default function StatusBadge({ status }: { status: ProductStatus }) {
  const { label, className } = statusConfig[status];
  return <span className={className}>{label}</span>;
}
