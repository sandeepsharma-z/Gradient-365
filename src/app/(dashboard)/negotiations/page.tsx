'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

interface Negotiation {
  id: number
  order_ref: string
  supplier_name: string
  status: string
  created_at: string
  last_offer: string
}

type IconName = 'search' | 'plus' | 'megaphone' | 'chart' | 'tag' | 'check' | 'filter' | 'calendar'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    megaphone: <><path d="m3 11 18-5v12L3 13z" /><path d="M11 14v5a2 2 0 0 1-4 0v-6" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 4-4 3 3 5-7" /></>,
    tag: <><path d="M20 12 12 20 4 12V4h8z" /><circle cx="9" cy="9" r="1" /></>,
    check: <><path d="M20 6 9 17l-5-5" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const TABS = [
  { value: 'all', label: 'All Campaigns' },
  { value: 'pending', label: 'Pending' },
  { value: 'counter_pending', label: 'Offers' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
]

const DEMO_NEGOTIATIONS: Negotiation[] = [
  { id: 1, order_ref: 'MKT-FLAT20', supplier_name: 'Flat White Weekend Push', status: 'accepted', created_at: new Date().toISOString(), last_offer: '18400' },
  { id: 2, order_ref: 'MKT-BRUNCH10', supplier_name: 'Brunch Combo Social Ads', status: 'counter_pending', created_at: new Date().toISOString(), last_offer: '12600' },
  { id: 3, order_ref: 'MKT-LOYALTY', supplier_name: 'Loyalty Rewards Campaign', status: 'pending', created_at: new Date().toISOString(), last_offer: '8200' },
  { id: 4, order_ref: 'MKT-COLD5', supplier_name: 'Cold Brew Delivery Promo', status: 'accepted', created_at: new Date().toISOString(), last_offer: '9600' },
]

function fmtAmount(value: string) {
  const n = parseFloat(value)
  return Number.isNaN(n) ? value : 'Rs ' + n.toLocaleString('en-IN')
}

function statusClass(status: string) {
  if (status === 'accepted' || status === 'counter_accepted') return 'ok'
  if (status === 'pending' || status === 'counter_pending') return 'warn'
  if (status === 'rejected') return 'danger'
  return 'neutral'
}

function label(status: string) {
  if (status === 'counter_pending') return 'Offer Live'
  if (status === 'accepted') return 'Approved'
  if (status === 'pending') return 'Pending'
  if (status === 'rejected') return 'Rejected'
  return status
}

function NegotiationsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusParam = searchParams.get('status') ?? 'all'
  const [items, setItems] = useState<Negotiation[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewCampaign, setShowNewCampaign] = useState(false)
  const [period, setPeriod] = useState('This Week')
  const [campaign, setCampaign] = useState({ name: '', code: '', budget: '' })

  useEffect(() => {
    setLoading(true)
    api.get<{ negotiations: Negotiation[] }>('/api/negotiations')
      .then(data => setItems(data.negotiations?.length ? data.negotiations : DEMO_NEGOTIATIONS))
      .catch(() => setItems(DEMO_NEGOTIATIONS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = statusParam === 'all' ? items : items.filter(n => n.status === statusParam)
  const accepted = items.filter(n => n.status === 'accepted' || n.status === 'counter_accepted').length
  const pending = items.filter(n => n.status === 'pending' || n.status === 'counter_pending').length
  const budget = items.reduce((sum, item) => sum + parseFloat(item.last_offer || '0'), 0)
  const stats = useMemo(() => [
    { icon: 'megaphone' as IconName, label: 'Campaigns', value: items.length || '-', sub: 'Active workspace' },
    { icon: 'check' as IconName, label: 'Approved', value: accepted, sub: 'Ready to run' },
    { icon: 'tag' as IconName, label: 'Pending Offers', value: pending, sub: 'Needs decision' },
    { icon: 'chart' as IconName, label: 'Budget', value: fmtAmount(String(budget)), sub: 'Tracked spend' },
  ], [accepted, budget, items.length, pending])

  function createCampaign() {
    const name = campaign.name.trim()
    if (!name) return
    setItems(prev => [{
      id: Date.now(),
      order_ref: campaign.code.trim() || `MKT-${String(Date.now()).slice(-4)}`,
      supplier_name: name,
      status: 'pending',
      created_at: new Date().toISOString(),
      last_offer: campaign.budget.trim().replace(/[^0-9.]/g, '') || '5000',
    }, ...prev])
    setCampaign({ name: '', code: '', budget: '' })
    setShowNewCampaign(false)
  }

  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar">
        <div><h1>Marketing</h1><p>Plan cafe offers, supplier promos, campaign budgets, and social pushes.</p></div>
        <label><Icon name="search" size={19} /><input placeholder="Search campaign, promo, supplier..." /></label>
        <button onClick={() => setPeriod(period === 'This Week' ? 'This Month' : 'This Week')}><Icon name="calendar" /> {period}</button>
        <button onClick={() => setShowNewCampaign(true)}><Icon name="plus" /> New Campaign</button>
      </header>

      <section className="cafe-ops-stats">
        {stats.map(stat => <div className="cafe-card cafe-ops-stat" key={stat.label}><span><Icon name={stat.icon} /></span><div><p>{stat.label}</p><strong>{stat.value}</strong><small>{stat.sub}</small></div></div>)}
      </section>

      <section className="cafe-ops-grid two">
        <div className="cafe-card cafe-ops-board">
          <div className="cafe-ops-tabs">
            {TABS.map(tab => <button key={tab.value} className={statusParam === tab.value ? 'active' : ''} onClick={() => router.push(tab.value === 'all' ? '/negotiations' : `/negotiations?status=${tab.value}`)}>{tab.label}<span>{tab.value === 'all' ? items.length : items.filter(n => n.status === tab.value).length}</span></button>)}
          </div>
          <div className="cafe-ops-toolbar"><label><Icon name="search" size={16} /><input placeholder="Search marketing item..." /></label><button><Icon name="filter" size={15} /> Filter</button><div /></div>
          <div className="cafe-ops-card-grid">
            {loading ? <div className="cafe-ops-empty">Loading marketing...</div> : filtered.map((item, index) => (
              <article className="cafe-ops-campaign" key={item.id} onClick={() => router.push(`/negotiations/${item.id}`)}>
                <img src={[
                  '/images/cafe-campaign-1.jpg',
                  '/images/cafe-campaign-2.jpg',
                  '/images/cafe-campaign-3.jpg',
                ][index % 3]} alt="" />
                <div>
                  <span className={`status ${statusClass(item.status)}`}><span className="dot" />{label(item.status)}</span>
                  <h3>{item.supplier_name}</h3>
                  <p>{item.order_ref} - Budget {fmtAmount(item.last_offer)}</p>
                  <small>{new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</small>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="cafe-card cafe-ops-panel">
          <div className="cafe-ops-panel-image"><img src="/images/cafe-marketing.jpg" alt="" /></div>
          <h2>Best next push</h2>
          <p>Flat White weekend special is performing strongest. Keep offer copy short, highlight 20% off, and target delivery customers from 4 PM to 8 PM.</p>
          {['Instagram story creative', 'Zomato banner slot', 'Loyalty SMS blast'].map(item => <div className="cafe-ops-mini" key={item}><Icon name="megaphone" size={15} /><span>{item}</span></div>)}
        </aside>
      </section>

      {showNewCampaign && (
        <div className="cafe-ops-modal-backdrop" onClick={() => setShowNewCampaign(false)}>
          <div className="cafe-ops-modal" onClick={event => event.stopPropagation()}>
            <div className="cafe-ops-modal-head"><div><span>Marketing setup</span><h2>New Campaign</h2></div><button onClick={() => setShowNewCampaign(false)}>×</button></div>
            <div className="cafe-ops-form-grid">
              <label>Campaign name<input value={campaign.name} onChange={event => setCampaign(prev => ({ ...prev, name: event.target.value }))} placeholder="Flat White Weekend Push" /></label>
              <label>Campaign code<input value={campaign.code} onChange={event => setCampaign(prev => ({ ...prev, code: event.target.value }))} placeholder="MKT-FLAT20" /></label>
              <label className="wide">Budget<input value={campaign.budget} onChange={event => setCampaign(prev => ({ ...prev, budget: event.target.value }))} placeholder="Rs 18,400" /></label>
            </div>
            <div className="cafe-ops-modal-actions"><button onClick={() => setShowNewCampaign(false)}>Cancel</button><button onClick={createCampaign}>Create Campaign</button></div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function NegotiationsPage() {
  return <Suspense fallback={<div className="cafe-ops-page">Loading...</div>}><NegotiationsContent /></Suspense>
}
