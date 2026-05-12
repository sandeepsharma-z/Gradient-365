'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

interface Stats {
  totalOrders: number
  pendingOrders: number
  deliveredOrders: number
  linkedSuppliers: number
  duePayments: number
}

type IconName = 'search' | 'sun' | 'moon' | 'bell' | 'plus' | 'bag' | 'cart' | 'receipt' | 'users' | 'calendar' | 'truck' | 'chart' | 'arrow'

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" /></>,
    moon: <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></>,
    bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    bag: <><path d="M6 8h12l-1 12H7z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
    cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H7" /></>,
    receipt: <><path d="M6 2h12v20l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    chart: <><path d="M4 19V5M4 19h16" /><path d="M8 16v-5M12 16V8M16 16v-8" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function StatCard({ icon, label, value, note }: { icon: IconName; label: string; value: string; note: string }) {
  return (
    <div className="cafe-card cafe-stat-card">
      <span className="cafe-stat-icon"><Icon name={icon} size={23} /></span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  )
}

const reservations = [
  { name: 'Nandini Dairy Kitchen', sub: '14 items', time: 'Today, 9:40 AM', status: 'Confirmed' },
  { name: 'Bloom Fresh Greens', sub: '8 organic items', time: 'Today, 11:15 AM', status: 'Confirmed' },
  { name: 'Blue Tokai Roasters', sub: '4 coffee bags', time: 'Today, 12:30 PM', status: 'Pending' },
  { name: 'Hearth & Stone Bakery', sub: '22 bakery items', time: 'Today, 2:00 PM', status: 'Confirmed' },
]

const deliveryStatus = [
  { name: 'Nandini', order: 'Order #20412', status: 'On the way', tone: 'green', icon: 'truck' as IconName },
  { name: 'Blue Tokai', order: 'Order #20403', status: 'Preparing', tone: 'orange', icon: 'cart' as IconName },
  { name: 'In-house', order: 'Stock audit', status: 'Delivered', tone: 'blue', icon: 'bag' as IconName },
]

