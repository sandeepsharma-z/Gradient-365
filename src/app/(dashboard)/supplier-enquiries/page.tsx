'use client'

import { useState } from 'react'

const ENQUIRIES = [
  { cafe: 'Brew Haven Indiranagar', item: 'Hazelnut Syrup 750ml', qty: '12 bottles', status: 'New', quote: 'Rs 875' },
  { cafe: 'Flat White Cafe', item: 'Frappe Base 1kg', qty: '8 kg', status: 'Counter', quote: 'Rs 920' },
  { cafe: 'Brew & Co. Saket', item: 'Penne 500g', qty: '30 packs', status: 'Accepted', quote: 'Rs 165' },
]

export default function SupplierEnquiriesPage() {
  const [items, setItems] = useState(ENQUIRIES)
  function setStatus(index: number, status: string) {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, status } : item))
  }
  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar"><div><h1>Enquiries & Quotes</h1><p>Receive encrypted cafe enquiries, send quotes, counter offers, accept or decline.</p></div></header>
      <section className="supplier-enquiry-grid">
        {items.map((item, index) => <article className="cafe-card supplier-enquiry-card" key={`${item.cafe}-${item.item}`}>
          <span>{item.status}</span><h2>{item.cafe}</h2><p>{item.item} · {item.qty}</p><b>{item.quote}</b>
          <div><button onClick={() => setStatus(index, 'Quote Sent')}>Send Quote</button><button onClick={() => setStatus(index, 'Counter')}>Counter</button><button onClick={() => setStatus(index, 'Accepted')}>Accept</button><button onClick={() => setStatus(index, 'Declined')}>Decline</button></div>
        </article>)}
      </section>
    </main>
  )
}
