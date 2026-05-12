'use client'

import Link from 'next/link'

type IconName = 'search' | 'plus' | 'box' | 'cart' | 'chat' | 'truck' | 'chart' | 'warn' | 'arrow'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    box: <><path d="M21 8 12 3 3 8l9 5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
    cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H7" /></>,
    chat: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 4-4 3 3 5-7" /></>,
    warn: <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.8 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const actions = [
  { title: 'Stock update recommended', body: 'Vanilla Syrup has 6 cafe reminders waiting.', tone: 'warn' },
  { title: 'Urgent enquiry', body: 'Brew Haven needs 12 bottles before evening prep.', tone: 'danger' },
  { title: 'Quote accepted', body: 'Flat White Cafe accepted revised frappe base pricing.', tone: 'ok' },
]

const products = [
  { name: 'Hazelnut Syrup 750ml', meta: 'Monin India - Syrups', value: 'Rs 850 MRP', img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=180&q=80' },
  { name: 'Arabica Beans 1kg', meta: 'Blue Tokai Roasters - Coffee', value: 'Rs 1,200 MRP', img: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=180&q=80' },
  { name: 'Fresh Cream 200ml', meta: 'Nandini Dairy - Dairy', value: 'Rs 55 MRP', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=180&q=80' },
]

export default function SupplierDashboardPage() {
  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar">
        <div><h1>Supplier Hub</h1><p>Manage catalogue, MRP, private cafe deals, stock status, enquiries, and delivery fulfilment.</p></div>
        <label><Icon name="search" size={19} /><input placeholder="Search product, cafe, order..." /></label>
        <Link href="/supplier-catalogue"><Icon name="plus" /> Add Product</Link>
        <Link href="/supplier-enquiries"><Icon name="chat" /> Enquiries</Link>
      </header>

      <section className="cafe-ops-stats">
        <div className="cafe-card cafe-ops-stat"><span><Icon name="box" /></span><div><p>Published Products</p><strong>128</strong><small>Type A + Type B</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="chat" /></span><div><p>Open Enquiries</p><strong>14</strong><small>7 urgent today</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="cart" /></span><div><p>Confirmed Orders</p><strong>42</strong><small>Rs 3.8L this week</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="truck" /></span><div><p>Deliveries</p><strong>18</strong><small>5 in progress</small></div></div>
      </section>

      <section className="cafe-ops-grid inventory">
        <div className="cafe-card cafe-ops-board">
          <div className="cafe-ops-toolbar">
            <label><Icon name="search" size={16} /><input placeholder="Search active supplier work..." /></label>
            <button>Today</button>
            <button>All cafes</button>
            <div />
            <Link className="cafe-ops-small-btn" href="/supplier-stock">Update Stock</Link>
          </div>
          <div className="cafe-ops-list">
            {products.map(item => (
              <div className="cafe-ops-row" key={item.name}>
                <img src={item.img} alt="" />
                <div><h3>{item.name}</h3><p>{item.meta}</p><small>MRP visible to all cafes - private deals stay encrypted.</small></div>
                <b>{item.value}</b>
                <Link href="/supplier-catalogue">Edit</Link>
              </div>
            ))}
          </div>
        </div>

        <aside className="cafe-card cafe-ops-panel">
          <div className="cafe-ops-panel-image"><img src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=900&q=85" alt="" /></div>
          <h2>Today&apos;s action list</h2>
          <p>High-priority supplier tasks based on cafe demand, low-stock behaviour, and accepted quotes.</p>
          {actions.map(item => <div className="cafe-ops-mini" key={item.title}><Icon name={item.tone === 'danger' ? 'warn' : 'chart'} size={15} /><span><b>{item.title}</b><small>{item.body}</small></span></div>)}
        </aside>
      </section>
    </main>
  )
}
