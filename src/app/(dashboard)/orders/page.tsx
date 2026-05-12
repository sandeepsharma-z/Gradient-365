'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

interface Order {
  id: number
  order_ref: string
  supplier_name: string
  supplier_account_id: string
  item_count: number
  total_amount: string
  status: string
  payment_status: string
  created_at: string
}

type IconName = 'search' | 'plus' | 'download' | 'filter' | 'sort' | 'bag' | 'truck' | 'receipt' | 'clock' | 'arrow' | 'calendar'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5M12 15V3" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
    sort: <><path d="M7 6h13M7 12h9M7 18h5" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>,
    bag: <><path d="M6 8h12l-1 12H7z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    receipt: <><path d="M6 2h12v20l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

const STATUS_MAP: Record<string, { cls: string; label: string }> = {
  pending: { cls: 'warn', label: 'Payment pending' },
  accepted: { cls: 'info', label: 'In transit' },
  partial: { cls: 'accent', label: 'Preparing' },
  rejected: { cls: 'danger', label: 'Cancelled' },
  delivered: { cls: 'ok', label: 'Delivered' },
  closed: { cls: 'neutral', label: 'Closed' },
  cancelled: { cls: 'danger', label: 'Cancelled' },
  dispatched: { cls: 'info', label: 'In transit' },
}

