'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

interface Supplier {
  account_id: string
  business_name: string
  location: string
  contact_person: string
  product_categories: string[]
  total_orders?: number
  total_spend?: number
}

type IconName = 'search' | 'plus' | 'users' | 'star' | 'bag' | 'clock' | 'filter' | 'phone' | 'arrow'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    star: <><path d="m12 2 3 6.5 7 .8-5.2 4.7 1.4 7-6.2-3.6L5.8 21l1.4-7L2 9.3l7-.8z" /></>,
    bag: <><path d="M6 8h12l-1 12H7z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.65 2.6a2 2 0 0 1-.45 2.11L8 9.7a16 16 0 0 0 6.3 6.3l1.27-1.26a2 2 0 0 1 2.11-.45c.83.32 1.7.53 2.6.65A2 2 0 0 1 22 16.92z" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  }

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const DEMO_CUSTOMERS = [
  { name: 'Nandini Dairy Kitchen', type: 'Daily partner', contact: 'Ravi Kumar', location: 'Indiranagar', orders: 128, spend: 'Rs 12.4L', rating: 4.9, tags: ['Dairy', 'Cold chain'], status: 'Active', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=180&q=80' },
  { name: 'Blue Tokai Roasters', type: 'Coffee supplier', contact: 'Neha Sharma', location: 'Koramangala', orders: 74, spend: 'Rs 8.6L', rating: 4.8, tags: ['Coffee', 'Weekly'], status: 'Active', img: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=180&q=80' },
  { name: 'Hearth & Stone Bakery', type: 'Bakery partner', contact: 'Rohan Das', location: 'HSR Layout', orders: 62, spend: 'Rs 4.2L', rating: 4.7, tags: ['Bakery', 'Daily'], status: 'Active', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=180&q=80' },
  { name: 'Bloom Fresh Greens', type: 'Produce vendor', contact: 'Aditi Rao', location: 'Bengaluru', orders: 43, spend: 'Rs 3.1L', rating: 4.6, tags: ['Produce', 'Organic'], status: 'Review', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=180&q=80' },
  { name: 'Paperwala Packaging', type: 'Packaging', contact: 'Karan Singh', location: 'Whitefield', orders: 31, spend: 'Rs 2.8L', rating: 4.5, tags: ['Cups', 'Napkins'], status: 'Active', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=180&q=80' },
  { name: 'Sweet Crumb Studio', type: 'Dessert partner', contact: 'Priya Yadav', location: 'Jayanagar', orders: 27, spend: 'Rs 2.2L', rating: 4.7, tags: ['Desserts', 'Custom'], status: 'Active', img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=180&q=80' },
]

function Stars({ rating }: { rating: number }) {
  return <span className="cafe-customer-stars">★ {rating.toFixed(1)}</span>
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  useEffect(() => {
    api.get<{ suppliers: Supplier[] }>('/api/suppliers')
      .then(data => setSuppliers(data.suppliers ?? []))
      .catch(() => setSuppliers([]))
      .finally(() => setLoading(false))
  }, [])

  const customers = useMemo(() => {
    if (!suppliers.length) return DEMO_CUSTOMERS
    return suppliers.map((supplier, index) => ({
      name: supplier.business_name,
      type: supplier.product_categories?.[0] || 'Supplier',
      contact: supplier.contact_person || 'Manager',
      location: supplier.location || 'Bengaluru',
      orders: supplier.total_orders ?? 20 + index * 7,
      spend: supplier.total_spend ? `Rs ${supplier.total_spend.toLocaleString('en-IN')}` : DEMO_CUSTOMERS[index % DEMO_CUSTOMERS.length].spend,
      rating: 4.5 + (index % 5) / 10,
      tags: supplier.product_categories?.slice(0, 2) || ['Cafe', 'Partner'],
      status: 'Active',
      img: DEMO_CUSTOMERS[index % DEMO_CUSTOMERS.length].img,
    }))
  }, [suppliers])

  const filtered = customers.filter(customer => {
    const matchesFilter = activeFilter === 'All' || customer.status === activeFilter || customer.tags.includes(activeFilter)
    const matchesQuery = !query || `${customer.name} ${customer.type} ${customer.contact} ${customer.location}`.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQuery
  })

  const filters = ['All', 'Active', 'Review', 'Dairy', 'Coffee', 'Bakery', 'Produce']

  return (
    <main className="cafe-customers-page">
      <header className="cafe-customers-topbar">
        <div>
          <h1>Customers</h1>
          <p>Manage cafe partners, supplier contacts, order history, and performance.</p>
        </div>
        <label>
          <Icon name="search" size={19} />
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search customer, contact, location..." />
        </label>
        <button><Icon name="filter" size={18} /></button>
        <button><Icon name="plus" /> Add Customer</button>
      </header>

      <section className="cafe-customers-stats">
        <div className="cafe-card cafe-customers-stat"><span><Icon name="users" /></span><div><p>Total Customers</p><strong>{loading ? '-' : customers.length}</strong><small>Active network</small></div></div>
        <div className="cafe-card cafe-customers-stat"><span><Icon name="bag" /></span><div><p>Total Orders</p><strong>{customers.reduce((sum, c) => sum + c.orders, 0)}</strong><small>Across partners</small></div></div>
        <div className="cafe-card cafe-customers-stat"><span><Icon name="star" /></span><div><p>Avg Rating</p><strong>4.7</strong><small>Service quality</small></div></div>
        <div className="cafe-card cafe-customers-stat"><span><Icon name="clock" /></span><div><p>Response</p><strong>18m</strong><small>Average reply</small></div></div>
      </section>

      <section className="cafe-card cafe-customers-board">
        <div className="cafe-customers-tabs">
          {filters.map(filter => (
            <button key={filter} className={activeFilter === filter ? 'active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>
          ))}
        </div>

        <div className="cafe-customers-toolbar">
          <label><Icon name="search" size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, category, region..." /></label>
          <button><Icon name="filter" size={15} /> Filter</button>
          <button>Sort: Recent</button>
          <div />
          <span>{filtered.length} customers</span>
        </div>

        <div className="cafe-customers-grid">
          {filtered.map(customer => (
            <article className="cafe-customer-card" key={customer.name}>
              <div className="cafe-customer-head">
                <img src={customer.img} alt="" />
                <div>
                  <h3>{customer.name}</h3>
                  <p>{customer.type}</p>
                </div>
                <span className={customer.status === 'Review' ? 'review' : ''}>{customer.status}</span>
              </div>

              <div className="cafe-customer-contact">
                <strong>{customer.contact}</strong>
                <span>{customer.location}</span>
              </div>

              <div className="cafe-customer-tags">
                {customer.tags.map(tag => <span key={tag}>{tag}</span>)}
              </div>

              <div className="cafe-customer-metrics">
                <div><small>Orders</small><b>{customer.orders}</b></div>
                <div><small>Spend</small><b>{customer.spend}</b></div>
                <div><small>Rating</small><b><Stars rating={customer.rating} /></b></div>
              </div>

              <div className="cafe-customer-actions">
                <button><Icon name="phone" size={14} /> Contact</button>
                <Link href={`/suppliers/${encodeURIComponent(customer.name)}`}>View <Icon name="arrow" size={14} /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
