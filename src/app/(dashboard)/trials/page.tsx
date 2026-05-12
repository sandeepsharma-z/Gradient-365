'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

interface Trial {
  id: number
  product_name: string
  brand_name: string
  status: string
  start_date: string
  end_date: string
  feedback_submitted: boolean
}

type IconName = 'search' | 'plus' | 'users' | 'clock' | 'star' | 'check' | 'filter' | 'calendar'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    star: <><path d="m12 2 3 6.5 7 .8-5.2 4.7 1.4 7-6.2-3.6L5.8 21l1.4-7L2 9.3l7-.8z" /></>,
    check: <><path d="M20 6 9 17l-5-5" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
  }

  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const TABS = [
  { value: 'all', label: 'All Staff' },
  { value: 'active', label: 'On Duty' },
  { value: 'pending', label: 'Pending Tasks' },
  { value: 'completed', label: 'Completed' },
]

const DEMO_TRIALS: Trial[] = [
  { id: 1, product_name: 'Morning prep checklist', brand_name: 'Neha Sharma - Barista', status: 'active', start_date: new Date().toISOString(), end_date: '', feedback_submitted: false },
  { id: 2, product_name: 'Kitchen stock handover', brand_name: 'Rohan Das - Chef', status: 'active', start_date: new Date().toISOString(), end_date: '', feedback_submitted: false },
  { id: 3, product_name: 'Cash counter closing report', brand_name: 'Priya Yadav - Cashier', status: 'pending', start_date: new Date().toISOString(), end_date: '', feedback_submitted: false },
  { id: 4, product_name: 'Table service quality check', brand_name: 'Karan Singh - Waiter', status: 'completed', start_date: new Date().toISOString(), end_date: '', feedback_submitted: true },
]

const staffPhotos = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=140&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=140&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=140&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=140&q=80',
]

function statusLabel(status: string) {
  if (status === 'active') return 'Active'
  if (status === 'pending') return 'Pending'
  if (status === 'completed') return 'Done'
  return status
}

function statusClass(status: string) {
  if (status === 'active' || status === 'completed') return 'ok'
  if (status === 'pending') return 'warn'
  return 'neutral'
}

function TrialsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusParam = searchParams.get('status') ?? 'all'
  const [trials, setTrials] = useState<Trial[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [showShiftPlan, setShowShiftPlan] = useState(false)
  const [newStaff, setNewStaff] = useState({ name: '', role: '', task: '' })

  useEffect(() => {
    setLoading(true)
    api.get<{ trials: Trial[] }>('/api/trials/cafe')
      .then(data => setTrials(data.trials?.length ? data.trials : DEMO_TRIALS))
      .catch(() => setTrials(DEMO_TRIALS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = statusParam === 'all' ? trials : trials.filter(t => t.status === statusParam)
  const active = trials.filter(t => t.status === 'active').length
  const pending = trials.filter(t => t.status === 'pending').length
  const completed = trials.filter(t => t.feedback_submitted || t.status === 'completed').length

  const stats = useMemo(() => [
    { icon: 'users' as IconName, label: 'Staff Members', value: trials.length || '-', sub: 'Across cafe floor' },
    { icon: 'clock' as IconName, label: 'On Duty', value: active, sub: 'Current shift' },
    { icon: 'star' as IconName, label: 'Open Tasks', value: pending, sub: 'Needs follow-up' },
    { icon: 'check' as IconName, label: 'Completed', value: completed, sub: 'Today' },
  ], [active, completed, pending, trials.length])

  function addStaff() {
    const name = newStaff.name.trim()
    if (!name) return
    setTrials(prev => [{
      id: Date.now(),
      product_name: newStaff.task.trim() || 'New shift task',
      brand_name: `${name} - ${newStaff.role.trim() || 'Staff'}`,
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: '',
      feedback_submitted: false,
    }, ...prev])
    setNewStaff({ name: '', role: '', task: '' })
    setShowAddStaff(false)
  }

  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar">
        <div>
          <h1>Staff</h1>
          <p>Shift activity, team tasks, feedback, and floor ownership in one view.</p>
        </div>
        <label><Icon name="search" size={19} /><input placeholder="Search staff, role, task..." /></label>
        <button onClick={() => setShowShiftPlan(true)}><Icon name="calendar" /> Shift Plan</button>
        <button onClick={() => setShowAddStaff(true)}><Icon name="plus" /> Add Staff</button>
      </header>

      <section className="cafe-ops-stats">
        {stats.map(stat => (
          <div className="cafe-card cafe-ops-stat" key={stat.label}>
            <span><Icon name={stat.icon} /></span>
            <div><p>{stat.label}</p><strong>{stat.value}</strong><small>{stat.sub}</small></div>
          </div>
        ))}
      </section>

      <section className="cafe-ops-grid two">
        <div className="cafe-card cafe-ops-board">
          <div className="cafe-ops-tabs">
            {TABS.map(tab => (
              <button key={tab.value} className={statusParam === tab.value ? 'active' : ''} onClick={() => router.push(tab.value === 'all' ? '/trials' : `/trials?status=${tab.value}`)}>
                {tab.label}<span>{tab.value === 'all' ? trials.length : trials.filter(t => t.status === tab.value).length}</span>
              </button>
            ))}
          </div>
          <div className="cafe-ops-toolbar"><label><Icon name="search" size={16} /><input placeholder="Search task..." /></label><button><Icon name="filter" size={15} /> Filter</button><div /></div>
          <div className="cafe-ops-list">
            {loading ? <div className="cafe-ops-empty">Loading staff...</div> : filtered.map((trial, index) => (
              <article className="cafe-ops-row" key={trial.id}>
                <img src={staffPhotos[index % staffPhotos.length]} alt="" />
                <div>
                  <h3>{trial.brand_name}</h3>
                  <p>{trial.product_name}</p>
                  <small>{new Date(trial.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</small>
                </div>
                <span className={`status ${statusClass(trial.status)}`}><span className="dot" />{statusLabel(trial.status)}</span>
                {trial.status === 'active' && !trial.feedback_submitted ? <Link href={`/trials/${trial.id}/feedback`}>Feedback</Link> : <button>View</button>}
              </article>
            ))}
          </div>
        </div>

        <aside className="cafe-card cafe-ops-panel">
          <div className="cafe-ops-panel-image"><img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=700&q=85" alt="" /></div>
          <h2>Today&apos;s floor rhythm</h2>
          <p>Peak breakfast window has 4 active staff and 2 pending handovers. Keep cashier break after the 11:30 rush.</p>
          {['09:00 Barista setup', '10:30 Kitchen refill', '13:00 Floor reset'].map(item => <div className="cafe-ops-mini" key={item}><Icon name="clock" size={15} /><span>{item}</span></div>)}
        </aside>
      </section>

      {showAddStaff && (
        <div className="cafe-ops-modal-backdrop" onClick={() => setShowAddStaff(false)}>
          <div className="cafe-ops-modal" onClick={event => event.stopPropagation()}>
            <div className="cafe-ops-modal-head"><div><span>Staff setup</span><h2>Add Staff</h2></div><button onClick={() => setShowAddStaff(false)}>×</button></div>
            <div className="cafe-ops-form-grid">
              <label>Name<input value={newStaff.name} onChange={event => setNewStaff(prev => ({ ...prev, name: event.target.value }))} placeholder="Neha Sharma" /></label>
              <label>Role<input value={newStaff.role} onChange={event => setNewStaff(prev => ({ ...prev, role: event.target.value }))} placeholder="Barista" /></label>
              <label className="wide">Task<input value={newStaff.task} onChange={event => setNewStaff(prev => ({ ...prev, task: event.target.value }))} placeholder="Morning prep checklist" /></label>
            </div>
            <div className="cafe-ops-modal-actions"><button onClick={() => setShowAddStaff(false)}>Cancel</button><button onClick={addStaff}>Save Staff</button></div>
          </div>
        </div>
      )}

      {showShiftPlan && (
        <div className="cafe-ops-modal-backdrop" onClick={() => setShowShiftPlan(false)}>
          <div className="cafe-ops-modal" onClick={event => event.stopPropagation()}>
            <div className="cafe-ops-modal-head"><div><span>Today</span><h2>Shift Plan</h2></div><button onClick={() => setShowShiftPlan(false)}>×</button></div>
            <div className="cafe-ops-modal-list">
              {['09:00 - Barista opening setup', '10:30 - Kitchen refill check', '13:00 - Cashier break coverage', '17:00 - Evening floor reset'].map(item => <div key={item}><Icon name="clock" size={15} /><span>{item}</span></div>)}
            </div>
            <div className="cafe-ops-modal-actions"><button onClick={() => setShowShiftPlan(false)}>Close</button></div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function TrialsPage() {
  return <Suspense fallback={<div className="cafe-ops-page">Loading...</div>}><TrialsContent /></Suspense>
}
