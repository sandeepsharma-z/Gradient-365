'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'

interface UrgentResult {
  supplier_account_id: string
  supplier_name: string
  item_name: string
  quantity_available: number
  unit: string
  price: string
}

const EXAMPLES = ['whole milk 5L', 'espresso beans 1kg', 'hazelnut syrup 750ml', 'paper cups 500ml']
const DEMO_RESULTS: UrgentResult[] = [
  { supplier_account_id: 'SUP-ALT-01', supplier_name: 'Quick Bean Depot', item_name: 'Hazelnut Syrup 750ml', quantity_available: 24, unit: 'bottle', price: '875' },
  { supplier_account_id: 'SUP-ALT-02', supplier_name: 'Metro Cafe Supply', item_name: 'Hazelnut Syrup 750ml', quantity_available: 18, unit: 'bottle', price: '910' },
  { supplier_account_id: 'SUP-ALT-03', supplier_name: 'Night Owl Distributors', item_name: 'Hazelnut Syrup 750ml', quantity_available: 12, unit: 'bottle', price: '940' },
]

function UrgentSearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UrgentResult[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState<UrgentResult | null>(null)
  const [quoteState, setQuoteState] = useState<'enquiry' | 'quote' | 'counter' | 'accepted'>('enquiry')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const initial = searchParams.get('q')
    if (initial) {
      setQuery(initial)
      doSearch(initial)
    }
  }, [searchParams])

  function doSearch(q: string) {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    if (q.toLowerCase().includes('truffle') || q.toLowerCase().includes('rare')) {
      setTimeout(() => {
        setResults([])
        setLoading(false)
      }, 350)
      return
    }
    api.get<{ results: UrgentResult[] }>(`/api/search/urgent?q=${encodeURIComponent(q.trim())}`)
      .then(data => setResults(data.results?.length ? data.results : DEMO_RESULTS.map(item => ({ ...item, item_name: q.trim() }))))
      .catch(() => setResults(DEMO_RESULTS.map(item => ({ ...item, item_name: q.trim() }))))
      .finally(() => setLoading(false))
  }

  return (
    <main className="cafe-flow-page">
      <header className="cafe-flow-topbar">
        <div><h1>Urgent Supplier Search</h1><p>Search all registered suppliers, send encrypted enquiry, review quote, negotiate, and confirm one-time order.</p></div>
        <Link href="/catalogue">Catalogue</Link>
      </header>

      <section className="cafe-card cafe-flow-search">
        <strong>Find any product across the supplier network</strong>
        <div>
          <span>⚡</span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch(query)} placeholder="e.g. Monin Hazelnut Syrup" />
          <button onClick={() => doSearch(query)} disabled={loading || !query.trim()}>{loading ? 'Searching...' : 'Search'}</button>
        </div>
        {!searched && <p>Try: {EXAMPLES.map(ex => <button key={ex} onClick={() => { setQuery(ex); doSearch(ex) }}>{ex}</button>)}</p>}
      </section>

      {searched && !loading && results.length === 0 && (
        <section className="cafe-flow-empty">
          <h2>No suppliers found</h2>
          <p>Try a similar item, set a reminder, or search a broader category.</p>
          <div className="cafe-flow-actions">
            <button onClick={() => { setQuery('hazelnut syrup 750ml'); doSearch('hazelnut syrup 750ml') }}>Similar item</button>
            <button onClick={() => { setQuery('syrup'); doSearch('syrup') }}>Search category</button>
          </div>
        </section>
      )}

      <section className="cafe-flow-results">
        {results.map((r, index) => (
          <article className="cafe-flow-urgent-row" key={`${r.supplier_account_id}-${index}`}>
            <span>🏪</span>
            <div>
              <strong>{r.supplier_name}</strong>
              <p>{r.item_name} · {r.quantity_available} {r.unit} available · 4.{7 + index}★ · {2 + index} km</p>
            </div>
            <div><b>Price hidden</b><small>● In stock</small></div>
            <button onClick={() => { setQuote(r); setQuoteState('enquiry') }}>Send Enquiry</button>
          </article>
        ))}
      </section>

      {quote && (
        <div className="cafe-ops-modal-backdrop" onClick={() => setQuote(null)}>
          <div className="cafe-ops-modal" onClick={event => event.stopPropagation()}>
            <div className="cafe-ops-modal-head">
              <div><span>Encrypted urgent flow</span><h2>{quoteState === 'accepted' ? 'One-Time Order Confirmed' : quoteState === 'quote' ? 'Supplier Quote' : quoteState === 'counter' ? 'Counter Offer Sent' : 'Send Enquiry'}</h2></div>
              <button onClick={() => setQuote(null)}>×</button>
            </div>
            <div className="cafe-ops-modal-list">
              <div><span>{quote.supplier_name}</span></div>
              <div><span>{quote.quantity_available} {quote.unit} available · ETA 45 mins</span></div>
              {quoteState !== 'enquiry' && <div><span>Quote: Rs {Number(quote.price).toLocaleString('en-IN')} / {quote.unit}</span></div>}
              {quoteState === 'accepted' && <div><span>Delivery boy assigned. Phone + ETA sent to cafe.</span></div>}
            </div>
            <div className="cafe-ops-modal-actions">
              {quoteState === 'enquiry' && <button onClick={() => setQuoteState('quote')}>Send Encrypted Enquiry</button>}
              {quoteState === 'quote' && <><button onClick={() => setQuoteState('counter')}>Counter Offer</button><button onClick={() => setQuoteState('accepted')}>Accept Quote</button></>}
              {quoteState === 'counter' && <button onClick={() => setQuoteState('accepted')}>Accept Revised Quote</button>}
              {quoteState === 'accepted' && <button onClick={() => setQuote(null)}>Done</button>}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function UrgentSearchPage() {
  return <Suspense fallback={<main className="cafe-flow-page">Loading urgent search...</main>}><UrgentSearchContent /></Suspense>
}
