'use client'

import Link from 'next/link'

type IconName = 'search' | 'plus' | 'box' | 'warn' | 'truck' | 'chart' | 'filter' | 'refresh'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    box: <><path d="M21 8 12 3 3 8l9 5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
    warn: <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.8 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 4-4 3 3 5-7" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
    refresh: <><path d="M20 12a8 8 0 1 1-2.3-5.7" /><path d="M20 4v6h-6" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const STOCK_ITEMS = [
  { sku: 'INV-0428', name: 'Arabica blend - Attikan', supplier: 'Blue Tokai Roasters', outlet: 'Indiranagar', onHand: '2.4 kg', threshold: '6 kg', cover: '1.2 days', fill: 40, status: 'Reorder today', tone: 'danger' },
  { sku: 'INV-0184', name: 'Whole milk - Nandini', supplier: 'Nandini Dairy Kitchen', outlet: 'Indiranagar', onHand: '18 L', threshold: '30 L', cover: '2.1 days', fill: 60, status: 'Low stock', tone: 'warn' },
  { sku: 'INV-0221', name: 'Cream cheese', supplier: 'Sweet Crumb Studio', outlet: 'Koramangala', onHand: '1.8 kg', threshold: '3 kg', cover: '2.8 days', fill: 60, status: 'Low stock', tone: 'warn' },
  { sku: 'INV-0612', name: 'Paper cups 12oz', supplier: 'Paperwala Packaging', outlet: 'HSR Layout', onHand: '240 pc', threshold: '500 pc', cover: '1.5 days', fill: 48, status: 'Reorder today', tone: 'danger' },
  { sku: 'INV-0338', name: 'Brioche buns', supplier: 'Hearth & Stone Bakery', outlet: 'Indiranagar', onHand: '86 pc', threshold: '60 pc', cover: '3.4 days', fill: 92, status: 'Healthy', tone: 'ok' },
  { sku: 'INV-0719', name: 'Rocket leaves', supplier: 'Bloom Fresh Greens', outlet: 'Koramangala', onHand: '5.2 kg', threshold: '4 kg', cover: '4.1 days', fill: 100, status: 'Healthy', tone: 'ok' },
]

const MOVEMENTS = ['06:42 Whole milk received +42 L', '08:10 Coffee beans issued -1.6 kg', '09:25 Brioche buns issued -28 pc', '10:05 Paper cups issued -120 pc']

export default function InventoryPage() {
  const critical = STOCK_ITEMS.filter(item => item.tone === 'danger').length
  const low = STOCK_ITEMS.filter(item => item.tone === 'warn').length

  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar">
        <div><h1>Inventory</h1><p>Live stock, low inventory alerts, reorder queues, and outlet movement.</p></div>
        <label><Icon name="search" size={19} /><input placeholder="Search SKU, supplier, outlet..." /></label>
        <button><Icon name="refresh" /> Sync Stock</button>
        <Link href="/catalogue"><Icon name="plus" /> Add Item</Link>
      </header>

      <section className="cafe-ops-stats">
        <div className="cafe-card cafe-ops-stat"><span><Icon name="warn" /></span><div><p>Critical SKUs</p><strong>{critical}</strong><small>Reorder today</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="box" /></span><div><p>Low Stock</p><strong>{low}</strong><small>Below buffer</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="truck" /></span><div><p>Open Reorders</p><strong>7</strong><small>3 due before noon</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="chart" /></span><div><p>Stock Value</p><strong>Rs 8.42L</strong><small>At landed cost</small></div></div>
      </section>

      <section className="cafe-ops-grid inventory">
        <div className="cafe-card cafe-ops-board">
          <div className="cafe-ops-toolbar"><label><Icon name="search" size={16} /><input placeholder="Search watched inventory..." /></label><button><Icon name="filter" size={15} /> Filter</button><button>All outlets</button><div /></div>
          <div className="cafe-ops-table-wrap">
            <table className="cafe-ops-table">
              <thead><tr><th>SKU</th><th>Item</th><th>Supplier</th><th>Outlet</th><th>On hand</th><th>Cover</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {STOCK_ITEMS.map(item => (
                  <tr key={item.sku}>
                    <td><b>{item.sku}</b></td>
                    <td><strong>{item.name}</strong><div className="cafe-ops-meter"><span style={{ width: `${item.fill}%` }} /></div></td>
                    <td>{item.supplier}</td>
                    <td>{item.outlet}</td>
                    <td>{item.onHand}<small>min {item.threshold}</small></td>
                    <td>{item.cover}</td>
                    <td><span className={`status ${item.tone}`}><span className="dot" />{item.status}</span></td>
                    <td><button className="cafe-ops-small-btn">Reorder</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="cafe-card cafe-ops-panel">
          <div className="cafe-ops-panel-image"><img src="/images/cafe-inventory.jpg" alt="" /></div>
          <h2>Recent movement</h2>
          <p>Fastest drain is coffee bar inventory. Keep Arabica blend and cups in today&apos;s reorder basket.</p>
          {MOVEMENTS.map(item => <div className="cafe-ops-mini" key={item}><Icon name="box" size={15} /><span>{item}</span></div>)}
        </aside>
      </section>
    </main>
  )
}
