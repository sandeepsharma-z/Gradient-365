'use client'

import { useState } from 'react'

type Product = { name: string; brand: string; mrp: string; category: string; type: 'A' | 'B'; dish?: string; stock: string }

const INITIAL: Product[] = [
  { name: 'Hazelnut Syrup 750ml', brand: 'Monin', mrp: 'Rs 850', category: 'Syrups', type: 'A', stock: 'In Stock' },
  { name: 'Vanilla Syrup 750ml', brand: 'Monin', mrp: 'Rs 800', category: 'Syrups', type: 'A', stock: 'Out of Stock' },
  { name: 'Frappe Base 1kg', brand: 'Caprimo', mrp: 'Rs 940', category: 'Frappe Base', type: 'B', dish: 'Cold Coffee', stock: 'In Stock' },
  { name: 'Penne 500g', brand: 'Barilla', mrp: 'Rs 180', category: 'Pasta Base', type: 'B', dish: 'Pasta', stock: 'Low Stock' },
]

export default function SupplierCataloguePage() {
  const [type, setType] = useState<'A' | 'B'>('A')
  const [products, setProducts] = useState(INITIAL)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', brand: '', mrp: '', category: '', dish: '' })
  const visible = products.filter(product => product.type === type)

  function addProduct() {
    if (!form.name.trim()) return
    setProducts(prev => [{ ...form, mrp: form.mrp || 'Rs 0', type, stock: 'In Stock' }, ...prev])
    setForm({ name: '', brand: '', mrp: '', category: '', dish: '' })
    setShowModal(false)
  }

  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar">
        <div><h1>Supplier Catalogue</h1><p>Build Type A simple categories or Type B dish-wise catalogue. MRP is visible to all cafes.</p></div>
        <button onClick={() => setShowModal(true)}>Add Product</button>
      </header>
      <section className="cafe-card cafe-ops-board">
        <div className="cafe-ops-tabs">
          <button className={type === 'A' ? 'active' : ''} onClick={() => setType('A')}>Type A - Simple Category</button>
          <button className={type === 'B' ? 'active' : ''} onClick={() => setType('B')}>Type B - Dish-wise</button>
        </div>
        <div className="supplier-product-grid">
          {visible.map(product => (
            <article className="supplier-product-card" key={`${product.type}-${product.name}`}>
              <img src={product.type === 'A' ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80' : 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80'} alt="" />
              <div><span>{product.type === 'A' ? product.category : `${product.dish} / ${product.category}`}</span><h3>{product.name}</h3><p>{product.brand}</p></div>
              <footer><b>{product.mrp}</b><small className={product.stock === 'Out of Stock' ? 'danger' : product.stock === 'Low Stock' ? 'warn' : ''}>{product.stock}</small></footer>
            </article>
          ))}
        </div>
      </section>
      {showModal && (
        <div className="cafe-ops-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="cafe-ops-modal" onClick={e => e.stopPropagation()}>
            <div className="cafe-ops-modal-head"><div><span>Catalogue builder</span><h2>Add {type === 'A' ? 'Category Product' : 'Dish-wise Product'}</h2></div><button onClick={() => setShowModal(false)}>×</button></div>
            <div className="cafe-ops-form-grid">
              {type === 'B' && <label>Dish<input value={form.dish} onChange={e => setForm({ ...form, dish: e.target.value })} placeholder="Cold Coffee" /></label>}
              <label>Category<input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder={type === 'A' ? 'Syrups' : 'Frappe Base'} /></label>
              <label>Product<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" /></label>
              <label>Brand<input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Brand / Company" /></label>
              <label className="wide">MRP<input value={form.mrp} onChange={e => setForm({ ...form, mrp: e.target.value })} placeholder="Rs 850" /></label>
            </div>
            <div className="cafe-ops-modal-actions"><button onClick={() => setShowModal(false)}>Cancel</button><button onClick={addProduct}>Publish Catalogue</button></div>
          </div>
        </div>
      )}
    </main>
  )
}
