'use client'

import { useState } from 'react'

type IconName = 'search' | 'chat' | 'cart' | 'truck' | 'chart' | 'filter'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    chat: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></>,
    cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H7" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 4-4 3 3 5-7" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const ENQUIRIES = [
  { cafe: 'Brew Haven Indiranagar', item: 'Hazelnut Syrup 750ml', qty: '12 bottles', status: 'New', quote: 'Rs 875', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=120&q=80' },
  { cafe: 'Flat White Cafe', item: 'Frappe Base 1kg', qty: '8 kg', status: 'Counter', quote: 'Rs 920', img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=120&q=80' },
  { cafe: 'Brew & Co. Saket', item: 'Penne 500g', qty: '30 packs', status: 'Accepted', quote: 'Rs 165', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=120&q=80' },
]

export default function SupplierEnquiriesPage() {
  const [items, setItems] = useState(ENQUIRIES)
  function setStatus(index: number, status: string) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, status } : item))
  }

  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar">
        <div><h1>Enquiries & Quotes</h1><p>Receive cafe enquiries, send quotes, counter offers, accept or decline with the same supplier flow.</p></div>
        <label><Icon name="search" size={19} /><input placeholder="Search cafe, item, quote..." /></label>
        <button><Icon name="filter" /> Filter</button>
        <button><Icon name="chat" /> New Quote</button>
      </header>

      <section className="cafe-ops-stats">
        <div className="cafe-card cafe-ops-stat"><span><Icon name="chat" /></span><div><p>New Enquiries</p><strong>8</strong><small>Need response</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="cart" /></span><div><p>Counter Offers</p><strong>4</strong><small>Negotiation loop</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="truck" /></span><div><p>Accepted</p><strong>11</strong><small>Ready to fulfill</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="chart" /></span><div><p>Win Rate</p><strong>72%</strong><small>This week</small></div></div>
      </section>

      <section className="cafe-card cafe-ops-board">
        <div className="cafe-ops-tabs"><button className="active">All enquiries <span>{items.length}</span></button><button>New</button><button>Counter</button><button>Accepted</button></div>
        <div className="cafe-ops-toolbar"><label><Icon name="search" size={16} /><input placeholder="Search enquiry board..." /></label><button><Icon name="filter" size={15} /> Filter</button><button>Urgent first</button><div /></div>
        <div className="cafe-ops-list">
          {items.map((item, index) => <div className="cafe-ops-row" key={`${item.cafe}-${item.item}`}>
            <img src={item.img} alt="" />
            <div><h3>{item.cafe}</h3><p>{item.item} - {item.qty}</p><small>Quote: {item.quote} - encrypted one-time negotiation</small></div>
            <span className={`status ${item.status === 'Accepted' ? 'ok' : item.status === 'Counter' ? 'warn' : 'accent'}`}><span className="dot" />{item.status}</span>
            <div className="supplier-action-stack"><button onClick={() => setStatus(index, 'Quote Sent')}>Quote</button><button onClick={() => setStatus(index, 'Counter')}>Counter</button><button onClick={() => setStatus(index, 'Accepted')}>Accept</button><button onClick={() => setStatus(index, 'Declined')}>Decline</button></div>
          </div>)}
        </div>
      </section>
    </main>
  )
}
