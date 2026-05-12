'use client'

import Link from 'next/link'
import { useState } from 'react'

type IconName = 'search' | 'check' | 'user' | 'bell' | 'lock' | 'store' | 'save'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    check: <><path d="M20 6 9 17l-5-5" /></>,
    user: <><circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    store: <><path d="M4 10h16l-1-6H5z" /><path d="M6 10v10h12V10" /><path d="M9 20v-6h6v6" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const GROUPS = [
  { icon: 'store' as IconName, title: 'Outlet Defaults', status: '3 outlets configured', rows: ['Indiranagar opens at 07:30', 'Koramangala weekly billing enabled', 'HSR Layout packaging alerts on'] },
  { icon: 'bell' as IconName, title: 'Notifications', status: '12 rules active', rows: ['WhatsApp delivery alerts', 'Email invoice digest at 18:00', 'Critical stock SMS escalation'] },
  { icon: 'lock' as IconName, title: 'Security', status: 'Owner role active', rows: ['JWT cookie auth', 'Password changes require current password', 'Session timeout after inactivity'] },
]

export default function SettingsPage() {
  const [groups, setGroups] = useState(GROUPS)
  const [saved, setSaved] = useState(false)
  const [editing, setEditing] = useState<{ groupIndex: number; rowIndex?: number } | null>(null)
  const [editValue, setEditValue] = useState('')

  function openEdit(groupIndex: number, rowIndex?: number) {
    setEditing({ groupIndex, rowIndex })
    setEditValue(rowIndex === undefined ? groups[groupIndex].status : groups[groupIndex].rows[rowIndex])
  }

  function saveEdit() {
    if (!editing) return
    setGroups(prev => prev.map((group, groupIndex) => {
      if (groupIndex !== editing.groupIndex) return group
      if (editing.rowIndex === undefined) return { ...group, status: editValue || group.status }
      return { ...group, rows: group.rows.map((row, rowIndex) => rowIndex === editing.rowIndex ? (editValue || row) : row) }
    }))
    setSaved(false)
    setEditing(null)
  }

  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar">
        <div><h1>Settings</h1><p>Workspace defaults, notifications, outlet rules, and account access.</p></div>
        <label><Icon name="search" size={19} /><input placeholder="Search settings..." /></label>
        <Link href="/profile"><Icon name="user" /> Profile</Link>
        <button onClick={() => setSaved(true)}><Icon name="save" /> {saved ? 'Saved' : 'Save'}</button>
      </header>

      <section className="cafe-ops-stats">
        <div className="cafe-card cafe-ops-stat"><span><Icon name="store" /></span><div><p>Outlets</p><strong>3</strong><small>Configured</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="bell" /></span><div><p>Rules</p><strong>12</strong><small>Alerts active</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="lock" /></span><div><p>Security</p><strong>Owner</strong><small>Role active</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="check" /></span><div><p>Sync</p><strong>Live</strong><small>All settings saved</small></div></div>
      </section>

      <section className="cafe-ops-grid settings">
        <div className="cafe-ops-settings-list">
          {groups.map((group, groupIndex) => (
            <div className="cafe-card cafe-ops-setting" key={group.title}>
              <div className="cafe-ops-setting-head"><span><Icon name={group.icon} /></span><div><h2>{group.title}</h2><p>{group.status}</p></div><button onClick={() => openEdit(groupIndex)}>Edit</button></div>
              {group.rows.map((row, rowIndex) => <div className="cafe-ops-setting-row" key={row}><Icon name="check" size={15} /><span>{row}</span><button onClick={() => openEdit(groupIndex, rowIndex)}>Change</button></div>)}
            </div>
          ))}
        </div>

        <aside className="cafe-card cafe-ops-panel">
          <div className="cafe-ops-panel-image"><img src="/images/cafe-settings.jpg" alt="" /></div>
          <h2>Quick links</h2>
          <p>Most workspace controls are already tuned for the cafe flow. Profile and billing approvals stay one click away.</p>
          {[
            ['Profile and password', '/profile'],
            ['Billing approvals', '/billing'],
            ['Low-stock rules', '/inventory'],
            ['Customer records', '/suppliers'],
          ].map(([label, href]) => <Link className="cafe-ops-mini" href={href} key={href}><Icon name="user" size={15} /><span>{label}</span></Link>)}
        </aside>
      </section>

      {editing && (
        <div className="cafe-ops-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="cafe-ops-modal" onClick={event => event.stopPropagation()}>
            <div className="cafe-ops-modal-head"><div><span>Workspace setting</span><h2>{editing.rowIndex === undefined ? 'Edit Group' : 'Change Rule'}</h2></div><button onClick={() => setEditing(null)}>×</button></div>
            <div className="cafe-ops-form-grid">
              <label className="wide">Value<input value={editValue} onChange={event => setEditValue(event.target.value)} /></label>
            </div>
            <div className="cafe-ops-modal-actions"><button onClick={() => setEditing(null)}>Cancel</button><button onClick={saveEdit}>Apply</button></div>
          </div>
        </div>
      )}
    </main>
  )
}
