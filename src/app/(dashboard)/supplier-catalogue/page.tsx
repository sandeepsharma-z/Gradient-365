'use client'

import { useState } from 'react'

type Product = { name: string; brand: string; mrp: string; category: string; type: 'A' | 'B'; dish?: string; stock: 'In Stock' | 'Low Stock' | 'Out of Stock' }
type IconName = 'search' | 'plus' | 'filter' | 'star' | 'box'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
    star: <><path d="m12 2 3 6.5 7 .8-5.2 4.7 1.4 7-6.2-3.6L5.8 21l1.4-7L2 9.3l7-.8z" /></>,
    box: <><path d="M21 8 12 3 3 8l9 5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const INITIAL: Product[] = [
  { name: 'Hazelnut Syrup 750ml', brand: 'Monin', mrp: 'Rs 850', category: 'Syrups', type: 'A', stock: 'In Stock' },
  { name: 'Vanilla Syrup 750ml', brand: 'Monin', mrp: 'Rs 800', category: 'Syrups', type: 'A', stock: 'Out of Stock' },
  { name: 'Arabica Beans 1kg', brand: 'Blue Tokai', mrp: 'Rs 1,200', category: 'Coffee', type: 'A', stock: 'Low Stock' },
  { name: 'Frappe Base 1kg', brand: 'Caprimo', mrp: 'Rs 940', category: 'Frappe Base', type: 'B', dish: 'Cold Coffee', stock: 'In Stock' },
  { name: 'Penne 500g', brand: 'Barilla', mrp: 'Rs 180', category: 'Pasta Base', type: 'B', dish: 'Pasta', stock: 'Low Stock' },
  { name: 'Burger Mayo 1kg', brand: 'Hellmanns', mrp: 'Rs 340', category: 'Sauces', type: 'B', dish: 'Burger', stock: 'In Stock' },
]

const images = [
  'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=520&q=85',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=520&q=85',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=520&q=85',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=520&q=85',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=520&q=85',
  'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=520&q=85',
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
    <main className="cafe-menu-page">
      <header className="cafe-menu-topbar">
        <div><h1>Supplier Catalogue</h1><p>Build Type A simple categories or Type B dish-wise catalogue. MRP stays visible to cafes.</p></div>
        <label className="cafe-menu-search"><Icon name="search" size={19} /><input placeholder="Search product, category, brand..." /></label>
        <button className="cafe-menu-cart-link" onClick={() => setShowModal(true)}><Icon name="plus" /> Add Product</button>
      </header>

      <section className="cafe-menu-stats">
        <div className="cafe-card cafe-menu-stat"><span><Icon name="box" /></span><div><p>Total Products</p><strong>{products.length}</strong><small>Published catalogue</small></div></div>
        <div className="cafe-card cafe-menu-stat"><span><Icon name="star" /></span><div><p>Type A Items</p><strong>{products.filter(p => p.type === 'A').length}</strong><small>Simple categories</small></div></div>
        <div className="cafe-card cafe-menu-stat"><span><Icon name="filter" /></span><div><p>Type B Items</p><strong>{products.filter(p => p.type === 'B').length}</strong><small>Dish-wise groups</small></div></div>
        <div className="cafe-card cafe-menu-stat"><span><Icon name="plus" /></span><div><p>Private Deals</p><strong>36</strong><small>Encrypted per cafe</small></div></div>
      </section>

      <section className="cafe-card cafe-menu-board">
        <div className="cafe-menu-categories">
          <button className={type === 'A' ? 'active' : ''} onClick={() => setType('A')}>Type A - Simple Category</button>
          <button className={type === 'B' ? 'active' : ''} onClick={() => setType('B')}>Type B - Dish-wise</button>
          <button>Syrups</button><button>Coffee</button><button>Dairy</button><button>Packaging</button>
        </div>
        <div className="cafe-menu-toolbar">
          <label><Icon name="search" size={16} /><input placeholder="Search supplier catalogue..." /></label>
          <button><Icon name="filter" size={15} /> Filter</button>
          <button><Icon name="star" size={15} /> Published</button>
          <div />
          <span>{visible.length} items</span>
          <button onClick={() => setShowModal(true)}><Icon name="plus" size={15} /> Add Product</button>
        </div>
        <div className="cafe-menu-grid">
          {visible.map((product, index) => (
            <article className="cafe-menu-card" key={`${product.type}-${product.name}`}>
              <div className="cafe-menu-image"><img src={images[index % images.length]} alt="" /><span>{product.type === 'A' ? product.category : product.dish}</span></div>
              <div className="cafe-menu-card-body">
                <div><h3>{product.name}</h3><p>{product.brand} - {product.type === 'A' ? product.category : product.category}. Cafes see MRP, deal price stays private.</p></div>
                <div className="cafe-menu-meta"><span>{product.stock}</span><b>MRP {product.mrp}</b></div>
                <div className="cafe-flow-badges"><span className={product.stock === 'Out of Stock' ? 'danger' : product.stock === 'Low Stock' ? 'warn' : 'ok'}>{product.stock}</span><button>Private deal</button></div>
                <div className="cafe-menu-actions"><small>Visible to linked cafes</small><button>Edit Item</button></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {showModal && (
        <div className="cafe-ops-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="cafe-ops-modal" onClick={event => event.stopPropagation()}>
            <div className="cafe-ops-modal-head"><div><span>Catalogue builder</span><h2>Add {type === 'A' ? 'Category Product' : 'Dish-wise Product'}</h2></div><button onClick={() => setShowModal(false)}>x</button></div>
            <div className="cafe-ops-form-grid">
              {type === 'B' && <label>Dish<input value={form.dish} onChange={event => setForm({ ...form, dish: event.target.value })} placeholder="Cold Coffee" /></label>}
              <label>Category<input value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} placeholder={type === 'A' ? 'Syrups' : 'Frappe Base'} /></label>
              <label>Product<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Product name" /></label>
              <label>Brand<input value={form.brand} onChange={event => setForm({ ...form, brand: event.target.value })} placeholder="Brand / Company" /></label>
              <label className="wide">MRP<input value={form.mrp} onChange={event => setForm({ ...form, mrp: event.target.value })} placeholder="Rs 850" /></label>
            </div>
            <div className="cafe-ops-modal-actions"><button onClick={() => setShowModal(false)}>Cancel</button><button onClick={addProduct}>Publish Catalogue</button></div>
          </div>
        </div>
      )}
    </main>
  )
}
