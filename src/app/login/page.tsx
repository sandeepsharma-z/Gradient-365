'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { AuthPasswordToggleIcon } from '@/components/auth-password-toggle-icon'

interface AuthResponse {
  token: string
  user: unknown
}

function AuthIcon({ name, size = 18 }: { name: 'arrow' | 'coffee' | 'shield' | 'spark'; size?: number }) {
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    coffee: <><path d="M6 8h10v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" /><path d="M16 9h1a3 3 0 0 1 0 6h-1" /><path d="M7 3v2M11 3v2M15 3v2" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-5" /></>,
    spark: <><path d="M12 2l1.7 5.2L19 9l-5.3 1.8L12 16l-1.7-5.2L5 9l5.3-1.8z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export default function LoginPage() {
  const router = useRouter()
  const [accountId, setAccountId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const res = await api.post<AuthResponse>('/api/auth/login', {
        accountId: accountId.trim().toUpperCase(),
        password,
      })
      localStorage.setItem('gradient365_token', res.token)
      localStorage.setItem('gradient365_user', JSON.stringify(res.user))
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message.toLowerCase().includes('not verified') ? 'Your email is not verified. Please check your inbox and click the verification link.' : message)
      setLoading(false)
    }
  }

  function enterDemo() {
    localStorage.setItem('gradient365_user', JSON.stringify({ accountId: 'CAFE-2026-00001', businessName: 'Demo Cafe', name: 'Arjun Mehta', role: 'Admin' }))
    router.push('/dashboard')
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
          <Link href="/dashboard" className="cafe-auth-skip">Skip to dashboard <AuthIcon name="arrow" size={15} /></Link>
          <div className="cafe-auth-brand">
            <img src="/images/gradient-logo.png" alt="" />
            <span>Gradient 365</span>
          </div>
          <h2>Welcome back</h2>
          <p>Sign in to manage today&apos;s cafe flow.</p>

          <form onSubmit={handleSubmit} className="cafe-auth-form">
            <label>
              Account ID
              <input type="text" value={accountId} onChange={e => setAccountId(e.target.value)} placeholder="CAFE-2026-00001" required />
            </label>
            <label>
              Password
              <span className="cafe-auth-password">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required />
                <button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}><AuthPasswordToggleIcon visible={showPassword} /></button>
              </span>
            </label>

            {error && <div className="cafe-auth-error">{error}</div>}

            <button type="submit" disabled={loading} className="cafe-auth-primary">
              {loading ? 'Signing in...' : 'Sign in'} <AuthIcon name="arrow" size={17} />
            </button>
            <button type="button" onClick={enterDemo} className="cafe-auth-secondary">Open demo dashboard</button>
          </form>

          <p className="cafe-auth-foot">Don&apos;t have an account? <Link href="/register">Create cafe account</Link></p>
        </div>
      </section>
    </main>
  )
}
