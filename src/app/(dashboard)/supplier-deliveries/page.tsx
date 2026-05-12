'use client'

import { useState } from 'react'

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
      <header className="cafe-ops-topbar"><div><h1>Supplier Deliveries</h1><p>Assign delivery boy, send encrypted phone + ETA, track completion and digital receipt.</p></div></header>
      <section className="cafe-card cafe-ops-board">
        <div className="cafe-ops-table-wrap">
          <table className="cafe-ops-table">
            <thead><tr><th>Order</th><th>Cafe</th><th>Delivery Boy</th><th>ETA</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{deliveries.map((item, index) => <tr key={item.ref}><td><strong>{item.ref}</strong></td><td>{item.cafe}</td><td>{item.driver}</td><td>{item.eta}</td><td><span className={`status ${item.status === 'Delivered' ? 'ok' : 'warn'}`}><span className="dot" />{item.status}</span></td><td><button className="cafe-ops-small-btn" onClick={() => advance(index)}>{item.status === 'Delivered' ? 'Receipt Stored' : 'Advance'}</button></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
