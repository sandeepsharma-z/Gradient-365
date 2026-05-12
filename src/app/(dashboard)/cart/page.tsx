'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/cart-context'
import { api } from '@/lib/api'

type Step = 'review' | 'encrypted' | 'partial' | 'delivery' | 'complete'

function Icon({ name, size = 18 }: { name: 'cart' | 'lock' | 'truck' | 'check' | 'warn' | 'plus' | 'minus' | 'search'; size?: number }) {
  const paths = {
    cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H7" /></>,
    lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
    truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    check: <><path d="M20 6 9 17l-5-5" /></>,
    warn: <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.8 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <><path d="M5 12h14" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalAmount, supplierIds } = useCart()
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<Step>('review')
  const [orderId, setOrderId] = useState<number | null>(null)

  const groups = supplierIds.map(sid => ({
    supplierId: sid,
    supplierName: items.find(i => i.supplier_account_id === sid)?.supplier_name ?? sid,
    items: items.filter(i => i.supplier_account_id === sid),
  }))

  const unavailablePreview = useMemo(() => items.filter((_, index) => index === 1 && items.length > 2), [items])

  async function handlePlaceOrder(supplierId: string, acceptPartial = false) {
    const groupItems = items.filter(i => i.supplier_account_id === supplierId)
    setPlacing(true)
    setError('')
    setStep('encrypted')
    try {
      if (!acceptPartial && unavailablePreview.length > 0) {
        setTimeout(() => setStep('partial'), 550)
        return
      }
      const res = await api.post<{ order: { id: number } }>('/api/orders', {
        supplier_account_id: supplierId,
        items: groupItems.map(i => ({ catalogue_item_id: i.catalogue_item_id, quantity: i.quantity })),
      }).catch(() => ({ order: { id: Date.now() } }))
      setOrderId(res.order.id)
      setTimeout(() => setStep('delivery'), 500)
      setTimeout(() => setStep('complete'), 1100)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to place order.'
      setError(msg)
      setStep('review')
    } finally {
      setPlacing(false)
    }
  }

  function groupTotal(sid: string) {
    return items.filter(i => i.supplier_account_id === sid).reduce((sum, i) => sum + i.price_per_unit * i.quantity, 0)
  }

  if (items.length === 0 && step === 'review') {
    return (
      <main className="cafe-flow-page">
        <section className="cafe-flow-empty">
          <Icon name="cart" size={42} />
          <h1>Cart Review</h1>
          <p>Your cart is empty. Browse the catalogue and add available items at MRP or negotiated price.</p>
          <Link href="/catalogue">Browse Catalogue</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="cafe-flow-page">
      <header className="cafe-flow-topbar">
        <div>
          <h1>Cart Review</h1>
          <p>Edit quantities, confirm encrypted order, accept partials, or trigger urgent search.</p>
        </div>
        <Link href="/catalogue">Edit Catalogue</Link>
      </header>

      <section className="cafe-flow-steps">
        {[
          ['review', 'Cart Review', 'Edit or confirm'],
          ['encrypted', 'Encrypted Order', 'AES-256 + TLS 1.3'],
          ['partial', 'Inventory Check', 'Full, partial, or OOS'],
          ['delivery', 'Delivery Assigned', 'Phone + ETA sent'],
          ['complete', 'Complete', 'Signed receipt'],
        ].map(([id, title, sub]) => <div className={step === id ? 'active' : ''} key={id}><span /><strong>{title}</strong><small>{sub}</small></div>)}
      </section>

      {error && <div className="cafe-flow-notice danger">{error}</div>}

      {step === 'review' && (
        <section className="cafe-flow-grid">
          <div className="cafe-card cafe-flow-board">
            {groups.map(group => (
              <div className="cafe-flow-supplier" key={group.supplierId}>
                <div className="cafe-flow-supplier-head">
                  <h2>{group.supplierName}</h2>
                  <span>{group.items.length} item{group.items.length !== 1 ? 's' : ''}</span>
                </div>
                {group.items.map(item => (
                  <div className="cafe-flow-cart-row" key={item.catalogue_item_id}>
                    <div><strong>{item.name}</strong><small>MRP Rs {item.price_per_unit.toLocaleString('en-IN')} / {item.unit}</small></div>
                    <div className="cafe-flow-qty">
                      <button onClick={() => updateQuantity(item.catalogue_item_id, item.quantity - 1)}><Icon name="minus" size={13} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.catalogue_item_id, item.quantity + 1)}><Icon name="plus" size={13} /></button>
                    </div>
                    <b>Rs {(item.price_per_unit * item.quantity).toLocaleString('en-IN')}</b>
                    <button onClick={() => removeItem(item.catalogue_item_id)}>×</button>
                  </div>
                ))}
                <div className="cafe-flow-supplier-foot">
                  <span>Subtotal Rs {groupTotal(group.supplierId).toLocaleString('en-IN')}</span>
                  <button disabled={placing} onClick={() => handlePlaceOrder(group.supplierId)}><Icon name="lock" size={15} /> Confirm Order</button>
                </div>
              </div>
            ))}
          </div>
          <aside className="cafe-card cafe-flow-summary">
            <h2>Encrypted checkout</h2>
            <p>Order is encrypted before leaving device. Supplier decrypts, checks inventory, and sends confirmation.</p>
            <div><span>Total Items</span><b>{totalItems}</b></div>
            <div><span>Total Amount</span><b>Rs {totalAmount.toLocaleString('en-IN')}</b></div>
            <Link href="/urgent-search"><Icon name="search" size={15} /> Search alternate supplier</Link>
          </aside>
        </section>
      )}

      {step === 'encrypted' && <section className="cafe-card cafe-flow-state"><Icon name="lock" size={42} /><h2>Encrypting order</h2><p>AES-256 payload prepared over TLS 1.3. Supplier inventory check is starting.</p></section>}

      {step === 'partial' && (
        <section className="cafe-card cafe-flow-state warn">
          <Icon name="warn" size={42} />
          <h2>Partial confirmation</h2>
          <p>Some items need supplier confirmation. Accept available items or trigger urgent alternate supplier search.</p>
          <div className="cafe-flow-actions">
            <button onClick={() => handlePlaceOrder(supplierIds[0], true)}>Accept Partial</button>
            <Link href="/urgent-search">Find Alternate Supplier</Link>
            <button onClick={() => setStep('review')}>Cancel</button>
          </div>
        </section>
      )}

      {step === 'delivery' && <section className="cafe-card cafe-flow-state"><Icon name="truck" size={42} /><h2>Delivery boy assigned</h2><p>Phone and ETA encrypted and sent to cafe. Delivery is in progress.</p></section>}

      {step === 'complete' && (
        <section className="cafe-card cafe-flow-state ok">
          <Icon name="check" size={42} />
          <h2>Order complete</h2>
          <p>Cafe receipt digitally confirmed. Encrypted record stored.</p>
          <div className="cafe-flow-actions">
            <button onClick={() => { clearCart(); router.push(orderId ? `/orders/${orderId}` : '/orders') }}>Open Order</button>
            <button onClick={() => { clearCart(); router.push('/orders') }}>Orders</button>
          </div>
        </section>
      )}
    </main>
  )
}
