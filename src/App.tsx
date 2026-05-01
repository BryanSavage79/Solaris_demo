import { useState } from 'react'
import './App.css'
import type { Product } from './types'
import ProductCard from './components/ProductCard'

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Solar Panel Pro 400W',
    description: 'High-efficiency monocrystalline solar panel with 21% conversion rate.',
    price: 349.99,
    status: 'active',
    category: 'Solar Panels',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Battery Storage 10kWh',
    description: 'Lithium-ion home battery pack for overnight energy storage.',
    price: 4999.00,
    status: 'active',
    category: 'Storage',
  },
  {
    id: '3',
    name: 'Micro Inverter 250W',
    description: 'Grid-tie micro inverter with 97% peak efficiency.',
    price: 189.50,
    status: 'out_of_stock',
    category: 'Inverters',
  },
  {
    id: '4',
    name: 'Solar Charge Controller',
    description: 'MPPT charge controller for off-grid solar systems.',
    price: 79.95,
    status: 'inactive',
    category: 'Controllers',
  },
]

function App() {
  const [selected, setSelected] = useState<Product | null>(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Solaris — Product Catalog</h1>
        {selected && (
          <p className="selection-notice">
            Selected: <strong>{selected.name}</strong>
          </p>
        )}
      </header>
      <main className="product-grid">
        {SAMPLE_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={setSelected} />
        ))}
      </main>
    </div>
  )
}

export default App
