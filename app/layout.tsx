import './output.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CephlieCo Browser OS',
  description: '.,,.,...,..,.,,,.,...,'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden bg-[url('/staticy.jpg')] bg-cover bg-center">
        {children}
      </body>
    </html>
  )
}
