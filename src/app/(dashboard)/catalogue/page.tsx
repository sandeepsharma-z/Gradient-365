'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'

interface CatalogueItem {
  id: number
  name: string
  unit: string
  price_per_unit: string
  min_order_quantity: number
  supplier_account_id: string
  supplier_name: string
  category: string
  description: string
  is_available: boolean
}

type IconName = 'search' | 'plus' | 'bag' | 'cart' | 'filter' | 'leaf' | 'star' | 'truck' | 'arrow'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    bag: <><path d="M6 8h12l-1 12H7z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
    cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H7" /></>,
    filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5z" /></>,
    leaf: <><path d="M5 19c9 0 14-6 14-14-8 0-14 5-14 14z" /><path d="M5 19c2-5 6-8 11-10" /></>,
    star: <><path d="m12 2 3 6.5 7 .8-5.2 4.7 1.4 7-6.2-3.6L5.8 21l1.4-7L2 9.3l7-.8z" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

let debounceTimer: ReturnType<typeof setTimeout>

const demoItems: CatalogueItem[] = [
  { id: 101, name: 'Saffron Latte Beans', unit: 'kg', price_per_unit: '1180', min_order_quantity: 2, supplier_account_id: 'SUP-01', supplier_name: 'Blue Tokai Roasters', category: 'Beverages', description: 'Premium roast for signature latte service.', is_available: true },
  { id: 102, name: 'Whole Milk', unit: 'litre', price_per_unit: '68', min_order_quantity: 20, supplier_account_id: 'SUP-02', supplier_name: 'Nandini Dairy Kitchen', category: 'Dairy', description: 'Fresh full cream milk for daily cafe prep.', is_available: true },
  { id: 103, name: 'Butter Croissant', unit: 'piece', price_per_unit: '42', min_order_quantity: 24, supplier_account_id: 'SUP-03', supplier_name: 'Hearth & Stone Bakery', category: 'Bakery', description: 'Flaky butter croissants for morning display.', is_available: true },
  { id: 104, name: 'Organic Basil', unit: 'bunch', price_per_unit: '95', min_order_quantity: 8, supplier_account_id: 'SUP-04', supplier_name: 'Bloom Fresh Greens', category: 'Produce', description: 'Aromatic basil for sandwiches and salads.', is_available: true },
  { id: 105, name: 'Blueberry Cheesecake', unit: 'slice', price_per_unit: '155', min_order_quantity: 12, supplier_account_id: 'SUP-05', supplier_name: 'Sweet Crumb Studio', category: 'Desserts', description: 'Rich cheesecake with blueberry topping.', is_available: false },
  { id: 106, name: 'Cold Brew Bottle', unit: 'bottle', price_per_unit: '140', min_order_quantity: 18, supplier_account_id: 'SUP-01', supplier_name: 'Blue Tokai Roasters', category: 'Beverages', description: 'Ready-to-serve cold brew concentrate.', is_available: true },
]

const menuImages = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=520&q=85',
  'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=520&q=85',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=520&q=85',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=520&q=85',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=520&q=85',
  'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=520&q=85',
]

function imageFor(item: CatalogueItem, index: number) {
  const text = `${item.category}-${item.name}`.toLowerCase()
  if (text.includes('milk') || text.includes('dairy')) return menuImages[1]
  if (text.includes('bread') || text.includes('croissant') || text.includes('bakery')) return menuImages[2]
  if (text.includes('green') || text.includes('basil') || text.includes('produce')) return menuImages[3]
  if (text.includes('cake') || text.includes('dessert')) return menuImages[4]
  if (text.includes('cold')) return menuImages[5]
  return menuImages[index % menuImages.length]
}

