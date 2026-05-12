'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

interface PreOrder {
  id: number
  supplier_name: string
  supplier_account_id: string
  item_name: string
  catalogue_item_id: number
  quantity: number
  unit: string
  frequency: 'one_time' | 'weekly' | 'monthly'
  scheduled_date: string
  recurrence_day: string | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'fulfilled'
  notes: string | null
  created_at: string
}

interface CatalogueItem {
  id: number
  item_name: string
  unit: string
  supplier_account_id: string
  supplier_name: string
}

type IconName = 'search' | 'plus' | 'calendar' | 'clock' | 'repeat' | 'truck' | 'filter' | 'check' | 'x'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    repeat: <><path d="M17 2l4 4-4 4" /><path d="M3 11V9a3 3 0 0 1 3-3h15" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v2a3 3 0 0 1-3 3H3" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
    check: <><path d="M20 6 9 17l-5-5" /></>,
    x: <><path d="M18 6 6 18M6 6l12 12" /></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'fulfilled', label: 'Fulfilled' },
  { value: 'cancelled', label: 'Cancelled' },
]

const DEMO_PREORDERS: PreOrder[] = [
  { id: 1, supplier_name: 'Nandini Dairy Kitchen', supplier_account_id: 'SUP-01', item_name: 'Whole Milk', catalogue_item_id: 102, quantity: 30, unit: 'litre', frequency: 'weekly', scheduled_date: new Date(Date.now() + 86400000).toISOString(), recurrence_day: 'monday', status: 'confirmed', notes: 'Morning delivery before 8 AM', created_at: new Date().toISOString() },
  { id: 2, supplier_name: 'Blue Tokai Roasters', supplier_account_id: 'SUP-02', item_name: 'Arabica Beans', catalogue_item_id: 101, quantity: 8, unit: 'kg', frequency: 'monthly', scheduled_date: new Date(Date.now() + 86400000 * 4).toISOString(), recurrence_day: null, status: 'pending', notes: null, created_at: new Date().toISOString() },
  { id: 3, supplier_name: 'Hearth & Stone Bakery', supplier_account_id: 'SUP-03', item_name: 'Butter Croissant', catalogue_item_id: 103, quantity: 48, unit: 'piece', frequency: 'weekly', scheduled_date: new Date(Date.now() + 86400000 * 2).toISOString(), recurrence_day: 'friday', status: 'fulfilled', notes: 'Pack in two trays', created_at: new Date().toISOString() },
]

function StatusBadge({ status }: { status: string }) {
  const cls = status === 'confirmed' || status === 'fulfilled' ? 'ok' : status === 'pending' ? 'warn' : status === 'cancelled' ? 'danger' : 'neutral'
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  return <span className={`status ${cls}`}><span className="dot" />{label}</span>
}

function FreqBadge({ freq }: { freq: string }) {
  const label = freq === 'one_time' ? 'One-time' : freq.charAt(0).toUpperCase() + freq.slice(1)
  return <span className="cafe-res-freq"><Icon name="repeat" size={13} />{label}</span>
}