const bestItems = [
  { name: 'Saffron Latte', price: 'Rs 220', sales: 312, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=120&q=80' },
  { name: 'Classic Cheesecake', price: 'Rs 180', sales: 278, img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=120&q=80' },
  { name: 'Club Sandwich', price: 'Rs 250', sales: 243, img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=120&q=80' },
  { name: 'Cold Brew', price: 'Rs 200', sales: 198, img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=120&q=80' },
]

const featuredMenu = [
  { name: 'Spanish Latte', price: 'Rs 240', img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=260&q=80', badge: 'New' },
  { name: 'Chocolate Lava Cake', price: 'Rs 220', img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=260&q=80' },
  { name: 'Club Sandwich', price: 'Rs 260', img: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=260&q=80' },
  { name: 'Blueberry Cheesecake', price: 'Rs 220', img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=260&q=80', badge: 'New' },
]

const topSellingItems = [
  { name: 'Cappuccino', qty: '342 sold', revenue: 'Rs 75,240', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=120&q=90' },
  { name: 'Avocado Toast', qty: '298 sold', revenue: 'Rs 59,600', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=120&q=90' },
  { name: 'Cold Brew', qty: '267 sold', revenue: 'Rs 53,400', img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=120&q=90' },
  { name: 'Croissant', qty: '234 sold', revenue: 'Rs 28,080', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=120&q=90' },
  { name: 'Matcha Latte', qty: '189 sold', revenue: 'Rs 45,360', img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=120&q=90' },
]

const customerReviews = [
  { name: 'Aditi Malhotra', rating: 5, time: '2 hours ago', text: 'Amazing ambience, perfect coffee, and the staff is so warm! Always my go-to place.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
  { name: 'Rahul Singh', rating: 4, time: '5 hours ago', text: 'Great food quality and quick service. Will definitely come back!', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
]

const suppliers = [
  { name: 'Nandini Dairy', rating: 4.8, badge: 'Preferred', img: 'https://i.pravatar.cc/80?img=20' },
  { name: 'Bloom Greens', rating: 4.6, img: 'https://i.pravatar.cc/80?img=21' },
  { name: 'Blue Tokai', rating: 4.7, img: 'https://i.pravatar.cc/80?img=22' },
]

const heroSlides = [
  {
    eyebrow: 'Good coffee. Great moments.',
    title: 'Brewed with passion,',
    titleSecond: 'served with',
    accent: 'heart.',
    sub: 'Delight in every sip, made just for you.',
    badgeSmall: "Today's Special",
    badgeTitle: 'Flat White',
    badgeOffer: '20% OFF',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=85',
  },
  {
    eyebrow: 'Fresh beans. Better mornings.',
    title: 'Roasted for aroma,',
    titleSecond: 'crafted with',
    accent: 'care.',
    sub: 'Supplier-ready coffee stock for your busiest hours.',
    badgeSmall: 'Fresh Arrival',
    badgeTitle: 'Arabica Beans',
    badgeOffer: '15% OFF',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1400&q=85',
  },
  {
    eyebrow: 'Warm plates. Happy tables.',
    title: 'Prepared with quality,',
    titleSecond: 'served on',
    accent: 'time.',
    sub: 'Track orders, ingredients, and daily specials in one place.',
    badgeSmall: 'Menu Pick',
    badgeTitle: 'Brunch Combo',
    badgeOffer: '10% OFF',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1400&q=85',
  },
  {
    eyebrow: 'Sweet breaks. Strong sales.',
    title: 'Desserts that move,',
    titleSecond: 'numbers that',
    accent: 'grow.',
    sub: 'Keep top-selling items visible and ready for repeat orders.',
    badgeSmall: 'Top Seller',
    badgeTitle: 'Cheesecake',
    badgeOffer: 'Hot',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1400&q=85',
  },
]

function ThemeToggleButton() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initial = saved || 'light'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  if (!mounted) return <button className="cafe-icon-btn" aria-label="Theme"><Icon name="sun" /></button>

  return (
    <button onClick={toggle} className="cafe-icon-btn" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      <Icon name={theme === 'light' ? 'sun' : 'moon'} />
    </button>
  )
}

const notifications = [
  { id: 1, title: 'New Order Received', message: 'Order #20415 from Nandini Dairy', time: '2 mins ago', icon: '📦' },
  { id: 2, title: 'Payment Confirmed', message: 'Rs 5,240 received from Blue Tokai', time: '15 mins ago', icon: '✓' },
  { id: 3, title: 'Stock Low', message: 'Arabica beans running low', time: '1 hour ago', icon: '⚠️' },
]

const notificationItems = [
  { id: 1, title: 'New Order Received', message: 'Order #20415 from Nandini Dairy', time: '2 mins ago', icon: 'bag' as IconName },
  { id: 2, title: 'Payment Confirmed', message: 'Rs 5,240 received from Blue Tokai', time: '15 mins ago', icon: 'receipt' as IconName },
  { id: 3, title: 'Stock Low', message: 'Arabica beans running low', time: '1 hour ago', icon: 'cart' as IconName },
]

export default function DashboardHomePage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [firstName, setFirstName] = useState('Arjun')
  const [activeHero, setActiveHero] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('gradient365_user')
      if (raw) {
        const user = JSON.parse(raw)
        const name = String(user.name || user.businessName || '').split(' ')[0]
        if (name) setFirstName(name)
      }
    } catch {}

    api.get<Stats>('/orders/stats').then(setStats).catch(() => undefined)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHero(current => (current + 1) % heroSlides.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [])

  const metrics = useMemo(() => ({
    total: stats?.totalOrders ?? 148,
    pending: stats?.pendingOrders ?? 26,
    suppliers: stats?.linkedSuppliers ?? 18,
    dues: stats?.duePayments ?? 6,
  }), [stats])

  return (
    <main className="cafe-dashboard">
      <header className="cafe-topbar">
        <div>
          <h1>Good morning, {firstName}! <span>👋</span></h1>
          <p>Here&apos;s what&apos;s happening at your cafe today.</p>
        </div>
        <label className="cafe-search">
          <Icon name="search" size={20} />
          <input placeholder="Search anything..." />
        </label>
        <ThemeToggleButton />
        <div className="cafe-notifications-wrapper">
          <button className="cafe-icon-btn cafe-bell" onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications"><Icon name="bell" /><span>{notificationItems.length}</span></button>
          {showNotifications && (
            <div className="cafe-notifications-panel">
              <div className="cafe-notifications-head">
                <div>
                  <h4>Notifications</h4>
                  <span>{notificationItems.length} unread updates</span>
                </div>
                <Link href="/notifications">View all</Link>
              </div>
              <div className="cafe-notifications-list">
                {notificationItems.map(notif => (
                  <div key={notif.id} className="cafe-notification-item">
                    <span className="cafe-notif-icon"><Icon name={notif.icon} size={18} /></span>
                    <div>
                      <strong>{notif.title}</strong>
                      <p>{notif.message}</p>
                      <small>{notif.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Link href="/orders" className="cafe-new-order"><Icon name="plus" size={20} /> New Order</Link>
      </header>

      <section className="cafe-grid">
        <div className="cafe-main-col">
          <section className="cafe-hero-card">
            {heroSlides.map((slide, index) => (
              <img
                key={slide.image}
                src={slide.image}
                alt=""
                className={`cafe-hero-slide-img${activeHero === index ? ' active' : ''}`}
              />
            ))}
            <div className="cafe-hero-copy" key={`copy-${activeHero}`}>
              <p>{heroSlides[activeHero].eyebrow}</p>
              <h2>
                {heroSlides[activeHero].title}<br />
                {heroSlides[activeHero].titleSecond} <em>{heroSlides[activeHero].accent}</em>
              </h2>
              <small className="cafe-hero-sub">{heroSlides[activeHero].sub}</small>
              <Link href="/catalogue">Explore Menu <span><Icon name="arrow" size={18} /></span></Link>
            </div>
            <div className="cafe-special-badge" key={`badge-${activeHero}`}>
              <small>{heroSlides[activeHero].badgeSmall}</small>
              <strong>{heroSlides[activeHero].badgeTitle}</strong>
              <b>{heroSlides[activeHero].badgeOffer}</b>
            </div>
            <div className="cafe-hero-dots" aria-label="Hero slides">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.badgeTitle}
                  type="button"
                  className={activeHero === index ? 'active' : ''}
                  onClick={() => setActiveHero(index)}
                  aria-label={`Show ${slide.badgeTitle}`}
                />
              ))}
            </div>
          </section>

          <section className="cafe-stats">
            <StatCard icon="bag" label="Total Orders" value={metrics.total.toLocaleString('en-IN')} note="+12.5% vs yesterday" />
            <StatCard icon="cart" label="Pending Deliveries" value={metrics.pending.toLocaleString('en-IN')} note="+8.3% vs yesterday" />
            <StatCard icon="receipt" label="Pending Invoices" value={metrics.dues.toLocaleString('en-IN')} note="+5.7% vs yesterday" />
            <StatCard icon="users" label="Linked Suppliers" value={metrics.suppliers.toLocaleString('en-IN')} note="+10.2% vs yesterday" />
          </section>

          <section className="cafe-analytics-row">
            <div className="cafe-card cafe-revenue-card">
              <div className="cafe-card-head">
                <div>
                  <h3>Revenue Overview</h3>
                  <strong>Rs 1,24,580 <span>+12.5%</span></strong>
                </div>
                <button>This Week</button>
              </div>
              <svg className="cafe-line-chart" viewBox="0 0 560 210">
                <g stroke="#eee6dc" strokeDasharray="4 6">
                  <line x1="20" y1="40" x2="540" y2="40" /><line x1="20" y1="86" x2="540" y2="86" /><line x1="20" y1="132" x2="540" y2="132" /><line x1="20" y1="178" x2="540" y2="178" />
                </g>
                <path d="M24 156 C80 156 82 130 128 132 C174 134 176 112 220 118 C268 124 270 82 318 80 C365 78 360 36 410 58 C455 78 460 132 536 104" fill="none" stroke="#f58a00" strokeWidth="5" strokeLinecap="round" />
                <path d="M24 156 C80 156 82 130 128 132 C174 134 176 112 220 118 C268 124 270 82 318 80 C365 78 360 36 410 58 C455 78 460 132 536 104 L536 184 L24 184 Z" fill="rgba(245,138,0,.11)" />
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => <text key={d} x={46 + i * 78} y="204" fill="#8d8176" fontSize="13">{d}</text>)}
                <circle cx="410" cy="58" r="7" fill="#f58a00" stroke="#fff" strokeWidth="4" />
              </svg>
            </div>

            <div className="cafe-card cafe-category-card">
              <div className="cafe-card-head">
                <h3>Sales by Category</h3>
                <button>This Week</button>
              </div>
              <div className="cafe-donut-wrap">
                <div className="cafe-donut"><strong>Rs 1,24,580</strong><span>Total</span></div>
                <div className="cafe-legend">
                  <span><i /> Beverages <b>45%</b></span>
                  <span><i /> Food <b>30%</b></span>
                  <span><i /> Desserts <b>15%</b></span>
                  <span><i /> Merchandise <b>10%</b></span>
                </div>
              </div>
            </div>
          </section>

          <section className="cafe-bottom-row">
            <div className="cafe-card cafe-best-card">
              <div className="cafe-card-head"><h3>Best Selling Items</h3><Link href="/reports">View all</Link></div>
              {bestItems.map(item => (
                <div className="cafe-best-row" key={item.name}>
                  <img src={item.img} alt="" />
                  <div><strong>{item.name}</strong><span>{item.price}</span></div>
                  <b><Icon name="chart" size={14} /> {item.sales}</b>
                </div>
              ))}
            </div>

            <div className="cafe-card cafe-review-card">
              <div className="cafe-card-head"><h3>Customer Reviews</h3><Link href="/reports">View all</Link></div>
              <div className="cafe-review-user">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="" />
                <div>
                  <strong>Aditi Malhotra</strong>
                  <span>★★★★★</span>
                </div>
                <small>2 hours ago</small>
              </div>
              <p>Amazing ambience, perfect coffee, and the staff is so warm! Always my go-to place. The pastries are fresh and the service is incredibly quick. Highly recommend to everyone!</p>
              <div className="cafe-review-photos">
                <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300&q=90" alt="" />
                <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=90" alt="" />
                <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=90" alt="" />
                <img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=300&q=90" alt="" />
                <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=300&q=90" alt="" />
              </div>
            </div>
          </section>

          <section className="cafe-featured-row">
            <div className="cafe-card cafe-featured-card">
              <div className="cafe-card-head"><h3>Featured Menu</h3><Link href="/catalogue">View all</Link></div>
              <div className="cafe-featured-list">
                {featuredMenu.map(item => (
                  <article key={item.name}>
                    <img src={item.img} alt="" />
                    {item.badge && <span>{item.badge}</span>}
                    <div><strong>{item.name}</strong><b>{item.price}</b></div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="cafe-side-col">
          <div className="cafe-card cafe-today-special">
            <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&q=85" alt="" />
            <div className="cafe-special-overlay">
              <small>Today&apos;s Special</small>
              <p>Chef&apos;s Pick</p>
            </div>
            <div className="cafe-special-info">
              <strong>Saffron Panna Cotta</strong>
              <span>Rs 280 · 145 cal</span>
              <Link href="/catalogue" className="cafe-cta">View Menu →</Link>
            </div>
          </div>

          <div className="cafe-card cafe-top-selling">
            <div className="cafe-card-head"><h3>🔥 Top Selling</h3></div>
            {topSellingItems.map((item, i) => (
              <div className="cafe-selling-row" key={item.name}>
                <img src={item.img} alt="" />
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.qty}</small>
                </div>
                <b>{item.revenue}</b>
              </div>
            ))}
          </div>

          <div className="cafe-card cafe-list-card">
            <div className="cafe-card-head"><h3>Upcoming Deliveries</h3><Link href="/orders">View all</Link></div>
            {reservations.map(item => (
              <div className="cafe-list-row" key={item.name}>
                <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=90&q=80" alt="" />
                <div><strong>{item.name}</strong><span>{item.sub}</span><small><Icon name="calendar" size={12} /> {item.time}</small></div>
                <b className={item.status === 'Pending' ? 'pending' : ''}>{item.status}</b>
              </div>
            ))}
          </div>

          <div className="cafe-card cafe-delivery-card">
            <div className="cafe-card-head"><h3>Delivery Status</h3><Link href="/orders">View all</Link></div>
            {deliveryStatus.map(item => (
              <div className="cafe-status-row" key={item.name}>
                <span className={item.tone}><Icon name={item.icon} size={18} /></span>
                <div><strong>{item.name}</strong><small>{item.order}</small></div>
                <b className={item.tone}>{item.status}</b>
                <i />
              </div>
            ))}
          </div>

          <div className="cafe-card cafe-staff-card">
            <div className="cafe-card-head"><h3>Supplier Activity</h3><Link href="/suppliers">View all</Link></div>
            {['Nandini Dairy', 'Bloom Greens', 'Blue Tokai', 'Hearth Bakery'].map((name, i) => (
              <div className="cafe-staff-row" key={name}>
                <img src={`https://i.pravatar.cc/80?img=${i + 20}`} alt="" />
                <div><strong>{name}</strong><small>{i % 2 ? 'Weekly partner' : 'Daily partner'}</small></div>
                <span className={i === 2 ? 'break' : ''}>{i === 2 ? 'Due' : 'Active'}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}
