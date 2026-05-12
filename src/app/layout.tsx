import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/cart-context'

export const metadata: Metadata = {
  title: 'Gradient 365 - Cafe Portal',
  description: 'B2B cafe ordering platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
