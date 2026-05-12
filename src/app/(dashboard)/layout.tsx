'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  accountId: string
  businessName?: string
  name?: string
  role: string
  accountType?: string
}


function Icon({ name, size = 19 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    dashboard: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
    orders: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H7" /></>,
    menu: <><path d="M6 3v18M18 3v18M6 8h12M6 16h12" /><path d="M10 3v5M14 16v5" /></>,
    reservations: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
    customers: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    staff: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 21a6 6 0 0 1 12 0M14 17a5 5 0 0 1 7 4" /></>,
    inventory: <><path d="M5 7h14l-1 14H6z" /><path d="M9 7a3 3 0 0 1 6 0" /><path d="M9 12h6" /></>,
    marketing: <><path d="M4 14l13-7v10L4 14z" /><path d="M4 14v5a2 2 0 0 0 2 2h1" /><path d="M17 7l3-2v14l-3-2" /></>,
    reports: <><path d="M4 19V5M4 19h16" /><path d="M8 16v-5M12 16V8M16 16v-8" /></>,
    supplier: <><path d="M3 21h18" /><path d="M5 21V7l7-4 7 4v14" /><path d="M9 21v-8h6v8" /><path d="M8 9h.01M12 9h.01M16 9h.01" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.03.03a2 2 0 1 1-2.83 2.83l-.03-.03A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.05a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.03.03a2 2 0 1 1-2.83-2.83l.03-.03A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.05A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.88l-.03-.03a2 2 0 1 1 2.83-2.83l.03.03A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.05a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.03-.03a2 2 0 1 1 2.83 2.83l-.03.03A1.7 1.7 0 0 0 19.4 9c.36.31.88.6 1.55.6H21a2 2 0 1 1 0 4h-.05A1.7 1.7 0 0 0 19.4 15z" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', href: '/dashboard', group: 'cafe' },
  { label: 'Orders', icon: 'orders', href: '/orders', group: 'cafe' },
  { label: 'Menu', icon: 'menu', href: '/catalogue', group: 'cafe' },
  { label: 'Reservations', icon: 'reservations', href: '/preorders', group: 'cafe' },
  { label: 'Customers', icon: 'customers', href: '/suppliers', group: 'cafe' },
  { label: 'Staff', icon: 'staff', href: '/trials', group: 'cafe' },
  { label: 'Inventory', icon: 'inventory', href: '/inventory', group: 'cafe' },
  { label: 'Marketing', icon: 'marketing', href: '/negotiations', group: 'cafe' },
  { label: 'Reports', icon: 'reports', href: '/reports', group: 'cafe' },
  { label: 'Settings', icon: 'settings', href: '/settings', group: 'shared' },
  { label: 'Supplier Hub', icon: 'supplier', href: '/supplier-dashboard', group: 'supplier' },
  { label: 'Supplier Orders', icon: 'orders', href: '/supplier-orders', group: 'supplier' },
  { label: 'Supplier Catalogue', icon: 'menu', href: '/supplier-catalogue', group: 'supplier' },
  { label: 'Supplier Stock', icon: 'inventory', href: '/supplier-stock', group: 'supplier' },
  { label: 'Enquiries', icon: 'marketing', href: '/supplier-enquiries', group: 'supplier' },
  { label: 'Deliveries', icon: 'orders', href: '/supplier-deliveries', group: 'supplier' },
]

const OUTLETS = [
  { name: 'Indiranagar', count: 12, img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=200&q=85' },
  { name: 'Koramangala', count: 8, img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=200&q=85' },
  { name: 'HSR Layout', count: 15, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=85' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('gradient365_user')
    if (!raw) {
      router.replace('/login')
      return
    }

    try { setUser(JSON.parse(raw)) } catch {
      localStorage.removeItem('gradient365_user')
      router.replace('/login')
    }
  }, [router])

  useEffect(() => {
    if (!user) return
    const type = (user.accountType || (user.role.toLowerCase().includes('supplier') ? 'supplier' : user.role.toLowerCase().includes('admin') ? 'admin' : 'cafe')).toLowerCase()
    const isSupplierPath = pathname.startsWith('/supplier-')
    const isSharedPath = pathname.startsWith('/settings') || pathname.startsWith('/profile')

    if (type === 'supplier' && !isSupplierPath && !isSharedPath) router.replace('/supplier-dashboard')
    if (type === 'cafe' && isSupplierPath) router.replace('/dashboard')
  }, [pathname, router, user])

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const displayName = user?.name || user?.businessName || 'Arjun Mehta'
  const role = user?.role || 'Admin'
  const accountType = (user?.accountType || (role.toLowerCase().includes('supplier') ? 'supplier' : role.toLowerCase().includes('admin') ? 'admin' : 'cafe')).toLowerCase()
  const visibleNav = NAV_ITEMS
    .filter(item => accountType === 'admin' || item.group === 'shared' || item.group === accountType)
    .sort((a, b) => {
      if (accountType !== 'supplier') return 0
      const order = ['/supplier-dashboard', '/supplier-orders', '/supplier-catalogue', '/supplier-stock', '/supplier-enquiries', '/supplier-deliveries', '/settings']
      return order.indexOf(a.href) - order.indexOf(b.href)
    })
  const mobileNav = visibleNav.slice(0, 4)
  const brandHref = accountType === 'supplier' ? '/supplier-dashboard' : '/dashboard'

  if (!user) return <div className="cafe-shell"><div className="main-with-sidebar cafe-content" /></div>

  return (
    <div className={`cafe-shell${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <aside className={`cafe-sidebar desktop-sidebar ${accountType === 'supplier' ? 'supplier-sidebar' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <button
          className="cafe-sidebar-toggle"
          type="button"
          onClick={() => setSidebarCollapsed(value => !value)}
          aria-label="Toggle sidebar"
          suppressHydrationWarning
        >
          <Icon name="chevron" size={17} />
        </button>
        <Link href={brandHref} className="cafe-brand" aria-label="Dashboard">
          <img src="/images/gradient-logo.png" alt="Gradient 365" className="cafe-brand-logo" />
        </Link>

        <div className="cafe-sidebar-scroll">
          <nav className="cafe-nav">
            {visibleNav.map(item => (
              <Link key={item.href} href={item.href} className={`cafe-nav-link${isActive(item.href) ? ' active' : ''}`}>
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="cafe-outlets">
            <p className="cafe-outlets-label">Outlets</p>
            {OUTLETS.map(outlet => (
                  <Link key={outlet.name} href={`/dashboard?outlet=${encodeURIComponent(outlet.name)}`} className="cafe-outlet-card">
                <img src={outlet.img} alt={outlet.name} />
                <div className="cafe-outlet-info">
                  <strong>{outlet.name}</strong>
                  <span>🔵 {outlet.count}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="cafe-sidebar-promo">
            <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=360&q=85" alt="" />
            <div>
              <strong>Winter Special</strong>
              <span>Spiced Caramel Latte</span>
              <Link href="/catalogue">View Menu <Icon name="arrow" size={16} /></Link>
            </div>
          </div>
        </div>

        <Link href="/profile" className="cafe-profile">
          <img src="https://i.pravatar.cc/80?img=12" alt="" />
          <span>
            <strong>{displayName}</strong>
            <small>{role}</small>
          </span>
          <Icon name="chevron" size={16} />
        </Link>
      </aside>

      <div className="main-with-sidebar cafe-content">
        {children}
      </div>

      <nav className="mobile-nav">
        {mobileNav.map(item => (
          <Link key={item.href} href={item.href} className={`mobile-nav-item${isActive(item.href) ? ' active' : ''}`}>
            <span className="mobile-nav-icon"><Icon name={item.icon} size={21} /></span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
