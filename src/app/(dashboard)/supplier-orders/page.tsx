'use client'

import { useState } from 'react'

type OrderStatus = 'New' | 'Full Confirmation' | 'Partial Confirmation' | 'Cancelled' | 'Delivery Assigned'
type IconName = 'search' | 'lock' | 'box' | 'warn' | 'truck' | 'check' | 'filter'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    box: <><path d="M21 8 12 3 3 8l9 5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
    warn: <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.8 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    check: <><path d="M20 6 9 17l-5-5" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const ORDERS = [
  { ref: 'ORD-20415', cafe: 'Brew Haven Indiranagar', amount: 'Rs 24,680', items: '6 items', eta: 'Today, 4:30 PM', status: 'New' as OrderStatus, available: ['Arabica Beans 1kg', 'Cold Brew Bottle', 'Paper Cups 12oz'], unavailable: ['Vanilla Syrup 750ml'] },
  { ref: 'ORD-20412', cafe: 'Flat White Cafe', amount: 'Rs 18,420', items: '4 items', eta: 'Today, 6:00 PM', status: 'Full Confirmation' as OrderStatus, available: ['Frappe Base 1kg', 'Burger Mayo 1kg'], unavailable: [] },
  { ref: 'ORD-20408', cafe: 'Brew & Co. Saket', amount: 'Rs 31,100', items: '9 items', eta: 'Tomorrow, 11:00 AM', status: 'Partial Confirmation' as OrderStatus, available: ['Penne 500g', 'Arrabiata Sauce'], unavailable: ['Fusilli 500g'] },
]

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState(ORDERS)
  const [active, setActive] = useState(ORDERS[0])

  function setStatus(ref: string, status: OrderStatus) {
    setOrders(prev => prev.map(order => order.ref === ref ? { ...order, status } : order))
    setActive(prev => prev.ref === ref ? { ...prev, status } : prev)
  }

  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar">
        <div><h1>Supplier Orders</h1><p>Decrypt cafe orders, check inventory, send full or partial confirmation, then assign delivery.</p></div>
        <label><Icon name="search" size={19} /><input placeholder="Search order, cafe, item..." /></label>
        <button><Icon name="filter" /> Filter</button>
        <button><Icon name="lock" /> Encrypted Inbox</button>
      </header>

      <section className="cafe-ops-stats">
        <div className="cafe-card cafe-ops-stat"><span><Icon name="lock" /></span><div><p>Encrypted Orders</p><strong>12</strong><small>Ready to decrypt</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="check" /></span><div><p>Full Confirmed</p><strong>8</strong><small>All available</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="warn" /></span><div><p>Partial</p><strong>3</strong><small>Needs cafe decision</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="truck" /></span><div><p>Assigned</p><strong>5</strong><small>Delivery in progress</small></div></div>
      </section>

      <section className="cafe-ops-grid inventory">
        <div className="cafe-card cafe-ops-board">
          <div className="cafe-ops-toolbar"><label><Icon name="search" size={16} /><input placeholder="Search supplier orders..." /></label><button>Newest</button><button>Needs action</button><div /></div>
          <div className="cafe-ops-list">
            {orders.map(order => (
              <button className={`cafe-ops-row supplier-order-row${active.ref === order.ref ? ' active' : ''}`} key={order.ref} onClick={() => setActive(order)}>
                <span className="supplier-order-icon"><Icon name="box" /></span>
                <div><h3>{order.ref} - {order.cafe}</h3><p>{order.items} - {order.amount}</p><small>Encrypted payload received. ETA request: {order.eta}</small></div>
                <span className={`status ${order.status === 'Full Confirmation' || order.status === 'Delivery Assigned' ? 'ok' : order.status === 'Partial Confirmation' ? 'warn' : order.status === 'Cancelled' ? 'danger' : 'accent'}`}><span className="dot" />{order.status}</span>
                <b>{order.amount}</b>
              </button>
            ))}
          </div>
        </div>

        <aside className="cafe-card cafe-ops-panel supplier-order-detail">
          <div className="cafe-ops-panel-image"><img src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=900&q=85" alt="" /></div>
          <h2>{active.ref}</h2>
          <p>{active.cafe} order decrypted locally for supplier inventory check.</p>
          <div className="supplier-confirm-list">
            <strong>Available list</strong>
            {active.available.map(item => <span key={item} className="ok"><Icon name="check" size={13} />{item}</span>)}
            <strong>Unavailable list + ETA</strong>
            {active.unavailable.length ? active.unavailable.map(item => <span key={item} className="warn"><Icon name="warn" size={13} />{item} - ETA 24 May</span>) : <span className="ok"><Icon name="check" size={13} />No unavailable items</span>}
          </div>
          <div className="supplier-detail-actions">
            <button onClick={() => setStatus(active.ref, 'Full Confirmation')}>Full Confirm</button>
            <button onClick={() => setStatus(active.ref, 'Partial Confirmation')}>Send Partial</button>
            <button onClick={() => setStatus(active.ref, 'Delivery Assigned')}>Assign Delivery</button>
            <button onClick={() => setStatus(active.ref, 'Cancelled')}>Cancel</button>
          </div>
        </aside>
      </section>
    </main>
  )
}
