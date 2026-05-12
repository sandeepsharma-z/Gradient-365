'use client'

import { useState } from 'react'

type IconName = 'search' | 'box' | 'warn' | 'truck' | 'chart' | 'filter' | 'refresh'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    box: <><path d="M21 8 12 3 3 8l9 5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
    warn: <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.8 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 4-4 3 3 5-7" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
    refresh: <><path d="M20 12a8 8 0 1 1-2.3-5.7" /><path d="M20 4v6h-6" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const STOCK = [
  { item: 'Hazelnut Syrup 750ml', qty: '42 bottles', status: 'In Stock', eta: '-', fill: 88 },
  { item: 'Vanilla Syrup 750ml', qty: '0 bottles', status: 'Out of Stock', eta: '24 May', fill: 12 },
  { item: 'Robusta Powder 500g', qty: '8 packs', status: 'Low Stock', eta: '-', fill: 36 },
  { item: 'Frappe Mix 800g', qty: '0 packs', status: 'Back in Stock', eta: '26 May', fill: 20 },
]

export default function SupplierStockPage() {
  const [stock, setStock] = useState(STOCK)
  function update(index: number, status: string) {
    setStock(prev => prev.map((item, i) => i === index ? { ...item, status, qty: status === 'Out of Stock' ? '0' : item.qty, fill: status === 'Out of Stock' ? 12 : status === 'Low Stock' ? 36 : 84 } : item))
  }

  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar">
        <div><h1>Supplier Stock</h1><p>Optional stock updates for cafes: in stock, low stock, out of stock with ETA, or back-in-stock date.</p></div>
        <label><Icon name="search" size={19} /><input placeholder="Search stock item..." /></label>
        <button><Icon name="refresh" /> Sync</button>
        <button><Icon name="box" /> Bulk Update</button>
      </header>

      <section className="cafe-ops-stats">
        <div className="cafe-card cafe-ops-stat"><span><Icon name="box" /></span><div><p>In Stock</p><strong>82</strong><small>Ready for cafes</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="warn" /></span><div><p>Low Stock</p><strong>9</strong><small>Qty visible</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="truck" /></span><div><p>Restock ETA</p><strong>6</strong><small>Auto-notify cafes</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="chart" /></span><div><p>Update Score</p><strong>96%</strong><small>Higher supplier rating</small></div></div>
      </section>

      <section className="cafe-ops-grid inventory">
        <div className="cafe-card cafe-ops-board">
          <div className="cafe-ops-toolbar"><label><Icon name="search" size={16} /><input placeholder="Search product status..." /></label><button><Icon name="filter" size={15} /> Filter</button><button>All categories</button><div /></div>
          <div className="cafe-ops-table-wrap">
            <table className="cafe-ops-table">
              <thead><tr><th>Product</th><th>Quantity</th><th>Stock level</th><th>Status</th><th>Restock ETA</th><th>Update</th></tr></thead>
              <tbody>{stock.map((item, index) => <tr key={item.item}><td><strong>{item.item}</strong><small>Visible in cafe catalogue</small></td><td>{item.qty}</td><td><div className="cafe-ops-meter"><span style={{ width: `${item.fill}%` }} /></div></td><td><span className={`status ${item.status === 'Out of Stock' ? 'danger' : item.status === 'Low Stock' || item.status === 'Back in Stock' ? 'warn' : 'ok'}`}><span className="dot" />{item.status}</span></td><td>{item.eta}</td><td><select value={item.status} onChange={event => update(index, event.target.value)}><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option><option>Back in Stock</option></select></td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <aside className="cafe-card cafe-ops-panel">
          <div className="cafe-ops-panel-image"><img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85" alt="" /></div>
          <h2>What cafes see</h2>
          <p>Out of stock items are greyed in cafe catalogue, low stock shows remaining quantity, and ETA can open pre-order demand.</p>
          {['OOS badge blocks add-to-cart', 'Low stock warning with quantity', 'Restock ETA sends regular-cafe reminders'].map(item => <div className="cafe-ops-mini" key={item}><Icon name="chart" size={15} /><span>{item}</span></div>)}
        </aside>
      </section>
    </main>
  )
}
