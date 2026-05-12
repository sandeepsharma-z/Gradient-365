'use client'

import Link from 'next/link'

function Icon({ name, size = 18 }: { name: 'box' | 'cart' | 'chat' | 'truck' | 'chart' | 'plus'; size?: number }) {
  const paths = {
    box: <><path d="M21 8 12 3 3 8l9 5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
    cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H7" /></>,
    chat: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 4-4 3 3 5-7" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

const alerts = [
  ['Stock update recommended', 'Vanilla Syrup 750ml is marked out of stock for 6 cafes.'],
  ['New urgent enquiry', 'Brew Haven needs 12 bottles of Hazelnut Syrup today.'],
  ['Quote accepted', 'Flat White Cafe accepted revised price for frappe base.'],
]

export default function SupplierDashboardPage() {
  return (
    <main className="cafe-ops-page supplier-page">
      <header className="cafe-ops-topbar">
        <div><h1>Supplier Hub</h1><p>Manage products, stock, cafe enquiries, negotiated pricing, and delivery fulfilment.</p></div>
        <Link href="/supplier-catalogue"><Icon name="plus" /> Add Product</Link>
        <Link href="/supplier-enquiries"><Icon name="chat" /> Enquiries</Link>
      </header>

      <section className="cafe-ops-stats">
        <div className="cafe-card cafe-ops-stat"><span><Icon name="box" /></span><div><p>Published Products</p><strong>128</strong><small>Type A + Type B</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="chat" /></span><div><p>Open Enquiries</p><strong>14</strong><small>7 urgent today</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="cart" /></span><div><p>Confirmed Orders</p><strong>42</strong><small>Rs 3.8L this week</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="truck" /></span><div><p>Deliveries</p><strong>18</strong><small>5 in progress</small></div></div>
      </section>

      <section className="cafe-ops-grid two">
        <div className="cafe-card supplier-hero">
          <img src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=1400&q=80" alt="" />
          <div>
            <span>Supplier dashboard</span>
            <h2>Keep cafes supplied before they run out.</h2>
            <p>Update stock status, publish MRP, negotiate private deal prices, and confirm deliveries from one clean workspace.</p>
            <div><Link href="/supplier-stock">Update Stock</Link><Link href="/supplier-catalogue">Catalogue Builder</Link></div>
          </div>
        </div>
        <aside className="cafe-card cafe-ops-panel">
          <h2>Today&apos;s action list</h2>
          <p>High-priority supplier tasks generated from cafe demand and low-stock behaviour.</p>
          {alerts.map(([title, body]) => <div className="cafe-ops-mini" key={title}><Icon name="chart" size={15} /><span><b>{title}</b><small>{body}</small></span></div>)}
        </aside>
      </section>
    </main>
  )
}
