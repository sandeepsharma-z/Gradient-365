'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthPasswordToggleIcon } from '@/components/auth-password-toggle-icon'

function AuthIcon({ name, size = 18 }: { name: 'arrow' | 'coffee' | 'shield' | 'spark'; size?: number }) {
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    coffee: <><path d="M6 8h10v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" /><path d="M16 9h1a3 3 0 0 1 0 6h-1" /><path d="M7 3v2M11 3v2M15 3v2" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-5" /></>,
    spark: <><path d="M12 2l1.7 5.2L19 9l-5.3 1.8L12 16l-1.7-5.2L5 9l5.3-1.8z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const DEMO_ACCOUNTS = [
  {
    label: 'Admin',
    username: 'admin',
    password: 'admin123',
    redirect: '/dashboard',
    user: { accountId: 'ADMIN-2026-00001', businessName: 'Gradient 365', name: 'Admin User', role: 'Admin', accountType: 'admin' },
  },
  {
    label: 'Cafe',
    username: 'cafe',
    password: 'cafe123',
    redirect: '/dashboard',
    user: { accountId: 'CAFE-2026-00001', businessName: 'Demo Cafe', name: 'Arjun Mehta', role: 'Cafe Owner', accountType: 'cafe' },
  },
  {
    label: 'Supplier',
    username: 'supplier',
    password: 'supplier123',
    redirect: '/supplier-dashboard',
    user: { accountId: 'SUPP-2026-00001', businessName: 'Monin India Supply', name: 'Rohan Das', role: 'Supplier Admin', accountType: 'supplier' },
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [accountId, setAccountId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const locked = failedAttempts >= 3

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading || locked) return
    setLoading(true)
    setError('')
    const entered = accountId.trim().toLowerCase()
    const match = DEMO_ACCOUNTS.find(account =>
      (account.username === entered || account.user.accountId.toLowerCase() === entered) &&
      account.password === password
    )

    window.setTimeout(() => {
      if (match) {
        localStorage.setItem('gradient365_token', `demo-${match.username}-token`)
        localStorage.setItem('gradient365_user', JSON.stringify(match.user))
        router.push(match.redirect)
        return
      }

      const nextAttempts = failedAttempts + 1
      setFailedAttempts(nextAttempts)
      setError(nextAttempts >= 3 ? 'Account locked after 3 failed attempts. Reset via email/phone to continue.' : `Invalid credentials. ${3 - nextAttempts} attempt${3 - nextAttempts === 1 ? '' : 's'} left.`)
      setLoading(false)
    }, 350)
  }

  function fillDemo(index: number) {
    const demo = DEMO_ACCOUNTS[index]
    setAccountId(demo.username)
    setPassword(demo.password)
    setError('')
  }

  function resetLock() {
    setFailedAttempts(0)
    setError('Reset link sent to registered email/phone. Demo lock cleared.')
  }

  return (
    <main className="cafe-auth-page">
      <section className="cafe-auth-shell">
        <div className="cafe-auth-visual">
          <img src="/images/cafe-marketing.jpg" alt="" />
          <div className="cafe-auth-visual-content">
            <span><AuthIcon name="coffee" size={16} /> Brew Haven Cafe</span>
            <h1>Cafe operations, beautifully controlled.</h1>
            <p>Orders, reservations, menu, staff, inventory, reports, and settings in one saffron workspace.</p>
            <div className="cafe-auth-pills">
              <b><AuthIcon name="shield" size={14} /> Secure portal</b>
              <b><AuthIcon name="spark" size={14} /> Live dashboard</b>
            </div>
          </div>
        </div>

        <div className="cafe-auth-card">
          <div className="cafe-auth-brand">
            <img src="/images/gradient-logo.png" alt="" />
            <span>Gradient 365</span>
          </div>
          <h2>Welcome back</h2>
          <p>Sign in with admin, cafe, or supplier demo credentials.</p>

          <form onSubmit={handleSubmit} className="cafe-auth-form">
            <label>
              Username / Account ID
              <input type="text" value={accountId} onChange={e => setAccountId(e.target.value)} placeholder="admin / cafe / supplier" required />
            </label>
            <label>
              Password
              <span className="cafe-auth-password">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}><AuthPasswordToggleIcon visible={showPassword} /></button>
              </span>
            </label>

            {error && <div className="cafe-auth-error">{error}</div>}

            <button type="submit" disabled={loading || locked} className="cafe-auth-primary">
              {loading ? 'Signing in...' : locked ? 'Account locked' : 'Sign in'} <AuthIcon name="arrow" size={17} />
            </button>
            {locked && <button type="button" onClick={resetLock} className="cafe-auth-secondary">Reset via email/phone</button>}
          </form>

          <div className="cafe-demo-logins">
            {DEMO_ACCOUNTS.map((account, index) => (
              <button type="button" key={account.username} onClick={() => fillDemo(index)}>
                <strong>{account.label}</strong>
                <span>{account.username} / {account.password}</span>
              </button>
            ))}
          </div>

          <p className="cafe-auth-foot">Don&apos;t have an account? <Link href="/register">Create cafe account</Link></p>
        </div>
      </section>
    </main>
  )
}
