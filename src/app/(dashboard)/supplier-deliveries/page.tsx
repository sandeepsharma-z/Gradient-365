'use client'

import { useState } from 'react'

type IconName = 'search' | 'truck' | 'cart' | 'chart' | 'filter' | 'calendar'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H7" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 4-4 3 3 5-7" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const DELIVERIES = [
  { ref: 'SUP-ORD-2041', cafe: 'Brew Haven', driver: 'Amit Verma', eta: '35 mins', status: 'Assigned' },
  { ref: 'SUP-ORD-2042', cafe: 'Flat White Cafe', driver: 'Karan Singh', eta: '12 mins', status: 'In Progress' },
  { ref: 'SUP-ORD-2043', cafe: 'Brew & Co. Saket', driver: 'Neha Rao', eta: 'Delivered', status: 'Delivered' },
]

export default function SupplierDeliveriesPage() {
  const [deliveries, setDeliveries] = useState(DELIVERIES)
  function advance(index: number) {
    setDeliveries(prev => prev.map((item, i) => i === index ? { ...item, status: item.status === 'Assigned' ? 'In Progress' : 'Delivered', eta: item.status === 'Assigned' ? '18 mins' : 'Delivered' } : item))
  }

  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar">
        <div><h1>Supplier Deliveries</h1><p>Assign delivery boy, share phone + ETA, track route status, and store signed receipt.</p></div>
        <label><Icon name="search" size={19} /><input placeholder="Search order, cafe, driver..." /></label>
        <button><Icon name="calendar" /> Today</button>
        <button><Icon name="truck" /> Assign Driver</button>
      </header>

      <section className="cafe-ops-stats">
        <div className="cafe-card cafe-ops-stat"><span><Icon name="cart" /></span><div><p>Ready Orders</p><strong>16</strong><small>Waiting dispatch</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="truck" /></span><div><p>In Progress</p><strong>5</strong><small>ETA shared</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="chart" /></span><div><p>Delivered</p><strong>28</strong><small>Signed receipt</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="calendar" /></span><div><p>On-time</p><strong>94%</strong><small>This month</small></div></div>
      </section>

      <section className="cafe-ops-grid inventory">
        <div className="cafe-card cafe-ops-board">
          <div className="cafe-ops-toolbar"><label><Icon name="search" size={16} /><input placeholder="Search delivery queue..." /></label><button><Icon name="filter" size={15} /> Filter</button><button>All drivers</button><div /></div>
          <div className="cafe-ops-table-wrap">
            <table className="cafe-ops-table">
              <thead><tr><th>Order</th><th>Cafe</th><th>Delivery Boy</th><th>ETA</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>{deliveries.map((item, index) => <tr key={item.ref}><td><strong>{item.ref}</strong><small>Encrypted delivery update</small></td><td>{item.cafe}</td><td>{item.driver}</td><td>{item.eta}</td><td><span className={`status ${item.status === 'Delivered' ? 'ok' : item.status === 'Assigned' ? 'warn' : 'info'}`}><span className="dot" />{item.status}</span></td><td><button className="cafe-ops-small-btn" onClick={() => advance(index)}>{item.status === 'Delivered' ? 'Receipt Stored' : 'Advance'}</button></td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <aside className="cafe-card cafe-ops-panel">
          <div className="cafe-ops-panel-image"><img src="https://images.unsplash.com/photo-1605902711622-cfb43c4437d7?auto=format&fit=crop&w=900&q=85" alt="" /></div>
          <h2>Delivery checklist</h2>
          <p>Every confirmed order gets delivery boy details, phone, ETA, progress status, and cafe receipt confirmation.</p>
          {['Driver assigned with encrypted ETA', 'Cafe confirms receipt digitally', 'Completed record stored in order history'].map(item => <div className="cafe-ops-mini" key={item}><Icon name="truck" size={15} /><span>{item}</span></div>)}
        </aside>
      </section>
    </main>
  )
}