function fmtPrice(value: string) {
  const n = parseFloat(value)
  if (Number.isNaN(n)) return value
  return 'Rs ' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

function SkeletonCard() {
  return (
    <div className="cafe-menu-card cafe-menu-card-skeleton">
      <span />
      <i />
      <b />
      <em />
    </div>
  )
}

export default function CataloguePage() {
  const [items, setItems] = useState<CatalogueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [showAddPanel, setShowAddPanel] = useState(false)

  function loadBrowse() {
    setLoading(true)
    api.get<{ items: CatalogueItem[] } | { catalogue: CatalogueItem[] } | CatalogueItem[]>('/api/catalogue/browse')
      .then(data => {
        let raw: CatalogueItem[] = []
        if (Array.isArray(data)) raw = data
        else if ('items' in data && Array.isArray(data.items)) raw = data.items
        else if ('catalogue' in data && Array.isArray((data as { catalogue: CatalogueItem[] }).catalogue)) raw = (data as { catalogue: CatalogueItem[] }).catalogue
        if (!raw.length) raw = demoItems
        setItems(raw)
        setCategories(['All', ...Array.from(new Set(raw.map(i => i.category).filter(Boolean)))])
      })
      .catch(() => {
        setItems(demoItems)
        setCategories(['All', ...Array.from(new Set(demoItems.map(i => i.category)))])
      })
      .finally(() => setLoading(false))
  }

  function doSearch(q: string) {
    if (!q.trim()) {
      loadBrowse()
      return
    }
    setLoading(true)
    api.get<{ items: CatalogueItem[] } | CatalogueItem[]>(`/api/catalogue/search?q=${encodeURIComponent(q)}`)
      .then(data => {
        let raw: CatalogueItem[] = []
        if (Array.isArray(data)) raw = data
        else if ('items' in data && Array.isArray(data.items)) raw = data.items
        setItems(raw.length ? raw : demoItems.filter(item => item.name.toLowerCase().includes(q.toLowerCase()) || item.category.toLowerCase().includes(q.toLowerCase())))
      })
      .catch(() => setItems(demoItems.filter(item => item.name.toLowerCase().includes(q.toLowerCase()) || item.category.toLowerCase().includes(q.toLowerCase()))))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    api.get<{ categories: string[] } | string[]>('/api/catalogue/categories')
      .then(data => {
        const raw = Array.isArray(data) ? data : (data as { categories: string[] }).categories ?? []
        if (raw.length > 0) setCategories(['All', ...raw])
      })
      .catch(() => {})

    loadBrowse()
  }, [])

  const handleQueryChange = useCallback((val: string) => {
    setQuery(val)
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => doSearch(val), 300)
  }, [])

  const filteredItems = selectedCategory === 'All' ? items : items.filter(i => i.category === selectedCategory)
  const availableCount = items.filter(item => item.is_available !== false).length
  const suppliersCount = useMemo(() => new Set(items.map(item => item.supplier_name)).size, [items])

  return (
    <main className="cafe-menu-page">
      <header className="cafe-menu-topbar">
        <div>
          <h1>Menu</h1>
          <p>Browse cafe inventory, supplier catalogue, and quick-add items.</p>
        </div>
        <label className="cafe-menu-search">
          <Icon name="search" size={19} />
          <input value={query} onChange={event => handleQueryChange(event.target.value)} placeholder={`Search ${items.length} products...`} />
        </label>
        <button className="cafe-menu-cart-link" onClick={() => setShowAddPanel(true)}><Icon name="plus" /> Add Item</button>
      </header>

      <section className="cafe-menu-stats">
        <div className="cafe-card cafe-menu-stat"><span><Icon name="bag" /></span><div><p>Total Products</p><strong>{items.length}</strong><small>Across all categories</small></div></div>
        <div className="cafe-card cafe-menu-stat"><span><Icon name="leaf" /></span><div><p>Available</p><strong>{availableCount}</strong><small>Ready to order</small></div></div>
        <div className="cafe-card cafe-menu-stat"><span><Icon name="truck" /></span><div><p>Suppliers</p><strong>{suppliersCount}</strong><small>Active partners</small></div></div>
        <div className="cafe-card cafe-menu-stat"><span><Icon name="star" /></span><div><p>Categories</p><strong>{Math.max(categories.length - 1, 0)}</strong><small>Menu groups active</small></div></div>
      </section>

      <section className="cafe-card cafe-menu-board">
        <div className="cafe-menu-categories">
          {categories.map(category => (
            <button key={category} className={selectedCategory === category ? 'active' : ''} onClick={() => setSelectedCategory(category)}>
              {category}
            </button>
          ))}
        </div>

        <div className="cafe-menu-toolbar">
          <label><Icon name="search" size={16} /><input value={query} onChange={event => handleQueryChange(event.target.value)} placeholder="Search item, category, supplier..." /></label>
          <button><Icon name="filter" size={15} /> Filter</button>
          <button><Icon name="star" size={15} /> Recommended</button>
          <div />
          <span>{filteredItems.length} items</span>
          <button onClick={() => setShowAddPanel(true)}><Icon name="plus" size={15} /> Add Menu Item</button>
        </div>

        {loading ? (
          <div className="cafe-menu-grid">
            {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="cafe-menu-empty">
            <Icon name="search" size={34} />
            <strong>No items found</strong>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="cafe-menu-grid">
            {filteredItems.map((item, index) => (
              <article className="cafe-menu-card" key={item.id}>
                <div className="cafe-menu-image">
                  <img src={imageFor(item, index)} alt="" />
                  <span>{item.category || 'Menu'}</span>
                </div>
                <div className="cafe-menu-card-body">
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description || item.supplier_name}</p>
                  </div>
                  <div className="cafe-menu-meta">
                    <span>{item.supplier_name}</span>
                    <b>{fmtPrice(item.price_per_unit)} / {item.unit}</b>
                  </div>
                  <div className="cafe-menu-actions">
                    <small>Min order {item.min_order_quantity || 1} {item.unit}</small>
                    <button onClick={() => setShowAddPanel(true)}>Edit Item</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {showAddPanel && (
        <div className="cafe-menu-modal-backdrop" onClick={() => setShowAddPanel(false)}>
          <div className="cafe-menu-add-panel" onClick={event => event.stopPropagation()}>
            <div className="cafe-menu-add-head">
              <div>
                <span>Menu setup</span>
                <h2>Add Menu Item</h2>
              </div>
              <button onClick={() => setShowAddPanel(false)}>×</button>
            </div>

            <div className="cafe-menu-form-grid">
              <label>
                Item name
                <input placeholder="e.g. Spanish Latte" />
              </label>
              <label>
                Category
                <select defaultValue="">
                  <option value="" disabled>Select category</option>
                  {categories.filter(cat => cat !== 'All').map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </label>
              <label>
                Price
                <input placeholder="Rs 240" />
              </label>
              <label>
                Unit
                <input placeholder="cup / plate / kg" />
              </label>
              <label className="wide">
                Description
                <textarea placeholder="Short item description..." />
              </label>
            </div>

            <div className="cafe-menu-add-actions">
              <button onClick={() => setShowAddPanel(false)}>Cancel</button>
              <button>Save Item</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
