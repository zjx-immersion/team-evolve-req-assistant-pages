import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Team AI Requirements Assistant',
  description: 'Created with zjx',
  generator: 'TW.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
