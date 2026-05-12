'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProfileData {
  accountId: string
  role: string
  email: string
  name: string
  phone: string
  location: string
  businessName: string
  accountType: string
}

function Icon({ name, size = 18 }: { name: 'user' | 'lock' | 'logout' | 'save' | 'edit' | 'building'; size?: number }) {
  const paths = {
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    logout: <><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M21 3v18" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
    building: <><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-8h6v8" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(word => word[0]?.toUpperCase()).join('') || 'U'
}

function defaultProfile(): ProfileData {
  return {
    accountId: 'CAFE-2026-00001',
    role: 'Cafe Owner',
    email: 'cafe@gradient365.local',
    name: 'Arjun Mehta',
    phone: '+91 98765 43210',
    location: 'Indiranagar, Bangalore',
    businessName: 'Demo Cafe',
    accountType: 'cafe',
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData>(defaultProfile())
  const [draft, setDraft] = useState<ProfileData>(defaultProfile())
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const raw = localStorage.getItem('gradient365_user')
    if (!raw) {
      router.replace('/login')
      return
    }

    try {
      const user = JSON.parse(raw)
      const nextProfile = {
        accountId: user.accountId || user.account_id || defaultProfile().accountId,
        role: user.role || defaultProfile().role,
        email: user.email || `${(user.accountType || 'demo').toLowerCase()}@gradient365.local`,
        name: user.name || defaultProfile().name,
        phone: user.phone || defaultProfile().phone,
        location: user.location || defaultProfile().location,
        businessName: user.businessName || user.business_name || defaultProfile().businessName,
        accountType: user.accountType || 'cafe',
      }
      setProfile(nextProfile)
      setDraft(nextProfile)
    } catch {
      router.replace('/login')
    }
  }, [router])

  function updateDraft(field: keyof ProfileData, value: string) {
    setDraft(prev => ({ ...prev, [field]: value }))
  }

  function saveProfile(event: React.FormEvent) {
    event.preventDefault()
    setProfile(draft)
    localStorage.setItem('gradient365_user', JSON.stringify({
      accountId: draft.accountId,
      role: draft.role,
      email: draft.email,
      name: draft.name,
      phone: draft.phone,
      location: draft.location,
      businessName: draft.businessName,
      accountType: draft.accountType,
    }))
    setEditing(false)
    setMessage('Profile updated successfully.')
  }

  function cancelEdit() {
    setDraft(profile)
    setEditing(false)
    setMessage('')
  }

  function changePassword(event: React.FormEvent) {
    event.preventDefault()
    setPasswordMessage('')
    setPasswordError('')
    if (!passwords.current) return setPasswordError('Current password is required.')
    if (passwords.next.length < 8) return setPasswordError('New password must be at least 8 characters.')
    if (passwords.next !== passwords.confirm) return setPasswordError('Passwords do not match.')
    setPasswords({ current: '', next: '', confirm: '' })
    setPasswordMessage('Password changed for this demo session.')
  }

  function logout() {
    localStorage.removeItem('gradient365_user')
    localStorage.removeItem('gradient365_token')
    router.replace('/login')
  }

  const displayName = profile.businessName || profile.name
  const initials = getInitials(displayName)

  return (
    <main className="cafe-ops-page cafe-profile-page">
      <header className="cafe-ops-topbar">
        <div><h1>Profile</h1><p>Edit account details, update password, and manage the current session.</p></div>
        <button onClick={() => setEditing(true)}><Icon name="edit" /> Edit Profile</button>
        <button onClick={logout}><Icon name="logout" /> Logout</button>
      </header>

      <section className="cafe-profile-hero cafe-card">
        <div className="cafe-profile-avatar">{initials}</div>
        <div>
          <span>{profile.accountType} account</span>
          <h2>{displayName}</h2>
          <p>{profile.email} - {profile.location}</p>
          <b>{profile.role}</b>
        </div>
      </section>

      <section className="cafe-ops-grid settings">
        <form onSubmit={saveProfile} className="cafe-card cafe-profile-panel">
          <div className="cafe-card-head">
            <h3>Account Details</h3>
            {!editing && <button type="button" onClick={() => setEditing(true)}>Edit</button>}
          </div>
          <div className="cafe-profile-form-grid">
            <label>Account ID<input value={draft.accountId} disabled /></label>
            <label>Role<input value={draft.role} disabled={!editing} onChange={event => updateDraft('role', event.target.value)} /></label>
            <label>Business Name<input value={draft.businessName} disabled={!editing} onChange={event => updateDraft('businessName', event.target.value)} /></label>
            <label>Name<input value={draft.name} disabled={!editing} onChange={event => updateDraft('name', event.target.value)} /></label>
            <label>Email<input type="email" value={draft.email} disabled={!editing} onChange={event => updateDraft('email', event.target.value)} /></label>
            <label>Phone<input value={draft.phone} disabled={!editing} onChange={event => updateDraft('phone', event.target.value)} /></label>
            <label className="wide">Location<input value={draft.location} disabled={!editing} onChange={event => updateDraft('location', event.target.value)} /></label>
          </div>
          {message && <div className="cafe-flow-notice">{message}</div>}
          <div className="cafe-profile-actions-row">
            {editing ? (
              <>
                <button type="button" onClick={cancelEdit}>Cancel</button>
                <button type="submit"><Icon name="save" size={15} /> Save Changes</button>
              </>
            ) : (
              <button type="button" onClick={() => setEditing(true)}><Icon name="edit" size={15} /> Edit Profile</button>
            )}
          </div>
        </form>

        <aside className="cafe-card cafe-profile-panel">
          <div className="cafe-card-head"><h3>Session</h3></div>
          <div className="cafe-profile-session-card">
            <Icon name="building" size={24} />
            <strong>{profile.accountId}</strong>
            <span>{profile.accountType === 'supplier' ? 'Supplier workspace' : profile.accountType === 'admin' ? 'Admin workspace' : 'Cafe workspace'}</span>
          </div>
          <button type="button" onClick={logout} className="cafe-profile-logout"><Icon name="logout" size={16} /> Logout</button>
        </aside>
      </section>

      <section className="cafe-card cafe-profile-panel">
        <div className="cafe-card-head"><h3>Change Password</h3></div>
        <form onSubmit={changePassword} className="cafe-profile-form-grid">
          <label>Current Password<input type="password" value={passwords.current} onChange={event => setPasswords(prev => ({ ...prev, current: event.target.value }))} /></label>
          <label>New Password<input type="password" value={passwords.next} onChange={event => setPasswords(prev => ({ ...prev, next: event.target.value }))} /></label>
          <label>Confirm Password<input type="password" value={passwords.confirm} onChange={event => setPasswords(prev => ({ ...prev, confirm: event.target.value }))} /></label>
          {passwordMessage && <div className="cafe-flow-notice wide">{passwordMessage}</div>}
          {passwordError && <div className="cafe-flow-notice danger wide">{passwordError}</div>}
          <div className="cafe-profile-actions-row wide"><button type="submit"><Icon name="lock" size={15} /> Change Password</button></div>
        </form>
      </section>
    </main>
  )
}
