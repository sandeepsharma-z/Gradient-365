'use client'

import { useState } from 'react'

const STOCK = [
  { item: 'Hazelnut Syrup 750ml', qty: '42 bottles', status: 'In Stock', eta: '-' },
  { item: 'Vanilla Syrup 750ml', qty: '0 bottles', status: 'Out of Stock', eta: '24 May' },
  { item: 'Robusta Powder 500g', qty: '8 packs', status: 'Low Stock', eta: '-' },
  { item: 'Frappe Mix 800g', qty: '0 packs', status: 'Back in Stock', eta: '26 May' },
]

export default function SupplierStockPage() {
  const [stock, setStock] = useState(STOCK)
  function update(index: number, status: string) {
    setStock(prev => prev.map((item, i) => i === index ? { ...item, status, qty: status === 'Out of Stock' ? '0' : item.qty } : item))
  }
  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar"><div><h1>Supplier Stock</h1><p>Optional stock updates: in stock, low stock with quantity, out of stock with ETA, or back-in-stock date.</p></div></header>
      <section className="cafe-card cafe-ops-board">
        <div className="cafe-ops-table-wrap">
          <table className="cafe-ops-table">
            <thead><tr><th>Product</th><th>Quantity</th><th>Status</th><th>Restock ETA</th><th>Update</th></tr></thead>
            <tbody>{stock.map((item, index) => <tr key={item.item}><td><strong>{item.item}</strong></td><td>{item.qty}</td><td><span className={`status ${item.status === 'Out of Stock' ? 'danger' : item.status === 'Low Stock' ? 'warn' : 'ok'}`}><span className="dot" />{item.status}</span></td><td>{item.eta}</td><td><select value={item.status} onChange={e => update(index, e.target.value)}><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option><option>Back in Stock</option></select></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
