import type { Product } from "../types";
import StatusBadge from "./StatusBadge";

export default function ProductCard({ product, onSelect }: {
  product: Product;
  onSelect: (p: Product) => void;
}) {
  return (
    <div className="product-card" onClick={() => onSelect(product)}>
      {product.imageUrl && (
        <img
          className="product-card__image"
          src={product.imageUrl}
          alt={product.name}
        />
      )}
      <div className="product-card__body">
        <div className="product-card__header">
          <h3 className="product-card__name">{product.name}</h3>
          <StatusBadge status={product.status} />
        </div>
        <p className="product-card__category">{product.category}</p>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
