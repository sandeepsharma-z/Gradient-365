import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected paths — anything under /(dashboard) is protected
const PROTECTED = ['/dashboard', '/orders', '/catalogue', '/stock', '/billing', '/preorders', '/brand-orders', '/consumption', '/supplier-orders', '/supply-chain', '/trials', '/intelligence', '/ads', '/enquiries', '/profile', '/settings']

export function middleware(request: NextRequest) {
  // In local dev the cafe portal hits the production Railway API (cross-origin),
  // so the httpOnly cookie is never written to localhost. Skip server-side guard;
  // each page does its own client-side auth check.
  if (process.env.NODE_ENV === 'development') return NextResponse.next()

  const { pathname } = request.nextUrl
  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get('gradient365_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|register).*)'],
}
