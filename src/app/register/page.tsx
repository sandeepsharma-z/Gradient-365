'use client'

import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { AuthPasswordToggleIcon } from '@/components/auth-password-toggle-icon'

interface RegisterResponse {
  success: boolean
  message: string
  user?: { accountId: string; email: string }
}

function AuthIcon({ name, size = 18 }: { name: 'arrow' | 'coffee' | 'check' | 'store'; size?: number }) {
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    coffee: <><path d="M6 8h10v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" /><path d="M16 9h1a3 3 0 0 1 0 6h-1" /><path d="M7 3v2M11 3v2M15 3v2" /></>,
    check: <><path d="M20 6 9 17l-5-5" /></>,
    store: <><path d="M4 10h16l-1-6H5z" /><path d="M6 10v10h12V10" /><path d="M9 20v-6h6v6" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export default function RegisterPage() {
  const [form, setForm] = useState({ cafeName: '', ownerName: '', location: '', phone: '', email: '', password: '', confirmPassword: '' })
  const [accountType, setAccountType] = useState<'cafe' | 'supplier'>('cafe')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{ accountId: string; email: string } | null>(null)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    setLoading(true)
    try {
      const res = await api.post<RegisterResponse>('/api/auth/register/cafe', {
        cafeName: form.cafeName,
        ownerName: form.ownerName,
        location: form.location,
        phone: form.phone,
        email: form.email,
        password: form.password,
      })
      setSuccess({ accountId: res.user?.accountId ?? `${accountType === 'cafe' ? 'CAFE' : 'SUPP'}-2026-00001`, email: res.user?.email ?? form.email })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="cafe-auth-page">
      <section className="cafe-auth-shell register">
        <div className="cafe-auth-visual">
          <img src="/images/cafe-settings.jpg" alt="" />
          <div className="cafe-auth-visual-content">
            <span><AuthIcon name="store" size={16} /> Account registration</span>
            <h1>Separate cafe and supplier workspaces.</h1>
            <p>Choose account type, get a unique ID, verify email/SMS, and open the right dashboard.</p>
            <div className="cafe-auth-pills">
              <b><AuthIcon name="check" size={14} /> CAFE-YYYY-#####</b>
              <b><AuthIcon name="coffee" size={14} /> SUPP-YYYY-#####</b>
            </div>
          </div>
        </div>

        <div className="cafe-auth-card">
          <Link href="/dashboard" className="cafe-auth-skip">Skip to dashboard <AuthIcon name="arrow" size={15} /></Link>
          <div className="cafe-auth-brand"><img src="/images/gradient-logo.png" alt="" /><span>Gradient 365</span></div>
          <h2>Create account</h2>
          <p>Register one location per account. Chain branches get separate IDs and private pricing.</p>

          {success ? (
            <div className="cafe-auth-success">
              <span><AuthIcon name="check" size={28} /></span>
              <h3>Account created</h3>
              <p>Your Account ID</p>
              <b>{success.accountId}</b>
              <small>Verification email sent to {success.email}</small>
              <Link href="/login" className="cafe-auth-primary">Go to sign in <AuthIcon name="arrow" size={17} /></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="cafe-auth-form cafe-auth-register-form">
              <div className="cafe-auth-type-toggle wide">
                <button type="button" className={accountType === 'cafe' ? 'active' : ''} onClick={() => setAccountType('cafe')}>Cafe Account</button>
                <button type="button" className={accountType === 'supplier' ? 'active' : ''} onClick={() => setAccountType('supplier')}>Supplier Account</button>
              </div>
              <label>{accountType === 'cafe' ? 'Cafe Name' : 'Business Name'}<input value={form.cafeName} onChange={set('cafeName')} placeholder={accountType === 'cafe' ? 'Brew Haven Cafe' : 'Monin India Supply'} required /></label>
              <label>{accountType === 'cafe' ? 'Owner Name' : 'Contact Person'}<input value={form.ownerName} onChange={set('ownerName')} placeholder="Full name" required /></label>
              <label>Location<input value={form.location} onChange={set('location')} placeholder="Indiranagar, Bangalore" required /></label>
              <label>Phone<input type="tel" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile number" required /></label>
              {accountType === 'supplier' && <label className="wide">Product Categories<input placeholder="Syrups, Coffee, Dairy, Packaging" /></label>}
              <label className="wide">Email<input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required /></label>
              <label>
                Password
                <span className="cafe-auth-password">
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Create password" minLength={8} required />
                  <button type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}><AuthPasswordToggleIcon visible={showPassword} /></button>
                </span>
              </label>
              <label>
                Confirm Password
                <span className="cafe-auth-password">
                  <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Confirm password" required />
                  <button type="button" onClick={() => setShowConfirm(v => !v)} aria-label={showConfirm ? 'Hide password' : 'Show password'}><AuthPasswordToggleIcon visible={showConfirm} /></button>
                </span>
              </label>
              {error && <div className="cafe-auth-error wide">{error}</div>}
              <button type="submit" disabled={loading} className="cafe-auth-primary wide">{loading ? 'Creating account...' : 'Create account'} <AuthIcon name="arrow" size={17} /></button>
              <p className="cafe-auth-foot wide">Already have an account? <Link href="/login">Sign in</Link></p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
