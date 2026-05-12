'use client'

type IconName = 'search' | 'download' | 'chart' | 'receipt' | 'check' | 'warn' | 'calendar'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5M12 15V3" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 4-4 3 3 5-7" /></>,
    receipt: <><path d="M6 2h12v20l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    check: <><path d="M20 6 9 17l-5-5" /></>,
    warn: <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.8 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const CATEGORY_SPEND = [
  ['Beverages', '45%', 'Rs 56,060'],
  ['Food', '30%', 'Rs 37,240'],
  ['Desserts', '15%', 'Rs 18,660'],
  ['Add-ons', '10%', 'Rs 12,620'],
]

const SUPPLIERS = [
  ['Nandini Dairy Kitchen', '18', '98.2%', 'Rs 1,84,220'],
  ['Blue Tokai Roasters', '7', '94.1%', 'Rs 96,500'],
  ['Hearth & Stone Bakery', '14', '91.0%', 'Rs 41,960'],
  ['Bloom Fresh Greens', '9', '89.4%', 'Rs 32,180'],
]

export default function ReportsPage() {
  return (
    <main className="cafe-ops-page">
      <header className="cafe-ops-topbar">
        <div><h1>Reports</h1><p>Spend trends, supplier performance, revenue signals, and export-ready reports.</p></div>
        <label><Icon name="search" size={19} /><input placeholder="Search report, supplier, category..." /></label>
        <button><Icon name="calendar" /> Last 30 Days</button>
        <button><Icon name="download" /> Export</button>
      </header>

      <section className="cafe-ops-stats">
        <div className="cafe-card cafe-ops-stat"><span><Icon name="chart" /></span><div><p>Monthly Spend</p><strong>Rs 4.82L</strong><small>+8.4% vs last month</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="receipt" /></span><div><p>Avg Order Value</p><strong>Rs 12,680</strong><small>Basket discipline</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="check" /></span><div><p>Fulfilment</p><strong>96.4%</strong><small>Last 30 days</small></div></div>
        <div className="cafe-card cafe-ops-stat"><span><Icon name="warn" /></span><div><p>Exceptions</p><strong>14</strong><small>3 critical</small></div></div>
      </section>

      <section className="cafe-ops-grid reports">
        <div className="cafe-card cafe-ops-chart-card">
          <div className="cafe-ops-section-head"><h2>Revenue Overview</h2><button>This Week</button></div>
          <strong>Rs 1,24,580 <small>+ 12.5% vs last week</small></strong>
          <div className="cafe-ops-area-chart"><span /><i /><b /></div>
          <div className="cafe-ops-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
        </div>

        <div className="cafe-card cafe-ops-chart-card">
          <div className="cafe-ops-section-head"><h2>Sales by Category</h2><button>This Week</button></div>
          <div className="cafe-ops-donut-wrap">
            <div className="cafe-ops-donut"><span>Rs 1,24,580<small>Total Sales</small></span></div>
            <div className="cafe-ops-legend">{CATEGORY_SPEND.map(([name, pct, value]) => <p key={name}><i />{name}<b>{pct}</b><strong>{value}</strong></p>)}</div>
          </div>
        </div>

        <div className="cafe-card cafe-ops-board">
          <div className="cafe-ops-section-head"><h2>Supplier Scorecard</h2><button>CSV</button></div>
          <div className="cafe-ops-table-wrap">
            <table className="cafe-ops-table">
              <thead><tr><th>Supplier</th><th>Orders</th><th>On-time</th><th>Spend</th></tr></thead>
              <tbody>{SUPPLIERS.map(row => <tr key={row[0]}><td><strong>{row[0]}</strong></td><td>{row[1]}</td><td><span className="status ok"><span className="dot" />{row[2]}</span></td><td><b>{row[3]}</b></td></tr>)}</tbody>
            </table>
          </div>
        </div>

        <aside className="cafe-card cafe-ops-panel">
          <div className="cafe-ops-panel-image"><img src="/images/cafe-reports.jpg" alt="" /></div>
          <h2>Signals</h2>
          <p>Coffee spend is climbing faster than sales. Lock next month pricing before the seasonal quote revision.</p>
          {['Best supplier: Nandini 98.2%', 'Potential saving: Rs 18.4K', 'HSR packaging drain +31%'].map(item => <div className="cafe-ops-mini" key={item}><Icon name="chart" size={15} /><span>{item}</span></div>)}
        </aside>
      </section>
    </main>
  )
}