const TABS = [
  { value: 'all', label: 'All orders' },
  { value: 'accepted', label: 'In transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'pending', label: 'Payment pending' },
  { value: 'cancelled', label: 'Cancelled' },
]

const DEMO_ORDERS: Order[] = [
  { id: 1, order_ref: 'ORD-20415', supplier_name: 'Nandini Dairy Kitchen', supplier_account_id: 'SUP-01', item_count: 14, total_amount: '68400', status: 'accepted', payment_status: 'paid', created_at: new Date().toISOString() },
  { id: 2, order_ref: 'ORD-20412', supplier_name: 'Bloom Fresh Greens', supplier_account_id: 'SUP-02', item_count: 8, total_amount: '37240', status: 'pending', payment_status: 'unpaid', created_at: new Date(Date.now() - 1000 * 60 * 38).toISOString() },
  { id: 3, order_ref: 'ORD-20408', supplier_name: 'Blue Tokai Roasters', supplier_account_id: 'SUP-03', item_count: 4, total_amount: '52800', status: 'dispatched', payment_status: 'paid', created_at: new Date(Date.now() - 1000 * 60 * 84).toISOString() },
  { id: 4, order_ref: 'ORD-20403', supplier_name: 'Hearth & Stone Bakery', supplier_account_id: 'SUP-04', item_count: 22, total_amount: '42140', status: 'delivered', payment_status: 'paid', created_at: new Date(Date.now() - 1000 * 60 * 220).toISOString() },
  { id: 5, order_ref: 'ORD-20399', supplier_name: 'Malabar Fruit Co.', supplier_account_id: 'SUP-05', item_count: 11, total_amount: '63700', status: 'partial', payment_status: 'paid', created_at: new Date(Date.now() - 1000 * 60 * 430).toISOString() },
]

const SUPPLIER_IMAGES = [
  'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=120&q=80',
  'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&w=120&q=80',
]

function fmtAmount(v: string | number) {
  const n = typeof v === 'number' ? v : parseFloat(v)
  if (Number.isNaN(n)) return String(v)
  return 'Rs ' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

function fmtDate(d: string) {
  const dt = new Date(d)
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' + dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function getOutlet(name: string) {
  const outlets = ['Indiranagar', 'Koramangala', 'HSR Layout']
  return outlets[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % outlets.length]
}

function getDesc(ref: string) {
  const descs = ['Buffalo milk, A2 cow milk', 'Rocket, basil, cherry tomatoes', 'Cream, butter, curd', 'Attikan Estate beans', 'Eggs, paneer, yoghurt', 'Sourdough, brioche, croissants']
  return descs[ref.charCodeAt(ref.length - 1) % descs.length]
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { cls: 'neutral', label: status }
  return <span className={`status ${s.cls}`}><span className="dot" />{s.label}</span>
}

function OrdersContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const statusParam = searchParams.get('status') ?? 'all'
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [showNewOrder, setShowNewOrder] = useState(false)

  useEffect(() => {
    setLoading(true)
    const url = `/api/orders${statusParam !== 'all' ? '?status=' + statusParam : ''}`
    api.get<{ orders: Order[] }>(url)
      .then(data => setOrders(data.orders?.length ? data.orders : DEMO_ORDERS))
      .catch(() => setOrders(DEMO_ORDERS))
      .finally(() => setLoading(false))
  }, [statusParam])

  const filteredOrders = orders
  const delivered = orders.filter(o => o.status === 'delivered').length
  const inTransit = orders.filter(o => ['accepted', 'dispatched'].includes(o.status)).length
  const payPending = orders.filter(o => o.status === 'pending').length
  const totalSpend = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || '0'), 0)
  const avgOrder = orders.length ? totalSpend / orders.length : 0

  const stats = useMemo(() => [
    { icon: 'bag' as IconName, label: 'Total Orders', value: loading ? '-' : orders.length.toLocaleString('en-IN'), note: `${fmtAmount(totalSpend)} value` },
    { icon: 'truck' as IconName, label: 'In Transit', value: loading ? '-' : inTransit.toLocaleString('en-IN'), note: 'Arriving today' },
    { icon: 'receipt' as IconName, label: 'Pending Payment', value: loading ? '-' : payPending.toLocaleString('en-IN'), note: payPending ? `${fmtAmount(payPending * avgOrder)} due` : 'All clear' },
    { icon: 'clock' as IconName, label: 'On-time Rate', value: '96.4%', note: 'Last 30 days' },
  ], [avgOrder, inTransit, loading, orders.length, payPending, totalSpend])

  function tabCount(value: string) {
    if (value === 'all') return orders.length
    if (value === 'accepted') return inTransit
    return orders.filter(order => order.status === value).length
  }

  function toggleSelect(id: number) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function createQuickOrder() {
    const id = Date.now()
    const nextOrder: Order = {
      id,
      order_ref: `ORD-${String(id).slice(-5)}`,
      supplier_name: 'Blue Tokai Roasters',
      supplier_account_id: 'SUP-03',
      item_count: 6,
      total_amount: '24680',
      status: 'pending',
      payment_status: 'unpaid',
      created_at: new Date().toISOString(),
    }
    setOrders(prev => [nextOrder, ...prev])
    setShowNewOrder(false)
  }

  return (
    <main className="cafe-orders-page">
      <header className="cafe-orders-topbar">
        <div>
          <h1>Orders</h1>
          <p>Track supplier orders, payments, delivery status, and outlet movement.</p>
        </div>
        <label className="cafe-orders-search">
          <Icon name="search" size={19} />
          <input placeholder="Search order, supplier, SKU..." />
        </label>
        <button className="cafe-orders-icon-btn" aria-label="Export"><Icon name="download" /></button>
        <button className="cafe-orders-primary" onClick={() => setShowNewOrder(true)}><Icon name="plus" /> New Order</button>
      </header>

      <section className="cafe-orders-hero">
        <div>
          <span>Orders - Last 7 days</span>
          <h2>Every order, every outlet, one clean ledger.</h2>
          <p>
            Managing <b>{loading ? '-' : orders.length}</b> orders worth <b>{fmtAmount(totalSpend)}</b> across 3 outlets.
            <b> {inTransit}</b> in transit and <b>{payPending}</b> awaiting payment.
          </p>
        </div>
        <div className="cafe-orders-hero-card">
          <Icon name="calendar" size={24} />
          <strong>Updated just now</strong>
          <small>Bengaluru - 3 outlets synced</small>
        </div>
      </section>

      <section className="cafe-orders-stats">
        {stats.map(stat => (
          <div className="cafe-card cafe-orders-stat" key={stat.label}>
            <span><Icon name={stat.icon} size={23} /></span>
            <div><p>{stat.label}</p><strong>{stat.value}</strong><small>{stat.note}</small></div>
          </div>
        ))}
      </section>

      <section className="cafe-card cafe-orders-board">
        <div className="cafe-orders-tabs">
          {TABS.map(tab => (
            <button
              key={tab.value}
              className={statusParam === tab.value ? 'active' : ''}
              onClick={() => router.push(tab.value === 'all' ? '/orders' : `/orders?status=${tab.value}`)}
            >
              {tab.label}
              {!loading && <span>{tabCount(tab.value)}</span>}
            </button>
          ))}
        </div>

        <div className="cafe-orders-toolbar">
          <label>
            <Icon name="search" size={16} />
            <input placeholder="Search ID, supplier, SKU..." />
          </label>
          <button><Icon name="filter" size={15} /> Filter</button>
          <button><Icon name="sort" size={15} /> Sort: Newest</button>
          <button>All outlets</button>
          <div />
          <button><Icon name="download" size={15} /> Export</button>
        </div>

        <div className="cafe-orders-table-wrap">
          <table className="cafe-orders-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Order</th>
                <th>Supplier</th>
                <th>Description</th>
                <th>Items</th>
                <th>Outlet</th>
                <th>Status</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 9 }).map((__, cell) => <td key={cell}><span className="cafe-orders-skeleton" /></td>)}
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={9} className="cafe-orders-empty">No orders found.</td></tr>
              ) : filteredOrders.map((order, index) => (
                <tr key={order.id} className={selected.has(order.id) ? 'selected' : ''}>
                  <td>
                    <button className={`cafe-orders-check${selected.has(order.id) ? ' checked' : ''}`} onClick={() => toggleSelect(order.id)} aria-label="Select order">
                      {selected.has(order.id) && '✓'}
                    </button>
                  </td>
                  <td><Link href={`/orders/${order.id}`} className="cafe-orders-ref">{order.order_ref}</Link></td>
                  <td>
                    <div className="cafe-orders-supplier">
                      <img src={SUPPLIER_IMAGES[index % SUPPLIER_IMAGES.length]} alt="" />
                      <strong>{order.supplier_name}</strong>
                    </div>
                  </td>
                  <td>{getDesc(order.order_ref)}</td>
                  <td>{order.item_count}</td>
                  <td>{getOutlet(order.supplier_name)}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>{fmtDate(order.created_at)}</td>
                  <td><b>{fmtAmount(order.total_amount)}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredOrders.length > 0 && (
          <footer className="cafe-orders-footer">
            <span>Showing <b>{filteredOrders.length}</b> orders</span>
            <div><button>Previous</button><button>Next</button></div>
          </footer>
        )}
      </section>

      {selected.size > 0 && (
        <div className="cafe-orders-bulk">
          <strong>{selected.size} selected</strong>
          <button>Export selected</button>
          <button onClick={() => setSelected(new Set())}>Clear</button>
        </div>
      )}

      {showNewOrder && (
        <div className="cafe-orders-modal-backdrop" onClick={() => setShowNewOrder(false)}>
          <div className="cafe-orders-modal" onClick={event => event.stopPropagation()}>
            <div className="cafe-orders-modal-head">
              <div>
                <span>Quick order</span>
                <h2>Create New Order</h2>
              </div>
              <button onClick={() => setShowNewOrder(false)}>×</button>
            </div>

            <div className="cafe-orders-form-grid">
              <label>
                Supplier
                <select defaultValue="Blue Tokai Roasters">
                  <option>Blue Tokai Roasters</option>
                  <option>Nandini Dairy Kitchen</option>
                  <option>Bloom Fresh Greens</option>
                  <option>Hearth & Stone Bakery</option>
                </select>
              </label>
              <label>
                Outlet
                <select defaultValue="Indiranagar">
                  <option>Indiranagar</option>
                  <option>Koramangala</option>
                  <option>HSR Layout</option>
                </select>
              </label>
              <label>
                Items
                <input defaultValue="6" />
              </label>
              <label>
                Amount
                <input defaultValue="Rs 24,680" />
              </label>
              <label className="wide">
                Order notes
                <textarea defaultValue="Arabica beans, cold brew bottles, and paper cups for morning stock." />
              </label>
            </div>

            <div className="cafe-orders-modal-actions">
              <Link href="/urgent-search">Need urgent supplier?</Link>
              <div>
                <button onClick={() => setShowNewOrder(false)}>Cancel</button>
                <button onClick={createQuickOrder}>Create Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="cafe-orders-page">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  )
}