function fmtDate(date: string) {
  const dt = new Date(date)
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface CreateModalProps {
  onClose: () => void
  onCreated: (msg: string) => void
}

function CreateModal({ onClose, onCreated }: CreateModalProps) {
  const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([])
  const [loadingCatalogue, setLoadingCatalogue] = useState(true)
  const [selectedSupplierId, setSelectedSupplierId] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [frequency, setFrequency] = useState<'one_time' | 'weekly' | 'monthly'>('one_time')
  const [scheduledDate, setScheduledDate] = useState('')
  const [recurrenceDay, setRecurrenceDay] = useState('monday')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    api.get<{ items?: CatalogueItem[]; catalogue?: CatalogueItem[] }>('/api/catalogue/browse')
      .then(data => setCatalogueItems(data.items ?? data.catalogue ?? []))
      .catch(() => setCatalogueItems([]))
      .finally(() => setLoadingCatalogue(false))
  }, [])

  const suppliers = Array.from(new Map(catalogueItems.map(i => [i.supplier_account_id, { id: i.supplier_account_id, name: i.supplier_name }])).values())
  const supplierItems = selectedSupplierId ? catalogueItems.filter(i => i.supplier_account_id === selectedSupplierId) : []

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError('')
    if (!selectedSupplierId) return setFormError('Please select a supplier.')
    if (!selectedItemId) return setFormError('Please select an item.')
    if (!scheduledDate) return setFormError('Please pick a scheduled date.')
    if (!quantity || Number(quantity) < 1) return setFormError('Quantity must be at least 1.')

    setSubmitting(true)
    try {
      await api.post('/api/cafe/preorders', {
        supplier_account_id: selectedSupplierId,
        catalogue_item_id: Number(selectedItemId),
        quantity: Number(quantity),
        frequency,
        scheduled_date: scheduledDate,
        ...(frequency === 'weekly' ? { recurrence_day: recurrenceDay } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      })
      onCreated('Reservation scheduled!')
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create reservation.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="cafe-res-modal-backdrop" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
      <form className="cafe-res-modal" onSubmit={handleSubmit}>
        <div className="cafe-res-modal-head">
          <div><span>Reservation setup</span><h2>Schedule Reservation</h2></div>
          <button type="button" onClick={onClose}><Icon name="x" size={18} /></button>
        </div>

        <div className="cafe-res-form-grid">
          <label>Supplier
            <select value={selectedSupplierId} onChange={event => { setSelectedSupplierId(event.target.value); setSelectedItemId('') }} disabled={loadingCatalogue}>
              <option value="">{loadingCatalogue ? 'Loading...' : 'Select supplier'}</option>
              {suppliers.map(supplier => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
            </select>
          </label>
          <label>Item
            <select value={selectedItemId} onChange={event => setSelectedItemId(event.target.value)} disabled={!selectedSupplierId}>
              <option value="">{selectedSupplierId ? 'Select item' : 'Select supplier first'}</option>
              {supplierItems.map(item => <option key={item.id} value={String(item.id)}>{item.item_name} ({item.unit})</option>)}
            </select>
          </label>
          <label>Quantity<input type="number" min="1" value={quantity} onChange={event => setQuantity(event.target.value)} /></label>
          <label>Frequency
            <select value={frequency} onChange={event => setFrequency(event.target.value as 'one_time' | 'weekly' | 'monthly')}>
              <option value="one_time">One-time</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          {frequency === 'weekly' && (
            <label>Recurrence Day
              <select value={recurrenceDay} onChange={event => setRecurrenceDay(event.target.value)}>
                {DAYS.map(day => <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>)}
              </select>
            </label>
          )}
          <label>Scheduled Date<input type="date" value={scheduledDate} onChange={event => setScheduledDate(event.target.value)} /></label>
          <label className="wide">Notes<textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder="Special instructions..." /></label>
        </div>

        {formError && <div className="cafe-res-error">{formError}</div>}

        <div className="cafe-res-modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={submitting}>{submitting ? 'Scheduling...' : 'Schedule'}</button>
        </div>
      </form>
    </div>
  )
}

function PreOrdersContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const statusParam = searchParams.get('status') ?? 'all'
  const [preorders, setPreorders] = useState<PreOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [flashMessage, setFlashMessage] = useState('')
  const [cancelling, setCancelling] = useState<number | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const url = `/api/cafe/preorders${statusParam !== 'all' ? '?status=' + statusParam : ''}`
    api.get<{ preorders?: PreOrder[] } | PreOrder[]>(url)
      .then(data => {
        const rows = Array.isArray(data) ? data : data.preorders ?? []
        setPreorders(rows.length ? rows : DEMO_PREORDERS)
      })
      .catch(() => setPreorders(DEMO_PREORDERS))
      .finally(() => setLoading(false))
  }, [statusParam])

  useEffect(() => { load() }, [load])

  async function handleCancel(id: number) {
    setCancelling(id)
    try {
      await api.patch(`/api/cafe/preorders/${id}`, { status: 'cancelled' })
      load()
    } catch {
      alert('Failed to cancel reservation.')
    } finally {
      setCancelling(null)
    }
  }

  function handleCreated(message: string) {
    setShowModal(false)
    setFlashMessage(message)
    load()
    setTimeout(() => setFlashMessage(''), 3500)
  }

  const stats = useMemo(() => {
    const confirmed = preorders.filter(item => item.status === 'confirmed').length
    const recurring = preorders.filter(item => item.frequency !== 'one_time').length
    const pending = preorders.filter(item => item.status === 'pending').length
    return [
      { icon: 'calendar' as IconName, label: 'Reservations', value: preorders.length, note: 'Total scheduled' },
      { icon: 'check' as IconName, label: 'Confirmed', value: confirmed, note: 'Ready for delivery' },
      { icon: 'repeat' as IconName, label: 'Recurring', value: recurring, note: 'Weekly or monthly' },
      { icon: 'clock' as IconName, label: 'Pending', value: pending, note: 'Needs confirmation' },
    ]
  }, [preorders])

  function countFor(status: string) {
    if (status === 'all') return preorders.length
    return preorders.filter(item => item.status === status).length
  }

  return (
    <main className="cafe-res-page">
      <header className="cafe-res-topbar">
        <div><h1>Reservations</h1><p>Schedule future supplier deliveries and recurring cafe stock runs.</p></div>
        <label><Icon name="search" size={19} /><input placeholder="Search reservation, supplier, item..." /></label>
        <button><Icon name="filter" size={18} /></button>
        <button onClick={() => setShowModal(true)}><Icon name="plus" /> Schedule</button>
      </header>

      <section className="cafe-res-stats">
        {stats.map(stat => (
          <div className="cafe-card cafe-res-stat" key={stat.label}>
            <span><Icon name={stat.icon} size={23} /></span>
            <div><p>{stat.label}</p><strong>{loading ? '-' : stat.value}</strong><small>{stat.note}</small></div>
          </div>
        ))}
      </section>

      {flashMessage && <div className="cafe-res-flash">{flashMessage}</div>}

      <section className="cafe-card cafe-res-board">
        <div className="cafe-res-tabs">
          {STATUS_TABS.map(tab => (
            <button key={tab.value} className={statusParam === tab.value ? 'active' : ''} onClick={() => router.push(tab.value === 'all' ? '/preorders' : `/preorders?status=${tab.value}`)}>
              {tab.label}<span>{!loading ? countFor(tab.value) : '-'}</span>
            </button>
          ))}
        </div>

        <div className="cafe-res-list">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => <div className="cafe-res-skeleton" key={index} />)
          ) : preorders.length === 0 ? (
            <div className="cafe-res-empty"><Icon name="calendar" size={36} /><strong>No reservations yet</strong><p>Schedule your first recurring delivery.</p><button onClick={() => setShowModal(true)}>Schedule Reservation</button></div>
          ) : preorders.map(item => (
            <article className="cafe-res-card" key={item.id}>
              <div className="cafe-res-date">
                <small>{new Date(item.scheduled_date).toLocaleDateString('en-IN', { month: 'short' })}</small>
                <strong>{new Date(item.scheduled_date).toLocaleDateString('en-IN', { day: '2-digit' })}</strong>
              </div>
              <div className="cafe-res-info">
                <div><h3>{item.item_name}</h3><p>{item.supplier_name} - {item.quantity} {item.unit}</p></div>
                <div className="cafe-res-badges"><FreqBadge freq={item.frequency} /><StatusBadge status={item.status} /></div>
                <div className="cafe-res-meta">
                  <span><Icon name="calendar" size={14} /> {fmtDate(item.scheduled_date)}</span>
                  {item.recurrence_day && <span><Icon name="repeat" size={14} /> Every {item.recurrence_day}</span>}
                  {item.notes && <span>{item.notes}</span>}
                </div>
              </div>
              <div className="cafe-res-actions">
                {(item.status === 'pending' || item.status === 'confirmed') && (
                  <button onClick={() => handleCancel(item.id)} disabled={cancelling === item.id}>{cancelling === item.id ? 'Cancelling...' : 'Cancel'}</button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {showModal && <CreateModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
    </main>
  )
}

export default function PreOrdersPage() {
  return (
    <Suspense fallback={<div className="cafe-res-page">Loading reservations...</div>}>
      <PreOrdersContent />
    </Suspense>
  )
}
