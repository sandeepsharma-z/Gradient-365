'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useCart } from '@/context/cart-context'

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
  stock_status?: 'in' | 'low' | 'out' | 'back'
  brand?: string
  dish?: string
  subcategory?: string
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
  { id: 101, name: 'Hazelnut Syrup 750ml', unit: 'bottle', price_per_unit: '850', min_order_quantity: 2, supplier_account_id: 'SUP-01', supplier_name: 'Monin India', category: 'Syrups', description: 'MRP visible to all cafes. Private deal available.', is_available: true, stock_status: 'in', brand: 'Monin' },
  { id: 102, name: 'Caramel Syrup 750ml', unit: 'bottle', price_per_unit: '720', min_order_quantity: 2, supplier_account_id: 'SUP-02', supplier_name: 'Torani Supply', category: 'Syrups', description: 'Cafe can order at MRP or request deal.', is_available: true, stock_status: 'in', brand: 'Torani' },
  { id: 103, name: 'Vanilla Syrup 750ml', unit: 'bottle', price_per_unit: '800', min_order_quantity: 2, supplier_account_id: 'SUP-01', supplier_name: 'Monin India', category: 'Syrups', description: 'Out of stock. Urgent supplier search suggested.', is_available: false, stock_status: 'out', brand: 'Monin' },
  { id: 104, name: 'Espresso Beans 1kg', unit: 'kg', price_per_unit: '1200', min_order_quantity: 2, supplier_account_id: 'SUP-03', supplier_name: 'Blue Tokai Roasters', category: 'Coffee', description: 'Premium beans for espresso bar.', is_available: true, stock_status: 'in', brand: 'Lavazza' },
  { id: 105, name: 'Robusta Powder 500g', unit: 'pack', price_per_unit: '480', min_order_quantity: 6, supplier_account_id: 'SUP-04', supplier_name: 'Bean Basket', category: 'Coffee', description: 'Low stock: 8 packs remaining.', is_available: true, stock_status: 'low', brand: 'Bru' },
  { id: 106, name: 'Full Cream Milk 1L', unit: 'litre', price_per_unit: '68', min_order_quantity: 20, supplier_account_id: 'SUP-05', supplier_name: 'Nandini Dairy Kitchen', category: 'Dairy', description: 'Fresh full cream milk for daily cafe prep.', is_available: true, stock_status: 'in', brand: 'Amul' },
  { id: 107, name: 'Fresh Cream 200ml', unit: 'pack', price_per_unit: '55', min_order_quantity: 12, supplier_account_id: 'SUP-05', supplier_name: 'Nandini Dairy Kitchen', category: 'Dairy', description: 'Back in stock on 24 May. Pre-order or set reminder.', is_available: true, stock_status: 'back', brand: 'Amul' },
  { id: 201, name: 'Frappe Base 1kg', unit: 'kg', price_per_unit: '940', min_order_quantity: 3, supplier_account_id: 'SUP-06', supplier_name: 'Caprimo Foods', category: 'Dish-wise', description: 'Cold Coffee > Frappe Base.', is_available: true, stock_status: 'in', brand: 'Caprimo', dish: 'Cold Coffee', subcategory: 'Frappe Base' },
  { id: 202, name: 'Frappe Mix 800g', unit: 'pack', price_per_unit: '760', min_order_quantity: 4, supplier_account_id: 'SUP-01', supplier_name: 'Monin India', category: 'Dish-wise', description: 'Cold Coffee > Frappe Base. Currently OOS.', is_available: false, stock_status: 'out', brand: 'Monin', dish: 'Cold Coffee', subcategory: 'Frappe Base' },
  { id: 203, name: 'Penne 500g', unit: 'pack', price_per_unit: '180', min_order_quantity: 10, supplier_account_id: 'SUP-07', supplier_name: 'Barilla Partner', category: 'Dish-wise', description: 'Pasta > Pasta Base.', is_available: true, stock_status: 'in', brand: 'Barilla', dish: 'Pasta', subcategory: 'Pasta Base' },
  { id: 204, name: 'Fusilli 500g', unit: 'pack', price_per_unit: '160', min_order_quantity: 10, supplier_account_id: 'SUP-08', supplier_name: 'Del Monte Partner', category: 'Dish-wise', description: 'Pasta > Pasta Base. Low stock.', is_available: true, stock_status: 'low', brand: 'Del Monte', dish: 'Pasta', subcategory: 'Pasta Base' },
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
  const { addItem, totalItems } = useCart()
  const [items, setItems] = useState<CatalogueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [catalogueType, setCatalogueType] = useState<'A' | 'B'>('A')
  const [notice, setNotice] = useState('')
  const [dealItem, setDealItem] = useState<CatalogueItem | null>(null)

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
  const typeItems = catalogueType === 'A' ? filteredItems.filter(item => item.category !== 'Dish-wise') : filteredItems.filter(item => item.category === 'Dish-wise')
  const availableCount = items.filter(item => item.is_available !== false).length
  const suppliersCount = useMemo(() => new Set(items.map(item => item.supplier_name)).size, [items])

  function addToCart(item: CatalogueItem) {
    if (item.is_available === false || item.stock_status === 'out') {
      setNotice(`${item.name} is out of stock. Use urgent search to find alternate suppliers.`)
      return
    }
    if (item.stock_status === 'back') {
      setNotice(`Pre-order reminder set for ${item.name}. Supplier restock ETA is 24 May.`)
      return
    }
    addItem({
      id: item.id,
      catalogue_item_id: item.id,
      name: item.name,
      unit: item.unit,
      price_per_unit: parseFloat(item.price_per_unit || '0'),
      supplier_account_id: item.supplier_account_id,
      supplier_name: item.supplier_name,
      quantity: item.min_order_quantity || 1,
    })
    setNotice(`${item.name} added to encrypted cart review.`)
  }

  function stockText(item: CatalogueItem) {
    if (item.stock_status === 'out' || item.is_available === false) return 'Out of Stock'
    if (item.stock_status === 'low') return 'Low Stock'
    if (item.stock_status === 'back') return 'Back Soon'
    return 'In Stock'
  }

  return (
    <main className="cafe-menu-page">
      <header className="cafe-menu-topbar">
        <div>
          <h1>Menu</h1>
          <p>Browse supplier catalogue Type A or Type B, view MRP, negotiate privately, and add available items to cart.</p>
        </div>
        <label className="cafe-menu-search">
          <Icon name="search" size={19} />
          <input value={query} onChange={event => handleQueryChange(event.target.value)} placeholder={`Search ${items.length} products...`} />
        </label>
        <Link className="cafe-menu-cart-link" href="/cart"><Icon name="cart" /> Cart {totalItems > 0 && <span>{totalItems}</span>}</Link>
      </header>

      <section className="cafe-menu-stats">
        <div className="cafe-card cafe-menu-stat"><span><Icon name="bag" /></span><div><p>Total Products</p><strong>{items.length}</strong><small>Across all categories</small></div></div>
        <div className="cafe-card cafe-menu-stat"><span><Icon name="leaf" /></span><div><p>Available</p><strong>{availableCount}</strong><small>Ready to order</small></div></div>
        <div className="cafe-card cafe-menu-stat"><span><Icon name="truck" /></span><div><p>Suppliers</p><strong>{suppliersCount}</strong><small>Active partners</small></div></div>
        <div className="cafe-card cafe-menu-stat"><span><Icon name="star" /></span><div><p>Categories</p><strong>{Math.max(categories.length - 1, 0)}</strong><small>Menu groups active</small></div></div>
      </section>

      <section className="cafe-card cafe-menu-board">
        <div className="cafe-menu-categories">
          <button className={catalogueType === 'A' ? 'active' : ''} onClick={() => setCatalogueType('A')}>Type A - Simple</button>
          <button className={catalogueType === 'B' ? 'active' : ''} onClick={() => setCatalogueType('B')}>Type B - Dish-wise</button>
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
          <span>{typeItems.length} items</span>
          <button onClick={() => setShowAddPanel(true)}><Icon name="plus" size={15} /> Add Menu Item</button>
        </div>

        {notice && <div className="cafe-flow-notice">{notice}</div>}

        {loading ? (
          <div className="cafe-menu-grid">
            {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        ) : typeItems.length === 0 ? (
          <div className="cafe-menu-empty">
            <Icon name="search" size={34} />
            <strong>No items found</strong>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="cafe-menu-grid">
            {typeItems.map((item, index) => (
              <article className={`cafe-menu-card${item.is_available === false || item.stock_status === 'out' ? ' is-oos' : ''}`} key={item.id}>
                <div className="cafe-menu-image">
                  <img src={imageFor(item, index)} alt="" />
                  <span>{catalogueType === 'B' ? item.dish || 'Dish-wise' : item.category || 'Menu'}</span>
                </div>
                <div className="cafe-menu-card-body">
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.brand ? `${item.brand} · ` : ''}{item.description || item.supplier_name}</p>
                  </div>
                  <div className="cafe-menu-meta">
                    <span>{item.supplier_name}</span>
                    <b>MRP {fmtPrice(item.price_per_unit)} / {item.unit}</b>
                  </div>
                  <div className="cafe-flow-badges">
                    <span className={item.stock_status === 'out' || item.is_available === false ? 'danger' : item.stock_status === 'low' ? 'warn' : 'ok'}>{stockText(item)}</span>
                    <button onClick={() => setDealItem(item)}>Negotiate</button>
                  </div>
                  <div className="cafe-menu-actions">
                    <small>Min order {item.min_order_quantity || 1} {item.unit}</small>
                    {item.stock_status === 'out' || item.is_available === false ? (
                      <Link href={`/urgent-search?q=${encodeURIComponent(item.name)}`}>Urgent Search</Link>
                    ) : item.stock_status === 'back' ? (
                      <button onClick={() => addToCart(item)}>Pre-order</button>
                    ) : (
                      <button onClick={() => addToCart(item)}>Add to Cart</button>
                    )}
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

      {dealItem && (
        <div className="cafe-menu-modal-backdrop" onClick={() => setDealItem(null)}>
          <div className="cafe-menu-add-panel" onClick={event => event.stopPropagation()}>
            <div className="cafe-menu-add-head">
              <div><span>Private negotiation</span><h2>Request Deal Price</h2></div>
              <button onClick={() => setDealItem(null)}>×</button>
            </div>
            <div className="cafe-menu-form-grid">
              <label>Item<input value={dealItem.name} readOnly /></label>
              <label>Visible MRP<input value={fmtPrice(dealItem.price_per_unit)} readOnly /></label>
              <label className="wide">Message<textarea defaultValue={`Requesting private cafe deal for ${dealItem.name}. Quantity: ${dealItem.min_order_quantity} ${dealItem.unit}.`} /></label>
            </div>
            <div className="cafe-menu-add-actions">
              <button onClick={() => setDealItem(null)}>Cancel</button>
              <button onClick={() => { setNotice(`Encrypted deal request sent to ${dealItem.supplier_name}.`); setDealItem(null) }}>Send Request</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
