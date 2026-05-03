import React from 'react';
import type { Product, Contract } from '../types';
import { StatusBadge } from './StatusBadge';

interface ProductCardProps {
  product: Product;
  contract: Contract;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, contract }) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency,
  }).format(product.price);

  const formattedContractValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: contract.currency,
  }).format(contract.value);

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card__image"
        />
      </div>
      <div className="product-card__body">
        <div className="product-card__header">
          <div>
            <h2 className="product-card__name">{product.name}</h2>
            <p className="product-card__sku">SKU: {product.sku}</p>
          </div>
          <StatusBadge status={product.currentStatus} />
        </div>

        <p className="product-card__description">{product.description}</p>

        <dl className="product-card__meta">
          <div className="product-card__meta-row">
            <dt>Category</dt>
            <dd>{product.category}</dd>
          </div>
          <div className="product-card__meta-row">
            <dt>Manufacturer</dt>
            <dd>{product.manufacturer}</dd>
          </div>
          <div className="product-card__meta-row">
            <dt>Price</dt>
            <dd>{formattedPrice}</dd>
          </div>
        </dl>

        <div className="product-card__contract">
          <h3 className="product-card__contract-title">Smart Contract</h3>
          <div className="product-card__contract-body">
            <div className="product-card__contract-row">
              <span>ID</span>
              <code>{contract.id}</code>
            </div>
            <div className="product-card__contract-row">
              <span>Buyer</span>
              <span>{contract.buyer}</span>
            </div>
            <div className="product-card__contract-row">
              <span>Seller</span>
              <span>{contract.seller}</span>
            </div>
            <div className="product-card__contract-row">
              <span>Value</span>
              <span>{formattedContractValue}</span>
            </div>
            <div className="product-card__contract-row">
              <span>Status</span>
              <StatusBadge status={contract.status} />
            </div>
          </div>
          <p className="product-card__contract-terms">{contract.terms}</p>
        </div>
      </div>
    </div>
  );
};
